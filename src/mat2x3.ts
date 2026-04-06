import glmaths from '.'
import { create, equals } from './internalUtils'
import { Vec2, Vec2Like } from './vec2'

export type Mat2x3Like = Mat2x3 | Mat2x3d

/**
 * 2x3 Affine transformation matrix for 2D operations,
 * stored as 32-bit floats
 * @extends Float32Array
 */
export class Mat2x3 extends Float32Array {

  static get identity() { return new this.prototype.mat2x3(1, 0, 0, 1, 0, 0) }
  static get Identity() { return new this.prototype.mat2x3(1, 0, 0, 1, 0, 0) }
  static get IDENTITY() { return new this.prototype.mat2x3(1, 0, 0, 1, 0, 0) }

  /**
   * Creates a new Mat2x3
   *
   * @param {Number} a component at index 0
   * @param {Number} b component at index 1
   * @param {Number} c component at index 2
   * @param {Number} d component at index 3
   * @param {Number} tx component at index 4
   * @param {Number} ty component at index 5
   */
  constructor(a = 0, b = 0, c = 0, d = 0, tx = 0, ty = 0) {
    super(6)
    this[0] = a
    this[1] = b
    this[2] = c
    this[3] = d
    this[4] = tx
    this[5] = ty
  }

  /**
   * Inverts a mat2x3
   *
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out or null if the matrix is not invertible
   */
  invert<Out extends Mat2x3Like = Mat2x3>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    const aa = this[0], ab = this[1], ac = this[2], ad = this[3]
    const atx = this[4], aty = this[5]
    let det = aa * ad - ab * ac
    if (!det) return null
    det = 1.0 / det
    out[0] = ad * det
    out[1] = -ab * det
    out[2] = -ac * det
    out[3] = aa * det
    out[4] = (ac * aty - ad * atx) * det
    out[5] = (ab * atx - aa * aty) * det
    return out;
  }

  /**
   * Calculates the determinant of a mat2x3
   *
   * @returns {Number} determinant of a mat2x3
   */
  determinant() {
    return this[0] * this[3] - this[1] * this[2]
  }

  /**
   * Rotates a mat2x3 by the given angle
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  rotate<Out extends Mat2x3Like = Mat2x3>(rad: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5];
    const s = Math.sin(rad)
    const c = Math.cos(rad)
    out[0] = a0 * c + a2 * s
    out[1] = a1 * c + a3 * s
    out[2] = a0 * -s + a2 * c
    out[3] = a1 * -s + a3 * c
    out[4] = a4
    out[5] = a5
    return out
  }

  /**
   * Scales a mat2x3 by the dimensions in the given Vec2
   *
   * @param {Vec2} v the Vec2 to scale the matrix by
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  scale<Out extends Mat2x3Like = Mat2x3>(v: Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5]
    const v0 = v[0], v1 = v[1]
    out[0] = a0 * v0
    out[1] = a1 * v0
    out[2] = a2 * v1
    out[3] = a3 * v1
    out[4] = a4
    out[5] = a5
    return out
  }

  /**
   * Translates a mat2x3 by the dimensions in the given Vec2
   *
   * @param {Vec2} v the Vec2 to translate the matrix by
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  translate<Out extends Mat2x3Like = Mat2x3>(v: Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5]
    const v0 = v[0], v1 = v[1]
    out[0] = a0
    out[1] = a1
    out[2] = a2
    out[3] = a3
    out[4] = a0 * v0 + a2 * v1 + a4
    out[5] = a1 * v0 + a3 * v1 + a5
    return out
  }

  /**
   * Creates a Mat2x3 from a given angle
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat2x3} out the receiving matrix, defaults to mat2x3()
   * @returns {Mat2x3} out
   */
  static fromRotation<Out extends Mat2x3Like = Mat2x3>(rad: number, out: Out = new this.prototype.mat2x3() as Out) {
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = c
    out[1] = s
    out[2] = -s
    out[3] = c
    out[4] = out[5] = 0
    return out
  }

  /**
   * Creates a Mat2x3 from a scaling vector
   *
   * @param {Vec2} v scaling vector
   * @param {Mat2x3} out the receiving matrix, defaults to mat2x3()
   * @returns {Mat2x3} out
   */
  static fromScaling<Out extends Mat2x3Like = Mat2x3>(v: Vec2Like, out: Out = new this.prototype.mat2x3() as Out) {
    out[0] = v[0]
    out[1] = out[2] = 0
    out[3] = v[1]
    out[4] = out[5] = 0
    return out
  }

  /**
   * Creates a Mat2x3 from a translation vector
   *
   * @param {Vec2} v translation vector
   * @param {Mat2x3} out the receiving matrix, defaults to mat2x3()
   * @returns {Mat2x3} out
   */
  static fromTranslation<Out extends Mat2x3Like = Mat2x3>(v: Vec2Like, out: Out = new this.prototype.mat2x3() as Out) {
    out[0] = out[3] = 1
    out[1] = out[2] = 0
    out[4] = v[0]
    out[5] = v[1]
    return out
  }

  /**
   * Returns a string representation of a mat2x3
   *
   * @returns {String} string representation of the matrix
   */
  toString() {
    return `${this.$str}(${this[0]}, ${this[1]},\t${this[2]}, ${this[3]},\t${this[4]}, ${this[5]})`
  }

  /**
   * Returns Frobenius norm of a mat2x3
   *
   * @returns {Number} Frobenius norm
   */
  frob() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3] + this[4] * this[4] + this[5] * this[5] + 1)
  }

  /**
   * Adds two Mat2x3's
   *
   * @param {Mat2x3Like} b the second operand
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  plus<Out extends Mat2x3Like = Mat2x3>(b: Mat2x3Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    out[0] = this[0] + b[0]
    out[1] = this[1] + b[1]
    out[2] = this[2] + b[2]
    out[3] = this[3] + b[3]
    out[4] = this[4] + b[4]
    out[5] = this[5] + b[5]
    return out
  }

  /**
   * Subtracts matrix b from a mat2x3
   *
   * @param {Mat2x3Like} b the second operand
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  minus<Out extends Mat2x3Like = Mat2x3>(b: Mat2x3Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    out[0] = this[0] - b[0]
    out[1] = this[1] - b[1]
    out[2] = this[2] - b[2]
    out[3] = this[3] - b[3]
    out[4] = this[4] - b[4]
    out[5] = this[5] - b[5]
    return out
  }

  /**
   * Multiplies a mat2x3 by another Mat2x3
   *
   * @param {Mat2x3} b the second operand
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  multiply(b: Vec2Like): Vec2Like
  multiply<Out extends Mat2x3Like = Mat2x3>(b: Mat2x3Like, out?: Out): Out
  multiply<Out extends Mat2x3Like = Mat2x3>(b: Mat2x3Like | Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    if (b instanceof Vec2)
      return b.transformMat2x3(this)

    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5]
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5]
    out[0] = a0 * b0 + a2 * b1
    out[1] = a1 * b0 + a3 * b1
    out[2] = a0 * b2 + a2 * b3
    out[3] = a1 * b2 + a3 * b3
    out[4] = a0 * b4 + a2 * b5 + a4
    out[5] = a1 * b4 + a3 * b5 + a5
    return out
  }

  /**
   * Returns whether a mat2x3 and another Mat2x3 have approximately equal components
   *
   * @param {Mat2x3Like} b the matrix to compare against
   * @returns {Boolean} true if the matrices are approximately equal
   */
  equals(b: Mat2x3Like) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) &&
      equals(this[3], b[3]) && equals(this[4], b[4]) && equals(this[5], b[5])
    );
  }
  /**
   * Returns whether a mat2x3 and another Mat2x3 have exactly equal components
   *
   * @param {Mat2x3Like} b the matrix to compare against
   * @returns {Boolean} true if the matrices are exactly equal
   */
  exactEquals(b: Mat2x3Like) {
    return (
      this[0] === b[0] && this[1] === b[1] && this[2] === b[2] &&
      this[3] === b[3] && this[4] === b[4] && this[5] === b[5]
    )
  }

  /**
   * Multiplies each element of a mat2x3 by a scalar value
   *
   * @param {Number} b amount to scale the matrix's elements by
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  scaleScalar<Out extends Mat2x3Like = Mat2x3>(b: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2x3() : this) as Out) {
    out[0] = this[0] * b
    out[1] = this[1] * b
    out[2] = this[2] * b
    out[3] = this[3] * b
    out[4] = this[4] * b
    out[5] = this[5] * b
    return out;
  }

  /**
   * Creates a new Mat2x3 initialized with values from this matrix
   *
   * @returns {Mat2x3} a new Mat2x3
   */
  clone(): Mat2x3 {
    return new this.mat2x3(
      this[0], this[1], this[2],
      this[3], this[4], this[5]
    )
  }
}

