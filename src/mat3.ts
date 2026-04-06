import glmaths from '.'
import { create, equals } from './internalUtils'
import { Vec2, Vec2Like } from './vec2'
import { Vec3, Vec3Like } from './vec3'
import { Quat, QuatLike } from './quat'
import { Mat2x3, Mat2x3Like } from './mat2x3'
import { Mat4, Mat4Like } from './mat4'

export type Mat3Like = Mat3 | Mat3d

/**
 * 3x3 Matrix in column-major order, stored as 32-bit floats
 * @extends Float32Array
 */
export class Mat3 extends Float32Array {

  static get identity() { return new this.prototype.mat3(1, 0, 0, 0, 1, 0, 0, 0, 1) }
  static get Identity() { return new this.prototype.mat3(1, 0, 0, 0, 1, 0, 0, 0, 1) }
  static get IDENTITY() { return new this.prototype.mat3(1, 0, 0, 0, 1, 0, 0, 0, 1) }

  /**
   * Create a new mat3 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   */
  constructor(m00 = 0, m01 = 0, m02 = 0, m10 = 0, m11 = 0, m12 = 0, m20 = 0, m21 = 0, m22 = 0) {
    super(9)
    this[0] = m00
    this[1] = m01
    this[2] = m02
    this[3] = m10
    this[4] = m11
    this[5] = m12
    this[6] = m20
    this[7] = m21
    this[8] = m22
  }

