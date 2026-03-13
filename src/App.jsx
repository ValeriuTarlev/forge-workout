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

const QUICK_START_TYPES = ['Chest', 'Shoulders + Triceps', 'Back + Biceps', 'Legs', 'Full Body', 'Open Workout']

const QUICK_START_MUSCLES = {
  'Chest': ['Chest', 'Triceps'],
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
    { name: 'Tricep Pushdown', muscle: 'Triceps', sets: 3, repsMin: 12, repsMax: 15, restSec: 75 },
    { name: 'Skull Crushers', muscle: 'Triceps', sets: 3, repsMin: 10, repsMax: 12, restSec: 90 },
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

async function callAnthropic(messages, maxTokens, systemPrompt) {
  const body = { model: 'claude-sonnet-4-20250514', max_tokens: maxTokens, messages }
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

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'log', label: 'Log', icon: '🏋' },
    { id: 'plan', label: 'Plan', icon: '📋' },
    { id: 'coach', label: 'Coach', icon: '🧠' },
    { id: 'history', label: 'History', icon: '📈' },
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

  if (showPicker) return (
    <ExercisePickerSheet
      onPick={e => { setExercises(prev => [...prev, makeExercise(e, workouts)]); setShowPicker(false) }}
      onClose={() => setShowPicker(false)}
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
          {exercises.map(ex => (
            <div key={ex.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>
                  <span style={S.mono}>{ex.sets.length}</span> sets ·{' '}
                  <span style={S.mono}>{ex.repsMin}–{ex.repsMax}</span> reps ·{' '}
                  <span style={S.mono}>{formatTime(ex.restSec)}</span> rest
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Tag>{ex.muscle}</Tag>
                <button onClick={() => setExercises(prev => prev.filter(e => e.id !== ex.id))}
                  style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', fontSize: 18 }}>✕</button>
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
    </div>
  )
}

// ─── REST TIMER OVERLAY ───────────────────────────────────────────────────────

const RING_RADIUS = 54
const RING_CIRC = 2 * Math.PI * RING_RADIUS

function RestTimerOverlay({ phase, secondsLeft, totalSeconds, onSkip, onAdd30 }) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1
  const offset = RING_CIRC * (1 - progress)
  const ringColor = progress > 0.5 ? COLORS.success : progress > 0.25 ? '#ffcc00' : COLORS.danger

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(8,8,9,0.97)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
    }}>
      <div style={{ color: COLORS.muted, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
        {phase === 'getReady' ? 'GET READY' : 'REST'}
      </div>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        {phase === 'resting' ? (
          <>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke={COLORS.border} strokeWidth="8" />
              <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke={ringColor} strokeWidth="8"
                strokeDasharray={RING_CIRC} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ ...S.mono, fontSize: 36, fontWeight: 700 }}>{formatTime(secondsLeft)}</span>
            </div>
          </>
        ) : (
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            border: `4px solid ${COLORS.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ ...S.mono, fontSize: 64, fontWeight: 700, color: COLORS.accent }}>{secondsLeft}</span>
          </div>
        )}
      </div>
      {phase === 'resting' && (
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn onClick={onSkip} style={{ padding: '12px 24px' }}>Skip Rest →</Btn>
          <Btn onClick={onAdd30} style={{ padding: '12px 24px' }}>+30s</Btn>
        </div>
      )}
    </div>
  )
}

// ─── SESSION PLAN SHEET ───────────────────────────────────────────────────────

function SessionPlanSheet({ exercises, currentIdx, onJump, onAddExercise, onEndWorkout, onClose, workouts = [] }) {
  const [showPicker, setShowPicker] = useState(false)

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
            <button key={ex.id} onClick={() => { onJump(idx); onClose() }} style={{
              ...S.card, border: `1px solid ${isCurrent ? COLORS.accent : COLORS.border}`,
              background: isCurrent ? COLORS.accent + '11' : COLORS.card,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: isCurrent ? COLORS.accent : COLORS.text }}>
                  {idx + 1}. {ex.name}
                </div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{doneSets}/{ex.sets.length} sets done</div>
              </div>
              {doneSets === ex.sets.length && <span style={{ color: COLORS.success, fontSize: 18 }}>✓</span>}
            </button>
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

function ActiveWorkoutScreen({ session, onUpdate, onEnd, workouts = [] }) {
  const [showPlanSheet, setShowPlanSheet] = useState(false)
  const [restState, setRestState] = useState({ phase: 'idle', secondsLeft: 0, totalSeconds: 0 })
  const intervalRef = useRef(null)
  const elapsed = useSessionTimer(true)

  const exercises = session.exercises
  const exIdx = session.exerciseIndex
  const ex = exercises[exIdx]
  const setIdx = ex ? ex.activeSetIndex : 0
  const currentSet = ex ? ex.sets[setIdx] : null

  function startRestTimer(restSec) {
    clearInterval(intervalRef.current)
    let count = 5
    setRestState({ phase: 'getReady', secondsLeft: 5, totalSeconds: 5 })
    intervalRef.current = setInterval(() => {
      count--
      if (count <= 0) {
        clearInterval(intervalRef.current)
        setTimeout(() => startRestPhase(restSec), 50)
      } else {
        setRestState(prev => ({ ...prev, secondsLeft: count }))
      }
    }, 1000)
  }

  function startRestPhase(restSec) {
    clearInterval(intervalRef.current)
    let count = restSec
    setRestState({ phase: 'resting', secondsLeft: restSec, totalSeconds: restSec })
    intervalRef.current = setInterval(() => {
      count--
      if (count <= 0) {
        clearInterval(intervalRef.current)
        playBeep()
        setRestState({ phase: 'idle', secondsLeft: 0, totalSeconds: 0 })
        advanceSet()
      } else {
        setRestState(prev => ({ ...prev, secondsLeft: count }))
      }
    }, 1000)
  }

  function skipRest() {
    clearInterval(intervalRef.current)
    setRestState({ phase: 'idle', secondsLeft: 0, totalSeconds: 0 })
    advanceSet()
  }

  function add30() {
    setRestState(prev => ({ ...prev, secondsLeft: prev.secondsLeft + 30, totalSeconds: prev.totalSeconds + 30 }))
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
      clearInterval(intervalRef.current)
      setRestState({ phase: 'idle', secondsLeft: 0, totalSeconds: 0 })
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

  useEffect(() => () => clearInterval(intervalRef.current), [])

  if (!ex) return null

  const isLastSet = setIdx === ex.sets.length - 1
  const isLastExercise = exIdx === exercises.length - 1

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: COLORS.bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* Top bar */}
        <div style={{ padding: '52px 16px 16px', borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, background: COLORS.bg, zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 4 }}>Exercise {exIdx + 1}/{exercises.length}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{ex.name}</h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <Tag>{ex.muscle}</Tag>
                <Tag color={COLORS.muted}>{formatTime(ex.restSec)} rest</Tag>
              </div>
            </div>
            <div style={{ ...S.mono, fontSize: 15, fontWeight: 700, color: COLORS.accent, paddingTop: 4 }}>{formatMMSS(elapsed)}</div>
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
                ].map(({ label, action }) => (
                  <button key={label} onClick={action} style={{
                    padding: '8px 14px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
                    background: COLORS.input, color: COLORS.muted, cursor: 'pointer',
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

      {restState.phase !== 'idle' && (
        <RestTimerOverlay phase={restState.phase} secondsLeft={restState.secondsLeft}
          totalSeconds={restState.totalSeconds} onSkip={skipRest} onAdd30={add30} />
      )}

      {showPlanSheet && (
        <SessionPlanSheet exercises={exercises} currentIdx={exIdx}
          onJump={idx => onUpdate(null, null, idx)}
          onAddExercise={ex => onUpdate(null, null, null, ex)}
          onEndWorkout={onEnd} onClose={() => setShowPlanSheet(false)} workouts={workouts} />
      )}
    </>
  )
}

// ─── LOG TAB ──────────────────────────────────────────────────────────────────

function LogTab({ workouts, savedPlans, aiCycle, onQuickStart, onStartPlan, onStartCycleDay, onBuildPlan, onDeletePlan }) {
  const now = new Date()
  const sessionsThisWeek = workouts.filter(w => isWithin7Days(w.startedAt)).length

  let cycleProgress = null
  if (aiCycle) {
    const diff = Math.floor((Date.now() - new Date(aiCycle.generatedAt).getTime()) / 86400000)
    cycleProgress = Math.min(diff, 14)
  }

  return (
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
          {QUICK_START_TYPES.map(type => (
            <button key={type} onClick={() => onQuickStart(type)} style={{ ...S.card, cursor: 'pointer', textAlign: 'left', padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: COLORS.accent }}>{type}</div>
              <div style={{ color: COLORS.muted, fontSize: 11 }}>
                {QUICK_START_MUSCLES[type].slice(0, 2).join(' · ') || 'Custom'}
              </div>
            </button>
          ))}
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
  )
}

// ─── PLAN TAB ─────────────────────────────────────────────────────────────────

function PlanTab({ aiCycle, workouts, onCycleGenerated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [week1Open, setWeek1Open] = useState(true)
  const [week2Open, setWeek2Open] = useState(false)

  async function generate() {
    setLoading(true); setError(null)
    try {
      const text = await callAnthropic([{ role: 'user', content: buildCyclePrompt(workouts) }], 4000)
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

const QUICK_QUESTIONS = [
  'What weights should I use next session?',
  'Am I overtraining any muscle?',
  'Which muscles need more work?',
  'Build me a push day plan',
  'How is my bench progressing?',
]

function CoachTab({ workouts, aiCycle, chatHistory, onChatUpdate }) {
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
      const response = await callAnthropic(newHistory, 1024, buildCoachSystemPrompt(workouts, aiCycle))
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
              padding: '12px 14px', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>{msg.content}</div>
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
  const [tab, setTab] = useState('log')
  const [activeScreen, setActiveScreen] = useState('home')
  const [workouts, setWorkouts] = useState(initial.workouts)
  const [savedPlans, setSavedPlans] = useState(initial.savedPlans)
  const [aiCycle, setAiCycle] = useState(initial.aiCycle)
  const [chatHistory, setChatHistory] = useState(initial.chatHistory)
  const [activeSession, setActiveSession] = useState(null)
  const [showPlanBuilder, setShowPlanBuilder] = useState(false)

  function persist(updates = {}) {
    saveForge({ workouts, savedPlans, aiCycle, chatHistory, ...updates })
  }

  function handleQuickStart(type) {
    const templates = QUICK_START_EXERCISES[type] || []
    setActiveSession({ name: type, startedAt: new Date().toISOString(), exerciseIndex: 0, exercises: templates.map(t => makeExercise(t, workouts)) })
    setActiveScreen('sessionSetup')
  }

  function handleStartPlan(plan) {
    setActiveSession({ name: plan.name, startedAt: new Date().toISOString(), exerciseIndex: 0, exercises: plan.exercises.map(t => makeExercise(t, workouts)) })
    setActiveScreen('sessionSetup')
  }

  function handleStartCycleDay(day) {
    const exercises = (day.exercises || []).map(ex => makeExercise({
      name: ex.name, muscle: ex.muscle || 'Other', sets: ex.sets || 3,
      repsMin: ex.repsMin || 8, repsMax: ex.repsMax || 12, restSec: ex.restSec || 90,
      targetWeight: ex.targetWeight || null, note: ex.note || '',
    }, workouts))
    setActiveSession({ name: `${day.dayLabel} — ${day.focus}`, startedAt: new Date().toISOString(), exerciseIndex: 0, exercises })
    setActiveScreen('sessionSetup')
  }

  function handleSessionUpdate(exIdx, updates, newExIdx, addExercise) {
    setActiveSession(prev => {
      if (!prev) return prev
      let exercises = [...prev.exercises]
      if (addExercise) exercises = [...exercises, addExercise]
      if (exIdx !== null && exIdx !== undefined && updates !== null && updates !== undefined) {
        exercises = exercises.map((ex, i) => i === exIdx ? { ...ex, ...updates } : ex)
      }
      const exerciseIndex = (newExIdx !== null && newExIdx !== undefined) ? newExIdx : prev.exerciseIndex
      return { ...prev, exercises, exerciseIndex }
    })
  }

  function handleEndSession() {
    if (!activeSession) return
    const endedAt = Date.now()
    const completed = {
      id: uuid(),
      name: activeSession.name,
      startedAt: activeSession.startedAt,
      endedAt,
      exercises: activeSession.exercises.map(ex => ({
        name: ex.name, muscle: ex.muscle,
        sets: ex.sets.map(s => ({ weight: s.weight, unit: s.unit, reps: s.reps, rpe: s.rpe, note: s.note, dropSets: s.dropSets, done: s.done })),
      })),
    }
    const newWorkouts = [completed, ...workouts]
    setWorkouts(newWorkouts)
    persist({ workouts: newWorkouts })
    setActiveSession(null)
    setActiveScreen('home')
    setTab('log')
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
        <ActiveWorkoutScreen session={activeSession} onUpdate={handleSessionUpdate} onEnd={handleEndSession} workouts={workouts} />
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
            onDeletePlan={handleDeletePlan} />
        )}
        {tab === 'plan' && (
          <PlanTab aiCycle={aiCycle} workouts={workouts} onCycleGenerated={handleCycleGenerated} />
        )}
        {tab === 'coach' && (
          <CoachTab workouts={workouts} aiCycle={aiCycle} chatHistory={chatHistory} onChatUpdate={handleChatUpdate} />
        )}
        {tab === 'history' && <HistoryTab workouts={workouts} />}
      </div>

      <BottomNav tab={tab} setTab={setTab} />

      {showPlanBuilder && (
        <PlanBuilderSheet onSave={handleSavePlan} onClose={() => setShowPlanBuilder(false)} />
      )}
    </div>
  )
}
