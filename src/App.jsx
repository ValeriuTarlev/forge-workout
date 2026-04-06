import { useState, useEffect, useRef } from 'react'

// ─── CONSTANTS & LIBRARY ──────────────────────────────────────────────────────

const COLORS = {
  bg: '#080809',
  card: '#141417',
  input: '#1a1a1e',
  border: '#222228',
  accent: '#d4f000',
  text: '#f0ede6',
  muted: '#666070',
  success: '#00ff88',
  danger: '#ff3355',
  lbs: '#ff8844',
}

const EXERCISE_LIBRARY = {
  Chest: [
    'Bench Press', 'Incline Bench Press', 'Decline Bench Press',
    'Dumbbell Bench Press', 'Incline Dumbbell Press', 'Decline Dumbbell Press',
    'Chest Press', 'Pec Fly', 'Dumbbell Fly', 'Cable Crossover', 'Cable Flyes',
    'Push-Ups', 'Wide Push-Ups', 'Diamond Push-Ups', 'Decline Push-Ups', 'Incline Push-Ups',
    'Dips', 'Svend Press', 'Landmine Press',
  ],
  Back: [
    'Pull-Ups', 'Chin-Ups', 'Wide Grip Pull-Ups', 'Neutral Grip Pull-Ups',
    'Lat Machine', 'Front Lat Machine', 'Front Pull Down Machine',
    'T-Bar Row', 'Barbell Row', 'Pendlay Row', 'Seated Row', 'Low Row',
    'Single Arm Dumbbell Row', 'Chest Supported Row', 'Inverted Row',
    'Face Pull', 'Straight Arm Pulldown', 'Cable Row',
    'Deadlift', 'Rack Pull',
  ],
  Shoulders: [
    'Dumbbell Shoulder Press', 'Barbell Shoulder Press', 'Shoulder Press',
    'Arnold Press', 'Machine Shoulder Press',
    'Lateral Raises', 'Cable Lateral Raises', 'Machine Lateral Raises',
    'Front Raises', 'Cable Front Raises', 'Plate Front Raises',
    'Rear Delt Raises', 'Bent Over Lateral Raises', 'Reverse Pec Deck',
    'Upright Row', 'Face Pull',
  ],
  Biceps: [
    'Biceps Curl', 'Curl Dumbbells', 'Incline Dumbbell Curl',
    'Hammer Curl', 'Cross Body Curl', 'Concentration Curl',
    'Preacher Curl', 'Arm Curl Machine', 'Cable Curl',
    'Reverse Curl', 'Cable Hammer Curl', 'Chin-Ups',
  ],
  Triceps: [
    'Tricep Pushdown', 'Overhead Tricep Extension', 'Skull Crushers',
    'Close Grip Bench Press', 'JM Press', 'Tricep Dips',
    'Diamond Push-Ups', 'Cable Kickback', 'Single Arm Pushdown',
    'Reverse Grip Pushdown', 'Dips',
  ],
  Legs: [
    'Squat', 'Front Squat', 'Box Squat', 'Hack Squat', 'Smith Machine Squat',
    'Leg Press', 'Leg Extension', 'Leg Curl', 'Seated Leg Curl', 'Nordic Hamstring Curl',
    'Romanian Deadlift', 'Stiff Leg Deadlift', 'Sumo Deadlift', 'Good Morning',
    'Walking Lunges', 'Reverse Lunge', 'Split Squat', 'Step-Ups', 'Sissy Squat',
    'Calf Raises', 'Seated Calf Raises', 'Calf Extension', 'Leg Press Calf Raises',
  ],
  Glutes: [
    'Hip Thrusts', 'Barbell Hip Thrusts', 'Bulgarian Split Squat',
    'Glute Bridge', 'Single Leg Glute Bridge', 'Cable Kickbacks',
    'Donkey Kicks', 'Lateral Band Walk', 'Sumo Squat', 'Step-Ups',
  ],
  Core: [
    'Plank', 'Side Plank', 'Hanging Leg Raises', 'Leg Raises',
    'Cable Crunch', 'Crunches', 'Sit-Ups', 'Bicycle Crunches',
    'Ab Wheel Rollout', 'Russian Twists', 'Mountain Climbers',
    'Dead Bug', 'Bird Dog', 'Pallof Press', 'Cable Woodchop',
    'V-Ups', 'Flutter Kicks', 'Dragon Flag', 'Toe Touches',
  ],
  Trapezoid: [
    'Shrugs', 'Barbell Shrugs', 'Dumbbell Shrugs', 'Cable Shrugs',
    'Rack Pull', 'Upright Row', 'Face Pull',
  ],
}

const MUSCLES = Object.keys(EXERCISE_LIBRARY)
const ALL_EXERCISES = MUSCLES.flatMap(m => EXERCISE_LIBRARY[m].map(name => ({ name, muscle: m })))

const QUICK_START_TYPES = ['Chest', 'Shoulders + Triceps', 'Back + Biceps', 'Legs', 'Full Body', 'Open Workout']

const QUICK_START_MUSCLES = {
  'Chest': ['Chest'],
  'Shoulders + Triceps': ['Shoulders', 'Triceps'],
  'Back + Biceps': ['Back', 'Biceps'],
  'Legs': ['Legs', 'Glutes'],
  'Full Body': ['Chest', 'Back', 'Legs', 'Shoulders'],
  'Open Workout': [],
}

