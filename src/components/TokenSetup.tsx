"use client";

import { useState } from "react";

interface TokenSetupProps {
  onComplete: (token: string) => void;
}

export default function TokenSetup({ onComplete }: TokenSetupProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) return;

    // Validate token by trying to access the repo
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${trimmed}` },
      });
      if (res.ok) {
        onComplete(trimmed);
      } else {
        setError("Invalid token — check and try again");
      }
    } catch {
      setError("Network error — try again");
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
              </a>
              {" "}with <code className="bg-[#f5f5f7] px-1 rounded text-[11px]">repo</code> scope.
            </p>
            <input
              type="password"
              value={token}
              onChange={(e) => { setToken(e.target.value); setError(""); }}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-shadow"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!token.trim()}
            className="w-full bg-[#007AFF] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#0066D6] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Connect
          </button>
        </form>

        <p className="text-center text-xs text-[#86868b] mt-6">
          Token is stored locally in your browser. Never shared.
        </p>
      </div>
    </div>
  );
}
