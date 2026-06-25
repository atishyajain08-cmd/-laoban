// @ts-nocheck
"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Four basic black tees from the catalog — one per side of the cube.
const TEES = [
  { slug: "noir-essential-crew-tee", name: "Noir Essential Crew", price: 1299 },
  { slug: "midnight-v-neck-tee", name: "Midnight V-Neck", price: 1499 },
  { slug: "shadow-oversized-tee", name: "Shadow Oversized", price: 1799 },
  { slug: "obsidian-boxy-tee", name: "Obsidian Boxy", price: 1199 },
];

function drawTee(ctx) {
  ctx.fillStyle = "#161616";
  ctx.beginPath();
  ctx.moveTo(150, 210); // left sleeve tip (top)
  ctx.lineTo(212, 168); // left shoulder
  ctx.lineTo(232, 182); // neck left
  ctx.quadraticCurveTo(256, 206, 280, 182); // crew neckline
  ctx.lineTo(300, 168); // right shoulder
  ctx.lineTo(362, 210); // right sleeve tip (top)
  ctx.lineTo(342, 256); // right sleeve tip (bottom)
  ctx.lineTo(312, 236); // right armpit
  ctx.lineTo(308, 350); // body bottom right
  ctx.lineTo(204, 350); // body bottom left
  ctx.lineTo(200, 236); // left armpit
  ctx.lineTo(170, 256); // left sleeve tip (bottom)
  ctx.closePath();
  ctx.fill();
}

function makeTexture(name, price) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#faf3e0"; // ivory card
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(26,26,26,0.16)";
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, size - 44, size - 44);

  ctx.textAlign = "center";
  ctx.fillStyle = "#a68b4b"; // gold eyebrow
  ctx.font = "600 22px Georgia, serif";
  try { ctx.letterSpacing = "8px"; } catch {}
  ctx.fillText("LAOBAN", size / 2 + 4, 74);
  try { ctx.letterSpacing = "0px"; } catch {}

  drawTee(ctx);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "600 33px Georgia, serif";
  ctx.fillText(name, size / 2, 404);

  ctx.fillStyle = "#a68b4b";
  ctx.font = "600 30px Arial, sans-serif";
  ctx.fillText("₹" + price.toLocaleString("en-IN"), size / 2, 448);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Cube({ onSelect, textures }) {
  const group = useRef(null);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += delta * 0.45;
  });

  const W = 2.4;
  const H = 2.9;
  const d = 1.21;
  const faces = [
    { pos: [0, 0, d], rot: [0, 0, 0] },
    { pos: [d, 0, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [0, 0, -d], rot: [0, Math.PI, 0] },
    { pos: [-d, 0, 0], rot: [0, -Math.PI / 2, 0] },
  ];

  return (
    <group ref={group} rotation={[0.16, reduced ? -0.5 : 0, 0]}>
      {/* solid charcoal body */}
      <mesh>
        <boxGeometry args={[2.38, 2.88, 2.38]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {/* four black-tee faces */}
      {faces.map((f, i) => (
        <mesh
          key={i}
          position={f.pos}
          rotation={f.rot}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(TEES[i].slug);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={textures[i]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function CollectionCube() {
  const router = useRouter();
  const textures = useMemo(() => TEES.map((t) => makeTexture(t.name, t.price)), []);
  const onSelect = (slug) => router.push(`/shop/product/${slug}`);

  return (
    <section className="py-20 md:py-28 bg-warm-white text-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="mb-6">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The Collection</p>
          <h2 className="font-display text-3xl md:text-5xl text-charcoal">
            Spin Through Our <span className="text-gradient-gold italic">Black Tees</span>
          </h2>
          <p className="text-warm-gray text-sm mt-4 max-w-md mx-auto">
            Tap any side of the cube to shop the piece.
          </p>
        </AnimatedSection>
        <div className="h-[420px] md:h-[520px]">
          <Canvas camera={{ position: [0, 0.6, 6.2], fov: 36 }} dpr={[1, 2]}>
            <Cube onSelect={onSelect} textures={textures} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
