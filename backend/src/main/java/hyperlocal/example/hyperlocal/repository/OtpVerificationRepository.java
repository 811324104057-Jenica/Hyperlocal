package hyperlocal.example.hyperlocal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hyperlocal.example.hyperlocal.model.OtpVerification;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification>
    findTopByEmailAndPurposeAndVerifiedFalseAndInvalidatedFalseOrderByCreatedAtDesc(
            String email,
            String purpose
    );

    Optional<OtpVerification>
    findTopByEmailAndPurposeAndVerifiedTrueOrderByCreatedAtDesc(
            String email,
            String purpose
    );
}