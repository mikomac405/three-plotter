import * as THREE from "three"
import { renderFunctionMesh } from "./modules/delaunator.js"
import { OrbitControls }  from "three/examples/jsm/controls/OrbitControls";
import Formula from 'fparser';

const scene3D = new THREE.Scene();
const scene2D = new THREE.Scene();
const canvas = document.getElementById('writer');
const renderer = new THREE.WebGLRenderer({canvas,alpha: true, preserveDrawingBuffer: true });

// Default scene
let scene = scene3D;

// Changing color mode
const dark = document.getElementById('dark');
const iconOfDarkLightMode = document.getElementById('light-dark-button');
const addFunc = document.getElementById('button-plus');
const functionInput = document.getElementById('input');
const iconOf2DMode = document.getElementById('button-2D');
iconOf2DMode.id='button-3D';
const xRange = document.getElementById("X");
const yRange = document.getElementById("Y");
const zRange = document.getElementById("Z");

console.log()

iconOfDarkLightMode.addEventListener('click',()=>{
  dark.classList.toggle("transition");
  iconOfDarkLightMode.classList.toggle("transition1");
});

addFunc.addEventListener('click',()=>{
 generatePlot()
 saveFile()
});

// Button to switch between 2D and 3D
iconOf2DMode.addEventListener('click',()=>{
  if(iconOf2DMode.id==='button-2D'){
      iconOf2DMode.id='button-3D';
      zRange.style.visibility = "visible";
      scene = scene3D;
  }
  else {
      iconOf2DMode.id='button-2D';
      zRange.style.visibility = "hidden";
      scene = scene2D;
  }
});

function generatePlot(){
  let x_range = {
    min : parseFloat(xRange.querySelector("#minRangeInput").value),
    max : parseFloat(xRange.querySelector("#maxRangeInput").value)
  }
  let y_range = {
    min : parseFloat(yRange.querySelector("#minRangeInput").value),
    max : parseFloat(yRange.querySelector("#maxRangeInput").value)
  }
  let z_range = {
    min : parseFloat(zRange.querySelector("#minRangeInput").value),
    max : parseFloat(zRange.querySelector("#maxRangeInput").value)
  }
  console.log(x_range)
  console.log(y_range)
  console.log(z_range)
  renderFunctionMesh(functionInput.value, x_range, y_range, z_range, scene3D)
}

function saveFile() {
    var strDownloadMime = "image/octet-stream";
    var imgData;

      try {
          var strMime = "image/jpeg";
          imgData = renderer.domElement.toDataURL(strMime);
          var link = document.createElement('a');
          if (typeof link.download === 'string') {
              document.body.appendChild(link); //Firefox requires the link to be in the body
              link.download = "test.png";
              link.href = imgData.replace(strMime, strDownloadMime);
              link.click();
              document.body.removeChild(link); //remove the link when done
          } else {
              location.replace(uri);
          }

      } catch (e) {
          console.log(e);
          return;
      }
   
}






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