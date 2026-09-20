import { useState } from "react";
import "./App.css";
import { loginUser } from "./services/authService";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingPage from "./pages/BookingPage";
import WorkerRecommendations from "./pages/WorkerRecommendations/WorkerRecommendations";
import ProviderDashboard from "./pages/ProviderDashboard/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <CustomerDashboard />;
  }

  if (path === "/provider-dashboard") {
    return <ProviderDashboard />;
  }

  if (path === "/admin-dashboard") {
    return <AdminDashboard />;
  }

  if (path === "/recommendations") {
    return <WorkerRecommendations />;
  }

  if (path === "/booking") {
    return <BookingPage />;
  }

  const roles = {
    customer: {
      title: "Customer",
      subtitle: "Find and book trusted local services",
      icon: "👤",
      button: "Login as Customer",
    },

    provider: {
      title: "Service Provider",
      subtitle: "Manage your services and grow your business",
      icon: "🛠️",
      button: "Login as Provider",
    },

    admin: {
      title: "Admin",
      subtitle: "Manage the HyperLocal marketplace",
      icon: "🛡️",
      button: "Login as Admin",
    },
  };

  const currentRole = roles[role];

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const data = await loginUser(email, password, role);

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", role);

      setLoginMessage(
        `${currentRole.title} logged in successfully!`
      );

      setTimeout(() => {
        if (role === "provider") {
          window.location.href = "/provider-dashboard";
        } else if (role === "customer") {
          window.location.href = "/dashboard";
        } else if (role === "admin") {
          window.location.href = "/admin-dashboard";
        }
      }, 1200);

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="page">

      {loginMessage && (
        <div className="login-success-message">
          <span className="success-icon">✓</span>
          <span>{loginMessage}</span>
        </div>
      )}

      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      <nav className="navbar">

        <div className="brand">

          <div className="brand-logo">
            H
          </div>

          <div>
            <h2>HyperLocal</h2>
            <span>Services Marketplace</span>
          </div>

        </div>

        <div className="nav-links">

          <a href="/">
            Home
          </a>

          <a href="#">
            Services
          </a>

          <a href="#">
            About
          </a>

          <button
            type="button"
            className="nav-register"
          >
            Register
          </button>

        </div>

      </nav>

      <main className="main-container">

        <section className="intro">

          <div className="trust-badge">
            <span>●</span>
            Trusted Local Services
          </div>

          <h1>
            Your neighborhood,
            <br />
            <span>your services.</span>
          </h1>

          <p className="intro-text">
            Discover reliable professionals around you.
            Book services, manage appointments and connect
            with your local community — all in one place.
          </p>

          <div className="features">

            <div className="feature-card">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <h3>
                  Verified Professionals
                </h3>

                <p>
                  Connect with trusted and verified
                  service providers.
                </p>
              </div>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ⚡
              </div>

              <div>
                <h3>
                  Quick & Easy Booking
                </h3>

                <p>
                  Find and book the right service
                  in just a few clicks.
                </p>
              </div>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                ★
              </div>

              <div>
                <h3>
                  Ratings & Reviews
                </h3>

                <p>
                  Choose the best professionals
                  using customer reviews.
                </p>
              </div>

            </div>

          </div>

        </section>

        <section className="login-section">

          <div className="login-card">

            <div className="login-header">

              <div className="login-icon">
                {currentRole.icon}
              </div>

              <h2>
                Welcome Back!
              </h2>

              <p>
                {currentRole.subtitle}
              </p>

            </div>

            <div className="role-selector">

              <button
                type="button"
                className={
                  role === "customer"
                    ? "role active"
                    : "role"
                }
                onClick={() => setRole("customer")}
              >
                <span>👤</span>
                <small>Customer</small>
              </button>

              <button
                type="button"
                className={
                  role === "provider"
                    ? "role active"
                    : "role"
                }
                onClick={() => setRole("provider")}
              >
                <span>🛠️</span>
                <small>Provider</small>
              </button>

              <button
                type="button"
                className={
                  role === "admin"
                    ? "role active"
                    : "role"
                }
                onClick={() => setRole("admin")}
              >
                <span>🛡️</span>
                <small>Admin</small>
              </button>

            </div>

            <form onSubmit={handleLogin}>

              <div className="input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!loginMessage}
                  />

                </div>

              </div>

              <div className="input-group">

                <div className="password-title">

                  <label htmlFor="password">
                    Password
                  </label>

                  <a href="#">
                    Forgot Password?
                  </a>

                </div>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!!loginMessage}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={!!loginMessage}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>

                </div>

              </div>

              <div className="remember">

                <label>

                  <input
                    type="checkbox"
                    disabled={!!loginMessage}
                  />

                  <span>
                    Remember me
                  </span>

                </label>

              </div>

              <button
                type="submit"
                className="login-button"
                disabled={!!loginMessage}
              >

                {loginMessage
                  ? "Logging in..."
                  : currentRole.button}

                <span>
                  →
                </span>

              </button>

            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="google-button"
            >

              <span className="google">
                G
              </span>

              Continue with Google

            </button>

            <div className="register-text">

              <span>
                Don't have an account?
              </span>

              <a href="#">
                Create Account
              </a>

            </div>

          </div>

        </section>

      </main>

      <footer>

        <span>
          © 2026 HyperLocal Services Marketplace
        </span>

        <div>

          <a href="#">
            Privacy
          </a>

          <a href="#">
            Terms
          </a>

          <a href="#">
            Help
          </a>

        </div>

      </footer>

    </div>
  );
}

export default App;