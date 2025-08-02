import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

function latLonToVector3(lat, lon, radius = 1.01) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

function addPin(lat, lon) {
  const geometry = new THREE.ConeGeometry(0.01, 0.06, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const pin = new THREE.Mesh(geometry, material);
  pin.position.copy(latLonToVector3(lat, lon, 1.01));
  pin.lookAt(new THREE.Vector3(0, 2, 0));
  pin.rotateX(Math.PI);
  earthGroup.add(pin);
  pins.push(pin);
}

export const countryCoordinates = {
  "israel": { lat: 32.0, lon: -34.5 },
  "ukraine": { lat: 50.0, lon: -30.0 },
  "russia": { lat: 55.75, lon: -37.62 },
  "united states": { lat: 38.9, lon: 77.0 },
  "china": { lat: 39.9, lon: -116.4 },
  "iran": { lat: 35.7, lon: -51.4 },
  "north korea": { lat: 39.0, lon: -125.7 },
  "gaza": { lat: 31.5, lon: -34.47 },
  "syria": { lat: 33.5, lon: -36.3 },
  "iraq": { lat: 33.3, lon: -44.4 },
  "afghanistan": { lat: 34.5, lon: -69.2 },
  "yemen": { lat: 15.4, lon: -44.2 },
  "sudan": { lat: 15.6, lon: -32.5 },
  "ethiopia": { lat: 9.0, lon: -38.7 },
  "nigeria": { lat: 9.1, lon: -7.5 },
  "pakistan": { lat: 33.7, lon: -73.0 }
};

const pins = [];

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

Object.entries(countryCoordinates).forEach(([country, { lat, lon }]) => {
  addPin(lat, lon);
});

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  earthGroup.rotation.y += 0.0005;
  cloudsMesh.rotation.y += 0.00115 / 2;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

