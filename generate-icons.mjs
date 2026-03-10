// Run with: node generate-icons.mjs
// Generates icon-192.png and icon-512.png for the PWA manifest

import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

function generateIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#080809'
  ctx.beginPath()
  const r = size * 0.15
  ctx.moveTo(r, 0)
  ctx.lineTo(size - r, 0)
  ctx.quadraticCurveTo(size, 0, size, r)
  ctx.lineTo(size, size - r)
  ctx.quadraticCurveTo(size, size, size - r, size)
  ctx.lineTo(r, size)
  ctx.quadraticCurveTo(0, size, 0, size - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()

  // Letter F
  ctx.fillStyle = '#d4f000'
  ctx.font = `900 ${size * 0.65}px Arial Black`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('F', size / 2, size / 2 + size * 0.04)

  return canvas.toBuffer('image/png')
}

writeFileSync('public/icon-192.png', generateIcon(192))
writeFileSync('public/icon-512.png', generateIcon(512))
console.log('Icons generated.')
