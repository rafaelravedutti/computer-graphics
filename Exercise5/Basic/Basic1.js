function arrow(context, fromx, fromy, tox, toy) {
    // http://stuff.titus-c.ch/arrow.html
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

var Basic1_1 = function () {

    function OrthogonalProjection2D(point2D) {
        // 5.1a)   Implement the orthogonal projection.
        //              The camera orientation is aligned with
        //              the global coordinate system, the view
        //              direction is the z axis. Note that point2D[0]
        //              is the x component and point2D[1] is the z
        //              component (Hint: have a look at the bottom left
        //              of the output image, there you will see the x-z axis).
        return point2D[0];

    }

    return {
        start: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 300);
            context.font = "bold 12px Georgia";
            context.textAlign = "center";

            // polygon - in world space
            var color = [0, 255, 0];
            var polygon = [[100, 400], [100, 500], [200, 500], [200, 400]];

            // draw polygon
            context.strokeStyle = 'rgb(0,0,0)';
            context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            context.beginPath();
            context.moveTo(polygon[polygon.length - 1][1], polygon[polygon.length - 1][0]);
            for (var i = 0; i < polygon.length; ++i) context.lineTo(polygon[i][1], polygon[i][0]);
            context.fill();
            context.stroke();

            // draw image plane
            var imagePlane = 150;
            context.fillStyle = 'rgb(0,0,0)';
            context.fillText("image plane", imagePlane, 290);
            context.strokeStyle = 'rgb(100,100,100)';
            context.beginPath();
            context.moveTo(imagePlane, 0);
            context.lineTo(imagePlane, 270);
            context.stroke();

            // project polygon onto the image plane
            var polygonProjected = new Array();
            for (var i = 0; i < polygon.length; ++i) polygonProjected.push(OrthogonalProjection2D(polygon[i]));

            // draw projected polygon
            context.strokeStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            context.beginPath();
            context.moveTo(imagePlane, polygonProjected[polygonProjected.length - 1]);
            for (var i = 0; i < polygonProjected.length; ++i) context.lineTo(imagePlane, polygonProjected[i]);
            context.stroke();

            // draw projection lines
            context.setLineDash([3, 3]);
            context.strokeStyle = 'rgb(100,100,100)';
            context.beginPath();
            for (var i = 0; i < polygonProjected.length; ++i) {
                context.moveTo(polygon[i][1], polygon[i][0]);
                context.lineTo(imagePlane, polygonProjected[i]);
            }
            context.stroke();
            context.setLineDash([1, 0]);

            // draw axis
            arrow(context, 15, 285, 15, 255);
            arrow(context, 15, 285, 45, 285);
            context.fillStyle = 'rgb(0,0,0)';
            context.fillText("X", 5, 260);
            context.fillText("Z", 45, 297);
        }
    }
}()

