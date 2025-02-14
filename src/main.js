import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


// initialize the scene
const scene = new THREE.Scene();

// add textureLoader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/Solar_System/')

// adding textures
const sunTexture = textureLoader.load("2k_sun.jpg");
sunTexture.colorSpace = THREE.SRGBColorSpace  
const mercuryTexture = textureLoader.load("2k_mercury.jpg");
mercuryTexture.colorSpace = THREE.SRGBColorSpace
const venusTexture = textureLoader.load("2k_venus_surface.jpg");
venusTexture.colorSpace = THREE.SRGBColorSpace
const earthTexture = textureLoader.load("2k_earth_daymap.jpg");
earthTexture.colorSpace = THREE.SRGBColorSpace
const marsTexture = textureLoader.load("2k_mars.jpg");
marsTexture.colorSpace = THREE.SRGBColorSpace
const moonTexture = textureLoader.load("2k_moon.jpg");
moonTexture.colorSpace = THREE.SRGBColorSpace
const jupiterTexture = textureLoader.load("2k_jupiter.jpg");
jupiterTexture.colorSpace = THREE.SRGBColorSpace
const saturnTexture = textureLoader.load("2k_saturn.jpg");
saturnTexture.colorSpace = THREE.SRGBColorSpace
const uranusTexture = textureLoader.load("2k_uranus.jpg");
uranusTexture.colorSpace = THREE.SRGBColorSpace
const neptuneTexture = textureLoader.load("2k_neptune.jpg");
neptuneTexture.colorSpace = THREE.SRGBColorSpace
const plutoTexture = textureLoader.load("2k_pluto.jpg");
plutoTexture.colorSpace = THREE.SRGBColorSpace


const backgroundCubemap = cubeTextureLoader
.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] );

scene.background = backgroundCubemap

// add materials
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});
const jupiterMaterial = new THREE.MeshStandardMaterial({
    map: jupiterTexture,
});
const saturnMaterial = new THREE.MeshStandardMaterial({
    map: saturnTexture,
});
const uranusMaterial = new THREE.MeshStandardMaterial({
    map: uranusTexture,
});
const neptuneMaterial = new THREE.MeshStandardMaterial({
    map: neptuneTexture,
});


// add meshes
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  {
    name: "Mercury",
    radius: 0.9,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 1.2,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1.4,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 2,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 1.1,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 1.5,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 2,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 2,
    distance: 30,
    speed: 0.002,
    material: jupiterMaterial,
    moons: [],
  },
  {
    name: "Saturn",
    radius: 1.8,
    distance: 35,
    speed: 0.0015,
    material: saturnMaterial,
    moons: [],
  },
  {
    name: "Uranus",
    radius: 1.6,
    distance: 40,
    speed: 0.0010,
    material: uranusMaterial,
    moons: [],
  },
  {
    name: "Neptune",
    radius: 1.5,
    distance: 45,
    speed: 0.0009,
    material: neptuneMaterial,
    moons: [],
  },
  
];

const createPlanet = (planet) => {
    const planetMesh = new THREE.Mesh(
      sphereGeometry,
      planet.material
    );
    planetMesh.scale.setScalar(planet.radius);
    planetMesh.position.x = planet.distance;
  
    // Check if the planet is Saturn, then add rings
    if (planet.name === "Saturn") {
      const ringGeometry = new THREE.RingGeometry(1.5, 2, 32);
      const ringMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load("2k_saturn_ring_alpha.png"), 
        side: THREE.DoubleSide,
        transparent: true,
      });
  
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2.2; 
  
      planetMesh.add(ringMesh); 
    }
  
    return planetMesh;
  };
  

const createMoon = (moon) =>{
  const moonMesh = new THREE.Mesh(
    sphereGeometry,
    moonMaterial
  )
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance
  return moonMesh
}


const planetMeshes = planets.map((planet) =>{
  const planetMesh = createPlanet(planet)
  scene.add(planetMesh)

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon)
    planetMesh.add(moonMesh)
  })
  return planetMesh
})


const createOrbit = (planet) => {
    const orbitPoints = [];
    const segments = 100; 
    const radius = planet.distance;
  
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
  
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true, 
        opacity: 0.1,      
      });
      
  
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
  };
  
  // Call this function for each planet
  planets.forEach(createOrbit);
  

// add lights
const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.3
)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(
  0xffffff,
  1000
)
scene.add(pointLight)
 
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 80;
camera.position.y = 50;
camera.position.x = 50;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;
controls.target = new THREE.Vector3(0, -10, 0);

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1;
// render loop
const renderloop = () => {
    planetMeshes.forEach((planet, planetIndex) => {
      planet.rotation.y += planets[planetIndex].speed;
      planet.position.x = Math.sin(planet.rotation.y) * planets[planetIndex].distance;
      planet.position.z = Math.cos(planet.rotation.y) * planets[planetIndex].distance;
  
      
      if (planets[planetIndex].moons && planets[planetIndex].moons.length > 0) {
        planet.children.forEach((moon, moonIndex) => {
          if (planets[planetIndex].moons[moonIndex]) { // Ensure the moon exists
            moon.rotation.y += planets[planetIndex].moons[moonIndex].speed;
            moon.position.x = Math.sin(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
            moon.position.z = Math.cos(moon.rotation.y) * planets[planetIndex].moons[moonIndex].distance;
          }
        });
      }
    });
  
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderloop);
  };
  

renderloop();