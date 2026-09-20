import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_URL = "http://localhost:8080/api/admin";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [
        statsResponse,
        usersResponse,
        providersResponse,
        servicesResponse,
        bookingsResponse
      ] = await Promise.all([
        axios.get(`${API_URL}/stats`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/providers`),
        axios.get(`${API_URL}/services`),
        axios.get(`${API_URL}/bookings`)
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setProviders(providersResponse.data);
      setServices(servicesResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">H</div>

          <div>
            <h1>HyperLocal</h1>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <div className="admin-header-right">
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-layout">

        <aside className="admin-sidebar">

          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>

          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>

          <button
            className={activeTab === "providers" ? "active" : ""}
            onClick={() => setActiveTab("providers")}
          >
            🧑‍🔧 Providers
          </button>

          <button
            className={activeTab === "services" ? "active" : ""}
            onClick={() => setActiveTab("services")}
          >
            🛠 Services
          </button>

          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            📅 Bookings
          </button>

        </aside>

        <main className="admin-content">

          {activeTab === "overview" && (
            <>
              <div className="admin-page-title">
                <h2>Dashboard Overview</h2>
                <p>Monitor your HyperLocal marketplace</p>
              </div>

              <div className="admin-stats-grid">

                <div className="admin-stat-card">
                  <div className="stat-icon purple">👥</div>
                  <div>
                    <span>Total Users</span>
                    <strong>{stats.totalUsers || 0}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon blue">🧑‍💼</div>
                  <div>
                    <span>Customers</span>
                    <strong>{stats.totalCustomers || 0}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon green">🔧</div>
                  <div>
                    <span>Providers</span>
                    <strong>{stats.totalProviders || 0}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon orange">📅</div>
                  <div>
                    <span>Bookings</span>
                    <strong>{stats.totalBookings || 0}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon pink">🛠</div>
                  <div>
                    <span>Services</span>
                    <strong>{stats.totalServices || 0}</strong>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon cyan">⭐</div>
                  <div>
                    <span>Workers</span>
                    <strong>{stats.totalWorkers || 0}</strong>
                  </div>
                </div>

              </div>

              <div className="admin-welcome-card">
                <div>
                  <h3>Welcome to HyperLocal Administration</h3>
                  <p>
                    Manage users, service providers, services and bookings
                    from one central dashboard.
                  </p>
                </div>

                <div className="admin-welcome-icon">
                  ⚡
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <section className="admin-section">

              <div className="admin-page-title">
                <h2>Users</h2>
                <p>All registered users in the marketplace</p>
              </div>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </section>
          )}

          {activeTab === "providers" && (
            <section className="admin-section">

              <div className="admin-page-title">
                <h2>Service Providers</h2>
                <p>Registered professionals on HyperLocal</p>
              </div>

              <div className="provider-admin-grid">

                {providers.map((provider) => (
                  <div className="provider-admin-card" key={provider.id}>

                    <div className="provider-admin-avatar">
                      {provider.name?.charAt(0).toUpperCase()}
                    </div>

                    <h3>{provider.name}</h3>

                    <span className="provider-service">
                      {provider.service}
                    </span>

                    <div className="provider-details">
                      <span>⭐ {provider.rating}</span>
                      <span>📍 {provider.distance} km</span>
                      <span>₹{provider.price}</span>
                    </div>

                    <div className="provider-details">
                      <span>{provider.experience} years</span>
                      <span>{provider.completedJobs} jobs</span>
                    </div>

                  </div>
                ))}

              </div>

            </section>
          )}

          {activeTab === "services" && (
            <section className="admin-section">

              <div className="admin-page-title">
                <h2>Services</h2>
                <p>Services available in the marketplace</p>
              </div>

              <div className="services-admin-grid">

                {services.map((service) => (
                  <div className="service-admin-card" key={service.id}>

                    <div className="service-admin-icon">
                      🛠
                    </div>

                    <div>
                      <h3>{service.name}</h3>

                      <p>{service.description}</p>

                      <div className="service-admin-bottom">
                        <span>{service.category}</span>
                        <strong>₹{service.basePrice}</strong>
                      </div>
                    </div>

                  </div>
                ))}

              </div>

            </section>
          )}

          {activeTab === "bookings" && (
            <section className="admin-section">

              <div className="admin-page-title">
                <h2>Bookings</h2>
                <p>All marketplace booking activity</p>
              </div>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer ID</th>
                      <th>Worker ID</th>
                      <th>Service ID</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>

                        <td>#{booking.id}</td>

                        <td>{booking.customerId}</td>

                        <td>{booking.workerId}</td>

                        <td>{booking.serviceId}</td>

                        <td>{booking.bookingDate}</td>

                        <td>{booking.bookingTime}</td>

                        <td>₹{booking.totalPrice}</td>

                        <td>
                          <span
                            className={`status-badge ${booking.status?.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </section>
          )}

        </main>

      </div>

    </div>
  );
}

export default AdminDashboard;