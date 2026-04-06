import glmaths from '.'
import { create, equals } from './internalUtils'
import { Vec2, Vec2Like } from './vec2'

export type Mat2Like = Mat2 | Mat2d

/**
 * 2x2 Matrix in column-major order
 * @extends Float32Array
 */
export class Mat2 extends Float32Array {

  static get identity() { return new this.prototype.mat2(1, 0, 0, 1) }
  static get Identity() { return new this.prototype.mat2(1, 0, 0, 1) }
  static get IDENTITY() { return new this.prototype.mat2(1, 0, 0, 1) }

  /**
   * Creates a new Mat2
   *
   * @param {Number} m00 component in column 0, row 0
   * @param {Number} m01 component in column 0, row 1
   * @param {Number} m10 component in column 1, row 0
   * @param {Number} m11 component in column 1, row 1
   */
  constructor(m00 = 0, m01 = 0, m10 = 0, m11 = 0) {
    super(4)
    this[0] = m00
    this[1] = m01
    this[2] = m10
    this[3] = m11
  }

  /**
   * Creates a new Mat2 initialized with values from a matrix
   *
   * @returns {Mat2} a new Mat2
   */
  clone() {
    return new this.mat2(this[0], this[1], this[2], this[3])
  }

  /**
   * Transposes a mat2
   *
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  transpose<Out extends Mat2Like = Mat2>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    if (out === (this as any)) {
      const tmp = out[1]
      out[1] = out[2]
      out[2] = tmp
    } else {
      out[0] = this[0]
      out[1] = this[2]
      out[2] = this[1]
      out[3] = this[3]
    }
    return out
  }

  /**
   * Inverts a mat2
   *
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out or null if the matrix is not invertible
   */
  invert<Out extends Mat2Like = Mat2>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3]

    // Calculate the determinant
    let det = a0 * a3 - a2 * a1
    if (!det) return null;
    det = 1.0 / det

    out[0] =  a3 * det
    out[1] = -a1 * det
    out[2] = -a2 * det
    out[3] =  a0 * det
    return out
  }

  /**
   * Calculates the adjugate of a mat2
   *
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  adjoint<Out extends Mat2Like = Mat2>(out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    let a0 =  this[0]
    out[0] =  this[3]
    out[1] = -this[1]
    out[2] = -this[2]
    out[3] =  a0
    return out
  }

  /**
   * Calculates the determinant of a mat2
   *
   * @returns {Number} determinant of a mat2
   */
  determinant() {
    return this[0] * this[3] - this[2] * this[1]
  }

  /**
   * Rotates a mat2 by the given angle
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  rotate<Out extends Mat2Like = Mat2>(rad: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3]
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = a0 * c + a2 * s
    out[1] = a1 * c + a3 * s
    out[2] = a0 * -s + a2 * c
    out[3] = a1 * -s + a3 * c
    return out
  }

  /**
   * Scales a mat2 by the dimensions in the given Vec2
   *
   * @param {Vec2} v the Vec2 to scale the matrix by
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  scale<Out extends Mat2Like = Mat2>(v: Vec2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    const v0 = v[0], v1 = v[1]
    out[0] = this[0] * v0
    out[1] = this[1] * v0
    out[2] = this[2] * v1
    out[3] = this[3] * v1
    return out
  }

  /**
   * Creates a Mat2 from a given angle
   *
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Mat2} out the receiving matrix, defaults to mat2()
   * @returns {Mat2} out
   */
  static fromRotation<Out extends Mat2Like = Mat2>(rad: number, out: Out = new this.prototype.mat2() as Out) {
    const s = Math.sin(rad), c = Math.cos(rad)
    out[0] = c
    out[1] = s
    out[2] = -s
    out[3] = c
    return out
  }

  /**
   * Creates a Mat2 from a scaling vector
   *
   * @param {Vec2} v scaling vector
   * @param {Mat2} out the receiving matrix, defaults to mat2()
   * @returns {Mat2} out
   */
  static fromScaling<Out extends Mat2Like = Mat2>(v: Vec2Like, out: Out = new this.prototype.mat2() as Out) {
    out[0] = v[0]
    out[1] = out[2] = 0
    out[3] = v[1]
    return out
  }

  /**
   * Returns a string representation of a mat2
   *
   * @returns {String} string representation of the matrix
   */
  toString() {
    return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`
  }

  /**
   * Returns Frobenius norm of a mat2
   * @returns {Number} Frobenius norm
   */
  frob() {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3]
    return Math.sqrt(a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3)
  }

  /**
   * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing a matrix
   * @param {Mat2} L the lower triangular matrix
   * @param {Mat2} D the diagonal matrix
   * @param {Mat2} U the upper triangular matrix
   */
  LDU<OutL extends Mat2Like = Mat2, OutD extends Mat2Like = Mat2, OutU extends Mat2Like = Mat2>(
    L: OutL = new this.mat2() as OutL,
    D: OutD = new this.mat2() as OutD,
    U: OutU = new this.mat2() as OutU
  ): [OutL, OutD, OutU] {
    L[2] = this[2] / this[0]
    U[0] = this[0]
    U[1] = this[1]
    U[3] = this[3] - L[2] * U[1]
    return [L, D, U]
  }

  /**
   * Adds two Mat2's
   *
   * @param {Mat2Like} b the second operand
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  plus<Out extends Mat2Like = Mat2>(b: Mat2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    out[0] = this[0] + b[0]
    out[1] = this[1] + b[1]
    out[2] = this[2] + b[2]
    out[3] = this[3] + b[3]
    return out
  }

  /**
   * Subtracts matrix b from a mat2
   *
   * @param {Mat2Like} b the second operand
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  minus<Out extends Mat2Like = Mat2>(b: Mat2Like, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    out[0] = this[0] - b[0]
    out[1] = this[1] - b[1]
    out[2] = this[2] - b[2]
    out[3] = this[3] - b[3]
    return out
  }

  /**
   * Multiplies a mat2 by another Mat2
   *
   * @param {Mat2} b the second operand
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  multiply(b: Vec2Like): Vec2Like
  multiply<Out extends Mat2Like = Mat2>(b: Mat2Like, out?: Out): Out
  multiply(b: Mat2Like | Vec2Like, out: any = glmaths.ALWAYS_COPY ? new this.mat2() : this) {
    if (b instanceof Vec2)
      return b.transformMat2(this)

    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3]
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
    out[0] = a0 * b0 + a2 * b1
    out[1] = a1 * b0 + a3 * b1
    out[2] = a0 * b2 + a2 * b3
    out[3] = a1 * b2 + a3 * b3
    return out
  }

  /**
   * Returns whether a mat2 and another Mat2 have exactly equal components
   *
   * @param {Mat2Like} b the matrix to compare against
   * @returns {Boolean} true if the matrices are exactly equal
   */
  exactEquals(b: Mat2Like) {
    return this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3]
  }
  /**
   * Returns whether a mat2 and another Mat2 have approximately equal components
   *
   * @param {Mat2Like} b the matrix to compare against
   * @returns {Boolean} true if the matrices are approximately equal
   */
  equals(b: Mat2Like) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) &&
      equals(this[2], b[2]) && equals(this[3], b[3])
    );
  }

  /**
   * Multiplies each element of a mat2 by a scalar value
   *
   * @param {Number} b amount to scale the matrix's elements by
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  scaleScalar<Out extends Mat2Like = Mat2>(b: number, out: Out = (glmaths.ALWAYS_COPY ? new this.mat2() : this) as Out) {
    out[0] = this[0] * b
    out[1] = this[1] * b
    out[2] = this[2] * b
    out[3] = this[3] * b
    return out;
  }
}

interface Mat2Impl<ThisMat2 extends Mat2Like> {
  clone(): ThisMat2
  transpose<Out extends Mat2Like = ThisMat2>(out?: Out): Out
  invert<Out extends Mat2Like = ThisMat2>(out?: Out): Out | null
  adjoint<Out extends Mat2Like = ThisMat2>(out?: Out): Out
  determinant(): number
  rotate<Out extends Mat2Like = ThisMat2>(rad: number, out?: Out): Out
  scale<Out extends Mat2Like = ThisMat2>(v: Vec2Like, out?: Out): Out
  toString(): string
  frob(): number
  LDU<OutL extends Mat2Like = ThisMat2, OutD extends Mat2Like = ThisMat2, OutU extends Mat2Like = ThisMat2>(L?: OutL, D?: OutD, U?: OutU): [OutL, OutD, OutU]
  plus<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  minus<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  multiply(b: Vec2Like): Vec2Like
  multiply<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  exactEquals(b: Mat2Like): boolean
  equals(b: Mat2Like): boolean
  scaleScalar<Out extends Mat2Like = ThisMat2>(b: number, out?: Out): Out

  // aliases
  add<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  sub<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  subtract<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  mul(b: Vec2Like): Vec2Like
  mul<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  mult(b: Vec2Like): Vec2Like
  mult<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  times(b: Vec2Like): Vec2Like
  times<Out extends Mat2Like = ThisMat2>(b: Mat2Like, out?: Out): Out
  multiplyScalar<Out extends Mat2Like = ThisMat2>(b: number, out?: Out): Out
  str: () => string
}

export interface Mat2 extends Mat2Impl<Mat2> {
  $str: string
  mat2: typeof Mat2
}


// @aliases
Mat2.prototype.add = Mat2.prototype.plus
Mat2.prototype.sub = Mat2.prototype.minus
Mat2.prototype.subtract = Mat2.prototype.minus
Mat2.prototype.mul = Mat2.prototype.multiply
Mat2.prototype.mult = Mat2.prototype.multiply
Mat2.prototype.times = Mat2.prototype.multiply
Mat2.prototype.multiplyScalar = Mat2.prototype.scaleScalar
Mat2.prototype.str = Mat2.prototype.toString

/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
export class Mat2d extends Float64Array {

  static get identity() { return new Mat2d(1, 0, 0, 1) }
  static get Identity() { return new Mat2d(1, 0, 0, 1) }
  static get IDENTITY() { return new Mat2d(1, 0, 0, 1) }

  /**
   * Creates a new Mat2
   *
   * @param {Number} m00 component in column 0, row 0
   * @param {Number} m01 component in column 0, row 1
   * @param {Number} m10 component in column 1, row 0
   * @param {Number} m11 component in column 1, row 1
   */
  constructor(m00 = 0, m01 = 0, m10 = 0, m11 = 0) {
    super(4)
    this[0] = m00
    this[1] = m01
    this[2] = m10
    this[3] = m11
  }

  static fromRotation: <Out extends Mat2Like = Mat2d>(rad: number, out?: Out) => Out
  static fromScaling: <Out extends Mat2Like = Mat2d>(v: Vec2Like, out?: Out) => Out
}
export interface Mat2d extends Mat2Impl<Mat2d> {
  $str: string
  mat2: typeof Mat2d
}
