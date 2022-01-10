import * as THREE from "three"
import { renderFunctionMesh } from "./modules/delaunator.js"
import { OrbitControls }  from "three/examples/jsm/controls/OrbitControls";
import Formula from 'fparser';
import { plot3D } from "./classes/plot3D.js"
import { plot2D } from "./classes/plot2D.js"

// ============================ Default environment
const scene3D = new THREE.Scene();
const scene2D = "2D";
const canvas = document.getElementById('writer');
let container2D = document.getElementById("container2D")
let canvas_2d = document.getElementById("2d-graph");
const renderer = new THREE.WebGLRenderer({canvas,alpha: true, preserveDrawingBuffer: true });

// ============================ Scene logic
// Default scene
let scene = scene3D;

// Hide 2d canvas and container from default
container2D.style.display = 'none';
canvas_2d.style.visibility = "hidden";

// Button to switch between 2D and 3D
const iconOf2DMode = document.getElementById('button-2D');
iconOf2DMode.id='button-3D';

// Changing scene event
iconOf2DMode.addEventListener('click',()=>{
  if(iconOf2DMode.id==='button-2D'){
      iconOf2DMode.id='button-3D';
      zRange.style.visibility = "visible";
      canvas.style.visibility = "visible";
      canvas_2d.style.visibility = "hidden";
      container2D.style.display = 'none';
      scene = scene3D;
      changeScene(scene);
  }
  else {
      iconOf2DMode.id='button-2D';
      zRange.style.visibility = "hidden";
      canvas.style.visibility = "hidden";
      canvas_2d.style.visibility = "visible";
      container2D.style.display = 'block';
      scene = scene2D;
      DrawFirstAxes();
      changeScene(scene);
  }
});

// Changing color mode
const dark = document.getElementById('dark');
const iconOfDarkLightMode = document.getElementById('light-dark-button');

iconOfDarkLightMode.addEventListener('click',()=>{
  dark.classList.toggle("transition");
  iconOfDarkLightMode.classList.toggle("transition1");
});

// ============================ Plots logic

// Buttons and inputs
const addFunc = document.getElementById('button-plus');
const functionInput = document.getElementById('input');

const xRange = document.getElementById("X");
const yRange = document.getElementById("Y");
const zRange = document.getElementById("Z");

console.log()

let plots3D = []
let plots2D = []

addFunc.addEventListener('click',()=>{
  if (scene == scene2D){
    generatePlot2D();
  }else{
    generatePlot()
  }
});

// ============== 2D Plot logic ============

let onlyPointsGlobal = false;
let Ctx = null;
let Width = canvas_2d.width;
let Height = canvas_2d.height;
let xLeftBound = parseFloat(xRange.querySelector("#minRangeInput").value);
let xRightBound = parseFloat(xRange.querySelector("#maxRangeInput").value);

function DrawFirstAxes(){
  if (canvas_2d.getContext){
    xLeftBound = parseFloat(xRange.querySelector("#minRangeInput").value);
    xRightBound = parseFloat(xRange.querySelector("#maxRangeInput").value);
    Ctx = canvas_2d.getContext("2d");
    Ctx.clearRect(0,0,Width,Height);

    DrawAxes();
  }
}

// Returns the right boundary of the logical viewport
function MaxX(){
  return xRightBound;
}

// Returns the left boundary of the logical viewport
function MinX(){
  return xLeftBound;
}

// Returns the top boundary of the logical viewport
function MaxY(){
  return MaxX() * Height / Width;
  // return parseFloat(yRange.querySelector("#maxRangeInput").value);
}

// Returns the bottom boundary of the logical viewport
function MinY(){
  return MinX() * Height / Width;
  // return parseFloat(yRange.querySelector("#minRangeInput").value);
}

// Returns the phycisal x-coordinate of a logical x-coordinate
function XC(x){
  return (x - MinX()) / (MaxX() - MinX()) * Width;
}

// Returns the phycisal y-coordinate of a logical y-coordinate
function YC(y){
  return Height - (y - MinY()) / (MaxY() - MinY()) * Height;
}

// Clears the canvas, draws the axes and plot the function F that is evaluted from input
function Draw(){
  let F = function(x){
      return eval(document.getElementById('input').value)
  }
  
  if (canvas_2d.getContext){
      Ctx = canvas_2d.getContext("2d");
      // Ctx.clearRect(0,0,Width,Height);  // Reset the whole canvas 

      DrawAxes();
      if (onlyPointsGlobal){
        console.log("RENDER POINTS ONLY")
          // RenderFunctionWithPointsOnly(F)
      }else{
          RenderFunction(F);
      }
      
  }
}

// Returns the distance between ticks on X/Y axis
function XTickDelta(){
  return 1;
}

function YTickDelta(){
  return 1;
}

