'use client'
import * as THREE from "three"
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { div } from "three/tsl";

import EarthMesh from "./components/EarthMesh";
import Starfield from "./components/Starfield";
import TempDisplay from "./components/TempDisplay";

export default function Home() {
  return (
    <>
      <div className="absolute h-full w-full"> 
        <Canvas gl={{ toneMapping: THREE.NoToneMapping }} camera={{position: [0,0,12], fov:70}}>
          <EarthMesh />
          <hemisphereLight args={[0xffffff, 0x000000]} />
          <Starfield />
        </Canvas>
      </div>
      <TempDisplay />
    </>
  );
}
