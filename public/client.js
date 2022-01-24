import * as THREE from "three";
import { renderFunctionMesh } from "./modules/delaunator.js";
import {
  DrawFirstAxes,
  DrawFromPlotList,
  generatePlot2D,
  plots2D,
  DeleteFrom2DList,
  ChangeColorOfPlot,
  ChangeOnlyPointsValue,
  RefreshPlots,
} from "./modules/logic2dPlot.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Formula from "fparser";
import { plot3D } from "./classes/plot3D.js";

import { saveXmlConfiguration, uploadXmlConfiguration } from "./modules/xmlFunctions.js";
import { NotImplementedError } from "./modules/utils.js";

const debugMode = true; // Debug mode flag

// ============================ Default 3D environment

const scene3D = new THREE.Scene(); // New Three.js scene object (area for 3D plots)
const canvas3D = document.getElementById("writer"); // Default canvas for application
const renderer = new THREE.WebGLRenderer({
  canvas: canvas3D,
  alpha: true,
  preserveDrawingBuffer: true,
}); // Creating new WebGL renderer for canvas3D
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
let plots3D = []; // Intialization of 3D plots array
let scene = scene3D; // Default scene (3D)

// ============================ Default 2D environment

const scene2D = "2D"; // Tag for 2D scene
const container2D = document.getElementById("container2D"); // TODO: More comments on 2D environment in client.js
const canvas_2d = document.getElementById("2d-graph");

// Hide 2d canvas and container from default
container2D.style.display = "none";
canvas_2d.style.visibility = "hidden";

// ============================ Handlers for buttons realated to global environment

const iconOf2DMode = document.getElementById("button-2D"); // Button to switch between 2D and 3D
iconOf2DMode.id = "button-3D"; // Default value == default scene

// Changing scene event
iconOf2DMode.addEventListener("click", () => {
  if (iconOf2DMode.id === "button-2D") {
    iconOf2DMode.id = "button-3D";
    zRange.style.visibility = "visible";
    yRange.style.visibility = "visible";
    canvas3D.style.visibility = "visible";
    dotted2D.style.visibility = "hidden";
    canvas_2d.style.visibility = "hidden";
    container2D.style.display = "none";
    scene = scene3D;
    changeScene(scene);
    canvas3D.width += 1;
    generateList();
  } else {
    iconOf2DMode.id = "button-2D";
    zRange.style.visibility = "hidden";
    yRange.style.visibility = "hidden";
    canvas3D.style.visibility = "hidden";
    canvas_2d.style.visibility = "visible";
    dotted2D.style.visibility = "visible";
    container2D.style.display = "block";
    scene = scene2D;
    if (plots2D.length >= 1) {
      DrawFromPlotList();
    } else {
      DrawFirstAxes();
    }
    changeScene(scene);
    generateList();
  }
});

let currentlySelectedPlotID = ""; // Currently selected plot

const dark = document.getElementById("dark"); // Dark background
const iconOfDarkLightMode = document.getElementById("light-dark-button"); // Button to switch between dark and light theme

// Changing color theme
iconOfDarkLightMode.addEventListener("click", () => {
  dark.classList.toggle("transition");
  iconOfDarkLightMode.classList.toggle("transition1");
});

const functionInput = document.getElementById("input"); // Text input for function (parsed by `fparser`)

// Ranges
const xRange = document.getElementById("X"); // Range on X axis

xRange.addEventListener("change", () => {
  if(currentlySelectedPlotID < 1){
    return;
  }
  if(scene == scene3D){
    for(let el of plots3D){
      if(currentlySelectedPlotID == el.id){
        el.x = {
          min: parseFloat(xRange.querySelector("#minRangeInput").value),
          max: parseFloat(xRange.querySelector("#maxRangeInput").value)
        }
        return;
      }
    }
  }
  else{
    throw NotImplementedError;
  }
})

const yRange = document.getElementById("Y"); // Range on Y axis
yRange.addEventListener("change", () => {
  if(currentlySelectedPlotID < 1){
    return;
  }
  if(scene == scene3D){
    for(let el of plots3D){
      if(currentlySelectedPlotID == el.id){
        el.y = {
          min: parseFloat(yRange.querySelector("#minRangeInput").value),
          max: parseFloat(yRange.querySelector("#maxRangeInput").value)
        }
        return;
      }
    }
  }
  else{
    throw NotImplementedError;
  }
})

