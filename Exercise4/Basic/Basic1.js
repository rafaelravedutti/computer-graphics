/////////////////////////////
//////////   helper   ///////
/////////////////////////////
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Triangle(pointA, pointB, pointC) {
    this.a = pointA;
    this.b = pointB;
    this.c = pointC;
}

function Viewport(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
}

function RenderTriangle(context, viewport, triangle, clear) {
    if (clear == undefined) clear = true;
    if (clear) {
        context.rect(viewport.x, viewport.y, viewport.width, viewport.height);
        context.stroke();
    }

    context.beginPath();
    context.moveTo(viewport.width * triangle.a.x + viewport.x, viewport.height * triangle.a.y + viewport.y);
    context.lineTo(viewport.width * triangle.b.x + viewport.x, viewport.height * triangle.b.y + viewport.y);
    context.lineTo(viewport.width * triangle.c.x + viewport.x, viewport.height * triangle.c.y + viewport.y);
    context.lineTo(viewport.width * triangle.a.x + viewport.x, viewport.height * triangle.a.y + viewport.y);
    context.fill();
}

function LinearTransformation(linearPart) {
    this.A = linearPart;
}

function ApplyLinearTransformation(linearTransf, point) {
    return new Point(linearTransf.A[0] * point.x + linearTransf.A[1] * point.y,
                        linearTransf.A[2] * point.x + linearTransf.A[3] * point.y)
}

function CompositeLinearTransformations(linearTransf2, linearTransf1) {
    return new LinearTransformation([linearTransf2.A[0] * linearTransf1.A[0] + linearTransf2.A[1] * linearTransf1.A[2], linearTransf2.A[0] * linearTransf1.A[1] + linearTransf2.A[1] * linearTransf1.A[3],
                                    linearTransf2.A[2] * linearTransf1.A[0] + linearTransf2.A[3] * linearTransf1.A[2], linearTransf2.A[2] * linearTransf1.A[1] + linearTransf2.A[3] * linearTransf1.A[3]]);
}

function AffineTransformation(linearPart, translPart) {
    this.A = linearPart;
    this.t = translPart;
}

function ApplyAffineTransformation(affineTransf, point) {
    return new Point(affineTransf.A[0] * point.x + affineTransf.A[1] * point.y + affineTransf.t[0],
                        affineTransf.A[2] * point.x + affineTransf.A[3] * point.y + affineTransf.t[1])
}

var Basic1_1 = function () {

    function Rotation(alpha) {

        // TODO 4.1a)	Implement a linear transformation
        //			    performing a rotation by the angle
        //			    alpha and replace the following line
        //			    by the appropriate code.
        //  [cos(alpha)   -sin]    [1]
        //  [sin         cos] *  [1]
        let a1 = Math.cos(alpha);
        let a2 = -Math.sin(alpha);
        let a3 = Math.sin(alpha);
        let a4 = Math.cos(alpha);
        return new LinearTransformation([a1, a2, a3, a4]);

    }

    function Scaling(scale) {

        // TODO 4.1a)	Implement a linear transformation
        //			    performing an isotropic scaling by
        //			    the scaling factor scale and replace
        //			    the following line by the appropriate
        //			    code.
        //  [scale   0]    [1]
        //  [0   scale] *  [1]
        let a1 = scale;
        let a2 = 0;
        let a3 = 0;
        let a4 = scale;
        return new LinearTransformation([a1, a2, a3, a4]);

    }

    function ShearingX(shearX) {

        // TODO 4.1a)	Implement a linear transformation
        //			    performing a shear along the x axis.
        //			    Replace the following line by the
        //			    appropriate code.
        //  [1   shearX]
        //  [0        1]
        let a1 = 1;
        let a2 = shearX;
        let a3 = 0;
        let a4 = 1;
        return new LinearTransformation([a1, a2, a3, a4]);

    }

    return {
        start: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 150);
            context.font = "18px Arial";
            context.textAlign = "center";

            context.fillText("input triangle", 75, 140);
            var triangle = new Triangle(new Point(0.2, 0.2), new Point(0.8, 0.2), new Point(0.2, 0.8));
            RenderTriangle(context, new Viewport(150, 150, 0, 0), triangle, 'red');

            context.fillText("rotated triangle", 225, 140);
            var rot = Rotation(0.2);
            var triangleRot = new Triangle(ApplyLinearTransformation(rot, triangle.a),
                                            ApplyLinearTransformation(rot, triangle.b),
                                            ApplyLinearTransformation(rot, triangle.c));
            RenderTriangle(context, new Viewport(150, 150, 150, 0), triangleRot);

            context.fillText("scaled triangle", 375, 140);
            var scaling = Scaling(0.5);
            var triangleScaling = new Triangle(ApplyLinearTransformation(scaling, triangle.a),
                                                ApplyLinearTransformation(scaling, triangle.b),
                                                ApplyLinearTransformation(scaling, triangle.c));
            RenderTriangle(context, new Viewport(150, 150, 300, 0), triangleScaling);

            context.fillText("sheared triangle", 525, 140);
            var shearing = ShearingX(0.4);
            var triangleShearing = new Triangle(ApplyLinearTransformation(shearing, triangle.a),
                                                ApplyLinearTransformation(shearing, triangle.b),
                                                ApplyLinearTransformation(shearing, triangle.c));
            RenderTriangle(context, new Viewport(150, 150, 450, 0), triangleShearing);
        }
    }
}()

