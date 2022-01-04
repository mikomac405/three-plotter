import * as THREE from 'three';

import { renderSinFunFromPoint } from './modules/delaunator_test.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


const scene3D = new THREE.Scene();
const scene2D = new THREE.Scene();

// Default scene
let scene = scene3D;

// Changing color mode
const dark = document.getElementById('dark');
const iconOfDarkLightMode = document.getElementById('dark-mode');
const iconOf2DMode = document.getElementById('button-2D');
iconOf2DMode.id='button-3D';
const zrange = document.getElementById("zvaluerange");

// Color picker
var colorWheel = new iro.ColorPicker("#colorPicker", {
  layout: [
  
    {
      component: iro.ui.Box,
      options: {
        width: 200
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'hue',
        width: 200,
        activeIndex: 2
      }
    }
    ]
});

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
      zrange.style = "visibility: visible";
      scene = scene3D;
      console.log(scene)
  }
  else {
      iconOf2DMode.id='button-2D';
      zrange.style = "visibility: hidden";
      scene = scene2D;
      console.log(scene)
  }
});

// PrecisionSpeed Slider
var slider = document.getElementById("Efficiency");
var output = document.getElementById("Precision");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}

// Zoom slider TO DO get zoom working
var zoomslider = document.getElementById("zoomer");
output.innerHTML = slider.value;
zoomslider.oninput = function() {
  var zoomlevel = zoomer.valueAsNumber;
  scene.style.webkitTransform = "scale("+zoomlevel+")";
	scene.style.transform = "scale("+zoomlevel+")";
}

// Main function
function main() {
  const canvas = document.getElementById('writer');
  const renderer = new THREE.WebGLRenderer({canvas,alpha: true});
  
  // Camera initial setup
  let fov = 75;  let aspect = 0;  let near = 0.1;  let far = 200;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = -2; camera.position.z = 5;

  // Orbital controls
  // TODO: Find way to rewrite `OrbitControls` (Optional)
  const controls = new OrbitControls(camera, canvas)

  // Default light
  let sceneLightColor = 0xFFFFFF;
  let sceneLightIntensity = 2;
  const sceneLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add(sceneLight);

  // Rendering mesh from points
  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );

  let fromPointsMesh = renderSinFunFromPoint();

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

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();