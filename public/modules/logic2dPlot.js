import {colorWheel} from "../client.js"
import { plot2D } from "../classes/plot2D.js"
import Formula from 'fparser';

const container2D = document.getElementById("container2D")
const canvas_2d = document.getElementById("2d-graph");
const slideZoomContainer = document.getElementsByClassName("slideZoomContainer")[0]

let onlyPointsGlobal = false;
let Ctx = null;
let Width = canvas_2d.width;
let Height = canvas_2d.height;
const xRange = document.getElementById("X");
let xLeftBound = parseFloat(xRange.querySelector("#minRangeInput").value);
let xRightBound = parseFloat(xRange.querySelector("#maxRangeInput").value);
let xPrecision = document.getElementById("Efficiency").value;
let plots2D = []

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

// Calculate f(x) from given function formula
let calculatePoint = function(x){
    const fObj = new Formula(document.getElementById('input').value);
    let y = fObj.evaluate({x:x});
    return y;
}

// Draw axes and then draw points or whole function
function Draw(){
  if (canvas_2d.getContext){
      Ctx = canvas_2d.getContext("2d");
      Ctx.clearRect(0,0,Width,Height);  // Reset the whole canvas 

      DrawAxes();
      if (onlyPointsGlobal){
        RenderFunctionWithPointsOnly(calculatePoint)
      }else{
        RenderFunction(calculatePoint);
      }
      
  }
  let colorFromColorPickerInRgb = hsvToRgb(colorWheel.color.$["h"] / 360, colorWheel.color.$["s"] / 100, colorWheel.color.$["v"] / 100)
  let color = `rgb(${colorFromColorPickerInRgb[0]}, ${colorFromColorPickerInRgb[1]}, ${colorFromColorPickerInRgb[2]})`;
  let plot = new plot2D(document.getElementById('input').value, color)
  console.log(plot)
  return plot
}

// Draw axes and draw function from Plot2D in list
function DrawFromPlotList(){
    for(let i=0; i < plots2D.length; i++){
      let F = function(x){
        try{
          const fObj = new Formula(plots2D[i].func_string);
          let y = fObj.evaluate({x:x});
          return y;
        }
        catch(error){
          console.log(error)
        }
      }
      if (canvas_2d.getContext){
        Ctx = canvas_2d.getContext("2d");
        DrawAxes();
        if (onlyPointsGlobal){
          RenderFunctionWithPointsOnlyFromList(F, plots2D[i].color)
        }else{
          RenderFunctionFromList(F, plots2D[i].color);
        }
      }
    }
  }

// Tick on X axes
function XTickDelta(){
  return 1;
}

// Tick on Y axes
function YTickDelta(){
  return 1;
}

// Draw axes
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

// Render function from given f function
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

// Render function from Plot2D objects 
function RenderFunctionFromList(f, color){
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
  Ctx.strokeStyle = color
  Ctx.lineWidth = 2;
  Ctx.stroke();
}

// Render points from given function
function RenderFunctionWithPointsOnly(f){
  let first = true;
  let colorFromColorPickerInRgb = hsvToRgb(colorWheel.color.$["h"] / 360, colorWheel.color.$["s"] / 100, colorWheel.color.$["v"] / 100)
  let color = `rgb(${colorFromColorPickerInRgb[0]}, ${colorFromColorPickerInRgb[1]}, ${colorFromColorPickerInRgb[2]})`;
  Ctx.beginPath();
  xPrecision =  document.getElementById("Efficiency").value / 100;
  console.log(xPrecision)
  for (let x = MinX(); x <= MaxX(); x += xPrecision){
      let y = f(x);
      if (first){
          Ctx.moveTo(XC(x), YC(y));
          first = false;
      } else {
          Ctx.fillStyle = color;
          if (xPrecision < 0.5)
              Ctx.fillRect(XC(x), YC(y), 3, 3);
          else
              Ctx.fillRect(XC(x), YC(y), 5, 5);
      }
  }   
  Ctx.stroke();
}
// Render points of Plot2D object function string
function RenderFunctionWithPointsOnlyFromList(f, color){
  let first = true;
  Ctx.beginPath();
  xPrecision =  document.getElementById("Efficiency").value / 100;
  console.log(xPrecision)
  for (let x = MinX(); x <= MaxX(); x += xPrecision){
      let y = f(x);
      if (first){
          Ctx.moveTo(XC(x), YC(y));
          first = false;
      } else {
          Ctx.fillStyle = color;
          if (xPrecision < 0.5)
              Ctx.fillRect(XC(x), YC(y), 3, 3);
          else
              Ctx.fillRect(XC(x), YC(y), 5, 5);
      }
  }   
  Ctx.stroke();
}

// zooming plot on mouse scroll
function scrollingEvent(){
    canvas_2d.addEventListener('wheel', function(event)
    {
        if (event.deltaY < 0)
        {
            // scrolling up
            
            if (xRightBound <= 20 && xLeftBound >= -20){
                Ctx.clearRect(0,0,Width,Height);
                xRightBound++;
                xLeftBound--;
                DrawFromPlotList()
            }
        }
        else if (event.deltaY > 0)
        {
            // scrolling down
            if (xRightBound >= 3 && xLeftBound <= -3){
                Ctx.clearRect(0,0,Width,Height);
                xRightBound--;
                xLeftBound++;
                DrawFromPlotList();
            }
        }
    });
}

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

function generatePlot2D(){
  xLeftBound = parseFloat(xRange.querySelector("#minRangeInput").value);
  xRightBound = parseFloat(xRange.querySelector("#maxRangeInput").value);
  canvas_2d.onmouseover = scrollingEvent();
  plots2D.push(Draw());
  console.log(plots2D)
  if (plots2D.length >= 2){
    DrawFromPlotList();
  }
}

function resizeCanvas() {
  if ((window.innerWidth - 100 > 600 && window.innerWidth - 100 < 1200) || window.innerHeight - 100 > 400){
    container2D.style.width = window.innerWidth+"px";
    container2D.style.height = window.innerHeight+"px";
    canvas_2d.width = window.innerWidth - 100;
    canvas_2d.height = window.innerHeight - 200;
    Width = canvas_2d.width;
    Height = canvas_2d.height;
    if (plots2D.length >= 1){
      DrawFromPlotList()
    }else{
      DrawFirstAxes();
    }
  }
}

window.addEventListener("resize", resizeCanvas);

export { DrawFirstAxes, MaxX, MinX, MaxY, MinY, XC, YC, Draw, DrawFromPlotList, XTickDelta, YTickDelta, DrawAxes, RenderFunction, RenderFunctionFromList, RenderFunctionWithPointsOnly, RenderFunctionWithPointsOnlyFromList, scrollingEvent, generatePlot2D, plots2D, calculatePoint }
