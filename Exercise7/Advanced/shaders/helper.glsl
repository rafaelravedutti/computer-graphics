vec2 cartesianToSpherical(vec3 n)
{
    // TODO 7.4 a)
    // Convert cartesian coordinates to spherical coordinates.
    float theta = 0;
    float phi = 0;

    theta = atan(n.z / n.x);
    phi = acos(n.y);

    return vec2(theta,phi);
}

vec3 sphericalToCartesian(vec2 a)
{
    float theta = a.x;
    float phi = a.y;
    vec3 result(0);

    // TODO 7.4 a)
    // Convert spherical coordinates to cartesian coordinates.
    result.x = sin(phi) * cos(theta);
    result.y = cos(phi);
    result.z = sin(phi) * sin(theta);

    return result;
}


vec2 sphericalToTexture(vec2 a)
{
    const float PI = 3.14159265;
    float theta = a.x; //in range [-PI,PI]
    float phi = a.y; // in range [0,PI]
    vec2 uv(0);

    // TODO 7.4 a)
    // Compute texture coordinates from spherical coordinates.
	// Do not forget to mirror both coordinates to have the north pole at the top 
	// and France located west of Germany! ;)
    uv.x = (theta + PI) / (2.0 * PI) + 0.5;
    uv.y = phi / PI + 0.5;

    uv -= 2.0 * floor(uv / 2.0);

    if(uv.x > 1.0) {
      uv.x = 2.0 - uv.x;
    }

    if(uv.y > 1.0) {
      uv.y = 1.0 - uv.y;
    }

    return uv;
}


