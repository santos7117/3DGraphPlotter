const CoordAxes = {}
CoordAxes.setData = function (minX, maxX, minY, maxY, minZ, maxZ) {
  let midX = 0
  let midY = 0
  let midZ = 0

  CoordAxes.data = [
    minX, midY, midZ,
    maxX, midY, midZ,
    midX, minY, midZ,
    midX, maxY, midZ,
    midX, midY, minZ,
    midX, midY, maxZ,
  ]
  CoordAxes.length = CoordAxes.data.length

  gl.bindBuffer(gl.ARRAY_BUFFER, CoordAxes.buff)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(CoordAxes.data),
    gl.STATIC_DRAW
  )
}
CoordAxes.dims = 3
CoordAxes.primitive = gl.LINES
CoordAxes.buff = gl.createBuffer()

CoordAxes.color = [0, 1, 0.7, 1]
CoordAxes.fading = 0.0
CoordAxes.ambientStrength = 0.5
CoordAxes.normalsData = [
  1.0, 0.0, 0.0,
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 0.0, 1.0,
  0.0, 0.0, 1.0,
]
CoordAxes.normalsBuff = gl.createBuffer()
