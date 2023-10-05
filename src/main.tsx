import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import {Star, Planet} from './planets';


const renderer: any = new THREE.WebGLRenderer({
  antialias: true, canvas: document.getElementById('viewport') as HTMLCanvasElement
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);

const labelrenderer = new CSS2DRenderer();
labelrenderer.setSize( window.innerWidth, window.innerHeight );
labelrenderer.domElement.style.position = 'absolute';
labelrenderer.domElement.style.top = '0px';
labelrenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild( labelrenderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 40000);

const listener = new THREE.AudioListener();

camera.add(listener);
camera.position.x = 100;
camera.position.y = 100;
camera.position.z = 500;
camera.lookAt(0, 0, 0);

/*
new RGBELoader()
.load('./static/textures/background/starsbackground.hdr', function(texture){
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
*/

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

const sunObj: Star = new Star(scene, sunRadius, 70, 70, './static/textures/stars/sun.jpg', 'Sun', 'white', [0.0, 0.0, 0.0], [0.0, 0.02, 0.0], [0, 0.01, 0.0], 'star-label');

const mercuryObj = new Planet(scene, sunObj, 1.2, 50, 50, './static/textures/planets/mercury.jpg', 'Mercury', 'red', [70, 0, 0], [0, 0.01, 0], [0.00, 0.0109, 0]);
const venusObj = new Planet(scene, sunObj, 3.5, 50, 50, './static/textures/planets/venus.jpg', 'Venus', 'green', [130, 0, 0], [0, 0.01, 0], [0, 0.0037, 0]);
const earthObj = new Planet(scene, sunObj, 4.0, 50, 50, './static/textures/planets/earth.jpg', 'Earth', 'brown', [200, 0, 0], [0, 0.005, 0], [0, 0.0021, 0]);
const moonObj = new Planet(scene, earthObj, 1.5, 50, 50, './static/textures/satellites/moon.jfif', 'Moon', 'grey', [10, 2.5, 0], [0, 0.01100001, 0], [0.0, 0.010000118, 0], 'satellite-label');
const marsObj = new Planet(scene, sunObj, 3.6, 50, 50, './static/textures/planets/mars.png', 'Mars', 'lightblue', [250, 0, 0], [0, 0.015, 0], [0, 0.0015, 0]);
const jupiterObj = new Planet(scene, sunObj, 9.5, 50, 50, './static/textures/planets/jupiter.jpg', 'Jupiter', 'Orange', [320, 0, 0], [0, 0.00095, 0], [0, 0.0008, 0]);
const ganymedeObj = new Planet(scene, jupiterObj, 3.1, 50, 50, './static/textures/satellites/ganymede.jpg', 'Ganymede', 'teal', [23, 2.5, 0], [0.0, 0.001, 0], [0, 0.01, 0], 'satellite-label');
const saturnObj = new Planet(scene, sunObj, 9.0, 50, 50, './static/textures/planets/saturn.jpg', 'Saturn', 'purple', [390, 0, 0], [0, 0.001, 0], [0, 0.0002, 0]);
saturnObj.addRing(10, 20, 32, [-1.07, 0, 0], './static/textures/rings/saturnRing.png');
const titanObj = new Planet(scene, saturnObj, 2.1, 50, 50, './static/textures/satellites/titan.jfif', 'Titan', 'maroon', [21, 2.0, 0], [0.0, 0.003, 0], [0, 0.003, 0], 'satellite-label');
const uranusObj = new Planet(scene, sunObj, 2.6, 50, 50, './static/textures/planets/uranus.png', 'Uranus', 'brown', [470, 0, 0], [0, 0.0001, 0], [0, 0.00042, 0]);
uranusObj.addRing(17, 24, 32, [0.7, 0, 0], './static/textures/rings/uranusRing.png');
const neptunObj = new Planet(scene, sunObj, 1.6, 50, 50, './static/textures/planets/neptun.jpg', 'Neptun', 'aqua', [560, 0, 0], [0, 0.001, 0], [0, 0.00031, 0]);
// I know its not a planet
const plutoObj = new Planet(scene, sunObj, 0.5, 50, 50, './static/textures/satellites/pluto.jpg', 'Pluto', 'silver', [690, 0, 0], [0, 0.01, 0], [0, 0.00021, 0]);

//renderer.toneMapping = THREE.ACESFilmicToneMapping;

function clickedObject(event: Event): void
{
  const intersects = raycaster.intersectObjects(scene.children);

  if(intersects.length == 0)
    return;

  for(let i = 0; i < intersects.length; ++i)
  {
    if(intersects[i].object instanceof THREE.Mesh)
    {
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

  sunObj.update();
  mercuryObj.update();
  venusObj.update();
  earthObj.update();
  moonObj.update();
  marsObj.update();
  jupiterObj.update();
  ganymedeObj.update();
  saturnObj.update();
  titanObj.update();
  uranusObj.update();
  neptunObj.update();
  plutoObj.update();
  const delta = clock.getDelta();
  controls.update(delta);

	renderer.render( scene, camera );
  labelrenderer.render(scene, camera);
}


animate();