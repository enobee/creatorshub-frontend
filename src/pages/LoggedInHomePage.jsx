import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function LoggedInHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between">
          <span className="text-2xl font-extrabold text-indigo-600">
            CreatorHub
          </span>
          <div className="mt-2 md:mt-0">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm md:text-base bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <header className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          Welcome back to <span className="text-indigo-600">CreatorHub</span>
        </h1>
        <p className="text-gray-600 mb-6 max-w-2xl text-base md:text-lg">
          Manage your creator profile, earn more credits, and explore fresh
          content tailored just for you.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 text-sm md:text-base"
        >
          Go to Dashboard
        </Link>
      </header>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Track Credits</h3>
            <p className="text-gray-600 text-sm">
              See your current credits and streaks at a glance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Content Feed</h3>
            <p className="text-gray-600 text-sm">
              Jump straight into your personalized content stream.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Dashboard Analytics</h3>
            <p className="text-gray-600 text-sm">
              Dive into detailed activity insights and trends.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
