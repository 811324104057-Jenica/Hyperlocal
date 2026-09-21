import React, { useState } from "react";
import axios from "axios";
import "./ProviderRegistration.css";

function ProviderRegistration() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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

                (error) => {

                    let message =
                        "Unable to access your location.";

                    if (error.code === 1) {

                        message =
                            "Location permission was denied. Please allow location access for HyperLocal.";

                    } else if (error.code === 2) {

                        message =
                            "Your location is currently unavailable. Please turn on your device location and try again.";

                    } else if (error.code === 3) {

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

            setError(
                "Please fill in all required fields."
            );

            return;
        }

        if (formData.password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }

        try {

            setLoading(true);

            setLocationStatus(
                "📍 Getting your current location..."
            );

            const location =
                await getProviderLocation();

            setLocationStatus(
                "✓ Location detected successfully."
            );

            /*
             * Service, price and experience are intentionally
             * not collected on this registration page.
             *
             * The provider will complete the job-role details
             * in the next step.
             *
             * The temporary values below allow the existing
             * backend registration API to create the provider
             * account and worker record.
             */

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

            window.location.href =
                "/provider-job-role";

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

        <div className="provider-registration-page">

            <div className="provider-registration-card">

                <div className="registration-logo">
                    H
                </div>

                <h1>
                    Become a Service Provider
                </h1>

                <p className="registration-subtitle">
                    Join HyperLocal and connect with
                    customers near you.
                </p>

                {error && (
                    <div className="registration-error">
                        ⚠️ {error}
                    </div>
                )}

                {locationStatus && (
                    <div className="location-status">
                        {locationStatus}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="registration-form"
                >

                    <div className="input-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a secure password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <small>
                            Password must contain at least 6 characters.
                        </small>

                    </div>

                    <div className="location-info-box">

                        <div className="location-info-icon">
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

                    <button
                        type="submit"
                        className="register-provider-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register as Provider →"}
                    </button>

                </form>

                <button
                    type="button"
                    className="back-login-button"
                    onClick={() =>
                        window.location.href = "/"
                    }
                    disabled={loading}
                >
                    ← Back to Login
                </button>

            </div>

        </div>
    );
}

export default ProviderRegistration;