function DrawAxes(){
  Ctx.save();
  Ctx.strokeStyle = "black";
  Ctx.lineWidth = 2;

  // Draw positive Y-axis
  Ctx.beginPath();
  Ctx.moveTo(XC(0), YC(0));
  Ctx.lineTo(XC(0), YC(MaxY()));
  Ctx.stroke();

  // Draw negative Y-axis
  Ctx.beginPath();
  Ctx.moveTo(XC(0), YC(0));
  Ctx.lineTo(XC(0), YC(MinY()));
  Ctx.stroke();

  // Draw ticks on Y-axis
  let delta_y = YTickDelta();
  for(let i=1; (i*delta_y) < MaxY(); ++i){
      Ctx.beginPath();
      Ctx.moveTo(XC(0) - 5, YC(i*delta_y));
      Ctx.lineTo(XC(0) + 5, YC(i*delta_y));
      Ctx.stroke();
      Ctx.font = 'bold 11px Arial';
      Ctx.textAlign = 'start';
      Ctx.fillStyle = "black";
      Ctx.fillText(i, XC(0) + 12, YC(i*delta_y) + 3);
  }

  for(let i=1; (i*delta_y) > MinY(); --i){
      Ctx.beginPath();
      Ctx.moveTo(XC(0) - 5, YC(i*delta_y));
      Ctx.lineTo(XC(0) + 5, YC(i*delta_y));
      Ctx.stroke();
      if (i === 0){
          Ctx.font = 'bold 11px Arial';
          Ctx.textAlign = 'start';
          Ctx.fillText(i, XC(0) + 12, YC(i*delta_y) - 5);
      }else{
          Ctx.font = 'bold 11px Arial';
          Ctx.textAlign = 'start';
          Ctx.fillText(i, XC(0) + 12, YC(i*delta_y) + 3);
      }
      
  }

  // Draw positive X-axis
  Ctx.beginPath();
  Ctx.moveTo(XC(0), YC(0));
  Ctx.lineTo(XC(MaxX()), YC(0));
  Ctx.stroke();

  // Draw negative X-axis
  Ctx.beginPath();
  Ctx.moveTo(XC(0), YC(0));
  Ctx.lineTo(XC(MinX()), YC(0));
  Ctx.stroke();

  // Draw ticks on X-axis
  let delta_x = XTickDelta();
  for(let i=1; (i*delta_x) < MaxX(); ++i){
      Ctx.beginPath();
      Ctx.moveTo(XC(i*delta_x), YC(0) - 5);
      Ctx.lineTo(XC(i*delta_x), YC(0) + 5);
      Ctx.stroke();
      Ctx.font = 'bold 11px Arial';
      Ctx.textAlign = 'start';
      Ctx.fillText(i, XC(i*delta_x) - 3, YC(0) + 25);
  }

  for(let i=1; (i*delta_x) > MinX(); --i){
      Ctx.beginPath();
      Ctx.moveTo(XC(i*delta_x), YC(0) - 5);
      Ctx.lineTo(XC(i*delta_x), YC(0) + 5);
      Ctx.stroke();
      if (i === 0){
          Ctx.font = 'bold 11px Arial';
          Ctx.textAlign = 'start';
          Ctx.fillText(i, XC(i*delta_x) + 13, YC(0) + 25);
      }else{
          Ctx.font = 'bold 11px Arial';
          Ctx.textAlign = 'start';
          Ctx.fillText(i, XC(i*delta_x) - 3, YC(0) + 25);
      }
      
  }
  Ctx.restore();
}

function RenderFunction(f){
  let XSTEP;
  let xPrecision = false;
  if(xPrecision){
      XSTEP = xPrecision;
  }else{
      XSTEP = (MaxX() - MinX()) / Width;
  }
  let first = true;
  Ctx.beginPath();
  for (let x = MinX(); x <= MaxX(); x += XSTEP){
      let y = f(x);
      if (first){
          Ctx.moveTo(XC(x), YC(y));
          first = false;
      } else {
          Ctx.lineTo(XC(x), YC(y));
      }
  }
  let colorFromColorPickerInRgb = hsvToRgb(colorWheel.color.$["h"] / 360, colorWheel.color.$["s"] / 100, colorWheel.color.$["v"] / 100)
  Ctx.strokeStyle = `rgb(${colorFromColorPickerInRgb[0]}, ${colorFromColorPickerInRgb[1]}, ${colorFromColorPickerInRgb[2]})`;
  Ctx.lineWidth = 2;
  Ctx.stroke();
}

function scrollingEvent(){
    canvas_2d.addEventListener('wheel', function(event)
    {
        
        if (event.deltaY < 0)
        {
            // scrolling up
            
            if (xRightBound <= 20 && xLeftBound >= -20){
                xRightBound++;
                xLeftBound--;
                Draw();
            }
        }
        else if (event.deltaY > 0)
        {
            // scrolling down
            if (xRightBound >= 3 && xLeftBound <= -3){
                xRightBound--;
                xLeftBound++;
                Draw();
            }
        }
    });
}

function generatePlot2D(){
  xLeftBound = parseFloat(xRange.querySelector("#minRangeInput").value);
  xRightBound = parseFloat(xRange.querySelector("#maxRangeInput").value);
  canvas_2d.onmouseover = scrollingEvent()
  Draw();
  // plots2D.push() // Need to implement creating plot2D objects
}


// ============================



function generatePlot(){
  let x_range = {
    min : parseFloat(xRange.querySelector("#minRangeInput").value),
    max : parseFloat(xRange.querySelector("#maxRangeInput").value)
  }
  let y_range = {
    min : parseFloat(yRange.querySelector("#minRangeInput").value),
    max : parseFloat(yRange.querySelector("#maxRangeInput").value)
  }

  if(scene == scene3D){
    let z_range = {
      min : parseFloat(zRange.querySelector("#minRangeInput").value),
      max : parseFloat(zRange.querySelector("#maxRangeInput").value)
    }

    plots3D.push(renderFunctionMesh(functionInput.value, x_range, y_range, z_range, scene3D))
    console.log(plots3D)
    // Change scale and color
    /*
    plots3D.at(0).color = {r:0,g:0,b:1}
    plots3D.at(0).scale = 0.1
    console.log(plots3D.at(0))
    */

    // Remove example
    /*
    let p = plots3D.at(0)
    plots3D = plots3D.filter(function(value, index, arr){ 
      return value != p});
    scene.remove(p.mesh);
    */
  }
  else if(scene == scene2D){
    console.log("2D unimplemented")
  }
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

// HSV to RGB converter
function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}

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
    if (scene == scene3D){
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
  }
  requestAnimationFrame(render);
}

function changeScene(scene){
  if(scene == scene3D){
    main();
  }
}
changeScene(scene)