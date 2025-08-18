'use client'
import React from "react";
import * as THREE from "three"
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";

export default function EarthMesh() {
    const ref = React.useRef<Mesh>(null!);
    const map = useLoader(THREE.TextureLoader, "./textures/earth-daymap-4k.jpg")

    useFrame(() => {
        ref.current.rotation.x += 0.00;
        ref.current.rotation.y += 0.01;
    });
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[4, 5]}/>
            <meshStandardMaterial map={map}/>
        </mesh>
    );
};