const QUICK_START_EXERCISES = {
  'Chest': [
    { name: 'Bench Press', muscle: 'Chest', sets: 4, repsMin: 6, repsMax: 10, restSec: 150 },
    { name: 'Incline Dumbbell Press', muscle: 'Chest', sets: 3, repsMin: 10, repsMax: 12, restSec: 120 },
    { name: 'Cable Flyes', muscle: 'Chest', sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
    { name: 'Pec Fly', muscle: 'Chest', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Chest Press', muscle: 'Chest', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
  ],
  'Shoulders + Triceps': [
    { name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', sets: 4, repsMin: 8, repsMax: 12, restSec: 120 },
    { name: 'Lateral Raises', muscle: 'Shoulders', sets: 4, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Rear Delt Raises', muscle: 'Shoulders', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Front Raises', muscle: 'Shoulders', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Tricep Pushdown', muscle: 'Triceps', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Skull Crushers', muscle: 'Triceps', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
  ],
  'Back + Biceps': [
    { name: 'Pull-Ups', muscle: 'Back', sets: 4, repsMin: 6, repsMax: 10, restSec: 150 },
    { name: 'T-Bar Row', muscle: 'Back', sets: 4, repsMin: 8, repsMax: 12, restSec: 120 },
    { name: 'Seated Row', muscle: 'Back', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
    { name: 'Lat Machine', muscle: 'Back', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
    { name: 'Biceps Curl', muscle: 'Biceps', sets: 3, repsMin: 10, repsMax: 12, restSec: 75 },
    { name: 'Hammer Curl', muscle: 'Biceps', sets: 3, repsMin: 10, repsMax: 12, restSec: 75 },
  ],
  'Legs': [
    { name: 'Squat', muscle: 'Legs', sets: 4, repsMin: 6, repsMax: 10, restSec: 180 },
    { name: 'Leg Press', muscle: 'Legs', sets: 3, repsMin: 10, repsMax: 15, restSec: 120 },
    { name: 'Romanian Deadlift', muscle: 'Legs', sets: 3, repsMin: 8, repsMax: 12, restSec: 120 },
    { name: 'Leg Extension', muscle: 'Legs', sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
    { name: 'Seated Leg Curl', muscle: 'Legs', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
    { name: 'Calf Raises', muscle: 'Legs', sets: 4, repsMin: 15, repsMax: 20, restSec: 60 },
  ],
  'Full Body': [
    { name: 'Squat', muscle: 'Legs', sets: 3, repsMin: 6, repsMax: 10, restSec: 180 },
    { name: 'Bench Press', muscle: 'Chest', sets: 3, repsMin: 8, repsMax: 12, restSec: 150 },
    { name: 'Pull-Ups', muscle: 'Back', sets: 3, repsMin: 6, repsMax: 10, restSec: 120 },
    { name: 'Shoulder Press', muscle: 'Shoulders', sets: 3, repsMin: 8, repsMax: 12, restSec: 90 },
    { name: 'Biceps Curl', muscle: 'Biceps', sets: 2, repsMin: 10, repsMax: 12, restSec: 75 },
    { name: 'Tricep Pushdown', muscle: 'Triceps', sets: 2, repsMin: 12, repsMax: 15, restSec: 75 },
  ],
  'Open Workout': [],
}

const REST_CHIPS = [
  { label: '1m', sec: 60 },
  { label: '1:30', sec: 90 },
  { label: '1:45', sec: 105 },
  { label: '2m', sec: 120 },
  { label: '2:30', sec: 150 },
  { label: '3m', sec: 180 },
]

const RPE_LABELS = { 6: 'Easy', 7: 'Moderate', 8: 'Hard', 9: 'Very Hard', 10: 'Max' }

// ─── HELPERS & UTILS ──────────────────────────────────────────────────────────

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatDuration(ms) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}m ${sec}s`
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatMMSS(ms) {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function isWithin7Days(iso) {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000
}

function isWithin14Days(iso) {
  return Date.now() - new Date(iso).getTime() < 14 * 24 * 60 * 60 * 1000
}

function totalVolume(session) {
  return session.exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)
}

function sessionMuscles(session) {
  return [...new Set(session.exercises.map(e => e.muscle))]
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch (_) {}
}

function getLastSetData(workouts, exerciseName) {
  for (const w of workouts) {
    for (const ex of w.exercises) {
      if (ex.name.toLowerCase() === exerciseName.toLowerCase()) {
        const withWeight = ex.sets.filter(s => s.weight && s.weight !== '')
        if (withWeight.length > 0) {
          const last = withWeight[withWeight.length - 1]
          return { weight: last.weight, unit: last.unit || 'lbs' }
        }
      }
    }
  }
  return null
}

function makeExercise(template, workouts = [], defaultUnit = 'lbs', historyEntry = null) {
  const saved = loadExerciseDefaults()[template.name] || {}
  const sets = template.sets || 3
  const lastData = getLastSetData(workouts, template.name)
  const weight = lastData ? lastData.weight : (saved.weight || '')
  const unit = lastData ? lastData.unit : (saved.unit || defaultUnit)
  return {
    id: uuid(),
    name: template.name,
    muscle: template.muscle || 'Other',
    restSec: template.restSec || 90,
    repsMin: saved.repsMin || template.repsMin || 8,
    repsMax: saved.repsMax || template.repsMax || 12,
    targetWeight: template.targetWeight || null,
    note: saved.note || template.note || '',
    activeSetIndex: 0,
    sets: Array.from({ length: sets }, (_, i) => {
      const histSet = historyEntry?.sets?.[i]
      return {
        id: uuid(),
        weight: histSet?.weight !== undefined && histSet.weight !== '' ? histSet.weight : weight,
        unit: histSet?.unit || unit,
        reps: histSet?.reps ? String(histSet.reps) : '',
        rpe: null,
        note: '',
        dropSets: [],
        done: false,
        showNote: false,
      }
    }),
  }
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────

const FORGE_DATA_KEY = 'forge_data'
const ACTIVE_WORKOUT_KEY = 'forge_active_workout'

function loadForge() {
  try {
    const raw = localStorage.getItem(FORGE_DATA_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return { workouts: [], savedPlans: [], aiCycle: null, chatHistory: [] }
}

function saveForge(data) {
  try {
    localStorage.setItem(FORGE_DATA_KEY, JSON.stringify(data))
  } catch (_) {}
}

const EXERCISE_DEFAULTS_KEY = 'forge_exercise_defaults'

function loadExerciseDefaults() {
  try {
    const raw = localStorage.getItem(EXERCISE_DEFAULTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return {}
}

function saveExerciseDefaults(defaults) {
  try {
    localStorage.setItem(EXERCISE_DEFAULTS_KEY, JSON.stringify(defaults))
  } catch (_) {}
}

const PROFILE_KEY = 'forge_profile'

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch (_) {}
}

const EXERCISE_HISTORY_KEY = 'forge_exercise_history'

function loadExerciseHistory() {
  try {
    const raw = localStorage.getItem(EXERCISE_HISTORY_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return {}
}

function saveExerciseHistory(data) {
  try {
    localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(data))
  } catch (_) {}
}

function profileDisplayHeight(profile) {
  if (!profile) return ''
  if (profile.heightUnit === 'ft') return `${profile.heightFt || 0}'${profile.heightIn || 0}"`
  return `${profile.height || ''}cm`
}

function profileDisplayWeight(profile) {
  if (!profile) return ''
  return `${profile.weight || ''}${profile.weightUnit || 'kg'}`
}

function fireNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    try { new Notification('FORGE', { body: 'Rest time is up — next set!' }) } catch (_) {}
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function callAnthropic(messages, maxTokens, systemPrompt) {
  const body = { model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, messages }
  if (systemPrompt) body.system = systemPrompt

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.content[0].text
}

function buildCoachSystemPrompt(workouts, aiCycle, profile) {
  const last15 = workouts.slice(0, 15)
  const last14Days = workouts.filter(w => isWithin14Days(w.startedAt))

  const volumeMap = {}
  last14Days.forEach(w => {
    w.exercises.forEach(ex => {
      volumeMap[ex.muscle] = (volumeMap[ex.muscle] || 0) + ex.sets.length
    })
  })

  const exerciseMap = {}
  last15.forEach(w => {
    w.exercises.forEach(ex => {
      if (!exerciseMap[ex.name]) exerciseMap[ex.name] = { muscle: ex.muscle, sessions: [] }
      const topSet = ex.sets.reduce((best, s) => {
        const v = parseFloat(s.weight) || 0
        return v > (parseFloat(best.weight) || 0) ? s : best
      }, ex.sets[0] || {})
      exerciseMap[ex.name].sessions.push({
        topWeight: parseFloat(topSet.weight) || 0,
        topReps: parseInt(topSet.reps) || 0,
        unit: topSet.unit || 'lbs',
      })
    })
  })

  const exerciseLines = Object.entries(exerciseMap).map(([name, data]) => {
    const s = data.sessions
    const latest = s[0]
    const prev = s[1]
    let status = 'first session'
    if (prev) {
      if (latest.topWeight > prev.topWeight) status = 'progressing'
      else if (latest.topWeight < prev.topWeight) status = 'regressed'
      else status = 'stalled'
    }
    return `  - ${name} (${data.muscle}): ${latest.topWeight}${latest.unit} x ${latest.topReps} reps — ${status}`
  }).join('\n')

  const volumeLines = MUSCLES.map(m => {
    const sets = volumeMap[m] || 0
    let flag = ''
    if (sets > 20) flag = ' ⚠️ OVERTRAINED'
    if (sets === 0) flag = ' ⚠️ UNDERTRAINED'
    return `  - ${m}: ${sets} sets${flag}`
  }).join('\n')

  const expLabel = { beginner: 'Beginner (<1yr)', intermediate: 'Intermediate (1-3yrs)', advanced: 'Advanced (3+yrs)' }
  const goalLabel = { muscle: 'Muscle Gain', fatloss: 'Fat Loss', strength: 'Strength', fitness: 'General Fitness' }
  const equipLabel = { full: 'Full Gym', home: 'Home Gym', minimal: 'Minimal Equipment' }

  const profileLines = profile ? [
    `- Name: ${profile.name || 'User'} | Age: ${profile.age || '?'} | Height: ${profileDisplayHeight(profile)} | Weight: ${profileDisplayWeight(profile)}`,
    `- Experience: ${expLabel[profile.experience] || profile.experience} | Goal: ${goalLabel[profile.goal] || profile.goal}`,
    `- Equipment: ${equipLabel[profile.equipment] || profile.equipment} | Frequency: ${profile.daysPerWeek || 4} days/week`,
    `- Preferred unit: ${profile.workoutUnit || 'lbs'}`,
  ].join('\n') : '- Goal: Muscle Gain | Equipment: Full Gym | Frequency: 4 days/week'

  return `You are FORGE, an elite AI strength coach. Direct, data-driven, personalized. Address the user by name.

USER PROFILE:
${profileLines}
- Total sessions: ${workouts.length}
- Active AI cycle: ${aiCycle ? aiCycle.cycleName : 'None'}

RECENT PERFORMANCE (last 15 sessions):
${exerciseLines || '  No data yet'}

MUSCLE VOLUME (last 14 days):
${volumeLines}

RULES:
- Tailor advice to the user's experience level and goal.
- Suggest specific weights using progressive overload.
- Warn about overtraining (>20 sets/14d) or undertraining (0 sets/14d).
- Be concise and use numbers. Use the user's preferred weight unit.
- Format responses cleanly: use short paragraphs, numbered lists, or bullet points (- item).
- Use **bold** only for exercise names or key numbers.
- Never use markdown headers with # symbols for short answers.
- Never use asterisks for emphasis mid-sentence — just write clearly.`
}

function buildCyclePrompt(workouts, profile) {
  const last10 = workouts.slice(0, 10)
  const historyText = last10.map(w =>
    `${formatDate(w.startedAt)} — ${w.name}: ${w.exercises.map(e =>
      `${e.name} ${e.sets.map(s => `${s.weight}${s.unit}x${s.reps}`).join(', ')}`
    ).join(' | ')}`
  ).join('\n')

  const expLabel = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
  const goalLabel = { muscle: 'Muscle Gain', fatloss: 'Fat Loss', strength: 'Strength', fitness: 'General Fitness' }
  const equipLabel = { full: 'Full Gym', home: 'Home Gym', minimal: 'Minimal Equipment' }
  const profileLine = profile
    ? `Goal: ${goalLabel[profile.goal] || 'Muscle Gain'} | Equipment: ${equipLabel[profile.equipment] || 'Full Gym'} | Frequency: ${profile.daysPerWeek || 4} days/week | Experience: ${expLabel[profile.experience] || 'Intermediate'} | Preferred unit: ${profile.workoutUnit || 'lbs'}`
    : 'Goal: Muscle Gain | Equipment: Full gym | Frequency: 4 days/week'

  return `Generate a personalized 2-week training cycle:
- ${profileLine}

Recent history:
${historyText || 'No previous sessions'}

Return ONLY valid JSON with no markdown fences, no comments, no explanation. Use this exact structure:
{
  "cycleName": "string",
  "split": "string",
  "progressionRules": "string",
  "coachNote": "string",
  "week1": [
    {
      "dayLabel": "Day 1",
      "focus": "string",
      "estimatedDuration": "60 min",
      "exercises": [
        {"name":"string","muscle":"string","sets":4,"repsMin":8,"repsMax":12,"restSec":90,"targetWeight":"string","note":"string"}
      ]
    }
  ],
  "week2": [
    {
      "dayLabel": "Day 1",
      "focus": "string",
      "estimatedDuration": "60 min",
      "exercises": [
        {"name":"string","muscle":"string","sets":4,"repsMin":8,"repsMax":12,"restSec":90,"targetWeight":"string","note":"string"}
      ]
    }
  ]
}`
}

function parseCycleResponse(text) {
  try {
    // Strip markdown fences
    let clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    // Extract the outermost JSON object in case there's surrounding text
    const start = clean.indexOf('{')
    const end = clean.lastIndexOf('}')
    if (start !== -1 && end !== -1) clean = clean.slice(start, end + 1)
    return JSON.parse(clean)
  } catch (_) {
    return null
  }
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useSessionTimer(active) {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (active) {
      startRef.current = Date.now() - elapsed
      const tick = () => {
        setElapsed(Date.now() - startRef.current)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [active])

  return elapsed
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  app: {
    fontFamily: "'Sora', sans-serif",
    background: '#080809',
    backgroundImage: [
      'linear-gradient(rgba(212,240,0,0.028) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(212,240,0,0.028) 1px, transparent 1px)',
      'linear-gradient(160deg, #0d0b18 0%, #080809 50%, #090e08 100%)',
    ].join(', '),
    backgroundSize: '40px 40px, 40px 40px, 100% 100%',
    color: COLORS.text,
    minHeight: '100dvh',
    maxWidth: 480,
    margin: '0 auto',
    position: 'relative',
    overflowX: 'hidden',
  },
  mono: { fontFamily: "'JetBrains Mono', monospace" },
  card: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: '14px 16px',
  },
  btn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 15,
    transition: 'opacity 0.15s',
  },
  btnAccent: { background: COLORS.accent, color: '#000' },
  btnGhost: { background: COLORS.card, color: COLORS.text, border: `1px solid ${COLORS.border}` },
  btnDanger: { background: 'transparent', color: COLORS.danger, border: `1px solid ${COLORS.danger}` },
  input: {
    background: COLORS.input, border: `1px solid ${COLORS.border}`, borderRadius: 8,
    color: COLORS.text, padding: '10px 14px', fontSize: 15, width: '100%',
    outline: 'none', fontFamily: "'Sora', sans-serif",
  },
  tag: {
    display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600, background: COLORS.input,
    color: COLORS.muted, border: `1px solid ${COLORS.border}`,
  },
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Tag({ children, color }) {
  return (
    <span style={{
      ...S.tag,
      color: color || COLORS.muted,
      border: `1px solid ${color ? color + '33' : COLORS.border}`,
    }}>{children}</span>
  )
}

function Btn({ children, onClick, style, variant = 'ghost', disabled }) {
  const base = {
    ...S.btn,
    ...(variant === 'accent' ? S.btnAccent : variant === 'danger' ? S.btnDanger : S.btnGhost),
  }
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...style, opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  )
}

function BottomSheet({ title, onClose, children, height = '85vh' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
      <div style={{
        position: 'relative', background: COLORS.card,
        borderRadius: '20px 20px 0 0', border: `1px solid ${COLORS.border}`,
        height, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px 14px', borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
          <button onClick={onClose} style={{
            background: COLORS.input, border: `1px solid ${COLORS.border}`,
            color: COLORS.muted, borderRadius: 8, padding: '4px 12px',
            cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontSize: 13,
          }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', age: '', heightUnit: 'cm', height: '', heightFt: '', heightIn: '',
    weight: '', weightUnit: 'kg', workoutUnit: 'lbs',
    experience: 'intermediate', goal: 'muscle', daysPerWeek: '4', equipment: 'full',
  })

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  const steps = [
    // 0: Welcome + Name
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace" }}>FORGE</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 8 }}>Your AI strength coach. Let's set up your profile.</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Your name</div>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Alex"
            style={{ ...S.input, width: '100%', boxSizing: 'border-box', fontSize: 18, padding: '14px 16px' }} />
        </div>
      </div>
    ),
    // 1: Stats
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Your stats</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Age</div>
            <input value={form.age} onChange={e => set('age', e.target.value)} placeholder="25" type="number"
              style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Height</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => set('heightUnit', 'cm')} style={{ ...S.btn, flex: 1, padding: '8px 0', background: form.heightUnit === 'cm' ? COLORS.accent : COLORS.input, color: form.heightUnit === 'cm' ? '#000' : COLORS.muted, fontSize: 12 }}>cm</button>
              <button onClick={() => set('heightUnit', 'ft')} style={{ ...S.btn, flex: 1, padding: '8px 0', background: form.heightUnit === 'ft' ? COLORS.accent : COLORS.input, color: form.heightUnit === 'ft' ? '#000' : COLORS.muted, fontSize: 12 }}>ft</button>
            </div>
          </div>
        </div>
        {form.heightUnit === 'cm' ? (
          <div>
            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Height (cm)</div>
            <input value={form.height} onChange={e => set('height', e.target.value)} placeholder="175" type="number"
              style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Feet</div>
              <input value={form.heightFt} onChange={e => set('heightFt', e.target.value)} placeholder="5" type="number"
                style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Inches</div>
              <input value={form.heightIn} onChange={e => set('heightIn', e.target.value)} placeholder="10" type="number"
                style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Body weight</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="75" type="number"
              style={{ ...S.input, flex: 1 }} />
            <button onClick={() => set('weightUnit', form.weightUnit === 'kg' ? 'lbs' : 'kg')}
              style={{ ...S.btn, padding: '8px 16px', background: COLORS.input, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace" }}>
              {form.weightUnit}
            </button>
          </div>
        </div>
      </div>
    ),
    // 2: Experience
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Training experience</div>
        {[
          { val: 'beginner', label: 'Beginner', sub: 'Less than 1 year' },
          { val: 'intermediate', label: 'Intermediate', sub: '1–3 years' },
          { val: 'advanced', label: 'Advanced', sub: '3+ years' },
        ].map(opt => (
          <button key={opt.val} onClick={() => set('experience', opt.val)} style={{
            background: form.experience === opt.val ? COLORS.accent + '1a' : COLORS.input,
            border: `2px solid ${form.experience === opt.val ? COLORS.accent : COLORS.border}`,
            borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ color: form.experience === opt.val ? COLORS.accent : COLORS.text, fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{opt.sub}</div>
            </div>
            {form.experience === opt.val && <div style={{ color: COLORS.accent, fontSize: 20 }}>✓</div>}
          </button>
        ))}
      </div>
    ),
    // 3: Goal
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Primary goal</div>
        {[
          { val: 'muscle', label: 'Muscle Gain', sub: 'Build size and strength' },
          { val: 'strength', label: 'Strength', sub: 'Maximize lifts and power' },
          { val: 'fatloss', label: 'Fat Loss', sub: 'Lean out while keeping muscle' },
          { val: 'fitness', label: 'General Fitness', sub: 'Stay active and healthy' },
        ].map(opt => (
          <button key={opt.val} onClick={() => set('goal', opt.val)} style={{
            background: form.goal === opt.val ? COLORS.accent + '1a' : COLORS.input,
            border: `2px solid ${form.goal === opt.val ? COLORS.accent : COLORS.border}`,
            borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ color: form.goal === opt.val ? COLORS.accent : COLORS.text, fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{opt.sub}</div>
            </div>
            {form.goal === opt.val && <div style={{ color: COLORS.accent, fontSize: 20 }}>✓</div>}
          </button>
        ))}
      </div>
    ),
    // 4: Days/week + Equipment
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Training setup</div>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Days per week</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['2', '3', '4', '5', '6'].map(d => (
              <button key={d} onClick={() => set('daysPerWeek', d)} style={{
                flex: 1, padding: '12px 0',
                background: form.daysPerWeek === d ? COLORS.accent : COLORS.input,
                color: form.daysPerWeek === d ? '#000' : COLORS.muted,
                border: `1px solid ${form.daysPerWeek === d ? COLORS.accent : COLORS.border}`,
                borderRadius: 8, cursor: 'pointer', fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
              }}>{d}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Equipment</div>
          {[
            { val: 'full', label: 'Full Gym', sub: 'Barbells, machines, cables' },
            { val: 'home', label: 'Home Gym', sub: 'Rack, barbell, dumbbells' },
            { val: 'minimal', label: 'Minimal', sub: 'Dumbbells or bodyweight only' },
          ].map(opt => (
            <button key={opt.val} onClick={() => set('equipment', opt.val)} style={{
              width: '100%', marginBottom: 8,
              background: form.equipment === opt.val ? COLORS.accent + '1a' : COLORS.input,
              border: `2px solid ${form.equipment === opt.val ? COLORS.accent : COLORS.border}`,
              borderRadius: 10, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ color: form.equipment === opt.val ? COLORS.accent : COLORS.text, fontWeight: 600, fontSize: 15 }}>{opt.label}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{opt.sub}</div>
              </div>
              {form.equipment === opt.val && <div style={{ color: COLORS.accent }}>✓</div>}
            </button>
          ))}
        </div>
      </div>
    ),
    // 5: Units + Done
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Preferred units</div>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>Weight in workouts</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['lbs', 'kg'].map(u => (
              <button key={u} onClick={() => set('workoutUnit', u)} style={{
                flex: 1, padding: '14px 0',
                background: form.workoutUnit === u ? COLORS.accent : COLORS.input,
                color: form.workoutUnit === u ? '#000' : COLORS.muted,
                border: `1px solid ${form.workoutUnit === u ? COLORS.accent : COLORS.border}`,
                borderRadius: 8, cursor: 'pointer', fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 18,
              }}>{u}</button>
            ))}
          </div>
        </div>
        <div style={{ ...S.card, textAlign: 'center', padding: 24, background: COLORS.accent + '0d', border: `1px solid ${COLORS.accent}33` }}>
          <div style={{ fontSize: 28 }}>🔥</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>You're all set{form.name ? `, ${form.name}` : ''}!</div>
          <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 6 }}>FORGE will use your profile to personalize your training plans and coaching advice.</div>
        </div>
      </div>
    ),
  ]

  const titles = ['Welcome', 'Your Stats', 'Experience', 'Goal', 'Training Setup', 'Units']
  const isLast = step === steps.length - 1
  const canAdvance = step === 0 ? form.name.trim().length > 0 : true

  return (
    <div style={{ ...S.app, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px', maxWidth: 480, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= step ? COLORS.accent : COLORS.border,
              transition: 'width 0.3s',
            }} />
          ))}
        </div>

        {steps[step]()}
      </div>

      <div style={{ padding: '16px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', borderTop: `1px solid ${COLORS.border}`, background: COLORS.card, maxWidth: 480, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ ...S.btn, flex: '0 0 auto', padding: '14px 20px', background: COLORS.input, color: COLORS.muted }}>← Back</button>
          )}
          <button onClick={() => {
            if (isLast) {
              saveProfile(form)
              onComplete(form)
            } else {
              setStep(s => s + 1)
            }
          }} disabled={!canAdvance} style={{
            ...S.btn, flex: 1, padding: '14px 0',
            background: canAdvance ? COLORS.accent : COLORS.border,
            color: canAdvance ? '#000' : COLORS.muted, fontWeight: 700, fontSize: 16,
            cursor: canAdvance ? 'pointer' : 'not-allowed',
          }}>
            {isLast ? 'Start Training →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────

function SettingsTab({ profile, onSave }) {
  const [form, setForm] = useState(profile ? { ...profile } : {
    name: '', age: '', heightUnit: 'cm', height: '', heightFt: '', heightIn: '',
    weight: '', weightUnit: 'kg', workoutUnit: 'lbs',
    experience: 'intermediate', goal: 'muscle', daysPerWeek: '4', equipment: 'full',
  })
  const [saved, setSaved] = useState(false)

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  function handleSave() {
    saveProfile(form)
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const expLabel = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
  const goalLabel = { muscle: 'Muscle Gain', fatloss: 'Fat Loss', strength: 'Strength', fitness: 'General Fitness' }
  const equipLabel = { full: 'Full Gym', home: 'Home Gym', minimal: 'Minimal Equipment' }

  function Section({ title, children }) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>{title}</div>
        {children}
      </div>
    )
  }

  function Row({ label, children }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.muted, fontSize: 14 }}>{label}</div>
        <div style={{ flex: '0 0 auto' }}>{children}</div>
      </div>
    )
  }

  function TogglePill({ options, value, onChange }) {
    return (
      <div style={{ display: 'flex', background: COLORS.input, borderRadius: 8, padding: 3, gap: 2 }}>
        {options.map(o => (
          <button key={o.val} onClick={() => onChange(o.val)} style={{
            padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: value === o.val ? COLORS.accent : 'transparent',
            color: value === o.val ? '#000' : COLORS.muted,
          }}>{o.label}</button>
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 28, letterSpacing: -0.5 }}>Settings</div>

      <Section title="Profile">
        <Row label="Name">
          <input value={form.name} onChange={e => set('name', e.target.value)}
            style={{ ...S.input, textAlign: 'right', padding: '6px 10px', width: 140 }} />
        </Row>
        <Row label="Age">
          <input value={form.age} onChange={e => set('age', e.target.value)} type="number"
            style={{ ...S.input, textAlign: 'right', padding: '6px 10px', width: 80 }} />
        </Row>
        <Row label="Body weight">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input value={form.weight} onChange={e => set('weight', e.target.value)} type="number"
              style={{ ...S.input, textAlign: 'right', padding: '6px 10px', width: 70 }} />
            <TogglePill options={[{ val: 'kg', label: 'kg' }, { val: 'lbs', label: 'lbs' }]} value={form.weightUnit} onChange={v => set('weightUnit', v)} />
          </div>
        </Row>
        <Row label="Height">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {form.heightUnit === 'cm' ? (
              <input value={form.height} onChange={e => set('height', e.target.value)} type="number"
                style={{ ...S.input, textAlign: 'right', padding: '6px 10px', width: 70 }} />
            ) : (
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <input value={form.heightFt} onChange={e => set('heightFt', e.target.value)} type="number"
                  style={{ ...S.input, textAlign: 'right', padding: '6px 8px', width: 45 }} />
                <span style={{ color: COLORS.muted, fontSize: 13 }}>ft</span>
                <input value={form.heightIn} onChange={e => set('heightIn', e.target.value)} type="number"
                  style={{ ...S.input, textAlign: 'right', padding: '6px 8px', width: 45 }} />
                <span style={{ color: COLORS.muted, fontSize: 13 }}>in</span>
              </div>
            )}
            <TogglePill options={[{ val: 'cm', label: 'cm' }, { val: 'ft', label: 'ft' }]} value={form.heightUnit} onChange={v => set('heightUnit', v)} />
          </div>
        </Row>
      </Section>

      <Section title="Training">
        <Row label="Experience">
          <TogglePill
            options={[{ val: 'beginner', label: 'Beg' }, { val: 'intermediate', label: 'Int' }, { val: 'advanced', label: 'Adv' }]}
            value={form.experience} onChange={v => set('experience', v)} />
        </Row>
        <Row label="Goal">
          <select value={form.goal} onChange={e => set('goal', e.target.value)}
            style={{ ...S.input, padding: '6px 10px', fontSize: 13 }}>
            <option value="muscle">Muscle Gain</option>
            <option value="strength">Strength</option>
            <option value="fatloss">Fat Loss</option>
            <option value="fitness">General Fitness</option>
          </select>
        </Row>
        <Row label="Days / week">
          <TogglePill
            options={['2','3','4','5','6'].map(d => ({ val: d, label: d }))}
            value={form.daysPerWeek} onChange={v => set('daysPerWeek', v)} />
        </Row>
        <Row label="Equipment">
          <select value={form.equipment} onChange={e => set('equipment', e.target.value)}
            style={{ ...S.input, padding: '6px 10px', fontSize: 13 }}>
            <option value="full">Full Gym</option>
            <option value="home">Home Gym</option>
            <option value="minimal">Minimal</option>
          </select>
        </Row>
      </Section>

      <Section title="Units">
        <Row label="Workout weight">
          <TogglePill options={[{ val: 'lbs', label: 'lbs' }, { val: 'kg', label: 'kg' }]} value={form.workoutUnit} onChange={v => set('workoutUnit', v)} />
        </Row>
      </Section>

      <button onClick={handleSave} style={{
        ...S.btn, width: '100%', padding: '16px 0', marginTop: 8,
        background: saved ? COLORS.success : COLORS.accent, color: '#000', fontWeight: 700, fontSize: 16,
      }}>
        {saved ? '✓ Saved' : 'Save Changes'}
      </button>
    </div>
  )
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'log', label: 'Log', icon: '🏋' },
    { id: 'plan', label: 'Plan', icon: '📋' },
    { id: 'coach', label: 'Coach', icon: '🧠' },
    { id: 'history', label: 'History', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, background: COLORS.card,
      borderTop: `1px solid ${COLORS.border}`, display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex: 1, padding: '10px 0 8px', background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3,
          color: tab === t.id ? COLORS.accent : COLORS.muted,
          fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── EXERCISE PICKER ──────────────────────────────────────────────────────────

function ExercisePickerSheet({ onPick, onClose }) {
  const [query, setQuery] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('All')
  const [customName, setCustomName] = useState('')

  const filtered = ALL_EXERCISES.filter(e => {
    const matchMuscle = muscleFilter === 'All' || e.muscle === muscleFilter
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase())
    return matchMuscle && matchQuery
  })

  return (
    <BottomSheet title="Add Exercise" onClose={onClose} height="90vh">
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input style={S.input} placeholder="Search exercises..." value={query}
          onChange={e => setQuery(e.target.value)} autoFocus />
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {['All', ...MUSCLES].map(m => (
            <button key={m} onClick={() => setMuscleFilter(m)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20,
              border: `1px solid ${muscleFilter === m ? COLORS.accent : COLORS.border}`,
              background: muscleFilter === m ? COLORS.accent + '22' : COLORS.input,
              color: muscleFilter === m ? COLORS.accent : COLORS.muted,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
            }}>{m}</button>
          ))}
        </div>
        {filtered.map(e => (
          <button key={e.name + e.muscle} onClick={() => onPick(e)} style={{
            background: COLORS.input, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left',
          }}>
            <div>
              <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{e.name}</div>
              <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{e.muscle}</div>
            </div>
            <span style={{ color: COLORS.accent, fontSize: 18 }}>+</span>
          </button>
        ))}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
          <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8 }}>Custom exercise</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={S.input} placeholder="Exercise name..." value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && customName.trim()) {
                  onPick({ name: customName.trim(), muscle: 'Other' })
                  setCustomName('')
                }
              }} />
            <Btn variant="accent" style={{ flexShrink: 0, padding: '10px 16px' }}
              onClick={() => {
                if (customName.trim()) { onPick({ name: customName.trim(), muscle: 'Other' }); setCustomName('') }
              }}>+</Btn>
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>
    </BottomSheet>
  )
}

