package hyperlocal.example.hyperlocal.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hyperlocal.example.hyperlocal.model.OtpVerification;
import hyperlocal.example.hyperlocal.repository.OtpVerificationRepository;

@Service
public class OtpService {

    private static final String REGISTRATION = "REGISTRATION";

    // OTP remains valid for 5 minutes
    private static final int OTP_EXPIRY_MINUTES = 5;

    // User must wait 60 seconds before requesting another OTP
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final OtpVerificationRepository otpRepository;
    private final JavaMailSender mailSender;

    // Secure OTP generation
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(
            OtpVerificationRepository otpRepository,
            JavaMailSender mailSender) {

        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
    }

    /**
     * Send a new registration OTP.
     */
    @Transactional
    public void sendRegistrationOtp(String email) {

        email = normalizeEmail(email);
        validateEmail(email);

        LocalDateTime now = LocalDateTime.now();

        /*
         * Find the latest active OTP.
         */
        OtpVerification previousOtp =
                otpRepository
                        .findTopByEmailAndPurposeAndVerifiedFalseAndInvalidatedFalseOrderByCreatedAtDesc(
                                email,
                                REGISTRATION)
                        .orElse(null);

        /*
         * Prevent rapid OTP requests.
         */
        if (previousOtp != null) {

            long secondsSinceLastOtp =
                    Duration.between(
                            previousOtp.getCreatedAt(),
                            now
                    ).getSeconds();

            if (secondsSinceLastOtp < RESEND_COOLDOWN_SECONDS) {

                long remainingSeconds =
                        RESEND_COOLDOWN_SECONDS -
                        secondsSinceLastOtp;

                throw new RuntimeException(
                        "Please wait " +
                        remainingSeconds +
                        " seconds before requesting another OTP."
                );
            }

            /*
             * Invalidate previous OTP.
             */
            previousOtp.setInvalidated(true);
            otpRepository.save(previousOtp);
        }

        /*
         * Generate a new 6-digit OTP.
         */
        String otp = generateOtp();

        /*
         * Create OTP database record.
         */
        OtpVerification verification =
                new OtpVerification();

        verification.setEmail(email);
        verification.setOtpHash(hashOtp(otp));
        verification.setCreatedAt(now);

        /*
         * OTP expires exactly 5 minutes after creation.
         */
        verification.setExpiresAt(
                now.plusMinutes(OTP_EXPIRY_MINUTES)
        );

        verification.setVerified(false);
        verification.setInvalidated(false);
        verification.setPurpose(REGISTRATION);

        /*
         * Save OTP in MySQL.
         */
        otpRepository.save(verification);

        /*
         * Send OTP to user's email.
         */
        try {

            sendEmail(email, otp);

        } catch (Exception e) {

            /*
             * Email failed.
             * Invalidate the OTP because the user never received it.
             */
            verification.setInvalidated(true);
            otpRepository.save(verification);

            /*
             * Print the real Gmail/SMTP error in backend terminal.
             */
            System.err.println(
                    "=========================================="
            );

            System.err.println(
                    "OTP EMAIL SENDING FAILED"
            );

            System.err.println(
                    "Email provider error: " +
                    e.getMessage()
            );

            System.err.println(
                    "=========================================="
            );

            throw new RuntimeException(
                    "Unable to send OTP email. " +
                    "Check the backend terminal for the SMTP error.",
                    e
            );
        }
    }

    /**
     * Verify the OTP entered by the user.
     */
    @Transactional
    public boolean verifyRegistrationOtp(
            String email,
            String otp) {

        email = normalizeEmail(email);
        validateEmail(email);

        /*
         * OTP must contain exactly 6 digits.
         */
        if (otp == null || !otp.matches("\\d{6}")) {

            throw new RuntimeException(
                    "OTP must contain exactly 6 digits."
            );
        }

        /*
         * Find latest active OTP.
         */
        OtpVerification verification =
                otpRepository
                        .findTopByEmailAndPurposeAndVerifiedFalseAndInvalidatedFalseOrderByCreatedAtDesc(
                                email,
                                REGISTRATION)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No active OTP found. Please request a new OTP."
                                )
                        );

        /*
         * Check whether OTP has expired.
         */
        if (verification
                .getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            verification.setInvalidated(true);
            otpRepository.save(verification);

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        /*
         * Hash the OTP entered by the user.
         */
        String enteredOtpHash =
                hashOtp(otp);

        /*
         * Compare hashes.
         */
        if (!enteredOtpHash.equals(
                verification.getOtpHash())) {

            throw new RuntimeException(
                    "Invalid OTP. Please check your email and try again."
            );
        }

        /*
         * OTP is correct.
         * Mark it as verified.
         */
        verification.setVerified(true);

        otpRepository.save(verification);

        return true;
    }

    /**
     * Check whether the user's email has
     * a valid verified registration OTP.
     */
    public boolean isEmailVerified(String email) {

        email = normalizeEmail(email);

        return otpRepository
                .findTopByEmailAndPurposeAndVerifiedTrueOrderByCreatedAtDesc(
                        email,
                        REGISTRATION
                )
                .map(verification -> {

                    /*
                     * Verified OTP must still be inside
                     * the 5-minute validity period.
                     */
                    if (verification
                            .getExpiresAt()
                            .isBefore(LocalDateTime.now())) {

                        return false;
                    }

                    return !verification.isInvalidated();

                })
                .orElse(false);
    }

    /**
     * Generate a secure 6-digit OTP.
     */
    private String generateOtp() {

        int number =
                secureRandom.nextInt(1_000_000);

        return String.format(
                "%06d",
                number
        );
    }

    /**
     * Send OTP through Gmail SMTP.
     */
    private void sendEmail(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "HyperLocal - Email Verification OTP"
        );

        message.setText(
                "Hello,\n\n" +

                "Your HyperLocal email verification OTP is:\n\n" +

                otp +

                "\n\n" +

                "This OTP is valid for 5 minutes." +

                "\n\n" +

                "For your security, do not share this OTP with anyone." +

                "\n\n" +

                "If you did not request this OTP, please ignore this email." +

                "\n\n" +

                "Regards,\n" +

                "HyperLocal Services Marketplace"
        );

        mailSender.send(message);
    }

    /**
     * SHA-256 hash of OTP.
     */
    private String hashOtp(String otp) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            otp.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            StringBuilder hexString =
                    new StringBuilder();

            for (byte b : hash) {

                String hex =
                        Integer.toHexString(
                                0xff & b
                        );

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {

            throw new RuntimeException(
                    "Unable to secure OTP.",
                    e
            );
        }
    }

    /**
     * Normalize email.
     */
    private String normalizeEmail(String email) {

        if (email == null) {
            return "";
        }

        return email
                .trim()
                .toLowerCase();
    }

    /**
     * Validate email.
     */
    private void validateEmail(String email) {

        if (email.isBlank()) {

            throw new RuntimeException(
                    "Email address is required."
            );
        }

        if (!email.matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {

            throw new RuntimeException(
                    "Please enter a valid email address."
            );
        }
    }
}