const zRange = document.getElementById("Z"); // Range on Z axis
zRange.addEventListener("change", () => {
  if(currentlySelectedPlotID < 1){
    return;
  }
  if(scene == scene3D){
    for(let el of plots3D){
      if(currentlySelectedPlotID == el.id){
        el.z = {
          min: parseFloat(zRange.querySelector("#minRangeInput").value),
          max: parseFloat(zRange.querySelector("#maxRangeInput").value)
        }
        return;
      }
    }
  }
  else{
    throw NotImplementedError;
  }
})


const addFunc = document.getElementById("button-plus"); // Button to add function to plots2D/3D, depends on mode

// Adding function to array of plots
addFunc.addEventListener("click", function(){
  currentlySelectedPlotID = ""
  addNewFunction(functionInput.value)
});

function addNewFunction(input, id=(Math.random() + 1).toString(36).substring(7)) {
  // Checks if empty or contains only spaces
  if (!input.trim().length) {
    return;
  }
  try {
    let exists = false; // Flag used checking if plots2D/3D contains already this function
    // TODO: Create a test for checking duplicates in plots2D/3D
    if (scene == scene2D) {
      // TODO: Find a better way use this parser
      // WARNING: CHECK MEMORY LEAKS ON CREATING Formula OBJECT (SUS)
      const obj = new Formula(input); // Creating a fparser object
      for (let fun2d of plots2D) {
        if (fun2d.func_string == input) {
          console.log("This function already exist in the array!");
          exists = true;
          break;
        }
      }
      if (!exists) {
        generatePlot2D(id); // Argument is random ID (char[5])
        generateList(); // Rerenders <ul></ul> of plots on every plot added
      }
    } else {
      for (let fun3d of plots3D) {
        // TODO: Find a better way use this parser
        // WARNING: CHECK MEMORY LEAKS ON CREATING Formula OBJECT (SUS)
        if(input.includes("x") && input.includes("y") && input.includes("z")){
          console.log("Sphere")
        }
        else{
          const obj = new Formula(input); // Creating a fparser object
        }
        if (fun3d.func_string == input) {
          console.log("This function already exist in the array!");
          exists = true;
          break;
        }
      }
      if (!exists) {
        generatePlot3D(id);
        generateList();
      }
    }
  } catch (error) {
    // WARNING: This catch should be more specific !
    // console.log("Can't calculate this function!");
    console.log(error);
  }
  functionInput.value = ""; // Clear input everytime the button is clicked
};

function changePlotColor(id){
  if (scene == scene3D) {
    for (let el of plots3D) {
      if (el.id == id) {r
        el.color = colorWheel.color.hexString;
      }
    }
  } else {
    ChangeColorOfPlot(id);
    // BRUH: Why? Plz explain
    generateList();
  }
}

// Enum with image type (JavaScript doesn't support traditional enums)
const ImageType = {
  PNG: "png",
  JPG: "jpg",
};

let jpgButton = document.getElementById("button-jpg"); // Button for saving jpg image
jpgButton.addEventListener("click", function(){ 
  saveImage(ImageType.JPG);
});

let pngButton = document.getElementById("button-png"); // Button for saving png image
pngButton.addEventListener("click", function(){
  saveImage(ImageType.PNG)
});

// Saving jpg and png
function saveImage(imageType) {
  const strDownloadMime = "image/octet-stream";
  let imgData;
  try {
    var strMime = `image/${imageType}`;
    if (scene == scene3D) {
      imgData = renderer.domElement.toDataURL(strMime);
    } else {
      imgData = document
        .getElementById("2d-graph")
        .toDataURL(`image/${imageType}`);
    }
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = `wykreślacz.${imageType}`;
      link.href = imgData.replace(strMime, strDownloadMime);
      link.click();
      document.body.removeChild(link); //remove the link when done
    } else {
      location.replace(uri);
    }
  } catch (e) {
    // WARNING: This catch should be more specific !
    console.log(e);
    return;
  }
}

