import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Active Tab: 'tourist' | 'register' | 'admin'
  const [activeTab, setActiveTab] = useState("tourist");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg("");
    setForm({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (activeTab === "tourist") {
        // Tourist Login
        const res = await axios.post(`${API}/auth/login`, {
          email: form.email,
          password: form.password,
        });
        
        if (res.data.role === "admin") {
          setErrorMsg("Admins must use the Admin tab to log in.");
          setLoading(false);
          return;
        }

        login({
          name: res.data.name || res.data.user?.name || "Tourist",
          email: res.data.email || form.email,
          role: "tourist",
          token: res.data.token || res.data.accessToken,
        });
        navigate("/dashboard");

      } else if (activeTab === "register") {
        // Tourist Sign Up / Register
        await axios.post(`${API}/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
          role: "tourist",
        });
        alert("Account created successfully! Please log in.");
        setActiveTab("tourist");

      } else if (activeTab === "admin") {
        // Admin Login
        const res = await axios.post(`${API}/auth/login`, {
          email: form.email,
          password: form.password,
        });

        const userRole = res.data.role || res.data.user?.role;
        if (userRole !== "admin") {
          setErrorMsg("Access denied. Administrator account required.");
          setLoading(false);
          return;
        }

        login({
          name: res.data.name || res.data.user?.name || "Admin",
          email: res.data.email || form.email,
          role: "admin",
          token: res.data.token || res.data.accessToken,
        });
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-wrapper">
      <div className="tabbed-auth-card">
        
        {/* Top Header Badge */}
        <div className="auth-header-icon">
          <span>🛡️</span>
        </div>

        <h2>
          {activeTab === "admin"
            ? "Admin Access"
            : activeTab === "register"
            ? "Create Account"
            : "Welcome Back"}
        </h2>
        
        <p className="auth-subtitle">
          {activeTab === "admin"
            ? "Access directory controls & destination settings."
            : activeTab === "register"
            ? "Join Travelista to plan your local trips."
            : "Log in to view your saved itineraries."}
        </p>

        {/* Tab Switcher Buttons */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === "tourist" ? "active" : ""}`}
            onClick={() => handleTabChange("tourist")}
          >
            Tourist Login
          </button>
          
          <button
            className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => handleTabChange("register")}
          >
            Sign Up
          </button>

          <button
            className={`tab-btn ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => handleTabChange("admin")}
          >
            Admin
          </button>
        </div>

        {errorMsg && <div className="tab-error-banner">⚠️ {errorMsg}</div>}

        {/* Form Fields with autoComplete protection */}
        <form onSubmit={handleSubmit} className="tabbed-form" autoComplete="off">
          {activeTab === "register" && (
            <div className="input-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                autoComplete="off"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="input-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder={
                activeTab === "admin"
                  ? "admin@travelista.lk"
                  : "tourist@example.com"
              }
              required
              autoComplete="off"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="input-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="tabbed-submit-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : activeTab === "admin"
              ? "Login to Admin Dashboard"
              : activeTab === "register"
              ? "Register Account"
              : "Login to Dashboard"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;