# CryptoWatch

Real-time cryptocurrency dashboard (portfolio / technical showcase). Users browse the market publicly; authenticated users manage a personal **watchlist** and **price alerts**.

## Canonical specification

**Read [`docs/PROJECT_SPECS.md`](docs/PROJECT_SPECS.md) before implementing features, choosing stack details, or answering architecture questions.** That document is the single source of truth for:

- Product vision, MVP scope, and definition of done
- Functional requirements (auth, market, coin detail, watchlist, alerts, settings)
- Tech stack (React, TanStack Query/Router, Zustand, Supabase, CoinGecko, Binance WebSockets)
- Folder architecture and cross-feature import rules
- Server vs client state boundaries, cache strategy, WebSocket integration
- Data model (Supabase tables, RLS)
- Implementation roadmap, risks, and explicit out-of-scope items

The spec is written in Spanish; use the terminology below when naming concepts in code, issues, and English docs.

## Language

**Market**:
The public view of ranked cryptocurrencies (search, filters, live prices). Not an exchange or trading venue.
_Avoid_: Exchange, trading floor

**Coin**:
A tracked cryptocurrency asset, identified by `coin_id` (e.g. `"bitcoin"`). Shared across market, watchlist, and alerts.
_Avoid_: Token (unless referring to on-chain tokens specifically), asset (too generic)

**Watchlist**:
An authenticated user's saved list of coins, ordered and persisted in Supabase.
_Avoid_: Favorites, portfolio

**Alert**:
A user-defined rule: when a coin's price goes **above** or **below** a target value. Evaluated client-side while the app is open in MVP.
_Avoid_: Notification (use for the UI event), trigger (use for fired alert state)

**Feature**:
A vertical slice under `src/features/` (`auth`, `market`, `watchlist`, `alerts`). Features may import from `shared/` but not from each other.
_Avoid_: Module, service (for folder names)

## Relationships

- The **Market** displays **Coins** from CoinGecko; live prices update via Binance WebSocket into TanStack Query cache.
- A **Watchlist** belongs to one user and references many **Coins** by `coin_id`.
- An **Alert** belongs to one user and one **Coin**, with condition `above` | `below` and a target price.

## For AI agents

1. **Start here** for domain vocabulary and where to look next.
2. **Open `docs/PROJECT_SPECS.md`** for any requirement, pattern, table schema, cache timing, or scope question.
3. **ADRs** (when added): `docs/adr/` — do not contradict without calling out the conflict.
4. **Out of MVP** (see spec §10): simulated portfolio, i18n, PWA, server-side push alerts, multi-coin chart compare, watchlist history, paper trading.

## Example dialogue

> **Dev:** "Should unauthenticated users add coins to their **Watchlist**?"
> **Spec:** No — **Watchlist** and **Alerts** require auth; the **Market** and coin detail are public.

> **Dev:** "Where do live WebSocket prices live?"
> **Spec:** Injected into TanStack Query via `setQueryData`; components read through `useQuery`, not the socket directly.
