# FORGE — AI Workout Tracker

A dark, fast, native-feeling PWA for logging gym sessions on iPhone. Built with React, powered by the Anthropic API.

---

## What it does

FORGE is a personal workout tracker built around your real training data. It logs every set, weight, and rep — then uses that data to give you AI-generated training plans, personalized coaching advice, and smart pre-fills based on your actual history.

**Core features:**

- **Log workouts** — track sets, reps, weight (lbs or kg), RPE, drop sets, and notes per set
- **Per-exercise history** — every exercise pre-fills weights and reps from your last session, set by set
- **"Last time" banner** — see exactly what you did last time for each exercise while you're mid-workout
- **Rest timer** — circular ring timer with +15s / −15s controls, wall-clock accurate when backgrounded
- **"Up Next" during rest** — shows the next exercise or set while resting; at 15 seconds remaining it enters a "GET READY" state with visual alert and vibration
- **Timer notifications** — fires a push notification when rest ends, even if the app is in the background (iOS 16.4+)
- **Session persistence** — active workout saves to localStorage on every change; prompts to resume if the app closes mid-session
- **Last Workout panel** — during a workout, tap 📋 to review your previous session for that same workout in full detail
- **Customizable quick starts** — edit name, muscle groups, exercise list, and rest times for each split; persists as your new defaults
- **AI training cycle** — generates a personalized 2-week plan based on your workout history and profile
- **AI coach chat** — context-aware assistant that knows your actual numbers, flags overtraining, and gives specific advice
- **Session history** — full log of every workout with volume and duration stats
- **Saved plans** — build and reuse custom workout templates
- **User profile + onboarding** — set your name, age, height, weight, experience, goal, equipment, and preferred units
- **Settings tab** — edit your profile at any time
- **PWA** — installs to iPhone home screen, works like a native app, no pinch-zoom

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React (Vite) |
| Styling | Inline styles only — no UI libraries |
| Routing | None — state-based navigation |
| Storage | `localStorage` (persistent across sessions) |
| AI | Anthropic API (`claude-haiku-4-5-20251001`) |
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
Home screen. Shows today's date, weekly stats, and quick-start buttons for each muscle group. Tap any card to preview, edit, and launch that workout. If an AI cycle is active, shows a progress bar and the current week's days. Saved plans appear here too.

### Plan
AI-generated 2-week training cycle. Hit **Generate AI Plan** to create one — it reads your last 10 sessions and profile, then returns a structured plan with target weights, rep ranges, rest times, coach notes, and progression rules. Refresh anytime to regenerate.

### Coach
Chat interface with an AI coach that has full access to your training data. It knows every exercise you've done, whether you're progressing or stalling, and your volume per muscle group. Responses are cleanly formatted with sections, bullet points, and bold highlights — no raw markdown symbols.

Quick question chips to get started:
- What weights should I use next session?
- Am I overtraining any muscle?
- Which muscles need more work?
- Review my current training plan
- How is my bench progressing?
- What should I focus on this week?

### History
All logged sessions, newest first. Tap any session to see the full set-by-set breakdown including weight, reps, RPE, and notes.

### Settings
Edit your profile: name, age, height, weight, experience level, goal, days per week, equipment, and preferred weight unit.

---

## Active workout flow

1. Tap a quick-start card (e.g. **Chest**) — a sheet opens showing the exercise list
2. Preview and adjust: drag to reorder, tap a name to rename, change rest times, add or remove exercises
3. Optionally tap **Save** to persist your changes as the new default for that split
4. Tap **▶ Start Workout** — the app goes fullscreen immediately
5. For each exercise, a **"Last time"** banner shows exactly what you did last session (set by set), dismissible with ✕
6. Log each set: enter weight and reps, optionally set RPE or add a drop set
7. Tap **✓ Set Done** — the rest timer starts instantly
8. During rest, the **"Up Next"** card shows the next exercise or set with suggested weight. At 15 seconds the timer enters **GET READY** mode with an orange glow and vibration
9. Use **−15s / +15s** to adjust rest time on the fly, or **Skip Rest** to proceed immediately
10. Tap **📋** in the header at any time to review your previous session for this workout
11. After the last set of the last exercise, the session is saved automatically

