
--vertex
layout(location = 0) in vec3 in_position;

out vec3 position;

void main() {
    position = vec3(in_position.x,in_position.z,0);
    gl_Position =  vec4(position, 1);
}

--fragment


#define NUM_PLANES 1
#define NUM_SPHERES 4
#define NUM_SPIKE_BALLS 1
#define NUM_CUBES 1

#define NUM_OBJECTS (NUM_PLANES + NUM_SPHERES + NUM_SPIKE_BALLS + NUM_CUBES)



// Object IDs
#define SPHERE_1 0
#define SPHERE_2 1
#define SPHERE_3 2
#define SPHERE_4 3
#define PLANE NUM_SPHERES
#define SPIKEBALL (NUM_SPHERES+NUM_PLANES)
#define CUBE (SPIKEBALL+1)


#include "noise3D.glsl"
#include "rt.h"

#define EPSILON 0.002
#define INFINITY 500
const IntersectionResult noIntersection = IntersectionResult(false, 0,vec3(0),vec3(0),EPSILON);


in vec3 position;

layout (location = 0) uniform vec3 cameraPos = vec3(0,0,0);
layout (location = 1) uniform mat4 projView;
layout (location = 2) uniform vec3 lightDir = normalize(-vec3(-1,5,4));

layout (location = 3) uniform int maxDepth = 5;
layout (location = 4) uniform float shadowFactor = 1;

layout (location = 7) uniform float sunIntensity = 1;
layout (location = 8) uniform float uTime = 0;
layout (location = 9) uniform bool schlick = false;
layout (location = 5) uniform bool reflection = false;
layout (location = 6) uniform bool refraction = false;
layout (location = 10) uniform float airRefractionIndex = 1;
layout (location = 11) uniform int debug = 0;
layout (location = 12) uniform mat4 boxTrans;
// XYZ - center of the sphere
// W - radius of the sphere
layout (location = 20) uniform vec4 objectData[NUM_OBJECTS];

layout (location = 50) uniform Material materials[NUM_OBJECTS];

layout (location = 0) out vec4 out_color;



#include "sky_floor_color.glsl"
#include "intersection_plane_sphere.glsl"
#include "intersection_spikeball.glsl"


float fresnel(float n1, float n2, float cosThetaI)
{
    float sinThetaI = sqrt(1.0 - cosThetaI * cosThetaI);

    float q = ((n1 / n2) * sinThetaI);
    q = q * q;
    q = 1 - q;

    if(q < 0.0) {
        return 1.0;
    }

    float rs_term1 = n1 * cosThetaI;
    float rs_term2 = n2 * sqrt(q);
    float rs = (rs_term1 - rs_term2) / (rs_term1 + rs_term2);

    float rp_term1 = n1 * sqrt(q);
    float rp_term2 = n2 * cosThetaI;
    float rp = (rp_term1 - rp_term2) / (rp_term1 + rp_term2);

    return 0.5 * (rs * rs + rp * rp);
}


int intersectRayScene(Ray ray, out IntersectionResult result)
{

    int objectId = -1;
    float tMin = INFINITY;
    IntersectionResult tmp;

#if 1
    //compute all intersections
    for (int i = 0; i < NUM_SPHERES; ++i)
    {
        tmp = intersectRaySphere(ray, objectData[i]);
        if (tmp.isIntersection && tmp.tHit < tMin)
        {
            objectId = i;
            result = tmp;
            tMin = tmp.tHit;
        }
    }

    tmp = intersectRayPlane(ray, objectData[PLANE]);
    if (tmp.isIntersection && tmp.tHit < tMin)
    {
        objectId = PLANE;
        result = tmp;
        tMin = tmp.tHit;
    }

    tmp = intersectRaySpikeball(ray, objectData[SPIKEBALL]);
    if (tmp.isIntersection && tmp.tHit < tMin)
    {
        objectId = SPIKEBALL;
        result = tmp;
        tMin = tmp.tHit;
    }
#endif


    ray.origin = vec3(boxTrans * vec4(ray.origin,1));
    ray.direction = normalize(vec3(boxTrans * vec4(ray.direction,0)));
    tmp = intersectRayAabb(ray, vec3(-1),vec3(1));
    if (tmp.isIntersection && tmp.tHit < tMin)
    {
        tmp.normal = normalize(vec3(inverse(boxTrans) * vec4(tmp.normal,0)));
        tmp.hitPosition = (vec3(inverse(boxTrans) * vec4(tmp.hitPosition,1)));
        objectId = CUBE;
        result = tmp;
        tMin = tmp.tHit;

    }

    return objectId;

}



