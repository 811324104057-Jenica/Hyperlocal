
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmailOtpVerification.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

function EmailOtpVerification({ email, onVerified }) {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const trimmedEmail = email.trim();

    // Reset verification whenever the email address changes.
    useEffect(() => {
        setOtp("");
        setMessage("");
        setError("");
        setVerified(false);
        setCooldown(0);
        onVerified(false);
    }, [trimmedEmail, onVerified]);

    // Countdown for resending OTP.
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = window.setTimeout(() => {
            setCooldown((previous) => Math.max(0, previous - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [cooldown]);

    const getErrorMessage = (err, fallback) => {
        const data = err.response?.data;

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (typeof data?.message === "string") {
            return data.message;
        }

        return err.message || fallback;
    };

    // Send OTP to the entered email.
    const handleSendOtp = async () => {
        setError("");
        setMessage("");

        if (!trimmedEmail) {
            setError("Please enter your email address first.");
            return;
        }

        if (cooldown > 0 || sending || verifying) return;

        try {
            setSending(true);

            const response = await axios.post(
                `${API_URL}/api/otp/send`,
                { email: trimmedEmail }
            );

            const data = response.data;
            setMessage(
                typeof data === "string"
                    ? data
                    : data?.message || "OTP sent successfully to your email."
            );

            setOtp("");
            setVerified(false);
            onVerified(false);
            setCooldown(60);
        } catch (err) {
            console.error("Send OTP error:", err);
            setError(
                getErrorMessage(err, "Unable to send OTP. Please try again.")
            );
        } finally {
            setSending(false);
        }
    };

    // Verify the six-digit OTP.
    const handleVerifyOtp = async () => {
        setError("");
        setMessage("");

        if (!trimmedEmail) {
            setError("Please enter your email address first.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }

        try {
            setVerifying(true);

            const response = await axios.post(
                `${API_URL}/api/otp/verify`,
                {
                    email: trimmedEmail,
                    otp
                }
            );

            const data = response.data;

            // A successful HTTP response is treated as verification success.
            // The backend must return an error status for an invalid OTP.
            setVerified(true);
            onVerified(true);

            setMessage(
                typeof data === "string"
                    ? data
                    : data?.message || "Email verified successfully."
            );
            setOtp("");
        } catch (err) {
            console.error("Verify OTP error:", err);
            setVerified(false);
            onVerified(false);
            setError(getErrorMessage(err, "Invalid or expired OTP."));
        } finally {
            setVerifying(false);
        }
    };

    const handleOtpChange = (event) => {
        const value = event.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
        setError("");
    };

    return (
        <section className="email-otp-verification" aria-label="Email OTP verification">
            <div className="otp-header">
                <div className="otp-heading-text">
                    <strong>Verify your email</strong>
                    <span>
                        We’ll send a 6-digit verification code to your email.
                    </span>
                </div>

                {verified && (
                    <span className="otp-verified-badge">
                        <span aria-hidden="true">✓</span> Verified
                    </span>
                )}
            </div>

            <div className="otp-email-preview">
                <span aria-hidden="true">✉</span>
                <span>{trimmedEmail || "Enter your email above"}</span>
            </div>

            <button
                type="button"
                className="otp-send-button"
                onClick={handleSendOtp}
                disabled={
                    !trimmedEmail ||
                    sending ||
                    verifying ||
                    cooldown > 0 ||
                    verified
                }
            >
                {sending
                    ? "Sending OTP..."
                    : verified
                    ? "Email Verified"
                    : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Send OTP"}
            </button>

            {!verified && (
                <div className="otp-input-section">
                    <label className="otp-input-label" htmlFor="customer-email-otp">
                        Enter verification code
                    </label>

                    <input
                        id="customer-email-otp"
                        className="otp-code-input"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="• • • • • •"
                        disabled={sending || verifying}
                        aria-label="Six-digit email verification code"
                    />

                    <button
                        type="button"
                        className="otp-verify-button"
                        onClick={handleVerifyOtp}
                        disabled={
                            verifying ||
                            sending ||
                            otp.length !== 6 ||
                            !trimmedEmail
                        }
                    >
                        {verifying ? "Verifying..." : "Verify Email"}
                    </button>
                </div>
            )}

            {message && (
                <div className="otp-success-message" role="status">
                    <span aria-hidden="true">✓</span>
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="otp-error-message" role="alert">
                    <span aria-hidden="true">!</span>
                    <span>{error}</span>
                </div>
            )}

            {verified && (
                <p className="otp-next-step">
                    Your email has been verified. You can continue registration.
                </p>
            )}
        </section>
    );
}

export default EmailOtpVerification;