// ─── SWAP EXERCISE SHEET ──────────────────────────────────────────────────────

function SwapExerciseSheet({ currentMuscle, onPick, onClose }) {
  const [query, setQuery] = useState('')
  const [muscleFilter, setMuscleFilter] = useState(currentMuscle || 'All')

  const filtered = ALL_EXERCISES.filter(e => {
    const matchMuscle = muscleFilter === 'All' || e.muscle === muscleFilter
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase())
    return matchMuscle && matchQuery
  })

  return (
    <BottomSheet title="Swap Exercise" onClose={onClose} height="90vh">
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input style={S.input} placeholder="Search exercises..." value={query}
          onChange={e => setQuery(e.target.value)} autoFocus />
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {['All', ...MUSCLES].map(m => (
            <button key={m} onClick={() => setMuscleFilter(m)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20,
              border: `1px solid ${muscleFilter === m ? COLORS.accent : COLORS.border}`,
              background: muscleFilter === m ? COLORS.accent + '22' : COLORS.input,
              color: muscleFilter === m ? COLORS.accent : COLORS.muted,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
            }}>{m}</button>
          ))}
        </div>
        {filtered.map(e => (
          <button key={e.name + e.muscle} onClick={() => onPick(e)} style={{
            background: COLORS.input, border: `1px solid ${COLORS.border}`,
            borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left',
          }}>
            <div>
              <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{e.name}</div>
              <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{e.muscle}</div>
            </div>
            <span style={{ color: COLORS.accent, fontSize: 13, fontWeight: 700 }}>Swap →</span>
          </button>
        ))}
        <div style={{ height: 20 }} />
      </div>
    </BottomSheet>
  )
}

// ─── EXERCISE EDIT MODAL ──────────────────────────────────────────────────────

