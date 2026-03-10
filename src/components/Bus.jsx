import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// ─── Materials (module-scope singletons) ──────────────────────────────────────
const bodyMat = new THREE.MeshStandardMaterial({ color: '#0d0d0d', roughness: 0.18, metalness: 0.85, envMapIntensity: 2.5 })
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#0a1e3a', metalness: 0.05, roughness: 0.04, transmission: 0.75, thickness: 0.4, transparent: true, opacity: 0.55 })
const chromeMat = new THREE.MeshStandardMaterial({ color: '#d8d8d8', roughness: 0.02, metalness: 1.0, envMapIntensity: 4 })
const redMat = new THREE.MeshStandardMaterial({ color: '#cc0000', emissive: '#880000', emissiveIntensity: 0.6 })
const glowRed = new THREE.MeshStandardMaterial({ color: '#ff2200', emissive: '#ff0000', emissiveIntensity: 5, toneMapped: false })
const glowWhite = new THREE.MeshStandardMaterial({ color: '#ffffd0', emissive: '#ffffff', emissiveIntensity: 6, toneMapped: false })
const glowAmber = new THREE.MeshStandardMaterial({ color: '#ffcc00', emissive: '#ffaa00', emissiveIntensity: 3, toneMapped: false })
const darkMat = new THREE.MeshStandardMaterial({ color: '#080808', roughness: 0.9 })
const acMat = new THREE.MeshStandardMaterial({ color: '#1c1c1c', roughness: 0.55, metalness: 0.4 })
const tireMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.88 })
const rimMat = new THREE.MeshStandardMaterial({ color: '#1e1e1e', roughness: 0.3, metalness: 0.8 })
const rearHouseMat = new THREE.MeshStandardMaterial({ color: '#2a0000' })
const mirrorMat = new THREE.MeshStandardMaterial({ color: '#111111' })
const seatMat = new THREE.MeshStandardMaterial({ color: '#060606' })
const ledMat = new THREE.MeshStandardMaterial({ color: '#ff3300', emissive: '#ff2200', emissiveIntensity: 6, toneMapped: false })
const drlMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ddddff', emissiveIntensity: 4, toneMapped: false })
const beamMat = new THREE.MeshBasicMaterial({ color: '#ffffcc', transparent: true, opacity: 0.05, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending })
const beamCoreMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending })
const sidePanMat = new THREE.MeshStandardMaterial({ color: '#1a0000' })

// ─── Wheel component with torus tire + spokes (static, not spinning) ─────────
const TIRE_R = 0.37   // outer torus radius
const TIRE_T = 0.10   // tube thickness
const RIM_R = 0.26   // inner rim radius

function WheelGroup({ position, frontWheel = false }) {
    return (
        <group position={position}>
            {/* Torus tire – no rotation needed, torus already faces XY by default */}
            <mesh material={tireMat} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[TIRE_R, TIRE_T, 18, 44]} />
            </mesh>

            {/* Rim disc */}
            <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[RIM_R + 0.03, RIM_R + 0.03, 0.32, 32]} />
            </mesh>

            {/* Chrome hub cap */}
            <mesh material={chromeMat} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.36, 16]} />
            </mesh>

            {/* Hub center disc */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                <cylinderGeometry args={[0.05, 0.05, 0.38, 12]} />
            </mesh>

            {/* 7 chrome spokes in XZ plane (wheel faces along Z after torus rotation) */}
            {Array.from({ length: 7 }).map((_, i) => {
                const a = (i / 7) * Math.PI * 2
                const midR = (RIM_R + 0.09) * 0.5
                const spokeLen = RIM_R - 0.09
                return (
                    <mesh
                        key={i}
                        position={[Math.cos(a) * midR, Math.sin(a) * midR, 0]}
                        rotation={[0, 0, a - Math.PI / 2]}
                        material={chromeMat}
                    >
                        <cylinderGeometry args={[0.015, 0.015, spokeLen, 6]} />
                    </mesh>
                )
            })}

            {/* Lug nut ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                <torusGeometry args={[0.145, 0.01, 6, 16]} />
            </mesh>

            {/* Brake disc (rear only) */}
            {!frontWheel && (
                <mesh rotation={[Math.PI / 2, 0, 0]} material={darkMat}>
                    <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
                </mesh>
            )}
        </group>
    )
}

