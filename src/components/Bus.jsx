import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useScroll } from '@react-three/drei'

// ─── Materials ────────────────────────────────────────────────────────────────
const bodyMat = new THREE.MeshStandardMaterial({ color: '#0a0f1e', roughness: 0.15, metalness: 0.9, envMapIntensity: 3 })
const bodyAccent = new THREE.MeshStandardMaterial({ color: '#091630', roughness: 0.2, metalness: 0.8 })
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#0a2040', metalness: 0.05, roughness: 0.04, transmission: 0.7, thickness: 0.5, transparent: true, opacity: 0.5 })
const chromeMat = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.02, metalness: 1.0, envMapIntensity: 5 })
const redMat = new THREE.MeshStandardMaterial({ color: '#cc0000', emissive: '#880000', emissiveIntensity: 0.6 })
const orangeMat = new THREE.MeshStandardMaterial({ color: '#ff6600', emissive: '#cc4400', emissiveIntensity: 0.8 })
const glowRed = new THREE.MeshStandardMaterial({ color: '#ff2200', emissive: '#ff0000', emissiveIntensity: 6, toneMapped: false })
const glowWhite = new THREE.MeshStandardMaterial({ color: '#ffffd0', emissive: '#ffffff', emissiveIntensity: 7, toneMapped: false })
const glowAmber = new THREE.MeshStandardMaterial({ color: '#ffcc00', emissive: '#ffaa00', emissiveIntensity: 4, toneMapped: false })
const glowOrange = new THREE.MeshStandardMaterial({ color: '#ff8800', emissive: '#ff6600', emissiveIntensity: 5, toneMapped: false })
const darkMat = new THREE.MeshStandardMaterial({ color: '#060606', roughness: 0.9 })
const acMat = new THREE.MeshStandardMaterial({ color: '#1a1a2e', roughness: 0.5, metalness: 0.5 })
const tireMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.9 })
const rimMat = new THREE.MeshStandardMaterial({ color: '#242424', roughness: 0.25, metalness: 0.85 })
const seatMat = new THREE.MeshStandardMaterial({ color: '#1a0505', roughness: 0.7 })
const ledMat = new THREE.MeshStandardMaterial({ color: '#ff4400', emissive: '#ff3300', emissiveIntensity: 7, toneMapped: false })
const drlMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ccddff', emissiveIntensity: 5, toneMapped: false })
const beamMat = new THREE.MeshBasicMaterial({ color: '#ffffcc', transparent: true, opacity: 0.04, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
const beamCoreMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending })
const underglowMat = new THREE.MeshBasicMaterial({ color: '#ff2200', transparent: true, opacity: 0.15, depthWrite: false, blending: THREE.AdditiveBlending })
const mirrorMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a' })
const floorMat = new THREE.MeshStandardMaterial({ color: '#080808', roughness: 0.95 })
const sidePanMat = new THREE.MeshStandardMaterial({ color: '#0d0020', roughness: 0.4, metalness: 0.3 })
const stripeMat = new THREE.MeshStandardMaterial({ color: '#ff4400', emissive: '#cc3300', emissiveIntensity: 1.5 })

// Bus dimensions
const W = 7.2   // length (X)
const H = 2.1   // height (Y)
const D = 2.3   // depth (Z)

// ─── Wheel component ──────────────────────────────────────────────────────────
const TIRE_R = 0.38
const TIRE_T = 0.11
const RIM_R = 0.27

function WheelGroup({ position, spinRef, frontWheel = false }) {
    return (
        <group position={position}>
            {/* Outer tire ring */}
            <mesh material={tireMat} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[TIRE_R, TIRE_T, 20, 48]} />
            </mesh>

            {/* Inner rim - this group spins */}
            <group ref={spinRef}>
                {/* Rim disc */}
                <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[RIM_R + 0.02, RIM_R + 0.02, 0.34, 36]} />
                </mesh>
                {/* 8 chrome spokes */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i / 8) * Math.PI * 2
                    const mid = (RIM_R + 0.08) * 0.5
                    const len = RIM_R - 0.08
                    return (
                        <mesh
                            key={i}
                            position={[Math.cos(a) * mid, Math.sin(a) * mid, 0]}
                            rotation={[0, 0, a - Math.PI / 2]}
                            material={chromeMat}
                        >
                            <cylinderGeometry args={[0.013, 0.013, len, 6]} />
                        </mesh>
                    )
                })}
                {/* Hub cap */}
                <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                    <cylinderGeometry args={[0.07, 0.07, 0.38, 16]} />
                </mesh>
                {/* Hub logo disc */}
                <mesh position={[0, 0, 0.17]} material={glowRed}>
                    <circleGeometry args={[0.045, 12]} />
                </mesh>
            </group>

            {/* Lug nut ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                <torusGeometry args={[0.15, 0.012, 6, 16]} />
            </mesh>

            {/* Brake disc */}
            {!frontWheel && (
                <mesh rotation={[Math.PI / 2, 0, 0]} material={darkMat}>
                    <cylinderGeometry args={[0.19, 0.19, 0.04, 24]} />
                </mesh>
            )}
        </group>
    )
}

