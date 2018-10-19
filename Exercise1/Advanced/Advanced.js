
/////////////////////////////////////////////
/////////  Complex Number Helpers  //////////
/////////////////////////////////////////////
function ComplexNumber(re, im) {
    this.re = re;
    this.im = im;
}

function ComplexNumberFromCoords(x, y, canvasID) {
    var canvas = document.getElementById(canvasID);
    this.re = (x / (1.0 * canvas.width) - 0.5);
    this.im = (y / (1.0 * canvas.height) - 0.5);
    if (canvasID == 'julia_canvas') {
        this.re *= 3;
        this.im *= 3;
    } else {
        this.re = this.re * 3 * Math.pow(2, zoom) + center.re;
        this.im = this.im * 2 * Math.pow(2, zoom) + center.im;
    }
}

function mult(x, y) {
    var re = (x.re * y.re - x.im * y.im);
    var im = (x.re * y.im + x.im * y.re);
    return new ComplexNumber(re, im);
}

function add(x, y) {
    var re = (x.re + y.re);
    var im = (x.im + y.im);
    return new ComplexNumber(re, im);
}

function sub(x, y) {
    var re = (x.re - y.re);
    var im = (x.im - y.im);
    return new ComplexNumber(re, im);
}

function abs(x) {
    return Math.sqrt(x.re * x.re + x.im * x.im);
}


/////////////////////////////////
/////////  Magic Math  //////////
/////////////////////////////////
function f_c(z, c) {
    return add(mult(z, z), c);
}

function countIterations(start_z, c, max_iter) {
    var z = start_z;
    var abs_z = abs(z);
    var iter = 0;

    while(abs_z < 2.0 && iter < max_iter) {
        z = f_c(z, c);
        abs_z = abs(z);
        iter++;
    }

    if(abs_z < 1.0) {
      return iter;
    }

    return iter + 1 - Math.log(Math.log(abs_z)) / Math.log(2);
}


/////////////////////////////
/////////  Colors  //////////
/////////////////////////////
function getColorForIter(iter) {

    // find out which radio button is checked, i.e. which color scheme is picked
    var colorscheme;
    var colorlevel;
    var radios = document.getElementsByName('colors');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            colorscheme = radios[i].value;
            break;
        }
    }

    if(iter >= max_iter) {
        return [0, 0, 0];
    }

    // color level based on the number of iterations
    color_level = (1.0 - (iter / max_iter)) * 255;

    // return color according to chosen color scheme
    var color = [128, 128, 128];
    if (colorscheme == "black & white") {
        return [255, 255, 255];
    } else if (colorscheme == "greyscale") {
        return [color_level, color_level, color_level];
    } else if (colorscheme == "underwater") {
        return [0, 255 - color_level, color_level];
    } else { // rainbow
        // hue level based on the number of iterations
        hue_level = ((iter / max_iter) * 360.0) + 240.0;

        if(hue_level > 360.0) {
          hue_level -= 360.0;
        }

        return hsv2rgb([hue_level, 1.0, 1.0])
    }

    return color;

}


function hsv2rgb(hsv) {
    var h = hsv[0];
    var s = hsv[1];
    var v = hsv[2];

    var c = v * s;
    var m = v - c;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));

    rgb = [m, m, m]

    if(h < 60) {
      rgb[0] += c, rgb[1] += x;
    } else if(h < 120) {
      rgb[0] += x, rgb[1] += c;
    } else if(h < 180) {
      rgb[1] += c, rgb[2] += x;
    } else if(h < 240) {
      rgb[1] += x, rgb[2] += c;
    } else if(h < 300) {
      rgb[0] += x, rgb[2] += c;
    } else if(h < 360) {
      rgb[0] += c, rgb[2] += x;
    }

    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;

    return rgb;
}


/////////////////////////////////////
/////////  Canvas Fillers  //////////
/////////////////////////////////////
function mandelbrotSet(image) {

    for (var i = 0; i < 4 * image.width * image.height; i += 4) {
        var pixel = i / 4;
        var x = pixel % image.width;
        var y = image.height - pixel / image.width;

        var z = new ComplexNumber(0, 0);
        var c = new ComplexNumberFromCoords(x, y, 'mandelbrot_canvas');
        var rgb = getColorForIter(countIterations(z, c, max_iter));

        image.data[i] = rgb[0];
        image.data[i + 1] = rgb[1];
        image.data[i + 2] = rgb[2];
        image.data[i + 3] = 255;
    }
}

function juliaSet(image) {

    for (var i = 0; i < 4 * image.width * image.height; i += 4) {
        var pixel = i / 4;
        var x = pixel % image.width;
        var y = image.height - pixel / image.width;

        // TODO 1.4d):       Replace the following line by creation of the
        //                  Julia set for c = juliaC (global variable). Use
        //                  functions ComplexNumber(),
        //                  countIterations() and getColorForIter().
        var rgb = [128, 128, 128];



        image.data[i] = rgb[0];
        image.data[i + 1] = rgb[1];
        image.data[i + 2] = rgb[2];
        image.data[i + 3] = 255;
    }
}