interface Mat2x3Impl<ThisMat2x3 extends Mat2x3Like> {
  invert<Out extends Mat2x3Like = ThisMat2x3>(out?: Out): Out | null
  determinant(): number
  rotate<Out extends Mat2x3Like = ThisMat2x3>(rad: number, out?: Out): Out
  scale<Out extends Mat2x3Like = ThisMat2x3>(v: Vec2Like, out?: Out): Out
  translate<Out extends Mat2x3Like = ThisMat2x3>(v: Vec2Like, out?: Out): Out
  toString(): string
  frob(): number
  plus<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  minus<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  multiply(b: Vec2Like): Vec2Like
  multiply<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  equals(b: Mat2x3Like): boolean
  exactEquals(b: Mat2x3Like): boolean
  scaleScalar<Out extends Mat2x3Like = ThisMat2x3>(b: number, out?: Out): Out
  clone(): ThisMat2x3

  add<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  sub<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  subtract<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  mul(b: Vec2Like): Vec2Like
  mul<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  mult(b: Vec2Like): Vec2Like
  mult<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  times(b: Vec2Like): Vec2Like
  times<Out extends Mat2x3Like = ThisMat2x3>(b: Mat2x3Like, out?: Out): Out
  multiplyScalar<Out extends Mat2x3Like = ThisMat2x3>(b: number, out?: Out): Out
  str: () => string
}

