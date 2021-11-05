import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

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

function main() {
  const canvas = document.getElementById('writer');
  const renderer = new THREE.WebGLRenderer({canvas,alpha: true});

  const fov = 75;
  const aspect = 0;  // the canvas default
  const near = 0.1;
  const far = 20;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = -2;
  camera.position.z = 5;

  const controls = new OrbitControls(camera, canvas)

  const scene = new THREE.Scene();

  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    cube.position.y = -2;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  let xMin = -0.5, yMin = -0.5
  let xMax = 0.5, yMax = 0.5
  let xRange = xMax-xMin, yRange = yMax-yMin;
  console.log(xRange + " " + yRange);
  console.log(xMin + " " + yMin);

  let paraFunction = function (x, y, target){
      x = xRange * x + xMin;
      y = yRange * y + yMin;
      // TODO: Create or find parser
      let z = 2*x + (y*y);
      target.set(x,y,z);
  }

  let paraGeometry = new ParametricGeometry(paraFunction, 100,100);
  let paraMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
  let paraMesh = new THREE.Mesh(paraGeometry, paraMaterial);
  paraMesh.position.set(0,0,0);
  console.log(paraMesh);
  scene.add(paraMesh);

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