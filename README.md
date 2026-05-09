# Stellar Reputation — Frontend

Next.js frontend for the [Stellar On-Chain Reputation System](https://github.com/Sunday-Abel/Stellar-On-Chain-Reputation-System).

Look up any Stellar wallet address and see its reputation score broken down by transaction history, LP activity, and governance participation.

---

## Status

The UI is fully built and runs independently with a **mock data layer** (`lib/mock.ts`). Once the contract is deployed to testnet (Phase 5.1), swap `getScore` in `lib/mock.ts` for a real Soroban RPC call.

---

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS

---

## Getting started

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Structure

```
app/
  page.tsx          # Home page — wallet lookup + formula reference
  layout.tsx        # Root layout + metadata
components/
  WalletLookup.tsx  # Search form + result state machine
  ScoreCard.tsx     # Score display with signal breakdown bars
lib/
  mock.ts           # Mock data layer (swap for real RPC when contract is live)
```

---

## Connecting to the live contract

When the contract is deployed (Phase 5.1 of the main repo), update `lib/mock.ts`:

1. Replace the `getScore` function body with a call to `ReputationClient.getScore` from the SDK
2. Pass in the deployed `CONTRACT_ID` and testnet RPC URL
3. Remove the mock delay and deterministic seed logic

---

## License

MIT