function ExerciseEditModal({ exercise, onSave, onClose }) {
  const [sets, setSets] = useState(String(exercise.sets.length))
  const [repsMin, setRepsMin] = useState(String(exercise.repsMin))
  const [repsMax, setRepsMax] = useState(String(exercise.repsMax))
  const [weight, setWeight] = useState(exercise.sets[0]?.weight || '')
  const [unit, setUnit] = useState(exercise.sets[0]?.unit || 'lbs')
  const [note, setNote] = useState(exercise.note || '')

  function handleSave() {
    const setsCount = Math.max(1, parseInt(sets) || 3)
    const newRepsMin = parseInt(repsMin) || 8
    const newRepsMax = parseInt(repsMax) || 12
    const newSets = Array.from({ length: setsCount }, (_, i) => {
      const existing = exercise.sets[i]
      return existing ? { ...existing, weight, unit } : { id: uuid(), weight, unit, reps: '', rpe: null, note: '', dropSets: [], done: false, showNote: false }
    })
    const updated = { ...exercise, repsMin: newRepsMin, repsMax: newRepsMax, note, sets: newSets }
    const allDefaults = loadExerciseDefaults()
    saveExerciseDefaults({ ...allDefaults, [exercise.name]: { repsMin: newRepsMin, repsMax: newRepsMax, weight, unit, note } })
    onSave(updated)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(8,8,9,0.95)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ ...S.card, width: '100%', borderRadius: '16px 16px 0 0', padding: '24px 20px 40px', border: 'none', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{exercise.name}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'SETS', value: sets, set: setSets },
            { label: 'REPS MIN', value: repsMin, set: setRepsMin },
            { label: 'REPS MAX', value: repsMax, set: setRepsMax },
          ].map(({ label, value, set }) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ color: COLORS.muted, fontSize: 10, marginBottom: 6 }}>{label}</div>
              <input type="number" inputMode="numeric" value={value} onChange={e => set(e.target.value)}
                style={{ ...S.input, ...S.mono, fontSize: 22, fontWeight: 700, textAlign: 'center', padding: '10px 4px' }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: COLORS.muted, fontSize: 10, marginBottom: 6 }}>STARTING WEIGHT</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="0"
              style={{ ...S.input, ...S.mono, fontSize: 22, fontWeight: 700, textAlign: 'center', padding: '10px 8px', flex: 1, color: COLORS.lbs }} />
            <button onClick={() => setUnit(u => u === 'lbs' ? 'kg' : 'lbs')} style={{
              background: COLORS.input, border: `1px solid ${COLORS.border}`, borderRadius: 8,
              color: COLORS.lbs, cursor: 'pointer', fontSize: 13, fontWeight: 700,
              padding: '10px 16px', fontFamily: "'JetBrains Mono', monospace",
            }}>{unit}</button>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: COLORS.muted, fontSize: 10, marginBottom: 6 }}>NOTES</div>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="e.g. keep elbows tucked" rows={2}
            style={{ ...S.input, resize: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn variant="accent" onClick={handleSave} style={{ flex: 1 }}>Save</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── PLAN BUILDER SHEET ───────────────────────────────────────────────────────

function PlanBuilderSheet({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [exercises, setExercises] = useState([])
  const [showPicker, setShowPicker] = useState(false)

  if (showPicker) return (
    <ExercisePickerSheet
      onPick={e => { setExercises(prev => [...prev, { ...e, sets: 3, repsMin: 8, repsMax: 12, restSec: 90 }]); setShowPicker(false) }}
      onClose={() => setShowPicker(false)}
    />
  )

  return (
    <BottomSheet title="Build Plan" onClose={onClose} height="90vh">
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input style={S.input} placeholder="Plan name..." value={name} onChange={e => setName(e.target.value)} />

        {exercises.map((ex, idx) => (
          <div key={idx} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{ex.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{ex.muscle}</div>
              </div>
              <button onClick={() => setExercises(prev => prev.filter((_, i) => i !== idx))}
                style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              {[
                { label: 'Sets', field: 'sets' },
                { label: 'Min reps', field: 'repsMin' },
                { label: 'Max reps', field: 'repsMax' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <div style={{ color: COLORS.muted, fontSize: 10, marginBottom: 4 }}>{label}</div>
                  <input type="number" value={ex[field]}
                    onChange={e => setExercises(prev => prev.map((x, i) => i === idx ? { ...x, [field]: parseInt(e.target.value) || 0 } : x))}
                    style={{ ...S.input, ...S.mono, textAlign: 'center', padding: '8px 4px' }} />
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: COLORS.muted, fontSize: 10, marginBottom: 6 }}>Rest time</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {REST_CHIPS.map(c => (
                  <button key={c.sec} onClick={() => setExercises(prev => prev.map((x, i) => i === idx ? { ...x, restSec: c.sec } : x))} style={{
                    padding: '5px 12px', borderRadius: 20,
                    border: `1px solid ${ex.restSec === c.sec ? COLORS.accent : COLORS.border}`,
                    background: ex.restSec === c.sec ? COLORS.accent + '22' : COLORS.input,
                    color: ex.restSec === c.sec ? COLORS.accent : COLORS.muted,
                    cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                  }}>{c.label}</button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Btn onClick={() => setShowPicker(true)} style={{ width: '100%' }}>+ Add Exercise</Btn>
        <Btn variant="accent" disabled={!name.trim() || exercises.length === 0} style={{ width: '100%' }}
          onClick={() => { if (name.trim() && exercises.length) onSave({ id: uuid(), name: name.trim(), exercises }) }}>
          Save Plan
        </Btn>
        <div style={{ height: 20 }} />
      </div>
    </BottomSheet>
  )
}

// ─── SESSION SETUP SCREEN ─────────────────────────────────────────────────────

function SessionSetupScreen({ sessionName, initialExercises, onStart, onCancel, workouts = [] }) {
  const [exercises, setExercises] = useState(initialExercises)
  const [showPicker, setShowPicker] = useState(false)
  const [showSwap, setShowSwap] = useState(null)
  const [showEdit, setShowEdit] = useState(null)

  function moveUp(idx) {
    if (idx === 0) return
    setExercises(prev => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a })
  }

  function moveDown(idx) {
    setExercises(prev => { if (idx >= prev.length - 1) return prev; const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a })
  }

  if (showPicker) return (
    <ExercisePickerSheet
      onPick={e => { setExercises(prev => [...prev, makeExercise(e, workouts)]); setShowPicker(false) }}
      onClose={() => setShowPicker(false)}
    />
  )

  if (showSwap !== null) return (
    <SwapExerciseSheet
      currentMuscle={exercises[showSwap]?.muscle}
      onPick={e => {
        setExercises(prev => prev.map((ex, i) => i === showSwap
          ? makeExercise({ name: e.name, muscle: e.muscle, sets: ex.sets.length, restSec: ex.restSec, repsMin: ex.repsMin, repsMax: ex.repsMax }, workouts)
          : ex))
        setShowSwap(null)
      }}
      onClose={() => setShowSwap(null)}
    />
  )

  return (
    <div style={{ ...S.app, paddingBottom: 20 }}>
      <div style={{ padding: '60px 16px 16px' }}>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none', color: COLORS.muted,
          cursor: 'pointer', fontSize: 14, marginBottom: 16, fontFamily: "'Sora', sans-serif",
        }}>← Back</button>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{sessionName}</h1>
        <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20 }}>
          {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} queued
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {exercises.map((ex, idx) => (
            <div key={ex.id} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                    <span style={S.mono}>{ex.sets.length}</span> sets ·{' '}
                    <span style={S.mono}>{ex.repsMin}–{ex.repsMax}</span> reps ·{' '}
                    <span style={S.mono}>{formatTime(ex.restSec)}</span> rest
                  </div>
                  {ex.note ? <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>{ex.note}</div> : null}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                  <Tag>{ex.muscle}</Tag>
                  <button onClick={() => setShowEdit(idx)} style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontSize: 16, padding: '4px 6px' }} title="Edit">✎</button>
                  <button onClick={() => setExercises(prev => prev.filter(e => e.id !== ex.id))}
                    style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 18, padding: '4px 6px' }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{
                  padding: '5px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: COLORS.input, color: idx === 0 ? COLORS.border : COLORS.muted,
                  cursor: idx === 0 ? 'default' : 'pointer', fontSize: 13, fontWeight: 700,
                }}>↑</button>
                <button onClick={() => moveDown(idx)} disabled={idx === exercises.length - 1} style={{
                  padding: '5px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: COLORS.input, color: idx === exercises.length - 1 ? COLORS.border : COLORS.muted,
                  cursor: idx === exercises.length - 1 ? 'default' : 'pointer', fontSize: 13, fontWeight: 700,
                }}>↓</button>
                <button onClick={() => setShowSwap(idx)} style={{
                  padding: '5px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: COLORS.input, color: COLORS.muted,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                }}>⇄ Swap</button>
              </div>
            </div>
          ))}
        </div>
        <Btn onClick={() => setShowPicker(true)} style={{ width: '100%', marginBottom: 10 }}>+ Add Exercise</Btn>
        <Btn variant="accent" disabled={exercises.length === 0} onClick={() => onStart(exercises)}
          style={{ width: '100%', padding: '16px 20px', fontSize: 17 }}>
          ▶ Start Workout
        </Btn>
      </div>
      {showEdit !== null && exercises[showEdit] && (
        <ExerciseEditModal
          exercise={exercises[showEdit]}
          onSave={updated => { setExercises(prev => prev.map((e, i) => i === showEdit ? updated : e)); setShowEdit(null) }}
          onClose={() => setShowEdit(null)}
        />
      )}
    </div>
  )
}

// ─── REST TIMER OVERLAY ───────────────────────────────────────────────────────

const RING_RADIUS = 54
const RING_CIRC = 2 * Math.PI * RING_RADIUS

function RestTimerOverlay({ phase, secondsLeft, totalSeconds, onSkip, onAdd15, onMinus15, nextExInfo }) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1
  const offset = RING_CIRC * (1 - progress)
  const isPrepTime = secondsLeft > 0 && secondsLeft <= 15
  const ringColor = isPrepTime ? '#ff8844' : progress > 0.5 ? COLORS.success : progress > 0.25 ? '#ffcc00' : COLORS.danger

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(8,8,9,0.97)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
    }}>
      <div style={{
        color: isPrepTime ? '#ff8844' : COLORS.muted,
        fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
        transition: 'color 0.4s',
        animation: isPrepTime ? 'prepPulse 1s ease-in-out infinite' : 'none',
      }}>
        {isPrepTime ? 'GET READY' : 'REST'}
      </div>
      <div style={{
        position: 'relative', width: 140, height: 140,
        borderRadius: '50%',
        boxShadow: isPrepTime ? '0 0 28px #ff884466' : 'none',
        transition: 'box-shadow 0.4s',
      }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke={COLORS.border} strokeWidth="8" />
          <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke={ringColor} strokeWidth="8"
            strokeDasharray={RING_CIRC} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ ...S.mono, fontSize: 36, fontWeight: 700, color: isPrepTime ? '#ff8844' : COLORS.text, transition: 'color 0.4s' }}>{formatTime(secondsLeft)}</span>
        </div>
      </div>

      {nextExInfo && (
        <div style={{
          ...S.card,
          width: 280, textAlign: 'center', padding: '14px 18px',
          borderColor: isPrepTime ? '#ff884466' : COLORS.border,
          background: isPrepTime ? '#ff884408' : COLORS.card,
          transition: 'border-color 0.4s, background 0.4s',
        }}>
          <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Up Next</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: isPrepTime ? '#ff8844' : COLORS.text, marginBottom: 4 }}>{nextExInfo.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>{nextExInfo.detail}</div>
          {nextExInfo.weight ? (
            <div style={{ ...S.mono, color: COLORS.lbs, fontSize: 13, marginTop: 4 }}>{nextExInfo.weight}{nextExInfo.unit}</div>
          ) : null}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Btn onClick={onSkip} style={{ padding: '12px 24px' }}>Skip Rest →</Btn>
        <Btn onClick={onMinus15} style={{ padding: '12px 24px' }}>−15s</Btn>
        <Btn onClick={onAdd15} style={{ padding: '12px 24px' }}>+15s</Btn>
      </div>
    </div>
  )
}

// ─── SESSION PLAN SHEET ───────────────────────────────────────────────────────