var Basic1_2 = function () {

    function PerspectiveProjection2D(eye, imagePlane, point2D) {
        // 5.1b)   Implement the perspective projection assuming
        //              the center of the camera lies in (eye[0], eye[1]).
        //              The camera orientation is aligned with the global
        //              coordinate system. Note that eye, point2D, imagePlane
        //              are all in world space. You first have to transform
        //              everything to camera space. The variable 'imagePlane'
        //              gives you the z value of the image plane (You also have
        //              to transform it to camera space coordinates.).
        //center of the camera lies in (eye[0], eye[1])
        //imagePlane = z distance value

        //  Transforming to camera space: new point = Rotation*(point - camera)
        // as the orientation is the same, no rotation!
        let new_pointX = point2D[0] - eye[0];
        let new_pointZ = point2D[1] - eye[1];

        //To calculate the projection(for 3D->2D): (X,Y,Z) -> (x,y) in plane Z, distance f
        // (x, y) = (f*(x/z), f*(y/z))
        // Then for 2D -> 1D: (x,z) -> (x) plane Z, distance imagePlane
        // (x) = imagePlane * (x/z)

        return imagePlane*new_pointX/new_pointZ;

    }

    return {
        start: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 300);
            context.font = "bold 12px Georgia";
            context.textAlign = "center";

            // polygon - in world space
            var color = [0, 255, 0];
            var polygon = [[100, 400], [100, 500], [200, 500], [200, 400]];

            // draw polygon
            context.strokeStyle = 'rgb(0,0,0)';
            context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            context.beginPath();
            context.moveTo(polygon[polygon.length - 1][1], polygon[polygon.length - 1][0]);
            for (var i = 0; i < polygon.length; ++i) context.lineTo(polygon[i][1], polygon[i][0]);
            context.fill();
            context.stroke();

            // draw image plane
            var eye = [150, 10];
            var imagePlane = 150;
            context.fillStyle = 'rgb(0,0,0)';
            context.fillText("image plane", imagePlane, 290);
            context.strokeStyle = 'rgb(100,100,100)';
            context.beginPath();
            context.moveTo(imagePlane, 0);
            context.lineTo(imagePlane, 270);
            context.stroke();
            context.beginPath();
            context.arc(eye[1], eye[0], 4, 0, 2 * Math.PI);
            context.fill();

            // project polygon onto the image plane
            var polygonProjected = new Array();
            for (var i = 0; i < polygon.length; ++i) polygonProjected.push(PerspectiveProjection2D(eye, imagePlane, polygon[i]));

            // draw projected polygon
            context.strokeStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            context.beginPath();
            context.moveTo(imagePlane, polygonProjected[polygonProjected.length - 1] + eye[0]);
            for (var i = 0; i < polygonProjected.length; ++i) context.lineTo(imagePlane, polygonProjected[i] + eye[0]);
            context.stroke();

            // draw projection lines
            context.setLineDash([3, 3]);
            context.strokeStyle = 'rgb(100,100,100)';
            context.beginPath();
            for (var i = 0; i < polygonProjected.length; ++i) {
                context.moveTo(polygon[i][1], polygon[i][0]);
                context.lineTo(imagePlane, polygonProjected[i] + eye[0]);
            }
            context.stroke();
            context.setLineDash([1, 0]);

            // draw axis
            arrow(context, eye[1], eye[0], eye[1], eye[0] - 30);
            arrow(context, eye[1], eye[0], eye[1] + 30, eye[0]);
            context.fillStyle = 'rgb(0,0,0)';
            context.fillText("X", eye[1], eye[0] - 35);
            context.fillText("Z", eye[1] + 35, eye[0]);
        }
    }
}()

// compute a perspective transformation
// that perspectively maps the 2D space onto a 1D line
mat3.perspective = function (out, fovy, near, far) {
    // 5.1c)   Set up the projection matrix, parameterized
    //              with the variables fovy, near and far.
    //              Use the OpenGL style to set up the matrix
    //              (as in the lecture), i.e. the camera looks
    //              into the negative view direction.

    bt = near * Math.tan(fovy / 2);

    out[0] = (2 * near) / (2 * bt);
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -(far + near) / (far - near);
    out[5] = -(2 * far * near) / (far - near);
    out[6] = 0;
    out[7] = -1;
    out[8] = 0;

    return out;

};


function Camera() {
    this.eye = [150, 10];
    this.fovy = 30.0 / 180.0 * Math.PI;
    this.near = 150;
    this.far = 500;
    this.lookAtPoint = [150, 450];

    // the cameraMatrix transforms from world space to camera space
    this.cameraMatrix = mat3.create();
    // the cameraMatrixInverse transforms from camera space to world space
    this.cameraMatrixInverse = mat3.create();
    // projection matrix
    this.projectionMatrix = mat3.create();

    // setup matrices
    this.update();
}

Camera.prototype.lookAt = function (point2D) {
    this.lookAtPoint = [point2D[0], point2D[1]];
    this.update();
};

Camera.prototype.setEye = function (eye2D) {
    this.eye[0] = eye2D[0];
    this.eye[1] = eye2D[1];
    this.update();
};

