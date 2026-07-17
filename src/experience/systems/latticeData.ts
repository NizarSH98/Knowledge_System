import * as THREE from 'three'
import { ATLAS_HEIGHT, ATLAS_WIDTH, LINES_PER_FAMILY, ROW_HEIGHT } from './textAtlas'

/**
 * Procedural generation of the Knowledge Lattice: source nodes on two
 * rings, document fragments clustered around their source, structural
 * links, and the citation tethers used in the grounded state.
 * A seeded RNG keeps the composition identical between visits.
 */

let seed = 1337
function rand(): number {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

export type SourceNode = {
  position: THREE.Vector3
  restricted: boolean
  cited: boolean
}

export function buildNodes(): SourceNode[] {
  seed = 1337
  const nodes: SourceNode[] = []
  const inner = 6
  const outer = 8
  for (let i = 0; i < inner; i++) {
    const a = (i / inner) * Math.PI * 2 + 0.35
    nodes.push({
      position: new THREE.Vector3(Math.cos(a) * 1.55, (rand() - 0.5) * 1.15, Math.sin(a) * 1.55),
      restricted: false,
      cited: i === 0 || i === 2 || i === 4,
    })
  }
  for (let i = 0; i < outer; i++) {
    const a = (i / outer) * Math.PI * 2
    nodes.push({
      position: new THREE.Vector3(Math.cos(a) * 2.6, (rand() - 0.5) * 1.7, Math.sin(a) * 2.6),
      restricted: i % 3 === 0,
      cited: false,
    })
  }
  return nodes
}

export type FragmentData = {
  home: Float32Array
  scatter: Float32Array
  seeds: Float32Array
  sizes: Float32Array
  restricted: Float32Array
  rows: Float32Array
}

/** World aspect of one atlas row so text renders undistorted. */
const ROW_ASPECT = ROW_HEIGHT / ATLAS_WIDTH

export function buildFragments(nodes: SourceNode[], count: number): FragmentData {
  seed = 4242
  const home = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count * 2)
  const restricted = new Float32Array(count)
  const rows = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const nodeIndex = i % nodes.length
    const node = nodes[nodeIndex]
    // Home: a small axis-aligned lattice cell near the owning source node
    const cell = 0.28
    home[i * 3] = node.position.x + (Math.round((rand() - 0.5) * 4) * cell)
    home[i * 3 + 1] = node.position.y + (Math.round((rand() - 0.5) * 4) * cell)
    home[i * 3 + 2] = node.position.z + (Math.round((rand() - 0.5) * 4) * cell)

    // Scatter: a wide turbulent shell around everything
    const r = 2.6 + rand() * 2.4
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    scatter[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    scatter[i * 3 + 1] = (r * Math.cos(phi)) * 0.7
    scatter[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    seeds[i] = rand()
    // Wide, thin planes matching the atlas row aspect — text, not blocks
    const w = 0.48 + rand() * 0.62
    sizes[i * 2] = w
    sizes[i * 2 + 1] = w * ROW_ASPECT
    restricted[i] = node.restricted ? 1 : 0

    // Fragments show a line from their own source's document family:
    // titles are most common, supporting lines fill the field
    const pick = rand()
    const lineInFamily = pick < 0.22 ? 0 : pick < 0.61 ? 1 : 2
    rows[i] = nodeIndex * LINES_PER_FAMILY + lineInFamily
  }
  return { home, scatter, seeds, sizes, restricted, rows }
}

export const ATLAS_ROW_V = ROW_HEIGHT / ATLAS_HEIGHT

export type LinkData = {
  positions: Float32Array
  /** 0 structural · 1 ranked retrieval path · 2 citation tether */
  types: Float32Array
  /** normalized position along the segment, for draw-on animation */
  along: Float32Array
}

export const ANSWER_POS = new THREE.Vector3(0.15, 0.1, 1.55)

export function buildLinks(nodes: SourceNode[]): LinkData {
  const segs: { a: THREE.Vector3; b: THREE.Vector3; type: number }[] = []
  const inner = nodes.slice(0, 6)
  const outer = nodes.slice(6)

  for (let i = 0; i < inner.length; i++) {
    segs.push({ a: inner[i].position, b: inner[(i + 1) % inner.length].position, type: 0 })
    segs.push({ a: inner[i].position, b: new THREE.Vector3(0, 0, 0), type: 0 })
  }
  for (let i = 0; i < outer.length; i++) {
    segs.push({ a: outer[i].position, b: inner[i % inner.length].position, type: 0 })
    segs.push({ a: outer[i].position, b: outer[(i + 2) % outer.length].position, type: 0 })
  }
  // Ranked retrieval paths: core → the three cited nodes (brighten mid-pulse)
  for (const n of nodes.filter((n) => n.cited)) {
    segs.push({ a: new THREE.Vector3(0, 0, 0), b: n.position, type: 1 })
  }
  // Citation tethers: answer surface → cited nodes
  for (const n of nodes.filter((n) => n.cited)) {
    segs.push({ a: ANSWER_POS.clone(), b: n.position, type: 2 })
  }

  // Subdivide segments so the draw-on animation has vertices to work with
  const STEPS = 10
  const positions: number[] = []
  const types: number[] = []
  const along: number[] = []
  for (const s of segs) {
    for (let i = 0; i < STEPS; i++) {
      const t0 = i / STEPS
      const t1 = (i + 1) / STEPS
      const p0 = s.a.clone().lerp(s.b, t0)
      const p1 = s.a.clone().lerp(s.b, t1)
      positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
      types.push(s.type, s.type)
      along.push(t0, t1)
    }
  }
  return {
    positions: new Float32Array(positions),
    types: new Float32Array(types),
    along: new Float32Array(along),
  }
}

export function buildParticles(count: number): Float32Array {
  seed = 9001
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 1.2 + rand() * 3.8
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.75
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return positions
}

/** Camera path through the architecture, sampled by sceneState.camT. */
export function buildCameraPath(): { pos: THREE.CatmullRomCurve3; look: THREE.CatmullRomCurve3 } {
  const pos = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0.0, 0.35, 7.6), // hero — wide instrument view
      new THREE.Vector3(0.2, 0.3, 6.2), // approach
      new THREE.Vector3(1.7, 0.75, 3.9), // sources orbit
      new THREE.Vector3(-1.9, 0.55, 2.9), // inside the membranes
      new THREE.Vector3(-0.4, -0.35, 2.3), // retrieval depth
      new THREE.Vector3(0.15, 0.2, 3.15), // answer surface
      new THREE.Vector3(0.0, 0.9, 5.1), // boundary overview
      new THREE.Vector3(0.0, 0.55, 6.9), // final calm
    ],
    false,
    'catmullrom',
    0.4,
  )
  const look = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(0.2, 0.1, 0),
      new THREE.Vector3(0.3, 0, 0.2),
      new THREE.Vector3(0.2, 0, 0.6),
      new THREE.Vector3(0, 0.12, 1.1),
      new THREE.Vector3(0, 0, 0.4),
      new THREE.Vector3(0, 0.1, 0),
    ],
    false,
    'catmullrom',
    0.4,
  )
  return { pos, look }
}
