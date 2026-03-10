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

export default function App() {
  return <div style={{ background: COLORS.bg, minHeight: '100dvh', color: COLORS.text, fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FORGE</div>
}
