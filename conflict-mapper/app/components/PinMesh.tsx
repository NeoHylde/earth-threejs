'use client'
import React from "react";
import * as THREE from "three"
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import { group } from "console";
import { radToDeg } from "three/src/math/MathUtils.js";

export default function PinMesh() {
    const ref1 = React.useRef<Mesh>(null!);
    const ref2 = React.useRef<Mesh>(null!);

    return (
         <group>
            <mesh ref={ref1} position={[0, 0, 0]}>
                <icosahedronGeometry args={[2, 5]} />
                <meshStandardMaterial color="#FF0000" />
            </mesh>

            <mesh ref={ref2} position={[0, -2, 0]} rotation={[radToDeg(180), 0 ,0]}>
                <coneGeometry args={[1, 4, 20]}/>
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
        </group>
    );
};
