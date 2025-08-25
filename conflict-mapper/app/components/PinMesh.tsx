'use client'
import React from "react";
import * as THREE from "three"
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import { group } from "console";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { PI } from "three/tsl";

type PinMeshProps = {
    position?: [number, number, number];
}

export default function PinMesh({position = [0,0,0]}: PinMeshProps) {
    const groupRef = React.useRef<THREE.Group>(null!);
    const refHead = React.useRef<Mesh>(null!);
    const refCone = React.useRef<Mesh>(null!);
    

    React.useLayoutEffect(() => {
        const p = new THREE.Vector3(...position);
        if(p.lengthSq() === 0) return;
        const inward = p.clone().normalize().multiplyScalar(-1);
        const from = new THREE.Vector3(0, -1, 0);
        const q = new THREE.Quaternion().setFromUnitVectors(from, inward);
        groupRef.current.quaternion.copy(q);
    }, [position]);

    return (
         <group ref={groupRef} position={position} scale={[0.05, 0.05, 0.05]} rotation={[degToRad(180),0,0]}>
            <mesh ref={refHead} position={[0, 0, 0]}>
                <icosahedronGeometry args={[2, 5]} />
                <meshStandardMaterial color="#FF0000" />
            </mesh>

            <mesh ref={refCone} position={[0, -2, 0]} rotation={[0, 0 , degToRad(180)]}>
                <coneGeometry args={[1, 4, 20]}/>
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
        </group>
    );
};
