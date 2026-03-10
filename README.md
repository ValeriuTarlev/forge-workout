# FORGE — AI Workout Tracker

A dark, fast, native-feeling PWA for logging gym sessions on iPhone. Built with React, powered by the Anthropic API.

---

## What it does

FORGE is a personal workout tracker designed around a 4-day training split (Chest / Shoulders / Back + Biceps / Legs). It logs every set, weight, and rep you do — then uses that data to give you AI-generated training plans and personalized coaching advice.

**Core features:**

- **Log workouts** — track sets, reps, weight (lbs or kg), RPE, drop sets, and notes per set
- **Pre-fills last weight** — every exercise starts with the weight you used last session
- **Rest timer** — 5-second get-ready countdown + circular ring that drains over your rest period
- **AI training cycle** — generates a personalized 2-week plan based on your workout history
- **AI coach chat** — context-aware assistant that knows your actual numbers and flags overtraining
- **Session history** — full log of every workout with volume and duration stats
- **Saved plans** — build and reuse custom workout templates
- **PWA** — installs to iPhone home screen, works like a native app

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React (Vite) |
| Styling | Inline styles only — no UI libraries |
| Routing | None — state-based navigation |
| Storage | `window.__forge__` (JSON, session-scoped) |
| AI | Anthropic API (`claude-sonnet-4-20250514`) |
| Fonts | JetBrains Mono + Sora (Google Fonts CDN) |
| Deploy | Vercel |

Everything lives in a single file: `src/App.jsx`.

---

## Design

Dark industrial aesthetic.

| Token | Value |
|---|---|
| Background | `#080809` |
| Cards | `#141417` |
| Inputs | `#1a1a1e` |
| Borders | `#222228` |
| Accent | `#d4f000` (acid yellow-green) |
| Text | `#f0ede6` |
| Muted | `#666070` |
| Success | `#00ff88` |
| Danger | `#ff3355` |
| Weight | `#ff8844` |

Numbers and labels use **JetBrains Mono**. Body text uses **Sora**.

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/ValeriuTarlev/forge-workout.git
cd forge-workout
npm install
```

### 2. Add your API key

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Tabs

### Log
Home screen. Shows today's date, weekly stats, and quick-start buttons for each muscle group. If an AI cycle is active, shows a progress bar and the current week's days. Saved plans appear here too.

### Plan
AI-generated 2-week training cycle. Hit **Generate AI Plan** to create one — it reads your last 10 sessions and returns a structured JSON plan with target weights, rep ranges, rest times, and a coach note. Refresh anytime to regenerate.

### Coach
Chat interface with an AI coach that has full access to your training data. It knows:
- Every exercise you've done and whether you're progressing, stalled, or regressing
- Volume per muscle group in the last 14 days
- Which muscles are overtrained (>20 sets) or undertrained (0 sets)

Quick question chips get you started fast.

### History
All logged sessions, newest first. Tap any session to see the full set-by-set breakdown including weight, reps, RPE, and notes.

---

## Active workout flow

1. Tap a quick-start button (e.g. **Chest**) or start a saved plan
2. Review and adjust the exercise queue on the setup screen
3. Tap **▶ Start Workout** — the app goes fullscreen
4. Log each set: enter weight and reps, optionally set RPE or add a drop set
5. Tap **✓ Set Done** — a 5-second get-ready countdown plays, then the rest timer starts
6. The rest timer is a circular ring that drains from green → yellow → red. Skip or add 30 seconds as needed
7. After the last set of the last exercise, the session is saved automatically

---

## Exercise library

9 muscle groups, 100+ exercises:

**Chest** · **Back** · **Shoulders** · **Biceps** · **Triceps** · **Legs** · **Glutes** · **Trapezoid** · **Core**

The exercise picker has a search bar, muscle group filter chips, and a custom exercise input for anything not in the list.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Then go to your Vercel project → **Settings → Environment Variables** and add:

```
VITE_ANTHROPIC_API_KEY = sk-ant-...
```

Redeploy after adding the variable.

### Install on iPhone

1. Open the deployed URL in Safari
2. Tap the share icon → **Add to Home Screen**
3. The app launches in standalone mode (no browser chrome, full screen)

---

## Storage

All data is stored in `window.__forge__` as a JSON string. This persists within the browser session but resets if the tab is closed. No server, no database, no account.

Data shape:

```json
{
  "workouts": [...],
  "savedPlans": [...],
  "aiCycle": { ... },
  "chatHistory": [...]
}
```

---

## User profile (hardcoded)

- **Goal:** Muscle Gain
- **Equipment:** Full Gym
- **Frequency:** 4 days/week
- **Default unit:** lbs (toggleable per set to kg)
