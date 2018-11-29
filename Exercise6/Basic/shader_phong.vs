precision mediump float;

attribute vec3 vVertex;
attribute vec3 vNormal;

uniform mat4 modelMatrix; // model matrix
uniform mat4 cameraMatrix; // camera matrix
uniform mat4 projectionMatrix; // projection matrix

uniform mat4 normalMatrix;

// TODO 6.2a)	Define a varying variable to
//				pass the normal to the fragment
//				shader.

varying vec3 vectorNormal;

// TODO 6.2a)	Define a varying variable to
//				pass the world position to the
//				fragment shader.
varying vec3 worldPos;


void main(void)
{

	mat4 MVP = projectionMatrix * cameraMatrix * modelMatrix;
	gl_Position = MVP * vec4(vVertex, 1);

	// TODO 6.2a)	Assign the normal to the varying variable.
	//				Before you do so, transform it from model
	//				space to world space. Use the appropriate
	//				matrix. Do not forget to normalize the normal
	//				afterwards.

	// Calculate the world space = multiply by the modelMatrix
	vectorNormal = vec3(modelMatrix*vec4(vNormal, 1.0));
	vectorNormal = normalize(vectorNormal);

	// TODO 6.2a)	Assign the position to the varying variable.
	//				Before you do so, transform it from model
	//				space to world space. Use the appropriate
	//				matrix. Do not forget to dehomogenize it
	//				afterwards.
	vec4 aux_pos = modelMatrix*vec4(vVertex, 1.0);
	worldPos[0] = vVertex[0]/aux_pos[3];
	worldPos[1] = vVertex[1]/aux_pos[3];
	worldPos[2] = vVertex[2]/aux_pos[3];

}
