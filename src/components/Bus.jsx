import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// ─── Module-level material singletons (never recreated on render) ─────────────
const bodyMat = new THREE.MeshStandardMaterial({ color: '#0d0d0d', roughness: 0.18, metalness: 0.85, envMapIntensity: 2.5 })
const glassMat = new THREE.MeshPhysicalMaterial({ color: '#0a1a33', metalness: 0.05, roughness: 0.04, transmission: 0.75, thickness: 0.4, transparent: true, opacity: 0.5, envMapIntensity: 2 })
const chromeMat = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.02, metalness: 1.0, envMapIntensity: 4 })
const redMat = new THREE.MeshStandardMaterial({ color: '#cc0000', emissive: '#880000', emissiveIntensity: 0.6 })
const glowRedMat = new THREE.MeshStandardMaterial({ color: '#ff2200', emissive: '#ff0000', emissiveIntensity: 5, toneMapped: false })
const glowWhiteMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 5, toneMapped: false })
const darkMat = new THREE.MeshStandardMaterial({ color: '#080808', roughness: 0.9 })
const acMat = new THREE.MeshStandardMaterial({ color: '#1c1c1c', roughness: 0.55, metalness: 0.4 })
const tireMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.92 })
const rearHousingMat = new THREE.MeshStandardMaterial({ color: '#2a0000' })
const mirrorArmMat = new THREE.MeshStandardMaterial({ color: '#111111' })
const seatMat = new THREE.MeshStandardMaterial({ color: '#040404' })
const destBoardMat = new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#001100', emissiveIntensity: 0.3 })
const destLedMat = new THREE.MeshStandardMaterial({ color: '#ff3300', emissive: '#ff2200', emissiveIntensity: 6, toneMapped: false })
const sidePanelMat = new THREE.MeshStandardMaterial({ color: '#1a0000' })

