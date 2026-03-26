import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Stars, Float, ContactShadows, Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { Bus } from './components/Bus'

// Road markings component
function RoadMarkings() {
    return (
        <group position={[0, -1.22, 0]}>
            {/* Road surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 10]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
            </mesh>
            {/* Center dashes */}
            {Array.from({ length: 30 }).map((_, i) => (
                <mesh key={i} position={[i * 3 - 45, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1.6, 0.18]} />
                    <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.6} />
                </mesh>
            ))}
            {/* Road edge stripes */}
            {Array.from({ length: 30 }).map((_, i) => (
                <group key={i}>
                    <mesh position={[i * 3 - 45, 0.004, 2.4]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[1.6, 0.08]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                    </mesh>
                    <mesh position={[i * 3 - 45, 0.004, -2.4]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[1.6, 0.08]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

function Scene() {
    const scroll = useScroll()
    const groupRef = useRef()
    const rimLightRef = useRef()
    const keyLightRef = useRef()
    const roadRef = useRef()

    useFrame((state) => {
        const s = scroll.offset
        const { camera } = state
        const t = s * 5

        // ── MOBILE DETECTION ──
        const isMobile = window.innerWidth < 768
        camera.fov = isMobile ? 55 : 42
        camera.updateProjectionMatrix()

        // ── CAMERA POSITIONS PER SECTION ──
        const targetPos = new THREE.Vector3()
        if (t < 1) {
            // Hero: dramatic front-low angle
            targetPos.set(0, isMobile ? 0.8 : 0.3, isMobile ? 9.0 : 7.0)
        } else if (t < 2) {
            // Fleet: sweeping right side-angle
            targetPos.set(isMobile ? 3.5 : 5.0, 1.8, isMobile ? 5.0 : 3.5)
        } else if (t < 3) {
            // Destinations: left wide aerial
            targetPos.set(isMobile ? -4.5 : -5.5, 2.2, isMobile ? 5.5 : 4.2)
        } else if (t < 4) {
            // Reviews: overhead 3/4 - show top of bus
            targetPos.set(1.5, isMobile ? 5.0 : 4.0, isMobile ? 6.5 : 5.0)
        } else {
            // Booking: rear-quarter beauty angle
            targetPos.set(isMobile ? -2.5 : -3.5, 0.8, isMobile ? 5.5 : 3.8)
        }

        // Mouse parallax (reduced for mobile)
        const parallaxFactor = isMobile ? 0.1 : 0.35
        targetPos.x += state.mouse.x * parallaxFactor
        targetPos.y += state.mouse.y * (parallaxFactor * 0.5)

        camera.position.lerp(targetPos, 0.055)
        camera.lookAt(0, 0.1, 0)

        // Bus group rotation – full 360 over 5 sections
        if (groupRef.current) {
            const targetY = (s * Math.PI * 1.2) - 0.3
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetY,
                0.035
            )
        }

        // Key light orbit
        if (keyLightRef.current) {
            keyLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.25) * 7
            keyLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.25) * 7
        }

        // Rim light pulse
        if (rimLightRef.current) {
            rimLightRef.current.intensity = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.5
        }

        // Road scrolls slowly
        if (roadRef.current) {
            roadRef.current.position.x = -(state.clock.elapsedTime * 1.2) % 3
        }
    })

    return (
        <>
            <color attach="background" args={['#00010a']} />
            <fog attach="fog" args={['#00010a', 10, 35]} />

            {/* Environment */}
            <Environment preset="night" />

            {/* Ambient - very low */}
            <ambientLight intensity={0.25} />

            {/* Key light - orange-warm orbit */}
            <spotLight
                ref={keyLightRef}
                position={[8, 9, 8]}
                angle={0.2}
                penumbra={1}
                intensity={5}
                castShadow
                shadow-mapSize={[2048, 2048]}
                color="#ff6600"
            />

            {/* Fill - cool blue */}
            <pointLight position={[-7, 5, -5]} intensity={2} color="#1144ff" />

            {/* Rim from behind - white edge */}
            <directionalLight ref={rimLightRef} position={[-5, 3, -10]} intensity={1.5} color="#ffffff" />

            {/* Under-glow red */}
            <pointLight position={[0, -1.8, 0]} intensity={1.2} color="#ff2200" />

            {/* Front accent - warm white */}
            <spotLight position={[12, 0, 0]} angle={0.15} penumbra={1} intensity={3} color="#fff5e0" />

            <Stars radius={150} depth={80} count={window.innerWidth < 768 ? 3000 : 10000} factor={4} saturation={0} fade speed={0.8} />

            {/* Sparkle dust around bus */}
            <Sparkles
                count={window.innerWidth < 768 ? 30 : 80}
                scale={[12, 4, 5]}
                size={1.5}
                speed={0.4}
                opacity={0.3}
                color="#ff4400"
                position={[0, 0, 0]}
            />

            {/* Road */}
            <group ref={roadRef}>
                <RoadMarkings />
            </group>

            <group ref={groupRef}>
                <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.3}>
                    <Bus />
                </Float>
            </group>

            <ContactShadows
                position={[0, -1.22, 0]}
                opacity={0.9}
                scale={18}
                blur={3}
                far={1.8}
                color="#220000"
            />

            {/* Neon grid */}
            <gridHelper args={[200, 60, '#220000', '#080000']} position={[0, -1.225, 0]} />
        </>
    )
}

export default Scene
