import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    terms: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
    if (formError) setFormError("");
  };

  const validate = () => {
    const errors = { name: "", email: "", contactNumber: "", password: "", terms: "" };
    let isValid = true;

    if (!form.name.trim()) { errors.name = "Please enter your full name."; isValid = false; }
    if (!form.email.trim()) {
      errors.email = "Please enter your email address."; isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Please enter a valid email address."; isValid = false;
    }
    if (!form.contactNumber.trim()) { errors.contactNumber = "Please enter your contact number."; isValid = false; }
    if (!form.password) {
      errors.password = "Please create a password."; isValid = false;
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters."; isValid = false;
    }
    if (!agreed) { errors.terms = "You must agree to the terms and conditions."; isValid = false; }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, form);
      setSuccessMessage("Registration successful! Redirecting you to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      if (message.toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({ ...prev, email: message }));
      } else {
        setFormError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


      <div className="modern-auth-wrapper">
        <div className="modern-auth-card">
          
          {/* LEFT IMAGE SECTION */}
          <div className="modern-left-blue">
            <div className="blue-overlay-content">
              <div className="auth-brand">
                <div className="auth-brand-icon">✈</div>
                <span>Travelista</span>
              </div>
              <div className="auth-left-content">
                <span className="badge">DISCOVER • PLAN • EXPLORE</span>
                <h1>Start your<br />Akkaraipattu<br />adventure.</h1>
                <p className="auth-description">
                  Discover beautiful places, plan your perfect one-day trip and explore the hidden attractions around Akkaraipattu.
                </p>
              </div>
              <div className="auth-image-footer">
                <span>📍 Akkaraipattu, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* RIGHT REGISTER SECTION - FROSTED GLASS */}
          <div className="modern-right-white frosted-glass-panel">
            <div className="login-form-container">
              <div className="form-header">
                <p className="welcome-text">NEW USER</p>
                <h2>Create an account</h2>
                <p className="subtitle">Join Travelista and start planning your perfect day trip.</p>
              </div>

              {formError && (
                <div className="form-error-banner">
                  <span className="error-icon">⚠</span><span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="form-error-banner" style={{ background: "rgba(45, 106, 45, 0.2)", borderColor: "#4caf50", color: "#81c784" }}>
                  <span className="error-icon">✅</span><span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form" noValidate>
                <div className={`input-group ${fieldErrors.name ? "has-error" : ""}`}>
                  <label htmlFor="name">Full Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input id="name" type="text" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} />
                  </div>
                  {fieldErrors.name && <p className="field-error"><span className="error-icon">⚠</span>{fieldErrors.name}</p>}
                </div>

                <div className={`input-group ${fieldErrors.email ? "has-error" : ""}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <span className="input-icon">✉</span>
                    <input id="email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  </div>
                  {fieldErrors.email && <p className="field-error"><span className="error-icon">⚠</span>{fieldErrors.email}</p>}
                </div>

                <div className={`input-group ${fieldErrors.contactNumber ? "has-error" : ""}`}>
                  <label htmlFor="contactNumber">Contact Number</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📞</span>
                    <input id="contactNumber" type="tel" name="contactNumber" placeholder="Enter your phone number" value={form.contactNumber} onChange={handleChange} />
                  </div>
                  {fieldErrors.contactNumber && <p className="field-error"><span className="error-icon">⚠</span>{fieldErrors.contactNumber}</p>}
                </div>

                <div className={`input-group ${fieldErrors.password ? "has-error" : ""}`}>
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🔒</span>
                    <input id="password" type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" value={form.password} onChange={handleChange} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <p className="field-error"><span className="error-icon">⚠</span>{fieldErrors.password}</p>
                  ) : (
                    <p className="field-hint">Minimum 8 characters</p>
                  )}
                </div>

                <div className="terms-row">
                  <input type="checkbox" id="terms" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); if (fieldErrors.terms) setFieldErrors((prev) => ({ ...prev, terms: "" })); }} />
                  <label htmlFor="terms">I agree to the terms and conditions.</label>
                </div>
                {fieldErrors.terms && (
                  <p className="field-error" style={{ marginTop: "-14px", marginBottom: "14px" }}>
                    <span className="error-icon">⚠</span>{fieldErrors.terms}
                  </p>
                )}

                <button type="submit" className="modern-submit-btn" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <span className="button-arrow">→</span>}
                </button>
              </form>

              <p className="modern-footer">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;