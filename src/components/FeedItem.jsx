import React from "react";
import { Bookmark, Share2, AlertCircle } from "lucide-react";

export default function FeedItem({ post, isSaved, onSave, onShare, onReport }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center mb-3">
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold mr-3">
          {post.source.charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-500 text-sm uppercase tracking-wide">
          {post.source}
        </span>
      </div>

      {/* Title/Text */}
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 truncate">
        {post.title || post.text}
      </h3>

      {/* Image Preview (increased height) */}
      {post.url && post.url.match(/\.(jpeg|jpg|gif|png)$/) && (
        <div className="w-full h-56 sm:h-64 mb-4 overflow-hidden rounded-lg">
          <img
            src={post.url}
            alt={post.title || "feed image"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body Text */}
      {post.text && (
        <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-3">
          {post.text}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
        {isSaved ? (
          <button
            onClick={onShare}
            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600"
          >
            <Share2 size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>
        ) : (
          <>
            {onSave && (
              <button
                onClick={onSave}
                className="flex items-center gap-1 text-gray-600 hover:text-indigo-600"
              >
                <Bookmark size={18} />
                <span className="text-sm font-medium">Save</span>
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-1 text-gray-600 hover:text-indigo-600"
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            )}
            {onReport && (
              <button
                onClick={onReport}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600"
              >
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Report</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
