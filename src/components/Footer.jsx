import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p>© 2025 CreatorHub. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
