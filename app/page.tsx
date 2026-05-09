import WalletLookup from "@/components/WalletLookup";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-xl mx-auto px-4 py-16 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Stellar Reputation
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Look up any Stellar wallet&apos;s on-chain reputation score — based on
            transaction history, liquidity provision, and governance participation.
          </p>
        </div>

        {/* Lookup */}
        <WalletLookup />

        {/* Formula reference */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Scoring Formula
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-indigo-400 font-semibold">40%</p>
              <p className="text-gray-400 text-xs mt-1">Transactions</p>
              <p className="text-gray-500 text-xs">cap 500</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-indigo-400 font-semibold">35%</p>
              <p className="text-gray-400 text-xs mt-1">LP Activity</p>
              <p className="text-gray-500 text-xs">cap 100</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-indigo-400 font-semibold">25%</p>
              <p className="text-gray-400 text-xs mt-1">Governance</p>
              <p className="text-gray-500 text-xs">cap 50</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600">
          Currently using mock data — live scores available after contract deployment.
        </p>
      </div>
    </main>
  );
}
