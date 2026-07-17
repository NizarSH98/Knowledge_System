import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  fragmentsVert,
  fragmentsFrag,
  nodesVert,
  nodesFrag,
  coreVert,
  coreFrag,
  membraneVert,
  membraneFrag,
  linksVert,
  linksFrag,
  answerVert,
  answerFrag,
  boundaryVert,
  boundaryFrag,
  particlesVert,
  particlesFrag,
} from '../shaders'
import {
  ANSWER_POS,
  ATLAS_ROW_V,
  buildFragments,
  buildLinks,
  buildNodes,
  buildParticles,
} from '../systems/latticeData'
import { createAnswerTexture, createCoreTexture, createFragmentAtlas } from '../systems/textAtlas'
import { getQuality, onQualityChange, PROFILE_MAX } from '../performance/quality'
import type { SharedUniforms } from '../canvas/uniforms'

type Props = { uniforms: SharedUniforms }

const NODES = buildNodes()

function Fragments({ uniforms }: Props) {
  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1)
    const g = new THREE.InstancedBufferGeometry()
    g.index = base.index
    g.setAttribute('position', base.getAttribute('position'))
    g.setAttribute('uv', base.getAttribute('uv'))
    const data = buildFragments(NODES, PROFILE_MAX.fragments)
    g.setAttribute('aHome', new THREE.InstancedBufferAttribute(data.home, 3))
    g.setAttribute('aScatter', new THREE.InstancedBufferAttribute(data.scatter, 3))
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(data.seeds, 1))
    g.setAttribute('aSize', new THREE.InstancedBufferAttribute(data.sizes, 2))
    g.setAttribute('aRestricted', new THREE.InstancedBufferAttribute(data.restricted, 1))
    g.setAttribute('aRow', new THREE.InstancedBufferAttribute(data.rows, 1))
    g.instanceCount = getQuality().fragments
    base.dispose()
    return g
  }, [])

  const atlas = useMemo(createFragmentAtlas, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fragmentsVert,
        fragmentShader: fragmentsFrag,
        uniforms: {
          ...uniforms,
          uAtlas: { value: atlas },
          uRowV: { value: ATLAS_ROW_V },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms, atlas],
  )

  useEffect(() => {
    const off = onQualityChange((p) => {
      geometry.instanceCount = p.fragments
    })
    return () => {
      off()
      geometry.dispose()
      material.dispose()
      atlas.dispose()
    }
  }, [geometry, material, atlas])

  return <mesh geometry={geometry} material={material} frustumCulled={false} />
}

function SourceNodes({ uniforms }: Props) {
  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1)
    const g = new THREE.InstancedBufferGeometry()
    g.index = base.index
    g.setAttribute('position', base.getAttribute('position'))
    g.setAttribute('uv', base.getAttribute('uv'))
    const n = NODES.length
    const pos = new Float32Array(n * 3)
    const restricted = new Float32Array(n)
    const cited = new Float32Array(n)
    const seeds = new Float32Array(n)
    const rows = new Float32Array(n)
    NODES.forEach((node, i) => {
      pos.set([node.position.x, node.position.y, node.position.z], i * 3)
      restricted[i] = node.restricted ? 1 : 0
      cited[i] = node.cited ? 1 : 0
      seeds[i] = (i * 0.618) % 1
      // Each source title is the first row of the document family used by
      // its nearby fragments, making spatial proximity meaningful.
      rows[i] = i * 3
    })
    g.setAttribute('aPos', new THREE.InstancedBufferAttribute(pos, 3))
    g.setAttribute('aRestricted', new THREE.InstancedBufferAttribute(restricted, 1))
    g.setAttribute('aCited', new THREE.InstancedBufferAttribute(cited, 1))
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))
    g.setAttribute('aRow', new THREE.InstancedBufferAttribute(rows, 1))
    g.instanceCount = n
    base.dispose()
    return g
  }, [])

  const atlas = useMemo(createFragmentAtlas, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nodesVert,
        fragmentShader: nodesFrag,
        uniforms: {
          ...uniforms,
          uAtlas: { value: atlas },
          uRowV: { value: ATLAS_ROW_V },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms, atlas],
  )

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
    atlas.dispose()
  }, [geometry, material, atlas])

  return <mesh geometry={geometry} material={material} frustumCulled={false} />
}

