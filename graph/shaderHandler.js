// Creates and attaches vertex and fragment shaders to a program
const shaderProg = (() => {
  // Create and compile vertex shader
  const vertexShader = (src => {
    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, src)
    gl.compileShader(vs)

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.log("ERR compiling vertex shader: ", gl.getShaderInfoLog(vs))
      return null
    }

    return vs
  })(vertexShaderSrc)
  // Create and compile fragment shader
  const fragmentShader = (src => {
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, src)
    gl.compileShader(fs)

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.log("ERR compiling fragment shader: ", gl.getShaderInfoLog(fs))
      return null
    }

    return fs
  })(fragmentShaderSrc)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("ERR linking program: ", gl.getProgramInfoLog(program))
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    return null
  }

  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log("ERR validating program: ", gl.getProgramInfoLog(program))
    return null
  }

  return program
})()
