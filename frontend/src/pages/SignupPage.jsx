import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import InputField from "../components/InputField";
import FileUploadBox from "../components/FileUploadBox";
import Spinner from "../components/Spinner";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    documents: { incorporation: null },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email.";
    if (form.password.length < 8) newErrors.password = "At least 8 characters.";
    const file = form.documents.incorporation;
    if (!file) newErrors.incorporation = "Document is required.";
    else {
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) newErrors.incorporation = "Must be PDF, JPG, PNG.";
      if (file.size > 5 * 1024 * 1024) newErrors.incorporation = "Under 5MB.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleFileChange = (file) => {
    setForm((prev) => ({ ...prev, documents: { incorporation: file } }));
    setErrors({ ...errors, incorporation: undefined });
  };

  const removeFile = () => {
    setForm((prev) => ({ ...prev, documents: { incorporation: null } }));
    setErrors({ ...errors, incorporation: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("incorporation", form.documents.incorporation);
      await api.post("/api/users/signup/", fd);
      await api.post("/api/users/login/", { username: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setErrors(err.response?.data || { general: "Unexpected error." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-10 text-gray-800">
        <h1 className="text-3xl font-semibold mb-8 text-center">Business Account Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <FileUploadBox
            label="Certificate of Incorporation"
            file={form.documents.incorporation}
            onFileChange={handleFileChange}
            onRemove={removeFile}
            error={errors.incorporation}
          />
          {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}
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
              "Create Account"
            )}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