function CoreVolume({ uniforms }: Props) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(2.2, 0.55), [])
  const coreTexture = useMemo(createCoreTexture, [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coreVert,
        fragmentShader: coreFrag,
        uniforms: {
          ...uniforms,
          uCore: { value: coreTexture },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms, coreTexture],
  )

  useFrame(({ camera }) => {
    if (!ref.current) return
    const s = 0.55 + (uniforms.uOrder.value as number) * 0.45
    ref.current.scale.setScalar(s)
    ref.current.lookAt(camera.position)
  })

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
    coreTexture.dispose()
  }, [geometry, material, coreTexture])

  return <mesh ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}

function Membranes({ uniforms }: Props) {
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 48, 32), [])
  const inner = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: membraneVert,
        fragmentShader: membraneFrag,
        uniforms: {
          uTime: uniforms.uTime,
          uPermission: uniforms.uPermission,
          uCalm: uniforms.uCalm,
          uTheme: uniforms.uTheme,
          uTintDark: { value: new THREE.Color(0.72, 0.78, 0.72) },
          uTintLight: { value: new THREE.Color(0.28, 0.34, 0.31) },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  )
  const outer = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: membraneVert,
        fragmentShader: membraneFrag,
        uniforms: {
          uTime: uniforms.uTime,
          uPermission: uniforms.uPermission,
          uCalm: uniforms.uCalm,
          uTheme: uniforms.uTheme,
          uTintDark: { value: new THREE.Color(0.62, 0.42, 0.28) },
          uTintLight: { value: new THREE.Color(0.52, 0.3, 0.15) },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  )

  useEffect(() => () => {
    geometry.dispose()
    inner.dispose()
    outer.dispose()
  }, [geometry, inner, outer])

  return (
    <>
      <mesh geometry={geometry} material={inner} scale={2.15} frustumCulled={false} />
      <mesh geometry={geometry} material={outer} scale={3.05} frustumCulled={false} />
    </>
  )
}

function Links({ uniforms }: Props) {
  const geometry = useMemo(() => {
    const data = buildLinks(NODES)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    g.setAttribute('aType', new THREE.BufferAttribute(data.types, 1))
    g.setAttribute('aAlong', new THREE.BufferAttribute(data.along, 1))
    return g
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: linksVert,
        fragmentShader: linksFrag,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  )

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />
}

function AnswerSurface({ uniforms }: Props) {
  const ref = useRef<THREE.Mesh>(null)
  // 2:1 plane matches the 1024×512 answer texture, keeping text undistorted
  const geometry = useMemo(() => new THREE.PlaneGeometry(1.5, 0.75), [])
  const answerTexture = useMemo(createAnswerTexture, [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: answerVert,
        fragmentShader: answerFrag,
        uniforms: {
          ...uniforms,
          uAnswer: { value: answerTexture },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms, answerTexture],
  )

  useFrame(({ camera }) => {
    ref.current?.lookAt(camera.position)
  })

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
    answerTexture.dispose()
  }, [geometry, material, answerTexture])

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      position={[ANSWER_POS.x, ANSWER_POS.y, ANSWER_POS.z]}
      frustumCulled={false}
    />
  )
}

function BoundaryRing({ uniforms }: Props) {
  const geometry = useMemo(() => new THREE.TorusGeometry(4.25, 0.012, 6, 160), [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: boundaryVert,
        fragmentShader: boundaryFrag,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  )

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  return (
    <group rotation={[Math.PI / 2 - 0.12, 0, 0]}>
      <mesh geometry={geometry} material={material} frustumCulled={false} />
      <mesh geometry={geometry} material={material} rotation={[0.16, 0, 0]} scale={1.04} frustumCulled={false} />
    </group>
  )
}

function Particles({ uniforms }: Props) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(buildParticles(PROFILE_MAX.particles), 3))
    g.setDrawRange(0, getQuality().particles)
    return g
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particlesVert,
        fragmentShader: particlesFrag,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  )

  useEffect(() => {
    const off = onQualityChange((p) => geometry.setDrawRange(0, p.particles))
    return () => {
      off()
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return <points geometry={geometry} material={material} frustumCulled={false} />
}

export function KnowledgeLattice({ uniforms }: Props) {
  return (
    <>
      <Fragments uniforms={uniforms} />
      <SourceNodes uniforms={uniforms} />
      <CoreVolume uniforms={uniforms} />
      <Membranes uniforms={uniforms} />
      <Links uniforms={uniforms} />
      <AnswerSurface uniforms={uniforms} />
      <BoundaryRing uniforms={uniforms} />
      <Particles uniforms={uniforms} />
    </>
  )
}
