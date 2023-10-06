import * as THREE from 'three';

const textureLoader: any = new THREE.TextureLoader();

export const sunTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./static/textures/stars/sun.jpg'),
});

export const earthTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/earthMap.jpg'),
    bumpMap: textureLoader.load('./static/textures/planets/earthBumpMap.png'),
    bumpScale: 0.03,
});

export const mercuryTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/mercury.jpg'),
});

export const venusTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/venus.jpg'),
});

export const marsTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/mars.png'),
});

export const jupiterTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/jupiter.jpg'),
});

export const saturnTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/saturn.jpg'),
});

export const neptunTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/neptun.jpg'),
});

export const uranusTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/uranus.png'),
});

export const saturnRingTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./static/textures/rings/saturnRing.png'),
    transparent: true,
});

export const uranusRingTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./static/textures/rings/uranusRing.png'),
    transparent: true,
});

export const moonTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/satellites/moon.jfif'),
});

export const titanTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/satellites/titan.jfif'),
});

export const ganymedeTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/satellites/ganymede.jpg'),
});

export const plutoTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/satellites/pluto.jpg'),
});

export const earthClouds = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./static/textures/planets/earthClouds.png'),
    transparent: true,
});