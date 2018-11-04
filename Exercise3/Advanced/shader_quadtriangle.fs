precision mediump float;

uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform vec2 pointC;

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
      gl_FragColor = vec4(color, 1);
    }
  }
}
