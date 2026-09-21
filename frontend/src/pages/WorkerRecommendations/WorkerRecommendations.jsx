import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkerRecommendations.css";

function WorkerRecommendations() {

  const selectedService =
    localStorage.getItem("selectedService") || "Service";

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    getCustomerLocation();
  }, []);

  const getCustomerLocation = () => {

    setLocationLoading(true);
    setLoading(true);
    setLocationError("");
    setError("");

    if (!navigator.geolocation) {

      setLocationError(
        "Location services are not supported by this browser."
      );

      setLocationLoading(false);
      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        localStorage.setItem(
          "customerLatitude",
          String(latitude)
        );

        localStorage.setItem(
          "customerLongitude",
          String(longitude)
        );

        setLocationLoading(false);

        fetchWorkers(
          latitude,
          longitude
        );
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

        setLocationError(message);
        setLocationLoading(false);
        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const fetchWorkers = async (
    latitude,
    longitude
  ) => {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/workers/recommendations",
        {
          params: {
            service: selectedService,
            latitude: latitude,
            longitude: longitude
          }
        }
      );

      setWorkers(response.data);

      setLoading(false);

    } catch (error) {

      console.error(
        "Worker recommendation error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load workers."
      );

      setLoading(false);
    }
  };

  const handleChooseWorker = (worker) => {

    localStorage.setItem(
      "selectedWorker",
      JSON.stringify(worker)
    );

    window.location.href = "/booking";
  };

  const handleBack = () => {

    window.location.href = "/dashboard";
  };

  if (locationLoading) {

    return (
      <div className="recommendation-page">

        <div className="location-request-card">

          <div className="location-request-icon">
            📍
          </div>

          <h2>
            Location Access Required
          </h2>

          <p>
            Please turn on your location and allow
            HyperLocal to access it.
          </p>

          <p>
            Your real location is required to calculate
            the distance from service providers and
            determine the correct service price.
          </p>

          <div className="location-loading">
            Getting your current location...
          </div>

        </div>

      </div>
    );
  }

  if (locationError) {

    return (
      <div className="recommendation-page">

        <div className="location-request-card">

          <div className="location-error-icon">
            📍
          </div>

          <h2>
            Location Required
          </h2>

          <p className="location-error-message">
            {locationError}
          </p>

          <p>
            HyperLocal cannot calculate the actual
            provider distance or distance-based price
            without your current location.
          </p>

          <button
            className="retry-location-btn"
            onClick={getCustomerLocation}
          >
            📍 Try Again
          </button>

          <button
            className="back-location-btn"
            onClick={handleBack}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  if (loading) {

    return (
      <div className="recommendation-page">

        <div className="location-request-card">

          <div className="location-request-icon">
            🔍
          </div>

          <h2>
            Finding nearby workers...
          </h2>

          <p>
            Calculating actual distance from your
            current location.
          </p>

        </div>

      </div>
    );
  }

  if (error) {

    return (
      <div className="recommendation-page">

        <h2>
          {error}
        </h2>

        <button onClick={handleBack}>
          ← Back to Dashboard
        </button>

      </div>
    );
  }

  return (
    <div className="recommendation-page">

      <nav className="recommendation-navbar">

        <div className="recommendation-brand">

          <div className="recommendation-logo">
            H
          </div>

          <div>
            <h2>
              HyperLocal
            </h2>

            <span>
              Services Marketplace
            </span>
          </div>

        </div>

        <button
          className="back-dashboard-btn"
          onClick={handleBack}
        >
          ← Dashboard
        </button>

      </nav>

      <main className="recommendation-container">

        <section className="recommendation-header">

          <div className="service-badge">
            🔍 {selectedService}
          </div>

          <h1>
            Best {selectedService} Services Near You
          </h1>

          <p>
            Providers are ranked using their actual
            distance, customer rating, price and
            experience.
          </p>

        </section>

        <section className="ai-info">

          <div className="ai-icon">
            📍
          </div>

          <div>

            <h3>
              Real-Time Location Matching
            </h3>

            <p>
              Your current location is used to calculate
              the actual distance and distance-based
              service price for each provider.
            </p>

          </div>

        </section>

        <h2 className="top-title">
          Top 3 Recommended Workers
        </h2>

        {workers.length === 0 ? (

          <div className="recommendation-note">

            <span>
              ⚠️
            </span>

            <p>
              No providers with a valid location are
              currently available for {selectedService}.
            </p>

          </div>

        ) : (

          <div className="worker-list">

            {workers.map((worker, index) => {

              const basePrice =
                Number(worker.price) || 0;

              const calculatedPrice =
                Number(worker.calculatedPrice) ||
                basePrice;

              const distanceCharge =
                Math.max(
                  0,
                  calculatedPrice - basePrice
                );

              return (
                <div
                  className={
                    index === 0
                      ? "worker-card best-worker"
                      : "worker-card"
                  }
                  key={worker.id}
                >

                  <div className="worker-rank">

                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : "🥉"}

                  </div>

                  <div className="worker-details">

                    <div className="worker-name-row">

                      <h3>
                        {worker.name}
                      </h3>

                      {index === 0 && (

                        <span className="best-badge">
                          NEAREST MATCH
                        </span>

                      )}

                    </div>

                    <p className="worker-service">
                      {worker.service} Specialist
                    </p>

                    <div className="worker-stats">

                      <span>
                        ⭐ {Number(worker.rating).toFixed(1)}
                      </span>

                      <span>
                        📍 {Number(worker.distance).toFixed(2)} km
                      </span>

                      <span>
                        🧑‍🔧 {worker.experience} yrs
                      </span>

                    </div>

                    <div className="price-section">

                      <div>
                        Base Price:
                        <strong>
                          ₹{basePrice.toFixed(2)}
                        </strong>
                      </div>

                      {distanceCharge > 0 && (

                        <div>
                          Distance Charge:
                          <strong>
                            + ₹{distanceCharge.toFixed(2)}
                          </strong>
                        </div>

                      )}

                      <div className="final-price">

                        Final Service Price:

                        <strong>
                          ₹{calculatedPrice.toFixed(2)}
                        </strong>

                      </div>

                    </div>

                    <p className="successful-jobs">
                      ✓ {worker.completedJobs} successful jobs
                    </p>

                  </div>

                  <div className="worker-action">

                    <div className="ai-score">

                      <span>
                        Match
                      </span>

                      <strong>
                        {Math.round(
                          (
                            Math.max(
                              0,
                              1 -
                              worker.distance / 10
                            ) * 60 +

                            (worker.rating / 5) * 25 +

                            Math.min(
                              worker.experience / 10,
                              1
                            ) * 15
                          )
                        )}
                        %
                      </strong>

                    </div>

                    <button
                      onClick={() =>
                        handleChooseWorker(worker)
                      }
                    >
                      Choose Worker →
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

        <div className="recommendation-note">

          <span>
            💡
          </span>

          <p>
            Price is calculated automatically at runtime.
            The first 5 km has no distance charge.
            Every kilometre beyond 5 km adds ₹20 to the
            provider's base price.
          </p>

        </div>

      </main>

    </div>
  );
}

export default WorkerRecommendations;

