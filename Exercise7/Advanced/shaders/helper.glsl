vec2 cartesianToSpherical(vec3 n)
{
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
    vec3 result;

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
    vec2 uv;

    uv.x = 1.0 - (theta + PI) / (2.0 * PI);
    uv.y = 1.0 - phi / PI;

    return uv;
}


