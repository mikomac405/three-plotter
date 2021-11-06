import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

// Changing color mode
const dark = document.getElementById('dark');
const iconOfDarkLightMode = document.getElementById('dark-mode');

iconOfDarkLightMode.addEventListener('click',()=>{
    if(dark.id==='dark'){
        dark.id='light';
        iconOfDarkLightMode.id='light-mode';
    }
    else {
        dark.id='dark';
        iconOfDarkLightMode.id='dark-mode';
    }
});


// Main function
function main() {
  const canvas = document.getElementById('writer');
  const renderer = new THREE.WebGLRenderer({canvas,alpha: true});

  // Camera initial setup
  let fov = 75;
  let aspect = 0;  // the canvas default
  let near = 0.1;
  let far = 20;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = -2;
  camera.position.z = 5;

  // Orbital controls
  // TODO: Find way to rewrite `OrbitControls`
  const controls = new OrbitControls(camera, canvas)

  // Default scene
  const scene = new THREE.Scene();

  // Default light
  let sceneLightColor = 0xFFFFFF;
  let sceneLightIntensity = 1;
  const sceneLight = new THREE.DirectionalLight(sceneLightColor, sceneLightIntensity);
  sceneLight.position.set(-1, 2, 4);
  scene.add(sceneLight);

  // Rendering cubes
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeDefaultMesh(geometry, color, x) {
    const defaultMeshMaterial = new THREE.MeshPhongMaterial({color});

    const defaultMesh = new THREE.Mesh(geometry, defaultMeshMaterial);
    scene.add(defaultMesh);

    defaultMesh.position.x = x;
    defaultMesh.position.y = -2;
    return defaultMesh;
  }

  const cubes = [
    makeDefaultMesh(boxGeometry, 0x44aa88,  0),
    makeDefaultMesh(boxGeometry, 0x8844aa, -2),
    makeDefaultMesh(boxGeometry, 0xaa8844,  2),
  ];


  // Rendering parametric geometry
  let xMin = -0.5, yMin = -0.5
  let xMax = 0.5, yMax = 0.5
  let xRange = xMax-xMin, yRange = yMax-yMin;

  let parametricFunction = function (x, y, target){
      x = xRange * x + xMin;
      y = yRange * y + yMin;
      // TODO: Create or find parser
      let z = 2*x + (y*y);
      target.set(x,y,z);
  }

  let parametricGeometry = new ParametricGeometry(parametricFunction, 100,100);
  let parametricMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
  let parametricMesh = new THREE.Mesh(parametricGeometry, parametricMaterial);
  parametricMesh.position.set(0,0,0);
  // Debug
  // console.log(parametricMesh);
  scene.add(parametricMesh);

  // Smart resizer
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }


  // Rendering function
  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();