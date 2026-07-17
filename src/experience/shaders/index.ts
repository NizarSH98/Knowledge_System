/**
 * All GLSL for the Knowledge Lattice. WebGL1-style GLSL (three.js
 * compiles it for WebGL2 contexts transparently). Shared uniform
 * objects are created once and referenced by several materials so a
 * single per-frame write updates everything. `uTheme` cross-fades the
 * whole scene between the dark instrument (0) and light paper (1)
 * palettes.
 */

export const simplexNoise = /* glsl */ `
// Simplex 3D noise — Ian McEwan / Ashima Arts (MIT)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

/** Shared theme palette helpers injected into fragment shaders. */
const themePalette = /* glsl */ `
uniform float uTheme; // 0 = dark instrument, 1 = light paper

vec3 tInk()        { return mix(vec3(0.86, 0.82, 0.74), vec3(0.16, 0.145, 0.12), uTheme); }
vec3 tCopper()     { return mix(vec3(0.78, 0.53, 0.34), vec3(0.55, 0.33, 0.17), uTheme); }
vec3 tCopperHot()  { return mix(vec3(0.86, 0.64, 0.44), vec3(0.62, 0.36, 0.16), uTheme); }
vec3 tSpectral()   { return mix(vec3(0.47, 0.81, 0.71), vec3(0.12, 0.47, 0.38), uTheme); }
vec3 tRestricted() { return mix(vec3(0.72, 0.44, 0.28), vec3(0.60, 0.32, 0.16), uTheme); }
`

/* ── Document fragments (instanced text planes) ───────────────── */

export const fragmentsVert = /* glsl */ `
attribute vec3 aHome;
attribute vec3 aScatter;
attribute float aSeed;
attribute vec2 aSize;
attribute float aRestricted;
attribute float aRow;

uniform float uTime;
uniform float uOrder;
uniform float uCalm;

varying vec2 vUv;
varying float vSeed;
varying float vRestricted;
varying float vRow;
varying vec3 vWorld;
varying float vAlign;
varying float vDepthFade;
varying float vClipX;
varying float vClipY;

