"use client";

interface ContentHeaderProps {
  hasSelectedPage: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}

export default function ContentHeader({
  hasSelectedPage,
  saving,
  saved,
  onSave,
}: ContentHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-green-600 font-semibold uppercase tracking-widest">
            Admin
          </p>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">
            Content Management
          </h1>
        </div>
      </div>

      {hasSelectedPage && (
        <button
          onClick={onSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
            saved
              ? "bg-green-50 text-green-700 border border-green-300"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving…
            </>
          ) : saved ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      )}
    </header>
  );
}
