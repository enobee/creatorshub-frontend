import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../api";

export default function PromoteToAdminPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post(`/api/auth/promote/${userId}`, { secret });
      setMessage(res.data.message);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Promotion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <span className="text-2xl font-extrabold text-indigo-600">
            CreatorHub Admin
          </span>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-4">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2 text-center">
            Promote User to Admin
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center">
              {message}
            </div>
          )}

          <p className="text-gray-700 text-center">
            Promoting user with ID:{" "}
            <span className="font-mono text-indigo-600">{userId}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="secret"
                className="block text-gray-700 font-semibold mb-1"
              >
                Admin Secret:
              </label>
              <input
                id="secret"
                type="password"
                required
                placeholder="Enter master admin secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Promoting..." : "Promote to Admin"}
            </button>
          </form>

          {/* Back link */}
          <div className="text-center pt-2">
            <Link to="/admin" className="text-indigo-600 hover:underline">
              &larr; Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
