import * as THREE from "three"
import { renderFunctionMesh } from "./modules/delaunator.js"
import { DrawFirstAxes, DrawFromPlotList, generatePlot2D, plots2D, DeleteFrom2DList, ChangeColorOfPlot, ChangeOnlyPointsValue, RefreshPlots } from "./modules/logic2dPlot.js"
import { OrbitControls }  from "three/examples/jsm/controls/OrbitControls";
import Formula from 'fparser';
import { plot3D } from "./classes/plot3D.js"

// ============================ Default environment
const scene3D = new THREE.Scene();
const scene2D = "2D";
const canvas = document.getElementById('writer');
const container2D = document.getElementById("container2D")
const canvas_2d = document.getElementById("2d-graph");
const dotted2D = document.getElementById("dotted2D");
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
      yRange.style.visibility = "visible";
      canvas.style.visibility = "visible";
      dotted2D.style.visibility = "hidden";
      canvas_2d.style.visibility = "hidden";
      container2D.style.display = 'none';
      scene = scene3D;
      changeScene(scene);
      canvas.width += 1;
      generateList();
  }
  else {
      iconOf2DMode.id='button-2D';
      zRange.style.visibility = "hidden";
      yRange.style.visibility = "hidden";
      canvas.style.visibility = "hidden";
      canvas_2d.style.visibility = "visible";
      dotted2D.style.visibility = "visible";
      container2D.style.display = 'block';
      scene = scene2D;
      if (plots2D.length >= 1){
        DrawFromPlotList();
      }else{
        DrawFirstAxes();
      }
      changeScene(scene);
      generateList();
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
const listOfFunc = document.getElementById('list');
const addFunc = document.getElementById('button-plus');
const functionInput = document.getElementById('input');
const changeColor = document.getElementById('changeColor');

const xRange = document.getElementById("X");
const yRange = document.getElementById("Y");
const zRange = document.getElementById("Z");

console.log()

let plots3D = []

function generateList(){
  listOfFunc.innerHTML = ""
  if(scene == scene3D){
    for(let el of plots3D){
      const elementOfList = document.createElement('li');
      elementOfList.setAttribute('id',`${el.id}`);
      elementOfList.textContent = `${el.func_string}`;
      listOfFunc.prepend(elementOfList);
    }
  }
  else{
    for(let el of plots2D){
      const elementOfList = document.createElement('li');
      elementOfList.setAttribute('id',`${el.id}`);
      elementOfList.textContent = `${el.func_string}`;
      listOfFunc.prepend(elementOfList);
    }
  }
}

function isEmpty(str) {
  return !str.trim().length;
}

addFunc.addEventListener('click',()=>{
  let input = functionInput.value;
  if (isEmpty(input)){
    return
  }
  try{
    let obj = new Formula(input);
    let exists = false;
    if (scene == scene2D){
      for(let fun2d of plots2D){
        if(fun2d.func_string == input){
          console.log("This function already exist in the list!");
          exists = true;
          break;
        }
      }
      if(!exists){
        generatePlot2D((Math.random() + 1).toString(36).substring(7));
        generateList();
        
      }
    }else{
      for(let fun3d of plots3D){
        if(fun3d.func_string == input){
          console.log("This function already exist in the list!");
          exists = true;
          break;
        }
      }
      if(!exists){
        generatePlot((Math.random() + 1).toString(36).substring(7))
        generateList();
      }
    }
  }
  catch(error){
    console.log("Can't calculate this function!")
    console.log(error)
  }
  functionInput.value = "";
});

changeColor.addEventListener('click', ()=>{
  if(scene == scene3D){
    for(let el of plots3D){
      console.log(el)
      if(el.id == idOfElement){
        let raw_color = hsvToRgb(colorWheel.color.$["h"] / 360, colorWheel.color.$["s"] / 100, colorWheel.color.$["v"] / 100)
        el.color = {r: raw_color[0], g:raw_color[1], b:raw_color[2]}
        scene3D.remove(el.mesh)
        scene3D.add(el.mesh)
        console.log(plots3D)
      }
    }
  }
  else{
    ChangeColorOfPlot(idOfElement);
    generateList();
  }
});


function generatePlot(id){
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

    plots3D.push(renderFunctionMesh(functionInput.value, x_range, y_range, z_range, (51+(slider.value*-1))/100,scene3D,id))
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

function saveFileJPG() {
    const strDownloadMime = "image/octet-stream";
    let imgData;
      try {
          var strMime = "image/jpeg";
          if (scene == scene3D){
            imgData = renderer.domElement.toDataURL(strMime);
          }else{
            imgData = document.getElementById("2d-graph").toDataURL("image/jpg");
          }
          let link = document.createElement('a');
          if (typeof link.download === 'string') {
              document.body.appendChild(link); //Firefox requires the link to be in the body
              link.download = "wykreślacz.jpg";
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

function saveFilePNG() {
  const strDownloadMime = "image/octet-stream";
  let imgData;
    try {
        var strMime = "image/png";
        if (scene == scene3D){
          imgData = renderer.domElement.toDataURL(strMime);
        }else{
          imgData = document.getElementById("2d-graph").toDataURL("image/png");
        }
        let link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = "wykreślacz.png";
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

let jpgButton = document.getElementById("button-jpg");
jpgButton.addEventListener("click", saveFileJPG);

let pngButton = document.getElementById("button-png");
pngButton.addEventListener("click", saveFilePNG);

// change to dotted plot 
let dottedButtonClicked = false;

dotted2D.addEventListener("click", () => {
  if (dottedButtonClicked){
    dotted2D.style.background = 'rgb(' + 186 + ',' + 11 + ',' + 34 + ')';
    ChangeOnlyPointsValue(false);
    RefreshPlots();
    dottedButtonClicked = false;
  }else{
    dotted2D.style.background = 'rgb(' + 20 + ',' + 138 + ',' + 4 + ')';
    ChangeOnlyPointsValue(true);
    RefreshPlots();
    dottedButtonClicked = true;
  }
  
})


// delete and change colors of elements from list

let idOfElement = "";

listOfFunc.addEventListener('click',e => {
  e.stopPropagation();
  idOfElement = e.target.id;
  console.log(idOfElement);
  setClickedPlotEffect(idOfElement);
});

function setClickedPlotEffect(plotId){
  for(let element of listOfFunc.getElementsByTagName("li")){
    if (element.id == plotId){
      element.style.background = 'rgb(' + 20 + ',' + 138 + ',' + 4 + ')';
    }else{
      element.style.background = 'rgb(' + 15 + ',' + 27 + ',' + 49 + ')';
    }
  }
}

const deleteFunc = document.getElementById('deleteFunc');

deleteFunc.addEventListener('click',() => {
  if(scene == scene3D){
    for(let el of plots3D){
      console.log(el)
      if(el.id == idOfElement){
        scene3D.remove(el.mesh)
        plots3D.pop(el)
        plots3D = plots3D.filter(function(item){
          return item !== el
        })
      }
    }
    console.log(plots3D);
    generateList();
    }
  else{
    DeleteFrom2DList();
    generateList();
  }
});




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
  output.innerHTML = (51+(this.value*-1))/100;
}


// Zoom slider TO DO get zoom working

/*
var zoomslider = document.getElementById("zoomer");
output.innerHTML = slider.value;
zoomslider.oninput = function() {
  var zoomlevel = zoomer.valueAsNumber;
  scene.style.webkitTransform = "scale("+zoomlevel+")";
	scene.style.transform = "scale("+zoomlevel+")";
}
*/

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
  const sceneLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
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

export { hsvToRgb, colorWheel, idOfElement}