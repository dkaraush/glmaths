import glmaths from '.'
import { equals } from './internalUtils'
import { Vec3 } from './vec3'
import { Quat } from './quat'
import { Mat4 } from './mat4'

/**
 * Dual Quaternion for rigid body transformations (rotation + translation)
 * Stored as [real.x, real.y, real.z, real.w, dual.x, dual.y, dual.z, dual.w]
 * @extends Float32Array
 */
export class Quat2 extends Float32Array {

  static get identity() { return quat2(0, 0, 0, 1, 0, 0, 0, 0) }
  static get Identity() { return quat2(0, 0, 0, 1, 0, 0, 0, 0) }
  static get IDENTITY() { return quat2(0, 0, 0, 1, 0, 0, 0, 0) }

  /**
   * Creates a new dual quaternion
   *
   * @param {Number} x1 real X component, defaults to 0
   * @param {Number} y1 real Y component, defaults to 0
   * @param {Number} z1 real Z component, defaults to 0
   * @param {Number} w1 real W component, defaults to 1
   * @param {Number} x2 dual X component, defaults to 0
   * @param {Number} y2 dual Y component, defaults to 0
   * @param {Number} z2 dual Z component, defaults to 0
   * @param {Number} w2 dual W component, defaults to 0
   */
  constructor(x1 = 0, y1 = 0, z1 = 0, w1 = 1, x2 = 0, y2 = 0, z2 = 0, w2 = 0) {
    super(8)
    this[0] = x1; this[1] = y1; this[2] = z1; this[3] = w1
    this[4] = x2; this[5] = y2; this[6] = z2; this[7] = w2
  }

  /**
   * Get the real part as a Quat
   *
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  getReal(out = new Quat()): Quat {
    out[0] = this[0]; out[1] = this[1]; out[2] = this[2]; out[3] = this[3]
    return out
  }

  /**
   * Get the dual part as a Quat
   *
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  getDual(out = new Quat()): Quat {
    out[0] = this[4]; out[1] = this[5]; out[2] = this[6]; out[3] = this[7]
    return out
  }

  /**
   * Set the real part from a quaternion
   *
   * @param {Quat} q the source quaternion
   * @returns {Quat2} this
   */
  setReal(q: Quat) {
    this[0] = q[0]; this[1] = q[1]; this[2] = q[2]; this[3] = q[3]
    return this
  }

  /**
   * Set the dual part from a quaternion
   *
   * @param {Quat} q the source quaternion
   * @returns {Quat2} this
   */
  setDual(q: Quat) {
    this[4] = q[0]; this[5] = q[1]; this[6] = q[2]; this[7] = q[3]
    return this
  }

  /**
   * Get the translation component
   *
   * @param {Vec3} out the receiving vector, defaults to vec3()
   * @returns {Vec3} out
   */
  getTranslation(out = new Vec3()): Vec3 {
    const ax = this[4], ay = this[5], az = this[6], aw = this[7]
    const bx = -this[0], by = -this[1], bz = -this[2], bw = this[3]
    out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2
    out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2
    out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2
    return out
  }

  /**
   * Create from rotation quaternion and translation vector
   *
   * @param {Quat} q the rotation quaternion
   * @param {Vec3} t the translation vector
   * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
   * @returns {Quat2} out
   */
  static fromRotationTranslation(q: Quat, t: Vec3, out = quat2()): Quat2 {
    const ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5
    const bx = q[0], by = q[1], bz = q[2], bw = q[3]
    out[0] = bx; out[1] = by; out[2] = bz; out[3] = bw
    out[4] = ax * bw + ay * bz - az * by
    out[5] = ay * bw + az * bx - ax * bz
    out[6] = az * bw + ax * by - ay * bx
    out[7] = -ax * bx - ay * by - az * bz
    return out
  }

  /**
   * Create from translation only
   *
   * @param {Vec3} t the translation vector
   * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
   * @returns {Quat2} out
   */
  static fromTranslation(t: Vec3, out = quat2()): Quat2 {
    out[0] = 0; out[1] = 0; out[2] = 0; out[3] = 1
    out[4] = t[0] * 0.5; out[5] = t[1] * 0.5; out[6] = t[2] * 0.5; out[7] = 0
    return out
  }

