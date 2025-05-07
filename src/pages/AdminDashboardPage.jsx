import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import api from "../api";
import {
  User as UserIcon,
  Users2,
  Award,
  AlertCircle,
  Check,
  X as CloseIcon,
  Menu,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { token } = useContext(AuthContext);

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCredits: 0,
    reportedPosts: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [delta, setDelta] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [mRes, uRes] = await Promise.all([
          api.get("/api/admin/metrics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMetrics(mRes.data);
        setUsers(Array.isArray(uRes.data.users) ? uRes.data.users : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [token]);

  const handleSaveDelta = async (userId, amount) => {
    if (delta === "") {
      toast.error("Please enter a value");
      return;
    }

    try {
      await api.put(
        `/api/admin/user/${userId}/credits`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, credits: u.credits + amount } : u
        )
      );
      setMetrics((prev) => ({
        ...prev,
        totalCredits: prev.totalCredits + amount,
      }));
      toast.success(
        `Credits ${amount >= 0 ? "added" : "deducted"}: ${Math.abs(amount)}`
      );
    } catch {
      toast.error("Failed to update credits");
    } finally {
      setEditingId(null);
      setDelta("");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading admin dashboard...
      </div>
    );
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden p-4 bg-indigo-800 text-white flex justify-between items-center">
        <h1 className="font-bold text-xl">Admin Dashboard</h1>
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

      <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-x-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 hidden md:block">
          Admin Dashboard
        </h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow flex items-center">
            <Users2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 mr-2 md:mr-3 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Users</p>
              <p className="text-lg md:text-xl font-bold">
                {metrics.totalUsers}
              </p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow flex items-center">
            <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 mr-2 md:mr-3 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Active Users</p>
              <p className="text-lg md:text-xl font-bold">
                {metrics.activeUsers}
              </p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow flex items-center">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 mr-2 md:mr-3 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Credits</p>
              <p className="text-lg md:text-xl font-bold">
                {metrics.totalCredits}
              </p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 mr-2 md:mr-3 flex-shrink-0" />
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Reported Posts</p>
              <p className="text-lg md:text-xl font-bold">
                {metrics.reportedPosts}
              </p>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-max">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Name</th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    Email
                  </th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm">Role</th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    Credits
                  </th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm hidden md:table-cell">
                    Registered
                  </th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm hidden md:table-cell">
                    Profile
                  </th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm hidden lg:table-cell">
                    Last Login
                  </th>
                  <th className="px-2 md:px-4 py-2 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-gray-50 text-xs md:text-sm"
                  >
                    <td className="px-2 md:px-4 py-2">{u.name}</td>
                    <td className="px-2 md:px-4 py-2 truncate max-w-[120px] md:max-w-none">
                      {u.email}
                    </td>
                    <td className="px-2 md:px-4 py-2 lowercase">{u.role}</td>
                    <td className="px-2 md:px-4 py-2">{u.credits}</td>
                    <td className="px-2 md:px-4 py-2 hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 md:px-4 py-2 hidden md:table-cell">
                      {u.isProfileComplete ? "Completed" : "Incomplete"}
                    </td>
                    <td className="px-2 md:px-4 py-2 hidden lg:table-cell">
                      {new Date(u.lastLoginDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 md:px-4 py-2">
                      {editingId === u.id ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <input
                            type="number"
                            value={delta}
                            onChange={(e) => setDelta(e.target.value)}
                            placeholder="Enter amount"
                            className="w-20 md:w-24 p-1 border rounded text-center text-xs md:text-sm"
                          />
                          <div className="flex gap-1 md:gap-2">
                            <button
                              onClick={() =>
                                handleSaveDelta(
                                  u.id,
                                  +Math.abs(Number(delta) || 0)
                                )
                              }
                              className="px-2 md:px-3 py-1 bg-green-500 text-white rounded text-xs md:text-sm hover:bg-green-600"
                            >
                              Add
                            </button>
                            <button
                              onClick={() =>
                                handleSaveDelta(
                                  u.id,
                                  -Math.abs(Number(delta) || 0)
                                )
                              }
                              className="px-2 md:px-3 py-1 bg-red-500 text-white rounded text-xs md:text-sm hover:bg-red-600"
                            >
                              Subtract
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setDelta("");
                              }}
                              className="p-1 text-gray-500 hover:text-gray-700"
                            >
                              <CloseIcon size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 md:gap-2">
                          <button
                            onClick={() => setEditingId(u.id)}
                            className="px-2 py-1 border rounded text-indigo-600 text-xs md:text-sm hover:bg-indigo-50"
                          >
                            Add/Deduct Credits
                          </button>
                          <Link
                            to={`/promote/${u.id}`}
                            className="px-2 py-1 border rounded text-green-600 text-xs md:text-sm hover:bg-green-50"
                          >
                            Promote
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
