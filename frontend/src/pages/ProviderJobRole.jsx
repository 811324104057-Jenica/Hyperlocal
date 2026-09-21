import React, { useState } from "react";
import axios from "axios";
import "./ProviderJobRole.css";

function ProviderJobRole() {

    const [selectedRole, setSelectedRole] = useState("");
    const [price, setPrice] = useState("");
    const [experience, setExperience] = useState("");

    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState("");
    const [error, setError] = useState("");

    const roles = [
        {
            name: "Plumbing",
            icon: "🔧",
            description: "Pipe, tap and plumbing services"
        },
        {
            name: "Electrical",
            icon: "⚡",
            description: "Electrical installation and repair"
        },
        {
            name: "Cleaning",
            icon: "🧹",
            description: "Home and professional cleaning"
        },
        {
            name: "Painting",
            icon: "🎨",
            description: "Interior and exterior painting"
        },
        {
            name: "Repair",
            icon: "🔨",
            description: "Appliance and general repair"
        },
        {
            name: "Moving",
            icon: "🚚",
            description: "Moving and shifting services"
        }
    ];

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
                            "Your location is unavailable. Please turn on your device location and try again.";

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

    const handleContinue = async () => {

        setError("");

        if (!selectedRole) {

            setError(
                "Please select your job role."
            );

            return;
        }

        if (!price || Number(price) <= 0) {

            setError(
                "Please enter a valid base service price."
            );

            return;
        }

        if (
            experience === "" ||
            Number(experience) < 0
        ) {

            setError(
                "Please enter your experience."
            );

            return;
        }

        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        const workerId = user?.workerId;

        if (!workerId) {

            setError(
                "Provider information not found. Please login again."
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
                "✓ Location detected. Updating your provider profile..."
            );

            /*
             * Update service/job role.
             */
            await axios.put(
                `http://localhost:8080/api/workers/${workerId}/service`,
                {
                    service: selectedRole
                }
            );

            /*
             * Update real provider location.
             */
            await axios.put(
                `http://localhost:8080/api/workers/${workerId}/location`,
                {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            );

            /*
             * Update provider price and experience.
             */
            await axios.put(
                `http://localhost:8080/api/workers/${workerId}/details`,
                {
                    price: Number(price),
                    experience: Number(experience)
                }
            );

            /*
             * Store only the currently selected provider
             * information for frontend navigation.
             *
             * The actual source of truth remains MySQL.
             */
            localStorage.setItem(
                "providerService",
                selectedRole
            );

            localStorage.setItem(
                "providerLatitude",
                String(location.latitude)
            );

            localStorage.setItem(
                "providerLongitude",
                String(location.longitude)
            );

            setLocationStatus(
                "✓ Provider profile updated successfully."
            );

            setTimeout(() => {

                window.location.href =
                    "/provider-dashboard";

            }, 800);

        } catch (error) {

            console.error(
                "Provider setup error:",
                error
            );

            setLocationStatus("");

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to update provider information. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleBackToLogin = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("providerService");
        localStorage.removeItem("providerLatitude");
        localStorage.removeItem("providerLongitude");

        window.location.href = "/";
    };

    return (

        <div className="provider-role-page">

            <div className="provider-role-card">

                <div className="provider-role-logo">
                    H
                </div>

                <h1>
                    Complete Your Provider Profile
                </h1>

                <p className="provider-role-subtitle">
                    Select the service you provide and tell
                    customers about your experience.
                </p>

                {error && (
                    <div
                        style={{
                            color: "#b42318",
                            background: "#fff1f1",
                            border: "1px solid #fecaca",
                            padding: "11px",
                            borderRadius: "10px",
                            marginBottom: "15px",
                            fontSize: "13px"
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                <div className="role-grid">

                    {roles.map((role) => (

                        <button
                            key={role.name}
                            type="button"
                            className={
                                selectedRole === role.name
                                    ? "job-role-card selected"
                                    : "job-role-card"
                            }
                            onClick={() =>
                                setSelectedRole(role.name)
                            }
                            disabled={loading}
                        >

                            <span className="job-role-icon">
                                {role.icon}
                            </span>

                            <span className="job-role-name">
                                {role.name}
                            </span>

                            <span className="job-role-description">
                                {role.description}
                            </span>

                        </button>

                    ))}

                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "15px",
                        marginTop: "20px"
                    }}
                >

                    <div className="input-group">

                        <label>
                            Base Service Price (₹)
                        </label>

                        <input
                            type="number"
                            min="1"
                            placeholder="Example: 450"
                            value={price}
                            onChange={(e) =>
                                setPrice(e.target.value)
                            }
                            disabled={loading}
                        />

                        <small>
                            Final price will use actual distance.
                        </small>

                    </div>

                    <div className="input-group">

                        <label>
                            Experience (Years)
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="Example: 5"
                            value={experience}
                            onChange={(e) =>
                                setExperience(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>

                </div>

                <div className="provider-location-notice">

                    <span className="provider-location-icon">
                        📍
                    </span>

                    <div>

                        <strong>
                            Location access required
                        </strong>

                        <p>
                            Please turn on your location and
                            allow HyperLocal to access it.
                            Your real location is used to
                            calculate distance from customers.
                        </p>

                    </div>

                </div>

                {locationStatus && (
                    <div className="provider-location-status">
                        {locationStatus}
                    </div>
                )}

                <button
                    type="button"
                    className="continue-role-btn"
                    onClick={handleContinue}
                    disabled={loading}
                >
                    {loading
                        ? "Updating Profile..."
                        : "Save Profile & Continue →"}
                </button>

                <button
                    type="button"
                    className="back-login-btn"
                    onClick={handleBackToLogin}
                    disabled={loading}
                >
                    Back to Login
                </button>

            </div>

        </div>
    );
}

export default ProviderJobRole;