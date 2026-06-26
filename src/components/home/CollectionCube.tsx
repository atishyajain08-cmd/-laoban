// @ts-nocheck
"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Four basic white tees — one per cube in the row.
const TEES = [
  { slug: "laoban-classic-white-crew-tee", name: "Classic White", price: 999 },
  { slug: "laoban-regular-fit-white-tee", name: "Regular White", price: 1099 },
  { slug: "laoban-oversized-white-tee", name: "Oversized White", price: 1199 },
  { slug: "laoban-premium-heavyweight-white-tee", name: "Heavyweight White", price: 1399 },
];

function drawTee(ctx) {
  ctx.fillStyle = "#fbfaf6";
  ctx.beginPath();
  ctx.moveTo(150, 210);
  ctx.lineTo(212, 168);
  ctx.lineTo(232, 182);
  ctx.quadraticCurveTo(256, 206, 280, 182);
  ctx.lineTo(300, 168);
  ctx.lineTo(362, 210);
  ctx.lineTo(342, 256);
  ctx.lineTo(312, 236);
  ctx.lineTo(308, 350);
  ctx.lineTo(204, 350);
  ctx.lineTo(200, 236);
  ctx.lineTo(170, 256);
  ctx.closePath();
  ctx.fill();
}

function makeTexture(name, price, rotated) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f3ead8";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(166,139,75,0.35)";
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, size - 44, size - 44);

  ctx.textAlign = "center";
  ctx.fillStyle = "#a68b4b";
  ctx.font = "600 22px Georgia, serif";
  try { ctx.letterSpacing = "8px"; } catch {}
  ctx.fillText("LAOBAN", size / 2 + 4, 74);
  try { ctx.letterSpacing = "0px"; } catch {}

  drawTee(ctx);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "600 32px Georgia, serif";
  ctx.fillText(name, size / 2, 404);

  ctx.fillStyle = "#a68b4b";
  ctx.font = "600 28px Arial, sans-serif";
  ctx.fillText("₹" + price.toLocaleString("en-IN"), size / 2, 446);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (rotated) {
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI; // upright when the back face faces the camera
  }
  return tex;
}

function TeeCube({ x, s, front, back, slug, onSelect }) {
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
      {/* +X, -X, +Y, -Y = dark luxury edges ; +Z front tee ; -Z back tee */}
      <meshBasicMaterial attach="material-0" color="#0f0f0f" />
      <meshBasicMaterial attach="material-1" color="#0f0f0f" />
      <meshBasicMaterial attach="material-2" color="#141414" />
      <meshBasicMaterial attach="material-3" color="#141414" />
      <meshBasicMaterial attach="material-4" map={front} toneMapped={false} />
      <meshBasicMaterial attach="material-5" map={back} toneMapped={false} />
    </mesh>
  );
}

function Row({ data, onSelect }) {
  const group = useRef(null);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.x += delta * 0.5; // tumble upward
  });

  const s = 2.45;
  const spacing = 2.8; // visible separation line while still filling the screen
  return (
    <group ref={group}>
      {data.map((d, i) => (
        <TeeCube key={d.slug} x={(i - 1.5) * spacing} s={s} front={d.front} back={d.back} slug={d.slug} onSelect={onSelect} />
      ))}
    </group>
  );
}

export default function CollectionCube() {
  const router = useRouter();
  const data = useMemo(
    () => TEES.map((t) => ({ slug: t.slug, front: makeTexture(t.name, t.price, false), back: makeTexture(t.name, t.price, true) })),
    []
  );
  const onSelect = (slug) => router.push(`/shop/product/${slug}`);

  return (
    <section className="relative min-h-screen bg-warm-white text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(200,169,110,0.22),transparent_34%),linear-gradient(180deg,#fffaf0_0%,#f0e4cf_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 sm:px-6">
        <AnimatedSection className="pb-2 pt-14 md:pt-20">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The Collection</p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            Our <span className="text-gradient-gold italic">White Tees</span>
          </h2>
          <p className="text-warm-gray text-sm mt-4 max-w-md mx-auto">Tap a block to shop the piece.</p>
        </AnimatedSection>
        <div className="relative -mx-8 flex-1 min-h-[72vh] md:-mx-16">
          <Canvas camera={{ position: [0, 1.1, 9.2], fov: 43 }} dpr={[1, 2]}>
            <Row data={data} onSelect={onSelect} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
