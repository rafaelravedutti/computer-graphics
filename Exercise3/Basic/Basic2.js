function webGLStart(canvas) {

    var gl = canvas.getContext("experimental-webgl");
    if (!gl) alert("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    gl.viewport(0, 0, canvas.width, canvas.height);


    // TODO 3.2a)	Replace the following code so that
    //              the "vertices" array does not only
    //              contain positions of each vertex,
    //              but also colors. The layout should
    //              be as follows:
    //              [p0x,p0y,c0x,c0y,c0z,p1x...
    var vertices = [-.5, -.5, 255,  0,   0,
                     .5, -.5, 0,  255,   0,
                     0, .5,   0,    0, 255];


    //Algorithm to calculate the barycentric coordinates                 
    var a = [-.5, -.5, 255,  0,   0], b = [.5, -.5, 0,  255,   0], c = [ 0, .5,   0,    0, 255];

    var alpha, beta, gama;



    // var bc1 = b[1] - c[1], cb0 = c[0] - b[0], ac0 = a[0] - c[0], ac1 = a[1] - c[1];
    // var ca1 = c[1] - a[1], div = bc1 * ac0 + cb0 * ac1;
    // for(let i = 0; i < canvas.width; ++i){
    //   for(let j = 0; j < canvas.height; ++j){
    //
    //     // calcula distancia barycentrica
    //     ic0 = i - c[0];
    //     alpha = (bc1 * ic0 + cb0 * (j - c[1])) / div;
    //     beta = (ca1 * ic0 + ac0 * (j - c[1])) / div;
    //     gama = 1.0 - alpha - beta;
    //
    //     // if its a point inside the triangle, then insert it.
    //     if(!((!isNaN(alpha) && alpha < 0.0) || (!isNaN(beta) && beta < 0.0) || ((!isNaN(gama) && gama < 0.0)))){
    //       vertices.push(i, j, alpha*a[2] + beta*b[2] + gama*c[2], alpha*a[3] + beta*b[3] + gama*c[3], alpha*a[4] + beta*b[4] + gama*c[4]);
    //       // vertices.push(j);
    //       // // P_RED_intensity = alpha*a[RED] + beta*b[RED] + gama*c[RED]
    //       // vertices.push(alpha*a[2] + beta*b[2] + gama*c[2]);
    //       // // P_GREEN_intensity = alpha*a[GREEN] + beta*b[GREEN] + gama*c[GREEN]
    //       // vertices.push(alpha*a[3] + beta*b[3] + gama*c[3]);
    //       // // P_BLUE_intensity = alpha*a[BLUE] + beta*b[BLUE] + gama*c[BLUE]
    //       // vertices.push(alpha*a[4] + beta*b[4] + gama*c[4]);
    //     }
    //     else{
    //       vertices.push(i);
    //       vertices.push(j);
    //       // P_RED_intensity = alpha*a[RED] + beta*b[RED] + gama*c[RED]
    //       vertices.push(255);
    //       // P_GREEN_intensity = alpha*a[GREEN] + beta*b[GREEN] + gama*c[GREEN]
    //       vertices.push(255);
    //       // P_BLUE_intensity = alpha*a[BLUE] + beta*b[BLUE] + gama*c[BLUE]
    //       vertices.push(255);
    //     }
    //   }
    //
    // }


    var indices = [0, 1, 2];

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var fragmentShader = getShader(gl, "shaderWireFrame-fs");
    var vertexShader = getShader(gl, "shaderWireFrame-vs");

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
        console.error(gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // TODO 3.2a)	Add code to create and enable the second
    //              attribute. Use gl.vertexAttribPointer() to
    //              set offset and stride (in bytes!).
    //              BEWARE: You also have to change the stride
    //              for the position attribute!

    var attrVertexPosition = gl.getAttribLocation(shaderProgram, "vVertex");
    console.log(attrVertexColor);
    gl.enableVertexAttribArray(attrVertexPosition);
    gl.vertexAttribPointer(attrVertexPosition, 2, gl.FLOAT, false, 20, 0);

    /*
      gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, offset);
      stride:     A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes.
       Cannot be larger than 255. If stride is 0, the attribute is assumed to be tightly packed, that is, the attributes are not interleaved but each attribute is in a separate block, and the next vertex' attribute follows immediately after the current vertex.
       offset:    A GLintptr specifying an offset in bytes of the first component in the vertex attribute array.
           Must be a multiple of the byte length of type.
    */
    var attrVertexColor = gl.getAttribLocation(shaderProgram, "colorAtr");
    gl.enableVertexAttribArray(attrVertexColor);
    gl.vertexAttribPointer(attrVertexColor, 3, gl.FLOAT, false, 20, 8);




    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