export function Bus() {
    const busRef = useRef()
    const wheelsRef = useRef()

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        if (busRef.current) {
            busRef.current.position.y = Math.sin(t * 1.4) * 0.055
        }
        if (wheelsRef.current) {
            wheelsRef.current.children.forEach(axle => {
                axle.children.forEach(mesh => { mesh.rotation.x = -t * 2 })
            })
        }
    })

    // Small LED dot grid helper — replaces Text on the destination board
    const LedRow = ({ z = 0, color = '#ff3300' }) => (
        <>
            {Array.from({ length: 7 }).map((_, i) => (
                <mesh key={i} position={[0, 0, z + (i - 3) * 0.15]} material={destLedMat}>
                    <boxGeometry args={[0.04, 0.04, 0.04]} />
                </mesh>
            ))}
        </>
    )

    return (
        <group ref={busRef} position={[0, 0.2, 0]}>

            {/* ── MAIN BODY ── */}
            <RoundedBox args={[6.5, 1.9, 2.1]} radius={0.15} smoothness={8} material={bodyMat} />

            {/* ── AC UNIT / ROOF ── */}
            <RoundedBox args={[4.2, 0.22, 1.85]} radius={0.08} smoothness={4}
                position={[0, 1.06, 0]} material={acMat} />

            {/* ── SIDE GLASS STRIP ── */}
            <RoundedBox args={[5.9, 0.88, 2.16]} radius={0.05} smoothness={4}
                position={[0.15, 0.3, 0]} material={glassMat} />

            {/* ── RED ACCENT STRIPE ── */}
            <mesh position={[0, -0.42, 0]} material={redMat}>
                <boxGeometry args={[6.52, 0.09, 2.13]} />
            </mesh>

            {/* ── CHROME PIN-STRIPE ── */}
            <mesh position={[0, -0.62, 0]} material={chromeMat}>
                <boxGeometry args={[6.52, 0.03, 2.12]} />
            </mesh>

            {/* ── SIDE BRANDING PANEL (replaces Text) ── */}
            <mesh position={[0.5, 0.15, 1.056]} material={sidePanelMat}>
                <planeGeometry args={[3.5, 0.45]} />
            </mesh>
            {/* LED dots simulating "LUXURY FLEET" text */}
            {Array.from({ length: 12 }).map((_, i) => (
                <mesh key={i} position={[i * 0.28 - 1.5, 0.15, 1.06]} material={destLedMat}>
                    <boxGeometry args={[0.06, 0.18, 0.01]} />
                </mesh>
            ))}
            {/* Red LED sub-line */}
            {Array.from({ length: 18 }).map((_, i) => (
                <mesh key={i} position={[i * 0.19 - 1.6, -0.1, 1.061]} material={glowRedMat}>
                    <boxGeometry args={[0.05, 0.06, 0.01]} />
                </mesh>
            ))}

            {/* ── INTERIOR SEAT SILHOUETTES ── */}
            {Array.from({ length: 9 }).map((_, i) => (
                <group key={i} position={[(i * 0.62) - 2.6, -0.1, 0]}>
                    <mesh position={[0, 0, 0.62]} material={seatMat}>
                        <boxGeometry args={[0.3, 0.5, 0.45]} />
                    </mesh>
                    <mesh position={[0, 0, -0.62]} material={seatMat}>
                        <boxGeometry args={[0.3, 0.5, 0.45]} />
                    </mesh>
                </group>
            ))}

            {/* ── FRONT FASCIA ── */}
            <group position={[3.27, -0.1, 0]}>
                {/* Windshield */}
                <RoundedBox args={[0.1, 1.3, 2.05]} radius={0.05}
                    position={[-0.22, 0.42, 0]} rotation={[0, 0, -0.14]} material={glassMat} />

                {/* Destination board housing */}
                <mesh position={[-0.04, 0.88, 0]} rotation={[0, 0, -0.14]} material={destBoardMat}>
                    <boxGeometry args={[0.08, 0.22, 1.5]} />
                </mesh>
                {/* LED pixels on board */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <mesh key={i} position={[-0.0, 0.88, (i - 4.5) * 0.13]} rotation={[0, 0, -0.14]} material={destLedMat}>
                        <boxGeometry args={[0.06, 0.07, 0.06]} />
                    </mesh>
                ))}

                {/* Headlight housings */}
                <mesh position={[0.01, -0.4, 0.82]} material={chromeMat}>
                    <boxGeometry args={[0.12, 0.22, 0.42]} />
                </mesh>
                <mesh position={[0.075, -0.4, 0.82]} material={glowWhiteMat}>
                    <circleGeometry args={[0.085, 32]} />
                </mesh>
                <mesh position={[0.01, -0.4, -0.82]} material={chromeMat}>
                    <boxGeometry args={[0.12, 0.22, 0.42]} />
                </mesh>
                <mesh position={[0.075, -0.4, -0.82]} material={glowWhiteMat}>
                    <circleGeometry args={[0.085, 32]} />
                </mesh>

                {/* DRL strip */}
                <mesh position={[0.05, -0.25, 0]} material={glowWhiteMat}>
                    <boxGeometry args={[0.04, 0.03, 1.6]} />
                </mesh>

                {/* Lower grill */}
                <mesh position={[0.02, -0.62, 0]} material={darkMat}>
                    <boxGeometry args={[0.06, 0.22, 1.25]} />
                </mesh>
                {/* Grill slats */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <mesh key={i} position={[0.045, -0.52 - i * 0.05, 0]} material={chromeMat}>
                        <boxGeometry args={[0.02, 0.01, 1.2]} />
                    </mesh>
                ))}

                {/* Chrome brand badge */}
                <mesh position={[0.06, -0.08, 0]} material={chromeMat}>
                    <circleGeometry args={[0.1, 32]} />
                </mesh>
            </group>

            {/* ── REAR FASCIA ── */}
            <group position={[-3.27, 0, 0]}>
                {/* Tail lights */}
                {[0.82, -0.82].map((z, idx) => (
                    <group key={idx}>
                        <mesh position={[0, -0.3, z]} material={rearHousingMat}>
                            <boxGeometry args={[0.06, 0.52, 0.22]} />
                        </mesh>
                        <mesh position={[-0.04, -0.3, z]} rotation={[0, -Math.PI / 2, 0]} material={glowRedMat}>
                            <planeGeometry args={[0.22, 0.52]} />
                        </mesh>
                    </group>
                ))}

                {/* Rear engine vents */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <mesh key={i} position={[-0.01, -0.1 - (i * 0.1), 0]} material={darkMat}>
                        <boxGeometry args={[0.05, 0.025, 1.25]} />
                    </mesh>
                ))}

                {/* Chrome bumper */}
                <mesh position={[0.0, -0.82, 0]} material={chromeMat}>
                    <boxGeometry args={[0.06, 0.06, 2.0]} />
                </mesh>
            </group>

            {/* ── SIDE MIRRORS ── */}
            <group position={[3.1, 0.5, 0]}>
                {[1.16, -1.16].map((z, idx) => (
                    <group key={idx}>
                        <mesh position={[-0.18, 0.22, z]} rotation={[0, 0, 0.22]} material={mirrorArmMat}>
                            <cylinderGeometry args={[0.022, 0.022, 0.42, 12]} />
                        </mesh>
                        <mesh position={[-0.18, 0.43, z]} material={bodyMat}>
                            <boxGeometry args={[0.11, 0.38, 0.22]} />
                        </mesh>
                        {/* Mirror glass */}
                        <mesh position={[-0.175, 0.43, z]} material={chromeMat}>
                            <planeGeometry args={[0.09, 0.32]} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* ── STEP / ENTRY DOOR ── */}
            <mesh position={[1.8, -0.87, 1.06]} material={chromeMat}>
                <boxGeometry args={[1.2, 0.06, 0.1]} />
            </mesh>
            <mesh position={[1.8, -0.44, 1.065]} material={darkMat}>
                <boxGeometry args={[1.1, 0.82, 0.01]} />
            </mesh>

            {/* ── WHEELS (3 axles) ── */}
            <group ref={wheelsRef} position={[0, -0.97, 0]}>
                {/* Front axle */}
                {[2.25].map(x => (
                    <group key={x} position={[x, 0, 0]}>
                        {[0.92, -0.92].map((z, i) => (
                            <group key={i}>
                                <mesh position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={tireMat}>
                                    <cylinderGeometry args={[0.46, 0.46, 0.38, 32]} />
                                </mesh>
                                <mesh position={[0, 0, z + (z > 0 ? 0.2 : -0.2)]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                                    <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
                                </mesh>
                                {/* Lug nuts */}
                                {Array.from({ length: 6 }).map((_, j) => {
                                    const angle = (j / 6) * Math.PI * 2
                                    return (
                                        <mesh key={j}
                                            position={[Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, z + (z > 0 ? 0.23 : -0.23)]}
                                            rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                                            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
                                        </mesh>
                                    )
                                })}
                            </group>
                        ))}
                    </group>
                ))}
                {/* Rear dual axles */}
                {[-1.5, -2.55].map(x => (
                    <group key={x} position={[x, 0, 0]}>
                        {[0.92, -0.92].map((z, i) => (
                            <group key={i}>
                                <mesh position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={tireMat}>
                                    <cylinderGeometry args={[0.46, 0.46, 0.38, 32]} />
                                </mesh>
                                <mesh position={[0, 0, z + (z > 0 ? 0.18 : -0.18)]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
                                    <cylinderGeometry args={[0.3, 0.3, 0.22, 32]} />
                                </mesh>
                            </group>
                        ))}
                    </group>
                ))}
            </group>

        </group>
    )
}
