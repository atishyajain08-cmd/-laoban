import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

const SealModel = lazy(() => import('./SealModel'));

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, 4]} intensity={0.4} color="#C5A55A" />
        <pointLight position={[0, -2, 3]} intensity={0.3} color="#C4392F" />
        <SealModel />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}
