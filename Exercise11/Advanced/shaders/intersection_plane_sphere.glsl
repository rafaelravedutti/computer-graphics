
IntersectionResult intersectRayPlane(Ray ray, vec4 planeData) {
    vec3 n = planeData.xyz;
    float k = planeData.w;

    // TODO 11.2 b)
    // Ray-Plane Intersection
	// Have a look at the definition of struct "IntersectionResult" in rt.h.
	// You can use "EPSILON" defined in rt.glsl.

    //vec3 p = vec3(k) / n;
    //float t = ((p - ray.origin) / ray.direction).x;

    //return IntersectionResult(t > 0.0, t, n, p, EPSILON);
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

    //vec3 pc2 = abs(p) * abs(p) + 2 * (p * (-c)) + abs(-c) * abs(-c)

    //vec3 b_a = 1;
    //vec3 b_b = 2 * (-c);
    //vec3 b_c = (abs(-c) * abs(-c)) - (r * r);
    //vec3 p1 = (-b_b + sqrt(b_b * b_b - 4 * b_a * b_c)) / 2 * b_a;
    //vec3 p2 = (-b_b - sqrt(b_b * b_b - 4 * b_a * b_c)) / 2 * b_a;
    //float t1 = ((p1 - ray.origin) / ray.direction).x;
    //float t2 = ((p2 - ray.origin) / ray.direction).x;

    //return IntersectionResult(t1 > 0.0 || t2 > 0.0, min(t1, t2), n, p, EPSILON);
    return IntersectionResult(false, 0, vec3(0), vec3(0), EPSILON);

}