// ─── Main Bus component ──────────────────────────────────────────────────────
export function Bus() {
    const busRef = useRef()

    // Gentle floating — NO wheel spin
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        if (busRef.current) {
            busRef.current.position.y = Math.sin(t * 1.4) * 0.055
        }
    })

    return (
        <group ref={busRef} position={[0, 0.2, 0]}>

            {/* ── MAIN BODY ── */}
            <RoundedBox args={[6.5, 1.9, 2.1]} radius={0.16} smoothness={8} material={bodyMat} />

            {/* ── LOWER SKIRT (slight overhang) ── */}
            <mesh position={[0, -0.98, 0]} material={darkMat}>
                <boxGeometry args={[6.45, 0.06, 2.14]} />
            </mesh>

            {/* ── AC / ROOF UNIT ── */}
            <RoundedBox args={[4.4, 0.22, 1.86]} radius={0.08} smoothness={4}
                position={[0, 1.07, 0]} material={acMat} />
            {/* AC vents */}
            {[-1.5, 0, 1.5].map((x, i) => (
                <mesh key={i} position={[x, 1.12, 0]} material={chromeMat}>
                    <boxGeometry args={[0.6, 0.04, 1.7]} />
                </mesh>
            ))}

            {/* ── SIDE GLASS STRIP ── */}
            <RoundedBox args={[5.9, 0.88, 2.16]} radius={0.05} smoothness={4}
                position={[0.15, 0.3, 0]} material={glassMat} />

            {/* ── RED ACCENT STRIPE ── */}
            <mesh position={[0, -0.42, 0]} material={redMat}>
                <boxGeometry args={[6.52, 0.09, 2.13]} />
            </mesh>

            {/* ── CHROME PIN-STRIPE ── */}
            <mesh position={[0, -0.62, 0]} material={chromeMat}>
                <boxGeometry args={[6.52, 0.025, 2.12]} />
            </mesh>

            {/* ── SIDE BRANDING PANEL ── */}
            <mesh position={[0.5, 0.15, 1.057]} material={sidePanMat}>
                <planeGeometry args={[3.5, 0.42]} />
            </mesh>
            {/* LED pixel strip simulating text */}
            {Array.from({ length: 14 }).map((_, i) => (
                <mesh key={i} position={[i * 0.24 - 1.5, 0.16, 1.058]} material={ledMat}>
                    <boxGeometry args={[0.06, 0.17, 0.01]} />
                </mesh>
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={i} position={[i * 0.17 - 1.6, -0.09, 1.059]} material={glowRed}>
                    <boxGeometry args={[0.04, 0.05, 0.01]} />
                </mesh>
            ))}

            {/* ── INTERIOR SEAT SILHOUETTES ── */}
            {Array.from({ length: 9 }).map((_, i) => (
                <group key={i} position={[(i * 0.62) - 2.6, -0.1, 0]}>
                    <mesh position={[0, 0, 0.63]} material={seatMat}>
                        <boxGeometry args={[0.28, 0.5, 0.42]} />
                    </mesh>
                    <mesh position={[0, 0, -0.63]} material={seatMat}>
                        <boxGeometry args={[0.28, 0.5, 0.42]} />
                    </mesh>
                </group>
            ))}

            {/* ══════════════════════════════════════════
                FRONT FASCIA
            ══════════════════════════════════════════ */}
            <group position={[3.27, -0.1, 0]}>

                {/* Windshield */}
                <RoundedBox args={[0.12, 1.32, 2.06]} radius={0.05}
                    position={[-0.22, 0.43, 0]} rotation={[0, 0, -0.13]} material={glassMat} />

                {/* Windshield frame */}
                <mesh position={[-0.22, 0.43, 1.03]} rotation={[0, 0, -0.13]} material={chromeMat}>
                    <boxGeometry args={[0.08, 1.32, 0.04]} />
                </mesh>
                <mesh position={[-0.22, 0.43, -1.03]} rotation={[0, 0, -0.13]} material={chromeMat}>
                    <boxGeometry args={[0.08, 1.32, 0.04]} />
                </mesh>

                {/* Destination board */}
                <mesh position={[-0.04, 0.9, 0]} rotation={[0, 0, -0.13]} material={darkMat}>
                    <boxGeometry args={[0.09, 0.22, 1.5]} />
                </mesh>
                {Array.from({ length: 10 }).map((_, i) => (
                    <mesh key={i} position={[-0.02, 0.9, (i - 4.5) * 0.13]}
                        rotation={[0, 0, -0.13]} material={ledMat}>
                        <boxGeometry args={[0.06, 0.07, 0.07]} />
                    </mesh>
                ))}

                {/* ── DRL (Daytime Running Light) horizontal strip ── */}
                <mesh position={[0.05, -0.22, 0]} material={drlMat}>
                    <boxGeometry args={[0.05, 0.03, 1.7]} />
                </mesh>

                {/* ── LEFT HEADLIGHT HOUSING ── */}
                <group position={[0.0, -0.42, 0.82]}>
                    <mesh material={chromeMat}>
                        <boxGeometry args={[0.14, 0.26, 0.46]} />
                    </mesh>
                    {/* Main beam lens */}
                    <mesh position={[0.08, 0, 0]} material={glowWhite}>
                        <circleGeometry args={[0.09, 32]} />
                    </mesh>
                    {/* High-beam inner ring */}
                    <mesh position={[0.082, 0, 0]} material={drlMat}>
                        <ringGeometry args={[0.04, 0.07, 24]} />
                    </mesh>
                    {/* Amber turn signal */}
                    <mesh position={[0.08, -0.12, 0]} material={glowAmber}>
                        <planeGeometry args={[0.08, 0.04]} />
                    </mesh>
                </group>

                {/* ── RIGHT HEADLIGHT HOUSING ── */}
                <group position={[0.0, -0.42, -0.82]}>
                    <mesh material={chromeMat}>
                        <boxGeometry args={[0.14, 0.26, 0.46]} />
                    </mesh>
                    <mesh position={[0.08, 0, 0]} material={glowWhite}>
                        <circleGeometry args={[0.09, 32]} />
                    </mesh>
                    <mesh position={[0.082, 0, 0]} material={drlMat}>
                        <ringGeometry args={[0.04, 0.07, 24]} />
                    </mesh>
                    <mesh position={[0.08, -0.12, 0]} material={glowAmber}>
                        <planeGeometry args={[0.08, 0.04]} />
                    </mesh>
                </group>

                {/* Lower grill */}
                <mesh position={[0.04, -0.64, 0]} material={darkMat}>
                    <boxGeometry args={[0.08, 0.24, 1.3]} />
                </mesh>
                {/* Grill slats */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <mesh key={i} position={[0.075, -0.54 - i * 0.05, 0]} material={chromeMat}>
                        <boxGeometry args={[0.025, 0.012, 1.26]} />
                    </mesh>
                ))}

                {/* Front bumper */}
                <mesh position={[0.06, -0.82, 0]} material={chromeMat}>
                    <boxGeometry args={[0.1, 0.06, 2.06]} />
                </mesh>

                {/* Brand badge */}
                <mesh position={[0.07, -0.1, 0]} material={chromeMat}>
                    <cylinderGeometry args={[0.1, 0.1, 0.04, 32]} />
                </mesh>
                <mesh position={[0.08, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]} material={glowWhite}>
                    <ringGeometry args={[0.04, 0.08, 32]} />
                </mesh>
            </group>

            {/* ── HEADLIGHT BEAMS (visible light shafts) ── */}
            {/* Left beam */}
            <mesh
                position={[3.27 + 1.6, -0.32, 0.82]}
                rotation={[0, 0, Math.PI / 2]}
                material={beamMat}
            >
                <coneGeometry args={[0.7, 3.2, 12, 1, true]} />
            </mesh>
            <mesh position={[3.27 + 0.2, -0.32, 0.82]} rotation={[0, 0, Math.PI / 2]} material={beamCoreMat}>
                <coneGeometry args={[0.12, 0.6, 8, 1, true]} />
            </mesh>

            {/* Right beam */}
            <mesh
                position={[3.27 + 1.6, -0.32, -0.82]}
                rotation={[0, 0, Math.PI / 2]}
                material={beamMat}
            >
                <coneGeometry args={[0.7, 3.2, 12, 1, true]} />
            </mesh>
            <mesh position={[3.27 + 0.2, -0.32, -0.82]} rotation={[0, 0, Math.PI / 2]} material={beamCoreMat}>
                <coneGeometry args={[0.12, 0.6, 8, 1, true]} />
            </mesh>

            {/* ══════════════════════════════════════════
                REAR FASCIA
            ══════════════════════════════════════════ */}
            <group position={[-3.27, 0, 0]}>
                {[0.82, -0.82].map((z, idx) => (
                    <group key={idx}>
                        <mesh position={[0, -0.3, z]} material={rearHouseMat}>
                            <boxGeometry args={[0.06, 0.55, 0.24]} />
                        </mesh>
                        {/* L-shaped tail light */}
                        <mesh position={[-0.04, -0.3, z]} rotation={[0, -Math.PI / 2, 0]} material={glowRed}>
                            <planeGeometry args={[0.24, 0.55]} />
                        </mesh>
                        {/* Reverse light */}
                        <mesh position={[-0.035, -0.08, z]} rotation={[0, -Math.PI / 2, 0]} material={glowWhite}>
                            <planeGeometry args={[0.08, 0.06]} />
                        </mesh>
                    </group>
                ))}
                {/* Engine vents */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <mesh key={i} position={[-0.01, -0.06 - i * 0.1, 0]} material={darkMat}>
                        <boxGeometry args={[0.05, 0.025, 1.3]} />
                    </mesh>
                ))}
                {/* Rear bumper */}
                <mesh position={[0.0, -0.84, 0]} material={chromeMat}>
                    <boxGeometry args={[0.06, 0.06, 2.06]} />
                </mesh>
                {/* Rear fog light */}
                <mesh position={[-0.04, -0.62, 0]} rotation={[0, -Math.PI / 2, 0]} material={glowRed}>
                    <planeGeometry args={[0.3, 0.04]} />
                </mesh>
            </group>

            {/* ── SIDE MIRRORS ── */}
            <group position={[3.1, 0.5, 0]}>
                {[1.16, -1.16].map((z, i) => (
                    <group key={i}>
                        <mesh position={[-0.18, 0.2, z]} rotation={[0, 0, 0.22]} material={mirrorMat}>
                            <cylinderGeometry args={[0.022, 0.022, 0.45, 12]} />
                        </mesh>
                        <mesh position={[-0.18, 0.44, z]} material={bodyMat}>
                            <boxGeometry args={[0.12, 0.36, 0.22]} />
                        </mesh>
                        <mesh position={[-0.175, 0.44, z]} rotation={[0, Math.PI / 2, 0]} material={glassMat}>
                            <planeGeometry args={[0.2, 0.32]} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* ── ENTRY DOOR ── */}
            <mesh position={[1.8, -0.45, 1.058]} material={glassMat}>
                <planeGeometry args={[1.0, 0.8]} />
            </mesh>
            <mesh position={[1.8, -0.88, 1.061]} material={chromeMat}>
                <boxGeometry args={[1.1, 0.06, 0.1]} />
            </mesh>

            {/* ══════════════════════════════════════════
                WHEELS — 3 axles, torus tires, static spokes
            ══════════════════════════════════════════ */}

            {/* Front axle */}
            <WheelGroup position={[2.2, -0.97, 0.93]} frontWheel />
            <WheelGroup position={[2.2, -0.97, -0.93]} frontWheel />

            {/* Rear axle 1 */}
            <WheelGroup position={[-1.5, -0.97, 0.95]} />
            <WheelGroup position={[-1.5, -0.97, -0.95]} />

            {/* Rear axle 2 */}
            <WheelGroup position={[-2.55, -0.97, 0.95]} />
            <WheelGroup position={[-2.55, -0.97, -0.95]} />

            {/* Axle rods */}
            {[2.2, -1.5, -2.55].map((x, i) => (
                <mesh key={i} position={[x, -0.97, 0]} rotation={[Math.PI / 2, 0, 0]} material={darkMat}>
                    <cylinderGeometry args={[0.05, 0.05, 2.0, 12]} />
                </mesh>
            ))}

        </group>
    )
}
