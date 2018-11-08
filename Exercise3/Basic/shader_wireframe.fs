precision mediump float;

// 3.2a)	Define the varying variable again
//				using the same name to enable
//				communication between vertex and
//				fragment shader.

varying vec3 colorVertex;

void main(void)
{

	float epsilon = 0.01;

	// 3.2a)	Give each pixel the interpolated
	//				triangle color.
	gl_FragColor = vec4(colorVertex, 1.0);

	// 3.2b)	Use the color as barycentric coordinates
	//				and discard all pixels not considered
	//				edges (farther away from an edge than
	//				epsilon). Use the GLSL mechanism 'discard'.

	if( !(colorVertex[0] <= epsilon || colorVertex[1] <= epsilon || colorVertex[2] <= epsilon))
			discard;


}
