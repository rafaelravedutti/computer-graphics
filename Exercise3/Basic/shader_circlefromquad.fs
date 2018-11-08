precision mediump float;

// TODO 3.3)	Define a constant variable (uniform) to
//              "send" the canvas size to all fragments.
uniform vec2 canvasSize;


void main(void)
{

	 float smoothMargin = 0.01;
	 float r = 0.8;

	 vec2 x = canvasSize;
	 // TODO 3.3)	Map the fragment's coordinate (gl_FragCoord.xy) into
	 //				the range of [-1,1]. Discard all fragments outside the circle
	 //				with the radius r. Smooth the circle's edge within
	 //				[r-smoothMargin, r] by computing an appropriate alpha value.

	 // convert the position from pixels to 0.0 to 2.0
   vec2 zeroToOne = (gl_FragCoord.xy / canvasSize)*2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToOne - 1.0;

	 //gl_Position = vec4(clipSpace, 0, 1);

	 float distance = abs(clipSpace.x*clipSpace.x) + abs(clipSpace.y*clipSpace.y);

	 if(distance > r)
		 discard;

	 float alpha = 1.0;

	 float innerCircleDistance = (r - smoothMargin) * (r - smoothMargin);


	 if(distance >= innerCircleDistance &&  distance <= r*r){
	 		alpha = clamp(distance, distance - innerCircleDistance, 1.0);
	 }

		gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0, alpha);


}
