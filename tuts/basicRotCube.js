const vertexShaderSrc = 
`
precision mediump float;
attribute vec3 vertPos;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Proj;

void main() {
  fragColor = vertColor;
  gl_Position = u_Proj * u_View * u_Model * vec4(vertPos, 1.0);
}
`
const fragmentShaderSrc = 
`
precision mediump float;
varying vec3 fragColor;

void main() {
  gl_FragColor = vec4(fragColor, 1.0);
}
`

const compileVertexShader = (src) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, src)
  gl.compileShader(vertexShader)

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log('ERR compiling vertex shader: ', gl.getShaderInfoLog(vertexShader))
    return
  }

  return vertexShader
}

const compileFragmentShader = (src) => {
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, src)
  gl.compileShader(fragmentShader)

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log('ERR compiling fragment shader: ', gl.getShaderInfoLog(fragmentShader))
    return
  }

  return fragmentShader
}

// Gets a program with vertex and fragment shader attached
const getShaderProgram = () => {
  const vertexShader = compileVertexShader(vertexShaderSrc)
  const fragmentShader = compileFragmentShader(fragmentShaderSrc)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log('ERR linking program: ', gl.getProgramInfoLog(program))
    return
  }
  
  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log('ERR validating program: ', gl.getProgramInfoLog(program))
    return
  }

  gl.useProgram(program)
  return program
}

// Gets global gl object
const getGL = () => {
  const canvas = document.querySelector('canvas')
  const gl = canvas.getContext('webgl')
  
  if (!gl) {
    alert('WebGL not supported')
    return
  }

  return gl
}


const {mat2, mat3, mat4} = glMatrix
const gl = getGL()


// Initializes rendering screen
const init = () => {
  gl.clearColor(0.9, 0.9, 0.9, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.frontFace(gl.CCW)
  gl.cullFace(gl.BACK)
}

// Defines and call main() 
const main = (() => {
  init()
  shaderProg = getShaderProgram()

  const boxVert = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

  // create a buffer to pass into GPU
  const boxVertBuffObj = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertBuffObj)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVert), gl.STATIC_DRAW)

  const boxIndexBuffObj = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffObj)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(boxIndices), gl.STATIC_DRAW)
  
  // get triangle position's and color's location from shader program
  const posAttribLoc = gl.getAttribLocation(shaderProg, 'vertPos')
  const clrAttribLoc = gl.getAttribLocation(shaderProg, 'vertColor')

  gl.vertexAttribPointer(
    posAttribLoc,                       // attrib location
    3,                                  // no. of elements per vertex attrib
    gl.FLOAT,                           // type of elements
    gl.FALSE,                           // normalize
    6 * Float32Array.BYTES_PER_ELEMENT, // size of each vertex
    0                                   // offset of the attrib from beginning of vertex
  )
  gl.vertexAttribPointer(
    clrAttribLoc,                       // attrib location
    3,                                  // no. of elements per color attrib
    gl.FLOAT,                           // type of elements
    gl.FALSE,                           // normalize
    6 * Float32Array.BYTES_PER_ELEMENT, // size of each vertex
    3 * Float32Array.BYTES_PER_ELEMENT  // offset of the attrib from beginning of vertex
  )

  gl.enableVertexAttribArray(posAttribLoc)
  gl.enableVertexAttribArray(clrAttribLoc)
  // Specify program for WebGL state machine
  gl.useProgram(shaderProg)

  const modelLoc = gl.getUniformLocation(shaderProg, 'u_Model')
  const viewLoc = gl.getUniformLocation(shaderProg, 'u_View')
  const projLoc = gl.getUniformLocation(shaderProg, 'u_Proj')

  const model = mat4.create()
  const proj  = mat4.create()
  const view  = mat4.create()
  mat4.perspective(
      proj,                         // out
      45 * Math.PI/180,             // FOV
      1,                            // aspect ratio
      0.1,                          // near
      1000.0                        // far
    )
  mat4.lookAt(
      view,                         // out
      [5, 5, 5],                   // eye: position of the viewer
      [0, 0, 0],                    // center: point the viewer is looking at
      [0, 1, 0]                     // up: vec3 pointing up
    )
  
  // specify matrix values for uniforms
  gl.uniformMatrix4fv(viewLoc, gl.FALSE, view)
  gl.uniformMatrix4fv(projLoc, gl.FALSE, proj)

  const xRotMat = mat4.create()
  const yRotMat = mat4.create()
  
  let angle = 0
  const loop = () => {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI
    mat4.rotateX(xRotMat, xRotMat, angle)
    mat4.rotateY(yRotMat, yRotMat, angle/4)
    mat4.multiply(model, model, xRotMat)
    mat4.multiply(model, model, yRotMat)
    gl.uniformMatrix4fv(modelLoc, gl.FALSE, model)
    
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    
    gl.drawElements(
      gl.TRIANGLES,         // mode
      boxIndices.lenth,     // count
      gl.UNSIGNED_SHORT,    // type of array 
      0,                    // offset
    )
    
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
  
  
})()