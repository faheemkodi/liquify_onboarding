import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import InputField from "../components/InputField";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email.";
    if (!form.password) newErrors.password = "Password required.";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = validate();
    if (Object.keys(errors).length) {
      setError(Object.values(errors).join(" "));
      setLoading(false);
      return;
    }
    try {
      await api.post("/api/users/login/", { email: form.email, password: form.password });
      setRedirecting(true);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-10 text-gray-800">
        <h1 className="text-2xl font-semibold mb-8 text-center">Login to Your Account</h1>
        {redirecting ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={error.includes("email") ? error : ""}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={error.includes("Password") ? error : ""}
            />
            {error && !error.includes("email") && !error.includes("Password") && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-medium transition ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        )}
        <div className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
