import { useState } from "react";
import "./App.css";
import { loginUser } from "./services/authService";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookingPage from "./pages/BookingPage";
import WorkerRecommendations from "./pages/WorkerRecommendations/WorkerRecommendations";

function App() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // Current URL
  const path = window.location.pathname;

  // -----------------------------
  // DASHBOARD ROUTE
  // -----------------------------
  if (path === "/dashboard") {
    return <CustomerDashboard />;
  }
   if (path === "/recommendations") {
  return <WorkerRecommendations />;
  }
  // -----------------------------
  // BOOKING ROUTE
  // -----------------------------
  if (path === "/booking") {
    return <BookingPage />;
  }

  // -----------------------------
  // ROLES
  // -----------------------------
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

  // -----------------------------
  // LOGIN
  // -----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    // Empty field validation
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      // Call Spring Boot backend
      const data = await loginUser(email, password, role);

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(data));

      // Save role
      localStorage.setItem("role", role);

      // Show success message
      setLoginMessage(
        `${currentRole.title} logged in successfully!`
      );

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  // -----------------------------
  // LOGIN PAGE
  // -----------------------------
  return (
    <div className="page">

      {/* SUCCESS MESSAGE */}
      {loginMessage && (
        <div className="login-success-message">
          <span className="success-icon">✓</span>

          <span>{loginMessage}</span>
        </div>
      )}

      {/* BACKGROUND */}
      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      {/* NAVBAR */}
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

      {/* MAIN */}
      <main className="main-container">

        {/* LEFT SIDE */}
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

          {/* FEATURES */}
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

        {/* LOGIN SIDE */}
        <section className="login-section">

          <div className="login-card">

            {/* HEADER */}
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

            {/* ROLE SELECTOR */}
            <div className="role-selector">

              {/* CUSTOMER */}
              <button
                type="button"
                className={
                  role === "customer"
                    ? "role active"
                    : "role"
                }
                onClick={() =>
                  setRole("customer")
                }
              >
                <span>👤</span>

                <small>
                  Customer
                </small>
              </button>

              {/* PROVIDER */}
              <button
                type="button"
                className={
                  role === "provider"
                    ? "role active"
                    : "role"
                }
                onClick={() =>
                  setRole("provider")
                }
              >
                <span>🛠️</span>

                <small>
                  Provider
                </small>
              </button>

              {/* ADMIN */}
              <button
                type="button"
                className={
                  role === "admin"
                    ? "role active"
                    : "role"
                }
                onClick={() =>
                  setRole("admin")
                }
              >
                <span>🛡️</span>

                <small>
                  Admin
                </small>
              </button>

            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin}>

              {/* EMAIL */}
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
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    disabled={!!loginMessage}
                  />

                </div>

              </div>

              {/* PASSWORD */}
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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    disabled={!!loginMessage}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={!!loginMessage}
                  >
                    {showPassword
                      ? "🙈"
                      : "👁"}
                  </button>

                </div>

              </div>

              {/* REMEMBER */}
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

              {/* LOGIN BUTTON */}
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

            {/* DIVIDER */}
            <div className="divider">

              <span>
                OR
              </span>

            </div>

            {/* GOOGLE */}
            <button
              type="button"
              className="google-button"
            >

              <span className="google">
                G
              </span>

              Continue with Google

            </button>

            {/* REGISTER */}
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

      {/* FOOTER */}
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