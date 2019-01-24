
IntersectionResult intersectRayPlane(Ray ray, vec4 planeData) {
    vec3 n = planeData.xyz;
    float k = planeData.w;

    // TODO 11.2 b)
    // Ray-Plane Intersection
	// Have a look at the definition of struct "IntersectionResult" in rt.h.
	// You can use "EPSILON" defined in rt.glsl.

    vec3 p = n * (1.0 / k);

    // p.x * n.x + p.y * n.y = k
    // p.x = ray.origin.x + ray.direction.x * t
    // p.y = ray.origin.y + ray.direction.y * t

    // p.x = -(p.y * n.y) / n.x;
    // t = (p.y - ray.origin.y) / ray.direction.y
    // -(p.y * n.y) = ray.origin.x + ray.direction.x ((p.y - ray.origin.y) / ray.direction.y)

    //p.y * n.y = -(ray.origin.x + ray.direction)
    return IntersectionResult(false, t, n, vec3(0.0), EPSILON);

}

IntersectionResult intersectRaySphere(Ray ray, vec4 sphereData) {
    vec3 c = sphereData.xyz;
    float r = sphereData.w;


    // TODO 11.2 c)
    // Ray-Sphere Intersection
	// You can use "noIntersection" defined in rt.glsl.
	// Note that t has to be positive for the sphere to be in front of the camera:
	// Make sure that you cannot see objects behind the camera.

    vec3 l = ray.origin - c;
    float b_a = dot(ray.direction, ray.direction);
    float b_b = 2 * dot(ray.direction, l);
    float b_c = dot(l, l) - r * r;
    float b_d = b_b * b_b - 4 * b_a * b_c;
    float t1, t2;
    vec3 p;

    if(b_d == 0.0) {
        t1 = t2 = -0.5 * b_b / b_a;
    } else {
        float q = (b_b > 0) ? -0.5 * (b_b + sqrt(b_d)) :
                              -0.5 * (b_b - sqrt(b_d));

        t1 = q / b_a;
        t2 = b_c / q;
    }

    if(t2 > 0.0 && t2 < t1) {
        t1 = t2;
    }

    p = ray.origin + ray.direction * t1;

    return IntersectionResult(b_d >= 0.0 && t1 > 0.0, t1, c, p, EPSILON);

}
