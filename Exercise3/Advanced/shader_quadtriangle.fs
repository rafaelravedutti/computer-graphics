precision mediump float;

uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform vec2 pointC;

void main(void)
{
  vec2 ap = vec2(gl_FragCoord.x - pointA.x, gl_FragCoord.y - pointA.y);
  bool cond = (pointB.x - pointA.x) * ap.y - (pointB.y - pointA.y) * ap.x > 0.0;

  if((pointC.x - pointA.x) * ap.y - (pointC.y - pointA.y) * ap.x > 0.0 == cond) {
    discard;
  } else {
    if((pointC.x - pointB.x) * (gl_FragCoord.y - pointB.y) - (pointC.y - pointB.y) * (gl_FragCoord.x - pointB.x) > 0.0 != cond) {
      discard;
    } else {
      gl_FragColor = vec4(color, 1);
    }
  }
}
