import glmaths from '.'
import { equals } from './internalUtils'
import { Vec2 } from './vec2'

/** 2x2 Matrix in column-major order
 * @extends Float32Array
 */
export class Mat2 extends Float32Array {

  static get identity() { return mat2(1, 0, 0, 1) }
  static get Identity() { return mat2(1, 0, 0, 1) }
  static get IDENTITY() { return mat2(1, 0, 0, 1) }

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
    return mat2(this[0], this[1], this[2], this[3])
  }

  /**
   * Transposes a mat2
   *
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  transpose(out = glmaths.ALWAYS_COPY ? mat2() : this) {
    if (out === this) {
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
  invert(out = glmaths.ALWAYS_COPY ? mat2() : this) {
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
  adjoint(out = glmaths.ALWAYS_COPY ? mat2() : this) {
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
  rotate(rad: number, out = glmaths.ALWAYS_COPY ? mat2() : this) {
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
  scale(v: Vec2, out = glmaths.ALWAYS_COPY ? mat2() : this) {
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
  static fromRotation(rad: number, out = mat2()) {
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
  static fromScaling(v: Vec2, out = mat2()) {
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
    return `mat2x2(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`
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
  LDU(L = mat2(), D = mat2(), U = mat2()) {
    L[2] = this[2] / this[0]
    U[0] = this[0]
    U[1] = this[1]
    U[3] = this[3] - L[2] * U[1]
    return [L, D, U]
  }

  /**
   * Adds two Mat2's
   *
   * @param {Mat2} b the second operand
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  plus(b: Mat2, out = glmaths.ALWAYS_COPY ? mat2() : this) {
    out[0] = this[0] + b[0]
    out[1] = this[1] + b[1]
    out[2] = this[2] + b[2]
    out[3] = this[3] + b[3]
    return out
  }

  /**
   * Subtracts matrix b from a mat2
   *
   * @param {Mat2} b the second operand
   * @param {Mat2} out the receiving matrix, defaults to new mat2()
   * @returns {Mat2} out
   */
  minus(b: Mat2, out = glmaths.ALWAYS_COPY ? mat2() : this) {
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
  multiply(b: Vec2): Vec2
  multiply(b: Mat2, out?: Mat2): Mat2
  multiply(b: Mat2 | Vec2, out = glmaths.ALWAYS_COPY ? mat2() : this) {
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
   * @param {Mat2} b the matrix to compare against
   * @returns {Boolean} true if the matrices are exactly equal
   */
  exactEquals(b: Mat2) {
    return this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3]
  }
  /**
   * Returns whether a mat2 and another Mat2 have approximately equal components
   *
   * @param {Mat2} b the matrix to compare against
   * @returns {Boolean} true if the matrices are approximately equal
   */
  equals(b: Mat2) {
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
  scaleScalar(b: number, out = glmaths.ALWAYS_COPY ? mat2() : this) {
    out[0] = this[0] * b
    out[1] = this[1] * b
    out[2] = this[2] * b
    out[3] = this[3] * b
    return out;
  }

}
export interface Mat2 {
  add: (b: Mat2, out?: Mat2) => Mat2
  sub: (b: Mat2, out?: Mat2) => Mat2
  subtract: (b: Mat2, out?: Mat2) => Mat2
  mul(b: Vec2): Vec2
  mul(b: Mat2, out?: Mat2): Mat2
  mult(b: Vec2): Vec2
  mult(b: Mat2, out?: Mat2): Mat2
  times(b: Vec2): Vec2
  times(b: Mat2, out?: Mat2): Mat2
  multiplyScalar: (b: number, out?: Mat2) => Mat2
  str: () => string
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

const createMat2 = (...args: (number | Float32Array)[]): Mat2 => {
  const out = new Mat2()
  let i = 0
  for (const a of args) {
    if (typeof a === 'number') out[i++] = a
    else for (const v of a) out[i++] = v
  }
  return out
}
Object.setPrototypeOf(createMat2, Mat2)
export const mat2 = createMat2 as typeof createMat2 & typeof Mat2
export const mat2x2 = mat2