export interface ReputationScore {
  score: number;
  txCount: number;
  lpCount: number;
  govCount: number;
  lastUpdated: number; // ledger sequence
}

// Swap this function body for a real RPC call once the contract is deployed.
export async function getScore(wallet: string): Promise<ReputationScore | null> {
  await new Promise((r) => setTimeout(r, 600)); // simulate network

  // Return null for unknown-looking addresses so the "not scored" state is testable.
  if (wallet.startsWith("GNONE")) return null;

  // Deterministic mock: derive numbers from the wallet string.
  const seed = wallet.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const tx = Math.min(500, (seed * 7) % 600);
  const lp = Math.min(100, (seed * 3) % 120);
  const gov = Math.min(50, (seed * 11) % 60);

  const txScore = Math.floor((tx / 500) * 400);
  const lpScore = Math.floor((lp / 100) * 350);
  const govScore = Math.floor((gov / 50) * 250);

  return {
    score: txScore + lpScore + govScore,
    txCount: tx,
    lpCount: lp,
    govCount: gov,
    lastUpdated: 1234567 + (seed % 10000),
  };
}