var Basic1_2 = function () {

    function ShearingX(shearX) {

        // TODO 4.1b)	Implement a linear transformation
        //			    performing a shear along the x axis.
        //              Replace the following code.
        //  [1   shearX]
        //  [0        1]
        let a1 = 1;
        let a2 = -Math.tan(shearX/2.0);
        let a3 = 0;
        let a4 = 1;
        return new LinearTransformation([a1, a2, a3, a4]);

    }

    function ShearingY(shearY) {

        // TODO 4.1b)	Implement a linear transformation
        //			    performing a shear along the y axis.
        //              Replace the following code.
        //  [1       0]
        //  [shearY  1]
        let a1 = 1;
        let a2 = 0;
        let a3 = Math.sin(shearY);
        let a4 = 1;
        return new LinearTransformation([a1, a2, a3, a4]);

    }

    return {
        start: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 150);
            context.font = "18px Arial";
            context.textAlign = "center";

            context.fillText("input triangle", 75, 140);
            var triangle = new Triangle(new Point(0.2, 0.2), new Point(0.8, 0.2), new Point(0.2, 0.8));
            RenderTriangle(context, new Viewport(150, 150, 0, 0), triangle);

            var alpha = 0.2;

            context.fillText("1. shearing", 225, 140);

            // TODO 4.1b)	Instead of just copying the corner points
            //			    of triangle, call shearingX with the
            //			    corresponding parameters!
            //              Use ApplyLinearTransformation() to transform the corner points.
            var shearingX = ShearingX(alpha)
            var triangle1 = new Triangle(ApplyLinearTransformation(shearingX, triangle.a),
                                                   ApplyLinearTransformation(shearingX, triangle.b),
                                                   ApplyLinearTransformation(shearingX, triangle.c));

            RenderTriangle(context, new Viewport(150, 150, 150, 0), triangle1);

            context.fillText("2. shearing", 375, 140);

            // TODO 4.1b)	Instead of just copying the corner points
            //			    of triangle1, call shearingY with the
            //			    corresponding parameters!
            //              Use ApplyLinearTransformation() to transform the corner points.
            var shearingY = ShearingY(alpha)
            var triangle2 = new Triangle(ApplyLinearTransformation(shearingY, triangle1.a),
                                                   ApplyLinearTransformation(shearingY, triangle1.b),
                                                   ApplyLinearTransformation(shearingY, triangle1.c));

            RenderTriangle(context, new Viewport(150, 150, 300, 0), triangle2);

            context.fillText("3. shearing", 525, 140);

            // TODO 4.1b)	Instead of just copying the corner points
            //			    of triangle2, call shearingX with the
            //			    corresponding parameters!
            //              Use ApplyLinearTransformation() to transform the corner points.
            shearingX = ShearingX(alpha)
            var triangle3 = new Triangle(ApplyLinearTransformation(shearingX, triangle2.a),
                                                   ApplyLinearTransformation(shearingX, triangle2.b),
                                                   ApplyLinearTransformation(shearingX, triangle2.c));


            RenderTriangle(context, new Viewport(150, 150, 450, 0), triangle3);
        }
    }
}()

