const { mat2, mat3, mat4, vec2, vec3, vec4 } = glMatrix;

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("XXX WebGL not supported XXX");
}

vertex = [0, 1, 0, 1, -1, 0, -1, -1, 0];
color = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
    precision mediump float;
    
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;
    
    uniform mat4 matrix;
    
    void main() {
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
    }
    `
);
gl.compileShader(vertexShader);
console.log(gl.getShaderInfoLog(vertexShader));

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
    precision mediump float;
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1);
    }
    `
);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
  matrix: gl.getUniformLocation(program, `matrix`),
};

const comp_mat = mat4.create();
// mat4.translate(comp_mat, comp_mat, [0.2, 0.4, 0]);
// mat4.scale(comp_mat, comp_mat, [0.25, 0.25, 0.25]);
mat4.rotateZ(comp_mat, comp_mat, Math.PI / 2);

const model_mat = mat4.create();
const view_mat = mat4.create();

const proj_mat = mat4.create();
mat4.perspective(
  proj_mat,
  (75 * Math.PI) / 180,
  canvas.width / canvas.height,
  1e-4,
  1e4
);

const obj_mat = mat4.create();
const mv_mat = mat4.create();
const mvp_mat = mat4.create();

mat4.translate(model_mat, model_mat, [-1.4, 0, -2]);
mat4.translate(view_mat, view_mat, [-3, 0, 1]);
mat4.inverse(view_mat, view_mat);

gl.uniformMatrix4fv(uniformLocations.comp_mat, false, comp_mat);

gl.drawArrays(gl.TRIANGLES, 0, 3);

function animate() {
  requestAnimationFrame(animate);
  mat4.multiply(mv_mat, view_mat, model_mat);
  mat4.multiply(mvp_mat, proj_mat, mv_mat);
  mat4.rotateZ(comp_mat, comp_mat, Math.PI / 200);
  mat4.rotateX(comp_mat, comp_mat, Math.PI / 200);
  mat4.rotateY(comp_mat, comp_mat, Math.PI / 200);
  mat4.multiply(obj_mat, comp_mat, Math.PI / 200);

  gl.uniformMatrix4fv(uniformLocations.comp_mat, false, comp_mat);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
animate();
