// Gets global gl object
const canvas = document.querySelector("canvas")
const getGL = canvas => {
  const gl = canvas.getContext("webgl")

  if (!gl) {
    alert("WebGL not supported")
    return null
  }

  return gl
}
const gl = getGL(canvas)
const textCanvas = document.getElementById("text")
const textCtx = textCanvas.getContext("2d")

const styleSel = document.getElementById("plot-select")
const funcSel = document.getElementById("function-select")
const minXInput = document.getElementById("minX")
const maxXInput = document.getElementById("maxX")
const minZInput = document.getElementById("minZ")
const maxZInput = document.getElementById("maxZ")
const fadingRange = document.getElementById("fadingRange")
const ambientRange = document.getElementById("ambientRange")
const resolutionRange = document.getElementById("resolutionRange")

const ROTATION_ANGLE = Math.PI / 10
const SAMPLE_COUNT = 250
const FADING_MAX = 2

// gl-matrix-lib 
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix

// initial values
const CENTER = [0, 0, 0]
const PROJECTION_ANGLE = 45 * Math.PI / 180
// const ASPECT_RATIO = canvas.width / canvas.height
const ASPECT_RATIO = 1
const NEAR_Z = 0.1
const FAR_Z = 1000
const INIT_EYE_POS = [5, 4, 5]

const DIMENSIONS = 3
const ORIGIN = {
  X: 0,
  Y: 0,
  Z: 0
}
const INIT_AXES_RANGE = 3
const X_AXIS = new Float32Array([1, 0, 0])
const Y_AXIS = new Float32Array([0, 1, 0])
const Z_AXIS = new Float32Array([0, 0, 1])

const SAMPLE_STEP_SIZE = 0.1


// Initializes rendering screen of Graph canvas
const initGraphCanvas = (() => {
  gl.viewport(0.0, 0.0, canvas.width, canvas.height)
  gl.clearColor(0.85, 0.85, 0.85, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.lineWidth(0.01)
  gl.enable( gl.DEPTH_TEST)
  gl.disable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.disable(gl.CULL_FACE)
  // console.log(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))
  // gl.enable(gl.DEPTH_TEST)
  // gl.enable(gl.CULL_FACE)
  // gl.frontFace(gl.CCW)
  // gl.cullFace(gl.BACK)
})()
