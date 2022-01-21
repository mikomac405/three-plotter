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

// ============================ Default 3D environment

const scene3D = new THREE.Scene(); // New Three.js scene object (area for 3D plots)
const canvas3D = document.getElementById("writer"); // Default canvas for application
const renderer = new THREE.WebGLRenderer({
  canvas: canvas3D,
  alpha: true,
  preserveDrawingBuffer: true,
}); // Creating new WebGL renderer for canvas3D
let plots3D = []; // Intialization of 3D plots list
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

const dark = document.getElementById("dark"); // Dark background
const iconOfDarkLightMode = document.getElementById("light-dark-button"); // Button to switch between dark and light theme

// Changing color theme
iconOfDarkLightMode.addEventListener("click", () => {
  dark.classList.toggle("transition");
  iconOfDarkLightMode.classList.toggle("transition1");
});

const listOfFunc = document.getElementById("list"); // List of all function (renders elements from plots2D or plots3D, depends on app mode)
const functionInput = document.getElementById("input"); // Text input for function (parsed by `fparser`)

// Ranges
const xRange = document.getElementById("X"); // Range on X axis
const yRange = document.getElementById("Y"); // Range on Y axis
const zRange = document.getElementById("Z"); // Range on Z axis

const addFunc = document.getElementById("button-plus"); // Button to add function to plots2D/3D, depends on mode

// Adding function to list of plots
addFunc.addEventListener("click", () => {
  let input = functionInput.value;
  // Checks if empty or contains only spaces
  if (!input.trim().length) {
    return;
  }
  try {
    // TODO: Find a better way use this parser
    // WARNING: CHECK MEMORY LEAKS ON CREATING Formula OBJECT (SUS)
    let obj = new Formula(input); // Creating a fparser object
    let exists = false; // Flag used checking if plots2D/3D contains already this function
    // TODO: Create a test for checking duplicates in plots2D/3D
    if (scene == scene2D) {
      for (let fun2d of plots2D) {
        if (fun2d.func_string == input) {
          console.log("This function already exist in the list!");
          exists = true;
          break;
        }
      }
      if (!exists) {
        generatePlot2D((Math.random() + 1).toString(36).substring(7)); // Argument is random ID (char[5])
        generateList(); // Rerenders <ul></ul> of plots on every plot added
      }
    } else {
      for (let fun3d of plots3D) {
        if (fun3d.func_string == input) {
          console.log("This function already exist in the list!");
          exists = true;
          break;
        }
      }
      if (!exists) {
        generatePlot3D((Math.random() + 1).toString(36).substring(7));
        generateList();
      }
    }
  } catch (error) {
    // WARNING: This catch should be more specific !
    console.log("Can't calculate this function!");
    console.log(error);
  }
  functionInput.value = ""; // Clear input everytime the button is clicked
});

const changeColor = document.getElementById("changeColor"); // Button for changing colors of selected plot

// Changing color of plot
changeColor.addEventListener("click", () => {
  if (scene == scene3D) {
    for (let el of plots3D) {
      if (el.id == idOfElement) {
        // FIXME: This is a terrible way to change color
        let raw_color = hsvToRgb(
          colorWheel.color.$["h"] / 360,
          colorWheel.color.$["s"] / 100,
          colorWheel.color.$["v"] / 100
        );
        el.color = { r: raw_color[0], g: raw_color[1], b: raw_color[2] };
        // I don't know why,  I don't want to know why, I shouldn't
        // have to wonder why, but for whatever reason this stupid
        // plot isn't rerendering correctly unless we do this terribleness
        scene3D.remove(el.mesh);
        scene3D.add(el.mesh);
      }
    }
  } else {
    ChangeColorOfPlot(idOfElement);
    // BRUH: Why? Plz explain
    generateList();
  }
});

// Enum with image type (JavaScript doesn't support traditional enums)
const ImageType = {
  PNG: "jpg",
  JPG: "png",
};

let jpgButton = document.getElementById("button-jpg"); // Button for saving jpg image
jpgButton.addEventListener("click", saveImage(ImageType.JPG));

let pngButton = document.getElementById("button-png"); // Button for saving png image
pngButton.addEventListener("click", saveImage(ImageType.PNG));

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

let idOfElement = ""; // Currently selected plot

// Selecting plot on list
listOfFunc.addEventListener("click", (e) => {
  e.stopPropagation();
  idOfElement = e.target.id;
  console.log(idOfElement);
  setClickedPlotEffect(idOfElement);
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

const deleteFunc = document.getElementById("deleteFunc"); // Button for deleting plot from plots2D/3D

// Deleting plot and remove it from list
// TODO: Check if elements removes correctly
deleteFunc.addEventListener("click", () => {
  if (scene == scene3D) {
    for (let el of plots3D) {
      console.log(el);
      if (el.id == idOfElement) {
        scene3D.remove(el.mesh);
        plots3D = plots3D.filter(function (item) {
          return item !== el;
        });
      }
    }
    console.log(plots3D);
    generateList();
  } else {
    DeleteFrom2DList();
    generateList();
  }
});

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

// ============================ Functions related to rendering new objects (HTML tags / Three.js objects)

// Genereting <ul></ul> list of plots
function generateList() {
  listOfFunc.innerHTML = "";
  if (scene == scene3D) {
    for (let el of plots3D) {
      const elementOfList = document.createElement("li");
      elementOfList.setAttribute("id", `${el.id}`);
      elementOfList.textContent = `${el.func_string}`;
      listOfFunc.prepend(elementOfList);
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

    plots3D.push(
      renderFunctionMesh(
        functionInput.value,
        x_range,
        y_range,
        z_range,
        (51 + slider.value * -1) / 100,
        scene3D,
        id
      )
    );
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

// ============================ Additional functions
// HSV to RGB converter
function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return [r * 255, g * 255, b * 255];
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
  const sceneLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
  scene.add(sceneLight);

  // Rendering mesh from points
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

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

export { hsvToRgb, colorWheel, idOfElement };
