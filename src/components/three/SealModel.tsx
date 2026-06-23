import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Draw 老板 (gold) onto a cinnabar ground as a CanvasTexture. drei's <Text>
// can't render CJK without a bundled glyph file, so we paint to a canvas
// instead. The two glyphs are preloaded in index.html (Noto Serif SC subset),
// so we redraw once document.fonts is ready.
function useSealTexture() {
  const [texture] = useState(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      // cinnabar ground
      ctx.fillStyle = '#b5372b';
      ctx.fillRect(0, 0, size, size);
      // inset gold keyline
      ctx.strokeStyle = 'rgba(197,165,90,.5)';
      ctx.lineWidth = 9;
      ctx.strokeRect(36, 36, size - 72, size - 72);
      // 老板, stacked, gold
      ctx.fillStyle = '#e8cf86';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 205px "Noto Serif SC","Songti SC","STSong","SimSun",serif';
      ctx.fillText('老', size / 2, size * 0.31);
      ctx.fillText('板', size / 2, size * 0.71);
      tex.needsUpdate = true;
    };

    draw();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(draw);
    }
    return tex;
  });
  return texture;
}

export default function SealModel() {
  const ref = useRef<THREE.Group>(null);
  const reduced = useMemo(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const tex = useSealTexture();

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    ref.current.rotation.y += (pointer.x * 0.22 + Math.sin(t * 0.25) * 0.18 - ref.current.rotation.y) * 0.035;
    ref.current.rotation.x += (pointer.y * -0.12 + 0.08 - ref.current.rotation.x) * 0.035;
    ref.current.position.y = reduced ? 0 : Math.sin(t * 0.45) * 0.08;
  });

  return (
    <group ref={ref}>
      {/* cinnabar lacquer body */}
      <RoundedBox args={[1.2, 1.7, 0.42]} radius={0.06} smoothness={5}>
        <meshStandardMaterial color="#7e241b" roughness={0.45} metalness={0.2} />
      </RoundedBox>
      {/* 老板 faces, front + back */}
      <mesh position={[0, 0, 0.214]}>
        <planeGeometry args={[1.14, 1.62]} />
        <meshStandardMaterial map={tex} roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0, -0.214]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.14, 1.62]} />
        <meshStandardMaterial map={tex} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* gold rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.16, 0.022, 16, 96]} />
        <meshStandardMaterial color="#c5a55a" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