void main() {
  vUv = uv;
  vSeed = aSeed;
  vRestricted = aRestricted;
  vRow = aRow;

  float t = clamp(uOrder * 1.45 - aSeed * 0.45, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vAlign = t;

  float turb = (1.0 - t) * (0.9 - uCalm * 0.35);
  vec3 p = mix(aScatter, aHome, t);
  float ph = uTime * 0.38 + aSeed * 43.0;
  p += turb * 0.5 * vec3(
    sin(ph + p.y * 1.7),
    cos(ph * 0.83 + p.x * 1.3),
    sin(ph * 0.61 + p.z * 2.1)
  );
  p += (1.0 - turb) * 0.018 * vec3(
    sin(uTime * 0.55 + aSeed * 21.0),
    cos(uTime * 0.47 + aSeed * 33.0),
    0.0
  );
  vWorld = p;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  mv.xy += position.xy * aSize;
  // Depth hierarchy: distant lines recede instead of stacking into noise
  vDepthFade = smoothstep(9.5, 3.0, -mv.z);
  gl_Position = projectionMatrix * mv;
  vClipX = gl_Position.x / max(gl_Position.w, 0.0001);
  vClipY = gl_Position.y / max(gl_Position.w, 0.0001);
}
`

export const fragmentsFrag = /* glsl */ `
uniform float uTime;
uniform float uOrder;
uniform float uPermission;
uniform float uRetrieval;
uniform float uGrounded;
uniform float uCalm;
uniform float uConflict;
uniform vec3 uPulseOrigin;
uniform sampler2D uAtlas;
uniform float uRowV;

${themePalette}

varying vec2 vUv;
varying float vSeed;
varying float vRestricted;
varying float vRow;
varying vec3 vWorld;
varying float vAlign;
varying float vDepthFade;
varying float vClipX;
varying float vClipY;

float glyph(vec2 uv, float xShift) {
  float x = clamp(uv.x + xShift, 0.0, 1.0);
  float v = 1.0 - (vRow + 1.0 - uv.y) * uRowV;
  return texture2D(uAtlas, vec2(x, v)).a;
}

void main() {
  // Chromatic split while versions conflict — only a minority of
  // fragments are "superseded", and only during the conflict beat
  float conflictGate = step(0.68, fract(vSeed * 3.71));
  float shift = uConflict * conflictGate * (0.012 + 0.008 * sin(uTime * 21.0 + vSeed * 60.0));

  float gR = glyph(vUv, shift);
  float gG = glyph(vUv, 0.0);
  float gB = glyph(vUv, -shift);

  vec3 ink = mix(tInk(), tRestricted(), vRestricted * 0.8);
  vec3 col = ink;
  // Conflict fringing: the offset duplicate samples take on version tints
  if (shift > 0.0001) {
    col = ink * gG + tCopperHot() * gR * 0.5 + tSpectral() * gB * 0.5;
  }

  float alpha = max(max(gR, gG), gB);

  // Retrieval pulse: a radial wave that lights candidates as it passes
  float d = distance(vWorld, uPulseOrigin);
  float wave = exp(-pow((d - uRetrieval * 5.2) * 2.0, 2.0)) * step(0.001, uRetrieval);
  col = mix(col, tSpectral(), wave * 0.85 * vAlign);

  // Permission boundary: restricted material stays present but cannot resolve
  alpha *= mix(1.0, 0.2, uPermission * vRestricted);

  // Base visibility: dimmer while scattered, quieter once grounded
  alpha *= mix(0.34, 0.85, vAlign);
  alpha *= mix(1.0, 0.5, uGrounded * 0.55 + uCalm * 0.3);
  alpha *= mix(0.35, 1.0, vDepthFade);

  // Editorial guard: fall off toward the text column (screen left),
  // relaxed in the final centered composition
  alpha *= mix(1.0, smoothstep(-1.05, 0.05, vClipX), 1.0 - uCalm * 0.8);
  // Keep the navigation band quiet
  alpha *= 1.0 - smoothstep(0.7, 1.0, vClipY) * 0.85;

  gl_FragColor = vec4(col, alpha * 0.92);
  if (gl_FragColor.a < 0.01) discard;
}
`

/* ── Source nodes (instanced octahedra) ───────────────────────── */

export const nodesVert = /* glsl */ `
attribute vec3 aPos;
attribute float aRestricted;
attribute float aCited;
attribute float aSeed;
attribute float aRow;

uniform float uTime;
uniform float uOrder;

varying vec2 vUv;
varying float vRestricted;
varying float vCited;
varying vec3 vWorld;
varying float vRow;

void main() {
  float t = clamp(uOrder * 1.6 - aSeed * 0.5, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 drift = (1.0 - t) * 0.6 * vec3(
    sin(uTime * 0.3 + aSeed * 50.0),
    cos(uTime * 0.24 + aSeed * 37.0),
    sin(uTime * 0.19 + aSeed * 71.0)
  );
  vec3 world = aPos + drift;
  vWorld = world;
  vUv = uv;
  vRestricted = aRestricted;
  vCited = aCited;
  vRow = aRow;
  vec4 mv = viewMatrix * vec4(world, 1.0);
  mv.xy += position.xy * vec2(0.95, 0.055) * mix(0.72, 1.0, t);
  gl_Position = projectionMatrix * mv;
}
`

export const nodesFrag = /* glsl */ `
uniform float uOrder;
uniform float uPermission;
uniform float uRetrieval;
uniform float uGrounded;
uniform vec3 uPulseOrigin;
uniform sampler2D uAtlas;
uniform float uRowV;

${themePalette}

varying vec2 vUv;
varying float vRestricted;
varying float vCited;
varying vec3 vWorld;
varying float vRow;

void main() {
  float atlasV = 1.0 - (vRow + 1.0 - vUv.y) * uRowV;
  float glyph = texture2D(uAtlas, vec2(vUv.x, atlasV)).a;
  vec3 col = mix(tCopper(), tRestricted(), vRestricted);

  float d = distance(vWorld, uPulseOrigin);
  float wave = exp(-pow((d - uRetrieval * 5.2) * 1.8, 2.0)) * step(0.001, uRetrieval);
  col = mix(col, tSpectral(), wave * (1.0 - vRestricted));

  // Cited sources hold a verified highlight once the answer is grounded
  col = mix(col, tSpectral(), vCited * uGrounded * 0.85);

  float alpha = glyph * (0.5 + uOrder * 0.5);
  alpha *= mix(1.0, 0.4, uPermission * vRestricted);

  gl_FragColor = vec4(col, alpha);
  if (gl_FragColor.a < 0.01) discard;
}
`

/* ── Central knowledge volume ─────────────────────────────────── */

export const coreVert = /* glsl */ `
uniform float uTime;
uniform float uOrder;

varying vec2 vUv;

void main() {
  vUv = uv;
  float breathe = 1.0 + sin(uTime * 0.45) * 0.015 * (1.0 - uOrder);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * breathe, 1.0);
}
`

export const coreFrag = /* glsl */ `
uniform float uTime;
uniform float uOrder;
uniform float uGrounded;
uniform float uCalm;
uniform sampler2D uCore;

${themePalette}
varying vec2 vUv;

void main() {
  float glyph = texture2D(uCore, vUv).a;
  float scan = 0.82 + 0.18 * sin(vUv.x * 22.0 - uTime * 0.9);
  vec3 col = mix(tCopperHot(), tSpectral(), uGrounded * 0.7);
  float alpha = glyph * mix(0.48, 0.95, uOrder) * mix(scan, 1.0, uCalm);
  gl_FragColor = vec4(col, alpha);
  if (gl_FragColor.a < 0.01) discard;
}
`

/* ── Permission membranes ─────────────────────────────────────── */

export const membraneVert = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vWorld;
varying vec3 vLocal;

void main() {
  vLocal = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const membraneFrag = /* glsl */ `
uniform float uTime;
uniform float uPermission;
uniform vec3 uTintDark;
uniform vec3 uTintLight;
uniform float uCalm;
uniform float uTheme;

varying vec3 vNormalW;
varying vec3 vWorld;
varying vec3 vLocal;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vWorld);
  float facing = dot(N, V);
  float fres = pow(1.0 - abs(facing), 3.2);

  // Engineering graticule: fine latitude bands with dashed longitudes
  float lat = abs(sin(vLocal.y * 14.0));
  float latLine = smoothstep(0.986, 1.0, lat);
  float ang = atan(vLocal.z, vLocal.x);
  float dash = step(0.42, fract(ang * 11.0 + uTime * 0.015));
  float grid = latLine * dash;

  float backFade = facing < 0.0 ? 0.3 : 1.0;
  float alpha = uPermission * (fres * 0.24 + grid * 0.16) * backFade;
  alpha *= 1.0 - uCalm * 0.4;

  gl_FragColor = vec4(mix(uTintDark, uTintLight, uTheme), alpha);
}
`

/* ── Structural links / ranked paths / citation tethers ───────── */

export const linksVert = /* glsl */ `
attribute float aType;
attribute float aAlong;

