// @ts-nocheck
"use client";
import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import AnimatedSection from "@/components/ui/AnimatedSection";

// One black tee per cube; clicks open existing product pages.
const TEES = [
  { slug: "laoban-classic-white-crew-tee" },
  { slug: "laoban-regular-fit-white-tee" },
  { slug: "laoban-oversized-white-tee" },
  { slug: "laoban-premium-heavyweight-white-tee" },
];

function drawTee(ctx) {
  ctx.fillStyle = "#141414"; // BLACK tee
  ctx.beginPath();
  ctx.moveTo(120, 200);
  ctx.lineTo(206, 150);
  ctx.lineTo(230, 166);
  ctx.quadraticCurveTo(256, 196, 282, 166);
  ctx.lineTo(306, 150);
  ctx.lineTo(392, 200);
  ctx.lineTo(366, 250);
  ctx.lineTo(322, 224);
  ctx.lineTo(318, 392);
  ctx.lineTo(194, 392);
  ctx.lineTo(190, 224);
  ctx.lineTo(146, 250);
  ctx.closePath();
  ctx.fill();
}

function makeTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  // light ivory card so the black tee pops (no dark/black faces)
  ctx.fillStyle = "#f4eedb";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(166,139,75,0.35)";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, size - 40, size - 40);

  drawTee(ctx);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function TeeCube({ x, s, tex, slug, onSelect }) {
  return (
    <mesh
      position={[x, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(slug);
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={[s, s, s]} />
      {/* one material = black tee on EVERY face, no dark patches */}
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Row({ tex, onSelect }) {
  const group = useRef(null);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.x += delta * 0.45; // tumble upward
  });

  const s = 3.6;
  const spacing = 3.85; // small gap = visible separation line; row still fills the width
  return (
    <group ref={group} rotation={[0, 0, 0]}>
      {TEES.map((t, i) => (
        <TeeCube key={t.slug} x={(i - 1.5) * spacing} s={s} tex={tex} slug={t.slug} onSelect={onSelect} />
      ))}
    </group>
  );
}

export default function CollectionCube() {
  const router = useRouter();
  const tex = useMemo(() => makeTexture(), []);
  const onSelect = (slug) => router.push(`/shop/product/${slug}`);

  return (
    <section className="relative bg-warm-white text-center overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(200,169,110,0.18),transparent_38%),linear-gradient(180deg,#fffaf0_0%,#f1e6d1_100%)]" />
      <div className="relative z-10 mx-auto max-w-[1700px] px-4 sm:px-6">
        <AnimatedSection className="mb-2">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The Collection</p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            Our <span className="text-gradient-gold italic">Black Tees</span>
          </h2>
          <p className="text-warm-gray text-sm mt-4 max-w-md mx-auto">Tap a block to shop the piece.</p>
        </AnimatedSection>
        <div className="-mx-4 md:-mx-12 h-[440px] md:h-[640px]">
          <Canvas camera={{ position: [0, 0.8, 10], fov: 40 }} dpr={[1, 2]}>
            <Row tex={tex} onSelect={onSelect} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
