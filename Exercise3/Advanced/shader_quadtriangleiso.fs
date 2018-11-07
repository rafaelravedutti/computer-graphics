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

  vec2 ap = vec2(gl_FragCoord.x - pointA.x, gl_FragCoord.y - pointA.y);
  vec2 bp = vec2(gl_FragCoord.x - pointB.x, gl_FragCoord.y - pointB.y);

  bool cond_ba = (pointB.x - pointA.x) * ap.y - (pointB.y - pointA.y) * ap.x > 0.0;
  bool cond_ca = (pointC.x - pointA.x) * ap.y - (pointC.y - pointA.y) * ap.x > 0.0;
  bool cond_cb = (pointC.x - pointB.x) * bp.y - (pointC.y - pointB.y) * bp.x > 0.0;

  if(cond_ca == cond_ba) {
    discard;
  } else {
    if(cond_cb != cond_ba) {
      discard;
    } else {
      vec2 point = vec2(gl_FragCoord.x, gl_FragCoord.y);
      float d_ab = point_to_edge_distance(point, pointA, pointB);
      float d_ac = point_to_edge_distance(point, pointA, pointC);
      float d_bc = point_to_edge_distance(point, pointB, pointC);
      float min_d = min(d_ab, min(d_ac, d_bc));
      float next_isoline = floor(min_d / 14.0) * 14.0;
      float dis_isoline = abs(min_d - next_isoline);

      if(dis_isoline <= 1.0) {
        gl_FragColor = mix(vec4(color, 1), vec4(0, 0, 0, 1), 1.0 - dis_isoline);
      } else if(dis_isoline >= 13.0) {
        gl_FragColor = mix(vec4(color, 1), vec4(0, 0, 0, 1), 1.0 - (14.0 - dis_isoline));
      } else {
        gl_FragColor = vec4(color, 1);
      }
    }
  }
}
