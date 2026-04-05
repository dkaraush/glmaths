import glmaths from '.'
import { equals } from './internalUtils'
import { Vec2 } from './vec2'

/** 2x3 Affine transformation matrix for 2D operations
 * @extends Float32Array
 */
export class Mat2x3 extends Float32Array {

  static get identity() { return mat2x3(1, 0, 0, 1, 0, 0) }
  static get Identity() { return mat2x3(1, 0, 0, 1, 0, 0) }
  static get IDENTITY() { return mat2x3(1, 0, 0, 1, 0, 0) }

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
  invert(out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
  rotate(rad: number, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
  scale(v: Vec2, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
  translate(v: Vec2, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
  static fromRotation(rad: number, out = mat2x3()) {
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
  static fromScaling(v: Vec2, out = mat2x3()) {
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
  static fromTranslation(v: Vec2, out = mat2x3()) {
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
    return `mat2x3(${this[0]}, ${this[1]},\t${this[2]}, ${this[3]},\t${this[4]}, ${this[5]})`
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
   * @param {Mat2x3} b the second operand
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  plus(b: Mat2x3, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
   * @param {Mat2x3} b the second operand
   * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
   * @returns {Mat2x3} out
   */
  minus(b: Mat2x3, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
  multiply(b: Vec2): Vec2
  multiply(b: Mat2x3, out?: Mat2x3): Mat2x3
  multiply(b: Mat2x3 | Vec2, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
   * @param {Mat2x3} b the matrix to compare against
   * @returns {Boolean} true if the matrices are approximately equal
   */
  equals(b: Mat2x3) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) &&
      equals(this[3], b[3]) && equals(this[4], b[4]) && equals(this[5], b[5])
    );
  }
  /**
   * Returns whether a mat2x3 and another Mat2x3 have exactly equal components
   *
   * @param {Mat2x3} b the matrix to compare against
   * @returns {Boolean} true if the matrices are exactly equal
   */
  exactEquals(b: Mat2x3) {
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
  scaleScalar(b: number, out = glmaths.ALWAYS_COPY ? mat2x3() : this) {
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
    return mat2x3(
      this[0], this[1], this[2],
      this[3], this[4], this[5]
    )
  }
}
export interface Mat2x3 {
  add: (b: Mat2x3, out?: Mat2x3) => Mat2x3
  sub: (b: Mat2x3, out?: Mat2x3) => Mat2x3
  subtract: (b: Mat2x3, out?: Mat2x3) => Mat2x3
  mul(b: Vec2): Vec2
  mul(b: Mat2x3, out?: Mat2x3): Mat2x3
  mult(b: Vec2): Vec2
  mult(b: Mat2x3, out?: Mat2x3): Mat2x3
  times(b: Vec2): Vec2
  times(b: Mat2x3, out?: Mat2x3): Mat2x3
  multiplyScalar: (b: number, out?: Mat2x3) => Mat2x3
  str: () => string
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

const createMat2x3 = (...args: (number | Float32Array)[]): Mat2x3 => {
  const out = new Mat2x3()
  let i = 0
  for (const a of args) {
    if (typeof a === 'number') out[i++] = a
    else for (const v of a) out[i++] = v
  }
  return out
}
Object.setPrototypeOf(createMat2x3, Mat2x3)
export const mat2x3 = createMat2x3 as typeof createMat2x3 & typeof Mat2x3
export const mat2d = mat2x3