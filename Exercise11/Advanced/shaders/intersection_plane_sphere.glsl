
IntersectionResult intersectRayPlane(Ray ray, vec4 planeData) {
    vec3 n = planeData.xyz;
    float k = planeData.w;

    // TODO 11.2 b)
    // Ray-Plane Intersection
	// Have a look at the definition of struct "IntersectionResult" in rt.h.
	// You can use "EPSILON" defined in rt.glsl.
    return IntersectionResult(false, 0, vec3(0), vec3(0), EPSILON);

}

IntersectionResult intersectRaySphere(Ray ray, vec4 sphereData) {
    vec3 c = sphereData.xyz;
    float r = sphereData.w;


    // TODO 11.2 c)
    // Ray-Sphere Intersection
	// You can use "noIntersection" defined in rt.glsl.
	// Note that t has to be positive for the sphere to be in front of the camera:
	// Make sure that you cannot see objects behind the camera.
    return IntersectionResult(false, 0, vec3(0), vec3(0), EPSILON);

}
