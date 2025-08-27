'use client'
import * as THREE from "three"
import Image from "next/image";
import { Canvas } from "@react-three/fiber";

import EarthMesh from "./components/EarthMesh";
import Starfield from "./components/Starfield";
import RSSPipeline from "./components/RSSPipeline";

export default function Home() {
  const clusters = RSSPipeline();


  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1"> 
        <Canvas
          gl={{ toneMapping: THREE.NoToneMapping }}
          camera={{ position: [0, 0, 12], fov: 70 }}
        >
          <EarthMesh />
          <hemisphereLight args={[0xffffff, 0x000000]} />
          <Starfield />
        </Canvas>
      </div>
      {clusters && (
        <pre className="bg-white text-xs">{JSON.stringify(clusters, null, 2)}</pre>
      )}
    </div>
  );
}