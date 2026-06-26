// @ts-nocheck
"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
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

function BrandMark() {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group rotation={[0, 0, 0.08]} scale={4.6}>
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.22, 1.7, 0.18]} />
          <meshStandardMaterial color="#C8A96E" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.25, -0.74, 0]}>
          <boxGeometry args={[1.0, 0.22, 0.18]} />
          <meshStandardMaterial color="#C8A96E" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#C8A96E" />
      <Environment preset="studio" />
      <GoldRing position={[-3.6, 0.75, -0.2]} scale={0.9} />
      <GoldRing position={[3.5, -0.75, -0.2]} scale={0.7} />
      <DiamondShape position={[-2.1, -1.8, 1]} />
      <DiamondShape position={[2.35, 1.75, -1]} />
      <BrandMark />
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

          <AnimatedSection direction="right" className="h-[82vh] min-h-[620px] md:min-h-[780px]">
            <Canvas camera={{ position: [0, 0, 7], fov: 38 }}>
              <Scene />
            </Canvas>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
