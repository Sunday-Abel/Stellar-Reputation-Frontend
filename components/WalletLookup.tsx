"use client";

import { useState } from "react";
import { getScore, type ReputationScore } from "@/lib/mock";
import ScoreCard from "@/components/ScoreCard";

type State = "idle" | "loading" | "found" | "not_found" | "error";

export default function WalletLookup() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<ReputationScore | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const wallet = input.trim();
    if (!wallet) return;

    setState("loading");
    setResult(null);

    try {
      const score = await getScore(wallet);
      if (score) {
        setResult(score);
        setState("found");
      } else {
        setState("not_found");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Stellar wallet address (G...)"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Stellar wallet address"
        />
        <button
          type="submit"
          disabled={state === "loading" || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
        >
          {state === "loading" ? "Looking up…" : "Look up"}
        </button>
      </form>

      {state === "found" && result && <ScoreCard score={result} />}

      {state === "not_found" && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center text-gray-400">
          This wallet has not been scored yet.
        </div>
      )}

      {state === "error" && (
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 text-center text-red-400">
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}
