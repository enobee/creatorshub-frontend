import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { Menu } from "lucide-react";

export default function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    country: "",
    preferences: [],
    lastLoginDate: null,
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profRes, creditsRes] = await Promise.all([
          api.get("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/user/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const userData = profRes.data;
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          country: userData.country || "",
          preferences: userData.preferences || [],
          lastLoginDate: userData.lastLoginDate || null,
        });
        setStats(creditsRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "preferences") {
      // split by comma, remove extra spaces
      const prefs = value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      setProfile((prev) => ({ ...prev, preferences: prefs }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.put(
        "/api/user/update-profile",
        {
          bio: profile.bio,
          country: profile.country,
          preferences: profile.preferences,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setStats((prev) => ({ ...prev, totalCredits: res.data.credits }));
      setEditMode(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-indigo-600">Loading profile...</div>
      </div>
    );
  }
  if (error && !editMode) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile header with menu toggle */}
      <div className="md:hidden p-4 bg-indigo-800 text-white flex justify-between items-center">
        <h1 className="font-bold text-xl">Your Profile</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-indigo-900 text-white`}
      >
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 hidden md:block">
          Your Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md md:shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-indigo-600">
              Profile Information
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
              <div className="h-16 w-16 md:h-20 md:w-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl md:text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="mt-2 sm:mt-0">
                <p className="text-base md:text-lg font-medium">
                  {profile.name}
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  {profile.email}
                </p>
              </div>
            </div>

            {!editMode ? (
              <div className="space-y-2 text-sm md:text-base">
                <p>
                  <span className="font-semibold">Bio:</span>{" "}
                  {profile.bio || "—"}
                </p>
                <p>
                  <span className="font-semibold">Country:</span>{" "}
                  {profile.country || "—"}
                </p>
                <p>
                  <span className="font-semibold">Preferences:</span>{" "}
                  {profile.preferences.length > 0
                    ? profile.preferences.join(", ")
                    : "—"}
                </p>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setError("");
                  }}
                  className="mt-4 md:mt-6 px-4 md:px-5 py-1.5 md:py-2 bg-indigo-600 text-white text-sm md:text-base rounded-md md:rounded-lg hover:bg-indigo-700 transition"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm md:text-base">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm md:text-base">
                    Country
                  </label>
                  <input
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm md:text-base">
                    Preferences (comma-separated)
                  </label>
                  <input
                    name="preferences"
                    value={profile.preferences.join(", ")}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-4 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto px-4 md:px-5 py-1.5 md:py-2 bg-indigo-600 text-white text-sm md:text-base rounded-md md:rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="w-full sm:w-auto mt-2 sm:mt-0 px-4 md:px-5 py-1.5 md:py-2 border border-gray-300 text-sm md:text-base rounded-md md:rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
                {error && (
                  <p className="text-red-600 text-sm md:text-base mt-2">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md md:shadow-lg flex flex-col justify-between">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-indigo-600">
              Your Stats
            </h2>
            {stats && (
              <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                <li className="flex justify-between items-center py-1">
                  <span className="font-medium">Total Credits:</span>
                  <span className="text-indigo-600 font-bold">
                    {stats.totalCredits}
                  </span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="font-medium">Profile Complete:</span>
                  <span
                    className={
                      profile.bio &&
                      profile.country &&
                      profile.preferences.length > 0
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {profile.bio &&
                    profile.country &&
                    profile.preferences.length > 0
                      ? "Yes"
                      : "No"}
                  </span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="font-medium">Last Login:</span>
                  <span>
                    {profile.lastLoginDate
                      ? new Date(profile.lastLoginDate).toLocaleDateString()
                      : "—"}
                  </span>
                </li>
              </ul>
            )}

            {/* Empty div to push the stats up when content is minimal */}
            <div className="flex-grow"></div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
              <p>Complete your profile to earn additional credits!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
