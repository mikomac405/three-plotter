import * as THREE from 'three';

import { renderParametricMesh } from './modules/parametric_test.js'
import { renderMeshFromPoints } from './modules/buffer_test.js';
import { renderSinFunFromPoint } from './modules/delaunator_test.js';
import { renderCubes } from './modules/cubes_test.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

// Changing color mode
const dark = document.getElementById('dark');
const iconOfDarkLightMode = document.getElementById('dark-mode');
const iconOf2DMode = document.getElementById('button-2D');

// Button to switch between light and dark mode
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

// Button to switch between 2D and 3D
iconOf2DMode.addEventListener('click',()=>{
  if(iconOf2DMode.id==='button-2D'){
      iconOf2DMode.id='button-3D';
  }
  else {
      iconOf2DMode.id='button-2D';
  }
});

// Main function
function main() {
  const canvas = document.getElementById('writer');
  const renderer = new THREE.WebGLRenderer({canvas,alpha: true});

  // Camera initial setup
  let fov = 75;  let aspect = 0;  let near = 0.1;  let far = 20;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = -2; camera.position.z = 5;

  // Orbital controls
  // TODO: Find way to rewrite `OrbitControls` (Optional)
  const controls = new OrbitControls(camera, canvas)

  // Default scene
  const scene = new THREE.Scene();

  // Default light
  let sceneLightColor = 0xFFFFFF;
  let sceneLightIntensity = 2;
  const sceneLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add(sceneLight);

  // Rendering cubes
  let cubes = renderCubes();
  for(let i in cubes)
    scene.add(cubes[i])

  // Rendering mesh from points
  //let fromPointsMesh = renderMeshFromPoints();
  let fromPointsCloud,fromPointsMesh = renderSinFunFromPoint();
  scene.add(fromPointsCloud)
  scene.add(fromPointsMesh);


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