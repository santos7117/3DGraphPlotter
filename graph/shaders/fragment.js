const fragmentShaderSrc = `
precision mediump float;

uniform vec4 u_color;
uniform float u_fading;
uniform float u_ambientStrength;

varying vec3 v_transformedNormal;

void main() {
  // more distant points are less visible
  vec4 color = vec4(vec3(u_color), 1.0 - u_fading * gl_FragCoord[2]);

  // light
  vec3 lightDir = normalize( vec3(1, 1, -1) );
  float diff = max(dot(v_transformedNormal, lightDir), 0.0);

  vec3 lightColor = vec3(1, 1, 1);

  vec4 ambient = vec4( u_ambientStrength * lightColor, 0.5);
  vec4 diffuse = vec4( diff * lightColor, 0.5);
  gl_FragColor = (ambient + diffuse) *  color;
}
`