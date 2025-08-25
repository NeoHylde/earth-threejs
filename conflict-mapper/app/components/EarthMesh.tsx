'use client'
import React from "react";
import * as THREE from "three"
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import PinMesh from "./PinMesh";
import { degToRad } from "three/src/math/MathUtils.js";

const SPIN_RATE = 0.3;
const RADIUS = 4;

function latLonToCartesian(latDeg: number, lonDeg: number, r = RADIUS + 0.15) {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);
  const x = r * Math.cos(lat) * Math.cos(lon);
  const y = r * Math.sin(lat);
  const z = -r * Math.cos(lat) * Math.sin(lon);
  return [x, y, z] as [number, number, number];
}

export default function EarthMesh() {
    const earthGroupRef = React.useRef<Mesh>(null!);
    const map = useLoader(THREE.TextureLoader, "./textures/earth-daymap-4k.jpg")

    const vanPin = latLonToCartesian(49.28, -123.12);
    const copPin = latLonToCartesian(55.67, 12.57);
    const zeroPin = latLonToCartesian(0,0);

    useFrame((_, delta) => {
    earthGroupRef.current.rotation.y += SPIN_RATE * delta;
    earthGroupRef.current.rotation.x = 0.3;
    });

    return (
            <group ref={earthGroupRef}>
                <mesh rotation={[0, degToRad(180), 0]}>
                    <icosahedronGeometry args={[RADIUS, 5]} />
                    <meshStandardMaterial map={map} />
                </mesh>
                <PinMesh position={vanPin} />
                <PinMesh position={copPin} />
                <PinMesh position={zeroPin} />
            </group>
    );
};