///////////////////////////////
/////////  Renderers  //////////
///////////////////////////////
function RenderMandelbrotSet() {
    // get the canvas
    var canvas = document.getElementById("mandelbrot_canvas");
    c = canvas.getContext("2d");

    // create a new image
    image = c.createImageData(canvas.width, canvas.height);

    // render Mandelbrot set
    mandelbrotSet(image);

    // write image back to canvas
    c.putImageData(image, 0, 0);
}

function RenderJuliaSet() {
    // get the canvas
    var canvas = document.getElementById("julia_canvas");
    c = canvas.getContext("2d");

    // create a new image
    image = c.createImageData(canvas.width, canvas.height);

    // render Julia set
    juliaSet(image);

    // write image back to canvas
    c.putImageData(image, 0, 0);
}


///////////////////////////////
//////////   "main"   /////////
///////////////////////////////

// maximum iteration number for Mandelbrot computation
var max_iter = 30;

// coordinate system center
var center = new ComplexNumber(-0.5, 0);

// zoom stage
var zoom = 0;

// flag to show if mouse is pressed
var dragging = false;

// helper variables for Julia set line
var firstLinePointSet = false;
var firstLinePoint;
var secondLinePoint;
var loopVariable = 0;
var looper = null;

// helper variable for moving around
var lastPoint;

// c for Julia set creation
var juliaC = new ComplexNumber(0.4, 0.1);

function setupMandelbrot(canvas) {
    // reset color scheme and maximum iteration number
    var radios = document.getElementsByName('colors');
    radios[0].checked = true;
    var slider = document.getElementById('slider');
    slider.value = 30;

    // render
    RenderMandelbrotSet();
    RenderJuliaSet();

    // add event listeners
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('DOMMouseScroll', onMouseWheel, false);

}


//////////////////////////////////////
//////////   Event Listeners   ///////
//////////////////////////////////////
function onMouseDown(e) {

    var canvas = document.getElementById("mandelbrot_canvas");
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    y = canvas.height - y;

    if (e.ctrlKey) {
        // choose new c for Julia set creation
        clearInterval(looper);
        juliaC = new ComplexNumberFromCoords(x, y, 'mandelbrot_canvas');
        RenderJuliaSet();
    } else if (e.shiftKey) {
        if (firstLinePointSet == false) {
            firstLinePointSet = true;
            firstLinePoint = [x, y];
            RenderMandelbrotSet();
            clearInterval(looper);
        } else {
            firstLinePointSet = false;
            secondLinePoint = [x, y];
            var c = document.getElementById('mandelbrot_canvas');
            var ctx = c.getContext("2d");
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgb(255,255,255)";
            ctx.moveTo(Math.round(firstLinePoint[0]), canvas.height - Math.round(firstLinePoint[1]));
            ctx.lineTo(Math.round(secondLinePoint[0]), canvas.height - Math.round(secondLinePoint[1]));
            ctx.stroke();
            looper = setInterval(juliaLoop, 20);
            loopVariable = 0;
        }
    } else {
        lastPoint = [x, y];
        dragging = true;
    }

}


function juliaLoop() {
    var alpha = 0.5 * Math.sin(loopVariable * 0.05) + 0.5; // oscillating between 0 and 1
    juliaC = new ComplexNumberFromCoords((1 - alpha) * firstLinePoint[0] + alpha * secondLinePoint[0], (1 - alpha) * firstLinePoint[1] + alpha * secondLinePoint[1], 'mandelbrot_canvas');
    RenderJuliaSet();
    loopVariable++;
}


function onMouseMove(e) {
    if (dragging) {
        var canvas = document.getElementById("mandelbrot_canvas");
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        y = canvas.height - y;

        var moveFactor = 100.0;
        var lastPointCoord = new ComplexNumber(lastPoint[0] / moveFactor, lastPoint[1] / moveFactor);
        var currentPointCoord = new ComplexNumber(x / moveFactor, y / moveFactor);

        center = add(center, sub(lastPointCoord, currentPointCoord));

        // rerender image
        RenderMandelbrotSet();
    }
}

function onMouseUp(e) {
    dragging = false;
}

function onMouseWheel(e) {
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    zoom = zoom + delta;

    // render
    RenderMandelbrotSet();

    // do not scroll the page
    e.preventDefault();
}

function onChangeMaxIter(value) {
    max_iter = value;

    // render
    RenderMandelbrotSet();
    RenderJuliaSet();
}

function onChangeColorScheme() {
    // render
    RenderMandelbrotSet();
    RenderJuliaSet();
}