**Only exercises where you completed at least one set are saved** — exercises you added but never started are ignored.

**If the app closes mid-workout**, reopening it shows a Resume/Discard prompt to pick up exactly where you left off.

---

## Quick start customization

Each quick-start slot (Chest, Back + Biceps, etc.) is fully customizable:

- **Workout name** — rename it (e.g. "Chest + Triceps")
- **Muscle groups** — add or remove muscles; exercise suggestions update in real time
- **Exercise list** — drag to reorder, rename with auto-suggestions, change rest time per exercise, delete, or add new ones
- **Save** — persists as your new default for that slot
- **Reset** — restores the original hardcoded list

Custom names and muscle groups are reflected on the home screen cards.

---

## Exercise management

### During session setup
Each exercise card has:
- **≡** — drag handle to reorder
- **⇄ Swap** — replace with any other exercise (filtered by muscle group, with search)
- **✎ Edit** — customize sets, rep range, starting weight, and notes (saved as defaults for future sessions)
- **✕** — remove from queue

### During workout
- **⇄ Swap** button in the exercise header to replace the current exercise on the fly
- **+ Set / − Set** buttons to add or remove sets (minimum 1)
- **↑ ↓** reorder buttons in the session plan sheet (≡ button)

---

## Exercise library

9 muscle groups, 130+ exercises:

**Chest** — Bench Press, Incline/Decline variants, Push-Ups (wide, diamond, decline, incline), Dips, Cable Flyes, Pec Fly, Svend Press, Landmine Press, and more

**Back** — Pull-Ups, Chin-Ups (wide/neutral grip), T-Bar Row, Barbell/Pendlay/Seated/Single Arm Row, Lat Machine, Face Pull, Deadlift, Rack Pull, Straight Arm Pulldown, and more

**Shoulders** — Dumbbell/Barbell/Arnold/Machine Press, Lateral Raises (cable, machine), Front Raises, Rear Delt Raises, Reverse Pec Deck, Face Pull, Upright Row

**Biceps** — Barbell/Dumbbell/Cable/Hammer/Preacher/Concentration/Reverse Curl, Chin-Ups

**Triceps** — Pushdown, Skull Crushers, Overhead Extension, Dips, Diamond Push-Ups, JM Press, Cable Kickback, Reverse Grip Pushdown

**Legs** — Squat (front, box, hack, smith), Leg Press, Leg Extension, Leg/Seated Curl, Nordic Hamstring Curl, Romanian/Stiff Leg/Sumo Deadlift, Lunges, Step-Ups, Calf Raises (seated, leg press)

**Glutes** — Hip Thrusts, Bulgarian Split Squat, Glute Bridge, Cable Kickbacks, Donkey Kicks, Lateral Band Walk, Sumo Squat

**Core** — Plank, Side Plank, Hanging/Leg Raises, Crunches, Sit-Ups, Bicycle Crunches, Ab Wheel, Russian Twists, Mountain Climbers, Dead Bug, Bird Dog, Pallof Press, Dragon Flag, Flutter Kicks, V-Ups

**Trapezoid** — Shrugs (barbell, dumbbell, cable), Rack Pull, Upright Row, Face Pull

The exercise picker has a search bar, muscle group filter chips, and a custom exercise input for anything not in the list.

### Default splits

| Split | Muscle groups |
|---|---|
| Chest | Chest |
| Shoulders + Triceps | Shoulders, Triceps |
| Back + Biceps | Back, Biceps |
| Legs | Legs, Glutes |
| Full Body | Chest, Back, Legs, Shoulders |
| Open Workout | No preset exercises |

---

## Storage

All data is persisted to `localStorage` — no backend, no account required.

| Key | Contents |
|---|---|
| `forge_data` | Workout history, saved plans, AI cycle, chat history, custom quick starts |
| `forge_active_workout` | In-progress session + rest timer state |
| `forge_exercise_defaults` | Per-exercise customizations (sets, reps, weight, notes) |
| `forge_exercise_history` | Per-exercise full set history (last 5 sessions) for pre-fill and "Last time" banner |
| `forge_profile` | User profile (name, age, height, weight, experience, goal, equipment, units) |

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