var Basic1_3 = function () {

  function multiplyMatrix(out, a, b) {
	    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
	        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
	    out[0] = a0 * b0 + a1 * b2;
	    out[1] = a0 * b1 + a1 * b3;
	    out[2] = a2 * b0 + a3 * b2;
	    out[3] = a2 * b1 + a3 * b3;
	    return out;
	}

  function sumArray(out, a, b){
      let a0 = a[0], a1 = a[1];
      let b0 = b[0], b1 = b[1];
      out[0] = a0 + b0;
      out[1] = a1 + b1;
      return out;
  }


  // Not working correctly!!!

    function CompositeAffineTransformations(affineTransf2, affineTransf1) {

        // TODO 4.1c)	Replace the following line by creation
        //			    of the affine transformation equivalent
        //			    to the composition of affineTransf1 and
        //			    affineTransf2.

        let mult = [4], sumT = [2];
        multiplyMatrix(mult, affineTransf1.A, affineTransf2.A);
        sumArray(sumT, affineTransf1.t, affineTransf2.t);
        return new AffineTransformation(mult, sumT);

    }

    return {
        start: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 150);
            context.font = "18px Arial";
            context.textAlign = "center";

            var affineTransformation1 = new AffineTransformation([Math.cos(Math.PI / 12), -Math.sin(Math.PI / 12), Math.sin(Math.PI / 12), Math.cos(Math.PI / 12)], [0.3, 0.0]);
            var affineTransformation2 = new AffineTransformation([Math.cos(-Math.PI / 8), -Math.sin(-Math.PI / 8), Math.sin(-Math.PI / 8), Math.cos(-Math.PI / 8)], [0.0, 0.1]);
            var affineTransformation3 = CompositeAffineTransformations(affineTransformation2, affineTransformation1);

            context.fillText("input triangle", 75, 140);
            var triangle = new Triangle(new Point(0.05, 0.2), new Point(0.65, 0.2), new Point(0.05, 0.8));
            RenderTriangle(context, new Viewport(150, 150, 0, 0), triangle);

            context.fillText("1. transf.", 225, 140);
            var triangle1 = new Triangle(ApplyAffineTransformation(affineTransformation1, triangle.a), ApplyAffineTransformation(affineTransformation1, triangle.b), ApplyAffineTransformation(affineTransformation1, triangle.c));
            RenderTriangle(context, new Viewport(150, 150, 150, 0), triangle1);

            context.fillText("1. then 2. transf.", 375, 140);
            var triangle2 = new Triangle(ApplyAffineTransformation(affineTransformation2, triangle1.a), ApplyAffineTransformation(affineTransformation2, triangle1.b), ApplyAffineTransformation(affineTransformation2, triangle1.c));
            RenderTriangle(context, new Viewport(150, 150, 300, 0), triangle2);

            context.fillText("composite transf.", 525, 140);
            var triangle3 = new Triangle(ApplyAffineTransformation(affineTransformation3, triangle.a), ApplyAffineTransformation(affineTransformation3, triangle.b), ApplyAffineTransformation(affineTransformation3, triangle.c));
            RenderTriangle(context, new Viewport(150, 150, 450, 0), triangle3);
        }
    }
}()

var Basic1_4 = function () {
    function ComputeMapping(triangleTarget) {

        // Note: The original triangle has the fixed vertices (0, 0), (1, 0) and (0, 1).

        // TODO 4.1d) 	Compute the affine transformation that
        //			    transforms the triangle to the target
        //			    triangle triangleTarget!
        return new AffineTransformation([1.0, 0.0, 0.0, 1.0], [0.0, 0.0]);

    }

    return {
        start: function (canvas) {
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, 600, 200);
            context.font = "18px Arial";
            context.textAlign = "center";

            context.fillText("input triangle", 100, 180);
            var triangle = new Triangle(new Point(0, 0), new Point(1, 0), new Point(0, 1));
            RenderTriangle(context, new Viewport(200, 200, 0, 0), triangle);

            context.fillText("target triangle", 500, 180);
            var triangleTarget = new Triangle(new Point(0.2, 0.2), new Point(0.8, 0.0), new Point(0.1, 0.9));
            RenderTriangle(context, new Viewport(200, 200, 400, 0), triangleTarget);

            context.fillText("mapped triangle", 300, 180);
            var affineTransf = ComputeMapping(triangleTarget);
            var triangleTransformed = new Triangle(ApplyAffineTransformation(affineTransf, triangle.a), ApplyAffineTransformation(affineTransf, triangle.b), ApplyAffineTransformation(affineTransf, triangle.c));
            RenderTriangle(context, new Viewport(200, 200, 200, 0), triangleTransformed);
        }
    }
}()