let xmlDownloadButton = document.getElementById("button-xml");
xmlDownloadButton.addEventListener("click", function(){
  saveXmlConfiguration(plots3D, plots2D);
});

let xmlUploadButton = document.getElementById("button-xml-upload");
xmlUploadButton.addEventListener("input", function(){
  uploadXmlConfiguration(xmlUploadButton.files[0])
});


const listOfFunc = document.getElementById("list"); // List of all function (renders elements from plots2D or plots3D, depends on app mode)

// Selecting plot on array
listOfFunc.addEventListener("click", (e) => {
  e.stopPropagation();
  if(currentlySelectedPlotID == e.target.id){
    currentlySelectedPlotID = "";
    for (let element of listOfFunc.getElementsByTagName("li")) {
        element.style.background = "rgb(" + 15 + "," + 27 + "," + 49 + ")";
    }
    return;
  }
  currentlySelectedPlotID = e.target.id;
  console.log(currentlySelectedPlotID);
  setClickedPlotEffect(currentlySelectedPlotID);
});

// Changing style of clicked plot
function setClickedPlotEffect(plotId) {
  for (let element of listOfFunc.getElementsByTagName("li")) {
    if (element.id == plotId) {
      element.style.background = "rgb(" + 20 + "," + 138 + "," + 4 + ")";
    } else {
      element.style.background = "rgb(" + 15 + "," + 27 + "," + 49 + ")";
    }
  }
}

const dotted2D = document.getElementById("dotted2D"); // Button to change 2D plot type
let dottedButtonClicked = false; // Flag for checking plot type

// Change 2D plot to "scatter" plot
dotted2D.addEventListener("click", () => {
  if (dottedButtonClicked) {
    dotted2D.style.background = "rgb(" + 186 + "," + 11 + "," + 34 + ")";
    ChangeOnlyPointsValue(false);
    RefreshPlots();
    dottedButtonClicked = false;
  } else {
    dotted2D.style.background = "rgb(" + 20 + "," + 138 + "," + 4 + ")";
    ChangeOnlyPointsValue(true);
    RefreshPlots();
    dottedButtonClicked = true;
  }
});

// PrecisionSpeed Slider
var slider = document.getElementById("Efficiency");
var output = document.getElementById("Precision");
output.innerHTML = slider.value;
slider.oninput = function () {
  output.innerHTML = (51 + this.value * -1) / 100;
};
slider.addEventListener("change", () =>{
  if(currentlySelectedPlotID < 1){
    return;
  }
  if(scene == scene3D){
    for(let el of plots3D){
      if(currentlySelectedPlotID == el.id){
        el.pointsDensity = (51 + slider.value * -1) / 100
        return;
      }
    }
  }
  else{
    throw NotImplementedError;
  }  
});

// ============================ Functions related to rendering new objects (HTML tags / Three.js objects)

// Genereting <ul></ul> list of plots
function generateList() {
  listOfFunc.innerHTML = "";
  if (scene == scene3D) {
    for (let el of plots3D) {
      const elementOfList = document.createElement("li");
      elementOfList.setAttribute("id", `${el.id}`);
      elementOfList.textContent = `${el.func_string}`;
      const trashButton = document.createElement("div");
      trashButton.setAttribute("class", "trashButton");
      trashButton.setAttribute("id", `${el.id}_trash`);
      const bindedId = el.id;
      trashButton.addEventListener("click", () => {
        if (scene == scene3D) {
          for (let el of plots3D) {
            console.log(el);
            if (el.id == bindedId) {
              scene3D.remove(el.mesh); // removing mesh of deleted plot from scene3D
              plots3D = plots3D.filter(function (item) { // returns new array without deleted element
                return item !== el;
              });
            }
          }
          console.log(plots3D);
          generateList();
        } else {
          throw NotImplementedError;
          DeleteFrom2DList();
          generateList();
        }
      });
      elementOfList.textContent = `${el.func_string}`;
      const containerInList = document.createElement("div");
      containerInList.setAttribute("class", "containerInList");
      const binPic = document.createElement("div");
      binPic.setAttribute("class", "button-bin");
      trashButton.append(binPic);
      containerInList.append(elementOfList,trashButton);
      listOfFunc.prepend(containerInList);
    }
  } else {
    for (let el of plots2D) {
      const elementOfList = document.createElement("li");
      elementOfList.setAttribute("id", `${el.id}`);
      elementOfList.textContent = `${el.func_string}`;
      listOfFunc.prepend(elementOfList);
    }
  }
}

