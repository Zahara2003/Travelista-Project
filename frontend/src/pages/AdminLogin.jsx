import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css"; // 🔴 இந்த CSS இம்போர்ட் விடுபட்டிருந்தது

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, form);
      const data = response.data;

      const user = {
        name: data.name || data.user?.name || "Admin",
        email: data.email || data.user?.email || form.email,
        role: data.role || data.user?.role,
        token: data.token || data.accessToken || null,
      };

      if (user.role !== "admin") {
        alert("Access denied. Administrator account required.");
        setLoading(false);
        return;
      }

      login(user);
      navigate("/admin/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Invalid administrator credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-login-container">
      {/* Left Side: Image with Dark Shadow & Welcome Text */}
      <div className="split-left-pane">
        <div className="overlay-content">
          <h2>Welcome Back,</h2>
          <h1>Travelista Admin</h1>
          <p>Manage destinations, reviews, and secure your platform journey with us.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="split-right-pane">
        <div className="login-form-box">
          <div className="admin-icon-header">⚙️</div>
          <h2>Administrator Login</h2>
          <p className="subtitle">Secure access to Travelista management system.</p>

          <form onSubmit={handleSubmit}>
            <label>Administrator Email</label>
            <input
              type="email"
              name="admin_email"
              placeholder="mail@website.com"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              autoComplete="off"
            />

            <label>Password</label>
            <input
              type="password"
              name="admin_password"
              placeholder="Enter password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="split-login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;