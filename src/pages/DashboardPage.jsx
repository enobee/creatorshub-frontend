// File: src/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import FeedItem from "../components/FeedItem";
import api from "../api";

/**
 * DashboardPage
 * Styled dashboard showing user stats and saved content
 */
export default function DashboardPage() {
  const { token, user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, savedRes] = await Promise.all([
          api.get("/api/user/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/feed/saved-posts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);
        const raw = savedRes.data.posts ?? savedRes.data;
        const postsWithId = Array.isArray(raw)
          ? raw.map((p) => ({ ...p, id: p.postId }))
          : [];
        setSavedPosts(postsWithId);
      } catch (err) {
        console.error("Dashboard fetch error:", err.response);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        Loading dashboard...
      </div>
    );
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col p-4 md:p-8">
        {/* Header */}
        <header className="max-w-7xl w-full mx-auto mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Welcome, {user?.name || "Creator"}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your activity and credits
          </p>
        </header>

        {/* Stats Grid */}
        <section className="max-w-7xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <p className="text-sm font-medium text-gray-500 uppercase">
              Total Credits
            </p>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              {stats.totalCredits}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <p className="text-sm font-medium text-gray-500 uppercase">
              Login Streak
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              {stats.loginStreak} days
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <p className="text-sm font-medium text-gray-500 uppercase">
              Saved Posts
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              {savedPosts.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <p className="text-sm font-medium text-gray-500 uppercase">
              Reported Posts
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              {stats.reportedPosts}
            </p>
          </div>
        </section>

        {/* Saved Content */}
        <section className="flex-1 max-w-7xl w-full mx-auto bg-white p-6 rounded-2xl shadow overflow-hidden">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Saved Content
          </h2>
          {savedPosts.length === 0 ? (
            <p className="text-gray-600">You haven't saved any content yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-[60vh]">
              {savedPosts.map((post) => (
                <FeedItem
                  key={post.id}
                  post={post}
                  isSaved={true}
                  onShare={() => {
                    navigator.clipboard.writeText(post.url);
                    toast.success("Link copied!");
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