  /**
   * Create from rotation only
   *
   * @param {Quat} q the rotation quaternion
   * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
   * @returns {Quat2} out
   */
  static fromRotation(q: Quat, out = quat2()): Quat2 {
    out[0] = q[0]; out[1] = q[1]; out[2] = q[2]; out[3] = q[3]
    out[4] = 0; out[5] = 0; out[6] = 0; out[7] = 0
    return out
  }

  /**
   * Create from a 4x4 matrix
   *
   * @param {Mat4} m the source matrix
   * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
   * @returns {Quat2} out
   */
  static fromMat4(m: Mat4, out = quat2()): Quat2 {
    const r = m.getRotation()
    const t = m.getTranslation()
    return Quat2.fromRotationTranslation(r, t, out)
  }

  /**
   * Creates a copy of this dual quaternion
   *
   * @returns {Quat2} a new dual quaternion
   */
  clone() {
    return quat2(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7])
  }

  /**
   * Multiply two dual quaternions
   *
   * @param {Quat2} b the second operand
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  // @ts-ignore
  multiply = (b: Quat2, out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 => {
    const ax0 = this[0], ay0 = this[1], az0 = this[2], aw0 = this[3]
    const bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7]
    const ax1 = this[4], ay1 = this[5], az1 = this[6], aw1 = this[7]
    const bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3]

    out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0
    out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0
    out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0
    out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0

    out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 +
             ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0
    out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 +
             ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0
    out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 +
             az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0
    out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 +
             aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0
    return out
  }

  /**
   * Translate by a Vec3
   *
   * @param {Vec3} v the translation vector
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  translate(v: Vec3, out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 {
    const ax1 = this[0], ay1 = this[1], az1 = this[2], aw1 = this[3]
    const bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5
    const ax2 = this[4], ay2 = this[5], az2 = this[6], aw2 = this[7]
    out[0] = ax1; out[1] = ay1; out[2] = az1; out[3] = aw1
    out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2
    out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2
    out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2
    out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2
    return out
  }

  /**
   * Calculates the conjugate of a dual quaternion
   *
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  conjugate(out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 {
    out[0] = -this[0]; out[1] = -this[1]; out[2] = -this[2]; out[3] = this[3]
    out[4] = -this[4]; out[5] = -this[5]; out[6] = -this[6]; out[7] = this[7]
    return out
  }

  /**
   * Calculates the inverse of a dual quaternion
   *
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  invert(out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 {
    const sqlen = this.squaredLength()
    out[0] = -this[0] / sqlen; out[1] = -this[1] / sqlen
    out[2] = -this[2] / sqlen; out[3] = this[3] / sqlen
    out[4] = -this[4] / sqlen; out[5] = -this[5] / sqlen
    out[6] = -this[6] / sqlen; out[7] = this[7] / sqlen
    return out
  }

  /**
   * Squared length of the real part
   *
   * @returns {Number} squared length
   */
  squaredLength() {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    return x * x + y * y + z * z + w * w
  }

  /**
   * Length of the real part
   *
   * @returns {Number} length
   */
  len() {
    return Math.sqrt(this.squaredLength())
  }

  /**
   * Normalize the dual quaternion
   *
   * @param {Quat2} q the quaternion to normalize
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  static normalize(q: Quat2, out = quat2()) {
    let magnitude = q.squaredLength()
    if (magnitude > 0) {
      magnitude = Math.sqrt(magnitude)
      const a0 = q[0] / magnitude, a1 = q[1] / magnitude
      const a2 = q[2] / magnitude, a3 = q[3] / magnitude
      const b0 = q[4], b1 = q[5], b2 = q[6], b3 = q[7]
      const a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3
      out[0] = a0; out[1] = a1; out[2] = a2; out[3] = a3
      out[4] = (b0 - a0 * a_dot_b) / magnitude
      out[5] = (b1 - a1 * a_dot_b) / magnitude
      out[6] = (b2 - a2 * a_dot_b) / magnitude
      out[7] = (b3 - a3 * a_dot_b) / magnitude
    }
    return out
  }

  /**
   * Normalize the dual quaternion
   *
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  normalize(out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 {
    return Quat2.normalize(this, out)
  }

  /**
   * Dot product of the real parts of two dual quaternions
   *
   * @param {Quat2} a the first operand
   * @param {Quat2} b the second operand
   * @returns {Number} dot product
   */
  static dot(a: Quat2, b: Quat2) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
  }

  /**
   * Performs a linear interpolation between two dual quaternions
   *
   * @param {Quat2} a the first operand
   * @param {Quat2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1]
   * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
   * @returns {Quat2} out
   */
  static lerp(a: Quat2, b: Quat2, t: number, out = quat2()): Quat2 {
    const mt = 1 - t
    if (Quat2.dot(a, b) < 0) t = -t
    out[0] = a[0] * mt + b[0] * t
    out[1] = a[1] * mt + b[1] * t
    out[2] = a[2] * mt + b[2] * t
    out[3] = a[3] * mt + b[3] * t
    out[4] = a[4] * mt + b[4] * t
    out[5] = a[5] * mt + b[5] * t
    out[6] = a[6] * mt + b[6] * t
    out[7] = a[7] * mt + b[7] * t
    return out
  }

  /**
   * Adds two dual quaternions
   *
   * @param {Quat2} b the second operand
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  plus(b: Quat2, out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 {
    out[0] = this[0] + b[0]; out[1] = this[1] + b[1]
    out[2] = this[2] + b[2]; out[3] = this[3] + b[3]
    out[4] = this[4] + b[4]; out[5] = this[5] + b[5]
    out[6] = this[6] + b[6]; out[7] = this[7] + b[7]
    return out
  }

  /**
   * Scales a dual quaternion by a scalar
   *
   * @param {Number} s the scalar to scale by
   * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
   * @returns {Quat2} out
   */
  scale(s: number, out = glmaths.ALWAYS_COPY ? quat2() : this): Quat2 {
    out[0] = this[0] * s; out[1] = this[1] * s
    out[2] = this[2] * s; out[3] = this[3] * s
    out[4] = this[4] * s; out[5] = this[5] * s
    out[6] = this[6] * s; out[7] = this[7] * s
    return out
  }

  /**
   * Returns whether two dual quaternions are approximately equal
   *
   * @param {Quat2} b the second operand
   * @returns {Boolean} true if the dual quaternions are approximately equal
   */
  equals(b: Quat2) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) &&
      equals(this[2], b[2]) && equals(this[3], b[3]) &&
      equals(this[4], b[4]) && equals(this[5], b[5]) &&
      equals(this[6], b[6]) && equals(this[7], b[7])
    )
  }

  /**
   * Returns whether two dual quaternions are exactly equal
   *
   * @param {Quat2} b the second operand
   * @returns {Boolean} true if the dual quaternions are exactly equal
   */
  exactEquals(b: Quat2) {
    return (
      this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3] &&
      this[4] === b[4] && this[5] === b[5] && this[6] === b[6] && this[7] === b[7]
    )
  }

  /**
   * Returns a string representation of a dual quaternion
   *
   * @returns {String} string representation of the dual quaternion
   */
  toString() {
    const fmt = (v: number, suffix: string) => {
      if (v === 0) return ''
      const abs = Math.abs(v)
      const s = abs === 1 && suffix ? suffix : `${abs}${suffix}`
      return v < 0 ? ` - ${s}` : ` + ${s}`
    }
    const qStr = (w: number, x: number, y: number, z: number) => {
      const parts = [
        w !== 0 ? `${w}` : '',
        fmt(x, 'i'),
        fmt(y, 'j'),
        fmt(z, 'k')
      ].join('').trim().replace(/^\+ /, '') || '0'
      return parts
    }
    const real = qStr(this[3], this[0], this[1], this[2])
    const dual = qStr(this[7], this[4], this[5], this[6])
    return `(${real}) + \u03B5(${dual})`
  }
}
export interface Quat2 {
  sqrLen: () => number
  str: () => string
  add: (b: Quat2, out?: Quat2) => Quat2
  normalized: (out?: Quat2) => Quat2
}

// @aliases
Quat2.prototype.sqrLen = Quat2.prototype.squaredLength
Quat2.prototype.normalized = Quat2.prototype.normalize
Quat2.prototype.str = Quat2.prototype.toString
Quat2.prototype.add = Quat2.prototype.plus

const createQuat2 = 
  (x1 = 0, y1 = 0, z1 = 0, w1 = 1, x2 = 0, y2 = 0, z2 = 0, w2 = 0) =>
    new Quat2(x1, y1, z1, w1, x2, y2, z2, w2)
Object.setPrototypeOf(createQuat2, Quat2)
export const quat2 = createQuat2 as typeof createQuat2 & typeof Quat2