  /**
   * Creates a new mat3 initialized with values from a matrix
   *
   * @returns {Mat3} a new Mat3
   */
  clone() {
    return new this.mat3(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8])
  }

  /**
   * Transposes a mat3
   *
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  transpose<Out extends Mat3Like = Mat3>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    if (out === this as any) {
      const a01 = this[1], a02 = this[2], a12 = this[5]
      out[1] = this[3]
      out[2] = this[6]
      out[3] = a01
      out[5] = this[7]
      out[6] = a02
      out[7] = a12
    } else {
      out[0] = this[0]
      out[1] = this[3]
      out[2] = this[6]
      out[3] = this[1]
      out[4] = this[4]
      out[5] = this[7]
      out[6] = this[2]
      out[7] = this[5]
      out[8] = this[8]
    }
    return out
  }

  /**
   * Inverts a mat3
   *
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3|null} out, or null if not invertible
   */
  invert<Out extends Mat3Like = Mat3>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    const a00 = this[0], a01 = this[1], a02 = this[2]
    const a10 = this[3], a11 = this[4], a12 = this[5]
    const a20 = this[6], a21 = this[7], a22 = this[8]

    const b01 = a22 * a11 - a12 * a21
    const b11 = -a22 * a10 + a12 * a20
    const b21 = a21 * a10 - a11 * a20

    let det = a00 * b01 + a01 * b11 + a02 * b21
    if (!det) return null
    det = 1.0 / det

    out[0] = b01 * det
    out[1] = (-a22 * a01 + a02 * a21) * det
    out[2] = (a12 * a01 - a02 * a11) * det
    out[3] = b11 * det
    out[4] = (a22 * a00 - a02 * a20) * det
    out[5] = (-a12 * a00 + a02 * a10) * det
    out[6] = b21 * det
    out[7] = (-a21 * a00 + a01 * a20) * det
    out[8] = (a11 * a00 - a01 * a10) * det
    return out
  }

  /**
   * Calculates the adjugate of a mat3
   *
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  adjoint<Out extends Mat3Like = Mat3>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    const a00 = this[0], a01 = this[1], a02 = this[2]
    const a10 = this[3], a11 = this[4], a12 = this[5]
    const a20 = this[6], a21 = this[7], a22 = this[8]

    out[0] = a11 * a22 - a12 * a21
    out[1] = a02 * a21 - a01 * a22
    out[2] = a01 * a12 - a02 * a11
    out[3] = a12 * a20 - a10 * a22
    out[4] = a00 * a22 - a02 * a20
    out[5] = a02 * a10 - a00 * a12
    out[6] = a10 * a21 - a11 * a20
    out[7] = a01 * a20 - a00 * a21
    out[8] = a00 * a11 - a01 * a10
    return out
  }

  /**
   * Calculates the determinant of this mat3
   *
   * @returns {Number} determinant of this mat3
   */
  determinant() {
    const a00 = this[0], a01 = this[1], a02 = this[2]
    const a10 = this[3], a11 = this[4], a12 = this[5]
    const a20 = this[6], a21 = this[7], a22 = this[8]
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20)
  }

  /**
   * Multiplies two mat3's
   *
   * @param {Mat3} b the second operand
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  multiply(b: Vec2Like): Vec2
  multiply(b: Vec3Like): Vec3
  multiply<Out extends Mat3Like = Mat3>(b: Mat3Like, out?: Out): Out
  multiply<Out extends Mat3Like = Mat3>(b: Mat3Like | Vec3Like | Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    if (b instanceof Vec2)
      return b.transformMat3(this)
    if (b instanceof Vec3)
      return b.transformMat3(this)

    const a00 = this[0], a01 = this[1], a02 = this[2]
    const a10 = this[3], a11 = this[4], a12 = this[5]
    const a20 = this[6], a21 = this[7], a22 = this[8]

    const b00 = b[0], b01 = b[1], b02 = b[2]
    const b10 = b[3], b11 = b[4], b12 = b[5]
    const b20 = b[6], b21 = b[7], b22 = b[8]

    out[0] = b00 * a00 + b01 * a10 + b02 * a20
    out[1] = b00 * a01 + b01 * a11 + b02 * a21
    out[2] = b00 * a02 + b01 * a12 + b02 * a22
    out[3] = b10 * a00 + b11 * a10 + b12 * a20
    out[4] = b10 * a01 + b11 * a11 + b12 * a21
    out[5] = b10 * a02 + b11 * a12 + b12 * a22
    out[6] = b20 * a00 + b21 * a10 + b22 * a20
    out[7] = b20 * a01 + b21 * a11 + b22 * a21
    out[8] = b20 * a02 + b21 * a12 + b22 * a22
    return out
  }

  /**
   * Translates a mat3 by the given vector
   *
   * @param {Vec2} v vector to translate by
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  translate<Out extends Mat3Like = Mat3>(v: Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    const a00 = this[0], a01 = this[1], a02 = this[2]
    const a10 = this[3], a11 = this[4], a12 = this[5]
    const a20 = this[6], a21 = this[7], a22 = this[8]
    const x = v[0], y = v[1]

    out[0] = a00
    out[1] = a01
    out[2] = a02
    out[3] = a10
    out[4] = a11
    out[5] = a12
    out[6] = x * a00 + y * a10 + a20
    out[7] = x * a01 + y * a11 + a21
    out[8] = x * a02 + y * a12 + a22
    return out
  }

  /**
   * Rotates a mat3 by the given angle
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  rotate<Out extends Mat3Like = Mat3>(rad: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    const a00 = this[0], a01 = this[1], a02 = this[2]
    const a10 = this[3], a11 = this[4], a12 = this[5]
    const a20 = this[6], a21 = this[7], a22 = this[8]
    const s = Math.sin(rad), c = Math.cos(rad)

    out[0] = c * a00 + s * a10
    out[1] = c * a01 + s * a11
    out[2] = c * a02 + s * a12
    out[3] = c * a10 - s * a00
    out[4] = c * a11 - s * a01
    out[5] = c * a12 - s * a02
    out[6] = a20
    out[7] = a21
    out[8] = a22
    return out
  }

  /**
   * Scales a mat3 by the given vector
   *
   * @param {Vec2} v the vector to scale by
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  scale<Out extends Mat3Like = Mat3>(v: Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    const x = v[0], y = v[1]
    out[0] = x * this[0]
    out[1] = x * this[1]
    out[2] = x * this[2]
    out[3] = y * this[3]
    out[4] = y * this[4]
    out[5] = y * this[5]
    out[6] = this[6]
    out[7] = this[7]
    out[8] = this[8]
    return out
  }

  /**
   * Creates a matrix from a translation vector
   *
   * @param {Vec2} v translation vector
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static fromTranslation<Out extends Mat3Like = Mat3>(v: Vec2Like, out: Out = new this.prototype.mat3() as Out) {
    out[0] = 1
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 1
    out[5] = 0
    out[6] = v[0]
    out[7] = v[1]
    out[8] = 1
    return out
  }

  /**
   * Creates a matrix from a given angle
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static fromRotation<Out extends Mat3Like = Mat3>(rad: number, out: Out = new this.prototype.mat3() as Out) {
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = c
    out[1] = s
    out[2] = 0
    out[3] = -s
    out[4] = c
    out[5] = 0
    out[6] = 0
    out[7] = 0
    out[8] = 1
    return out
  }

  /**
   * Creates a matrix from a scaling vector
   *
   * @param {Vec2} v scaling vector
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static fromScaling<Out extends Mat3Like = Mat3>(v: Vec2Like, out: Out = new this.prototype.mat3() as Out) {
    out[0] = v[0]
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = v[1]
    out[5] = 0
    out[6] = 0
    out[7] = 0
    out[8] = 1
    return out
  }

  /**
   * Creates a mat3 from a Mat2x3
   *
   * @param {Mat2x3} a the Mat2x3 to convert
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static fromMat2x3<Out extends Mat3Like = Mat3>(a: Mat2x3Like, out: Out = new this.prototype.mat3() as Out) {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = 0
    out[3] = a[2]
    out[4] = a[3]
    out[5] = 0
    out[6] = a[4]
    out[7] = a[5]
    out[8] = 1
    return out
  }

  /**
   * Calculates a mat3 from the given quaternion
   *
   * @param {Quat} q quaternion to create matrix from
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static fromQuat<Out extends Mat3Like = Mat3>(q: QuatLike, out: Out = new this.prototype.mat3() as Out) {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, yx = y * x2, yy = y * y2
    const zx = z * x2, zy = z * y2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2

    out[0] = 1 - yy - zz
    out[3] = yx - wz
    out[6] = zx + wy

    out[1] = yx + wz
    out[4] = 1 - xx - zz
    out[7] = zy - wx

    out[2] = zx - wy
    out[5] = zy + wx
    out[8] = 1 - xx - yy
    return out
  }

  /**
   * Calculates a mat3 normal matrix (transpose inverse) from a mat4
   *
   * @param {Mat4} a the source mat4 to derive the normal matrix from
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3|null} out, or null if not invertible
   */
  static normalFromMat4<Out extends Mat3Like = Mat3>(a: Mat4Like, out: Out = new this.prototype.mat3() as Out) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15]

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
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det
    return out
  }

  /**
   * Copies the upper-left 3x3 values of a mat4 into a mat3
   *
   * @param {Mat4} a the source mat4
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static fromMat4<Out extends Mat3Like = Mat3>(a: Mat4Like, out: Out = new this.prototype.mat3() as Out) {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[4]
    out[4] = a[5]
    out[5] = a[6]
    out[6] = a[8]
    out[7] = a[9]
    out[8] = a[10]
    return out
  }
  static fromMat4x4: <Out extends Mat3Like = Mat3>(a: Mat4Like, out?: Out) => Out

  /**
   * Generates a 2D projection matrix with the given bounds
   *
   * @param {Number} width width of the projection
   * @param {Number} height height of the projection
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  static projection<Out extends Mat3Like = Mat3>(width: number, height: number, out: Out = new this.prototype.mat3() as Out) {
    out[0] = 2 / width
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = -2 / height
    out[5] = 0
    out[6] = -1
    out[7] = 1
    out[8] = 1
    return out
  }

  /**
   * Returns Frobenius norm of this mat3
   *
   * @returns {Number} Frobenius norm
   */
  frob() {
    return Math.sqrt(
      this[0] * this[0] + this[1] * this[1] + this[2] * this[2] +
      this[3] * this[3] + this[4] * this[4] + this[5] * this[5] +
      this[6] * this[6] + this[7] * this[7] + this[8] * this[8]
    )
  }

  /**
   * Adds two mat3's
   *
   * @param {Mat3Like} b the second operand
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  plus<Out extends Mat3Like = Mat3>(b: Mat3Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    out[0] = this[0] + b[0]
    out[1] = this[1] + b[1]
    out[2] = this[2] + b[2]
    out[3] = this[3] + b[3]
    out[4] = this[4] + b[4]
    out[5] = this[5] + b[5]
    out[6] = this[6] + b[6]
    out[7] = this[7] + b[7]
    out[8] = this[8] + b[8]
    return out
  }

  /**
   * Subtracts matrix b from this
   *
   * @param {Mat3Like} b the second operand
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  minus<Out extends Mat3Like = Mat3>(b: Mat3Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    out[0] = this[0] - b[0]
    out[1] = this[1] - b[1]
    out[2] = this[2] - b[2]
    out[3] = this[3] - b[3]
    out[4] = this[4] - b[4]
    out[5] = this[5] - b[5]
    out[6] = this[6] - b[6]
    out[7] = this[7] - b[7]
    out[8] = this[8] - b[8]
    return out
  }

  /**
   * Multiplies each element of a mat3 by a scalar number
   *
   * @param {Number} b amount to scale the matrix's elements by
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  scaleScalar<Out extends Mat3Like = Mat3>(b: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    out[0] = this[0] * b
    out[1] = this[1] * b
    out[2] = this[2] * b
    out[3] = this[3] * b
    out[4] = this[4] * b
    out[5] = this[5] * b
    out[6] = this[6] * b
    out[7] = this[7] * b
    out[8] = this[8] * b
    return out
  }

  /**
   * Adds two mat3's after multiplying each element of the second operand by a scalar value
   *
   * @param {Mat3Like} b the second operand
   * @param {Number} scale the amount to scale b's elements by before adding
   * @param {Mat3} out the receiving matrix, defaults to new mat3()
   * @returns {Mat3} out
   */
  multiplyScalarAndAdd<Out extends Mat3Like = Mat3>(b: Mat3Like, scale: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat3() : this) as Out) {
    out[0] = this[0] + b[0] * scale
    out[1] = this[1] + b[1] * scale
    out[2] = this[2] + b[2] * scale
    out[3] = this[3] + b[3] * scale
    out[4] = this[4] + b[4] * scale
    out[5] = this[5] + b[5] * scale
    out[6] = this[6] + b[6] * scale
    out[7] = this[7] + b[7] * scale
    out[8] = this[8] + b[8] * scale
    return out
  }

  /**
   * Returns a string representation of a mat3
   *
   * @returns {String} string representation of the matrix
   */
  toString() {
    return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]},\t${this[3]}, ${this[4]}, ${this[5]},\t${this[6]}, ${this[7]}, ${this[8]})`
  }

  /**
   * Returns whether two mat3's have exactly equal elements
   *
   * @param {Mat3Like} b the second matrix
   * @returns {Boolean} true if the matrices are exactly equal
   */
  exactEquals(b: Mat3Like) {
    return (
      this[0] === b[0] &&
      this[1] === b[1] &&
      this[2] === b[2] &&
      this[3] === b[3] &&
      this[4] === b[4] &&
      this[5] === b[5] &&
      this[6] === b[6] &&
      this[7] === b[7] &&
      this[8] === b[8]
    )
  }

  /**
   * Returns whether two mat3's have approximately equal elements
   *
   * @param {Mat3Like} b the second matrix
   * @returns {Boolean} true if the matrices are approximately equal
   */
  equals(b: Mat3Like) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) &&
      equals(this[3], b[3]) && equals(this[4], b[4]) && equals(this[5], b[5]) &&
      equals(this[6], b[6]) && equals(this[7], b[7]) && equals(this[8], b[8])
    )
  }
}

interface Mat3Impl<ThisMat3 extends Mat3Like> {
  transpose<Out extends Mat3Like = ThisMat3>(out?: Out): Out
  invert<Out extends Mat3Like = ThisMat3>(out?: Out): Out | null
  adjoint<Out extends Mat3Like = ThisMat3>(out?: Out): Out
  determinant(): number
  multiply(b: Vec2Like): Vec2
  multiply(b: Vec3Like): Vec3
  multiply<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  translate<Out extends Mat3Like = ThisMat3>(v: Vec2Like, out?: Out): Out
  rotate<Out extends Mat3Like = ThisMat3>(rad: number, out?: Out): Out
  scale<Out extends Mat3Like = ThisMat3>(v: Vec2Like, out?: Out): Out
  frob(): number
  plus<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  minus<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  scaleScalar<Out extends Mat3Like = ThisMat3>(b: number, out?: Out): Out
  multiplyScalarAndAdd<Out extends Mat3Like = ThisMat3>(b: Mat3Like, scale: number, out?: Out): Out
  exactEquals(b: Mat3Like): boolean
  equals(b: Mat3Like): boolean
  clone(): ThisMat3
  toString(): string

  add<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  sub<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  subtract<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  mul(b: Vec2Like): Vec2
  mul(b: Vec3Like): Vec3
  mul<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  mult(b: Vec2Like): Vec2
  mult(b: Vec3Like): Vec3
  mult<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  times(b: Vec2Like): Vec2
  times(b: Vec3Like): Vec3
  times<Out extends Mat3Like = ThisMat3>(b: Mat3Like, out?: Out): Out
  multiplyScalar<Out extends Mat3Like = ThisMat3>(b: number, out?: Out): Out
  str: () => string
}

export interface Mat3 extends Mat3Impl<Mat3> {
  $str: string
  mat3: typeof Mat3
}

// @aliases
Mat3.fromMat4x4 = Mat3.fromMat4
Mat3.prototype.add = Mat3.prototype.plus
Mat3.prototype.sub = Mat3.prototype.minus
Mat3.prototype.subtract = Mat3.prototype.minus
Mat3.prototype.mul = Mat3.prototype.multiply
Mat3.prototype.mult = Mat3.prototype.multiply
Mat3.prototype.times = Mat3.prototype.multiply
Mat3.prototype.str = Mat3.prototype.toString
Mat3.prototype.multiplyScalar = Mat3.prototype.scaleScalar

/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
export class Mat3d extends Float64Array {
  static get identity() { return new Mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1) }
  static get Identity() { return new Mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1) }
  static get IDENTITY() { return new Mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1) }

  /**
   * Create a new mat3 with the given values
   *
   * @param {Number} m00 Component in column 0, row 0 position (index 0)
   * @param {Number} m01 Component in column 0, row 1 position (index 1)
   * @param {Number} m02 Component in column 0, row 2 position (index 2)
   * @param {Number} m10 Component in column 1, row 0 position (index 3)
   * @param {Number} m11 Component in column 1, row 1 position (index 4)
   * @param {Number} m12 Component in column 1, row 2 position (index 5)
   * @param {Number} m20 Component in column 2, row 0 position (index 6)
   * @param {Number} m21 Component in column 2, row 1 position (index 7)
   * @param {Number} m22 Component in column 2, row 2 position (index 8)
   */
  constructor(m00 = 0, m01 = 0, m02 = 0, m10 = 0, m11 = 0, m12 = 0, m20 = 0, m21 = 0, m22 = 0) {
    super(9)
    this[0] = m00
    this[1] = m01
    this[2] = m02
    this[3] = m10
    this[4] = m11
    this[5] = m12
    this[6] = m20
    this[7] = m21
    this[8] = m22
  }

  static fromTranslation: <Out extends Mat3Like = Mat3d>(v: Vec2Like, out?: Out) => Out
  static fromRotation: <Out extends Mat3Like = Mat3d>(rad: number, out?: Out) => Out
  static fromScaling: <Out extends Mat3Like = Mat3d>(v: Vec2Like, out?: Out) => Out
  static fromMat2x3: <Out extends Mat3Like = Mat3d>(a: Mat2x3Like, out?: Out) => Out
  static fromQuat: <Out extends Mat3Like = Mat3d>(q: QuatLike, out?: Out) => Out
  static normalFromMat4: <Out extends Mat3Like = Mat3d>(a: Mat4Like, out?: Out) => Out | null
  static fromMat4: <Out extends Mat3Like = Mat3d>(a: Mat4Like, out?: Out) => Out
  static fromMat4x4: <Out extends Mat3Like = Mat3d>(a: Mat4Like, out?: Out) => Out
  static projection: <Out extends Mat3Like = Mat3d>(width: number, height: number, out?: Out) => Out
}
export interface Mat3d extends Mat3Impl<Mat3d> {
  $str: string
  mat3: typeof Mat3d
}
