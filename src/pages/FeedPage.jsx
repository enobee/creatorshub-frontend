// File: src/pages/FeedPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import FeedItem from "../components/FeedItem";
import { toast } from "react-toastify";
import api from "../api";

export default function FeedPage() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await api.get("/api/feed/personalized", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.combined || []);
      } catch (err) {
        console.error("Feed fetch error:", err.response || err);
        setError(err.response?.data?.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchFeed();
  }, [token]);

  const handleAction = async (postId, source, url, action) => {
    try {
      await api.post(
        `/api/feed/${action}`,
        { postId, source, url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (action === "save") toast.success("Content saved! +5 credits earned");
      if (action === "report") {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.warn("Content reported. Thank you!");
      }
    } catch {
      const label = action.charAt(0).toUpperCase() + action.slice(1);
      toast.error(`${label} failed`);
    }
  };

  const handleShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Copy failed");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        Loading feed...
      </div>
    );
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-4">Content Feed</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <FeedItem
              key={post.id}
              post={post}
              isSaved={false}
              onSave={() =>
                handleAction(post.id, post.source, post.url, "save")
              }
              onUnsave={null}
              onShare={() => handleShare(post.url)}
              onReport={() =>
                handleAction(post.id, post.source, post.url, "report")
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
