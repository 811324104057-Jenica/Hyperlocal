import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkerRecommendations.css";

function WorkerRecommendations() {
  const selectedService =
    localStorage.getItem("selectedService") || "Service";

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/workers/recommendations?service=${selectedService}`
      );

      setWorkers(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Unable to load workers.");
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

  if (loading) {
    return (
      <div className="recommendation-page">
        <h2>Finding the best workers for you...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-page">
        <h2>{error}</h2>
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
          <div className="recommendation-logo">H</div>

          <div>
            <h2>HyperLocal</h2>
            <span>Services Marketplace</span>
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
            We analyzed ratings, distance, price and
            experience to find the best options for you.
          </p>

        </section>

        <section className="ai-info">

          <div className="ai-icon">
            🤖
          </div>

          <div>
            <h3>Smart Recommendation</h3>

            <p>
              Workers are ranked using service rating,
              distance, price and experience.
            </p>
          </div>

        </section>

        <h2 className="top-title">
          Top 3 Recommended Workers
        </h2>

        {workers.length === 0 ? (

          <div className="recommendation-note">
            <span>⚠️</span>

            <p>
              No workers are currently available for{" "}
              {selectedService}.
            </p>
          </div>

        ) : (

          <div className="worker-list">

            {workers.map((worker, index) => (

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
                        BEST MATCH
                      </span>
                    )}

                  </div>

                  <p className="worker-service">
                    {worker.service} Specialist
                  </p>

                  <div className="worker-stats">

                    <span>
                      ⭐ {worker.rating}
                    </span>

                    <span>
                      📍 {worker.distance} km
                    </span>

                    <span>
                      💰 ₹{worker.price}
                    </span>

                    <span>
                      🧑‍🔧 {worker.experience} yrs
                    </span>

                  </div>

                  <p className="successful-jobs">
                    ✓ {worker.completedJobs} successful jobs
                  </p>

                </div>

                <div className="worker-action">

                  <div className="ai-score">

                    <span>
                      AI Match
                    </span>

                    <strong>
                      {Math.round(
                        (
                          (worker.rating / 5) * 50 +
                          Math.max(
                            0,
                            1 - worker.distance / 10
                          ) * 25 +
                          Math.max(
                            0,
                            1 - worker.price / 1000
                          ) * 15 +
                          Math.min(
                            worker.experience / 10,
                            1
                          ) * 10
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

            ))}

          </div>

        )}

        <div className="recommendation-note">

          <span>💡</span>

          <p>
            These recommendations are generated from
            worker data stored in the HyperLocal database.
            The system considers rating, distance, price
            and experience.
          </p>

        </div>

      </main>

    </div>
  );
}

export default WorkerRecommendations;