function SessionPlanSheet({ exercises, currentIdx, onJump, onAddExercise, onReorder, onEndWorkout, onClose, workouts = [] }) {
  const [showPicker, setShowPicker] = useState(false)

  function moveUp(idx) {
    if (idx === 0) return
    const a = [...exercises]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]
    onReorder(a, currentIdx === idx ? idx - 1 : currentIdx === idx - 1 ? idx : currentIdx)
  }

  function moveDown(idx) {
    if (idx >= exercises.length - 1) return
    const a = [...exercises]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]
    onReorder(a, currentIdx === idx ? idx + 1 : currentIdx === idx + 1 ? idx : currentIdx)
  }

  if (showPicker) return (
    <ExercisePickerSheet
      onPick={e => { onAddExercise(makeExercise(e, workouts)); setShowPicker(false) }}
      onClose={() => setShowPicker(false)}
    />
  )

  return (
    <BottomSheet title="Session Plan" onClose={onClose}>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {exercises.map((ex, idx) => {
          const doneSets = ex.sets.filter(s => s.done).length
          const isCurrent = idx === currentIdx
          return (
            <div key={ex.id} style={{
              ...S.card, border: `1px solid ${isCurrent ? COLORS.accent : COLORS.border}`,
              background: isCurrent ? COLORS.accent + '11' : COLORS.card,
            }}>
              <div onClick={() => { onJump(idx); onClose() }} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: isCurrent ? COLORS.accent : COLORS.text }}>
                    {idx + 1}. {ex.name}
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{doneSets}/{ex.sets.length} sets done</div>
                </div>
                {doneSets === ex.sets.length && <span style={{ color: COLORS.success, fontSize: 18 }}>✓</span>}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{
                  padding: '4px 10px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: COLORS.input, color: idx === 0 ? COLORS.border : COLORS.muted,
                  cursor: idx === 0 ? 'default' : 'pointer', fontSize: 12, fontWeight: 700,
                }}>↑</button>
                <button onClick={() => moveDown(idx)} disabled={idx === exercises.length - 1} style={{
                  padding: '4px 10px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                  background: COLORS.input, color: idx === exercises.length - 1 ? COLORS.border : COLORS.muted,
                  cursor: idx === exercises.length - 1 ? 'default' : 'pointer', fontSize: 12, fontWeight: 700,
                }}>↓</button>
              </div>
            </div>
          )
        })}
        <Btn onClick={() => setShowPicker(true)} style={{ width: '100%', marginTop: 4 }}>+ Add Exercise</Btn>
        <Btn variant="danger" onClick={onEndWorkout} style={{ width: '100%' }}>End Workout</Btn>
        <div style={{ height: 20 }} />
      </div>
    </BottomSheet>
  )
}

// ─── ACTIVE WORKOUT SCREEN ────────────────────────────────────────────────────

