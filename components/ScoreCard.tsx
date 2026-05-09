import type { ReputationScore } from "@/lib/mock";

function ScoreBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-200">
          {value} / {max}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ score }: { score: ReputationScore }) {
  const tier =
    score.score >= 800 ? "Elite" :
    score.score >= 600 ? "Trusted" :
    score.score >= 400 ? "Active" :
    score.score >= 200 ? "Emerging" : "New";

  const tierColor =
    score.score >= 800 ? "text-yellow-400" :
    score.score >= 600 ? "text-green-400" :
    score.score >= 400 ? "text-blue-400" :
    score.score >= 200 ? "text-purple-400" : "text-gray-400";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
      {/* Score headline */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Reputation Score</p>
          <p className="text-5xl font-bold text-white">{score.score}</p>
          <p className="text-xs text-gray-500 mt-1">out of 1000</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-semibold ${tierColor}`}>{tier}</span>
          <p className="text-xs text-gray-500 mt-1">Ledger #{score.lastUpdated.toLocaleString()}</p>
        </div>
      </div>

      {/* Signal breakdown */}
      <div className="space-y-3">
        <ScoreBar value={score.txCount} max={500} label="Transactions (40%)" />
        <ScoreBar value={score.lpCount} max={100} label="LP Activity (35%)" />
        <ScoreBar value={score.govCount} max={50} label="Governance (25%)" />
      </div>
    </div>
  );
}
