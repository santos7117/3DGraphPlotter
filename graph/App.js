function main() {
  gl.useProgram(shaderProg)
  const position_loc = gl.getAttribLocation(shaderProg, "a_position")
  const normal_loc = gl.getAttribLocation(shaderProg, "a_normal")
  const transform_loc = gl.getUniformLocation(shaderProg, "transform")
  const color_loc = gl.getUniformLocation(shaderProg, "u_color")
  const fading_loc = gl.getUniformLocation(shaderProg, "u_fading")
  const ambient_loc = gl.getUniformLocation(shaderProg, "u_ambientStrength")

  // code above is for initialization
  let model_mat = []
  let ratio = canvas.height / canvas.width
  let perspective = mat.perspective(Math.PI / 3, 2.6, 20, ratio)

  let maxX = 1
  let maxY = 1
  let maxZ = 1

  const redraw = function () {
    // clear text
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable( gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE);

    const mvp_mat = mat.multiply(perspective, model_mat)
    // calculate text coords
    write = function (text, x, y, z) {
      let vec = mat.multiplyVector(mvp_mat, [x, y, z, 1])

      // gl also divides by fourth element
      vec[0] /= vec[3]
      vec[1] /= vec[3]

      // transform from [-1,1] to canvas dimensions
      vec[0] = ((vec[0] + 1) * textCtx.canvas.width) / 2
      vec[1] =
        textCtx.canvas.height - ((vec[1] + 1) * textCtx.canvas.height) / 2
      textCtx.fillText(text, vec[0], vec[1])
    }
    write("X", maxX, 0, 0)
    write("Y", 0, maxY, 0)
    write("Z", 0, 0, maxZ)
    write("0", 0, 0, 0)

    const size = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    drawObject = function (object) {
      // draw ball
      gl.bindBuffer(gl.ARRAY_BUFFER, object.buff)
      gl.vertexAttribPointer(
        position_loc,
        size,
        type,
        normalize,
        stride,
        offset
      )
      gl.enableVertexAttribArray(position_loc)

      gl.bindBuffer(gl.ARRAY_BUFFER, object.normalsBuff)
      gl.vertexAttribPointer(normal_loc, size, type, false, stride, offset)
      gl.enableVertexAttribArray(normal_loc)

      gl.uniformMatrix4fv(transform_loc, false, mvp_mat)
      gl.uniform4fv(color_loc, object.color)
      gl.uniform1f(fading_loc, object.fading)
      gl.uniform1f(ambient_loc, object.ambientStrength)
      gl.drawArrays(object.primitive, 0, object.length / object.dims)
    }
    drawObject(GraphObject)
    gl.disable(gl.DEPTH_TEST)
    drawObject(CoordAxes)
  }

  const functions = {}
  functions["sin(x)"] = function (x, y) {
    return Math.sin(x)
  }
  functions["cos(x^2+z^2)"] = function (x, y) {
    return Math.cos(x * x + y * y)
  }

  const draw = function () {
    // maxX,maY,maxZ are used in redraw function to draw text
    let func = functions[funcSel.value]
    let minX = parseInt(minXInput.value)
    let maxX = parseInt(maxXInput.value)
    let minZ = parseInt(minZInput.value)
    let maxZ = parseInt(maxZInput.value)
    switch (styleSel.value) {
      case "points":
        GraphObject.primitive = gl.POINTS
        break;
      
      case "lines":
        GraphObject.primitive = gl.LINES
        break;

      default:
        GraphObject.primitive = gl.TRIANGLES
        break;
      
    }

    let graph = getSurface(minX, maxX, minZ, maxZ, SAMPLE_COUNT, func)
    GraphObject.normalsData = graph.normals
    GraphObject.length = graph.surface.length

    gl.bindBuffer(gl.ARRAY_BUFFER, GraphObject.buff)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(graph.surface),
      gl.STATIC_DRAW
    )

    gl.bindBuffer(gl.ARRAY_BUFFER, GraphObject.normalsBuff)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(graph.normals),
      gl.STATIC_DRAW
    )

    let minY = graph.minY - 1
    let maxY = graph.maxY + 1
    let midX = (minX + maxX) / 2
    let midY = (minY + maxY) / 2
    let midZ = (minZ + maxZ) / 2

    CoordAxes.setData(minX, maxX, minY, maxY, minZ, maxZ)
    let translation = mat.translation(-midX, -midY, -midZ)
    let k = 1
    let scale = mat.scale(
      (k * 2) / (maxX - minX),
      (k * 2) / (maxY - minY),
      (k * 2) / (maxZ - minZ)
    )
    model_mat = mat.multiply(scale, translation)
    let tilt = mat.yRotation(Math.PI / 4)
    model_mat = mat.multiply(tilt, model_mat)

    // set ambient strength
    GraphObject.ambientStrength = ambientRange.value
    // set fading
    GraphObject.fading = FADING_MAX * fadingRange.value

    redraw()
  }
  document.getElementById("draw-button").onclick = draw

  draw()

  // controls
  document.addEventListener(
    "keypress",
    event => {
      const key = event.key
      switch (key) {
        case "w":
          model_mat = mat.multiply(mat.xRotation(ROTATION_ANGLE), model_mat)
          break
        case "s":
          model_mat = mat.multiply(mat.xRotation(-ROTATION_ANGLE), model_mat)
          break
        case "a":
          model_mat = mat.multiply(mat.yRotation(ROTATION_ANGLE), model_mat)
          break
        case "d":
          model_mat = mat.multiply(mat.yRotation(-ROTATION_ANGLE), model_mat)
          break
        case "r":
          draw()
          break
        case " ":
          break
        default:
          return
      }
      redraw()
      return
    },
    false
  )
}
main()
