import glmaths from '.'
import { equals } from './internalUtils'
import { Vec2 } from './vec2'
import { Vec3 } from './vec3'
import { Quat } from './quat'
import { Vec4 } from './vec4'

/**
 * 4x4 Matrix in column-major order
 * @extends Float32Array
 */
export class Mat4 extends Float32Array {

  static get identity() { return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) }
  static get Identity() { return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) }
  static get IDENTITY() { return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) }

  /**
   * Creates a new 4x4 matrix
   *
   * @param {Number} m00 component in column 0, row 0
   * @param {Number} m01 component in column 0, row 1
   * @param {Number} m02 component in column 0, row 2
   * @param {Number} m03 component in column 0, row 3
   * @param {Number} m10 component in column 1, row 0
   * @param {Number} m11 component in column 1, row 1
   * @param {Number} m12 component in column 1, row 2
   * @param {Number} m13 component in column 1, row 3
   * @param {Number} m20 component in column 2, row 0
   * @param {Number} m21 component in column 2, row 1
   * @param {Number} m22 component in column 2, row 2
   * @param {Number} m23 component in column 2, row 3
   * @param {Number} m30 component in column 3, row 0
   * @param {Number} m31 component in column 3, row 1
   * @param {Number} m32 component in column 3, row 2
   * @param {Number} m33 component in column 3, row 3
   */
  constructor(
    m00 = 0, m01 = 0, m02 = 0, m03 = 0,
    m10 = 0, m11 = 0, m12 = 0, m13 = 0,
    m20 = 0, m21 = 0, m22 = 0, m23 = 0,
    m30 = 0, m31 = 0, m32 = 0, m33 = 0
  ) {
    super(16)
    this[0]  = m00
    this[1]  = m01
    this[2]  = m02
    this[3]  = m03
    this[4]  = m10
    this[5]  = m11
    this[6]  = m12
    this[7]  = m13
    this[8]  = m20
    this[9]  = m21
    this[10] = m22
    this[11] = m23
    this[12] = m30
    this[13] = m31
    this[14] = m32
    this[15] = m33
  }

  /**
   * Creates a new mat4 initialized with values from a matrix
   *
   * @returns {Mat4} a new 4x4 matrix
   */
  clone() {
    return mat4(
      this[0], this[1], this[2], this[3],
      this[4], this[5], this[6], this[7],
      this[8], this[9], this[10], this[11],
      this[12], this[13], this[14], this[15]
    )
  }

  /**
   * Transposes a mat4
   *
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  transpose(out = glmaths.ALWAYS_COPY ? mat4() : this) {
    if (out === this) {
      const a01 = this[1], a02 = this[2], a03 = this[3]
      const a12 = this[6], a13 = this[7], a23 = this[11]
      out[1] = this[4]
      out[2] = this[8]
      out[3] = this[12]
      out[4] = a01
      out[6] = this[9]
      out[7] = this[13]
      out[8] = a02
      out[9] = a12
      out[11] = this[14]
      out[12] = a03
      out[13] = a13
      out[14] = a23
    } else {
      out[0] = this[0]; out[1] = this[4]; out[2] = this[8]; out[3] = this[12]
      out[4] = this[1]; out[5] = this[5]; out[6] = this[9]; out[7] = this[13]
      out[8] = this[2]; out[9] = this[6]; out[10] = this[10]; out[11] = this[14]
      out[12] = this[3]; out[13] = this[7]; out[14] = this[11]; out[15] = this[15]
    }
    return out
  }

  /**
   * Inverts a mat4
   *
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  invert(out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]
    const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15]

    const b00 = a00 * a11 - a01 * a10
    const b01 = a00 * a12 - a02 * a10
    const b02 = a00 * a13 - a03 * a10
    const b03 = a01 * a12 - a02 * a11
    const b04 = a01 * a13 - a03 * a11
    const b05 = a02 * a13 - a03 * a12
    const b06 = a20 * a31 - a21 * a30
    const b07 = a20 * a32 - a22 * a30
    const b08 = a20 * a33 - a23 * a30
    const b09 = a21 * a32 - a22 * a31
    const b10 = a21 * a33 - a23 * a31
    const b11 = a22 * a33 - a23 * a32

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
    if (!det) return null
    det = 1.0 / det

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det
    return out
  }

  /**
   * Calculates the adjugate of a mat4
   *
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  adjoint(out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]
    const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15]

    const b00 = a00 * a11 - a01 * a10
    const b01 = a00 * a12 - a02 * a10
    const b02 = a00 * a13 - a03 * a10
    const b03 = a01 * a12 - a02 * a11
    const b04 = a01 * a13 - a03 * a11
    const b05 = a02 * a13 - a03 * a12
    const b06 = a20 * a31 - a21 * a30
    const b07 = a20 * a32 - a22 * a30
    const b08 = a20 * a33 - a23 * a30
    const b09 = a21 * a32 - a22 * a31
    const b10 = a21 * a33 - a23 * a31
    const b11 = a22 * a33 - a23 * a32

    out[0] = a11 * b11 - a12 * b10 + a13 * b09
    out[1] = a02 * b10 - a01 * b11 - a03 * b09
    out[2] = a31 * b05 - a32 * b04 + a33 * b03
    out[3] = a22 * b04 - a21 * b05 - a23 * b03
    out[4] = a12 * b08 - a10 * b11 - a13 * b07
    out[5] = a00 * b11 - a02 * b08 + a03 * b07
    out[6] = a32 * b02 - a30 * b05 - a33 * b01
    out[7] = a20 * b05 - a22 * b02 + a23 * b01
    out[8] = a10 * b10 - a11 * b08 + a13 * b06
    out[9] = a01 * b08 - a00 * b10 - a03 * b06
    out[10] = a30 * b04 - a31 * b02 + a33 * b00
    out[11] = a21 * b02 - a20 * b04 - a23 * b00
    out[12] = a11 * b07 - a10 * b09 - a12 * b06
    out[13] = a00 * b09 - a01 * b07 + a02 * b06
    out[14] = a31 * b01 - a30 * b03 - a32 * b00
    out[15] = a20 * b03 - a21 * b01 + a22 * b00
    return out
  }

  /**
   * Calculates the determinant of a mat4
   *
   * @returns {Number} determinant of a mat4
   */
  determinant() {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]
    const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15]
    return (
      (a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) -
      (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) +
      (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) +
      (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) -
      (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) +
      (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30)
    )
  }

  /**
   * Multiplies with another matrix, or transforms a vector
   *
   * @param {Vec2 | Vec3 | Vec4 | Mat4} b the second operand
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  multiply(b: Vec2): Vec2
  multiply(b: Vec3): Vec3
  multiply(b: Vec4): Vec4
  multiply(b: Mat4, out?: Mat4): Mat4
  multiply(b: Mat4 | Vec2 | Vec3 | Vec4, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    if (b instanceof Vec2)
      return b.transformMat4(this)
    if (b instanceof Vec3)
      return b.transformMat4(this)
    if (b instanceof Vec4)
      return b.transformMat4(this)

    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]
    const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15]

    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7]
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11]
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15]
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
    return out
  }

  /**
   * Translates a mat4 by the given Vec3
   *
   * @param {Vec3} v vector to translate by
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  translate(v: Vec3, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const x = v[0], y = v[1], z = v[2]
    if (out === this) {
      out[12] = this[0] * x + this[4] * y + this[8] * z + this[12]
      out[13] = this[1] * x + this[5] * y + this[9] * z + this[13]
      out[14] = this[2] * x + this[6] * y + this[10] * z + this[14]
      out[15] = this[3] * x + this[7] * y + this[11] * z + this[15]
    } else {
      const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
      const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
      const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]
      out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03
      out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13
      out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23
      out[12] = a00 * x + a10 * y + a20 * z + this[12]
      out[13] = a01 * x + a11 * y + a21 * z + this[13]
      out[14] = a02 * x + a12 * y + a22 * z + this[14]
      out[15] = a03 * x + a13 * y + a23 * z + this[15]
    }
    return out
  }

  /**
   * Scales a mat4 by the dimensions in the given Vec3 not using vectorization
   *
   * @param {Vec3} v the Vec3 to scale the matrix by
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  scale(v: Vec3, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const x = v[0], y = v[1], z = v[2]
    out[0] = this[0] * x; out[1] = this[1] * x; out[2] = this[2] * x; out[3] = this[3] * x
    out[4] = this[4] * y; out[5] = this[5] * y; out[6] = this[6] * y; out[7] = this[7] * y
    out[8] = this[8] * z; out[9] = this[9] * z; out[10] = this[10] * z; out[11] = this[11] * z
    out[12] = this[12]; out[13] = this[13]; out[14] = this[14]; out[15] = this[15]
    return out
  }

  /**
   * Rotates a mat4 by the given angle around the given axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Vec3} axis the axis to rotate around
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  rotate(rad: number, axis: Vec3, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    let x = axis[0], y = axis[1], z = axis[2]
    let len = Math.sqrt(x * x + y * y + z * z)
    if (len < glmaths.EPSILON) return null
    len = 1 / len
    x *= len; y *= len; z *= len

    const s = Math.sin(rad), c = Math.cos(rad), t = 1 - c
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]

    const b00 = x * x * t + c,     b01 = y * x * t + z * s, b02 = z * x * t - y * s
    const b10 = x * y * t - z * s, b11 = y * y * t + c,     b12 = z * y * t + x * s
    const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c

    out[0] = a00 * b00 + a10 * b01 + a20 * b02
    out[1] = a01 * b00 + a11 * b01 + a21 * b02
    out[2] = a02 * b00 + a12 * b01 + a22 * b02
    out[3] = a03 * b00 + a13 * b01 + a23 * b02
    out[4] = a00 * b10 + a10 * b11 + a20 * b12
    out[5] = a01 * b10 + a11 * b11 + a21 * b12
    out[6] = a02 * b10 + a12 * b11 + a22 * b12
    out[7] = a03 * b10 + a13 * b11 + a23 * b12
    out[8] = a00 * b20 + a10 * b21 + a20 * b22
    out[9] = a01 * b20 + a11 * b21 + a21 * b22
    out[10] = a02 * b20 + a12 * b21 + a22 * b22
    out[11] = a03 * b20 + a13 * b21 + a23 * b22
    out[12] = this[12]; out[13] = this[13]; out[14] = this[14]; out[15] = this[15]
    return out
  }

  /**
   * Rotates a mat4 by the given angle around the X axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  rotateX(rad: number, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const s = Math.sin(rad), c = Math.cos(rad)
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]

    out[4] = a10 * c + a20 * s; out[5] = a11 * c + a21 * s
    out[6] = a12 * c + a22 * s; out[7] = a13 * c + a23 * s
    out[8] = a20 * c - a10 * s; out[9] = a21 * c - a11 * s
    out[10] = a22 * c - a12 * s; out[11] = a23 * c - a13 * s

    if (out !== this) {
      out[0] = this[0]; out[1] = this[1]; out[2] = this[2]; out[3] = this[3]
      out[12] = this[12]; out[13] = this[13]; out[14] = this[14]; out[15] = this[15]
    }
    return out
  }

  /**
   * Rotates a mat4 by the given angle around the Y axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  rotateY(rad: number, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const s = Math.sin(rad), c = Math.cos(rad)
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11]

    out[0] = a00 * c - a20 * s; out[1] = a01 * c - a21 * s
    out[2] = a02 * c - a22 * s; out[3] = a03 * c - a23 * s
    out[8] = a00 * s + a20 * c; out[9] = a01 * s + a21 * c
    out[10] = a02 * s + a22 * c; out[11] = a03 * s + a23 * c

    if (out !== this) {
      out[4] = this[4]; out[5] = this[5]; out[6] = this[6]; out[7] = this[7]
      out[12] = this[12]; out[13] = this[13]; out[14] = this[14]; out[15] = this[15]
    }
    return out
  }

  /**
   * Rotates a mat4 by the given angle around the Z axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  rotateZ(rad: number, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    const s = Math.sin(rad), c = Math.cos(rad)
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3]
    const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7]

    out[0] = a00 * c + a10 * s; out[1] = a01 * c + a11 * s
    out[2] = a02 * c + a12 * s; out[3] = a03 * c + a13 * s
    out[4] = a10 * c - a00 * s; out[5] = a11 * c - a01 * s
    out[6] = a12 * c - a02 * s; out[7] = a13 * c - a03 * s

    if (out !== this) {
      out[8] = this[8]; out[9] = this[9]; out[10] = this[10]; out[11] = this[11]
      out[12] = this[12]; out[13] = this[13]; out[14] = this[14]; out[15] = this[15]
    }
    return out
  }

  /**
   * Returns the translation vector component of a transformation matrix
   *
   * @param {Vec3} out vector to receive the translation values, defaults to new Vec3()
   * @returns {Vec3} out
   */
  getTranslation(out = new Vec3()) {
    out[0] = this[12]; out[1] = this[13]; out[2] = this[14]
    return out
  }

  /**
   * Returns the scaling factor component of a transformation matrix
   *
   * @param {Vec3} out vector to receive the scaling factor values, defaults to new Vec3()
   * @returns {Vec3} out
   */
  getScaling(out = new Vec3()) {
    const m11 = this[0], m12 = this[1], m13 = this[2]
    const m21 = this[4], m22 = this[5], m23 = this[6]
    const m31 = this[8], m32 = this[9], m33 = this[10]
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13)
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23)
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
    return out
  }

  /**
   * Returns a quaternion representing the rotational component
   *  of a transformation matrix. If a matrix is built with
   *  fromRotationTranslation, the returned quaternion will be the
   *  same as the quaternion originally supplied.
   * 
   * @param {Quat} out quaternion to receive the rotation values, defaults to new Quat()
   * @returns {Quat} out
   */
  getRotation(out = new Quat()) {
    const scaling = this.getScaling()
    const is1 = 1 / scaling[0], is2 = 1 / scaling[1], is3 = 1 / scaling[2]

    const sm11 = this[0] * is1, sm12 = this[1] * is2, sm13 = this[2] * is3
    const sm21 = this[4] * is1, sm22 = this[5] * is2, sm23 = this[6] * is3
    const sm31 = this[8] * is1, sm32 = this[9] * is2, sm33 = this[10] * is3

    const trace = sm11 + sm22 + sm33
    let S = 0

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2
      out[3] = 0.25 * S
      out[0] = (sm23 - sm32) / S
      out[1] = (sm31 - sm13) / S
      out[2] = (sm12 - sm21) / S
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2
      out[3] = (sm23 - sm32) / S
      out[0] = 0.25 * S
      out[1] = (sm12 + sm21) / S
      out[2] = (sm31 + sm13) / S
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2
      out[3] = (sm31 - sm13) / S
      out[0] = (sm12 + sm21) / S
      out[1] = 0.25 * S
      out[2] = (sm23 + sm32) / S
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2
      out[3] = (sm12 - sm21) / S
      out[0] = (sm31 + sm13) / S
      out[1] = (sm23 + sm32) / S
      out[2] = 0.25 * S
    }
    return out
  }

  /**
   * Decomposes a transformation matrix into its rotation, translation, and scale components
   *
   * @param {Quat} out_r quaternion to receive the rotation component, defaults to new Quat()
   * @param {Vec3} out_t vector to receive the translation component, defaults to new Vec3()
   * @param {Vec3} out_s vector to receive the scaling component, defaults to new Vec3()
   * @returns {Quat} out_r
   */
  decompose(out_r = new Quat(), out_t = new Vec3(), out_s = new Vec3()) {
    out_t[0] = this[12]; out_t[1] = this[13]; out_t[2] = this[14]

    const m11 = this[0], m12 = this[1], m13 = this[2]
    const m21 = this[4], m22 = this[5], m23 = this[6]
    const m31 = this[8], m32 = this[9], m33 = this[10]

    out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13)
    out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23)
    out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)

    const is1 = 1 / out_s[0], is2 = 1 / out_s[1], is3 = 1 / out_s[2]

    const sm11 = m11 * is1, sm12 = m12 * is2, sm13 = m13 * is3
    const sm21 = m21 * is1, sm22 = m22 * is2, sm23 = m23 * is3
    const sm31 = m31 * is1, sm32 = m32 * is2, sm33 = m33 * is3

    const trace = sm11 + sm22 + sm33
    let S = 0

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2
      out_r[3] = 0.25 * S
      out_r[0] = (sm23 - sm32) / S
      out_r[1] = (sm31 - sm13) / S
      out_r[2] = (sm12 - sm21) / S
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2
      out_r[3] = (sm23 - sm32) / S
      out_r[0] = 0.25 * S
      out_r[1] = (sm12 + sm21) / S
      out_r[2] = (sm31 + sm13) / S
    } else if (sm22 > sm33) {
      S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2
      out_r[3] = (sm31 - sm13) / S
      out_r[0] = (sm12 + sm21) / S
      out_r[1] = 0.25 * S
      out_r[2] = (sm23 + sm32) / S
    } else {
      S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2
      out_r[3] = (sm12 - sm21) / S
      out_r[0] = (sm31 + sm13) / S
      out_r[1] = (sm23 + sm32) / S
      out_r[2] = 0.25 * S
    }
    return out_r
  }

  /**
   * Creates a matrix from a vector translation
   *
   * @param {Vec3} v translation vector
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromTranslation(v: Vec3, out = mat4()) {
    out[0] = out[5] = out[10] = out[15] = 1
    out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[11] = 0
    out[12] = v[0]
    out[13] = v[1]
    out[14] = v[2]
    return out
  }

  /**
   * Creates a matrix from a vector scaling
   *
   * @param {Vec3} v scaling vector
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromScaling(v: Vec3, out = mat4()) {
    out[0] = v[0]
    out[5] = v[1]
    out[10] = v[2]
    out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[11] = out[12] = out[13] = out[14] = 0
    out[15] = 1
    return out
  }

  /**
   * Creates a matrix from a given angle around a given axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Vec3} axis the axis to rotate around
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromRotation(rad: number, axis: Vec3, out = mat4()) {
    let x = axis[0], y = axis[1], z = axis[2]
    let len = Math.sqrt(x * x + y * y + z * z)
    if (len < glmaths.EPSILON) return null
    len = 1 / len
    x *= len; y *= len; z *= len

    const s = Math.sin(rad), c = Math.cos(rad), t = 1 - c

    out[0] = x * x * t + c; out[1] = y * x * t + z * s; out[2] = z * x * t - y * s; out[3] = 0
    out[4] = x * y * t - z * s; out[5] = y * y * t + c; out[6] = z * y * t + x * s; out[7] = 0
    out[8] = x * z * t + y * s; out[9] = y * z * t - x * s; out[10] = z * z * t + c; out[11] = 0
    out[12] = out[13] = out[14] = 0
    out[15] = 1
    return out
  }

  /**
   * Creates a matrix from the given angle around the X axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromXRotation(rad: number, out = mat4()) {
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = 1
    out[1] = out[2] = out[3] = out[4] = out[7] = out[8] = out[11] = out[12] = out[13] = out[14] = 0
    out[5] = c
    out[6] = s
    out[9] = -s
    out[10] = c
    out[15] = 1
    return out
  }

  /**
   * Creates a matrix from the given angle around the Y axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromYRotation(rad: number, out = mat4()) {
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = c
    out[1] = out[3] = out[4] = out[6] = out[7] = out[9] = out[11] = out[12] = out[13] = out[14] = 0
    out[2] = -s
    out[5] = out[15] = 1
    out[8] = s
    out[10] = c
    return out
  }

  /**
   * Creates a matrix from the given angle around the Z axis
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromZRotation(rad: number, out = mat4()) {
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = c
    out[1] = s 
    out[4] = -s
    out[5] = c 
    out[2] = out[3] = out[6] = out[7] = out[8] = out[9] = out[11] = out[12] = out[13] = out[14] = 0
    out[10] = out[15] = 1
    return out
  }

  /**
   * Creates a matrix from a quaternion rotation and vector translation
   *
   * @param {Quat} q rotation quaternion
   * @param {Vec3} v translation vector
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromRotationTranslation(q: Quat, v: Vec3, out = mat4()) {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, xy = x * y2, xz = x * z2
    const yy = y * y2, yz = y * z2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2

    out[0] = 1 - (yy + zz); out[1] = xy + wz; out[2] = xz - wy
    out[3] = out[7] = out[11] = 0
    out[4] = xy - wz; out[5] = 1 - (xx + zz); out[6] = yz + wx
    out[8] = xz + wy; out[9] = yz - wx; out[10] = 1 - (xx + yy)
    out[12] = v[0]; out[13] = v[1]; out[14] = v[2]; out[15] = 1
    return out
  }

  /**
   * Creates a matrix from a quaternion rotation, vector translation, and vector scale
   *
   * @param {Quat} q rotation quaternion
   * @param {Vec3} v translation vector
   * @param {Vec3} s scaling vector
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromRotationTranslationScale(q: Quat, v: Vec3, s: Vec3, out = mat4()) {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, xy = x * y2, xz = x * z2
    const yy = y * y2, yz = y * z2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2
    const sx = s[0], sy = s[1], sz = s[2]

    out[0] = (1 - (yy + zz)) * sx; out[1] = (xy + wz) * sx; out[2] = (xz - wy) * sx;
    out[3] = out[7] = out[11] = 0 
    out[4] = (xy - wz) * sy; out[5] = (1 - (xx + zz)) * sy; out[6] = (yz + wx) * sy;
    out[8] = (xz + wy) * sz; out[9] = (yz - wx) * sz; out[10] = (1 - (xx + yy)) * sz; 
    out[12] = v[0]; out[13] = v[1]; out[14] = v[2]; out[15] = 1
    return out
  }

  /**
   * Creates a matrix from a quaternion rotation, vector translation, vector scale, and origin
   *
   * @param {Quat} q rotation quaternion
   * @param {Vec3} v translation vector
   * @param {Vec3} s scaling vector
   * @param {Vec3} o the origin vector
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromRotationTranslationScaleOrigin(q: Quat, v: Vec3, s: Vec3, o: Vec3, out = mat4()) {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, xy = x * y2, xz = x * z2
    const yy = y * y2, yz = y * z2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2
    const sx = s[0], sy = s[1], sz = s[2]
    const ox = o[0], oy = o[1], oz = o[2]

    const out0 = (1 - (yy + zz)) * sx
    const out1 = (xy + wz) * sx
    const out2 = (xz - wy) * sx
    const out4 = (xy - wz) * sy
    const out5 = (1 - (xx + zz)) * sy
    const out6 = (yz + wx) * sy
    const out8 = (xz + wy) * sz
    const out9 = (yz - wx) * sz
    const out10 = (1 - (xx + yy)) * sz

    out[0] = out0; out[1] = out1; out[2] = out2 
    out[4] = out4; out[5] = out5; out[6] = out6
    out[8] = out8; out[9] = out9; out[10] = out10
    out[3] = out[7] = out[11] = 0
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz)
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz)
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz)
    out[15] = 1
    return out
  }

  /**
   * Calculates a 4x4 matrix from the given quaternion
   *
   * @param {Quat} q quaternion to create matrix from
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static fromQuat(q: Quat, out = mat4()) {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, yx = y * x2, yy = y * y2
    const zx = z * x2, zy = z * y2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2

    out[0] = 1 - yy - zz; out[1] = yx + wz; out[2] = zx - wy
    out[4] = yx - wz; out[5] = 1 - xx - zz; out[6] = zy + wx
    out[8] = zx + wy; out[9] = zy - wx; out[10] = 1 - xx - yy
    out[3] = out[7] = out[11] = out[12] = out[13] = out[14] = 0
    out[15] = 1
    return out
  }

  /**
   * Generates a frustum matrix with the given bounds
   *
   * @param {Number} left left bound of the frustum
   * @param {Number} right right bound of the frustum
   * @param {Number} bottom bottom bound of the frustum
   * @param {Number} top top bound of the frustum
   * @param {Number} near near bound of the frustum
   * @param {Number} far far bound of the frustum
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, out = mat4()) {
    const rl = 1 / (right - left)
    const tb = 1 / (top - bottom)
    const nf = 1 / (near - far)
    const lh = glmaths.LEFT_HANDED
    out[0] = near * 2 * rl
    out[5] = near * 2 * tb
    out[8] = (right + left) * rl; out[9] = (top + bottom) * tb; out[10] = lh ? -(far + near) * nf : (far + near) * nf; out[11] = lh ? 1 : -1
    out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[12] = out[13] = out[15] = 0
    out[14] = far * near * 2 * nf
    return out
  }

  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   *
   * @param {Number} fovy vertical field of view in radians
   * @param {Number} aspect aspect ratio, typically viewport width / height
   * @param {Number} near near bound of the frustum
   * @param {Number | null} far far bound of the frustum, can be null or Infinity
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static perspectiveNO(fovy: number, aspect: number, near: number, far: number | null, out = mat4()) {
    const f = 1.0 / Math.tan(fovy / 2)
    const lh = glmaths.LEFT_HANDED
    out[0] = f / aspect
    out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[12] = out[13] = out[15] = 0
    out[5] = f
    out[11] = lh ? 1 : -1
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far)
      out[10] = lh ? -(far + near) * nf : (far + near) * nf
      out[14] = 2 * far * near * nf
    } else {
      out[10] = lh ? 1 : -1
      out[14] = -2 * near
    }
    return out
  }
  static perspective = this.perspectiveNO

  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   *
   * @param {Number} fovy vertical field of view in radians
   * @param {Number} aspect aspect ratio, typically viewport width / height
   * @param {Number} near near bound of the frustum
   * @param {Number | null} far far bound of the frustum, can be null or Infinity
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static perspectiveZO(fovy: number, aspect: number, near: number, far: number | null, out = mat4()) {
    const f = 1.0 / Math.tan(fovy / 2)
    const lh = glmaths.LEFT_HANDED
    out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0
    out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0
    out[8] = 0; out[9] = 0; out[11] = lh ? 1 : -1
    out[12] = 0; out[13] = 0; out[15] = 0
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far)
      out[10] = lh ? -far * nf : far * nf
      out[14] = far * near * nf
    } else {
      out[10] = lh ? 1 : -1
      out[14] = -near
    }
    return out
  }

  /**
   * Generates a perspective projection matrix with the given field of view
   *
   * @param {Object} fov object containing upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param {Number} near near bound of the frustum
   * @param {Number} far far bound of the frustum
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static perspectiveFromFieldOfView(fov: { upDegrees: number, downDegrees: number, leftDegrees: number, rightDegrees: number }, near: number, far: number, out = mat4()) {
    const upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0)
    const downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0)
    const leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0)
    const rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0)
    const xScale = 2.0 / (leftTan + rightTan)
    const yScale = 2.0 / (upTan + downTan)

    out[0] = xScale; out[1] = 0; out[2] = 0; out[3] = 0
    out[4] = 0; out[5] = yScale; out[6] = 0; out[7] = 0
    const lh = glmaths.LEFT_HANDED
    out[8] = -((leftTan - rightTan) * xScale * 0.5)
    out[9] = (upTan - downTan) * yScale * 0.5
    out[10] = lh ? -far / (near - far) : far / (near - far)
    out[11] = lh ? 1.0 : -1.0
    out[12] = 0; out[13] = 0
    out[14] = (far * near) / (near - far)
    out[15] = 0
    return out
  }

  /**
   * Generates an orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   *
   * @param {Number} left left bound of the frustum
   * @param {Number} right right bound of the frustum
   * @param {Number} bottom bottom bound of the frustum
   * @param {Number} top top bound of the frustum
   * @param {Number} near near bound of the frustum
   * @param {Number} far far bound of the frustum
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static orthoNO(left: number, right: number, bottom: number, top: number, near: number, far: number, out = mat4()) {
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    const s = glmaths.LEFT_HANDED ? -1 : 1
    out[0] = -2 * lr; out[1] = 0; out[2] = 0; out[3] = 0
    out[4] = 0; out[5] = -2 * bt; out[6] = 0; out[7] = 0
    out[8] = 0; out[9] = 0; out[10] = s * 2 * nf; out[11] = 0
    out[12] = (left + right) * lr; out[13] = (top + bottom) * bt; out[14] = (far + near) * nf; out[15] = 1
    return out
  }
  static ortho = this.orthoNO

  /**
   * Generates an orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   *
   * @param {Number} left left bound of the frustum
   * @param {Number} right right bound of the frustum
   * @param {Number} bottom bottom bound of the frustum
   * @param {Number} top top bound of the frustum
   * @param {Number} near near bound of the frustum
   * @param {Number} far far bound of the frustum
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static orthoZO(left: number, right: number, bottom: number, top: number, near: number, far: number, out = mat4()) {
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    const s = glmaths.LEFT_HANDED ? -1 : 1
    out[0] = -2 * lr; out[1] = 0; out[2] = 0; out[3] = 0
    out[4] = 0; out[5] = -2 * bt; out[6] = 0; out[7] = 0
    out[8] = 0; out[9] = 0; out[10] = s * nf; out[11] = 0
    out[12] = (left + right) * lr; out[13] = (top + bottom) * bt; out[14] = near * nf; out[15] = 1
    return out
  }

  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, use targetTo instead.
   *
   * @param {Vec3} eye position of the viewer
   * @param {Vec3} center point the viewer is looking at
   * @param {Vec3} up vector pointing up
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static lookAt(eye: Vec3, center: Vec3, up: Vec3, out = mat4()) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len

    const eyex = eye[0], eyey = eye[1], eyez = eye[2]
    const upx = up[0], upy = up[1], upz = up[2]
    const centerx = center[0], centery = center[1], centerz = center[2]

    if (eye.equals(center)) {
      out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0
      out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0
      out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0
      out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1
      return out
    }

    if (glmaths.LEFT_HANDED) {
      z0 = centerx - eyex; z1 = centery - eyey; z2 = centerz - eyez
    } else {
      z0 = eyex - centerx; z1 = eyey - centery; z2 = eyez - centerz
    }
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
    z0 *= len; z1 *= len; z2 *= len

    x0 = upy * z2 - upz * z1
    x1 = upz * z0 - upx * z2
    x2 = upx * z1 - upy * z0
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
    if (!len) { x0 = 0; x1 = 0; x2 = 0 }
    else { len = 1 / len; x0 *= len; x1 *= len; x2 *= len }

    y0 = z1 * x2 - z2 * x1
    y1 = z2 * x0 - z0 * x2
    y2 = z0 * x1 - z1 * x0
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)
    if (!len) { y0 = 0; y1 = 0; y2 = 0 }
    else { len = 1 / len; y0 *= len; y1 *= len; y2 *= len }

    out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0
    out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0
    out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)
    out[15] = 1
    return out
  }

  /**
   * Generates a matrix that makes something look at a given point from a given eye position
   *
   * @param {Vec3} eye position of the viewer
   * @param {Vec3} target point the viewer is looking at
   * @param {Vec3} up vector pointing up
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  static targetTo(eye: Vec3, target: Vec3, up: Vec3, out = mat4()) {
    const eyex = eye[0], eyey = eye[1], eyez = eye[2]
    const upx = up[0], upy = up[1], upz = up[2]

    let z0, z1, z2
    if (glmaths.LEFT_HANDED) {
      z0 = target[0] - eyex; z1 = target[1] - eyey; z2 = target[2] - eyez
    } else {
      z0 = eyex - target[0]; z1 = eyey - target[1]; z2 = eyez - target[2]
    }
    let len = z0 * z0 + z1 * z1 + z2 * z2
    if (len > 0) {
      len = 1 / Math.sqrt(len)
      z0 *= len; z1 *= len; z2 *= len
    }

    let x0 = upy * z2 - upz * z1
    let x1 = upz * z0 - upx * z2
    let x2 = upx * z1 - upy * z0
    len = x0 * x0 + x1 * x1 + x2 * x2
    if (len > 0) {
      len = 1 / Math.sqrt(len)
      x0 *= len; x1 *= len; x2 *= len
    }

    out[0] = x0; out[1] = x1; out[2] = x2; out[3] = 0
    out[4] = z1 * x2 - z2 * x1; out[5] = z2 * x0 - z0 * x2; out[6] = z0 * x1 - z1 * x0; out[7] = 0
    out[8] = z0; out[9] = z1; out[10] = z2; out[11] = 0
    out[12] = eyex; out[13] = eyey; out[14] = eyez; out[15] = 1
    return out
  }

  /**
   * Generates a perspective projection matrix with the far plane at infinity.
   * Uses clip space z range of [-1, 1].
   *
   * @param {Number} fovy Vertical field of view in radians
   * @param {Number} aspect Aspect ratio (width / height)
   * @param {Number} near Near bound of the frustum
   * @param {Mat4} out the receiving matrix, defaults to a new Mat4
   * @returns {Mat4} out
   */
  static infinitePerspective(fovy: number, aspect: number, near: number, out = mat4()) {
    const f = 1.0 / Math.tan(fovy / 2)
    const lh = glmaths.LEFT_HANDED
    out[0] = f / aspect
    out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[12] = out[13] = out[15] = 0
    out[5] = f
    out[10] = lh ? 1 : -1
    out[11] = lh ? 1 : -1
    out[14] = -2 * near
    return out
  }

  /**
   * Projects a 3D point to window coordinates using the given model and
   * projection matrices and viewport.
   *
   * @param {Vec3} obj the 3D point to project
   * @param {Mat4} model the model matrix
   * @param {Mat4} proj the projection matrix
   * @param {Vec4} viewport the viewport as [x, y, width, height]
   * @param {Vec3} out the receiving vector, defaults to a new Vec3
   * @returns {Vec3} out
   */
  static project(obj: Vec3, model: Mat4, proj: Mat4, viewport: Vec4, out = new Vec3()): Vec3 {
    const x = obj[0], y = obj[1], z = obj[2]
    const tx = model[0]*x + model[4]*y + model[8]*z + model[12]
    const ty = model[1]*x + model[5]*y + model[9]*z + model[13]
    const tz = model[2]*x + model[6]*y + model[10]*z + model[14]
    const tw = model[3]*x + model[7]*y + model[11]*z + model[15]

    let px = proj[0]*tx + proj[4]*ty + proj[8]*tz + proj[12]*tw
    let py = proj[1]*tx + proj[5]*ty + proj[9]*tz + proj[13]*tw
    let pz = proj[2]*tx + proj[6]*ty + proj[10]*tz + proj[14]*tw
    let pw = proj[3]*tx + proj[7]*ty + proj[11]*tz + proj[15]*tw

    pw = pw || 1.0
    px /= pw; py /= pw; pz /= pw

    out[0] = viewport[0] + viewport[2] * (px * 0.5 + 0.5)
    out[1] = viewport[1] + viewport[3] * (py * 0.5 + 0.5)
    out[2] = pz * 0.5 + 0.5
    return out
  }

  /**
   * Unprojects a 2D window coordinate back to 3D world coordinates using the
   * given model and projection matrices and viewport.
   *
   * @param {Vec3} win the window coordinate [x, y, z] where z is depth (0 to 1)
   * @param {Mat4} model the model matrix
   * @param {Mat4} proj the projection matrix
   * @param {Vec4} viewport the viewport as [x, y, width, height]
   * @param {Vec3} out the receiving vector, defaults to a new Vec3
   * @returns {Vec3 | null} out, or null if the combined matrix is not invertible
   */
  static unProject(win: Vec3, model: Mat4, proj: Mat4, viewport: Vec4, out = new Vec3()): Vec3 | null {
    const a00 = model[0], a01 = model[1], a02 = model[2], a03 = model[3]
    const a10 = model[4], a11 = model[5], a12 = model[6], a13 = model[7]
    const a20 = model[8], a21 = model[9], a22 = model[10], a23 = model[11]
    const a30 = model[12], a31 = model[13], a32 = model[14], a33 = model[15]

    const pm = mat4()
    let b0 = proj[0], b1 = proj[1], b2 = proj[2], b3 = proj[3]
    pm[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    pm[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    pm[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    pm[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33

    b0 = proj[4]; b1 = proj[5]; b2 = proj[6]; b3 = proj[7]
    pm[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    pm[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    pm[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    pm[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33

    b0 = proj[8]; b1 = proj[9]; b2 = proj[10]; b3 = proj[11]
    pm[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    pm[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    pm[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    pm[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33

    b0 = proj[12]; b1 = proj[13]; b2 = proj[14]; b3 = proj[15]
    pm[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    pm[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    pm[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    pm[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33

    const inv = pm.invert()
    if (!inv) return null

    const nx = (win[0] - viewport[0]) / viewport[2] * 2 - 1
    const ny = (win[1] - viewport[1]) / viewport[3] * 2 - 1
    const nz = win[2] * 2 - 1

    let w = inv[3]*nx + inv[7]*ny + inv[11]*nz + inv[15]
    w = w || 1.0
    out[0] = (inv[0]*nx + inv[4]*ny + inv[8]*nz + inv[12]) / w
    out[1] = (inv[1]*nx + inv[5]*ny + inv[9]*nz + inv[13]) / w
    out[2] = (inv[2]*nx + inv[6]*ny + inv[10]*nz + inv[14]) / w
    return out
  }

  /**
   * Returns Frobenius norm of a mat4
   *
   * @returns {Number} Frobenius norm
   */
  frob() {
    return Math.sqrt(
      this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3] +
      this[4] * this[4] + this[5] * this[5] + this[6] * this[6] + this[7] * this[7] +
      this[8] * this[8] + this[9] * this[9] + this[10] * this[10] + this[11] * this[11] +
      this[12] * this[12] + this[13] * this[13] + this[14] * this[14] + this[15] * this[15]
    )
  }

  /**
   * Adds two mat4's
   *
   * @param {Mat4} b the second operand
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  plus(b: Mat4, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    out[0] = this[0] + b[0]; out[1] = this[1] + b[1]; out[2] = this[2] + b[2]; out[3] = this[3] + b[3]
    out[4] = this[4] + b[4]; out[5] = this[5] + b[5]; out[6] = this[6] + b[6]; out[7] = this[7] + b[7]
    out[8] = this[8] + b[8]; out[9] = this[9] + b[9]; out[10] = this[10] + b[10]; out[11] = this[11] + b[11]
    out[12] = this[12] + b[12]; out[13] = this[13] + b[13]; out[14] = this[14] + b[14]; out[15] = this[15] + b[15]
    return out
  }

  /**
   * Subtracts matrix b from a mat4
   *
   * @param {Mat4} b the second operand
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  minus(b: Mat4, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    out[0] = this[0] - b[0]; out[1] = this[1] - b[1]; out[2] = this[2] - b[2]; out[3] = this[3] - b[3]
    out[4] = this[4] - b[4]; out[5] = this[5] - b[5]; out[6] = this[6] - b[6]; out[7] = this[7] - b[7]
    out[8] = this[8] - b[8]; out[9] = this[9] - b[9]; out[10] = this[10] - b[10]; out[11] = this[11] - b[11]
    out[12] = this[12] - b[12]; out[13] = this[13] - b[13]; out[14] = this[14] - b[14]; out[15] = this[15] - b[15]
    return out
  }

  /**
   * Multiplies each element of a mat4 by a scalar number
   *
   * @param {Number} b amount to scale the matrix's elements by
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  scaleScalar(b: number, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    out[0] = this[0] * b; out[1] = this[1] * b; out[2] = this[2] * b; out[3] = this[3] * b
    out[4] = this[4] * b; out[5] = this[5] * b; out[6] = this[6] * b; out[7] = this[7] * b
    out[8] = this[8] * b; out[9] = this[9] * b; out[10] = this[10] * b; out[11] = this[11] * b
    out[12] = this[12] * b; out[13] = this[13] * b; out[14] = this[14] * b; out[15] = this[15] * b
    return out
  }

  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value
   *
   * @param {Mat4} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @param {Mat4} out the receiving matrix, defaults to new mat4()
   * @returns {Mat4} out
   */
  multiplyScalarAndAdd(b: Mat4, scale: number, out = glmaths.ALWAYS_COPY ? mat4() : this) {
    out[0] = this[0] + b[0] * scale; out[1] = this[1] + b[1] * scale
    out[2] = this[2] + b[2] * scale; out[3] = this[3] + b[3] * scale
    out[4] = this[4] + b[4] * scale; out[5] = this[5] + b[5] * scale
    out[6] = this[6] + b[6] * scale; out[7] = this[7] + b[7] * scale
    out[8] = this[8] + b[8] * scale; out[9] = this[9] + b[9] * scale
    out[10] = this[10] + b[10] * scale; out[11] = this[11] + b[11] * scale
    out[12] = this[12] + b[12] * scale; out[13] = this[13] + b[13] * scale
    out[14] = this[14] + b[14] * scale; out[15] = this[15] + b[15] * scale
    return out
  }

  /**
   * Returns a string representation of a mat4
   *
   * @returns {String} string representation of the matrix
   */
  toString() {
    return `mat4(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]},\t${this[4]}, ${this[5]}, ${this[6]}, ${this[7]},\t${this[8]}, ${this[9]}, ${this[10]}, ${this[11]},\t${this[12]}, ${this[13]}, ${this[14]}, ${this[15]})`
  }

  /**
   * Returns whether a mat4 and another have exactly the same elements in the same position
   *
   * @param {Mat4} b the matrix to compare against
   * @returns {Boolean} true if the matrices are equal, false otherwise
   */
  exactEquals(b: Mat4) {
    return (
      this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3] &&
      this[4] === b[4] && this[5] === b[5] && this[6] === b[6] && this[7] === b[7] &&
      this[8] === b[8] && this[9] === b[9] && this[10] === b[10] && this[11] === b[11] &&
      this[12] === b[12] && this[13] === b[13] && this[14] === b[14] && this[15] === b[15]
    )
  }

  /**
   * Returns whether a mat4 and another are approximately equal
   *
   * @param {Mat4} b the matrix to compare against
   * @returns {Boolean} true if the matrices are approximately equal, false otherwise
   */
  equals(b: Mat4) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) && equals(this[3], b[3]) &&
      equals(this[4], b[4]) && equals(this[5], b[5]) && equals(this[6], b[6]) && equals(this[7], b[7]) &&
      equals(this[8], b[8]) && equals(this[9], b[9]) && equals(this[10], b[10]) && equals(this[11], b[11]) &&
      equals(this[12], b[12]) && equals(this[13], b[13]) && equals(this[14], b[14]) && equals(this[15], b[15])
    )
  }
}

export interface Mat4 {
  add: (b: Mat4, out?: Mat4) => Mat4
  sub: (b: Mat4, out?: Mat4) => Mat4
  subtract: (b: Mat4, out?: Mat4) => Mat4
  mul(b: Vec2): Vec2
  mul(b: Vec3): Vec3
  mul(b: Vec4): Vec4
  mul(b: Mat4, out?: Mat4): Mat4
  mult(b: Vec2): Vec2
  mult(b: Vec3): Vec3
  mult(b: Vec4): Vec4
  mult(b: Mat4, out?: Mat4): Mat4
  times(b: Vec2): Vec2
  times(b: Vec3): Vec3
  times(b: Vec4): Vec4
  times(b: Mat4, out?: Mat4): Mat4
  str: () => string
  multiplyScalar: (b: number, out?: Mat4) => Mat4
}

// @aliases
Mat4.prototype.add = Mat4.prototype.plus
Mat4.prototype.sub = Mat4.prototype.minus
Mat4.prototype.subtract = Mat4.prototype.minus
Mat4.prototype.mul = Mat4.prototype.multiply
Mat4.prototype.mult = Mat4.prototype.multiply
Mat4.prototype.times = Mat4.prototype.multiply
Mat4.prototype.str = Mat4.prototype.toString
Mat4.prototype.multiplyScalar = Mat4.prototype.scaleScalar

const createMat4 = (...args: (number | Float32Array)[]): Mat4 => {
  const out = new Mat4()
  let i = 0
  for (const a of args) {
    if (typeof a === 'number') out[i++] = a
    else for (const v of a) out[i++] = v
  }
  return out
}
Object.setPrototypeOf(createMat4, Mat4)
export const mat4 = createMat4 as typeof createMat4 & typeof Mat4
export const mat4x4 = mat4