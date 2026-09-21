import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard/ProviderDashboard";
import ProviderJobRole from "./pages/ProviderJobRole";
import ProviderRegistration from "./pages/ProviderRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerRecommendations from "./pages/WorkerRecommendations/WorkerRecommendations";
import BookingPage from "./pages/BookingPage";

import "./App.css";

/* =========================================================
   LOGIN PAGE
========================================================= */

function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      localStorage.setItem(
        "role",
        data.role
      );

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }

      setMessage(
        `Login successful. Welcome ${data.name}!`
      );

     setTimeout(async () => {
  if (data.role === "customer") {
    navigate("/dashboard");

  } else if (data.role === "provider") {

    // New provider without a worker record
    if (!data.workerId) {
      navigate("/provider-job-role");
      return;
    }

    try {
      // Check the provider's current database setup
      const workerResponse = await fetch(
        `http://localhost:8080/api/workers/${data.workerId}`
      );

      if (!workerResponse.ok) {
        // If worker details cannot be found, complete setup
        navigate("/provider-job-role");
        return;
      }

      const worker = await workerResponse.json();

      // New provider: setup is not completed
      if (
        !worker.service ||
        worker.service.trim().toLowerCase() === "pending"
      ) {
        navigate("/provider-job-role");
      } else {
        // Existing provider: setup already completed
        navigate("/provider-dashboard");
      }

    } catch (workerError) {
      console.error(
        "Unable to check provider setup:",
        workerError
      );

      setError(
        "Unable to check your provider profile. Please try again."
      );
    }

  } else if (data.role === "admin") {
    navigate("/admin-dashboard");
  }
}, 500);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Unable to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (role === "provider") {
      navigate("/provider-register");
    } else {
      navigate(`/register?role=${role}`);
    }
  };

  return (
    <div className="page">

      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      <nav className="navbar">

        <div className="brand">

          <div className="brand-logo">
            H
          </div>

          <div>
            <h2>HyperLocal</h2>

            <span>
              LOCAL SERVICES. SIMPLIFIED.
            </span>
          </div>

        </div>

        <div className="nav-links">

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Home
          </a>

          <a
            href="/recommendations"
            onClick={(e) => {
              e.preventDefault();
              navigate("/recommendations");
            }}
          >
            Services
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();

              document
                .getElementById("about")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            About
          </a>

          <button
            className="nav-register"
            onClick={handleRegisterClick}
          >
            Register
          </button>

        </div>

      </nav>

      <main className="main-container">

        <section className="intro">

          <div className="trust-badge">
            <span>●</span>
            TRUSTED LOCAL MARKETPLACE
          </div>

          <h1>
            Local services,
            <br />
            <span>
              right at your doorstep.
            </span>
          </h1>

          <p className="intro-text">
            Find trusted professionals near you
            for home services, repairs, cleaning,
            electrical work and more.
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
                  Connect with trusted and
                  verified local professionals.
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
                  Find and book local services
                  quickly and easily.
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
                  Choose professionals using
                  real customer feedback.
                </p>
              </div>

            </div>

          </div>

        </section>

        <section className="login-section">

          <div className="login-card">

            <div className="login-header">

              <div className="login-icon">
                H
              </div>

              <h2>
                Welcome to HyperLocal
              </h2>

              <p>
                Connect with trusted local
                service professionals
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
                onClick={() =>
                  setRole("customer")
                }
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
                onClick={() =>
                  setRole("provider")
                }
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
                onClick={() =>
                  setRole("admin")
                }
              >
                <span>⚙️</span>
                <small>Admin</small>
              </button>

            </div>

            <form onSubmit={handleLogin}>

              <div className="input-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="input-group">

                <div className="password-title">

                  <label>
                    Password
                  </label>

                  <a href="/">
                    Forgot Password?
                  </a>

                </div>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "🙈"
                      : "👁"}
                  </button>

                </div>

              </div>

              <div className="remember">

                <label>

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                  />

                  Remember me

                </label>

              </div>

              {message && (
                <div
                  className="login-success-message"
                  style={{
                    position: "static",
                    transform: "none",
                    marginBottom: "15px",
                  }}
                >
                  <span className="success-icon">
                    ✓
                  </span>

                  {message}
                </div>
              )}

              {error && (
                <div
                  style={{
                    color: "#dc2626",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "13px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

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

              <p className="register-text">

                Don't have an account?

                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    marginLeft: "5px",
                    color: "#7c3aed",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                  onClick={handleRegisterClick}
                >
                  Register as{" "}
                  {role === "customer"
                    ? "a Customer"
                    : role === "provider"
                    ? "a Service Provider"
                    : "an Admin"}
                </button>

              </p>

            </form>

          </div>

        </section>

      </main>

      <section
        id="about"
        style={{
          padding: "60px 7%",
          textAlign: "center",
          background: "#ffffff",
          position: "relative",
          zIndex: 2,
        }}
      >

        <h2>
          About HyperLocal
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "15px auto",
            color: "#716b80",
            lineHeight: "1.7",
          }}
        >
          HyperLocal connects customers with
          trusted local service professionals.
          Customers can discover, compare and
          book nearby professionals for their
          everyday service needs.
        </p>

      </section>

      <footer>

        <div>
          © 2026 HyperLocal Services Marketplace
        </div>

        <div>

          <a href="/">
            Privacy
          </a>

          <a href="/">
            Terms
          </a>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   CUSTOMER / ADMIN REGISTRATION PAGE
========================================================= */

function RegistrationPage() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const selectedRole =
    searchParams.get("role") === "admin"
      ? "admin"
      : "customer";

  const isAdmin =
    selectedRole === "admin";

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

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

      const endpoint =
        isAdmin
          ? "register-admin"
          : "register-customer";

      const response = await fetch(
        `http://localhost:8080/api/auth/${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Registration failed."
        );

      }

      setMessage(
        data.message ||
        "Account created successfully!"
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

    } catch (err) {

      console.error(
        "Registration error:",
        err
      );

      setError(
        err.message ||
        "Unable to connect to server."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="registration-modern-page">

      {/* Background decoration */}

      <div className="registration-glow glow-one"></div>

      <div className="registration-glow glow-two"></div>

      {/* Top brand */}

      <div className="registration-topbar">

        <button
          type="button"
          className="registration-brand"
          onClick={() =>
            navigate("/")
          }
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

      {/* Main content */}

      <main className="registration-modern-container">

        {/* Left information section */}

        <section className="registration-info">

          <div className="registration-small-badge">
            {isAdmin
              ? "⚙ ADMIN ACCESS"
              : "✨ JOIN HYPERLOCAL"}
          </div>

          <h1>

            {isAdmin ? (
              <>
                Manage the
                <span>
                  HyperLocal
                </span>
                marketplace.
              </>
            ) : (
              <>
                Local services,
                <span>
                  made simple.
                </span>
              </>
            )}

          </h1>

          <p>
            {isAdmin
              ? "Create your administrator account and manage the HyperLocal marketplace from one secure platform."
              : "Create your HyperLocal customer account and discover trusted local professionals near you."}
          </p>

          <div className="registration-benefits">

            <div className="registration-benefit">

              <div className="benefit-icon">
                📍
              </div>

              <div>
                <strong>
                  Discover Nearby Services
                </strong>

                <span>
                  Find professionals around your location.
                </span>
              </div>

            </div>

            <div className="registration-benefit">

              <div className="benefit-icon">
                ⚡
              </div>

              <div>
                <strong>
                  Fast & Easy Booking
                </strong>

                <span>
                  Book the service you need in just a few steps.
                </span>
              </div>

            </div>

            <div className="registration-benefit">

              <div className="benefit-icon">
                ⭐
              </div>

              <div>
                <strong>
                  Real Ratings & Reviews
                </strong>

                <span>
                  Make decisions using genuine customer feedback.
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* Registration card */}

        <section className="registration-modern-card">

          <div className="registration-card-header">

            <div className="registration-card-icon">
              {isAdmin ? "⚙" : "👤"}
            </div>

            <div>

              <h2>
                {isAdmin
                  ? "Create Admin Account"
                  : "Create Customer Account"}
              </h2>

              <p>
                {isAdmin
                  ? "Register your HyperLocal administrator account."
                  : "Create your account and start exploring local services."}
              </p>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="modern-registration-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}

          {message && (
            <div className="modern-registration-success">
              <span className="success-check">
                ✓
              </span>

              <div>
                <strong>
                  Account created successfully!
                </strong>

                <span>
                  {message}
                </span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="modern-registration-form"
          >

            {/* Name */}

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

            {/* Email */}

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

            {/* Password */}

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
                  placeholder="Create a password"
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

            {/* Terms */}

            <div className="registration-terms">

              <span className="terms-check">
                ✓
              </span>

              <p>
                By creating an account, you agree to
                the HyperLocal terms and privacy policy.
              </p>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="modern-create-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  {isAdmin
                    ? "Create Admin Account"
                    : "Create Customer Account"}

                  <span>
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* Login */}

          <div className="registration-login-link">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              disabled={loading}
            >
              Back to Login
            </button>

          </div>

        </section>

      </main>

      {/* Footer */}

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


/* =========================================================
   APP ROUTES
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegistrationPage />}
        />

        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/provider-job-role"
          element={<ProviderJobRole />}
        />

        <Route
          path="/provider-dashboard"
          element={
            <ProviderDashboard />
          }
        />

        <Route
          path="/provider-register"
          element={
            <ProviderRegistration />
          }
        />

        <Route
          path="/recommendations"
          element={
            <WorkerRecommendations />
          }
        />

        <Route
          path="/booking"
          element={<BookingPage />}
        />

        <Route
          path="/admin-dashboard"
          element={
            <AdminDashboard />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;