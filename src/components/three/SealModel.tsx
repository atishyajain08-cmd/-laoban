import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The Laoban seal — a floating cinnabar "chop" engraved with 老板 (the brand's
 * Chinese name). The characters are drawn to a 2D canvas and used as a texture,
 * so CJK glyphs render reliably across devices (no font-file parsing in WebGL).
 * A subset of Noto Serif SC (just 老板) is loaded in index.html; we redraw once
 * web fonts are ready so the characters look crisp.
 */
function useSealTexture() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = '#FAFAF5';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font =
        '700 190px "Noto Serif SC", "Songti SC", "STSong", "SimSun", "PingFang SC", serif';
      // Two stacked characters: 老 over 板
      ctx.fillText('老', size / 2, size * 0.3);
      ctx.fillText('板', size / 2, size * 0.72);
      tex.needsUpdate = true;
    };

    draw();
    // Redraw once the web font has loaded so the glyphs aren't a fallback face.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(draw).catch(() => {});
    }

    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

export default function SealModel() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const sealTexture = useSealTexture();

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;

    if (reducedMotion) {
      // Hold a gentle static three-quarter pose; no idle motion.
      groupRef.current.rotation.y = -0.25;
      groupRef.current.rotation.x = 0.08;
      return;
    }

    mouse.current.x += (pointer.x * 0.3 - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y * 0.2 - mouse.current.y) * 0.05;

    groupRef.current.rotation.y =
      mouse.current.x + Math.sin(clock.elapsedTime * 0.3) * 0.15;
    groupRef.current.rotation.x =
      -mouse.current.y + Math.sin(clock.elapsedTime * 0.2) * 0.05;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.6, 1.6, 0.5]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#C4392F" roughness={0.65} metalness={0.15} />
      </RoundedBox>

      {/* Front engraved face — 老板 in ivory */}
      <mesh position={[0, 0, 0.251]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial
          map={sealTexture}
          transparent
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Back face — same mark, mirrored */}
      <mesh position={[0, 0, -0.251]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial map={sealTexture} transparent roughness={0.5} />
      </mesh>
    </group>
  );
}
