precision mediump float;

uniform mat4 cameraMatrixInverse;

uniform vec3 color;
uniform vec3 lightPosition;
uniform float shiny;

uniform bool ambient;
uniform bool diffuse;
uniform bool specular;

// 6.2a)	Define a varying variable with
//				the same name as in the vertex
//				shader to pass the normal.
varying vec3 vectorNormal;

// 6.2a)	Define a varying variable with
//				the same name as in the vertex
//				shader to pass the position.
varying vec3 worldPos;


void main(void)
{
	// I_in and I_amb are white, so you can ignore them!
	vec3 k_amb = 0.1 * color;
	vec3 k_diff = 0.5 * color;
	vec3 k_spec = 0.4 * vec3(1, 1, 1);

	vec3 color_ambient, color_diffuse, color_specular;


	////////////////////////////////
	////////  ambient term  ////////
	////////////////////////////////
	color_ambient = k_amb;


	////////////////////////////////
	////////  diffuse term  ////////
	////////////////////////////////

	// 6.2a)	Compute the diffuse color like shown
	//				in the lecture. Use k_diff.
	//				For the dot product, you need the normal
	//				and the vector from the fragment to the
	//				light source. Both vectors have to be
	//				normalized. Note that the varying variables
	//				normalized in the vertex shader do not have
	//				to be still normalized in the fragment shader.

	// L_diff = K_diff * Iin * (N dot L)

	//calculate vector pointing to light source
	vec3 pointing_to_light = (lightPosition - worldPos);
	pointing_to_light = normalize(pointing_to_light);

	float normal_dot_light = dot(vectorNormal, pointing_to_light);

	//calculate color
	color_diffuse = normal_dot_light*k_diff;

	/////////////////////////////////
	////////  specular term  ////////
	/////////////////////////////////

	// 6.2b)	Compute the specular color like shown
	//				in the lecture. Use k_spec and shiny.
	//				For the dot product, you need the reflection
	//				vector (computed from the normal and the vector
	//				to the light) and the view vector. To calculate
	//				the camera position, transform the camera
	//				position in camera space (easy!) to world space
	//				using the inverse camera matrix given as a
	//				uniform.
	vec3 r = 2.0*normal_dot_light*(vectorNormal - pointing_to_light);
	vec4 aux = cameraMatrixInverse*vec4(0.0, 0.0, 0.0, 1.0);
	aux = aux/aux[3];
	vec3 view = worldPos - vec3(aux);
	view = normalize(view);
	color_specular = vec3(k_spec*pow(dot(view, r), shiny));


	///////////////////////////////////
	////////  resulting color  ////////
	///////////////////////////////////
	vec3 color_result = vec3(0);
	if (ambient) color_result += color_ambient;
	if (diffuse) color_result += color_diffuse;
	if (specular) color_result += color_specular;
	gl_FragColor = vec4(color_result, 1.0);

}
