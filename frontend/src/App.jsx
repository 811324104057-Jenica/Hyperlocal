import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard/ProviderDashboard";
import ProviderJobRole from "./pages/ProviderJobRole";
import ProviderRegistration from "./pages/ProviderRegistration";
import CustomerRegistration from "./pages/CustomerRegistration";
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

  const handleRegisterClick = () => {
    if (role === "provider") {
      navigate("/provider-register");
    } else if (role === "customer") {
      navigate("/customer-register");
    } else {
      navigate("/register?role=admin");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim() || !password) {
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
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      setMessage(`Login successful. Welcome ${data.name}!`);

      if (data.role === "customer") {
        navigate("/dashboard");
        return;
      }

      if (data.role === "provider") {
        if (!data.workerId) {
          navigate("/provider-job-role");
          return;
        }

        try {
          const workerResponse = await fetch(
            `http://localhost:8080/api/workers/${data.workerId}`
          );

          if (!workerResponse.ok) {
            navigate("/provider-job-role");
            return;
          }

          const worker = await workerResponse.json();

          if (
            !worker.service ||
            worker.service.trim().toLowerCase() === "pending"
          ) {
            navigate("/provider-job-role");
          } else {
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

        return;
      }

      if (data.role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">H</div>

          <div>
            <h2>HyperLocal</h2>
            <span>LOCAL SERVICES. SIMPLIFIED.</span>
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
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            About
          </a>

          <button
            type="button"
            className="nav-register"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="main-container">
        <section className="intro">
          <div className="trust-badge">
            <span>●</span>
            TRUSTED LOCAL MARKETPLACE
          </div>

          <h1>
            Local services,
            <br />
            <span>right at your doorstep.</span>
          </h1>

          <p className="intro-text">
            Find trusted professionals near you for home services,
            repairs, cleaning, electrical work and more.
          </p>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <div>
                <h3>Verified Professionals</h3>
                <p>
                  Connect with trusted and verified local professionals.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <div>
                <h3>Quick &amp; Easy Booking</h3>
                <p>
                  Find and book local services quickly and easily.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">★</div>
              <div>
                <h3>Ratings &amp; Reviews</h3>
                <p>
                  Choose professionals using real customer feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGIN FORM */}
        <section className="login-section">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">H</div>
              <h2>Welcome to HyperLocal</h2>
              <p>Connect with trusted local service professionals</p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="role-selector">
              <button
                type="button"
                className={role === "customer" ? "role active" : "role"}
                onClick={() => setRole("customer")}
              >
                <span>👤</span>
                <small>Customer</small>
              </button>

              <button
                type="button"
                className={role === "provider" ? "role active" : "role"}
                onClick={() => setRole("provider")}
              >
                <span>🛠️</span>
                <small>Provider</small>
              </button>

              <button
                type="button"
                className={role === "admin" ? "role active" : "role"}
                onClick={() => setRole("admin")}
              >
                <span>⚙️</span>
                <small>Admin</small>
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="password-title">
                  <label>Password</label>

                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setError(
                        "Please contact support to reset your password."
                      );
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="remember">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
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
                  <span className="success-icon">✓</span>
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
                {loading ? "Logging in..." : "Login"}
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

      {/* ABOUT */}
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
        <h2>About HyperLocal</h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "15px auto",
            color: "#716b80",
            lineHeight: "1.7",
          }}
        >
          HyperLocal connects customers with trusted local service
          professionals. Customers can discover, compare and book nearby
          professionals for their everyday service needs.
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <div>© 2026 HyperLocal Services Marketplace</div>

        <div>
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   ADMIN REGISTRATION
   Old customer registration URLs redirect to the OTP page.
========================================================= */

function RegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAdmin = searchParams.get("role") === "admin";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setMessage("");
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
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(data.message || "Admin registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Admin registration error:", err);
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Never show the old, non-OTP customer registration form.
  if (!isAdmin) {
    return <Navigate to="/customer-register" replace />;
  }

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
          <span className="registration-brand-logo">H</span>
          <span>HyperLocal</span>
        </button>

        <div className="registration-secure">
          🔒 Secure Registration
        </div>
      </div>

      <main className="registration-modern-container">
        <section className="registration-info">
          <div className="registration-small-badge">
            ⚙ ADMIN ACCESS
          </div>

          <h1>
            Manage the <span>HyperLocal</span> marketplace.
          </h1>

          <p>
            Create your administrator account and manage the HyperLocal
            marketplace from one secure platform.
          </p>

          <div className="registration-benefits">
            <div className="registration-benefit">
              <div className="benefit-icon">📍</div>
              <div>
                <strong>Marketplace Management</strong>
                <span>Manage services available on HyperLocal.</span>
              </div>
            </div>

            <div className="registration-benefit">
              <div className="benefit-icon">⚡</div>
              <div>
                <strong>Quick Administration</strong>
                <span>Access your administration tools easily.</span>
              </div>
            </div>

            <div className="registration-benefit">
              <div className="benefit-icon">⭐</div>
              <div>
                <strong>Trusted Marketplace</strong>
                <span>Help maintain a reliable service experience.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="registration-modern-card">
          <div className="registration-card-header">
            <div className="registration-card-icon">⚙</div>

            <div>
              <h2>Create Admin Account</h2>
              <p>Register your HyperLocal administrator account.</p>
            </div>
          </div>

          {error && (
            <div className="modern-registration-error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="modern-registration-success" role="status">
              <span className="success-check">✓</span>
              <div>
                <strong>Registration successful</strong>
                <span>{message}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="modern-registration-form"
          >
            <div className="modern-field">
              <label htmlFor="admin-name">Full Name</label>

              <div className="modern-input">
                <span>👤</span>
                <input
                  id="admin-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="modern-field">
              <label htmlFor="admin-email">Email Address</label>

              <div className="modern-input">
                <span>✉</span>
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="modern-field">
              <label htmlFor="admin-password">Password</label>

              <div className="modern-input">
                <span>🔒</span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="modern-password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <small>
                Password must contain at least 6 characters.
              </small>
            </div>

            <div className="registration-terms">
              <span className="terms-check">✓</span>
              <p>
                By creating an account, you agree to the HyperLocal terms
                and privacy policy.
              </p>
            </div>

            <button
              type="submit"
              className="modern-create-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
              <span>→</span>
            </button>
          </form>

          <div className="registration-login-link">
            <span>Already have an account?</span>
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
        <span>© 2026 HyperLocal Services Marketplace</span>
        <span>Secure • Local • Trusted</span>
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
        <Route path="/" element={<LoginPage />} />

        {/* Customer registration with email OTP */}
        <Route
          path="/customer-register"
          element={<CustomerRegistration />}
        />

        {/* Admin registration; old customer links redirect above */}
        <Route path="/register" element={<RegistrationPage />} />

        {/* Customer dashboards */}
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

        {/* Provider pages */}
        <Route path="/provider-job-role" element={<ProviderJobRole />} />
        <Route
          path="/provider-dashboard"
          element={<ProviderDashboard />}
        />
        <Route
          path="/provider-register"
          element={<ProviderRegistration />}
        />

        {/* Other pages */}
        <Route
          path="/recommendations"
          element={<WorkerRecommendations />}
        />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;