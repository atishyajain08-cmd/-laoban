import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Gold "L" monogram medallion drawn to a CanvasTexture (Latin glyphs, no
// special font needed; redrawn once Playfair is ready for the serif "L").
function useMedallionTexture() {
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
      // charcoal ground
      ctx.fillStyle = '#211f1c';
      ctx.fillRect(0, 0, size, size);
      // gold keyline
      ctx.strokeStyle = 'rgba(200,169,110,.55)';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, size - 80, size - 80);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // serif "L"
      ctx.fillStyle = '#d8be83';
      ctx.font = '600 280px "Playfair Display", Georgia, serif';
      ctx.fillText('L', size / 2, size * 0.44);
      // wordmark
      ctx.fillStyle = '#c8a96e';
      ctx.font = '600 40px "Inter", system-ui, sans-serif';
      ctx.letterSpacing = '14px';
      ctx.fillText('LAOBAN', size / 2 + 7, size * 0.78);
      ctx.font = '500 22px "Inter", system-ui, sans-serif';
      ctx.letterSpacing = '8px';
      ctx.fillStyle = 'rgba(200,169,110,.7)';
      ctx.fillText('EST. INDIA', size / 2 + 4, size * 0.87);
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
  const tex = useMedallionTexture();

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    const t = reduced ? 0 : clock.elapsedTime;
    ref.current.rotation.y += (pointer.x * 0.22 + Math.sin(t * 0.25) * 0.18 - ref.current.rotation.y) * 0.035;
    ref.current.rotation.x += (pointer.y * -0.12 + 0.06 - ref.current.rotation.x) * 0.035;
    ref.current.position.y = reduced ? 0 : Math.sin(t * 0.45) * 0.08;
  });

  return (
    <group ref={ref}>
      {/* charcoal medallion body */}
      <RoundedBox args={[1.5, 1.5, 0.34]} radius={0.07} smoothness={5}>
        <meshStandardMaterial color="#2a2824" roughness={0.5} metalness={0.3} />
      </RoundedBox>
      {/* monogram faces, front + back */}
      <mesh position={[0, 0, 0.172]}>
        <planeGeometry args={[1.42, 1.42]} />
        <meshStandardMaterial map={tex} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.172]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.42, 1.42]} />
        <meshStandardMaterial map={tex} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* gold rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.02, 16, 96]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.28} metalness={0.85} />
      </mesh>
    </group>
  );
}