Camera.prototype.update = function () {
    // note: opengl looks into the negative viewDir!
    var negViewDir = vec2.create();
    negViewDir[0] = this.eye[0] - this.lookAtPoint[0];
    negViewDir[1] = this.eye[1] - this.lookAtPoint[1];
    vec2.normalize(negViewDir, negViewDir);


    // 5.1c)   Set up the camera matrix and the inverse camera matrix.
    //              The cameraMatrix transforms from world space to camera space.
    //              The cameraMatrixInverse transforms from camera space to world space.
    //              You can use gl-matrix.js where necessary.
    this.cameraMatrix = mat3.fromValues(
      -1, 0, this.eye[0],
      0, -1, -this.eye[1],
      0, 0, 1
    );

    this.cameraMatrixInverse = mat3.fromValues(
      -1, 0, this.eye[0],
      0, -1, this.eye[1],
      this.eye[0], this.eye[1], 1
    );


    // 5.1c)   Set up the projection matrix using mat3.perspective(...),
    //              which has to be implemented!
    this.projectionMatrix = mat3.perspective(this.projectionMatrix, this.fovy, this.near, this.far);

};

  function multiplyArrayMatrix(matrix, array, out){
    out[0] = array[0] * matrix[0] + array[1]* matrix[1] + array[2] * matrix[2];
    out[1] = array[0] * matrix[3] + array[1]* matrix[4] + array[2] * matrix[5];
    out[2] = array[0] * matrix[6] + array[1]* matrix[7] + array[2] * matrix[8];
    return out;
  }

Camera.prototype.projectPoint = function (point2D) {
    // this function projects a point form world space coordinates to the canonical viewing volume


    // 5.1c)   Use this.cameraMatrix to transform the point to
    //              camera space (Use homogeneous coordinates!). Then,
    //              use this.projectionMatrix to apply the projection.
    //              Don't forget to dehomogenize the projected point
    //              before returning it! You can use gl-matrix.js where
    //              necessary.

    // point2D -> homogeneous coordinates
    var newPoint = [point2D[0], point2D[1], 1];
    // newPoint * cameraMatrix
    var newPoint2 = new Array(3);
    newPoint2 = multiplyArrayMatrix(this.cameraMatrix, newPoint, newPoint2);
    // newPoint2 * projectionMatrix
    newPoint = multiplyArrayMatrix(this.projectionMatrix, newPoint2, newPoint);

    // dehomogenize new Point

    return [newPoint[0]/newPoint[2], (newPoint[1]/newPoint[2])-1];

}

Camera.prototype.render = function (context) {
    // near plane
    var p_near_0 = vec3.create();
    vec3.transformMat3(p_near_0, [this.near * Math.sin(this.fovy / 2), -this.near, 1.0], this.cameraMatrixInverse);
    var p_near_1 = vec3.create();
    vec3.transformMat3(p_near_1, [-this.near * Math.sin(this.fovy / 2), -this.near, 1.0], this.cameraMatrixInverse);
    // far plane
    var p_far_0 = vec3.create();
    vec3.transformMat3(p_far_0, [this.far * Math.sin(this.fovy / 2), -this.far, 1.0], this.cameraMatrixInverse);
    var p_far_1 = vec3.create();
    vec3.transformMat3(p_far_1, [-this.far * Math.sin(this.fovy / 2), -this.far, 1.0], this.cameraMatrixInverse);

    // render frustum
    context.fillStyle = 'rgb(0,0,0)';
    context.lineWidth = 1;
    context.fillText("near plane", p_near_1[1], p_near_1[0] + 20);
    context.fillText("far plane", p_far_1[1], p_far_1[0] + 20);
    context.strokeStyle = 'rgb(100,100,100)';
    context.fillStyle = 'rgb(240,240,240)';
    context.beginPath();
    context.moveTo(p_near_0[1], p_near_0[0]);
    context.lineTo(p_near_1[1], p_near_1[0]);
    context.lineTo(p_far_1[1], p_far_1[0]);
    context.lineTo(p_far_0[1], p_far_0[0]);
    context.lineTo(p_near_0[1], p_near_0[0]);
    context.fill();
    context.stroke();

    // render eye
    context.fillStyle = 'rgb(0,0,0)';
    context.beginPath();
    context.fillText("eye", this.eye[1], this.eye[0] + 20);
    context.arc(this.eye[1], this.eye[0], 4, 0, 2 * Math.PI);
    context.arc(this.lookAtPoint[1], this.lookAtPoint[0], 4, 0, 2 * Math.PI);
    context.fill();
};