// ─── Main Bus component ───────────────────────────────────────────────────────
export function Bus() {
    const busRef = useRef()
    const scroll = useScroll()

    // Refs for spinning wheel rims
    const wheelRefs = useRef(Array.from({ length: 6 }, () => React.createRef()))

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        const s = scroll.offset

        // Gentle vertical float
        if (busRef.current) {
            busRef.current.position.y = Math.sin(t * 1.3) * 0.06
        }

        // Spin all wheel rims proportional to scroll speed
        wheelRefs.current.forEach(ref => {
            if (ref.current) {
                ref.current.rotation.z -= 0.04 + s * 0.08
            }
        })
    })

    const W2 = W / 2

    return (
        <group ref={busRef} position={[0, 0.25, 0]}>

            {/* ══════════════════════════
                MAIN BODY SHELL
            ══════════════════════════ */}
            {/* Primary hull */}
            <RoundedBox args={[W, H, D]} radius={0.14} smoothness={8} material={bodyMat} />

            {/* Lower body band – darker */}
            <mesh position={[0, -0.72, 0]} material={bodyAccent}>
                <boxGeometry args={[W + 0.01, 0.65, D + 0.01]} />
            </mesh>

            {/* Lower skirt */}
            <mesh position={[0, -1.06, 0]} material={darkMat}>
                <boxGeometry args={[W - 0.1, 0.04, D + 0.05]} />
            </mesh>

            {/* ── Orange Accent Stripe (wide) ── */}
            <mesh position={[0, -0.38, 0]} material={stripeMat}>
                <boxGeometry args={[W + 0.02, 0.12, D + 0.02]} />
            </mesh>
            {/* Chrome pin stripe above */}
            <mesh position={[0, -0.28, 0]} material={chromeMat}>
                <boxGeometry args={[W + 0.02, 0.022, D + 0.01]} />
            </mesh>
            {/* Chrome pin stripe below */}
            <mesh position={[0, -0.51, 0]} material={chromeMat}>
                <boxGeometry args={[W + 0.02, 0.022, D + 0.01]} />
            </mesh>

            {/* ── ROOF ── */}
            {/* Roof curve cap */}
            <mesh position={[0, H / 2 + 0.04, 0]} material={bodyAccent}>
                <boxGeometry args={[W - 0.1, 0.08, D - 0.1]} />
            </mesh>
            {/* AC / roof unit */}
            <RoundedBox args={[4.6, 0.26, D - 0.48]} radius={0.08} smoothness={4}
                position={[-0.3, H / 2 + 0.18, 0]} material={acMat} />
            {/* AC vents */}
            {[-1.6, 0, 1.6].map((x, i) => (
                <mesh key={i} position={[x - 0.3, H / 2 + 0.23, 0]} material={chromeMat}>
                    <boxGeometry args={[0.7, 0.04, D - 0.55]} />
                </mesh>
            ))}
            {/* Rooftop luggage rack */}
            <mesh position={[0.3, H / 2 + 0.22, 0]} material={chromeMat}>
                <boxGeometry args={[1.8, 0.03, D - 0.4]} />
            </mesh>
            {[[-0.55, 0], [0.55, 0]].map(([x], i) => (
                <mesh key={i} position={[x + 0.3, H / 2 + 0.18, 0]} rotation={[0, 0, 0]} material={chromeMat}>
                    <boxGeometry args={[0.03, 0.12, D - 0.4]} />
                </mesh>
            ))}

            {/* ══════════════════════════
                SIDE GLASS STRIP
            ══════════════════════════ */}
            <RoundedBox args={[W - 1.4, 0.92, D + 0.02]} radius={0.05} smoothness={4}
                position={[0, 0.32, 0]} material={glassMat} />

            {/* Window dividers (pillars) */}
            {Array.from({ length: 7 }).map((_, i) => (
                <mesh key={i} position={[i * 0.82 - 2.46, 0.32, D / 2 + 0.01]} material={bodyMat}>
                    <boxGeometry args={[0.06, 0.92, 0.02]} />
                </mesh>
            ))}

            {/* ══════════════════════════
                INTERIOR SEATS
            ══════════════════════════ */}
            {Array.from({ length: 10 }).map((_, i) => (
                <group key={i} position={[(i * 0.58) - 2.7, -0.08, 0]}>
                    <mesh position={[0, 0, 0.68]} material={seatMat}>
                        <boxGeometry args={[0.26, 0.48, 0.38]} />
                    </mesh>
                    <mesh position={[0, 0, -0.68]} material={seatMat}>
                        <boxGeometry args={[0.26, 0.48, 0.38]} />
                    </mesh>
                </group>
            ))}

            {/* Interior floor */}
            <mesh position={[0, -0.42, 0]} material={floorMat}>
                <boxGeometry args={[W - 0.3, 0.04, D - 0.3]} />
            </mesh>

            {/* ══════════════════════════
                SIDE BRANDING
            ══════════════════════════ */}
            {/* Side panel logo strip */}
            <mesh position={[0.4, 0.0, D / 2 + 0.01]} material={sidePanMat}>
                <planeGeometry args={[3.8, 0.55]} />
            </mesh>
            {/* LED pixel strip */}
            {Array.from({ length: 18 }).map((_, i) => (
                <mesh key={i} position={[i * 0.21 - 1.7, 0.08, D / 2 + 0.012]} material={ledMat}>
                    <boxGeometry args={[0.07, 0.2, 0.01]} />
                </mesh>
            ))}
            {/* Sub-pixel dots row */}
            {Array.from({ length: 25 }).map((_, i) => (
                <mesh key={i} position={[i * 0.15 - 1.8, -0.13, D / 2 + 0.013]} material={glowOrange}>
                    <boxGeometry args={[0.04, 0.04, 0.01]} />
                </mesh>
            ))}

            {/* ══════════════════════════
                UNDER-GLOW STRIP
            ══════════════════════════ */}
            <mesh position={[0, -1.06, 0]} material={underglowMat}>
                <boxGeometry args={[W - 0.5, 0.02, D + 0.5]} />
            </mesh>

            {/* ══════════════════════════
                FRONT FASCIA
            ══════════════════════════ */}
            <group position={[W2 + 0.01, -0.08, 0]}>
                {/* Curved windshield */}
                <RoundedBox args={[0.14, 1.38, D - 0.28]} radius={0.06}
                    position={[-0.2, 0.44, 0]} rotation={[0, 0, -0.12]} material={glassMat} />

                {/* Windshield chrome frame sides */}
                <mesh position={[-0.2, 0.44, D / 2 - 0.14 - 0.01]} rotation={[0, 0, -0.12]} material={chromeMat}>
                    <boxGeometry args={[0.07, 1.38, 0.035]} />
                </mesh>
                <mesh position={[-0.2, 0.44, -(D / 2 - 0.14 - 0.01)]} rotation={[0, 0, -0.12]} material={chromeMat}>
                    <boxGeometry args={[0.07, 1.38, 0.035]} />
                </mesh>

                {/* Destination matrix board */}
                <mesh position={[-0.02, 0.96, 0]} rotation={[0, 0, -0.12]} material={darkMat}>
                    <boxGeometry args={[0.1, 0.24, 1.6]} />
                </mesh>
                {Array.from({ length: 12 }).map((_, i) => (
                    <mesh key={i} position={[-0.005, 0.96, (i - 5.5) * 0.12]}
                        rotation={[0, 0, -0.12]} material={ledMat}>
                        <boxGeometry args={[0.07, 0.09, 0.07]} />
                    </mesh>
                ))}

                {/* DRL horizontal strip */}
                <mesh position={[0.07, -0.18, 0]} material={drlMat}>
                    <boxGeometry args={[0.055, 0.035, D - 0.1]} />
                </mesh>

                {/* LEFT headlight cluster */}
                <group position={[0.02, -0.44, D / 2 - 0.12]}>
                    <mesh material={chromeMat}>
                        <boxGeometry args={[0.16, 0.28, 0.5]} />
                    </mesh>
                    <mesh position={[0.09, 0.02, 0]} material={glowWhite}>
                        <circleGeometry args={[0.1, 32]} />
                    </mesh>
                    <mesh position={[0.092, 0.02, 0]} material={drlMat}>
                        <ringGeometry args={[0.04, 0.08, 24]} />
                    </mesh>
                    <mesh position={[0.09, -0.12, 0]} material={glowAmber}>
                        <planeGeometry args={[0.1, 0.05]} />
                    </mesh>
                    {/* DRL eyebrow strip */}
                    <mesh position={[0.07, 0.16, 0]} material={drlMat}>
                        <boxGeometry args={[0.04, 0.025, 0.44]} />
                    </mesh>
                </group>

                {/* RIGHT headlight cluster */}
                <group position={[0.02, -0.44, -(D / 2 - 0.12)]}>
                    <mesh material={chromeMat}>
                        <boxGeometry args={[0.16, 0.28, 0.5]} />
                    </mesh>
                    <mesh position={[0.09, 0.02, 0]} material={glowWhite}>
                        <circleGeometry args={[0.1, 32]} />
                    </mesh>
                    <mesh position={[0.092, 0.02, 0]} material={drlMat}>
                        <ringGeometry args={[0.04, 0.08, 24]} />
                    </mesh>
                    <mesh position={[0.09, -0.12, 0]} material={glowAmber}>
                        <planeGeometry args={[0.1, 0.05]} />
                    </mesh>
                    <mesh position={[0.07, 0.16, 0]} material={drlMat}>
                        <boxGeometry args={[0.04, 0.025, 0.44]} />
                    </mesh>
                </group>

                {/* Front grill */}
                <mesh position={[0.06, -0.68, 0]} material={darkMat}>
                    <boxGeometry args={[0.09, 0.26, 1.4]} />
                </mesh>
                {Array.from({ length: 6 }).map((_, i) => (
                    <mesh key={i} position={[0.08, -0.56 - i * 0.045, 0]} material={chromeMat}>
                        <boxGeometry args={[0.03, 0.01, 1.36]} />
                    </mesh>
                ))}

                {/* Front bumper Chrome */}
                <mesh position={[0.08, -0.86, 0]} material={chromeMat}>
                    <boxGeometry args={[0.1, 0.065, D + 0.05]} />
                </mesh>

                {/* Brand badge */}
                <mesh position={[0.09, -0.08, 0]} material={chromeMat}>
                    <cylinderGeometry args={[0.11, 0.11, 0.04, 32]} />
                </mesh>
                <mesh position={[0.1, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={glowOrange}>
                    <ringGeometry args={[0.045, 0.09, 32]} />
                </mesh>
            </group>

            {/* ── HEADLIGHT BEAM SHAFTS ── */}
            <mesh position={[W2 + 1.8, -0.36, D / 2 - 0.12]} rotation={[0, 0, Math.PI / 2]} material={beamMat}>
                <coneGeometry args={[0.8, 3.6, 12, 1, true]} />
            </mesh>
            <mesh position={[W2 + 0.2, -0.36, D / 2 - 0.12]} rotation={[0, 0, Math.PI / 2]} material={beamCoreMat}>
                <coneGeometry args={[0.14, 0.65, 8, 1, true]} />
            </mesh>
            <mesh position={[W2 + 1.8, -0.36, -(D / 2 - 0.12)]} rotation={[0, 0, Math.PI / 2]} material={beamMat}>
                <coneGeometry args={[0.8, 3.6, 12, 1, true]} />
            </mesh>
            <mesh position={[W2 + 0.2, -0.36, -(D / 2 - 0.12)]} rotation={[0, 0, Math.PI / 2]} material={beamCoreMat}>
                <coneGeometry args={[0.14, 0.65, 8, 1, true]} />
            </mesh>

            {/* ══════════════════════════
                REAR FASCIA
            ══════════════════════════ */}
            <group position={[-(W2 + 0.01), 0, 0]}>
                {[D / 2 - 0.12, -(D / 2 - 0.12)].map((z, idx) => (
                    <group key={idx}>
                        <mesh position={[0.04, -0.28, z]} material={darkMat}>
                            <boxGeometry args={[0.08, 0.58, 0.26]} />
                        </mesh>
                        {/* L-shaped tail lamp */}
                        <mesh position={[-0.04, -0.28, z]} rotation={[0, -Math.PI / 2, 0]} material={glowRed}>
                            <planeGeometry args={[0.26, 0.58]} />
                        </mesh>
                        {/* Reverse */}
                        <mesh position={[-0.038, -0.06, z]} rotation={[0, -Math.PI / 2, 0]} material={glowWhite}>
                            <planeGeometry args={[0.09, 0.065]} />
                        </mesh>
                    </group>
                ))}
                {/* Rear fog strip */}
                <mesh position={[-0.045, -0.64, 0]} rotation={[0, -Math.PI / 2, 0]} material={glowRed}>
                    <planeGeometry args={[0.32, 0.045]} />
                </mesh>
                {/* Engine vents */}
                {Array.from({ length: 7 }).map((_, i) => (
                    <mesh key={i} position={[-0.01, -0.04 - i * 0.09, 0]} material={darkMat}>
                        <boxGeometry args={[0.06, 0.025, 1.4]} />
                    </mesh>
                ))}
                {/* Rear bumper */}
                <mesh position={[0.0, -0.86, 0]} material={chromeMat}>
                    <boxGeometry args={[0.07, 0.065, D + 0.05]} />
                </mesh>
            </group>

            {/* ══════════════════════════
                SIDE MIRRORS
            ══════════════════════════ */}
            <group position={[W2 - 0.16, 0.55, 0]}>
                {[D / 2 + 0.04, -(D / 2 + 0.04)].map((z, i) => (
                    <group key={i}>
                        <mesh position={[-0.16, 0.22, z]} rotation={[0, 0, 0.2]} material={mirrorMat}>
                            <cylinderGeometry args={[0.022, 0.022, 0.48, 12]} />
                        </mesh>
                        <mesh position={[-0.16, 0.48, z]} material={bodyMat}>
                            <boxGeometry args={[0.12, 0.38, 0.24]} />
                        </mesh>
                        <mesh position={[-0.155, 0.48, z]} rotation={[0, Math.PI / 2, 0]} material={glassMat}>
                            <planeGeometry args={[0.22, 0.34]} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* ══════════════════════════
                ENTRY DOOR
            ══════════════════════════ */}
            <mesh position={[W2 - 1.4, -0.46, D / 2 + 0.01]} material={glassMat}>
                <planeGeometry args={[1.1, 0.85]} />
            </mesh>
            <mesh position={[W2 - 1.4, -0.9, D / 2 + 0.015]} material={chromeMat}>
                <boxGeometry args={[1.2, 0.06, 0.1]} />
            </mesh>
            {/* Door handle */}
            <mesh position={[W2 - 1.9, -0.46, D / 2 + 0.015]} material={chromeMat}>
                <boxGeometry args={[0.04, 0.18, 0.06]} />
            </mesh>

            {/* ══════════════════════════
                WHEELS — 3 axles, spinning rims
            ══════════════════════════ */}
            {/* Front axle */}
            <WheelGroup position={[2.4, -1.04, D / 2 - 0.02]} spinRef={wheelRefs.current[0]} frontWheel />
            <WheelGroup position={[2.4, -1.04, -(D / 2 - 0.02)]} spinRef={wheelRefs.current[1]} frontWheel />

            {/* Rear axle 1 */}
            <WheelGroup position={[-1.4, -1.04, D / 2 - 0.02]} spinRef={wheelRefs.current[2]} />
            <WheelGroup position={[-1.4, -1.04, -(D / 2 - 0.02)]} spinRef={wheelRefs.current[3]} />

            {/* Rear axle 2 */}
            <WheelGroup position={[-2.55, -1.04, D / 2 - 0.02]} spinRef={wheelRefs.current[4]} />
            <WheelGroup position={[-2.55, -1.04, -(D / 2 - 0.02)]} spinRef={wheelRefs.current[5]} />

            {/* Axle rods */}
            {[2.4, -1.4, -2.55].map((x, i) => (
                <mesh key={i} position={[x, -1.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={darkMat}>
                    <cylinderGeometry args={[0.055, 0.055, D, 12]} />
                </mesh>
            ))}

            {/* Suspension/chassis rails */}
            <mesh position={[0, -0.95, D / 2 - 0.3]} rotation={[0, 0, 0]} material={darkMat}>
                <boxGeometry args={[W - 0.4, 0.06, 0.1]} />
            </mesh>
            <mesh position={[0, -0.95, -(D / 2 - 0.3)]} material={darkMat}>
                <boxGeometry args={[W - 0.4, 0.06, 0.1]} />
            </mesh>

        </group>
    )
}