varying float vType;
varying float vAlong;
varying vec3 vWorld;

void main() {
  vType = aType;
  vAlong = aAlong;
  vWorld = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const linksFrag = /* glsl */ `
uniform float uOrder;
uniform float uRetrieval;
uniform float uGrounded;
uniform float uCalm;
uniform float uTime;

${themePalette}

varying float vType;
varying float vAlong;
varying vec3 vWorld;

void main() {
  float alpha = 0.0;
  vec3 col = tInk();

  if (vType < 0.5) {
    // Structural lattice connections draw on as order forms
    float draw = smoothstep(vAlong, vAlong + 0.25, uOrder * 1.3 - 0.25);
    alpha = draw * mix(0.14, 0.22, uTheme) * (1.0 - uCalm * 0.3);
  } else if (vType < 1.5) {
    // Ranked retrieval paths: propagate outward with the pulse
    float draw = smoothstep(vAlong, vAlong + 0.15, uRetrieval * 1.25);
    float settle = 1.0 - uGrounded * 0.6;
    alpha = draw * 0.55 * settle * step(0.001, uRetrieval);
    col = tSpectral();
  } else {
    // Citation tethers: drawn from the answer back to its sources
    float draw = smoothstep(vAlong, vAlong + 0.2, uGrounded * 1.25);
    alpha = draw * 0.7;
    col = mix(tSpectral(), tCopper(), 0.15);
  }

  gl_FragColor = vec4(col, alpha);
}
`

/* ── Answer surface (textured card of resolved, cited text) ───── */

export const answerVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const answerFrag = /* glsl */ `
uniform float uGrounded;
uniform float uTime;
uniform sampler2D uAnswer;

${themePalette}

varying vec2 vUv;

void main() {
  float text = texture2D(uAnswer, vUv).a;

  // Rows resolve top-to-bottom as the answer grounds
  float reveal = smoothstep(1.0 - vUv.y, 1.0 - vUv.y + 0.35, uGrounded * 1.3);
  text *= reveal;

  vec3 textCol = mix(vec3(0.92, 0.89, 0.82), vec3(0.13, 0.12, 0.1), uTheme);

  // Citation markers in the right margin
  float marker = 0.0;
  for (int i = 0; i < 3; i++) {
    vec2 mp = vec2(0.935, 0.3 + float(i) * 0.19);
    marker += exp(-pow(distance(vUv * vec2(2.0, 1.0), mp * vec2(2.0, 1.0)) * 30.0, 2.0));
  }

  // The grounded answer remains typography in space, without a card plate.
  vec3 col = textCol * text;
  col = mix(col, tSpectral(), clamp(marker, 0.0, 1.0) * uGrounded);

  float alpha = uGrounded * (text * 0.95 + marker * 0.9);
  gl_FragColor = vec4(col, min(alpha, 0.96));
  if (gl_FragColor.a < 0.01) discard;
}
`

/* ── Action boundary ring ─────────────────────────────────────── */

export const boundaryVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const boundaryFrag = /* glsl */ `
uniform float uExpansion;
uniform float uTime;
uniform float uCalm;

${themePalette}

varying vec2 vUv;

void main() {
  // Dashed circumference: the boundary is closed by default
  float dash = step(0.4, fract(vUv.x * 60.0 + uTime * 0.01));
  float alpha = uExpansion * dash * (0.55 - uCalm * 0.25);
  gl_FragColor = vec4(tCopper(), alpha);
}
`

/* ── Unresolved-information particles ─────────────────────────── */

export const particlesVert = /* glsl */ `
uniform float uTime;
uniform float uOrder;
uniform float uRetrieval;
uniform vec3 uPulseOrigin;
uniform float uPixelRatio;

varying float vAlpha;
varying float vSpark;

void main() {
  float seed = fract(sin(dot(position.xz, vec2(12.9898, 78.233))) * 43758.5453);
  float amp = (1.0 - uOrder * 0.85);
  vec3 p = position + amp * 0.6 * vec3(
    sin(uTime * 0.32 + seed * 61.0 + position.y),
    cos(uTime * 0.27 + seed * 27.0),
    sin(uTime * 0.22 + seed * 83.0 + position.x)
  );

  float d = distance(p, uPulseOrigin);
  vSpark = exp(-pow((d - uRetrieval * 5.2) * 2.4, 2.0)) * step(0.001, uRetrieval) * step(0.75, seed);

  vAlpha = (0.5 - uOrder * 0.38) * (0.4 + seed * 0.6);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.4 + seed * 2.4) * uPixelRatio * (5.2 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

export const particlesFrag = /* glsl */ `
${themePalette}

varying float vAlpha;
varying float vSpark;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.12, d);
  vec3 dust = mix(vec3(0.7, 0.66, 0.58), vec3(0.32, 0.29, 0.25), uTheme);
  vec3 col = mix(dust, tSpectral(), vSpark);
  float alpha = disc * (vAlpha + vSpark * 0.8);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(col, alpha);
}
`

/* ── Background (camera-locked) + fluid pointer field ─────────── */

export const backgroundVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const backgroundFrag = /* glsl */ `
uniform float uTime;
uniform float uOrder;
uniform float uCalm;
uniform float uTheme;
uniform float uFluidStrength;
uniform sampler2D uFluid;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // Fluid field: r = ink pressure, gb = velocity. Refract the gradient
  // through the disturbance so it reads as pressure in glass, not paint.
  vec4 fluid = texture2D(uFluid, uv);
  uv += fluid.gb * 0.012 * uFluidStrength;

  float d = distance(uv, vec2(0.5, 0.55));

  vec3 deepDark = vec3(0.051, 0.047, 0.039);
  vec3 liftDark = vec3(0.087, 0.078, 0.064);
  vec3 deepLight = vec3(0.878, 0.855, 0.79);
  vec3 liftLight = vec3(0.945, 0.93, 0.885);

  vec3 deep = mix(deepDark, deepLight, uTheme);
  vec3 lift = mix(liftDark, liftLight, uTheme);
  vec3 col = mix(lift, deep, smoothstep(0.05, 0.75, d));

  // Warm instrument halo behind the lattice
  vec3 halo = mix(vec3(0.16, 0.11, 0.07), vec3(0.045, 0.02, -0.01), uTheme);
  col += halo * exp(-d * 4.5) * (0.35 + uOrder * 0.3);

  // Pointer pressure: disturbed light in the dark theme, pooled ink in light
  vec3 press = mix(vec3(0.22, 0.18, 0.13), vec3(-0.085, -0.075, -0.06), uTheme);
  col += press * fluid.r * 0.4 * uFluidStrength;

  // Vignette + dither (kills gradient banding)
  float vig = smoothstep(1.05, 0.45, distance(vUv, vec2(0.5)));
  col *= mix(0.75, 0.93, uTheme) + vig * mix(0.25, 0.07, uTheme);
  col += (hash(vUv * 913.0 + uTime) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`

export const fluidUpdateVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const fluidUpdateFrag = /* glsl */ `
uniform sampler2D uPrev;
uniform vec2 uPoint;
uniform vec2 uVel;
uniform float uDt;
uniform float uAspect;

varying vec2 vUv;

void main() {
  // Semi-Lagrangian-ish advection along the stored velocity
  vec4 prev = texture2D(uPrev, vUv - texture2D(uPrev, vUv).gb * 0.004);

  float ink = prev.r * exp(-uDt * 1.9);
  vec2 vel = prev.gb * exp(-uDt * 2.6);

  vec2 delta = vUv - uPoint;
  delta.x *= uAspect;
  float splat = exp(-dot(delta, delta) / 0.006);

  float speed = min(length(uVel) * 40.0, 1.0);
  ink = min(ink + splat * speed * uDt * 40.0, 1.2);
  vel += splat * uVel * 5.0 * min(uDt * 60.0, 2.0);
  float vl = length(vel);
  if (vl > 1.5) vel *= 1.5 / vl;

  gl_FragColor = vec4(ink, vel, 1.0);
}
`
