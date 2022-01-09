let xRightBound;
let xLeftBound;
let xPrecision;
let graphPlotted = false;
let onlyPointsGlobal = false;
let plotColor = "red";

function init(onlyPoints){
    xRightBound = parseInt(document.getElementById("x-right-bound").value) + 1;
    xLeftBound = parseInt(document.getElementById("x-left-bound").value) - 1;
    xPrecision = parseFloat(document.getElementById("x-precision").value);
    plotColor = document.getElementById("plot-color").value;
    onlyPointsGlobal = onlyPoints;
    Draw();
}

let Canvas = document.getElementById("2d-graph");
let Ctx = null;



let Width = Canvas.width;
let Height = Canvas.height;


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
}

// Returns the bottom boundary of the logical viewport
function MinY(){
    return MinX() * Height / Width;
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
        return eval(document.getElementById("function-code").value)
    }
    
    if (Canvas.getContext){
        Ctx = Canvas.getContext("2d");
        Ctx.clearRect(0,0,Width,Height);

        DrawAxes();
        if (onlyPointsGlobal){
            RenderFunctionWithPointsOnly(F)
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
    Ctx.strokeStyle = plotColor;
    Ctx.lineWidth = 2;
    Ctx.stroke();
    graphPlotted = true;
}

function RenderFunctionWithPointsOnly(f){
    let first = true;
    Ctx.beginPath();
    console.log(xPrecision)
    for (let x = MinX(); x <= MaxX(); x += xPrecision){
        let y = f(x);
        if (first){
            Ctx.moveTo(XC(x), YC(y));
            first = false;
        } else {
            Ctx.fillStyle = plotColor;
            if (xPrecision < 0.5)
                Ctx.fillRect(XC(x), YC(y), 3, 3);
            else
                Ctx.fillRect(XC(x), YC(y), 5, 5);
        }
    }   
    Ctx.stroke();
    graphPlotted = true;
}

function noScroll() {
    window.scrollTo(0, 0);
  }
  

function scrollingEvent(){
    window.addEventListener('scroll', noScroll);
    if (graphPlotted){
        Canvas.addEventListener('wheel', function(event)
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
    window.removeEventListener('scroll', noScroll);
}

function downloadPlot(format){
    if (format === "PNG"){
        document.getElementById("downloader_png").download = "image.png";
        document.getElementById("downloader_png").href = document.getElementById("2d-graph").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }else if (format === "JPG"){
        document.getElementById("downloader_jpg").download = "image.jpg";
        document.getElementById("downloader_jpg").href = document.getElementById("2d-graph").toDataURL("image/jpg").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
}