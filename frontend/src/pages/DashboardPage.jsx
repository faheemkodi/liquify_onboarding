import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import FileUploadBox from "../components/FileUploadBox";
import Spinner from "../components/Spinner";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/applications/me/")
      .then((res) => setApp(res.data))
      .catch(() => setError("Could not load application."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout/");
      navigate("/");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  const handleFileChange = (docType, file) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setFileErrors((prev) => ({ ...prev, [docType]: "Must be PDF, JPG, PNG." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileErrors((prev) => ({ ...prev, [docType]: "File must be under 5MB." }));
      return;
    }
    setFiles((prev) => ({ ...prev, [docType]: file }));
    setFileErrors((prev) => ({ ...prev, [docType]: "" }));
  };

  const handleReupload = async (docType) => {
    const file = files[docType];
    if (!file) return;
    setUploading(true);
    setFileErrors((prev) => ({ ...prev, [docType]: "" }));

    const fd = new FormData();
    fd.append("file", file);
    fd.append("doc_type", docType);

    try {
      await api.post("/api/applications/me/reupload/", fd);
      const updated = await api.get("/api/applications/me/");
      setApp(updated.data);
      setFiles((prev) => ({ ...prev, [docType]: null }));
    } catch (err) {
      const apiError = err.response?.data;
      setFileErrors((prev) => ({
        ...prev,
        [docType]: Array.isArray(apiError) ? apiError[0] : "Re-upload failed.",
      }));
    }
    setUploading(false);
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative">
      <button
        onClick={handleLogout}
        className="cursor-pointer absolute top-6 right-6 text-sm text-gray-600 hover:text-blue-600 transition"
      >
        Logout
      </button>

      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-10 text-gray-800">
        <h1 className="text-3xl font-semibold mb-8 text-center">Your Application</h1>

        <div className="space-y-6">
          {app.documents.map((doc) => (
            <div key={doc.doc_type} className="border border-gray-200 rounded-md p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {doc.doc_type.replace("_", " ").toUpperCase()}
                  </p>
                  <p
                    className={`text-sm ${
                      doc.status === "Approved"
                        ? "text-green-600"
                        : doc.status === "Pushback"
                          ? "text-orange-600"
                          : doc.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                    }`}
                  >
                    {doc.status}
                  </p>
                </div>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Document
                </a>
              </div>

              {doc.status === "Pushback" && (
                <>
                  <p className="text-sm text-gray-600">
                    Pushback Reason: <span className="text-gray-800">{doc.pushback_reason}</span>
                  </p>
                  <FileUploadBox
                    label={`Re-upload ${doc.doc_type}`}
                    file={files[doc.doc_type]}
                    onFileChange={(file) => handleFileChange(doc.doc_type, file)}
                    onRemove={() => {
                      setFiles((prev) => ({ ...prev, [doc.doc_type]: null }));
                      setFileErrors((prev) => ({ ...prev, [doc.doc_type]: "" }));
                    }}
                    error={fileErrors[doc.doc_type]}
                  />
                  <button
                    onClick={() => handleReupload(doc.doc_type)}
                    disabled={!files[doc.doc_type] || uploading}
                    className={`w-full py-3 rounded-md text-white font-medium transition ${
                      !files[doc.doc_type] || uploading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {uploading ? <Spinner /> : "Submit New Document"}
                  </button>
                </>
              )}
            </div>
          ))}

          {app.documents.every((doc) => doc.status !== "Pushback") && (
            <p className="text-sm text-gray-500 text-center">
              No additional actions needed at this stage.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