function ActiveWorkoutScreen({ session, onUpdate, onEnd, workouts = [], restTimer, setRestTimer }) {
  const [showPlanSheet, setShowPlanSheet] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [showLastWorkout, setShowLastWorkout] = useState(false)
  const [tick, setTick] = useState(0)
  const [dismissedBanners, setDismissedBanners] = useState(new Set())
  const [exerciseHistory] = useState(() => loadExerciseHistory())
  const vibrated15Ref = useRef(false)
  const elapsed = useSessionTimer(true)

  const exercises = session.exercises
  const exIdx = session.exerciseIndex
  const ex = exercises[exIdx]
  const setIdx = ex ? ex.activeSetIndex : 0
  const currentSet = ex ? ex.sets[setIdx] : null

  // Reset vibration flag when rest starts
  useEffect(() => {
    if (restTimer.phase === 'resting') vibrated15Ref.current = false
  }, [restTimer.phase])

  // Tick interval — drives display updates and phase-transition checks
  useEffect(() => {
    if (restTimer.phase === 'idle') return
    const id = setInterval(() => setTick(t => t + 1), 250)
    return () => clearInterval(id)
  }, [restTimer.phase])

  // Phase transition check — runs on every tick
  useEffect(() => {
    if (restTimer.phase === 'idle' || !restTimer.startedAt) return
    const remaining = restTimer.durationMs - (Date.now() - restTimer.startedAt)
    if (remaining <= 15000 && !vibrated15Ref.current) {
      vibrated15Ref.current = true
      try { navigator.vibrate?.(200) } catch (_) {}
    }
    if (remaining > 0) return
    if (restTimer.phase === 'resting') {
      setRestTimer({ phase: 'idle', startedAt: null, durationMs: 0, targetRestSec: 0 })
      playBeep()
      fireNotification()
      advanceSet()
    }
  }, [tick])

  const timerSecondsLeft = restTimer.phase !== 'idle' && restTimer.startedAt
    ? Math.max(0, Math.ceil((restTimer.durationMs - (Date.now() - restTimer.startedAt)) / 1000))
    : 0
  const timerTotalSeconds = Math.round(restTimer.durationMs / 1000)

  function startRestTimer(restSec) {
    setRestTimer({ phase: 'resting', startedAt: Date.now(), durationMs: restSec * 1000, targetRestSec: restSec })
  }

  function skipRest() {
    setRestTimer({ phase: 'idle', startedAt: null, durationMs: 0, targetRestSec: 0 })
    advanceSet()
  }

  function add15() {
    setRestTimer(prev => ({ ...prev, durationMs: prev.durationMs + 15000 }))
  }

  function minus15() {
    setRestTimer(prev => ({ ...prev, durationMs: Math.max(5000, prev.durationMs - 15000) }))
  }

  function advanceSet() {
    if (!ex) return
    const nextSetIdx = setIdx + 1
    if (nextSetIdx < ex.sets.length) {
      onUpdate(exIdx, { activeSetIndex: nextSetIdx })
    } else {
      const nextExIdx = exIdx + 1
      if (nextExIdx < exercises.length) onUpdate(null, null, nextExIdx)
    }
  }

  function markSetDone() {
    if (!currentSet) return
    const updatedSets = ex.sets.map((s, i) => i === setIdx ? { ...s, done: true } : s)
    onUpdate(exIdx, { sets: updatedSets })
    const isLastSet = setIdx === ex.sets.length - 1
    const isLastExercise = exIdx === exercises.length - 1
    if (isLastSet && isLastExercise) {
      setRestTimer({ phase: 'idle', startedAt: null, durationMs: 0, targetRestSec: 0 })
      onEnd()
    } else {
      startRestTimer(ex.restSec)
    }
  }

  function updateCurrentSet(field, value) {
    if (!currentSet) return
    const updatedSets = ex.sets.map((s, i) => i === setIdx ? { ...s, [field]: value } : s)
    onUpdate(exIdx, { sets: updatedSets })
  }

  function addDropSet() {
    if (!currentSet) return
    const updatedSets = ex.sets.map((s, i) =>
      i === setIdx ? { ...s, dropSets: [...s.dropSets, { id: uuid(), weight: '', reps: '' }] } : s)
    onUpdate(exIdx, { sets: updatedSets })
  }

  function updateDropSet(dsIdx, field, value) {
    if (!currentSet) return
    const updatedSets = ex.sets.map((s, i) =>
      i === setIdx ? { ...s, dropSets: s.dropSets.map((ds, j) => j === dsIdx ? { ...ds, [field]: value } : ds) } : s)
    onUpdate(exIdx, { sets: updatedSets })
  }

  if (!ex) return null

  const isLastSet = setIdx === ex.sets.length - 1
  const isLastExercise = exIdx === exercises.length - 1

  // Compute "Up Next" info for rest timer overlay
  const nextExInfo = (() => {
    if (restTimer.phase === 'idle') return null
    const nextSetIdx = setIdx + 1
    if (nextSetIdx < ex.sets.length) {
      const ns = ex.sets[nextSetIdx]
      return { name: ex.name, detail: `Set ${nextSetIdx + 1}/${ex.sets.length} · ${ex.repsMin}–${ex.repsMax} reps`, weight: ns?.weight || '', unit: ns?.unit || '' }
    }
    const nextEx = exercises[exIdx + 1]
    if (!nextEx) return null
    return { name: nextEx.name, detail: `${nextEx.sets.length} sets · ${nextEx.repsMin}–${nextEx.repsMax} reps`, weight: nextEx.sets[0]?.weight || '', unit: nextEx.sets[0]?.unit || '' }
  })()

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: COLORS.bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* Top bar */}
        <div style={{ padding: '52px 16px 16px', borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, background: COLORS.bg, zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Exercise {exIdx + 1}/{exercises.length}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{ex.name}</h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <Tag>{ex.muscle}</Tag>
                <Tag color={COLORS.muted}>{formatTime(ex.restSec)} rest</Tag>
                <button onClick={() => setShowSwap(true)} style={{
                  background: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 12,
                  color: COLORS.muted, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  padding: '2px 8px', fontFamily: "'Sora', sans-serif",
                }}>⇄ Swap</button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
              <button onClick={() => setShowLastWorkout(true)} title="Last Workout" style={{
                background: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 8,
                color: COLORS.muted, cursor: 'pointer', fontSize: 14, padding: '4px 8px',
                fontFamily: "'Sora', sans-serif",
              }}>📋</button>
              <div style={{ ...S.mono, fontSize: 15, fontWeight: 700, color: COLORS.accent }}>{formatMMSS(elapsed)}</div>
            </div>
          </div>
          {/* Set dots */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {ex.sets.map((s, i) => (
              <button key={s.id} onClick={() => onUpdate(exIdx, { activeSetIndex: i })} style={{
                height: 10, borderRadius: 5, width: i === setIdx ? 24 : 10,
                background: s.done ? COLORS.success : i === setIdx ? COLORS.accent : COLORS.border,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0,
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...S.mono, fontSize: 12, color: COLORS.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            Set {setIdx + 1} of {ex.sets.length}
          </div>

          {ex.targetWeight && (
            <div style={{ ...S.card, marginBottom: 14, padding: '10px 14px', borderColor: COLORS.accent + '44', background: COLORS.accent + '08' }}>
              <span style={{ color: COLORS.muted, fontSize: 11 }}>AI target: </span>
              <span style={{ ...S.mono, color: COLORS.accent, fontWeight: 700 }}>{ex.targetWeight}</span>
              <span style={{ color: COLORS.muted, fontSize: 12 }}> · {ex.repsMin}–{ex.repsMax} reps</span>
            </div>
          )}

          {(() => {
            const lastHist = exerciseHistory[ex.name]?.[0]
            const showBanner = lastHist && lastHist.sets.length > 0 && !dismissedBanners.has(ex.name)
            if (!showBanner) return null
            return (
              <div style={{ ...S.card, marginBottom: 14, padding: '10px 14px', borderColor: COLORS.success + '33', background: COLORS.success + '08', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: COLORS.success, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Last time ({lastHist.date})</span>
                  <button onClick={() => setDismissedBanners(prev => new Set([...prev, ex.name]))}
                    style={{ background: 'none', border: 'none', color: COLORS.muted, cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: '0 2px' }}>✕</button>
                </div>
                {lastHist.sets.map((s, i) => (
                  <div key={i} style={{ ...S.mono, fontSize: 12, color: COLORS.muted, paddingTop: 2 }}>
                    <span style={{ color: COLORS.text }}>Set {s.setNumber}</span>
                    {' — '}
                    <span style={{ color: COLORS.lbs }}>{s.weight || '—'}{s.unit}</span>
                    {' × '}
                    <span>{s.reps || '—'} reps</span>
                    {s.note ? <span style={{ color: COLORS.muted, fontStyle: 'italic' }}> ({s.note})</span> : null}
                  </div>
                ))}
              </div>
            )
          })()}

          {setIdx > 0 && ex.sets[setIdx - 1].done && (
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 12, ...S.mono }}>
              Prev: {ex.sets[setIdx - 1].weight || '—'}{ex.sets[setIdx - 1].unit} × {ex.sets[setIdx - 1].reps || '—'} reps
            </div>
          )}

          {currentSet && (
            <>
              {/* Weight × Reps */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 6 }}>WEIGHT</div>
                  <input type="number" inputMode="decimal" value={currentSet.weight}
                    onChange={e => updateCurrentSet('weight', e.target.value)} placeholder="0"
                    style={{ ...S.input, ...S.mono, fontSize: 32, fontWeight: 700, textAlign: 'center', padding: '12px 8px', color: COLORS.lbs }} />
                  <button onClick={() => updateCurrentSet('unit', currentSet.unit === 'lbs' ? 'kg' : 'lbs')} style={{
                    marginTop: 6, background: 'none', border: `1px solid ${COLORS.border}`,
                    borderRadius: 6, color: COLORS.lbs, cursor: 'pointer', fontSize: 12,
                    fontWeight: 700, padding: '4px 12px', width: '100%', fontFamily: "'JetBrains Mono', monospace",
                  }}>{currentSet.unit}</button>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 24, fontWeight: 300 }}>×</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 6 }}>REPS</div>
                  <input type="number" inputMode="numeric" value={currentSet.reps}
                    onChange={e => updateCurrentSet('reps', e.target.value)} placeholder="0"
                    style={{ ...S.input, ...S.mono, fontSize: 32, fontWeight: 700, textAlign: 'center', padding: '12px 8px' }} />
                  <div style={{ marginTop: 6, height: 28 }} />
                </div>
              </div>

              {/* RPE */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 8 }}>RPE</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[6, 7, 8, 9, 10].map(rpe => (
                    <button key={rpe} onClick={() => updateCurrentSet('rpe', currentSet.rpe === rpe ? null : rpe)} style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      border: `1px solid ${currentSet.rpe === rpe ? COLORS.accent : COLORS.border}`,
                      background: currentSet.rpe === rpe ? COLORS.accent + '22' : COLORS.input,
                      color: currentSet.rpe === rpe ? COLORS.accent : COLORS.muted,
                      cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                    }}>{rpe}</button>
                  ))}
                </div>
                {currentSet.rpe && (
                  <div style={{ color: COLORS.accent, fontSize: 12, marginTop: 6, textAlign: 'center' }}>{RPE_LABELS[currentSet.rpe]}</div>
                )}
              </div>

              {/* Drop sets */}
              {currentSet.dropSets.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 8 }}>DROP SETS</div>
                  {currentSet.dropSets.map((ds, dsIdx) => (
                    <div key={ds.id} style={{ display: 'flex', gap: 8, marginBottom: 8, paddingLeft: 16, alignItems: 'center' }}>
                      <span style={{ color: COLORS.muted, fontSize: 12 }}>↓</span>
                      <input type="number" inputMode="decimal" value={ds.weight}
                        onChange={e => updateDropSet(dsIdx, 'weight', e.target.value)} placeholder="wt"
                        style={{ ...S.input, ...S.mono, flex: 1, padding: '8px', textAlign: 'center', color: COLORS.lbs }} />
                      <span style={{ color: COLORS.muted }}>×</span>
                      <input type="number" inputMode="numeric" value={ds.reps}
                        onChange={e => updateDropSet(dsIdx, 'reps', e.target.value)} placeholder="reps"
                        style={{ ...S.input, ...S.mono, flex: 1, padding: '8px', textAlign: 'center' }} />
                    </div>
                  ))}
                </div>
              )}

              {currentSet.showNote && (
                <textarea value={currentSet.note} onChange={e => updateCurrentSet('note', e.target.value)}
                  placeholder="Set note..." rows={2}
                  style={{ ...S.input, resize: 'none', marginBottom: 14 }} />
              )}

              {/* Secondary buttons */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { label: '+ Note', action: () => updateCurrentSet('showNote', !currentSet.showNote) },
                  { label: '+ Drop Set', action: addDropSet },
                  { label: '+ Set', action: () => {
                    const newSet = { id: uuid(), weight: currentSet.weight || '', unit: currentSet.unit || 'lbs', reps: '', rpe: null, note: '', dropSets: [], done: false, showNote: false }
                    onUpdate(exIdx, { sets: [...ex.sets, newSet] })
                  }},
                  { label: '− Set', disabled: ex.sets.length <= 1, action: () => {
                    if (ex.sets.length <= 1) return
                    const newSets = ex.sets.slice(0, -1)
                    onUpdate(exIdx, { sets: newSets, activeSetIndex: Math.min(setIdx, newSets.length - 1) })
                  }},
                ].map(({ label, action, disabled }) => (
                  <button key={label} onClick={action} disabled={disabled} style={{
                    padding: '8px 14px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
                    background: COLORS.input, color: disabled ? COLORS.border : COLORS.muted,
                    cursor: disabled ? 'default' : 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                  }}>{label}</button>
                ))}
              </div>
            </>
          )}

          <Btn variant="accent" onClick={markSetDone} style={{ width: '100%', padding: '18px', fontSize: 17, marginBottom: 10 }}>
            {isLastSet && isLastExercise ? '✓ Finish Workout' : isLastSet ? '✓ Done — Next Exercise →' : '✓ Set Done'}
          </Btn>

          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={advanceSet} style={{ flex: 1 }}>Skip Set</Btn>
            {!isLastExercise && <Btn onClick={() => onUpdate(null, null, exIdx + 1)} style={{ flex: 1 }}>Next Exercise →</Btn>}
            <Btn variant="danger" onClick={onEnd} style={{ flex: 1 }}>End</Btn>
          </div>
        </div>

        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 110 }}>
          <button onClick={() => setShowPlanSheet(true)} style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 24, padding: '10px 20px', color: COLORS.text, cursor: 'pointer',
            fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            {exIdx + 1}/{exercises.length} exercises ≡
          </button>
        </div>
      </div>

      {restTimer.phase !== 'idle' && (
        <RestTimerOverlay phase={restTimer.phase} secondsLeft={timerSecondsLeft}
          totalSeconds={timerTotalSeconds} onSkip={skipRest} onAdd15={add15} onMinus15={minus15} nextExInfo={nextExInfo} />
      )}

      {showSwap && (
        <SwapExerciseSheet
          currentMuscle={ex.muscle}
          onPick={e => {
            onUpdate(exIdx, makeExercise({ name: e.name, muscle: e.muscle, sets: ex.sets.length, restSec: ex.restSec, repsMin: ex.repsMin, repsMax: ex.repsMax }, workouts))
            setShowSwap(false)
          }}
          onClose={() => setShowSwap(false)}
        />
      )}

      {showPlanSheet && (
        <SessionPlanSheet exercises={exercises} currentIdx={exIdx}
          onJump={idx => onUpdate(null, null, idx)}
          onAddExercise={ex => onUpdate(null, null, null, ex)}
          onReorder={(newExercises, newIdx) => onUpdate(null, null, newIdx, null, newExercises)}
          onEndWorkout={onEnd} onClose={() => setShowPlanSheet(false)} workouts={workouts} />
      )}

      {showLastWorkout && (() => {
        const prevSession = workouts.find(w => w.name === session.name)
        return (
          <BottomSheet title="Last Workout" onClose={() => setShowLastWorkout(false)} height="85vh">
            <div style={{ padding: '14px 16px' }}>
              {!prevSession ? (
                <div style={{ color: COLORS.muted, fontSize: 14, textAlign: 'center', marginTop: 40 }}>
                  No previous session found for this workout.
                </div>
              ) : (
                <>
                  <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>
                    {formatDate(prevSession.startedAt)}
                    {prevSession.endedAt && ` · ${formatDuration(prevSession.endedAt - new Date(prevSession.startedAt).getTime())}`}
                  </div>
                  {prevSession.exercises.map((pex, eIdx) => (
                    <div key={eIdx} style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {pex.name} <Tag>{pex.muscle}</Tag>
                      </div>
                      {pex.sets.map((s, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: sIdx < pex.sets.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                          <span style={{ color: COLORS.muted, fontSize: 12, ...S.mono }}>Set {sIdx + 1}</span>
                          <span style={{ ...S.mono, fontSize: 13 }}>
                            <span style={{ color: COLORS.lbs }}>{s.weight || '—'}{s.unit}</span>
                            <span style={{ color: COLORS.muted }}> × </span>
                            <span>{s.reps || '—'} reps</span>
                            {s.rpe && <span style={{ color: COLORS.muted }}> · RPE {s.rpe}</span>}
                            {s.note && <span style={{ color: COLORS.muted, fontStyle: 'italic' }}> · {s.note}</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </BottomSheet>
        )
      })()}
    </>
  )
}

// ─── QUICK START SHEET ────────────────────────────────────────────────────────

function QuickStartSheet({ type, name: initialName, muscles: initialMuscles, exercises: initialExercises, onStart, onSave, onReset, onClose }) {
  const [customName, setCustomName] = useState(initialName)
  const [muscles, setMuscles] = useState(initialMuscles)
  const [showMusclePicker, setShowMusclePicker] = useState(false)
  const [exercises, setExercises] = useState(() => initialExercises.map(ex => ({ ...ex, _id: uuid() })))
  const [editingIdx, setEditingIdx] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [dragVisual, setDragVisual] = useState(null)
  const dragRef = useRef(null)
  const overIdxRef = useRef(null)
  const exercisesRef = useRef(exercises)
  exercisesRef.current = exercises

  const ITEM_H = 130

  const availableMuscles = MUSCLES.filter(m => !muscles.includes(m))
  const suggestions = [...new Set(
    muscles.length > 0
      ? muscles.flatMap(m => EXERCISE_LIBRARY[m] || [])
      : ALL_EXERCISES.map(e => e.name)
  )]

  function startRename(idx) {
    setEditingIdx(idx)
    setRenameValue(exercises[idx].name)
  }

  function commitRename(name) {
    if (name.trim()) {
      setExercises(prev => prev.map((ex, i) => i === editingIdx ? { ...ex, name: name.trim() } : ex))
    }
    setEditingIdx(null)
    setRenameValue('')
  }

  function onHandleTouchStart(idx, e) {
    if (editingIdx !== null) return
    e.stopPropagation()
    const touch = e.touches[0]
    dragRef.current = { idx, startY: touch.clientY }
    overIdxRef.current = idx
    setDragVisual({ idx, offsetY: 0, overIdx: idx })

    function onMove(e2) {
      if (!dragRef.current) return
      e2.preventDefault()
      const t = e2.touches[0]
      const offsetY = t.clientY - dragRef.current.startY
      const n = exercisesRef.current.length
      const newOver = Math.max(0, Math.min(n - 1, Math.round(dragRef.current.idx + offsetY / ITEM_H)))
      overIdxRef.current = newOver
      setDragVisual({ idx: dragRef.current.idx, offsetY, overIdx: newOver })
    }

    function onEnd() {
      if (dragRef.current) {
        const from = dragRef.current.idx
        const to = overIdxRef.current ?? from
        if (from !== to) {
          setExercises(prev => {
            const a = [...prev]
            const [removed] = a.splice(from, 1)
            a.splice(to, 0, removed)
            return a
          })
        }
      }
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      dragRef.current = null
      overIdxRef.current = null
      setDragVisual(null)
    }

    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
  }

  const payload = () => ({ name: customName, muscles, exercises: exercises.map(({ _id, ...rest }) => rest) })

  if (showPicker) return (
    <ExercisePickerSheet
      onPick={e => {
        setExercises(prev => [...prev, { name: e.name, muscle: e.muscle, sets: 3, repsMin: 8, repsMax: 12, restSec: 90, _id: uuid() }])
        setShowPicker(false)
      }}
      onClose={() => setShowPicker(false)}
    />
  )

  return (
    <BottomSheet title={type} onClose={onClose} height="92vh">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 0', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12 }}>

            {/* Name + Muscles */}
            <div style={{ ...S.card, gap: 10, display: 'flex', flexDirection: 'column' }}>
              <div>
                <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>WORKOUT NAME</div>
                <input
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  style={{ ...S.input, fontWeight: 700, fontSize: 15 }}
                />
              </div>
              <div>
                <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>MUSCLE GROUPS</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {muscles.map(m => (
                    <span key={m} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: COLORS.accent + '22', color: COLORS.accent,
                      border: `1px solid ${COLORS.accent}44`,
                    }}>
                      {m}
                      <button onClick={() => setMuscles(prev => prev.filter(x => x !== m))} style={{
                        background: 'none', border: 'none', color: COLORS.accent,
                        cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1,
                      }}>✕</button>
                    </span>
                  ))}
                  {availableMuscles.length > 0 && (
                    <button onClick={() => setShowMusclePicker(p => !p)} style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: COLORS.input, color: COLORS.muted,
                      border: `1px solid ${showMusclePicker ? COLORS.accent : COLORS.border}`,
                      cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                    }}>+ Add</button>
                  )}
                </div>
                {showMusclePicker && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {availableMuscles.map(m => (
                      <button key={m} onClick={() => { setMuscles(prev => [...prev, m]); setShowMusclePicker(false) }} style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: COLORS.input, color: COLORS.text,
                        border: `1px solid ${COLORS.border}`,
                        cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                      }}>{m}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {exercises.map((ex, idx) => {
              const isDragging = dragVisual?.idx === idx
              const isTarget = dragVisual && dragVisual.overIdx === idx && dragVisual.idx !== idx
              let shiftY = 0
              if (dragVisual && !isDragging) {
                const { idx: di, overIdx: oi } = dragVisual
                if (di < oi && idx > di && idx <= oi) shiftY = -ITEM_H
                else if (di > oi && idx >= oi && idx < di) shiftY = ITEM_H
              }
              return (
                <div key={ex._id} style={{
                  ...S.card,
                  border: `1px solid ${isTarget ? COLORS.accent : COLORS.border}`,
                  transform: isDragging ? `translateY(${dragVisual.offsetY}px)` : shiftY !== 0 ? `translateY(${shiftY}px)` : 'none',
                  transition: isDragging ? 'none' : 'transform 0.15s',
                  opacity: isDragging ? 0.85 : 1,
                  position: 'relative', zIndex: isDragging ? 10 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      onTouchStart={e => onHandleTouchStart(idx, e)}
                      style={{ color: COLORS.muted, fontSize: 18, cursor: 'grab', padding: '3px 2px', touchAction: 'none', flexShrink: 0, userSelect: 'none', WebkitUserSelect: 'none', lineHeight: 1.4 }}
                    >≡</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {editingIdx === idx ? (
                        <div>
                          <input autoFocus value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') commitRename(renameValue) }}
                            style={{ ...S.input, fontSize: 14, marginBottom: 8 }}
                          />
                          {suggestions.filter(s => s.toLowerCase().includes(renameValue.toLowerCase()) && s.toLowerCase() !== renameValue.toLowerCase()).slice(0, 8).length > 0 && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                              {suggestions.filter(s => s.toLowerCase().includes(renameValue.toLowerCase()) && s.toLowerCase() !== renameValue.toLowerCase()).slice(0, 8).map(s => (
                                <button key={s} onClick={() => commitRename(s)} style={{
                                  padding: '4px 10px', borderRadius: 12, border: `1px solid ${COLORS.border}`,
                                  background: COLORS.input, color: COLORS.text, cursor: 'pointer',
                                  fontSize: 11, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                                }}>{s}</button>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 8 }}>
                            <Btn onClick={() => setEditingIdx(null)} style={{ flex: 1, padding: '8px' }}>Cancel</Btn>
                            <Btn variant="accent" onClick={() => commitRename(renameValue)} style={{ flex: 1, padding: '8px' }}>OK</Btn>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => startRename(idx)} style={{
                            background: 'none', border: 'none', color: COLORS.text, fontWeight: 600,
                            fontSize: 14, cursor: 'pointer', textAlign: 'left', padding: 0,
                            fontFamily: "'Sora', sans-serif",
                          }}>
                            {ex.name} <span style={{ color: COLORS.muted, fontSize: 11 }}>✎</span>
                          </button>
                          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{ex.muscle}</div>
                        </>
                      )}
                    </div>
                    {editingIdx !== idx && (
                      <button onClick={() => setExercises(prev => prev.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 18, flexShrink: 0, padding: '2px 4px' }}>✕</button>
                    )}
                  </div>
                  {editingIdx !== idx && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ color: COLORS.muted, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>REST</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {REST_CHIPS.map(c => (
                          <button key={c.sec}
                            onClick={() => setExercises(prev => prev.map((x, i) => i === idx ? { ...x, restSec: c.sec } : x))}
                            style={{
                              padding: '4px 10px', borderRadius: 20,
                              border: `1px solid ${ex.restSec === c.sec ? COLORS.accent : COLORS.border}`,
                              background: ex.restSec === c.sec ? COLORS.accent + '22' : COLORS.input,
                              color: ex.restSec === c.sec ? COLORS.accent : COLORS.muted,
                              cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                            }}>{c.label}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <button onClick={() => setShowPicker(true)} style={{
              background: 'none', border: `1px dashed ${COLORS.border}`, borderRadius: 10,
              color: COLORS.muted, cursor: 'pointer', padding: '12px', width: '100%',
              fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif",
            }}>+ Add Exercise</button>
          </div>
        </div>

        {/* Fixed bottom actions */}
        <div style={{ flexShrink: 0, borderTop: `1px solid ${COLORS.border}`, padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
          <Btn variant="accent" disabled={exercises.length === 0} onClick={() => onStart(customName, payload().exercises)}
            style={{ width: '100%', padding: '15px', fontSize: 16, marginBottom: 8 }}>
            ▶ Start Workout
          </Btn>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={() => onSave(payload())} style={{ flex: 1, padding: '10px', fontSize: 13 }}>Save</Btn>
            <Btn onClick={onReset} style={{ flex: 1, padding: '10px', fontSize: 13 }}>Reset</Btn>
          </div>
        </div>

      </div>
    </BottomSheet>
  )
}

function getCustomQuickStart(customQuickStarts, type) {
  const v = customQuickStarts[type]
  if (!v) return null
  if (Array.isArray(v)) return { name: type, muscles: QUICK_START_MUSCLES[type] || [], exercises: v }
  return v
}

// ─── LOG TAB ──────────────────────────────────────────────────────────────────

function LogTab({ workouts, savedPlans, aiCycle, onQuickStart, onStartPlan, onStartCycleDay, onBuildPlan, onDeletePlan, customQuickStarts, onSaveQuickStart }) {
  const [showSheet, setShowSheet] = useState(null)
  const now = new Date()
  const sessionsThisWeek = workouts.filter(w => isWithin7Days(w.startedAt)).length

  let cycleProgress = null
  if (aiCycle) {
    const diff = Math.floor((Date.now() - new Date(aiCycle.generatedAt).getTime()) / 86400000)
    cycleProgress = Math.min(diff, 14)
  }

  return (
  <>
    <div style={{ padding: '60px 16px 100px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 4 }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
          <span style={{ color: COLORS.accent }}>FORGE</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'This Week', value: sessionsThisWeek, unit: 'sessions' },
          { label: 'All Time', value: workouts.length, unit: 'sessions' },
          { label: 'Plans', value: savedPlans.length, unit: 'saved' },
        ].map(({ label, value, unit }) => (
          <div key={label} style={{ ...S.card, textAlign: 'center' }}>
            <div style={{ ...S.mono, fontSize: 26, fontWeight: 700, color: COLORS.accent }}>{value}</div>
            <div style={{ color: COLORS.muted, fontSize: 10, marginTop: 2 }}>{unit}</div>
            <div style={{ color: COLORS.muted, fontSize: 9, marginTop: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      {aiCycle && cycleProgress !== null && (
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{aiCycle.cycleName}</span>
            <span style={{ ...S.mono, color: COLORS.muted, fontSize: 12 }}>Day {cycleProgress}/14</span>
          </div>
          <div style={{ background: COLORS.input, borderRadius: 4, height: 4 }}>
            <div style={{ height: 4, borderRadius: 4, background: COLORS.accent, width: `${(cycleProgress / 14) * 100}%` }} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Quick Start</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {QUICK_START_TYPES.map(type => {
            const custom = getCustomQuickStart(customQuickStarts, type)
            const displayName = custom?.name || type
            const displayMuscles = custom?.muscles || QUICK_START_MUSCLES[type] || []
            return (
              <div key={type} onClick={() => setShowSheet(type)}
                style={{ ...S.card, cursor: 'pointer', textAlign: 'left', padding: '14px 16px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: COLORS.accent }}>{displayName}</div>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>
                  {displayMuscles.slice(0, 2).join(' · ') || 'Custom'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {aiCycle && aiCycle.week1 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>AI Cycle — Week 1</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {aiCycle.week1.slice(0, 4).map((day, idx) => (
              <div key={idx} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{day.dayLabel} — {day.focus}</div>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{day.exercises?.length || 0} exercises · {day.estimatedDuration}</div>
                </div>
                <Btn variant="accent" onClick={() => onStartCycleDay(day)} style={{ padding: '8px 14px', fontSize: 13 }}>▶</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedPlans.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Saved Plans</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedPlans.map(plan => (
              <div key={plan.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{plan.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{plan.exercises.length} exercises</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Btn variant="accent" onClick={() => onStartPlan(plan)} style={{ padding: '8px 16px', fontSize: 13 }}>Start</Btn>
                  <button onClick={() => onDeletePlan(plan.id)}
                    style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Btn onClick={onBuildPlan} style={{ width: '100%' }}>+ Build Plan</Btn>
    </div>
    {showSheet && (() => {
      const custom = getCustomQuickStart(customQuickStarts, showSheet)
      return (
        <QuickStartSheet
          type={showSheet}
          name={custom?.name || showSheet}
          muscles={custom?.muscles || QUICK_START_MUSCLES[showSheet] || []}
          exercises={custom?.exercises || QUICK_START_EXERCISES[showSheet] || []}
          onStart={(sessionName, templates) => { onQuickStart(showSheet, sessionName, templates); setShowSheet(null) }}
          onSave={data => { onSaveQuickStart(showSheet, data) }}
          onReset={() => { onSaveQuickStart(showSheet, null) }}
          onClose={() => setShowSheet(null)}
        />
      )
    })()}
  </>
  )
}

// ─── PLAN TAB ─────────────────────────────────────────────────────────────────

function PlanTab({ aiCycle, workouts, onCycleGenerated, profile }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [week1Open, setWeek1Open] = useState(true)
  const [week2Open, setWeek2Open] = useState(false)

  async function generate() {
    setLoading(true); setError(null)
    try {
      const text = await callAnthropic(
        [{ role: 'user', content: buildCyclePrompt(workouts, profile) }],
        4000,
        'You are a strength coach that outputs ONLY raw JSON with no markdown, no code fences, no explanation, and no text before or after the JSON object.'
      )
      const cycle = parseCycleResponse(text)
      if (!cycle) throw new Error('Failed to parse AI response. Try again.')
      onCycleGenerated({ ...cycle, generatedAt: new Date().toISOString() })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!aiCycle) {
    return (
      <div style={{ padding: '60px 16px 100px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>AI Training Cycle</h2>
        <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Generate a personalized 2-week training plan based on your workout history and goals.
        </p>
        {error && <div style={{ ...S.card, borderColor: COLORS.danger + '44', color: COLORS.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <Btn variant="accent" onClick={generate} disabled={loading} style={{ width: '100%', padding: '16px', fontSize: 17 }}>
          {loading ? '⟳ Generating...' : '✦ Generate AI Plan'}
        </Btn>
      </div>
    )
  }

  const daysRemaining = 14 - Math.min(Math.floor((Date.now() - new Date(aiCycle.generatedAt)) / 86400000), 14)

  return (
    <div style={{ padding: '60px 16px 100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{aiCycle.cycleName}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Tag>{aiCycle.split}</Tag>
            <Tag color={COLORS.accent}>{daysRemaining}d remaining</Tag>
          </div>
        </div>
        <button onClick={generate} disabled={loading} style={{
          background: COLORS.input, border: `1px solid ${COLORS.border}`,
          borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
          color: COLORS.muted, fontSize: 13, fontFamily: "'Sora', sans-serif",
        }}>{loading ? '⟳' : '↺ Refresh'}</button>
      </div>

      {error && <div style={{ ...S.card, borderColor: COLORS.danger + '44', color: COLORS.danger, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {aiCycle.coachNote && (
        <div style={{ ...S.card, borderColor: COLORS.accent + '44', marginBottom: 16 }}>
          <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>COACH NOTE</div>
          <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.6 }}>{aiCycle.coachNote}</p>
        </div>
      )}

      {aiCycle.progressionRules && (
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={{ color: COLORS.muted, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>PROGRESSION</div>
          <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.6 }}>{aiCycle.progressionRules}</p>
        </div>
      )}

      {[
        { label: 'Week 1', days: aiCycle.week1, open: week1Open, toggle: () => setWeek1Open(p => !p) },
        { label: 'Week 2', days: aiCycle.week2, open: week2Open, toggle: () => setWeek2Open(p => !p) },
      ].map(({ label, days, open, toggle }) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <button onClick={toggle} style={{
            width: '100%', background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Sora', sans-serif",
          }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>{label}</span>
            <span style={{ color: COLORS.muted }}>{open ? '▲' : '▼'}</span>
          </button>
          {open && days && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {days.map((day, idx) => (
                <div key={idx} style={S.card}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                    {day.dayLabel} — {day.focus}
                    <span style={{ color: COLORS.muted, fontSize: 12, fontWeight: 400, marginLeft: 8 }}>{day.estimatedDuration}</span>
                  </div>
                  {day.exercises?.map((ex, eIdx) => (
                    <div key={eIdx} style={{ padding: '8px 0', borderBottom: eIdx < day.exercises.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</span>
                        <span style={{ ...S.mono, color: COLORS.accent, fontSize: 12 }}>{ex.sets}×{ex.repsMin}–{ex.repsMax}</span>
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 3 }}>
                        {ex.targetWeight && <span style={{ color: COLORS.lbs }}>{ex.targetWeight} · </span>}
                        {formatTime(ex.restSec)} rest{ex.note ? ` · ${ex.note}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── COACH TAB ────────────────────────────────────────────────────────────────

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} style={{ fontWeight: 700, color: COLORS.text }}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*'))
      return <span key={i}>{part.slice(1, -1)}</span>
    return part
  })
}

function renderMessage(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.trim() === '')
      return <div key={i} style={{ height: 6 }} />

    if (/^#{1,3}\s/.test(line)) {
      const content = line.replace(/^#+\s/, '')
      return (
        <div key={i} style={{ fontWeight: 700, fontSize: 13, color: COLORS.accent, marginTop: 10, marginBottom: 3, letterSpacing: 0.3 }}>
          {renderInline(content)}
        </div>
      )
    }

    if (/^[-*•]\s/.test(line)) {
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3, alignItems: 'flex-start' }}>
          <span style={{ color: COLORS.accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>
          <span>{renderInline(line.replace(/^[-*•]\s/, ''))}</span>
        </div>
      )
    }

    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1]
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3, alignItems: 'flex-start' }}>
          <span style={{ ...S.mono, color: COLORS.accent, fontWeight: 700, flexShrink: 0, minWidth: 18, marginTop: 1 }}>{num}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      )
    }

    return <div key={i} style={{ marginBottom: 2 }}>{renderInline(line)}</div>
  })
}

const QUICK_QUESTIONS = [
  'What weights should I use next session?',
  'Am I overtraining any muscle?',
  'Which muscles need more work?',
  'Review my current training plan',
  'How is my bench progressing?',
  'What should I focus on this week?',
]

function CoachTab({ workouts, aiCycle, chatHistory, onChatUpdate, profile }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory, loading])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg) return
    const newHistory = [...chatHistory, { role: 'user', content: msg }]
    onChatUpdate(newHistory)
    setInput('')
    setLoading(true)
    try {
      const response = await callAnthropic(newHistory, 1024, buildCoachSystemPrompt(workouts, aiCycle, profile))
      onChatUpdate([...newHistory, { role: 'assistant', content: response }])
    } catch (e) {
      onChatUpdate([...newHistory, { role: 'assistant', content: `Error: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', paddingTop: 48 }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 22 }}>🧠</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>AI Coach</div>
          <div style={{ color: COLORS.muted, fontSize: 11 }}>{workouts.length} sessions in memory</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', WebkitOverflowScrolling: 'touch' }}>
        {chatHistory.length === 0 && (
          <div>
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              Ask me anything about your training. I have access to all your logged sessions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  padding: '8px 14px', borderRadius: 20, border: `1px solid ${COLORS.border}`,
                  background: COLORS.input, color: COLORS.text, cursor: 'pointer',
                  fontSize: 13, fontFamily: "'Sora', sans-serif",
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14, gap: 10 }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: COLORS.accent + '22', border: `1px solid ${COLORS.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
            )}
            <div style={{
              maxWidth: '80%',
              background: msg.role === 'user' ? COLORS.accent + '22' : COLORS.card,
              border: `1px solid ${msg.role === 'user' ? COLORS.accent + '44' : COLORS.border}`,
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '12px 14px', fontSize: 14, lineHeight: 1.6,
            }}>
              {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.accent + '22', border: `1px solid ${COLORS.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '16px 16px 16px 4px', padding: '16px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.accent, animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, background: COLORS.bg, display: 'flex', gap: 10, alignItems: 'flex-end', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))', flexShrink: 0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Ask your coach..."
          disabled={loading} rows={1}
          style={{ ...S.input, flex: 1, resize: 'none', minHeight: 44, maxHeight: 120, overflowY: 'auto' }} />
        <Btn variant="accent" onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '12px 16px', flexShrink: 0 }}>↑</Btn>
      </div>
    </div>
  )
}

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────

function HistoryTab({ workouts }) {
  const [detailId, setDetailId] = useState(null)
  const detail = workouts.find(w => w.id === detailId)

  return (
    <div style={{ padding: '60px 16px 100px' }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 16 }}>History</h2>
      {workouts.length === 0 && (
        <div style={{ color: COLORS.muted, fontSize: 14, textAlign: 'center', marginTop: 60 }}>
          No sessions logged yet. Start a workout!
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {workouts.map(w => {
          const duration = w.endedAt ? w.endedAt - new Date(w.startedAt).getTime() : null
          const muscles = sessionMuscles(w)
          const vol = totalVolume(w)
          return (
            <button key={w.id} onClick={() => setDetailId(w.id)}
              style={{ ...S.card, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{w.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                    {formatDate(w.startedAt)}{duration && ` · ${formatDuration(duration)}`}
                  </div>
                </div>
                {vol > 0 && <div style={{ ...S.mono, color: COLORS.accent, fontSize: 13 }}>{Math.round(vol).toLocaleString()} lbs</div>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {muscles.map(m => <Tag key={m}>{m}</Tag>)}
              </div>
            </button>
          )
        })}
      </div>

      {detail && (
        <BottomSheet title={detail.name} onClose={() => setDetailId(null)} height="90vh">
          <div style={{ padding: '14px 16px' }}>
            <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16 }}>
              {formatDate(detail.startedAt)}
              {detail.endedAt && ` · ${formatDuration(detail.endedAt - new Date(detail.startedAt).getTime())}`}
              {' · '}<span style={{ ...S.mono, color: COLORS.accent }}>{Math.round(totalVolume(detail)).toLocaleString()} lbs total</span>
            </div>
            {detail.exercises.map((ex, eIdx) => (
              <div key={eIdx} style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ex.name} <Tag>{ex.muscle}</Tag>
                </div>
                {ex.sets.map((set, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: sIdx < ex.sets.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                    <span style={{ color: COLORS.muted, fontSize: 12, ...S.mono }}>Set {sIdx + 1}</span>
                    <span style={{ ...S.mono, fontSize: 14 }}>
                      <span style={{ color: COLORS.lbs }}>{set.weight || '—'}{set.unit}</span>
                      <span style={{ color: COLORS.muted }}> × </span>
                      <span>{set.reps || '—'} reps</span>
                      {set.rpe && <span style={{ color: COLORS.muted }}> · RPE {set.rpe}</span>}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

// ─── CSS ANIMATIONS ───────────────────────────────────────────────────────────

const CSS = `
  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }
  @keyframes prepPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
  ::-webkit-scrollbar { width: 0; background: transparent; }
  textarea { resize: none; }
`

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  const initial = loadForge()
  const [profile, setProfile] = useState(() => loadProfile())
  const [tab, setTab] = useState('log')
  const [activeScreen, setActiveScreen] = useState('home')
  const [workouts, setWorkouts] = useState(initial.workouts)
  const [savedPlans, setSavedPlans] = useState(initial.savedPlans)
  const [aiCycle, setAiCycle] = useState(initial.aiCycle)
  const [chatHistory, setChatHistory] = useState(initial.chatHistory)
  const [customQuickStarts, setCustomQuickStarts] = useState(initial.customQuickStarts || {})
  const [activeSession, setActiveSession] = useState(null)
  const [restTimer, setRestTimer] = useState({ phase: 'idle', startedAt: null, durationMs: 0, targetRestSec: 0 })
  const [showPlanBuilder, setShowPlanBuilder] = useState(false)
  const [pendingResume, setPendingResume] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_WORKOUT_KEY)
      if (saved) return JSON.parse(saved)
    } catch (_) {}
    return null
  })

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Persist active workout to localStorage on every change
  useEffect(() => {
    if (activeSession) {
      try { localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify({ session: activeSession, restTimer })) } catch (_) {}
    } else {
      try { localStorage.removeItem(ACTIVE_WORKOUT_KEY) } catch (_) {}
    }
  }, [activeSession, restTimer])

  function persist(updates = {}) {
    saveForge({ workouts, savedPlans, aiCycle, chatHistory, customQuickStarts, ...updates })
  }

  function handleQuickStart(type, sessionName, templates) {
    const unit = profile?.workoutUnit || 'lbs'
    const exHistory = loadExerciseHistory()
    setActiveSession({ name: sessionName || type, startedAt: new Date().toISOString(), exerciseIndex: 0, exercises: templates.map(t => makeExercise(t, workouts, unit, exHistory[t.name]?.[0] || null)) })
    setActiveScreen('activeWorkout')
  }

  function handleSaveQuickStart(type, data) {
    const newCustom = { ...customQuickStarts }
    if (data === null) {
      delete newCustom[type]
    } else {
      newCustom[type] = data
    }
    setCustomQuickStarts(newCustom)
    persist({ customQuickStarts: newCustom })
  }

  function handleStartPlan(plan) {
    const unit = profile?.workoutUnit || 'lbs'
    const exHistory = loadExerciseHistory()
    setActiveSession({ name: plan.name, startedAt: new Date().toISOString(), exerciseIndex: 0, exercises: plan.exercises.map(t => makeExercise(t, workouts, unit, exHistory[t.name]?.[0] || null)) })
    setActiveScreen('sessionSetup')
  }

  function handleStartCycleDay(day) {
    const unit = profile?.workoutUnit || 'lbs'
    const exHistory = loadExerciseHistory()
    const exercises = (day.exercises || []).map(ex => makeExercise({
      name: ex.name, muscle: ex.muscle || 'Other', sets: ex.sets || 3,
      repsMin: ex.repsMin || 8, repsMax: ex.repsMax || 12, restSec: ex.restSec || 90,
      targetWeight: ex.targetWeight || null, note: ex.note || '',
    }, workouts, unit, exHistory[ex.name]?.[0] || null))
    setActiveSession({ name: `${day.dayLabel} — ${day.focus}`, startedAt: new Date().toISOString(), exerciseIndex: 0, exercises })
    setActiveScreen('sessionSetup')
  }

  function handleSessionUpdate(exIdx, updates, newExIdx, addExercise, replaceAllExercises) {
    setActiveSession(prev => {
      if (!prev) return prev
      let exercises = replaceAllExercises ? [...replaceAllExercises] : [...prev.exercises]
      if (!replaceAllExercises) {
        if (addExercise) exercises = [...exercises, addExercise]
        if (exIdx !== null && exIdx !== undefined && updates !== null && updates !== undefined) {
          exercises = exercises.map((ex, i) => i === exIdx ? { ...ex, ...updates } : ex)
        }
      }
      const exerciseIndex = (newExIdx !== null && newExIdx !== undefined) ? newExIdx : prev.exerciseIndex
      return { ...prev, exercises, exerciseIndex }
    })
  }

  function handleEndSession() {
    if (!activeSession) return
    const endedAt = Date.now()
    // Only include exercises where at least one set was actually completed
    const doneExercises = activeSession.exercises.filter(ex => ex.sets.some(s => s.done))
    const completed = {
      id: uuid(),
      name: activeSession.name,
      startedAt: activeSession.startedAt,
      endedAt,
      exercises: doneExercises.map(ex => ({
        name: ex.name, muscle: ex.muscle,
        sets: ex.sets.map(s => ({ weight: s.weight, unit: s.unit, reps: s.reps, rpe: s.rpe, note: s.note, dropSets: s.dropSets, done: s.done })),
      })),
    }
    // Save per-exercise history — only for exercises with at least one done set
    const exHistory = loadExerciseHistory()
    doneExercises.forEach(ex => {
      const entry = {
        date: new Date().toISOString().split('T')[0],
        sets: ex.sets.filter(s => s.done).map((s, i) => ({
          setNumber: i + 1,
          weight: s.weight || '',
          unit: s.unit || 'lbs',
          reps: s.reps || '',
          note: s.note || '',
        })),
      }
      const prev = exHistory[ex.name] || []
      exHistory[ex.name] = [entry, ...prev].slice(0, 5)
    })
    saveExerciseHistory(exHistory)
    const newWorkouts = [completed, ...workouts]
    setWorkouts(newWorkouts)
    persist({ workouts: newWorkouts })
    setActiveSession(null)
    setRestTimer({ phase: 'idle', startedAt: null, durationMs: 0, targetRestSec: 0 })
    setActiveScreen('home')
    setTab('log')
  }

  function handleResume() {
    const { session, restTimer: savedTimer } = pendingResume
    setActiveSession(session)
    setRestTimer(savedTimer || { phase: 'idle', startedAt: null, durationMs: 0, targetRestSec: 0 })
    setActiveScreen('activeWorkout')
    setPendingResume(null)
  }

  function handleDiscard() {
    try { localStorage.removeItem(ACTIVE_WORKOUT_KEY) } catch (_) {}
    setPendingResume(null)
  }

  function handleSavePlan(plan) {
    const newPlans = [...savedPlans, plan]
    setSavedPlans(newPlans)
    persist({ savedPlans: newPlans })
    setShowPlanBuilder(false)
  }

  function handleDeletePlan(id) {
    const newPlans = savedPlans.filter(p => p.id !== id)
    setSavedPlans(newPlans)
    persist({ savedPlans: newPlans })
  }

  function handleCycleGenerated(cycle) {
    setAiCycle(cycle)
    persist({ aiCycle: cycle })
  }

  function handleChatUpdate(history) {
    setChatHistory(history)
    persist({ chatHistory: history })
  }

  if (!profile) {
    return <OnboardingScreen onComplete={p => setProfile(p)} />
  }

  if (pendingResume && pendingResume.session) {
    return (
      <div style={S.app}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
          <div style={{ ...S.card, textAlign: 'center', padding: 32, maxWidth: 340, width: '100%' }}>
            <div style={{ color: COLORS.muted, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Active Workout Found</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{pendingResume.session.name}</div>
            <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 28 }}>You have a workout in progress. Resume it?</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="accent" onClick={handleResume} style={{ flex: 1, padding: '14px 0' }}>Resume</Btn>
              <Btn variant="danger" onClick={handleDiscard} style={{ flex: 1, padding: '14px 0' }}>Discard</Btn>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (activeScreen === 'sessionSetup' && activeSession) {
    return (
      <div style={S.app}>
        <SessionSetupScreen
          sessionName={activeSession.name}
          initialExercises={activeSession.exercises}
          workouts={workouts}
          onStart={exercises => { setActiveSession(prev => ({ ...prev, exercises })); setActiveScreen('activeWorkout') }}
          onCancel={() => { setActiveSession(null); setActiveScreen('home') }}
        />
      </div>
    )
  }

  if (activeScreen === 'activeWorkout' && activeSession) {
    return (
      <div style={S.app}>
        <ActiveWorkoutScreen session={activeSession} onUpdate={handleSessionUpdate} onEnd={handleEndSession} workouts={workouts} restTimer={restTimer} setRestTimer={setRestTimer} />
      </div>
    )
  }

  return (
    <div style={S.app}>
      <div>
        {tab === 'log' && (
          <LogTab workouts={workouts} savedPlans={savedPlans} aiCycle={aiCycle}
            onQuickStart={handleQuickStart} onStartPlan={handleStartPlan}
            onStartCycleDay={handleStartCycleDay} onBuildPlan={() => setShowPlanBuilder(true)}
            onDeletePlan={handleDeletePlan}
            customQuickStarts={customQuickStarts} onSaveQuickStart={handleSaveQuickStart} />
        )}
        {tab === 'plan' && (
          <PlanTab aiCycle={aiCycle} workouts={workouts} onCycleGenerated={handleCycleGenerated} profile={profile} />
        )}
        {tab === 'coach' && (
          <CoachTab workouts={workouts} aiCycle={aiCycle} chatHistory={chatHistory} onChatUpdate={handleChatUpdate} profile={profile} />
        )}
        {tab === 'history' && <HistoryTab workouts={workouts} />}
        {tab === 'settings' && <SettingsTab profile={profile} onSave={p => setProfile(p)} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />

      {showPlanBuilder && (
        <PlanBuilderSheet onSave={handleSavePlan} onClose={() => setShowPlanBuilder(false)} />
      )}
    </div>
  )
}