Camera.prototype.enableFrustumClipping = function (context) {
    // near plane
    var p_near_0 = vec3.create();
    vec3.transformMat3(p_near_0, [this.near * Math.sin(this.fovy / 2), -this.near, 1.0], this.cameraMatrixInverse);
    var p_near_1 = vec3.create();
    vec3.transformMat3(p_near_1, [-this.near * Math.sin(this.fovy / 2), -this.near, 1.0], this.cameraMatrixInverse);
    // far plane
    var p_far_0 = vec3.create();
    vec3.transformMat3(p_far_0, [this.far * Math.sin(this.fovy / 2), -this.far, 1.0], this.cameraMatrixInverse);
    var p_far_1 = vec3.create();
    vec3.transformMat3(p_far_1, [-this.far * Math.sin(this.fovy / 2), -this.far, 1.0], this.cameraMatrixInverse);

    context.save();
    context.lineWidth = 1;
    context.strokeStyle = 'rgb(100,100,100)';
    context.beginPath();
    context.moveTo(p_near_0[1], p_near_0[0]);
    context.lineTo(p_near_1[1], p_near_1[0]);
    context.lineTo(p_far_1[1], p_far_1[0]);
    context.lineTo(p_far_0[1], p_far_0[0]);
    context.lineTo(p_near_0[1], p_near_0[0]);
    context.stroke();
    context.clip();
}

Camera.prototype.disableFrustumClipping = function (context) {
    context.restore();
}

Camera.prototype.getWorldPointOnScreen = function (screenCoordinate) {
    var inverse = this.cameraMatrixInverse;
    // near plane
    var p_near_0 = vec3.create();
    vec3.transformMat3(p_near_0, [this.near * Math.sin(this.fovy / 2), -this.near, 1.0], inverse);
    var p_near_1 = vec3.create();
    vec3.transformMat3(p_near_1, [-this.near * Math.sin(this.fovy / 2), -this.near, 1.0], inverse);

    var alpha = screenCoordinate / 2.0 + 0.5;

    return [alpha * p_near_0[0] + (1.0 - alpha) * p_near_1[0],
            alpha * p_near_0[1] + (1.0 - alpha) * p_near_1[1]];
}

