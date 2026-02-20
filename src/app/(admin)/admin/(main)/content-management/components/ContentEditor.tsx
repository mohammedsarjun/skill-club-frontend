"use client";

import { IContentItem } from "@/types/interfaces/IContent";

interface ContentEditorProps {
  page: IContentItem;
  saving: boolean;
  saved: boolean;
  onContentChange: (text: string) => void;
  onTitleChange: (text: string) => void;
  onBack: () => void;
  onSave: () => void;
  onTogglePublish: () => void;
}

export default function ContentEditor({
  page,
  saving,
  saved,
  onContentChange,
  onTitleChange,
  onBack,
  onSave,
  onTogglePublish,
}: ContentEditorProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 font-medium mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Pages
      </button>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-green-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{page.icon}</span>
            <div>
              <input
                type="text"
                value={page.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-full"
              />
              <p className="text-xs text-gray-400">
                Last updated:{" "}
                {new Date(page.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onTogglePublish}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              page.isPublished
                ? "text-green-700 bg-white border border-green-200 hover:bg-green-100"
                : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                page.isPublished ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            {page.isPublished ? "Published" : "Draft"}
          </button>
        </div>

        <textarea
          value={page.content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full min-h-[480px] p-5 text-gray-700 text-sm leading-relaxed resize-none outline-none border-none focus:ring-0"
          placeholder="Enter page content here…"
          spellCheck
        />

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">
            {page.content.length} characters
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                saved
                  ? "bg-green-50 text-green-700 border border-green-300"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
