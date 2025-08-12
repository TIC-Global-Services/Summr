'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Environment, OrbitControls } from '@react-three/drei';

const Model = () => {
  const { scene } = useGLTF('/Summr_Stick-360.glb');
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
};

const Product = () => {
  return (
    <div className="w-[750px] h-[750px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 700 }}
      >
        <ambientLight intensity={2} color="#FFFFFF" />
        <Environment preset="forest" />
        <Model />
        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enableZoom={false}
          enablePan={false}
          enableRotate={true} // Allow manual rotation
          minPolarAngle={Math.PI / 2} // Lock vertical angle
          maxPolarAngle={Math.PI / 2} // Lock vertical angle
        />
      </Canvas>
    </div>
  );
};

export default Product;