export interface Mat2x3 extends Mat2x3Impl<Mat2x3> {
  $str: string
  mat2x3: typeof Mat2x3
}

// @aliases
Mat2x3.prototype.add = Mat2x3.prototype.plus
Mat2x3.prototype.sub = Mat2x3.prototype.minus
Mat2x3.prototype.subtract = Mat2x3.prototype.minus
Mat2x3.prototype.mul = Mat2x3.prototype.multiply
Mat2x3.prototype.mult = Mat2x3.prototype.multiply
Mat2x3.prototype.times = Mat2x3.prototype.multiply
Mat2x3.prototype.str = Mat2x3.prototype.toString
Mat2x3.prototype.multiplyScalar = Mat2x3.prototype.scaleScalar

/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
export class Mat2x3d extends Float64Array {

  static get identity() { return new Mat2x3d(1, 0, 0, 1, 0, 0) }
  static get Identity() { return new Mat2x3d(1, 0, 0, 1, 0, 0) }
  static get IDENTITY() { return new Mat2x3d(1, 0, 0, 1, 0, 0) }

  /**
   * Creates a new Mat2x3
   *
   * @param {Number} a component at index 0
   * @param {Number} b component at index 1
   * @param {Number} c component at index 2
   * @param {Number} d component at index 3
   * @param {Number} tx component at index 4
   * @param {Number} ty component at index 5
   */
  constructor(a = 0, b = 0, c = 0, d = 0, tx = 0, ty = 0) {
    super(6)
    this[0] = a
    this[1] = b
    this[2] = c
    this[3] = d
    this[4] = tx
    this[5] = ty
  }

  static fromRotation: <Out extends Mat2x3Like = Mat2x3d>(rad: number, out?: Out) => Out
  static fromScaling: <Out extends Mat2x3Like = Mat2x3d>(v: Vec2Like, out?: Out) => Out
  static fromTranslation: <Out extends Mat2x3Like = Mat2x3d>(v: Vec2Like, out?: Out) => Out
}
export interface Mat2x3d extends Mat2x3Impl<Mat2x3d> {
  $str: string
  mat2x3: typeof Mat2x3d
}
