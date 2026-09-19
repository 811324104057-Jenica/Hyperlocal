import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerDashboard.css";

function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [workerDetails, setWorkerDetails] = useState({});
  const [services, setServices] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/services"
      );

      const serviceData = response.data.map((service) => ({
        ...service,
        icon: getServiceIcon(service.name),
      }));

      setServices(serviceData);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getServiceIcon = (serviceName) => {
    const icons = {
      Plumbing: "🔧",
      Electrical: "⚡",
      Cleaning: "🧹",
      Painting: "🎨",
      Repair: "🔨",
      Moving: "🚚",
    };

    return icons[serviceName] || "🛠️";
  };

  const fetchBookings = async () => {
    if (!user || !user.id) {
      setLoadingBookings(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/bookings/customer/${user.id}`
      );

      const bookingData = response.data;

      setBookings(bookingData);

      const workerIds = [
        ...new Set(
          bookingData
            .map((booking) => booking.workerId)
            .filter((id) => id)
        ),
      ];

      const workerResponses = await Promise.all(
        workerIds.map((workerId) =>
          axios.get(
            `http://localhost:8080/api/bookings/worker-details/${workerId}`
          )
        )
      );

      const workerMap = {};

      workerResponses.forEach((response) => {
        const worker = response.data;
        workerMap[worker.id] = worker;
      });

      setWorkerDetails(workerMap);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleBooking = (serviceName) => {
    localStorage.setItem("selectedService", serviceName);
    window.location.href = "/recommendations";
  };

  const handleMyBookings = () => {
    const element = document.getElementById(
      "my-bookings"
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/bookings/${bookingId}/cancel`
      );

      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );

      alert("Booking cancelled successfully.");
    } catch (error) {
      console.error(
        "Error cancelling booking:",
        error
      );

      alert(
        "Unable to cancel booking. Please try again."
      );
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find(
      (item) => item.id === serviceId
    );

    return service ? service.name : "Loading service...";
  };

  return (
    <div className="dashboard">

      <nav className="dashboard-navbar">
        <div className="logo">
          HyperLocal
        </div>

        <div className="navbar-right">
          <span>
            👤 {user?.name || "Customer"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="welcome-section">
        <h1>
          Welcome back, {user?.name || "Customer"}! 👋
        </h1>

        <p>
          Find trusted local services near you.
        </p>

        <div className="search-container">
          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search for a service..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </section>

      <section className="services-section">
        <h2>
          {search
            ? `Search Results for "${search}"`
            : "Popular Services"}
        </h2>

        {filteredServices.length > 0 ? (
          <div className="service-grid">
            {filteredServices.map((service) => (
              <div
                className="service-card"
                key={service.id}
              >
                <div className="service-icon">
                  {service.icon}
                </div>

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>

                <button
                  onClick={() =>
                    handleBooking(service.name)
                  }
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>
              No services found
            </h3>

            <p>
              Try searching for another service.
            </p>
          </div>
        )}
      </section>

      <section
        className="bookings-section"
        id="my-bookings"
      >
        <div className="section-heading">
          <h2>
            📅 My Bookings
          </h2>

          <p>
            View and manage your service bookings.
          </p>
        </div>

        {loadingBookings ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">
              ⏳
            </div>

            <h3>
              Loading bookings...
            </h3>

            <p>
              Please wait while we fetch your bookings.
            </p>
          </div>
        ) : bookings.length > 0 ? (
          <div>
            {bookings.map((booking) => {
              const worker =
                workerDetails[booking.workerId];

              return (
                <div
                  className="booking-card"
                  key={booking.id}
                >

                  <div className="booking-card-header">
                    <div>
                      <span className="booking-label">
                        Service
                      </span>

                      <h3>
                        {getServiceName(
                          booking.serviceId
                        )}
                      </h3>
                    </div>

                    <span className="booking-status">
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-details">

                    <div className="booking-detail">
                      <span>📅</span>

                      <div>
                        <small>
                          Date
                        </small>

                        <strong>
                          {booking.bookingDate}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-detail">
                      <span>⏰</span>

                      <div>
                        <small>
                          Time
                        </small>

                        <strong>
                          {booking.bookingTime}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-detail">
                      <span>📍</span>

                      <div>
                        <small>
                          Address
                        </small>

                        <strong>
                          {booking.address}
                        </strong>
                      </div>
                    </div>

                  </div>

                  <div className="worker-info-section">

                    <div className="worker-info-header">
                      <div className="worker-icon">
                        👨‍🔧
                      </div>

                      <div>
                        <small>
                          Service Provider
                        </small>

                        <h3>
                          {worker
                            ? worker.name
                            : "Loading provider..."}
                        </h3>
                      </div>
                    </div>

                    {worker && (
                      <>
                        <div className="worker-info-stats">

                          <div className="worker-stat">
                            <span>⭐</span>

                            <div>
                              <small>
                                Rating
                              </small>

                              <strong>
                                {worker.rating}
                              </strong>
                            </div>
                          </div>

                          <div className="worker-stat">
                            <span>📍</span>

                            <div>
                              <small>
                                Distance
                              </small>

                              <strong>
                                {worker.distance} km
                              </strong>
                            </div>
                          </div>

                          <div className="worker-stat">
                            <span>💰</span>

                            <div>
                              <small>
                                Price
                              </small>

                              <strong>
                                ₹{worker.price}
                              </strong>
                            </div>
                          </div>

                          <div className="worker-stat">
                            <span>🧑‍🔧</span>

                            <div>
                              <small>
                                Experience
                              </small>

                              <strong>
                                {worker.experience} years
                              </strong>
                            </div>
                          </div>

                        </div>

                        <div className="worker-jobs">
                          ✓ {worker.completedJobs} successful jobs
                        </div>
                      </>
                    )}

                  </div>

                  <div className="booking-details">

                    <div className="booking-detail">
                      <span>💰</span>

                      <div>
                        <small>
                          Total Price
                        </small>

                        <strong>
                          ₹{booking.totalPrice}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-detail">
                      <span>🆔</span>

                      <div>
                        <small>
                          Booking ID
                        </small>

                        <strong>
                          #{booking.id}
                        </strong>
                      </div>
                    </div>

                  </div>

                  <div className="booking-actions">
                    {booking.status !== "CANCELLED" && (
                      <button
                        className="cancel-booking"
                        onClick={() =>
                          cancelBooking(booking.id)
                        }
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-bookings">

            <div className="no-bookings-icon">
              📅
            </div>

            <h3>
              No bookings yet
            </h3>

            <p>
              You haven't booked any services yet.
            </p>

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              Browse Services
            </button>

          </div>
        )}
      </section>

      <section className="quick-section">

        <h2>
          Quick Actions
        </h2>

        <div className="quick-grid">

          <div
            className="quick-card"
            onClick={handleMyBookings}
          >
            <span>📅</span>

            <h3>
              My Bookings
            </h3>

            <p>
              View and manage your bookings.
            </p>
          </div>

          <div className="quick-card">
            <span>❤️</span>

            <h3>
              Favorites
            </h3>

            <p>
              View your favorite services.
            </p>
          </div>

          <div className="quick-card">
            <span>👤</span>

            <h3>
              My Profile
            </h3>

            <p>
              Manage your account details.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default CustomerDashboard;