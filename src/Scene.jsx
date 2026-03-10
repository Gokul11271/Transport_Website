import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Stars, Float, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { Bus } from './components/Bus'

function Scene() {
    const scroll = useScroll()
    const groupRef = useRef()
    const rimLightRef = useRef()
    const keyLightRef = useRef()

    useFrame((state) => {
        const s = scroll.offset
        const { camera } = state
        const t = s * 5 // 5 sections

        // Smooth camera transitions per section
        const targetPos = new THREE.Vector3()
        if (t < 1) {
            targetPos.set(0, 0.5, 6.5) // Hero: full frontal
        } else if (t < 2) {
            targetPos.set(4.5, 1.5, 3.5) // Fleet: right side-angle
        } else if (t < 3) {
            targetPos.set(-5, 2, 4) // Destinations: left wide
        } else if (t < 4) {
            targetPos.set(0, 3, 5.5) // Reviews: overhead 3/4
        } else {
            targetPos.set(-3, 0.5, 4) // Booking: rear quarter
        }

        camera.position.lerp(targetPos, 0.06)
        camera.lookAt(0, 0.2, 0)

        // Bus group rotation synced to scroll
        if (groupRef.current) {
            const targetY = (s * Math.PI * 0.8) - 0.4
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.04)
        }

        // Dynamic key light movement
        if (keyLightRef.current) {
            keyLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 6
            keyLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 6
        }

        // Rim light ping-pong
        if (rimLightRef.current) {
            rimLightRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.4
        }
    })

    return (
        <>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 8, 28]} />

            {/* Environment for reflections */}
            <Environment preset="night" />

            {/* Ambient – very dim to keep the drama */}
            <ambientLight intensity={0.3} />

            {/* Key light – slow orbit, red-tinted */}
            <spotLight
                ref={keyLightRef}
                position={[8, 8, 8]}
                angle={0.18}
                penumbra={1}
                intensity={4}
                castShadow
                shadow-mapSize={[2048, 2048]}
                color="#ff3300"
            />

            {/* Fill light – cool blue for contrast */}
            <pointLight position={[-6, 4, -4]} intensity={1.5} color="#1133ff" />

            {/* Rim from behind – white edge lighting */}
            <directionalLight ref={rimLightRef} position={[-4, 2, -8]} intensity={1.2} color="#ffffff" />

            {/* Under-glow – dark red from below */}
            <pointLight position={[0, -1.5, 0]} intensity={0.8} color="#ff0000" />

            <Stars radius={120} depth={60} count={8000} factor={4} saturation={0} fade speed={1} />

            <group ref={groupRef}>
                <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
                    <Bus />
                </Float>
            </group>

            <ContactShadows
                position={[0, -1.2, 0]}
                opacity={0.8}
                scale={15}
                blur={2.5}
                far={1.5}
                color="#330000"
            />

            {/* Ground grid */}
            <gridHelper args={[200, 60, '#220000', '#0a0000']} position={[0, -1.21, 0]} />
        </>
    )
}

export default Scene
