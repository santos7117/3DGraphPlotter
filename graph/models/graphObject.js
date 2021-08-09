const GraphObject = {}
GraphObject.dims = 3
GraphObject.primitive = gl.TRIANGLE_STRIP
GraphObject.buff = gl.createBuffer()
GraphObject.normalsBuff = gl.createBuffer()
GraphObject.color = [0.5, 0.3, 0.5, 1]
GraphObject.fading = 0
GraphObject.ambientStrength = 0.1


function getSurface(minX, maxX, minZ, maxZ, n, func) {
  let surface = []
  let normals = []
  let stepX = (maxX - minX) / n
  let stepZ = (maxZ - minZ) / n
  let minY = Number.MAX_VALUE
  let maxY = -Number.MAX_VALUE

  const createSamples = (x, z) => {
    let realX = x * stepX + minX
    let realZ = z * stepZ + minZ
    let y = func(realX, realZ)

    if (maxY < y) {
      maxY = y
    }
    if (minY > y) {
      minY = y
    }

    surface.push(realX)
    surface.push(y)
    surface.push(realZ)

    return [realX, y, realZ]
  }

  addNormal = function () {
    let norm = mat.normal(triangle[0], triangle[1], triangle[2])
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        normals.push(norm[k])
      }
    }
  }

  for (let x = 0; x < n; x++) {
    for (let z = 0; z < n; z++) {
      var triangle = [
        createSamples(x + 1, z),
        createSamples(x, z),
        createSamples(x, z + 1),
      ]
      addNormal(triangle)

      triangle = [
        createSamples(x + 1, z),
        createSamples(x, z + 1),
        createSamples(x + 1, z + 1),
      ]
      addNormal(triangle)
    }
  }

  return {surface, normals, minY, maxY}
}