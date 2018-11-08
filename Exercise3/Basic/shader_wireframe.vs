
attribute vec2 vVertex;

// 3.2a)	Create an attribute describing the
//				color of a vertex.

attribute vec3 colorAtr;

// 3.2a)	Create an varying variable to
//				pass the interpolated color to
//				the fragment shader.
varying vec3 colorVertex;


void main(void)
{
	gl_Position = vec4(vVertex, 0.0, 1.0);

	// 3.2a)	Assign the color of the vertex
	//				to the varying variable.
	colorVertex = colorAtr;



}
