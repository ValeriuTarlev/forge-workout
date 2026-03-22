# FORGE — AI Workout Tracker

A dark, fast, native-feeling PWA for logging gym sessions on iPhone. Built with React, powered by the Anthropic API.

---

## What it does

FORGE is a personal workout tracker designed around a 4-day training split (Chest / Shoulders + Triceps / Back + Biceps / Legs). It logs every set, weight, and rep you do — then uses that data to give you AI-generated training plans and personalized coaching advice.

**Core features:**

- **Log workouts** — track sets, reps, weight (lbs or kg), RPE, drop sets, and notes per set
- **Pre-fills last weight** — every exercise starts with the weight you used last session
- **Rest timer** — 5-second get-ready countdown + circular ring that drains over your rest period, wall-clock accurate when backgrounded
- **Timer notifications** — fires a push notification when rest ends, even if the app is in the background (Android/iOS 16.4+)
- **Session persistence** — active workout is saved to localStorage on every change; if the app closes mid-session, it prompts to resume on reopen
- **AI training cycle** — generates a personalized 2-week plan based on your workout history
- **AI coach chat** — context-aware assistant that knows your actual numbers and flags overtraining
- **Session history** — full log of every workout with volume and duration stats
- **Saved plans** — build and reuse custom workout templates
- **PWA** — installs to iPhone home screen, works like a native app, no pinch-zoom

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React (Vite) |
| Styling | Inline styles only — no UI libraries |
| Routing | None — state-based navigation |
| Storage | `localStorage` (persistent across sessions) |
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
2. Review and adjust the exercise queue on the setup screen — reorder with ↑↓, swap any exercise, or edit sets/reps/weight targets
3. Tap **▶ Start Workout** — the app goes fullscreen
4. Log each set: enter weight and reps, optionally set RPE or add a drop set
5. Tap **✓ Set Done** — a 5-second get-ready countdown plays, then the rest timer starts
6. The rest timer uses wall-clock timestamps so it stays accurate when backgrounded. Skip or add +15 seconds as needed
7. After the last set of the last exercise, the session is saved automatically

**If the app closes mid-workout**, reopening it shows a Resume/Discard prompt to pick up exactly where you left off.

---

## Exercise management

### Setup screen (before workout)
Each exercise card has:
- **↑ ↓** — reorder within the queue
- **⇄ Swap** — replace with any other exercise (filtered by muscle group, with search)
- **✎ Edit** — customize sets, rep range, starting weight, and notes (saved as defaults for future sessions)
- **✕** — remove from queue

### During workout
- **⇄ Swap** button in the exercise header to replace the current exercise on the fly
- **+ Set / − Set** buttons to add or remove sets (minimum 1)
- **↑ ↓** reorder buttons in the session plan sheet (tap the **≡** pill at the bottom)

---

## Exercise library

9 muscle groups, 100+ exercises:

**Chest** · **Back** · **Shoulders** · **Biceps** · **Triceps** · **Legs** · **Glutes** · **Trapezoid** · **Core**

The exercise picker has a search bar, muscle group filter chips, and a custom exercise input for anything not in the list.

### Default splits

| Split | Muscle groups |
|---|---|
| Chest | Chest only |
| Shoulders + Triceps | Shoulders, Triceps |
| Back + Biceps | Back, Biceps |
| Legs | Legs, Glutes |
| Full Body | Chest, Back, Legs, Shoulders |
| Open Workout | No preset exercises |

---

## Storage

All data is persisted to `localStorage` across sessions.

| Key | Contents |
|---|---|
| `forge_data` | Workout history, saved plans, AI cycle, chat history |
| `forge_active_workout` | In-progress session + rest timer state |
| `forge_exercise_defaults` | Per-exercise customizations (sets, reps, weight, notes) |

Data shape for `forge_data`:

```json
{
  "workouts": [...],
  "savedPlans": [...],
  "aiCycle": { ... },
  "chatHistory": [...]
}
```

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

## User profile (hardcoded)

- **Goal:** Muscle Gain
- **Equipment:** Full Gym
- **Frequency:** 4 days/week
- **Default unit:** lbs (toggleable per set to kg)
