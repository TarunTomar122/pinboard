"use client";

import { useState, useRef } from "react";

interface TokenSetupProps {
  onComplete: (token: string) => void;
}

export default function TokenSetup({ onComplete }: TokenSetupProps) {
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputRef.current?.value?.trim() || "";
    if (!val) {
      setError("Please paste your token");
      return;
    }

    setValidating(true);
    setError("");
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${val}` },
      });
      if (res.ok) {
        onComplete(val);
      } else {
        setError("Invalid token — check and try again");
        setValidating(false);
      }
    } catch {
      setError("Network error — try again");
      setValidating(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📌</div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Pinboard</h1>
          <p className="text-sm text-[#86868b]">by tarat & margo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              GitHub Personal Access Token
            </label>
            <p className="text-xs text-[#86868b] mb-3">
              Needed to save your pins to the repo. Create one at{" "}
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=pinboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007AFF] hover:underline"
              >
                github.com/settings/tokens
              </a>{" "}
              with <code className="bg-[#f5f5f7] px-1 rounded text-[11px]">repo</code> scope.
            </p>
            <input
              ref={inputRef}
              type="text"
              name="token"
              placeholder="ghp_xx...xxxx"
              autoComplete="off"
              spellCheck={false}
              autoFocus
              className="w-full px-4 py-3 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-shadow"
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={validating}
            className="w-full bg-[#007AFF] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#0066D6] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {validating ? "Checking..." : "Connect"}
          </button>
        </form>

        <p className="text-center text-xs text-[#86868b] mt-6">
          Token is stored locally in your browser. Never shared.
        </p>
      </div>
    </div>
  );
}
