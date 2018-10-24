"use strict";

///////////////////////////
//// global variables  ////
///////////////////////////

// seed point
var seedPoint = new Point(50, 50);

//////////////
//// gui  ////
//////////////

// event listener for gui
function onMouseDownCanvas2(e) {
    var rect = document.getElementById("canvas2").getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    console.log("onMouseDownCanvas2: " + x + " " + y);

    // set new seed point
    seedPoint.x = Math.floor(x);
    seedPoint.y = Math.floor(y);

    // rerender image
    RenderCanvas2();
}

///////////////////////////////
//// flood fill algorithm  ////
///////////////////////////////
function floodFill4(image, pixel, fillColor) {

    // TODO 2.2a)       Perform the flood fill algorithm,
    //                  taking into account only the four 
    //                  direct neighbours of the pixel. The
    //                  variable "fillColor" denotes the color
    //                  for both the area and the border.

    // get the color at pixel location, use getPixel()



    // base case 
    //       - color channels of the current color are equal to the color channels of the fillColor
    //       - pixel position is out of range



    // set pixel color



    // start recursion (4 neighboring pixels)



}

//////////////////////////
//// render function  ////
//////////////////////////

function RenderCanvas2() {
    // draw something onto the canvas
    var context = document.getElementById("canvas2").getContext("2d");
    context.clearRect(0, 0, 200, 200);
    var canvas = context.getImageData(0, 0, 200, 200);

    var inc = 1;
    for (var i = 1; i < 20; i += inc) {
        for (var j = 0; j < 200; j++) {
            setPixel(canvas, new Point(i * 10, j), new Color(255, 0, 0));
            setPixel(canvas, new Point(j, i * 10), new Color(255, 0, 0));
        }
        inc++;
    }

    // flood fill
    floodFill4(canvas, seedPoint, new Color(255, 0, 0));

    // draw seed point
    setPixel(canvas, seedPoint, new Color(0, 0, 255));

    // show image
    context.putImageData(canvas, 0, 0);
}

function setupFloodFill(canvas) {
    // execute rendering
    RenderCanvas2();
    // add event listener
    document.getElementById("canvas2").addEventListener('mousedown', onMouseDownCanvas2, false);
}
