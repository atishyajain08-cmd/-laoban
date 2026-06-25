// @ts-nocheck
"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center, Environment } from "@react-three/drei";
import AnimatedSection from "@/components/ui/AnimatedSection";
import * as THREE from "three";

function GoldRing({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[1, 0.15, 32, 64]} />
        <meshStandardMaterial color="#C8A96E" metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function DiamondShape({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#FAF3E0"
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

function BrandText() {
  return (
    <Center>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.8}
        height={0.15}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelSegments={5}
      >
        L
        <meshStandardMaterial color="#C8A96E" metalness={0.8} roughness={0.2} />
      </Text3D>
    </Center>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#C8A96E" />
      <Environment preset="studio" />
      <GoldRing position={[-2.5, 0.5, 0]} scale={0.7} />
      <GoldRing position={[2.5, -0.5, 0]} scale={0.5} />
      <DiamondShape position={[-1, -1, 1]} />
      <DiamondShape position={[1.5, 1, -1]} />
      <BrandText />
    </>
  );
}

export default function ThreeDSection() {
  return (
    <section className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
              The Experience
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
              Luxury in Every
              <br />
              <span className="text-gradient-gold italic">Detail</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              Every Laoban piece is crafted with meticulous attention to detail.
              From hand-selected fabrics to precision tailoring, we believe luxury
              should be felt, not just seen.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { number: "500+", label: "Styles" },
                { number: "50K+", label: "Happy Customers" },
                { number: "4.8★", label: "Avg Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-gold font-display text-2xl md:text-3xl">
                    {stat.number}
                  </p>
                  <p className="text-white/40 text-xs tracking-wider uppercase mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" className="h-[400px] md:h-[500px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Scene />
            </Canvas>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
