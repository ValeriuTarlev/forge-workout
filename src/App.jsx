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
  Legs: ['Squat', 'Leg Press', 'Leg Extension', 'Seated Leg Curl', 'Romanian Deadlift', 'Hack Squat', 'Walking Lunges', 'Calf Extension', 'Calf Raises'],
  Back: ['Pull-Ups', 'T-Bar Row', 'Seated Row', 'Lat Machine', 'Front Lat Machine', 'Low Row', 'Front Pull Down Machine', 'Barbell Row', 'Face Pull', 'Deadlift'],
  Biceps: ['Biceps Curl', 'Curl Dumbbells', 'Hammer Curl', 'Arm Curl Machine', 'Preacher Curl', 'Cable Curl'],
  Chest: ['Bench Press', 'Chest Press', 'Pec Fly', 'Cable Crossover', 'Incline Dumbbell Press', 'Cable Flyes', 'Dips'],
  Shoulders: ['Lateral Raises', 'Dumbbell Shoulder Press', 'Shoulder Press', 'Rear Delt Raises', 'Cable Lateral Raises', 'Arnold Press', 'Upright Row'],
  Triceps: ['Tricep Pushdown', 'Close Grip Bench Press', 'Dips', 'Skull Crushers', 'Overhead Tricep Extension', 'Cable Kickback'],
  Trapezoid: ['Shrugs', 'Cable Shrugs', 'Barbell Shrugs'],
  Glutes: ['Hip Thrusts', 'Bulgarian Split Squat', 'Cable Kickbacks', 'Glute Bridge'],
  Core: ['Hanging Leg Raises', 'Cable Crunch', 'Plank', 'Ab Wheel Rollout', 'Russian Twists'],
}

const MUSCLES = Object.keys(EXERCISE_LIBRARY)
const ALL_EXERCISES = MUSCLES.flatMap(m => EXERCISE_LIBRARY[m].map(name => ({ name, muscle: m })))

const QUICK_START_TYPES = ['Chest', 'Shoulders', 'Back + Biceps', 'Legs', 'Full Body', 'Open Workout']

const QUICK_START_MUSCLES = {
  'Chest': ['Chest', 'Triceps'],
  'Shoulders': ['Shoulders', 'Trapezoid'],
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
    { name: 'Tricep Pushdown', muscle: 'Triceps', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Skull Crushers', muscle: 'Triceps', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
  ],
  'Shoulders': [
    { name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', sets: 4, repsMin: 8, repsMax: 12, restSec: 120 },
    { name: 'Lateral Raises', muscle: 'Shoulders', sets: 4, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Rear Delt Raises', muscle: 'Shoulders', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Front Raises', muscle: 'Shoulders', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Barbell Shrugs', muscle: 'Trapezoid', sets: 3, repsMin: 12, repsMax: 15, restSec: 90 },
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

function makeExercise(template, workouts = []) {
  const sets = template.sets || 3
  const lastData = getLastSetData(workouts, template.name)
  return {
    id: uuid(),
    name: template.name,
    muscle: template.muscle || 'Other',
    restSec: template.restSec || 90,
    repsMin: template.repsMin || 8,
    repsMax: template.repsMax || 12,
    targetWeight: template.targetWeight || null,
    note: template.note || '',
    activeSetIndex: 0,
    sets: Array.from({ length: sets }, () => ({
      id: uuid(),
      weight: lastData ? lastData.weight : '',
      unit: lastData ? lastData.unit : 'lbs',
      reps: '',
      rpe: null,
      note: '',
      dropSets: [],
      done: false,
      showNote: false,
    })),
  }
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function loadForge() {
  try {
    const raw = window.__forge__
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return { workouts: [], savedPlans: [], aiCycle: null, chatHistory: [] }
}

function saveForge(data) {
  try {
    window.__forge__ = JSON.stringify(data)
  } catch (_) {}
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function callAnthropic(apiKey, messages, maxTokens, systemPrompt) {
  const body = { model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, messages }
  if (systemPrompt) body.system = systemPrompt

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
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

function buildCoachSystemPrompt(workouts, aiCycle) {
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

  return `You are FORGE, an elite AI strength coach. Direct, data-driven, personalized.

USER PROFILE:
- Goal: Muscle Gain | Equipment: Full Gym | Frequency: 4 days/week | Default unit: lbs
- Total sessions: ${workouts.length}
- Active AI cycle: ${aiCycle ? aiCycle.cycleName : 'None'}

RECENT PERFORMANCE (last 15 sessions):
${exerciseLines || '  No data yet'}

MUSCLE VOLUME (last 14 days):
${volumeLines}

RULES: Suggest specific weights using progressive overload. Warn about overtraining (>20 sets/14d) or undertraining (0 sets/14d). Be concise and use numbers.`
}

function buildCyclePrompt(workouts) {
  const last10 = workouts.slice(0, 10)
  const historyText = last10.map(w =>
    `${formatDate(w.startedAt)} — ${w.name}: ${w.exercises.map(e =>
      `${e.name} ${e.sets.map(s => `${s.weight}${s.unit}x${s.reps}`).join(', ')}`
    ).join(' | ')}`
  ).join('\n')

  return `Generate a personalized 2-week training cycle:
- Goal: Muscle Gain | Equipment: Full gym | Frequency: 4 days/week

Recent history:
${historyText || 'No previous sessions'}

Return ONLY valid JSON (no markdown, no explanation):
{
  "cycleName": "string",
  "split": "string",
  "progressionRules": "string",
  "coachNote": "string",
  "week1": [{"dayLabel":"Day 1","focus":"string","estimatedDuration":"60 min","exercises":[{"name":"string","muscle":"string","sets":4,"repsMin":8,"repsMax":12,"restSec":90,"targetWeight":"string","note":"string"}]}],
  "week2": [/* same structure, slightly higher weights/volume */]
}`
}

function parseCycleResponse(text) {
  try {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
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
    background: COLORS.bg,
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

export default function App() {
  return <div style={{ background: COLORS.bg, minHeight: '100dvh', color: COLORS.text, fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FORGE</div>
}
