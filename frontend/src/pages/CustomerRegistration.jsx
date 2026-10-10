
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmailOtpVerification from "../components/EmailOtpVerification";
import "./ProviderRegistration.css";

function CustomerRegistration() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
    };

    const getCustomerLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(
                    new Error(
                        "Location services are not supported by this browser."
                    )
                );
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (locationError) => {
                    let message = "Unable to access your location.";

                    if (locationError.code === 1) {
                        message =
                            "Location permission was denied. Please allow location access for HyperLocal.";
                    } else if (locationError.code === 2) {
                        message =
                            "Your location is unavailable. Please try again.";
                    } else if (locationError.code === 3) {
                        message =
                            "Location request timed out. Please try again.";
                    }

                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLocationStatus("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (!emailVerified) {
            setError(
                "Please verify your email address with OTP before creating your account."
            );
            return;
        }

        try {
            setLoading(true);
            setLocationStatus("Getting your current location...");

            const location = await getCustomerLocation();

            setLocationStatus("Location detected successfully.");

            const response = await axios.post(
                "http://localhost:8080/api/auth/register-customer",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            );

            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("role", "customer");

            alert("Customer registration successful!");

            navigate("/dashboard");
        } catch (err) {
            console.error("Customer registration error:", err);

            setLocationStatus("");

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (typeof err.response?.data === "string") {
                setError(err.response.data);
            } else if (err.response) {
                setError("Unable to register. Please try again.");
            } else {
                setError(
                    err.message || "Unable to connect to the server."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-modern-page">
            <div className="registration-glow glow-one"></div>
            <div className="registration-glow glow-two"></div>

            {/* TOP BAR */}
            <div className="registration-topbar">
                <button
                    type="button"
                    className="registration-brand"
                    onClick={() => navigate("/")}
                    disabled={loading}
                >
                    <span className="registration-brand-logo">H</span>
                    <span>HyperLocal</span>
                </button>

                <div className="registration-secure">
                    🔒 Secure Registration
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="registration-modern-container">

                {/* LEFT INTRODUCTION */}
                <section className="registration-info">
                    <div className="registration-small-badge">
                        ✨ JOIN HYPERLOCAL
                    </div>

                    <h1>
                        Local services,
                        <span> made simple.</span>
                    </h1>

                    <p>
                        Create your HyperLocal customer account and
                        discover trusted professionals near you.
                        Book services easily and enjoy a reliable
                        local service experience.
                    </p>

                    <div className="registration-benefits">
                        <div className="registration-benefit">
                            <div className="benefit-icon">📍</div>
                            <div>
                                <strong>
                                    Discover Nearby Professionals
                                </strong>
                                <span>
                                    Find service providers around your location.
                                </span>
                            </div>
                        </div>

                        <div className="registration-benefit">
                            <div className="benefit-icon">⚡</div>
                            <div>
                                <strong>Quick and Easy Booking</strong>
                                <span>
                                    Find services and arrange bookings easily.
                                </span>
                            </div>
                        </div>

                        <div className="registration-benefit">
                            <div className="benefit-icon">⭐</div>
                            <div>
                                <strong>Ratings and Reviews</strong>
                                <span>
                                    Share your experience and help other customers.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CUSTOMER REGISTRATION CARD */}
                <section className="registration-modern-card">
                    <div className="registration-card-header">
                        <div className="registration-card-icon">
                            👤
                        </div>

                        <div>
                            <h2>Create Customer Account</h2>
                            <p>
                                Create your account and start exploring
                                local services.
                            </p>
                        </div>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="modern-registration-error" role="alert">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* LOCATION STATUS */}
                    {locationStatus && (
                        <div className="provider-location-status">
                            <span className="provider-location-status-icon">
                                📍
                            </span>
                            <span>{locationStatus}</span>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="modern-registration-form"
                    >
                        {/* FULL NAME */}
                        <div className="modern-field">
                            <label htmlFor="customer-name">
                                Full Name
                            </label>

                            <div className="modern-input">
                                <span>👤</span>
                                <input
                                    id="customer-name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div className="modern-field">
                            <label htmlFor="customer-email">
                                Email Address
                            </label>

                            <div className="modern-input">
                                <span>✉</span>
                                <input
                                    id="customer-email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL OTP VERIFICATION — THIS WAS MISSING */}
                        <EmailOtpVerification
                            email={formData.email.trim()}
                            onVerified={setEmailVerified}
                        />

                        {/* PASSWORD */}
                        <div className="modern-field">
                            <label htmlFor="customer-password">
                                Password
                            </label>

                            <div className="modern-input">
                                <span>🔒</span>

                                <input
                                    id="customer-password"
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    name="password"
                                    placeholder="Create a secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    minLength={6}
                                    required
                                />

                                <button
                                    type="button"
                                    className="modern-password-toggle"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>
                            </div>

                            <small>
                                Password must contain at least 6 characters.
                            </small>
                        </div>

                        {/* LOCATION INFORMATION */}
                        <div className="provider-location-box">
                            <div className="provider-location-icon">
                                📍
                            </div>

                            <div>
                                <strong>Location access required</strong>
                                <p>
                                    HyperLocal uses your current location to
                                    help you discover nearby service providers.
                                </p>
                            </div>
                        </div>

                        {/* TERMS */}
                        <div className="registration-terms">
                            <span className="terms-check">✓</span>
                            <p>
                                By creating an account, you agree to the
                                HyperLocal terms and privacy policy.
                            </p>
                        </div>

                        {/* CREATE ACCOUNT */}
                        <button
                            type="submit"
                            className="modern-create-button"
                            disabled={loading || !emailVerified}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Creating Account...
                                </>
                            ) : !emailVerified ? (
                                <>
                                    Verify Email to Continue
                                    <span>🔐</span>
                                </>
                            ) : (
                                <>
                                    Create Customer Account
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* LOGIN LINK */}
                    <div className="registration-login-link">
                        <span>Already have an account?</span>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            disabled={loading}
                        >
                            Back to Login
                        </button>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="modern-registration-footer">
                <span>© 2026 HyperLocal Services Marketplace</span>
                <span>Secure • Local • Trusted</span>
            </footer>
        </div>
    );
}

export default CustomerRegistration;