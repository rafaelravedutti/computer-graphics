"use strict";

///////////////////////////
//// global variables  ////
///////////////////////////

// pixel scale
var pixelScale = 10;

// line
var line = new Line(new Point(10 / pixelScale, 10 / pixelScale),
                    new Point(180 / pixelScale, 180 / pixelScale),
                    new Color(0, 0, 0));

//////////////
//// gui  ////
//////////////

// event listener for gui
function onChangePixelScale(value) {
    // rescale line
    var s = pixelScale / value;
    line.startPoint.x = line.startPoint.x * s;
    line.startPoint.y = line.startPoint.y * s;
    line.endPoint.x = line.endPoint.x * s;
    line.endPoint.y = line.endPoint.y * s;
    // set new scaling factor
    pixelScale = value;
    // rerender scene
    RenderCanvas1();
}

function onMouseDownCanvas1(e) {
    var rect = document.getElementById("canvas1").getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    console.log("onMouseDownCanvas1: " + x + " " + y);

    // set new points
    if (e.ctrlKey) {
        line.endPoint.x = x / pixelScale;
        line.endPoint.y = y / pixelScale;
    }
    else {
        line.startPoint.x = x / pixelScale;
        line.startPoint.y = y / pixelScale;
    }

    // rerender image
    RenderCanvas1();
}


//////////////////////////////
//// bresenham algorithm  ////
//////////////////////////////

function bresenham(image, line) {
    // ensure integer coordinates
    var x0 = Math.floor(line.startPoint.x);
    var y0 = Math.floor(line.startPoint.y);
    var x1 = Math.floor(line.endPoint.x);
    var y1 = Math.floor(line.endPoint.y);

    // TODO 2.1     Write code to draw a line
    //              between the start point and
    //              the end point. To make things
    //              easier, there are some comments
    //              on what to do next:

    // compute deltas and update directions


    // set initial coordinates
    var deltax = Math.abs(x1 - x0), movementx = x0 < x1 ? 1 : -1;
    var deltay = Math.abs(y1 - y0), movementy = y0 < y1 ? 1 : -1;
    var err = (deltax > deltay ? deltax : -deltay)/2;
    var e2;


    // start loop to set nPixels
    var intx0 = Math.floor(x0);
    var intx1 = Math.floor(x1);
    var inty0 = Math.floor(y0);
    var inty1 = Math.floor(y1);

     var nPixels = Math.abs(x1 - x0) + Math.abs(y1 - y0)
    // Math.floor(Math.sqrt((intx1 - intx0)*(intx1 - intx0) + (inty1 - inty0)*(inty1 - inty0)));
    // console.log(nPixels);
    // console.log(line.startPoint)
    // console.log(line.endPoint);

    for (var i = 0; i < nPixels; ++i) {
        // set pixel using the helper function setPixelS()
        setPixelS(image, new Point(x0,y0), new Color(0, 0, 0), pixelScale)

        // update error
        e2 = err;

        // update coordinates depending on the error
        if (e2 > -deltax) { err -= deltay; x0 += movementx; }
        if (e2 < deltay) { err += deltax; y0 += movementy; }


    }
}


//////////////////////////
//// render function  ////
//////////////////////////

function RenderCanvas1() {
    // get canvas handle
    var context = document.getElementById("canvas1").getContext("2d");
    var canvas = context.createImageData(200, 200);

    // clear canvas
    clearImage(canvas, new Color(255, 255, 255));

    // draw line
    bresenham(canvas, line);

    // draw start and end point with different colors
    setPixelS(canvas, line.startPoint, new Color(255, 0, 0), pixelScale);
    setPixelS(canvas, line.endPoint, new Color(0, 255, 0), pixelScale);

    // show image
    context.putImageData(canvas, 0, 0);
}


function setupBresenham(canvas) {
    // execute rendering
    RenderCanvas1();
    // add event listener
    document.getElementById("canvas1").addEventListener('mousedown', onMouseDownCanvas1, false);
}
