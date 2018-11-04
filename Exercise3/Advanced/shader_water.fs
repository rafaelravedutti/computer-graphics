precision mediump float;


varying vec3 position;


void main(void)
{
  vec3 dark_blue = vec3(0, 0, 0.3);
  vec3 light_blue = vec3(0.4, 0.4, 1.0);

  // TODO 3.5c)	Replace the constant blue color with a color
  //				depending on the height. The color should be
  //				dark blue for pixels whose position is at the
  //				lowest possible height (-0.5) and light blue
  //				for those at the highest possible height (0.5).
  //				Use the glsl function mix();
  //gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);


	gl_FragColor = mix(
    vec4(dark_blue, 1),
    vec4(light_blue, 1),
    (gl_FragCoord.y / 100.0) + 0.5
  );
}
