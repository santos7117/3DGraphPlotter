const vertexShaderSrc = 
`
precision mediump float;
attribute vec2 trianglePos;
attribute vec3 vertColor;
varying vec3 fragColor;

void main() {
  fragColor = vertColor;
    gl_Position = vec4(trianglePos, 0.0, 1.0);
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


const gl = getGL()


// Initializes rendering screen
const init = () => {
  gl.clearColor(0.9, 0.9, 0.9, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

// Defines and call main() 
const main = (() => {
  init()
  shaderProg = getShaderProgram()

  const triangleVert = [
  //  X     Y    R    G    B
     0.0,  0.5, 0.9, 0.0, 0.0,
     0.5, -0.5, 0.0, 0.8, 0.0,
    -0.5, -0.5, 0.0, 0.0, 0.7,
  ]

  // create a buffer to pass into GPU
  const triangleVertBuffObj = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertBuffObj)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW)
  
  // get triangle position's and color's location from shader program
  const posAttribLocation = gl.getAttribLocation(shaderProg, 'trianglePos')
  const clrAttribLocation = gl.getAttribLocation(shaderProg, 'vertColor')
  gl.vertexAttribPointer(
    posAttribLocation,                  // attrib location
    2,                                  // no. of elements per vertex attrib
    gl.FLOAT,                           // type of elements
    gl.FALSE,                           // normalize
    5 * Float32Array.BYTES_PER_ELEMENT, // size of each vertex
    0                                   // offset of the attrib from beginning of vertex
  )
  gl.vertexAttribPointer(
    clrAttribLocation,                  // attrib location
    3,                                  // no. of elements per color attrib
    gl.FLOAT,                           // type of elements
    gl.FALSE,                           // normalize
    5 * Float32Array.BYTES_PER_ELEMENT, // size of each vertex
    2 * Float32Array.BYTES_PER_ELEMENT  // offset of the attrib from beginning of vertex
  )

  gl.enableVertexAttribArray(posAttribLocation)
  gl.enableVertexAttribArray(clrAttribLocation)

  gl.useProgram(shaderProg)
  gl.drawArrays(
    gl.TRIANGLES,   // mode
    0,              // first vertex
    3               // count of triangles
  )
  
})()