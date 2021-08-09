const vertexShaderSrc = `

attribute vec4 a_position;
attribute vec4 a_normal;

uniform mat4 transform;

varying vec3 v_transformedNormal;

void main() {
  gl_Position = transform * a_position;
  v_transformedNormal = normalize(vec3(transform * a_normal));
}
`