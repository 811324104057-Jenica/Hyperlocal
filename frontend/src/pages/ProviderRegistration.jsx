import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmailOtpVerification from "../components/EmailOtpVerification";
import "./ProviderRegistration.css";

function ProviderRegistration() {
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

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");

        if (name === "email") {
            setEmailVerified(false);
        }
    };

    const getProviderLocation = () => {
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
                    let message =
                        "Unable to access your location.";

                    if (locationError.code === 1) {
                        message =
                            "Location permission was denied. Please allow location access for HyperLocal.";
                    } else if (locationError.code === 2) {
                        message =
                            "Your location is currently unavailable. Please turn on your device location and try again.";
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
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (!emailVerified) {
            setError(
                "Please verify your email address with OTP before creating your provider account."
            );
            return;
        }

        try {
            setLoading(true);

            setLocationStatus(
                "📍 Getting your current location..."
            );

            const location = await getProviderLocation();

            setLocationStatus(
                "✓ Location detected successfully."
            );

            const response = await axios.post(
                "http://localhost:8080/api/auth/register-provider",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    service: "Pending",
                    price: 1,
                    experience: 0,
                    completedJobs: 0,
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

            localStorage.setItem(
                "role",
                "provider"
            );

            alert(
                "Provider registration successful!"
            );

            navigate("/provider-job-role");

        } catch (err) {
            console.error(
                "Provider registration error:",
                err
            );

            setLocationStatus("");

            if (err.response?.data?.message) {
                setError(
                    err.response.data.message
                );
            } else if (err.response?.data) {
                setError(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : "Unable to register. Please try again."
                );
            } else {
                setError(
                    err.message ||
                    "Unable to register. Please try again."
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

            <div className="registration-topbar">

                <button
                    type="button"
                    className="registration-brand"
                    onClick={() => navigate("/")}
                    disabled={loading}
                >
                    <span className="registration-brand-logo">
                        H
                    </span>

                    <span>
                        HyperLocal
                    </span>
                </button>

                <div className="registration-secure">
                    🔒 Secure Registration
                </div>

            </div>

            <main className="registration-modern-container">

                <section className="registration-info">

                    <div className="registration-small-badge">
                        🛠️ JOIN HYPERLOCAL
                    </div>

                    <h1>
                        Grow your local business,
                        <span>
                            made simple.
                        </span>
                    </h1>

                    <p>
                        Create your HyperLocal provider
                        account and connect with customers
                        looking for trusted local services
                        near them.
                    </p>

                    <div className="registration-benefits">

                        <div className="registration-benefit">

                            <div className="benefit-icon">
                                📍
                            </div>

                            <div>
                                <strong>
                                    Reach Nearby Customers
                                </strong>

                                <span>
                                    Connect with customers around your location.
                                </span>
                            </div>

                        </div>

                        <div className="registration-benefit">

                            <div className="benefit-icon">
                                ⚡
                            </div>

                            <div>
                                <strong>
                                    Manage Your Services
                                </strong>

                                <span>
                                    Choose your service and set your pricing.
                                </span>
                            </div>

                        </div>

                        <div className="registration-benefit">

                            <div className="benefit-icon">
                                ⭐
                            </div>

                            <div>
                                <strong>
                                    Build Your Reputation
                                </strong>

                                <span>
                                    Receive genuine ratings and customer reviews.
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

                <section className="registration-modern-card">

                    <div className="registration-card-header">

                        <div className="registration-card-icon">
                            🛠️
                        </div>

                        <div>

                            <h2>
                                Create Provider Account
                            </h2>

                            <p>
                                Join HyperLocal and start offering
                                your services.
                            </p>

                        </div>

                    </div>

                    {error && (
                        <div className="modern-registration-error">

                            <span>
                                ⚠️
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>
                    )}

                    {locationStatus && (
                        <div className="provider-location-status">

                            <span className="provider-location-status-icon">
                                📍
                            </span>

                            <span>
                                {locationStatus}
                            </span>

                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="modern-registration-form"
                    >

                        <div className="modern-field">

                            <label>
                                Full Name
                            </label>

                            <div className="modern-input">

                                <span>
                                    👤
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <div className="modern-field">

                            <label>
                                Email Address
                            </label>

                            <div className="modern-input">

                                <span>
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                            </div>

                        </div>

                        <EmailOtpVerification
                            email={formData.email}
                            onVerified={setEmailVerified}
                        />

                        <div className="modern-field">

                            <label>
                                Password
                            </label>

                            <div className="modern-input">

                                <span>
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Create a secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="modern-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁"}
                                </button>

                            </div>

                            <small>
                                Password must contain at least 6 characters.
                            </small>

                        </div>

                        <div className="provider-location-box">

                            <div className="provider-location-icon">
                                📍
                            </div>

                            <div>

                                <strong>
                                    Location access required
                                </strong>

                                <p>
                                    HyperLocal uses your current
                                    location to connect you with
                                    nearby customers.
                                </p>

                            </div>

                        </div>

                        <div className="registration-terms">

                            <span className="terms-check">
                                ✓
                            </span>

                            <p>
                                By creating an account, you agree to
                                the HyperLocal terms and privacy policy.
                            </p>

                        </div>

                        <button
                            type="submit"
                            className="modern-create-button"
                            disabled={
                                loading ||
                                !emailVerified
                            }
                        >

                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Creating Account...
                                </>
                            ) : !emailVerified ? (
                                <>
                                    Verify Email to Continue
                                    <span>
                                        🔐
                                    </span>
                                </>
                            ) : (
                                <>
                                    Create Provider Account
                                    <span>
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>

                    <div className="registration-login-link">

                        <span>
                            Already have an account?
                        </span>

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

            <footer className="modern-registration-footer">

                <span>
                    © 2026 HyperLocal Services Marketplace
                </span>

                <span>
                    Secure • Local • Trusted
                </span>

            </footer>

        </div>
    );
}

export default ProviderRegistration;