// Genereting 3D plot
function generatePlot3D(id) {
  let x_range = {
    min: parseFloat(xRange.querySelector("#minRangeInput").value),
    max: parseFloat(xRange.querySelector("#maxRangeInput").value),
  };
  let y_range = {
    min: parseFloat(yRange.querySelector("#minRangeInput").value),
    max: parseFloat(yRange.querySelector("#maxRangeInput").value),
  };

  if (scene == scene3D) {
    let z_range = {
      min: parseFloat(zRange.querySelector("#minRangeInput").value),
      max: parseFloat(zRange.querySelector("#maxRangeInput").value),
    };

    const p3D = new plot3D(functionInput.value, x_range, y_range, z_range, (51 + slider.value * -1) / 100,id)
    // const p3D = renderFunctionMesh(
    //   functionInput.value,
    //   x_range,
    //   y_range,
    //   z_range,
    //   (51 + slider.value * -1) / 100,
    //   scene3D,
    //   id
    // )
    plots3D.push(p3D)
    console.log(plots3D);
  } else if (scene == scene2D) {
    console.log("2D unimplemented");
  }
}

// ============================ Color picker
var colorWheel = new iro.ColorPicker("#colorPicker", {
  layout: [
    {
      component: iro.ui.Box,
      options: {
        width: 200,
      },
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: "hue",
        width: 200,
        activeIndex: 2,
      },
    },
  ],
});

colorWheel.on("color:change", changePlotColor2)

function changePlotColor2(color){
  if(currentlySelectedPlotID < 1){
    return;
  }
  if(scene == scene3D){
    for(let el of plots3D){
      if(el.id == currentlySelectedPlotID){
        el.color = color.hexString;
      }
    }
  }
  else{
    throw NotImplementedError;
  }
}


// ============================ Additional functions
function renderAxisHelperLabels(axHelper){
  let color = new THREE.Color();
  color.setRGB(255, 250, 250);
  let textMaterial = new THREE.MeshBasicMaterial({ color: color });
  for(i in axHelper.geometry.vertices){
    let text = new THREE.Mesh(
      new THREE.TextGeometry('1', {
        size: 5,
        height: 2,
        curveSegments: 6,
        font: "helvetiker",
        style: "normal"       
       }),
       textMaterial);
    text.position.x = axHelper.geometry.vertices[i].x;
    text.position.y = axHelper.geometry.vertices[i].y;
    text.position.z = axHelper.geometry.vertices[i].z;
    scene.add(text);
    
  }
}

// ============================ Rendering logic
// TODO: Redesign main() function

// Main function
function main() {
  // Camera initial setup
  let fov = 75;
  let aspect = 0;
  let near = 0.1;
  let far = 200;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.y = -2;
  camera.position.z = 5;

  // Orbital controls
  const controls = new OrbitControls(camera, canvas3D);

  // Default light
  let sceneLightColor = 0xffffff;
  let sceneLightIntensity = 2;
  //const sceneLight = new THREE.HemisphereLight(0x858585, 0xFFFFFF, 0.8);
  const sceneLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(sceneLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8, 18);
  pointLight.position.set(-3,6,0);
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 25;
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 18);
  pointLight2.position.set(-3,-6,0);
  pointLight2.castShadow = true;
  pointLight2.shadow.camera.near = 0.1;
  pointLight2.shadow.camera.far = 25;
  scene.add(pointLight2);

  // Rendering mesh from points
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  console.log(axesHelper)
  renderAxisHelperLabels(axesHelper);

  // Smart resizer
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
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
    if (scene == scene3D) {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
  }
  requestAnimationFrame(render);
}

function changeScene(scene) {
  if (scene == scene3D) {
    main();
  }
}
changeScene(scene);

if(debugMode){
  functionInput.value = "x*z";
}


export { colorWheel, currentlySelectedPlotID, scene3D };