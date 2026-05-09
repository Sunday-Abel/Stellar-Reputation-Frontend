# Frontend Architecture

This document is the single source of truth for how the frontend is structured, how it connects to the contract, and what remains to be built.

---

## Current State

The UI is fully built and functional with a **mock data layer**. It runs independently of the contract. The mock will be swapped for a real Soroban RPC call once the contract is deployed to testnet (Phase 5.1 of the main repo).

---

## Data Flow

```
User enters wallet address
        │
        ▼
WalletLookup (client component)
        │  calls
        ▼
lib/reputation.ts  ──── getScore(wallet)
        │
        │  TODAY: returns mock data (lib/mock.ts)
        │  AFTER DEPLOYMENT: calls Soroban RPC
        ▼
ReputationScore { score, txCount, lpCount, govCount, lastUpdated }
        │
        ▼
ScoreCard (display component)
```

---

## Directory Structure

```
stellar-reputation-frontend/
├── app/
│   ├── layout.tsx          # Root layout, metadata, font
│   └── page.tsx            # Home page — composes WalletLookup + formula panel
├── components/
│   ├── WalletLookup.tsx    # Search form + state machine (idle/loading/found/not_found/error)
│   └── ScoreCard.tsx       # Score display: headline number, tier badge, signal bars
├── lib/
│   └── mock.ts             # Data layer — TODAY mock, REPLACE with RPC after deployment
├── .github/workflows/
│   └── ci.yml              # lint + build on every push/PR
└── ARCHITECTURE.md         # this file
```

---

## Implementation Plan

### Phase A — UI (complete ✅)

Everything in this phase is done and ships with mock data.

| Item | File | Status |
|------|------|--------|
| Wallet lookup form | `components/WalletLookup.tsx` | ✅ |
| Score display card | `components/ScoreCard.tsx` | ✅ |
| Tier labels (New → Elite) | `components/ScoreCard.tsx` | ✅ |
| Signal breakdown bars | `components/ScoreCard.tsx` | ✅ |
| Scoring formula panel | `app/page.tsx` | ✅ |
| Mock data layer | `lib/mock.ts` | ✅ |
| CI (lint + build) | `.github/workflows/ci.yml` | ✅ |

---

### Phase B — Live Data (blocked on contract deployment)

Depends on: contract deployed to testnet (main repo Phase 5.1) and SDK `getScore` implemented (main repo Phase 3.1).

**Step 1 — Add `@stellar/stellar-sdk` to the frontend**

```sh
npm install @stellar/stellar-sdk
```

**Step 2 — Replace `lib/mock.ts` with a real RPC call**

Rename `lib/mock.ts` → `lib/reputation.ts` and replace the `getScore` body:

```ts
import { Contract, Networks, SorobanRpc, scValToNative, xdr } from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "https://soroban-testnet.stellar.org";
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID!;

export async function getScore(wallet: string): Promise<ReputationScore | null> {
  const server = new SorobanRpc.Server(RPC_URL);
  const contract = new Contract(CONTRACT_ID);

  const tx = /* build simulation tx calling get_score(wallet) */;
  const result = await server.simulateTransaction(tx);

  // decode Option<ReputationScore> ScVal → ReputationScore | null
  // return null for None, mapped object for Some
}
```

The exact implementation follows the pattern in `sdk/src/client.ts` in the main repo (Phase 3.1).

**Step 3 — Add env vars**

Create `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ID=C...
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
```

Add these as GitHub Actions secrets for CI/CD.

**Step 4 — Update imports**

In `components/WalletLookup.tsx`, change:
```ts
import { getScore } from "@/lib/mock";
→
import { getScore } from "@/lib/reputation";
```

No other files need to change — the `ReputationScore` type and `getScore` signature stay identical.

---

### Phase C — Polish (post live data)

| Item | Notes |
|------|-------|
| Wallet address validation | Reject non-G... addresses before hitting RPC |
| URL-based lookup | `/?wallet=G...` so scores are shareable links |
| Search history | `localStorage` — last 5 looked-up wallets |
| Score history chart | If the contract emits events, plot score over time |
| Leaderboard page | `/leaderboard` — top scored wallets (needs indexer) |
| Deploy to Vercel | Add `NEXT_PUBLIC_CONTRACT_ID` env var in Vercel dashboard |

---

## Key Design Decisions

**Mock-first development.** The UI was built before the contract was deployed. The data layer (`lib/mock.ts`) is the only file that changes when going live — all components are already wired to the correct types.

**No state management library.** The app is simple enough that `useState` in `WalletLookup` covers all state. Add Zustand or React Query only if Phase C features require it.

**Server vs client components.** `app/page.tsx` is a server component (static shell). `WalletLookup` is a client component (`"use client"`) because it needs `useState`. `ScoreCard` is a pure display component — no directive needed.

**Environment variables.** `NEXT_PUBLIC_` prefix exposes vars to the browser bundle. The contract ID and RPC URL are not secrets so this is fine. The admin keypair (for `setScore`) never touches the frontend.

---

## Dependency on Main Repo

| Frontend needs | Main repo provides | Status |
|---|---|---|
| `ReputationScore` type shape | Contract struct definition | ✅ defined in `contracts/reputation/src/lib.rs` |
| `getScore(wallet)` RPC call | `sdk/src/client.ts` Phase 3.1 | ❌ not yet implemented |
| Deployed contract ID | Phase 5.1 | ❌ not yet deployed |
