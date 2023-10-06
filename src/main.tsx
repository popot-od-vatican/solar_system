import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {Star, Planet} from './planets';
import './textures';
import { earthClouds, earthTexture, ganymedeTexture, jupiterTexture, marsTexture, mercuryTexture, moonTexture, neptunTexture, plutoTexture, saturnRingTexture, saturnTexture, sunTexture, titanTexture, uranusRingTexture, uranusTexture, venusTexture } from './textures';
import {loadModel, spaceShip1, spaceShip2} from './models';

const renderer: any = new THREE.WebGLRenderer({
  antialias: true, canvas: document.getElementById('viewport') as HTMLCanvasElement
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const labelrenderer = new CSS2DRenderer();
labelrenderer.setSize( window.innerWidth, window.innerHeight );
labelrenderer.domElement.style.position = 'absolute';
labelrenderer.domElement.style.top = '0px';
labelrenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild( labelrenderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 40000);
let targetPlanet: any = null;

const listener = new THREE.AudioListener();

camera.add(listener);
camera.position.x = 100;
camera.position.y = 100;
camera.position.z = 200;
camera.lookAt(0, 0, 0);

new RGBELoader()
.load('./static/textures/background/starsbackground.hdr', function(texture){
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

const pointLight = new THREE.PointLight(0xFFFFFF, 1300.0, 3000.0, 1.2);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
controls.rotateSpeed = 1.25;
controls.keyPanSpeed = 15.0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();

function onPointerMove(event: PointerEvent)
{
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

const sunRadius = 30;
const planetScale = 17.5;
const distanceScale = 1.05;

const sunObj: Star = new Star(scene, sunRadius, 70, 70, sunTexture, 'Sun', 'white', [0.0, 0.0, 0.0], [0.0, 0.02, 0.0], [0, 0.01, 0.0], 'star-label');
const mercuryObj = new Planet(scene, sunObj, 1.2, 50, 50, mercuryTexture, 'Mercury', 'red', [70, 0, 0], [0, 0.005, 0], [0.00, 0.00609, 0]);
const venusObj = new Planet(scene, sunObj, 3.5, 50, 50, venusTexture, 'Venus', 'green', [130, 0, 0], [0, 0.01, 0], [0, 0.0037, 0]);
const earthObj = new Planet(scene, sunObj, 4.0, 50, 50, earthTexture, 'Earth', 'brown', [200, 0, 0], [0, 0.012, 0], [0, 0.00065, 0]);
const moonObj = new Planet(scene, earthObj, 1.5, 50, 50, moonTexture, 'Moon', 'grey', [10, 2.5, 0], [0, 0.0001100001, 0], [0.0, 0.0020000118, 0], 'satellite-label');
const marsObj = new Planet(scene, sunObj, 3.6, 50, 50, marsTexture, 'Mars', 'lightblue', [250, 0, 0], [0, 0.006, 0], [0, 0.00055, 0]);
const jupiterObj = new Planet(scene, sunObj, 9.5, 50, 50, jupiterTexture, 'Jupiter', 'Orange', [320, 0, 0], [0, 0.00095, 0], [0, 0.00008, 0]);
const ganymedeObj = new Planet(scene, jupiterObj, 3.1, 50, 50, ganymedeTexture, 'Ganymede', 'teal', [23, 2.5, 0], [0.0, 0.001, 0], [0, 0.01, 0], 'satellite-label');
const saturnObj = new Planet(scene, sunObj, 9.0, 50, 50, saturnTexture, 'Saturn', 'purple', [390, 0, 0], [0, 0.001, 0], [0, 0.0002, 0]);
saturnObj.addRing(10, 20, 32, [-1.07, 0, 0], saturnRingTexture);
const titanObj = new Planet(scene, saturnObj, 2.1, 50, 50, titanTexture, 'Titan', 'maroon', [21, 2.0, 0], [0.0, 0.003, 0], [0, 0.003, 0], 'satellite-label');
const uranusObj = new Planet(scene, sunObj, 2.6, 50, 50, uranusTexture, 'Uranus', 'brown', [470, 0, 0], [0, 0.0001, 0], [0, 0.000042, 0]);
uranusObj.addRing(17, 24, 32, [0.7, 0, 0], uranusRingTexture);
const neptunObj = new Planet(scene, sunObj, 1.6, 50, 50, neptunTexture, 'Neptun', 'aqua', [560, 0, 0], [0, 0.001, 0], [0, 0.000011, 0]);
// I know its not a planet
const plutoObj = new Planet(scene, sunObj, 0.5, 50, 50, plutoTexture, 'Pluto', 'silver', [690, 0, 0], [0, 0.01, 0], [0, 0.000021, 0]);
//renderer.toneMapping = THREE.ACESFilmicToneMapping;

earthObj.addClouds(earthClouds, [0.0012, 0.013, 0.0016]);
await loadModel();
scene.add(spaceShip1.object);
//spaceShip1.object.position.set(100, 0, 0);
spaceShip1.setTargetBase(mercuryObj);
spaceShip1.setStartingBase(earthObj);
//spaceShip1.object.lookAt(190, 0, 0);
spaceShip1.startJourney();
// BAZI
mercuryObj.addBase('teal', [0, mercuryObj.radius-0.14, 0]);
venusObj.addBase('brown', [0.0, venusObj.radius-0.14, 1.00]);
earthObj.addBase('lightblue', [earthObj.radius-0.1, 0.0, 0.0]);
marsObj.addBase('lightblue', [0, marsObj.radius/2 - 1.0, 3.4]);
jupiterObj.addBase('brown', [0, jupiterObj.radius/2 - 1.0, 8.5]);
saturnObj.addBase('brown', [0, saturnObj.radius/2 - 1.0, 8.4]);
uranusObj.addBase('red', [0, uranusObj.radius/2 - 1.0, 2.4]);
neptunObj.addBase('red', [0, neptunObj.radius/2 - 1.0, 1.4]);

function clickedObject(event: Event): void
{
  const intersects = raycaster.intersectObjects(scene.children);

  if(intersects.length == 0)
    return;

  for(let i = 0; i < intersects.length; ++i)
  {
    if(intersects[i].object instanceof THREE.Mesh)
    {
      // za da se fokusira kamerata na selektiraniot object
      const cor = new THREE.Vector3();
      intersects[i].object.getWorldPosition(cor);
      const oldTargetPosition = controls.target.clone();
      controls.target = cor;
      camera.position.sub(oldTargetPosition.sub(controls.target));
      targetPlanet = intersects[i].object;

      console.log(cor);
      // TOMIIIIIIIIIIII
      console.log(intersects[i].object.name);
      // intersects[i].object.userData => object od Planet ili Star
      console.log(intersects[i].object.userData);
      console.log(typeof intersects);
      // Ostaj
      // Ako go trgnes returnot i raycastot pominuva preku povekje planeti ke bidat registrirani kako da si kliknal na povekje planeti vo isto vreme
      return;
    }
  }
}

function updateRendererSize(event: Event): void
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelrenderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = renderer.domElement.width / renderer.domElement.height;
  camera.updateProjectionMatrix();
}


window.addEventListener('resize', updateRendererSize);
window.addEventListener( 'pointermove', onPointerMove );
document.addEventListener('click', clickedObject);

function animate(): void {
	requestAnimationFrame( animate );
  raycaster.setFromCamera(pointer, camera);

  if(targetPlanet !== null)
  {
    const targetPlanetNewPosition = new THREE.Vector3();
    targetPlanet.getWorldPosition(targetPlanetNewPosition);
    camera.lookAt(targetPlanetNewPosition);
    const oldTargetPosition = controls.target.clone();
    controls.target = targetPlanetNewPosition;
    camera.position.sub(oldTargetPosition.sub(controls.target));
  }

  sunObj.update();

  mercuryObj.update();
  mercuryObj.updateBaseLabelVisibility(camera);
  mercuryObj.updateSatellitesLabelVisibility(camera);
  mercuryObj.updateSelfLabelVisibility(camera);

  venusObj.update();
  venusObj.updateBaseLabelVisibility(camera);
  venusObj.updateSatellitesLabelVisibility(camera);
  venusObj.updateSelfLabelVisibility(camera);

  earthObj.update();
  earthObj.updateBaseLabelVisibility(camera);
  earthObj.updateSatellitesLabelVisibility(camera);
  earthObj.updateSelfLabelVisibility(camera);
  moonObj.update();

  marsObj.update();
  marsObj.updateBaseLabelVisibility(camera);
  marsObj.updateSatellitesLabelVisibility(camera);
  marsObj.updateSelfLabelVisibility(camera);

  jupiterObj.update();
  jupiterObj.updateBaseLabelVisibility(camera);
  jupiterObj.updateSatellitesLabelVisibility(camera);
  jupiterObj.updateSelfLabelVisibility(camera);
  ganymedeObj.update();

  saturnObj.update();
  saturnObj.updateBaseLabelVisibility(camera);
  saturnObj.updateSatellitesLabelVisibility(camera);
  saturnObj.updateSelfLabelVisibility(camera);
  titanObj.update();

  uranusObj.update();
  uranusObj.updateBaseLabelVisibility(camera);
  uranusObj.updateSatellitesLabelVisibility(camera);
  uranusObj.updateSelfLabelVisibility(camera);

  neptunObj.update();
  neptunObj.updateBaseLabelVisibility(camera);
  neptunObj.updateSatellitesLabelVisibility(camera);
  neptunObj.updateSelfLabelVisibility(camera);

  plutoObj.update();
  plutoObj.updateBaseLabelVisibility(camera);
  plutoObj.updateSatellitesLabelVisibility(camera);
  plutoObj.updateSelfLabelVisibility(camera);

  spaceShip1.update();

  const delta = clock.getDelta();
  controls.update(delta);

	renderer.render( scene, camera );
  labelrenderer.render(scene, camera);
}


animate();