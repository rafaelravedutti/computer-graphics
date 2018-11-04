precision mediump float;

uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform vec2 pointC;

float point_to_edge_distance(vec2 point, vec2 edgeA, vec2 edgeB) {
  float den =
      (point.x - edgeA.x) * (edgeB.x - edgeA.x) +
      (point.y - edgeA.y) * (edgeB.y - edgeA.y);

  float div =
      (edgeB.x - edgeA.x) * (edgeB.x - edgeA.x) +
      (edgeB.y - edgeA.y) * (edgeB.y - edgeA.y);

  float param;
  float dx, dy;

  if(div == 0.0) {
    param = -1.0;
  } else {
    param = den / div;
  }

  if(param < 0.0) {
    dx = point.x - edgeA.x;
    dy = point.y - edgeA.y;
  } else if(param > 1.0) {
    dx = point.x - edgeB.x;
    dy = point.y - edgeB.y;
  } else {
    dx = point.x - (edgeA.x + param * (edgeB.x - edgeA.x));
    dy = point.y - (edgeA.y + param * (edgeB.y - edgeA.y));
  }

  return sqrt(dx * dx + dy * dy);
}

void main(void)
{

	// TODO 3.4)	Use the fragment coordinate (gl_FragCoord) and clip
	//				it against the triangle that is defined by the three
	//				points A,B and C. If the fragment lies in the triangle
	//				set the gl_FragColor, otherwise discard the fragment
	//				(using "discard;"). If the fragment is inside the triangle
	//				and in the range of a iso line (within 1 pixel radius from
	//				a iso line) blend the color linearly with the color of the
	//				iso line (black). Draw all iso lines with a multiple of 14
	//				pixels distance.

  vec2 ap = vec2(gl_FragCoord.x - pointA.x, gl_FragCoord.y - pointA.y);
  bool cond = (pointB.x - pointA.x) * ap.y - (pointB.y - pointA.y) * ap.x > 0.0;

  if((pointC.x - pointA.x) * ap.y - (pointC.y - pointA.y) * ap.x > 0.0 == cond) {
    discard;
  } else {
    if((pointC.x - pointB.x) * (gl_FragCoord.y - pointB.y) - (pointC.y - pointB.y) * (gl_FragCoord.x - pointB.x) > 0.0 != cond) {
      discard;
    } else {
      vec2 point = vec2(gl_FragCoord.x, gl_FragCoord.y);
      float d_ab = point_to_edge_distance(point, pointA, pointB);
      float d_ac = point_to_edge_distance(point, pointA, pointC);
      float d_bc = point_to_edge_distance(point, pointB, pointC);
      float min_d = d_ab;

      if(min_d > d_ac) {
        min_d = d_ac;
      }

      if(min_d > d_bc) {
        min_d = d_bc;
      }

      min_d /= 14.0;
      min_d -= floor(min_d);

      if(min_d < 0.1) {
        gl_FragColor = mix(vec4(color, 1), vec4(0, 0, 0, 1), 0.5);
      } else {
        gl_FragColor = vec4(color, 1);
      }
    }
  }
}