var Basic1_3 = function () {

    var init = true;
    var canvas;
    var camera = new Camera();

    return {
        start: function (_canvas) {
            if (init) {
                canvas = _canvas;
                canvas.addEventListener('mousedown', onMouseDown, false);
                init = false;
            }
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 300);
            context.font = "bold 12px Georgia";
            context.textAlign = "center";

            // polygon - coordinates in world space
            var color = [0, 255, 0];
            var polygon = [[100, 400], [100, 500], [200, 500], [200, 400]];

            // draw camera
            camera.render(context);

            // draw polygon
            context.strokeStyle = 'rgb(0,0,0)';
            context.fillStyle = 'rgb(255,0,0)';
            context.beginPath();
            context.moveTo(polygon[polygon.length - 1][1], polygon[polygon.length - 1][0]);
            for (var i = 0; i < polygon.length; ++i) context.lineTo(polygon[i][1], polygon[i][0]);
            context.fill();
            context.stroke();

            camera.enableFrustumClipping(context);
            context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            context.beginPath();
            context.moveTo(polygon[polygon.length - 1][1], polygon[polygon.length - 1][0]);
            for (var i = 0; i < polygon.length; ++i) context.lineTo(polygon[i][1], polygon[i][0]);
            context.fill();
            context.stroke();
            camera.disableFrustumClipping(context);


            // project polygon onto the image plane
            var polygonProjected = new Array();
            for (var i = 0; i < polygon.length; ++i)
                polygonProjected.push(camera.projectPoint(polygon[i]));

            // draw projected polygon
            context.strokeStyle = 'rgb(255, 0, 0)';
            context.beginPath();
            var pointOnScreen1D = camera.getWorldPointOnScreen(polygonProjected[polygonProjected.length - 1][0]);
            context.moveTo(pointOnScreen1D[1], pointOnScreen1D[0]);
            for (var i = 0; i < polygonProjected.length; ++i) {
                pointOnScreen1D = camera.getWorldPointOnScreen(polygonProjected[i][0]);
                context.lineTo(pointOnScreen1D[1], pointOnScreen1D[0]);
            }
            context.stroke();

            camera.enableFrustumClipping(context);
            context.lineWidth = 4;
            context.strokeStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            context.beginPath();
            var pointOnScreen1D = camera.getWorldPointOnScreen(polygonProjected[polygonProjected.length - 1][0]);
            context.moveTo(pointOnScreen1D[1], pointOnScreen1D[0]);
            for (var i = 0; i < polygonProjected.length; ++i) {
                pointOnScreen1D = camera.getWorldPointOnScreen(polygonProjected[i][0]);
                context.lineTo(pointOnScreen1D[1], pointOnScreen1D[0]);
            }
            context.stroke();
            camera.disableFrustumClipping(context);
            context.lineWidth = 1;

            // draw projection lines
            context.setLineDash([3, 3]);
            context.strokeStyle = 'rgb(100,100,100)';
            context.beginPath();
            for (var i = 0; i < polygonProjected.length; ++i) {
                context.moveTo(polygon[i][1], polygon[i][0]);
                pointOnScreen1D = camera.getWorldPointOnScreen(polygonProjected[i][0]);
                context.lineTo(pointOnScreen1D[1], pointOnScreen1D[0]);

                // debug code to see the projection lines from vertex to eye
                // these lines should coincide with the projection lines ending at the image plane
                //context.moveTo(polygon[i][1], polygon[i][0]);
                //context.lineTo(camera.eye[1], camera.eye[0]);
            }
            context.stroke();
            context.setLineDash([1, 0]);


            // draw homogeneous coordinate system
            var offset = [0, 0];
            var dim = [120, 120];
            context.save();
            context.beginPath();
            context.rect(offset[1], offset[0], dim[1], dim[0]);
            context.clip();
            context.strokeStyle = 'rgb(100,100,100)';
            context.fillStyle = 'rgb(240,240,240)';
            context.beginPath();
            context.rect(offset[1], offset[0], dim[1], dim[0]);
            context.fill();
            context.stroke();
            context.beginPath();
            context.strokeStyle = 'rgb(0,0,0)';
            context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            var p = [(-polygonProjected[polygonProjected.length - 1][0] / 2 + 0.5) * dim[0] + offset[0],
                        (polygonProjected[polygonProjected.length - 1][1] / 2 + 0.5) * dim[1] + offset[1]];
            context.moveTo(p[1], p[0]);
            for (var i = 0; i < polygonProjected.length; ++i) {
                p = [(-polygonProjected[i][0] / 2 + 0.5) * dim[0] + offset[0],
                        (polygonProjected[i][1] / 2 + 0.5) * dim[1] + offset[1]];
                context.lineTo(p[1], p[0]);
            }
            context.fill();
            context.stroke();
            context.fillStyle = 'rgb(0,0,0)';
            context.fillText("Canonical Volume", offset[1] + dim[1] / 2, offset[0] + dim[0] - 4);
            context.restore();

            // draw axis
            arrow(context, 15, 285, 15, 255);
            arrow(context, 15, 285, 45, 285);
            context.fillStyle = 'rgb(0,0,0)';
            context.fillText("X", 5, 260);
            context.fillText("Z", 45, 297);
        }
    }



    function onMouseDown(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        if (e.ctrlKey) {
            camera.lookAt([y, x]);
        } else {
            camera.setEye([y, x]);
        }

        Basic1_3.start(canvas);
    }
}()