#define MAX_STACK_SIZE 32
#define INTENSITY_EPSILON 0.001


#define push(X) stack[stackSize++] = (X)
#define pop(X) stack[--stackSize]

struct TraceNode
{
    Ray ray;
    float intensity;
    int depth;
};

vec3 trace(Ray primaryRay)
{
    vec3 color = vec3(0.0);

    int stackSize = 0;
    TraceNode stack[MAX_STACK_SIZE];

    TraceNode primaryNode;

    primaryNode.ray = primaryRay;
    primaryNode.intensity = 1.0;
    primaryNode.depth = 0;

    push(primaryNode);

    while(stackSize > 0)
    {
        TraceNode node;

        node = pop();

        if(node.intensity < INTENSITY_EPSILON || node.depth > maxDepth) {
            continue;
        }

        // Compute intersection of the current ray
        IntersectionResult inter;
        int objectId = intersectRayScene(node.ray,inter);


        if(objectId != -1)
        {
            // The ray has hit an object!
            Material m = materials[objectId];
            //some special handling for the plane to create the checkerboard pattern
            if(objectId == PLANE) m.color = floorColor(m.color,inter.hitPosition);

            // The refraction indices
            float n1 = airRefractionIndex;
            float n2 = m.refractionN;


            vec3 N = normalize(inter.normal);

            float cosTheta;

            cosTheta = dot(-node.ray.direction, N);

            if(cosTheta < 0.0) {
                float nswap = n1;
                n1 = n2;
                n2 = nswap;

                m.glass = 1.0;

                N = -N;
                cosTheta = dot(-node.ray.direction, N);
            }


            float fresnel_result = fresnel(n1, n2, cosTheta);
            float R = node.intensity * fresnel_result;
            float T = node.intensity * m.glass * (1 - fresnel_result);
            float D = node.intensity * (1 - m.glass) * (1 - fresnel_result);




            // Debugging of the first tree layer
            // Enable a debug mode in the GUI
            if(debug == 1) return vec3(R);
            if(debug == 2) return vec3(T);
            if(debug == 3) return vec3(D);

            // More debugging stuff to disable reflections or refractions in the GUI
            if(!reflection){ D += R; R = 0;}
            if(!refraction){ D += T; T = 0;}


			//======= Reflection =======
            Ray reflectedRay;

            reflectedRay.direction = reflect(node.ray.direction, N);
            reflectedRay.origin = inter.hitPosition + EPSILON * reflectedRay.direction;

            TraceNode reflectedNode;

            reflectedNode.ray = reflectedRay;
            reflectedNode.depth = node.depth + 1;
            reflectedNode.intensity = R;

            push(reflectedNode);

			//======= Transmission =======
            Ray refractedRay;

            refractedRay.direction = refract(node.ray.direction, N, n1 / n2);
            refractedRay.origin = inter.hitPosition + EPSILON * refractedRay.direction;

            TraceNode refractedNode;

            refractedNode.ray = refractedRay;
            refractedNode.depth = node.depth + 1;
            refractedNode.intensity = T;

            if(length(reflectedRay.direction) >= EPSILON) {
                push(refractedNode);
            }





            //======= Diffuse =======
            {
                float diffuseCoefficient = max(0.0, dot(N, -lightDir));

                Ray shadowRay = Ray(inter.hitPosition + 0.01 * N, -lightDir);
                IntersectionResult inter2;
                float s = intersectRayScene(shadowRay,inter2) == -1 ? 1.0 : (1-shadowFactor);

                vec3 N = normalize(inter.normal);
                vec3 l = -normalize(lightDir);
                vec3 v = normalize(cameraPos - inter.hitPosition);
                vec3 r = normalize(2.0 * dot(N, l) * N - l);

                vec3 diff = max(0.0, dot(N, l)) * m.color;
                vec3 spec = 0.3 * pow(max(0.0, dot(v, r)), 40)* vec3(1) ;
                vec3 amb = m.color * 0.1;

                color += ((diff +  spec)*s + amb) * sunIntensity * D * node.intensity;

            }
        }
        else
        {
            // The ray has hit the sky!
            color += node.intensity * vec3(skyColor(node.ray));
        }
    }
    return color;
}


void main() {

    // Setup primary ray
    vec4 wp = inverse(projView) * vec4(position,1);
    wp = wp / wp.w;
    Ray primaryRay;
    primaryRay.origin = cameraPos;
    primaryRay.direction = normalize( vec3(wp) - cameraPos );

    // Trace Primary Ray
    out_color = vec4(trace(primaryRay),1);
    return;

}
