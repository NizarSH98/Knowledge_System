import * as THREE from 'three'

/**
 * Text atlas for the lattice fragments. Every floating plane samples a
 * real line of (fictional) organizational text. Lines are grouped into
 * document families, one family per source node, so the fragments
 * orbiting a node all belong to that node's repository — the
 * relationships in the field are meaningful, not decorative.
 */

export const DOC_FAMILIES: string[][] = [
  ['Operations Manual — v3.2', '§4.2 pump start-up sequence', 'approved · owner: operations'],
  ['Research Archive — approved', 'trial 12 — soil moisture data', 'sensor calibration notes'],
  ['Field Report 024 — current', 'pump station east — inspection', 'flow rate nominal at intake'],
  ['Procurement Policy — v5.0', 'supplier approval workflow', 'threshold: two quotes required'],
  ['Maintenance Log — v1.8', 'seal replacement — scheduled', 'owner: engineering'],
  ['Project Delta Decision Log', 'decision D-17 — deferred', 'superseded by D-21'],
  ['Safety Procedure — restricted', 'lockout / tagout — safety group', 'revision pending review'],
  ['HR Handbook — current', 'leave policy §2.1', 'owner: people operations'],
  ['Site Survey 2025 — draft', 'boundary coordinates logged', 'awaiting owner sign-off'],
  ['Contract Register — restricted', 'access: legal group', 'renewal dates tracked'],
  ['Training Materials — v2.0', 'onboarding module 3', 'assessment results excluded'],
  ['Incident Report 112 — closed', 'root cause: valve latency', 'corrective action logged'],
  ['Budget Model — restricted', 'access: finance group', 'scenario B — draft'],
  ['Minutes — operations weekly', 'action items assigned', 'superseded copies archived'],
]

export const LINES_PER_FAMILY = 3
export const ATLAS_ROWS = DOC_FAMILIES.length * LINES_PER_FAMILY

export const ATLAS_WIDTH = 1024
export const ATLAS_HEIGHT = 2048
export const ROW_HEIGHT = 48
/** Normalized height of one row in texture space (shader uniform). */
export const ROW_V = ROW_HEIGHT / ATLAS_HEIGHT

function drawAtlas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  DOC_FAMILIES.forEach((family, f) => {
    family.forEach((line, l) => {
      const row = f * LINES_PER_FAMILY + l
      const y = row * ROW_HEIGHT + ROW_HEIGHT / 2
      // Title lines read stronger than their supporting lines
      ctx.font = l === 0 ? `500 30px 'Spline Sans Mono', monospace` : `400 27px 'Spline Sans Mono', monospace`
      ctx.fillStyle = l === 0 ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.72)'
      ctx.fillText(line, ATLAS_WIDTH / 2, y, ATLAS_WIDTH - 40)
    })
  })
}

export function createFragmentAtlas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = ATLAS_WIDTH
  canvas.height = ATLAS_HEIGHT
  const ctx = canvas.getContext('2d')!
  drawAtlas(ctx)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  // Redraw once the bundled mono font is available
  document.fonts.ready.then(() => {
    drawAtlas(ctx)
    texture.needsUpdate = true
  })
  return texture
}

/** The grounded-answer surface: a small card of resolved, cited text. */
const ANSWER_LINES: { text: string; font: string; alpha: number }[] = [
  { text: 'GROUNDED ANSWER — 3 CITATIONS', font: `500 26px 'Spline Sans Mono', monospace`, alpha: 0.85 },
  { text: 'Prime the intake line before starting', font: `450 40px 'Schibsted Grotesk Variable', sans-serif`, alpha: 1 },
  { text: 'the transfer pump; hold pressure at', font: `450 40px 'Schibsted Grotesk Variable', sans-serif`, alpha: 1 },
  { text: 'nominal for two minutes. [1][2]', font: `450 40px 'Schibsted Grotesk Variable', sans-serif`, alpha: 1 },
  { text: 'sources: SRC 001 · SRC 007 · MNT 01', font: `400 26px 'Spline Sans Mono', monospace`, alpha: 0.7 },
]

function drawAnswer(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 1024, 512)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const ys = [80, 175, 245, 315, 425]
  ANSWER_LINES.forEach((line, i) => {
    ctx.font = line.font
    ctx.fillStyle = `rgba(255,255,255,${line.alpha})`
    ctx.fillText(line.text, 70, ys[i], 890)
  })
}

export function createAnswerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  drawAnswer(ctx)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  document.fonts.ready.then(() => {
    drawAnswer(ctx)
    texture.needsUpdate = true
  })
  return texture
}

/** Central semantic label. The lattice has a named purpose, not a solid core. */
function drawCore(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, 1024, 256)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `500 54px 'Spline Sans Mono', monospace`
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.fillText('TRUSTED KNOWLEDGE CORE', 512, 98, 940)
  ctx.font = `400 28px 'Spline Sans Mono', monospace`
  ctx.fillStyle = 'rgba(255,255,255,0.68)'
  ctx.fillText('approved sources  ·  indexed  ·  permission aware', 512, 164, 900)
}

export function createCoreTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  drawCore(ctx)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  document.fonts.ready.then(() => {
    drawCore(ctx)
    texture.needsUpdate = true
  })
  return texture
}
