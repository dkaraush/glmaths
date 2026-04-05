import glmaths from '.'
import { equals, defineSwizzles } from './internalUtils'
import { Vec2 } from './vec2'
import { Vec4 } from './vec4'
import { Mat3 } from './mat3'
import { Mat4 } from './mat4'
import { Quat } from './quat'

/**
 * 3 Dimensional Vector
 * @extends Float32Array
 */
export class Vec3 extends Float32Array {

  static get zero() { return vec3(0, 0, 0) }
  static get Zero() { return vec3(0, 0, 0) }
  static get ZERO() { return vec3(0, 0, 0) }
  static get one()  { return vec3(1, 1, 1) }
  static get One()  { return vec3(1, 1, 1) }
  static get ONE()  { return vec3(1, 1, 1) }

  static get unitX() { return vec3(1, 0, 0) }
  static get UnitX() { return vec3(1, 0, 0) }
  static get unitY() { return vec3(0, 1, 0) }
  static get UnitY() { return vec3(0, 1, 0) }
  static get unitZ() { return vec3(0, 0, 1) }
  static get UnitZ() { return vec3(0, 0, 1) }

  /**
   * Creates new vec3
   *
   * @param {Number} x X component, defaults to 0
   * @param {Number} y Y component, defaults to 0
   * @param {Number} z Z component, defaults to 0
   */
  constructor(x = 0, y = 0, z = 0) {
    super(3)
    this[0] = x
    this[1] = y
    this[2] = z
  }

  get x() { return this[0] }
  set x(v) { this[0] = v }

  get y() { return this[1] }
  set y(v) { this[1] = v }

  get z() { return this[2] }
  set z(v) { this[2] = v }

  /**
   * Adds two vec3's
   *
   * @param {Number | Vec3} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  plus(b: number | Vec3, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof b === 'number') {
      out[0] = this[0] + b
      out[1] = this[1] + b
      out[2] = this[2] + b
    } else {
      out[0] = this[0] + b[0]
      out[1] = this[1] + b[1]
      out[2] = this[2] + b[2]
    }
    return out
  }

  /**
   * Subtracts two vec3's
   *
   * @param {Number | Vec3} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  minus(b: number | Vec3, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof b === 'number') {
      out[0] = this[0] - b
      out[1] = this[1] - b
      out[2] = this[2] - b
    } else {
      out[0] = this[0] - b[0]
      out[1] = this[1] - b[1]
      out[2] = this[2] - b[2]
    }
    return out
  }

  /**
   * Multiplies two vec3's
   *
   * @param {Number | Vec3} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  mult(b: number | Vec3, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof b === 'number') {
      out[0] = this[0] * b
      out[1] = this[1] * b
      out[2] = this[2] * b
    } else {
      out[0] = this[0] * b[0]
      out[1] = this[1] * b[1]
      out[2] = this[2] * b[2]
    }
    return out
  }

  /**
   * Divides two vec3's
   *
   * @param {Number | Vec3} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  div(b: number | Vec3, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof b === 'number') {
      out[0] = this[0] / b
      out[1] = this[1] / b
      out[2] = this[2] / b
    } else {
      out[0] = this[0] / b[0]
      out[1] = this[1] / b[1]
      out[2] = this[2] / b[2]
    }
    return out
  }
  invDiv(b: number | Vec3, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof b === 'number') {
      out[0] = b / this[0]
      out[1] = b / this[1]
      out[2] = b / this[2]
    } else {
      out[0] = b[0] / this[0]
      out[1] = b[1] / this[1]
      out[2] = b[2] / this[2]
    }
    return out
  }

  /**
   * Negates the components of this vec3
   *
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  negate(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = -this[0]
    out[1] = -this[1]
    out[2] = -this[2]
    return out
  }
  unaryPlus(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (out != this) {
      out[0] = this[0]
      out[1] = this[1]
      out[2] = this[2]
    }
    return out
  }

  /**
   * Normalizes vec3
   *
   * @param {Vec3} v the vector to normalize
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static normalize(v: Vec3, out = vec3()): Vec3 {
    const x = v[0], y = v[1], z = v[2]
    let len = x * x + y * y + z * z
    if (len > 0) len = 1.0 / Math.sqrt(len)
    out[0] = x * len
    out[1] = y * len
    out[2] = z * len
    return out
  }

  /**
   * Normalizes this vec3
   *
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  normalize(out = glmaths.ALWAYS_COPY ? vec3() : this): Vec3 {
    const x = this[0], y = this[1], z = this[2]
    let len = x * x + y * y + z * z
    if (len > 0) len = 1.0 / Math.sqrt(len)
    out[0] = x * len
    out[1] = y * len
    out[2] = z * len
    return out
  }

  /**
   * Returns whether or not the vectors have approximately equal components
   *
   * @param {Vec3} b the second operand
   * @returns {Boolean} true if the vectors are approximately equal
   */
  equals(b: Vec3) {
    return (
      equals(this[0], b[0]) &&
      equals(this[1], b[1]) && 
      equals(this[2], b[2])
    )
  }

  /**
   * Returns whether or not the vectors have exactly equal components
   *
   * @param {Vec3} b the second operand
   * @returns {Boolean} true if the vectors are exactly equal
   */
  exactEquals(b: Vec3) {
    return this[0] === b[0] && this[1] === b[1] && this[2] === b[2]
  }

  /**
   * Calculates the squared length of vec3
   *
   * @returns {Number} squared length of a vector
   */
  squaredLength() {
    const x = this[0], y = this[1], z = this[2]
    return x * x + y * y + z * z
  }

  /**
   * Calculates the length of vec3
   *
   * @returns {Number} length of a vector
   */
  len() {
    const x = this[0], y = this[1], z = this[2]
    return Math.sqrt(x * x + y * y + z * z)
  }

  /**
   * Returns vec3 with each component floored
   *
   * @param {Vec3} v the vector to floor
   * @returns {Vec3} a new floored vector
   */
  static floor(v: Vec3, out = vec3()) {
    out[0] = Math.floor(v[0])
    out[1] = Math.floor(v[1])
    out[2] = Math.floor(v[2])
    return out
  }
  /**
   * Returns vec3 with each component rounded
   *
   * @param {Vec3} v the vector to round
   * @returns {Vec3} a new rounded vector
   */
  static round(v: Vec3, out = vec3()) {
    out[0] = Math.round(v[0])
    out[1] = Math.round(v[1])
    out[2] = Math.round(v[2])
    return out
  }
  /**
   * Returns vec3 with each component ceiled
   *
   * @param {Vec3} v the vector to ceil
   * @returns {Vec3} a new ceiled vector
   */
  static ceil (v: Vec3, out = vec3()) {
    out[0] = Math.ceil(v[0])
    out[1] = Math.ceil(v[1])
    out[2] = Math.ceil(v[2])
    return out
  }
  /**
   * Floors each component of vec3
   *
   * @returns {Vec3} this
   */
  floor(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = Math.floor(this[0])
    out[1] = Math.floor(this[1])
    out[2] = Math.floor(this[2])
    return out
  }
  /**
   * Rounds each component of vec3
   *
   * @returns {Vec3} this
   */
  round(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = Math.round(this[0])
    out[1] = Math.round(this[1])
    out[2] = Math.round(this[2])
    return out
  }
  /**
   * Ceils each component of vec3
   *
   * @returns {Vec3} this
   */
  ceil(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = Math.ceil(this[0])
    out[1] = Math.ceil(this[1])
    out[2] = Math.ceil(this[2])
    return out
  }

  /**
   * Returns the inverse of vec3
   *
   * @param {Vec3} v the source vector
   * @returns {Vec3} a new inverted vector
   */
  static inverse(v: Vec3, out = vec3()) {
    out[0] = 1.0 / v[0]
    out[1] = 1.0 / v[1]
    out[2] = 1.0 / v[2]
    return out
  }
  /**
   * Inverts vec3 component-wise
   *
   * @returns {Vec3} this
   */
  inverse(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = 1.0 / this[0]
    out[1] = 1.0 / this[1]
    out[2] = 1.0 / this[2]
    return out
  }

  /**
   * Creates vec3 initialized with values from a vector
   *
   * @returns {Vec3} vec3
   */
  clone() {
    return vec3(this[0], this[1], this[2])
  }

  /**
   * Returns a string representation of a vector
   *
   * @returns {String} string representation of the vector
   */
  toString(): string {
    return `vec3(${this[0]}, ${this[1]}, ${this[2]})`
  }

  /**
   * Generates a random vector with the given scale
   *
   * @param {Number} scale length of the resulting vector, defaults to 1.0
   * @returns {Vec3} a new random vector
   */
  static random(scale = 1.0) {
    const r = glmaths.RANDOM() * 2.0 * Math.PI
    const z = glmaths.RANDOM() * 2.0 - 1.0
    const zScale = Math.sqrt(1.0 - z * z) * scale
    return vec3(
      Math.cos(r) * zScale,
      Math.sin(r) * zScale,
      z * scale
    )
  }

  /**
   * Calculates the angle between two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @returns {Number} the angle in radians
   */
  static angle(a: Vec3, b: Vec3) {
    const ax = a[0], ay = a[1], az = a[2]
    const bx = b[0], by = b[1], bz = b[2]
    const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz))
    const cosine = mag && Vec3.dot(a, b) / mag
    return Math.acos(Math.min(Math.max(cosine, -1), 1))
  }

  /**
   * Calculates the dot product of two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @returns {Number} dot product of a and b
   */
  static dot(a: Vec3, b: Vec3) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static cross(a: Vec3, b: Vec3, out = vec3()): Vec3 {
    const ax = a[0], ay = a[1], az = a[2]
    const bx = b[0], by = b[1], bz = b[2]
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out
  }

  /**
   * Calculates the euclidian distance between two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @returns {Number} distance between a and b
   */
  static distance(a: Vec3, b: Vec3) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    const z = a[2] - b[2]
    return Math.sqrt(x * x + y * y + z * z)
  }
  static dist: (a: Vec3, b: Vec3) => number
  
  /**
   * Calculates the squared euclidian distance between two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @returns {Number} squared distance between a and b
   */
  static squaredDistance(a: Vec3, b: Vec3) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    const z = a[2] - b[2]
    return x * x + y * y + z * z
  }
  static sqrDist: (a: Vec3, b: Vec3) => number

  /**
   * Performs a linear interpolation between two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static lerp(a: Vec3, b: Vec3, t: number, out = vec3()) {
    const ax = a[0], ay = a[1], az = a[2]
    out[0] = ax + (b[0] - ax) * t
    out[1] = ay + (b[1] - ay) * t
    out[2] = az + (b[2] - az) * t
    return out
  }
  /**
   * Performs a spherical linear interpolation between two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static slerp(a: Vec3, b: Vec3, t: number, out = vec3()) {
    const angle = Math.acos(Math.min(Math.max(Vec3.dot(a, b), -1), 1))
    const sinTotal = Math.sin(angle)
    const ratioA = Math.sin((1 - t) * angle) / sinTotal
    const ratioB = Math.sin(t * angle) / sinTotal
    out[0] = ratioA * a[0] + ratioB * b[0]
    out[1] = ratioA * a[1] + ratioB * b[1]
    out[2] = ratioA * a[2] + ratioB * b[2]
    return out
  }

  /**
   * Returns the maximum of two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @returns {Vec3} a new vector with the max components
   */
  static max(a: Vec3, b: Vec3, out = vec3()) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    out[2] = Math.max(a[2], b[2])
    return out
  }
  /**
   * Returns the minimum of two vec3's
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @returns {Vec3} a new vector with the min components
   */
  static min(a: Vec3, b: Vec3, out = vec3()) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    out[2] = Math.min(a[2], b[2])
    return out
  }

  /**
   * Clamps each component of v between min and max.
   *
   * @param {Vec3} v the vector to clamp
   * @param {Vec3 | number} min the lower bound (per-component or scalar)
   * @param {Vec3 | number} max the upper bound (per-component or scalar)
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} out
   */
  static clamp(v: Vec3, min: Vec3 | number, max: Vec3 | number, out = vec3()) {
    const minX = typeof min === 'number' ? min : min[0]
    const minY = typeof min === 'number' ? min : min[1]
    const minZ = typeof min === 'number' ? min : min[2]
    const maxX = typeof max === 'number' ? max : max[0]
    const maxY = typeof max === 'number' ? max : max[1]
    const maxZ = typeof max === 'number' ? max : max[2]
    out[0] = Math.min(Math.max(v[0], minX), maxX)
    out[1] = Math.min(Math.max(v[1], minY), maxY)
    out[2] = Math.min(Math.max(v[2], minZ), maxZ)
    return out
  }

  /**
   * Performs a linear interpolation between a and b.
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Vec3 | number} t interpolation amount (per-component or scalar)
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} out
   */
  static mix(a: Vec3, b: Vec3, t: Vec3 | number, out = vec3()) {
    if (typeof t === 'number') {
      out[0] = a[0] + (b[0] - a[0]) * t
      out[1] = a[1] + (b[1] - a[1]) * t
      out[2] = a[2] + (b[2] - a[2]) * t
    } else {
      out[0] = a[0] + (b[0] - a[0]) * t[0]
      out[1] = a[1] + (b[1] - a[1]) * t[1]
      out[2] = a[2] + (b[2] - a[2]) * t[2]
    }
    return out
  }

  /**
   * Performs Hermite interpolation between two values (smoothstep).
   *
   * @param {Vec3 | number} edge0 the lower edge (per-component or scalar)
   * @param {Vec3 | number} edge1 the upper edge (per-component or scalar)
   * @param {Vec3} v the source vector
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} out
   */
  static smoothstep(edge0: Vec3 | number, edge1: Vec3 | number, v: Vec3, out = vec3()) {
    const e0x = typeof edge0 === 'number' ? edge0 : edge0[0]
    const e0y = typeof edge0 === 'number' ? edge0 : edge0[1]
    const e0z = typeof edge0 === 'number' ? edge0 : edge0[2]
    const e1x = typeof edge1 === 'number' ? edge1 : edge1[0]
    const e1y = typeof edge1 === 'number' ? edge1 : edge1[1]
    const e1z = typeof edge1 === 'number' ? edge1 : edge1[2]
    let t0 = Math.min(Math.max((v[0] - e0x) / (e1x - e0x), 0), 1)
    let t1 = Math.min(Math.max((v[1] - e0y) / (e1y - e0y), 0), 1)
    let t2 = Math.min(Math.max((v[2] - e0z) / (e1z - e0z), 0), 1)
    out[0] = t0 * t0 * (3 - 2 * t0)
    out[1] = t1 * t1 * (3 - 2 * t1)
    out[2] = t2 * t2 * (3 - 2 * t2)
    return out
  }

  /**
   * Rotates vec3 around the X axis
   *
   * @param {Vec3} v the vector to rotate
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   * @returns {Vec3} a new rotated vector
   */
  static rotateX(v: Vec3, rad: number, origin: Vec3 = vec3.zero, out = vec3()): Vec3 {
    const p1 = v[1] - origin[1]
    const p2 = v[2] - origin[2]
    out[0] = v[0]
    out[1] = p1 * Math.cos(rad) - p2 * Math.sin(rad) + origin[1]
    out[2] = p1 * Math.sin(rad) + p2 * Math.cos(rad) + origin[2]
    return out
  }

  /**
   * Rotates vec3 around the X axis
   *
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   * @returns {Vec3} a rotated vector
   */
  rotateX(rad: number, origin: Vec3 = vec3.zero, out = glmaths.ALWAYS_COPY ? vec3() : this): Vec3 {
    const p1 = this[1] - origin[1]
    const p2 = this[2] - origin[2]
    out[0] = this[0]
    out[1] = p1 * Math.cos(rad) - p2 * Math.sin(rad) + origin[1]
    out[2] = p1 * Math.sin(rad) + p2 * Math.cos(rad) + origin[2]
    return out
  }

  /**
   * Rotates vec3 around the Y axis
   *
   * @param {Vec3} v the vector to rotate
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   * @returns {Vec3} a rotated vector
   */
  static rotateY(v: Vec3, rad: number, origin: Vec3 = vec3.zero, out = vec3()): Vec3 {
    const p0 = v[0] - origin[0]
    const p2 = v[2] - origin[2]
    out[0] = p2 * Math.sin(rad) + p0 * Math.cos(rad) + origin[0]
    out[1] = v[1]
    out[2] = p2 * Math.cos(rad) - p0 * Math.sin(rad) + origin[2]
    return out
  }

  /**
   * Rotates vec3 around the Y axis
   *
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   */
  rotateY(rad: number, origin: Vec3 = vec3.zero, out = glmaths.ALWAYS_COPY ? vec3() : this) : Vec3 {
    const p0 = this[0] - origin[0]
    const p2 = this[2] - origin[2]
    out[0] = p2 * Math.sin(rad) + p0 * Math.cos(rad) + origin[0]
    out[1] = this[1]
    out[2] = p2 * Math.cos(rad) - p0 * Math.sin(rad) + origin[2]
    return out
  }
  /**
   * Rotates vec3 around the Z axis
   *
   * @param {Vec3} v the vector to rotate
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3} origin the origin of the rotation, defaults to ZERO
   * @returns {Vec3} a new rotated vector
   */
  static rotateZ(v: Vec3, rad: number, origin: Vec3 = vec3.zero, out = vec3()) {
    const p0 = v[0] - origin[0]
    const p1 = v[1] - origin[1]
    out[0] = p0 * Math.cos(rad) - p1 * Math.sin(rad) + origin[0]
    out[1] = p0 * Math.sin(rad) + p1 * Math.cos(rad) + origin[1]
    out[2] = v[2]
    return out
  }
  /**
   * Rotates vec3 around the Z axis
   *
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   */
  rotateZ(rad: number, origin: Vec3 = vec3.zero, out = glmaths.ALWAYS_COPY ? vec3() : this) : Vec3 {
    const p0 = this[0] - origin[0]
    const p1 = this[1] - origin[1]
    out[0] = p0 * Math.cos(rad) - p1 * Math.sin(rad) + origin[0]
    out[1] = p0 * Math.sin(rad) + p1 * Math.cos(rad) + origin[1]
    out[2] = this[2]
    return out
  }

  /**
   * Performs a hermite interpolation with two control points
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Vec3} c the third operand
   * @param {Vec3} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {Vec3} a new vector
   */
  static hermite(a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number, out = vec3()) {
    const factorTimes2 = t * t
    const factor1 = factorTimes2 * (2 * t - 3) + 1
    const factor2 = factorTimes2 * (t - 2) + t
    const factor3 = factorTimes2 * (t - 1)
    const factor4 = factorTimes2 * (3 - 2 * t)
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4
    return out
  }

  /**
   * Performs a bezier interpolation with two control points
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Vec3} c the third operand
   * @param {Vec3} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {Vec3} a new vector
   */
  static bezier(a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number, out = vec3()) {
    const inverseFactor = 1 - t
    const inverseFactorTimesTwo = inverseFactor * inverseFactor
    const factorTimes2 = t * t
    const factor1 = inverseFactorTimesTwo * inverseFactor
    const factor2 = 3 * t * inverseFactorTimesTwo
    const factor3 = 3 * factorTimes2 * inverseFactor
    const factor4 = factorTimes2 * t
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4
    return out
  }

  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static scaleAndAdd(a: Vec3, b: Vec3, scale: number, out = vec3()) {
    out[0] = a[0] + b[0] * scale
    out[1] = a[1] + b[1] * scale
    out[2] = a[2] + b[2] * scale
    return out
  }

  /**
   * Reflects a vector off a surface with the given normal
   *
   * @param {Vec3} I the incident vector
   * @param {Vec3} N the surface normal
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static reflect(I: Vec3, N: Vec3, out = vec3()) {
    const d = Vec3.dot(N, I) * 2
    out[0] = I[0] - d * N[0]; out[1] = I[1] - d * N[1]; out[2] = I[2] - d * N[2]
    return out
  }

  /**
   * Refracts a vector through a surface with the given normal and index of refraction ratio (Snell's law)
   *
   * @param {Vec3} I the incident vector
   * @param {Vec3} N the surface normal
   * @param {Number} eta the ratio of indices of refraction
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static refract(I: Vec3, N: Vec3, eta: number, out = vec3()) {
    const d = Vec3.dot(N, I)
    const k = 1.0 - eta * eta * (1.0 - d * d)
    if (k < 0.0) { out[0] = out[1] = out[2] = 0; return out }
    const f = eta * d + Math.sqrt(k)
    out[0] = eta * I[0] - f * N[0]
    out[1] = eta * I[1] - f * N[1]
    out[2] = eta * I[2] - f * N[2]
    return out
  }

  /**
   * Returns a vector pointing in the same direction as another, based on the dot product with a reference
   *
   * @param {Vec3} N the vector to orient
   * @param {Vec3} I the incident vector
   * @param {Vec3} Nref the reference vector
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static faceforward(N: Vec3, I: Vec3, Nref: Vec3, out = vec3()) {
    const d = Vec3.dot(Nref, I)
    const sign = d < 0 ? 1 : -1
    out[0] = N[0] * sign; out[1] = N[1] * sign; out[2] = N[2] * sign
    return out
  }

  /**
   * Computes the normalized normal of a triangle defined by three points
   *
   * @param {Vec3} p1 the first vertex
   * @param {Vec3} p2 the second vertex
   * @param {Vec3} p3 the third vertex
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static triangleNormal(p1: Vec3, p2: Vec3, p3: Vec3, out = vec3()) {
    const e1x = p2[0]-p1[0], e1y = p2[1]-p1[1], e1z = p2[2]-p1[2]
    const e2x = p3[0]-p1[0], e2y = p3[1]-p1[1], e2z = p3[2]-p1[2]
    out[0] = e1y*e2z - e1z*e2y; out[1] = e1z*e2x - e1x*e2z; out[2] = e1x*e2y - e1y*e2x
    let len = out[0]*out[0] + out[1]*out[1] + out[2]*out[2]
    if (len > 0) { len = 1/Math.sqrt(len); out[0]*=len; out[1]*=len; out[2]*=len }
    return out
  }

  /**
   * Projects vector a onto vector b
   *
   * @param {Vec3} a the vector to project
   * @param {Vec3} b the vector to project onto
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static project(a: Vec3, b: Vec3, out = vec3()) {
    const d = Vec3.dot(a, b) / Vec3.dot(b, b)
    out[0] = b[0] * d; out[1] = b[1] * d; out[2] = b[2] * d
    return out
  }

  /**
   * Returns the signed angle between two vec3's, using a reference axis to determine sign
   *
   * @param {Vec3} a the first operand
   * @param {Vec3} b the second operand
   * @param {Vec3} ref the reference axis for determining sign
   * @returns {Number} the signed angle in radians
   */
  static orientedAngle(a: Vec3, b: Vec3, ref: Vec3) {
    const c = Vec3.cross(a, b)
    const angle = Math.atan2(c.len(), Vec3.dot(a, b))
    return Vec3.dot(c, ref) < 0 ? -angle : angle
  }

  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   *
   * @param {Vec3} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  scaleAndAdd(b: Vec3, scale: number, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = this[0] + b[0] * scale
    out[1] = this[1] + b[1] * scale
    out[2] = this[2] + b[2] * scale
    return out
  }

  /**
   * Returns vec3 with each component set to its absolute value
   *
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  abs(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = Math.abs(this[0])
    out[1] = Math.abs(this[1])
    out[2] = Math.abs(this[2])
    return out
  }
  
  /**
   * Clamps each component of this vector between min and max.
   *
   * @param {Vec3 | number} min the lower bound (per-component or scalar)
   * @param {Vec3 | number} max the upper bound (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  clamp(min: Vec3 | number, max: Vec3 | number, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    const minX = typeof min === 'number' ? min : min[0]
    const minY = typeof min === 'number' ? min : min[1]
    const minZ = typeof min === 'number' ? min : min[2]
    const maxX = typeof max === 'number' ? max : max[0]
    const maxY = typeof max === 'number' ? max : max[1]
    const maxZ = typeof max === 'number' ? max : max[2]
    out[0] = Math.min(Math.max(this[0], minX), maxX)
    out[1] = Math.min(Math.max(this[1], minY), maxY)
    out[2] = Math.min(Math.max(this[2], minZ), maxZ)
    return out
  }

  /**
   * Performs a linear interpolation between this vector and b.
   *
   * @param {Vec3} b the second operand
   * @param {Vec3 | number} t interpolation amount (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  mix(b: Vec3, t: Vec3 | number, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof t === 'number') {
      out[0] = this[0] + (b[0] - this[0]) * t
      out[1] = this[1] + (b[1] - this[1]) * t
      out[2] = this[2] + (b[2] - this[2]) * t
    } else {
      out[0] = this[0] + (b[0] - this[0]) * t[0]
      out[1] = this[1] + (b[1] - this[1]) * t[1]
      out[2] = this[2] + (b[2] - this[2]) * t[2]
    }
    return out
  }

  /**
   * Generates a step function by comparing this vector to edge.
   *
   * @param {Vec3 | number} edge the edge value (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  step(edge: Vec3 | number, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    if (typeof edge === 'number') {
      out[0] = this[0] < edge ? 0 : 1
      out[1] = this[1] < edge ? 0 : 1
      out[2] = this[2] < edge ? 0 : 1
    } else {
      out[0] = this[0] < edge[0] ? 0 : 1
      out[1] = this[1] < edge[1] ? 0 : 1
      out[2] = this[2] < edge[2] ? 0 : 1
    }
    return out
  }

  /**
   * Performs Hermite interpolation between two values (smoothstep).
   *
   * @param {Vec3 | number} edge0 the lower edge (per-component or scalar)
   * @param {Vec3 | number} edge1 the upper edge (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  smoothstep(edge0: Vec3 | number, edge1: Vec3 | number, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    const e0x = typeof edge0 === 'number' ? edge0 : edge0[0]
    const e0y = typeof edge0 === 'number' ? edge0 : edge0[1]
    const e0z = typeof edge0 === 'number' ? edge0 : edge0[2]
    const e1x = typeof edge1 === 'number' ? edge1 : edge1[0]
    const e1y = typeof edge1 === 'number' ? edge1 : edge1[1]
    const e1z = typeof edge1 === 'number' ? edge1 : edge1[2]
    let t0 = Math.min(Math.max((this[0] - e0x) / (e1x - e0x), 0), 1)
    let t1 = Math.min(Math.max((this[1] - e0y) / (e1y - e0y), 0), 1)
    let t2 = Math.min(Math.max((this[2] - e0z) / (e1z - e0z), 0), 1)
    out[0] = t0 * t0 * (3 - 2 * t0)
    out[1] = t1 * t1 * (3 - 2 * t1)
    out[2] = t2 * t2 * (3 - 2 * t2)
    return out
  }

  /**
   * Returns the fractional part of each component.
   *
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  fract(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = this[0] - Math.floor(this[0])
    out[1] = this[1] - Math.floor(this[1])
    out[2] = this[2] - Math.floor(this[2])
    return out
  }

  /**
   * Returns the sign of each component (-1, 0, or 1).
   *
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  sign(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = this[0] > 0 ? 1 : this[0] < 0 ? -1 : 0
    out[1] = this[1] > 0 ? 1 : this[1] < 0 ? -1 : 0
    out[2] = this[2] > 0 ? 1 : this[2] < 0 ? -1 : 0
    return out
  }

  /**
   * Clamps each component to [0, 1].
   *
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  saturate(out = glmaths.ALWAYS_COPY ? vec3() : this) {
    out[0] = Math.min(Math.max(this[0], 0), 1)
    out[1] = Math.min(Math.max(this[1], 0), 1)
    out[2] = Math.min(Math.max(this[2], 0), 1)
    return out
  }

  /**
   * Transforms this vec3 with a Mat3
   *
   * @param {Mat3} m the 3x3 matrix to transform with
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  transformMat3(m: Mat3, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    const x = this[0], y = this[1], z = this[2]
    out[0] = x * m[0] + y * m[3] + z * m[6]
    out[1] = x * m[1] + y * m[4] + z * m[7]
    out[2] = x * m[2] + y * m[5] + z * m[8]
    return out
  }

  /**
   * Transforms this vec3 with a Mat4 (as a point, w=1)
   *
   * @param {Mat4} m the 4x4 matrix to transform with
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  transformMat4(m: Mat4, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    const x = this[0], y = this[1], z = this[2]
    let w = m[3] * x + m[7] * y + m[11] * z + m[15]
    w = w || 1.0
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    return out
  }

  /**
   * Transforms this vec3 with a quaternion
   *
   * @param {Quat} q the quaternion to transform with
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  transformQuat(q: Quat, out = glmaths.ALWAYS_COPY ? vec3() : this) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3]
    const x = this[0], y = this[1], z = this[2]
    let uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x
    let uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx
    const w2 = qw * 2
    uvx *= w2; uvy *= w2; uvz *= w2
    uuvx *= 2; uuvy *= 2; uuvz *= 2
    out[0] = x + uvx + uuvx
    out[1] = y + uvy + uuvy
    out[2] = z + uvz + uuvz
    return out
  }
}


export interface Vec3 {
  add: (b: Vec3 | number, out?: Vec3) => Vec3
  sub: (b: Vec3 | number, out?: Vec3) => Vec3
  subtract: (b: Vec3 | number, out?: Vec3) => Vec3
  mul: (b: Vec3 | number, out?: Vec3) => Vec3
  scale: (b: Vec3 | number, out?: Vec3) => Vec3
  multiply: (b: Vec3 | number, out?: Vec3) => Vec3
  times: (b: Vec3 | number, out?: Vec3) => Vec3
  divide: (b: Vec3 | number, out?: Vec3) => Vec3
  neg: (out?: Vec3) => Vec3
  unaryMinus: (out?: Vec3) => Vec3
  sqrLen: () => number
  str: () => string
  transformMat3x3: (m: Mat3, out?: Vec3) => Vec3
  transformMat4x4: (m: Mat4, out?: Vec3) => Vec3
  normalized: (out?: Vec3) => Vec3

  // Auto-generated
  x0: Vec2; x1: Vec2; xx: Vec2; xy: Vec2; y0: Vec2; y1: Vec2; yx: Vec2; yy: Vec2; x00: Vec3; x01: Vec3; x0x: Vec3; x0y: Vec3; x0z: Vec3; x10: Vec3; x11: Vec3; x1x: Vec3; x1y: Vec3; x1z: Vec3; xx0: Vec3; xx1: Vec3; xxx: Vec3; xxy: Vec3; xxz: Vec3; xy0: Vec3; xy1: Vec3; xyx: Vec3; xyy: Vec3; xyz: Vec3; xz0: Vec3; xz1: Vec3; xzx: Vec3; xzy: Vec3; xzz: Vec3; y00: Vec3; y01: Vec3; y0x: Vec3; y0y: Vec3; y0z: Vec3; y10: Vec3; y11: Vec3; y1x: Vec3; y1y: Vec3; y1z: Vec3; yx0: Vec3; yx1: Vec3; yxx: Vec3; yxy: Vec3; yxz: Vec3; yy0: Vec3; yy1: Vec3; yyx: Vec3; yyy: Vec3; yyz: Vec3; yz0: Vec3; yz1: Vec3; yzx: Vec3; yzy: Vec3; yzz: Vec3; z00: Vec3; z01: Vec3; z0x: Vec3; z0y: Vec3; z0z: Vec3; z10: Vec3; z11: Vec3; z1x: Vec3; z1y: Vec3; z1z: Vec3; zx0: Vec3; zx1: Vec3; zxx: Vec3; zxy: Vec3; zxz: Vec3; zy0: Vec3; zy1: Vec3; zyx: Vec3; zyy: Vec3; zyz: Vec3; zz0: Vec3; zz1: Vec3; zzx: Vec3; zzy: Vec3; zzz: Vec3; x000: Vec4; x001: Vec4; x00x: Vec4; x00y: Vec4; x00z: Vec4; x00w: Vec4; x010: Vec4; x011: Vec4; x01x: Vec4; x01y: Vec4; x01z: Vec4; x01w: Vec4; x0x0: Vec4; x0x1: Vec4; x0xx: Vec4; x0xy: Vec4; x0xz: Vec4; x0xw: Vec4; x0y0: Vec4; x0y1: Vec4; x0yx: Vec4; x0yy: Vec4; x0yz: Vec4; x0yw: Vec4; x0z0: Vec4; x0z1: Vec4; x0zx: Vec4; x0zy: Vec4; x0zz: Vec4; x0zw: Vec4; x0w0: Vec4; x0w1: Vec4; x0wx: Vec4; x0wy: Vec4; x0wz: Vec4; x0ww: Vec4; x100: Vec4; x101: Vec4; x10x: Vec4; x10y: Vec4; x10z: Vec4; x10w: Vec4; x110: Vec4; x111: Vec4; x11x: Vec4; x11y: Vec4; x11z: Vec4; x11w: Vec4; x1x0: Vec4; x1x1: Vec4; x1xx: Vec4; x1xy: Vec4; x1xz: Vec4; x1xw: Vec4; x1y0: Vec4; x1y1: Vec4; x1yx: Vec4; x1yy: Vec4; x1yz: Vec4; x1yw: Vec4; x1z0: Vec4; x1z1: Vec4; x1zx: Vec4; x1zy: Vec4; x1zz: Vec4; x1zw: Vec4; x1w0: Vec4; x1w1: Vec4; x1wx: Vec4; x1wy: Vec4; x1wz: Vec4; x1ww: Vec4; xx00: Vec4; xx01: Vec4; xx0x: Vec4; xx0y: Vec4; xx0z: Vec4; xx0w: Vec4; xx10: Vec4; xx11: Vec4; xx1x: Vec4; xx1y: Vec4; xx1z: Vec4; xx1w: Vec4; xxx0: Vec4; xxx1: Vec4; xxxx: Vec4; xxxy: Vec4; xxxz: Vec4; xxxw: Vec4; xxy0: Vec4; xxy1: Vec4; xxyx: Vec4; xxyy: Vec4; xxyz: Vec4; xxyw: Vec4; xxz0: Vec4; xxz1: Vec4; xxzx: Vec4; xxzy: Vec4; xxzz: Vec4; xxzw: Vec4; xxw0: Vec4; xxw1: Vec4; xxwx: Vec4; xxwy: Vec4; xxwz: Vec4; xxww: Vec4; xy00: Vec4; xy01: Vec4; xy0x: Vec4; xy0y: Vec4; xy0z: Vec4; xy0w: Vec4; xy10: Vec4; xy11: Vec4; xy1x: Vec4; xy1y: Vec4; xy1z: Vec4; xy1w: Vec4; xyx0: Vec4; xyx1: Vec4; xyxx: Vec4; xyxy: Vec4; xyxz: Vec4; xyxw: Vec4; xyy0: Vec4; xyy1: Vec4; xyyx: Vec4; xyyy: Vec4; xyyz: Vec4; xyyw: Vec4; xyz0: Vec4; xyz1: Vec4; xyzx: Vec4; xyzy: Vec4; xyzz: Vec4; xyzw: Vec4; xyw0: Vec4; xyw1: Vec4; xywx: Vec4; xywy: Vec4; xywz: Vec4; xyww: Vec4; xz00: Vec4; xz01: Vec4; xz0x: Vec4; xz0y: Vec4; xz0z: Vec4; xz0w: Vec4; xz10: Vec4; xz11: Vec4; xz1x: Vec4; xz1y: Vec4; xz1z: Vec4; xz1w: Vec4; xzx0: Vec4; xzx1: Vec4; xzxx: Vec4; xzxy: Vec4; xzxz: Vec4; xzxw: Vec4; xzy0: Vec4; xzy1: Vec4; xzyx: Vec4; xzyy: Vec4; xzyz: Vec4; xzyw: Vec4; xzz0: Vec4; xzz1: Vec4; xzzx: Vec4; xzzy: Vec4; xzzz: Vec4; xzzw: Vec4; xzw0: Vec4; xzw1: Vec4; xzwx: Vec4; xzwy: Vec4; xzwz: Vec4; xzww: Vec4; xw00: Vec4; xw01: Vec4; xw0x: Vec4; xw0y: Vec4; xw0z: Vec4; xw0w: Vec4; xw10: Vec4; xw11: Vec4; xw1x: Vec4; xw1y: Vec4; xw1z: Vec4; xw1w: Vec4; xwx0: Vec4; xwx1: Vec4; xwxx: Vec4; xwxy: Vec4; xwxz: Vec4; xwxw: Vec4; xwy0: Vec4; xwy1: Vec4; xwyx: Vec4; xwyy: Vec4; xwyz: Vec4; xwyw: Vec4; xwz0: Vec4; xwz1: Vec4; xwzx: Vec4; xwzy: Vec4; xwzz: Vec4; xwzw: Vec4; xww0: Vec4; xww1: Vec4; xwwx: Vec4; xwwy: Vec4; xwwz: Vec4; xwww: Vec4; y000: Vec4; y001: Vec4; y00x: Vec4; y00y: Vec4; y00z: Vec4; y00w: Vec4; y010: Vec4; y011: Vec4; y01x: Vec4; y01y: Vec4; y01z: Vec4; y01w: Vec4; y0x0: Vec4; y0x1: Vec4; y0xx: Vec4; y0xy: Vec4; y0xz: Vec4; y0xw: Vec4; y0y0: Vec4; y0y1: Vec4; y0yx: Vec4; y0yy: Vec4; y0yz: Vec4; y0yw: Vec4; y0z0: Vec4; y0z1: Vec4; y0zx: Vec4; y0zy: Vec4; y0zz: Vec4; y0zw: Vec4; y0w0: Vec4; y0w1: Vec4; y0wx: Vec4; y0wy: Vec4; y0wz: Vec4; y0ww: Vec4; y100: Vec4; y101: Vec4; y10x: Vec4; y10y: Vec4; y10z: Vec4; y10w: Vec4; y110: Vec4; y111: Vec4; y11x: Vec4; y11y: Vec4; y11z: Vec4; y11w: Vec4; y1x0: Vec4; y1x1: Vec4; y1xx: Vec4; y1xy: Vec4; y1xz: Vec4; y1xw: Vec4; y1y0: Vec4; y1y1: Vec4; y1yx: Vec4; y1yy: Vec4; y1yz: Vec4; y1yw: Vec4; y1z0: Vec4; y1z1: Vec4; y1zx: Vec4; y1zy: Vec4; y1zz: Vec4; y1zw: Vec4; y1w0: Vec4; y1w1: Vec4; y1wx: Vec4; y1wy: Vec4; y1wz: Vec4; y1ww: Vec4; yx00: Vec4; yx01: Vec4; yx0x: Vec4; yx0y: Vec4; yx0z: Vec4; yx0w: Vec4; yx10: Vec4; yx11: Vec4; yx1x: Vec4; yx1y: Vec4; yx1z: Vec4; yx1w: Vec4; yxx0: Vec4; yxx1: Vec4; yxxx: Vec4; yxxy: Vec4; yxxz: Vec4; yxxw: Vec4; yxy0: Vec4; yxy1: Vec4; yxyx: Vec4; yxyy: Vec4; yxyz: Vec4; yxyw: Vec4; yxz0: Vec4; yxz1: Vec4; yxzx: Vec4; yxzy: Vec4; yxzz: Vec4; yxzw: Vec4; yxw0: Vec4; yxw1: Vec4; yxwx: Vec4; yxwy: Vec4; yxwz: Vec4; yxww: Vec4; yy00: Vec4; yy01: Vec4; yy0x: Vec4; yy0y: Vec4; yy0z: Vec4; yy0w: Vec4; yy10: Vec4; yy11: Vec4; yy1x: Vec4; yy1y: Vec4; yy1z: Vec4; yy1w: Vec4; yyx0: Vec4; yyx1: Vec4; yyxx: Vec4; yyxy: Vec4; yyxz: Vec4; yyxw: Vec4; yyy0: Vec4; yyy1: Vec4; yyyx: Vec4; yyyy: Vec4; yyyz: Vec4; yyyw: Vec4; yyz0: Vec4; yyz1: Vec4; yyzx: Vec4; yyzy: Vec4; yyzz: Vec4; yyzw: Vec4; yyw0: Vec4; yyw1: Vec4; yywx: Vec4; yywy: Vec4; yywz: Vec4; yyww: Vec4; yz00: Vec4; yz01: Vec4; yz0x: Vec4; yz0y: Vec4; yz0z: Vec4; yz0w: Vec4; yz10: Vec4; yz11: Vec4; yz1x: Vec4; yz1y: Vec4; yz1z: Vec4; yz1w: Vec4; yzx0: Vec4; yzx1: Vec4; yzxx: Vec4; yzxy: Vec4; yzxz: Vec4; yzxw: Vec4; yzy0: Vec4; yzy1: Vec4; yzyx: Vec4; yzyy: Vec4; yzyz: Vec4; yzyw: Vec4; yzz0: Vec4; yzz1: Vec4; yzzx: Vec4; yzzy: Vec4; yzzz: Vec4; yzzw: Vec4; yzw0: Vec4; yzw1: Vec4; yzwx: Vec4; yzwy: Vec4; yzwz: Vec4; yzww: Vec4; yw00: Vec4; yw01: Vec4; yw0x: Vec4; yw0y: Vec4; yw0z: Vec4; yw0w: Vec4; yw10: Vec4; yw11: Vec4; yw1x: Vec4; yw1y: Vec4; yw1z: Vec4; yw1w: Vec4; ywx0: Vec4; ywx1: Vec4; ywxx: Vec4; ywxy: Vec4; ywxz: Vec4; ywxw: Vec4; ywy0: Vec4; ywy1: Vec4; ywyx: Vec4; ywyy: Vec4; ywyz: Vec4; ywyw: Vec4; ywz0: Vec4; ywz1: Vec4; ywzx: Vec4; ywzy: Vec4; ywzz: Vec4; ywzw: Vec4; yww0: Vec4; yww1: Vec4; ywwx: Vec4; ywwy: Vec4; ywwz: Vec4; ywww: Vec4; z000: Vec4; z001: Vec4; z00x: Vec4; z00y: Vec4; z00z: Vec4; z00w: Vec4; z010: Vec4; z011: Vec4; z01x: Vec4; z01y: Vec4; z01z: Vec4; z01w: Vec4; z0x0: Vec4; z0x1: Vec4; z0xx: Vec4; z0xy: Vec4; z0xz: Vec4; z0xw: Vec4; z0y0: Vec4; z0y1: Vec4; z0yx: Vec4; z0yy: Vec4; z0yz: Vec4; z0yw: Vec4; z0z0: Vec4; z0z1: Vec4; z0zx: Vec4; z0zy: Vec4; z0zz: Vec4; z0zw: Vec4; z0w0: Vec4; z0w1: Vec4; z0wx: Vec4; z0wy: Vec4; z0wz: Vec4; z0ww: Vec4; z100: Vec4; z101: Vec4; z10x: Vec4; z10y: Vec4; z10z: Vec4; z10w: Vec4; z110: Vec4; z111: Vec4; z11x: Vec4; z11y: Vec4; z11z: Vec4; z11w: Vec4; z1x0: Vec4; z1x1: Vec4; z1xx: Vec4; z1xy: Vec4; z1xz: Vec4; z1xw: Vec4; z1y0: Vec4; z1y1: Vec4; z1yx: Vec4; z1yy: Vec4; z1yz: Vec4; z1yw: Vec4; z1z0: Vec4; z1z1: Vec4; z1zx: Vec4; z1zy: Vec4; z1zz: Vec4; z1zw: Vec4; z1w0: Vec4; z1w1: Vec4; z1wx: Vec4; z1wy: Vec4; z1wz: Vec4; z1ww: Vec4; zx00: Vec4; zx01: Vec4; zx0x: Vec4; zx0y: Vec4; zx0z: Vec4; zx0w: Vec4; zx10: Vec4; zx11: Vec4; zx1x: Vec4; zx1y: Vec4; zx1z: Vec4; zx1w: Vec4; zxx0: Vec4; zxx1: Vec4; zxxx: Vec4; zxxy: Vec4; zxxz: Vec4; zxxw: Vec4; zxy0: Vec4; zxy1: Vec4; zxyx: Vec4; zxyy: Vec4; zxyz: Vec4; zxyw: Vec4; zxz0: Vec4; zxz1: Vec4; zxzx: Vec4; zxzy: Vec4; zxzz: Vec4; zxzw: Vec4; zxw0: Vec4; zxw1: Vec4; zxwx: Vec4; zxwy: Vec4; zxwz: Vec4; zxww: Vec4; zy00: Vec4; zy01: Vec4; zy0x: Vec4; zy0y: Vec4; zy0z: Vec4; zy0w: Vec4; zy10: Vec4; zy11: Vec4; zy1x: Vec4; zy1y: Vec4; zy1z: Vec4; zy1w: Vec4; zyx0: Vec4; zyx1: Vec4; zyxx: Vec4; zyxy: Vec4; zyxz: Vec4; zyxw: Vec4; zyy0: Vec4; zyy1: Vec4; zyyx: Vec4; zyyy: Vec4; zyyz: Vec4; zyyw: Vec4; zyz0: Vec4; zyz1: Vec4; zyzx: Vec4; zyzy: Vec4; zyzz: Vec4; zyzw: Vec4; zyw0: Vec4; zyw1: Vec4; zywx: Vec4; zywy: Vec4; zywz: Vec4; zyww: Vec4; zz00: Vec4; zz01: Vec4; zz0x: Vec4; zz0y: Vec4; zz0z: Vec4; zz0w: Vec4; zz10: Vec4; zz11: Vec4; zz1x: Vec4; zz1y: Vec4; zz1z: Vec4; zz1w: Vec4; zzx0: Vec4; zzx1: Vec4; zzxx: Vec4; zzxy: Vec4; zzxz: Vec4; zzxw: Vec4; zzy0: Vec4; zzy1: Vec4; zzyx: Vec4; zzyy: Vec4; zzyz: Vec4; zzyw: Vec4; zzz0: Vec4; zzz1: Vec4; zzzx: Vec4; zzzy: Vec4; zzzz: Vec4; zzzw: Vec4; zzw0: Vec4; zzw1: Vec4; zzwx: Vec4; zzwy: Vec4; zzwz: Vec4; zzww: Vec4; zw00: Vec4; zw01: Vec4; zw0x: Vec4; zw0y: Vec4; zw0z: Vec4; zw0w: Vec4; zw10: Vec4; zw11: Vec4; zw1x: Vec4; zw1y: Vec4; zw1z: Vec4; zw1w: Vec4; zwx0: Vec4; zwx1: Vec4; zwxx: Vec4; zwxy: Vec4; zwxz: Vec4; zwxw: Vec4; zwy0: Vec4; zwy1: Vec4; zwyx: Vec4; zwyy: Vec4; zwyz: Vec4; zwyw: Vec4; zwz0: Vec4; zwz1: Vec4; zwzx: Vec4; zwzy: Vec4; zwzz: Vec4; zwzw: Vec4; zww0: Vec4; zww1: Vec4; zwwx: Vec4; zwwy: Vec4; zwwz: Vec4; zwww: Vec4; w000: Vec4; w001: Vec4; w00x: Vec4; w00y: Vec4; w00z: Vec4; w00w: Vec4; w010: Vec4; w011: Vec4; w01x: Vec4; w01y: Vec4; w01z: Vec4; w01w: Vec4; w0x0: Vec4; w0x1: Vec4; w0xx: Vec4; w0xy: Vec4; w0xz: Vec4; w0xw: Vec4; w0y0: Vec4; w0y1: Vec4; w0yx: Vec4; w0yy: Vec4; w0yz: Vec4; w0yw: Vec4; w0z0: Vec4; w0z1: Vec4; w0zx: Vec4; w0zy: Vec4; w0zz: Vec4; w0zw: Vec4; w0w0: Vec4; w0w1: Vec4; w0wx: Vec4; w0wy: Vec4; w0wz: Vec4; w0ww: Vec4; w100: Vec4; w101: Vec4; w10x: Vec4; w10y: Vec4; w10z: Vec4; w10w: Vec4; w110: Vec4; w111: Vec4; w11x: Vec4; w11y: Vec4; w11z: Vec4; w11w: Vec4; w1x0: Vec4; w1x1: Vec4; w1xx: Vec4; w1xy: Vec4; w1xz: Vec4; w1xw: Vec4; w1y0: Vec4; w1y1: Vec4; w1yx: Vec4; w1yy: Vec4; w1yz: Vec4; w1yw: Vec4; w1z0: Vec4; w1z1: Vec4; w1zx: Vec4; w1zy: Vec4; w1zz: Vec4; w1zw: Vec4; w1w0: Vec4; w1w1: Vec4; w1wx: Vec4; w1wy: Vec4; w1wz: Vec4; w1ww: Vec4; wx00: Vec4; wx01: Vec4; wx0x: Vec4; wx0y: Vec4; wx0z: Vec4; wx0w: Vec4; wx10: Vec4; wx11: Vec4; wx1x: Vec4; wx1y: Vec4; wx1z: Vec4; wx1w: Vec4; wxx0: Vec4; wxx1: Vec4; wxxx: Vec4; wxxy: Vec4; wxxz: Vec4; wxxw: Vec4; wxy0: Vec4; wxy1: Vec4; wxyx: Vec4; wxyy: Vec4; wxyz: Vec4; wxyw: Vec4; wxz0: Vec4; wxz1: Vec4; wxzx: Vec4; wxzy: Vec4; wxzz: Vec4; wxzw: Vec4; wxw0: Vec4; wxw1: Vec4; wxwx: Vec4; wxwy: Vec4; wxwz: Vec4; wxww: Vec4; wy00: Vec4; wy01: Vec4; wy0x: Vec4; wy0y: Vec4; wy0z: Vec4; wy0w: Vec4; wy10: Vec4; wy11: Vec4; wy1x: Vec4; wy1y: Vec4; wy1z: Vec4; wy1w: Vec4; wyx0: Vec4; wyx1: Vec4; wyxx: Vec4; wyxy: Vec4; wyxz: Vec4; wyxw: Vec4; wyy0: Vec4; wyy1: Vec4; wyyx: Vec4; wyyy: Vec4; wyyz: Vec4; wyyw: Vec4; wyz0: Vec4; wyz1: Vec4; wyzx: Vec4; wyzy: Vec4; wyzz: Vec4; wyzw: Vec4; wyw0: Vec4; wyw1: Vec4; wywx: Vec4; wywy: Vec4; wywz: Vec4; wyww: Vec4; wz00: Vec4; wz01: Vec4; wz0x: Vec4; wz0y: Vec4; wz0z: Vec4; wz0w: Vec4; wz10: Vec4; wz11: Vec4; wz1x: Vec4; wz1y: Vec4; wz1z: Vec4; wz1w: Vec4; wzx0: Vec4; wzx1: Vec4; wzxx: Vec4; wzxy: Vec4; wzxz: Vec4; wzxw: Vec4; wzy0: Vec4; wzy1: Vec4; wzyx: Vec4; wzyy: Vec4; wzyz: Vec4; wzyw: Vec4; wzz0: Vec4; wzz1: Vec4; wzzx: Vec4; wzzy: Vec4; wzzz: Vec4; wzzw: Vec4; wzw0: Vec4; wzw1: Vec4; wzwx: Vec4; wzwy: Vec4; wzwz: Vec4; wzww: Vec4; ww00: Vec4; ww01: Vec4; ww0x: Vec4; ww0y: Vec4; ww0z: Vec4; ww0w: Vec4; ww10: Vec4; ww11: Vec4; ww1x: Vec4; ww1y: Vec4; ww1z: Vec4; ww1w: Vec4; wwx0: Vec4; wwx1: Vec4; wwxx: Vec4; wwxy: Vec4; wwxz: Vec4; wwxw: Vec4; wwy0: Vec4; wwy1: Vec4; wwyx: Vec4; wwyy: Vec4; wwyz: Vec4; wwyw: Vec4; wwz0: Vec4; wwz1: Vec4; wwzx: Vec4; wwzy: Vec4; wwzz: Vec4; wwzw: Vec4; www0: Vec4; www1: Vec4; wwwx: Vec4; wwwy: Vec4; wwwz: Vec4; wwww: Vec4;
  r0: Vec2; r1: Vec2; rr: Vec2; rg: Vec2; g0: Vec2; g1: Vec2; gr: Vec2; gg: Vec2; r00: Vec3; r01: Vec3; r0r: Vec3; r0g: Vec3; r0b: Vec3; r10: Vec3; r11: Vec3; r1r: Vec3; r1g: Vec3; r1b: Vec3; rr0: Vec3; rr1: Vec3; rrr: Vec3; rrg: Vec3; rrb: Vec3; rg0: Vec3; rg1: Vec3; rgr: Vec3; rgg: Vec3; rgb: Vec3; rb0: Vec3; rb1: Vec3; rbr: Vec3; rbg: Vec3; rbb: Vec3; g00: Vec3; g01: Vec3; g0r: Vec3; g0g: Vec3; g0b: Vec3; g10: Vec3; g11: Vec3; g1r: Vec3; g1g: Vec3; g1b: Vec3; gr0: Vec3; gr1: Vec3; grr: Vec3; grg: Vec3; grb: Vec3; gg0: Vec3; gg1: Vec3; ggr: Vec3; ggg: Vec3; ggb: Vec3; gb0: Vec3; gb1: Vec3; gbr: Vec3; gbg: Vec3; gbb: Vec3; b00: Vec3; b01: Vec3; b0r: Vec3; b0g: Vec3; b0b: Vec3; b10: Vec3; b11: Vec3; b1r: Vec3; b1g: Vec3; b1b: Vec3; br0: Vec3; br1: Vec3; brr: Vec3; brg: Vec3; brb: Vec3; bg0: Vec3; bg1: Vec3; bgr: Vec3; bgg: Vec3; bgb: Vec3; bb0: Vec3; bb1: Vec3; bbr: Vec3; bbg: Vec3; bbb: Vec3; r000: Vec4; r001: Vec4; r00r: Vec4; r00g: Vec4; r00b: Vec4; r00a: Vec4; r010: Vec4; r011: Vec4; r01r: Vec4; r01g: Vec4; r01b: Vec4; r01a: Vec4; r0r0: Vec4; r0r1: Vec4; r0rr: Vec4; r0rg: Vec4; r0rb: Vec4; r0ra: Vec4; r0g0: Vec4; r0g1: Vec4; r0gr: Vec4; r0gg: Vec4; r0gb: Vec4; r0ga: Vec4; r0b0: Vec4; r0b1: Vec4; r0br: Vec4; r0bg: Vec4; r0bb: Vec4; r0ba: Vec4; r0a0: Vec4; r0a1: Vec4; r0ar: Vec4; r0ag: Vec4; r0ab: Vec4; r0aa: Vec4; r100: Vec4; r101: Vec4; r10r: Vec4; r10g: Vec4; r10b: Vec4; r10a: Vec4; r110: Vec4; r111: Vec4; r11r: Vec4; r11g: Vec4; r11b: Vec4; r11a: Vec4; r1r0: Vec4; r1r1: Vec4; r1rr: Vec4; r1rg: Vec4; r1rb: Vec4; r1ra: Vec4; r1g0: Vec4; r1g1: Vec4; r1gr: Vec4; r1gg: Vec4; r1gb: Vec4; r1ga: Vec4; r1b0: Vec4; r1b1: Vec4; r1br: Vec4; r1bg: Vec4; r1bb: Vec4; r1ba: Vec4; r1a0: Vec4; r1a1: Vec4; r1ar: Vec4; r1ag: Vec4; r1ab: Vec4; r1aa: Vec4; rr00: Vec4; rr01: Vec4; rr0r: Vec4; rr0g: Vec4; rr0b: Vec4; rr0a: Vec4; rr10: Vec4; rr11: Vec4; rr1r: Vec4; rr1g: Vec4; rr1b: Vec4; rr1a: Vec4; rrr0: Vec4; rrr1: Vec4; rrrr: Vec4; rrrg: Vec4; rrrb: Vec4; rrra: Vec4; rrg0: Vec4; rrg1: Vec4; rrgr: Vec4; rrgg: Vec4; rrgb: Vec4; rrga: Vec4; rrb0: Vec4; rrb1: Vec4; rrbr: Vec4; rrbg: Vec4; rrbb: Vec4; rrba: Vec4; rra0: Vec4; rra1: Vec4; rrar: Vec4; rrag: Vec4; rrab: Vec4; rraa: Vec4; rg00: Vec4; rg01: Vec4; rg0r: Vec4; rg0g: Vec4; rg0b: Vec4; rg0a: Vec4; rg10: Vec4; rg11: Vec4; rg1r: Vec4; rg1g: Vec4; rg1b: Vec4; rg1a: Vec4; rgr0: Vec4; rgr1: Vec4; rgrr: Vec4; rgrg: Vec4; rgrb: Vec4; rgra: Vec4; rgg0: Vec4; rgg1: Vec4; rggr: Vec4; rggg: Vec4; rggb: Vec4; rgga: Vec4; rgb0: Vec4; rgb1: Vec4; rgbr: Vec4; rgbg: Vec4; rgbb: Vec4; rgba: Vec4; rga0: Vec4; rga1: Vec4; rgar: Vec4; rgag: Vec4; rgab: Vec4; rgaa: Vec4; rb00: Vec4; rb01: Vec4; rb0r: Vec4; rb0g: Vec4; rb0b: Vec4; rb0a: Vec4; rb10: Vec4; rb11: Vec4; rb1r: Vec4; rb1g: Vec4; rb1b: Vec4; rb1a: Vec4; rbr0: Vec4; rbr1: Vec4; rbrr: Vec4; rbrg: Vec4; rbrb: Vec4; rbra: Vec4; rbg0: Vec4; rbg1: Vec4; rbgr: Vec4; rbgg: Vec4; rbgb: Vec4; rbga: Vec4; rbb0: Vec4; rbb1: Vec4; rbbr: Vec4; rbbg: Vec4; rbbb: Vec4; rbba: Vec4; rba0: Vec4; rba1: Vec4; rbar: Vec4; rbag: Vec4; rbab: Vec4; rbaa: Vec4; ra00: Vec4; ra01: Vec4; ra0r: Vec4; ra0g: Vec4; ra0b: Vec4; ra0a: Vec4; ra10: Vec4; ra11: Vec4; ra1r: Vec4; ra1g: Vec4; ra1b: Vec4; ra1a: Vec4; rar0: Vec4; rar1: Vec4; rarr: Vec4; rarg: Vec4; rarb: Vec4; rara: Vec4; rag0: Vec4; rag1: Vec4; ragr: Vec4; ragg: Vec4; ragb: Vec4; raga: Vec4; rab0: Vec4; rab1: Vec4; rabr: Vec4; rabg: Vec4; rabb: Vec4; raba: Vec4; raa0: Vec4; raa1: Vec4; raar: Vec4; raag: Vec4; raab: Vec4; raaa: Vec4; g000: Vec4; g001: Vec4; g00r: Vec4; g00g: Vec4; g00b: Vec4; g00a: Vec4; g010: Vec4; g011: Vec4; g01r: Vec4; g01g: Vec4; g01b: Vec4; g01a: Vec4; g0r0: Vec4; g0r1: Vec4; g0rr: Vec4; g0rg: Vec4; g0rb: Vec4; g0ra: Vec4; g0g0: Vec4; g0g1: Vec4; g0gr: Vec4; g0gg: Vec4; g0gb: Vec4; g0ga: Vec4; g0b0: Vec4; g0b1: Vec4; g0br: Vec4; g0bg: Vec4; g0bb: Vec4; g0ba: Vec4; g0a0: Vec4; g0a1: Vec4; g0ar: Vec4; g0ag: Vec4; g0ab: Vec4; g0aa: Vec4; g100: Vec4; g101: Vec4; g10r: Vec4; g10g: Vec4; g10b: Vec4; g10a: Vec4; g110: Vec4; g111: Vec4; g11r: Vec4; g11g: Vec4; g11b: Vec4; g11a: Vec4; g1r0: Vec4; g1r1: Vec4; g1rr: Vec4; g1rg: Vec4; g1rb: Vec4; g1ra: Vec4; g1g0: Vec4; g1g1: Vec4; g1gr: Vec4; g1gg: Vec4; g1gb: Vec4; g1ga: Vec4; g1b0: Vec4; g1b1: Vec4; g1br: Vec4; g1bg: Vec4; g1bb: Vec4; g1ba: Vec4; g1a0: Vec4; g1a1: Vec4; g1ar: Vec4; g1ag: Vec4; g1ab: Vec4; g1aa: Vec4; gr00: Vec4; gr01: Vec4; gr0r: Vec4; gr0g: Vec4; gr0b: Vec4; gr0a: Vec4; gr10: Vec4; gr11: Vec4; gr1r: Vec4; gr1g: Vec4; gr1b: Vec4; gr1a: Vec4; grr0: Vec4; grr1: Vec4; grrr: Vec4; grrg: Vec4; grrb: Vec4; grra: Vec4; grg0: Vec4; grg1: Vec4; grgr: Vec4; grgg: Vec4; grgb: Vec4; grga: Vec4; grb0: Vec4; grb1: Vec4; grbr: Vec4; grbg: Vec4; grbb: Vec4; grba: Vec4; gra0: Vec4; gra1: Vec4; grar: Vec4; grag: Vec4; grab: Vec4; graa: Vec4; gg00: Vec4; gg01: Vec4; gg0r: Vec4; gg0g: Vec4; gg0b: Vec4; gg0a: Vec4; gg10: Vec4; gg11: Vec4; gg1r: Vec4; gg1g: Vec4; gg1b: Vec4; gg1a: Vec4; ggr0: Vec4; ggr1: Vec4; ggrr: Vec4; ggrg: Vec4; ggrb: Vec4; ggra: Vec4; ggg0: Vec4; ggg1: Vec4; gggr: Vec4; gggg: Vec4; gggb: Vec4; ggga: Vec4; ggb0: Vec4; ggb1: Vec4; ggbr: Vec4; ggbg: Vec4; ggbb: Vec4; ggba: Vec4; gga0: Vec4; gga1: Vec4; ggar: Vec4; ggag: Vec4; ggab: Vec4; ggaa: Vec4; gb00: Vec4; gb01: Vec4; gb0r: Vec4; gb0g: Vec4; gb0b: Vec4; gb0a: Vec4; gb10: Vec4; gb11: Vec4; gb1r: Vec4; gb1g: Vec4; gb1b: Vec4; gb1a: Vec4; gbr0: Vec4; gbr1: Vec4; gbrr: Vec4; gbrg: Vec4; gbrb: Vec4; gbra: Vec4; gbg0: Vec4; gbg1: Vec4; gbgr: Vec4; gbgg: Vec4; gbgb: Vec4; gbga: Vec4; gbb0: Vec4; gbb1: Vec4; gbbr: Vec4; gbbg: Vec4; gbbb: Vec4; gbba: Vec4; gba0: Vec4; gba1: Vec4; gbar: Vec4; gbag: Vec4; gbab: Vec4; gbaa: Vec4; ga00: Vec4; ga01: Vec4; ga0r: Vec4; ga0g: Vec4; ga0b: Vec4; ga0a: Vec4; ga10: Vec4; ga11: Vec4; ga1r: Vec4; ga1g: Vec4; ga1b: Vec4; ga1a: Vec4; gar0: Vec4; gar1: Vec4; garr: Vec4; garg: Vec4; garb: Vec4; gara: Vec4; gag0: Vec4; gag1: Vec4; gagr: Vec4; gagg: Vec4; gagb: Vec4; gaga: Vec4; gab0: Vec4; gab1: Vec4; gabr: Vec4; gabg: Vec4; gabb: Vec4; gaba: Vec4; gaa0: Vec4; gaa1: Vec4; gaar: Vec4; gaag: Vec4; gaab: Vec4; gaaa: Vec4; b000: Vec4; b001: Vec4; b00r: Vec4; b00g: Vec4; b00b: Vec4; b00a: Vec4; b010: Vec4; b011: Vec4; b01r: Vec4; b01g: Vec4; b01b: Vec4; b01a: Vec4; b0r0: Vec4; b0r1: Vec4; b0rr: Vec4; b0rg: Vec4; b0rb: Vec4; b0ra: Vec4; b0g0: Vec4; b0g1: Vec4; b0gr: Vec4; b0gg: Vec4; b0gb: Vec4; b0ga: Vec4; b0b0: Vec4; b0b1: Vec4; b0br: Vec4; b0bg: Vec4; b0bb: Vec4; b0ba: Vec4; b0a0: Vec4; b0a1: Vec4; b0ar: Vec4; b0ag: Vec4; b0ab: Vec4; b0aa: Vec4; b100: Vec4; b101: Vec4; b10r: Vec4; b10g: Vec4; b10b: Vec4; b10a: Vec4; b110: Vec4; b111: Vec4; b11r: Vec4; b11g: Vec4; b11b: Vec4; b11a: Vec4; b1r0: Vec4; b1r1: Vec4; b1rr: Vec4; b1rg: Vec4; b1rb: Vec4; b1ra: Vec4; b1g0: Vec4; b1g1: Vec4; b1gr: Vec4; b1gg: Vec4; b1gb: Vec4; b1ga: Vec4; b1b0: Vec4; b1b1: Vec4; b1br: Vec4; b1bg: Vec4; b1bb: Vec4; b1ba: Vec4; b1a0: Vec4; b1a1: Vec4; b1ar: Vec4; b1ag: Vec4; b1ab: Vec4; b1aa: Vec4; br00: Vec4; br01: Vec4; br0r: Vec4; br0g: Vec4; br0b: Vec4; br0a: Vec4; br10: Vec4; br11: Vec4; br1r: Vec4; br1g: Vec4; br1b: Vec4; br1a: Vec4; brr0: Vec4; brr1: Vec4; brrr: Vec4; brrg: Vec4; brrb: Vec4; brra: Vec4; brg0: Vec4; brg1: Vec4; brgr: Vec4; brgg: Vec4; brgb: Vec4; brga: Vec4; brb0: Vec4; brb1: Vec4; brbr: Vec4; brbg: Vec4; brbb: Vec4; brba: Vec4; bra0: Vec4; bra1: Vec4; brar: Vec4; brag: Vec4; brab: Vec4; braa: Vec4; bg00: Vec4; bg01: Vec4; bg0r: Vec4; bg0g: Vec4; bg0b: Vec4; bg0a: Vec4; bg10: Vec4; bg11: Vec4; bg1r: Vec4; bg1g: Vec4; bg1b: Vec4; bg1a: Vec4; bgr0: Vec4; bgr1: Vec4; bgrr: Vec4; bgrg: Vec4; bgrb: Vec4; bgra: Vec4; bgg0: Vec4; bgg1: Vec4; bggr: Vec4; bggg: Vec4; bggb: Vec4; bgga: Vec4; bgb0: Vec4; bgb1: Vec4; bgbr: Vec4; bgbg: Vec4; bgbb: Vec4; bgba: Vec4; bga0: Vec4; bga1: Vec4; bgar: Vec4; bgag: Vec4; bgab: Vec4; bgaa: Vec4; bb00: Vec4; bb01: Vec4; bb0r: Vec4; bb0g: Vec4; bb0b: Vec4; bb0a: Vec4; bb10: Vec4; bb11: Vec4; bb1r: Vec4; bb1g: Vec4; bb1b: Vec4; bb1a: Vec4; bbr0: Vec4; bbr1: Vec4; bbrr: Vec4; bbrg: Vec4; bbrb: Vec4; bbra: Vec4; bbg0: Vec4; bbg1: Vec4; bbgr: Vec4; bbgg: Vec4; bbgb: Vec4; bbga: Vec4; bbb0: Vec4; bbb1: Vec4; bbbr: Vec4; bbbg: Vec4; bbbb: Vec4; bbba: Vec4; bba0: Vec4; bba1: Vec4; bbar: Vec4; bbag: Vec4; bbab: Vec4; bbaa: Vec4; ba00: Vec4; ba01: Vec4; ba0r: Vec4; ba0g: Vec4; ba0b: Vec4; ba0a: Vec4; ba10: Vec4; ba11: Vec4; ba1r: Vec4; ba1g: Vec4; ba1b: Vec4; ba1a: Vec4; bar0: Vec4; bar1: Vec4; barr: Vec4; barg: Vec4; barb: Vec4; bara: Vec4; bag0: Vec4; bag1: Vec4; bagr: Vec4; bagg: Vec4; bagb: Vec4; baga: Vec4; bab0: Vec4; bab1: Vec4; babr: Vec4; babg: Vec4; babb: Vec4; baba: Vec4; baa0: Vec4; baa1: Vec4; baar: Vec4; baag: Vec4; baab: Vec4; baaa: Vec4; a000: Vec4; a001: Vec4; a00r: Vec4; a00g: Vec4; a00b: Vec4; a00a: Vec4; a010: Vec4; a011: Vec4; a01r: Vec4; a01g: Vec4; a01b: Vec4; a01a: Vec4; a0r0: Vec4; a0r1: Vec4; a0rr: Vec4; a0rg: Vec4; a0rb: Vec4; a0ra: Vec4; a0g0: Vec4; a0g1: Vec4; a0gr: Vec4; a0gg: Vec4; a0gb: Vec4; a0ga: Vec4; a0b0: Vec4; a0b1: Vec4; a0br: Vec4; a0bg: Vec4; a0bb: Vec4; a0ba: Vec4; a0a0: Vec4; a0a1: Vec4; a0ar: Vec4; a0ag: Vec4; a0ab: Vec4; a0aa: Vec4; a100: Vec4; a101: Vec4; a10r: Vec4; a10g: Vec4; a10b: Vec4; a10a: Vec4; a110: Vec4; a111: Vec4; a11r: Vec4; a11g: Vec4; a11b: Vec4; a11a: Vec4; a1r0: Vec4; a1r1: Vec4; a1rr: Vec4; a1rg: Vec4; a1rb: Vec4; a1ra: Vec4; a1g0: Vec4; a1g1: Vec4; a1gr: Vec4; a1gg: Vec4; a1gb: Vec4; a1ga: Vec4; a1b0: Vec4; a1b1: Vec4; a1br: Vec4; a1bg: Vec4; a1bb: Vec4; a1ba: Vec4; a1a0: Vec4; a1a1: Vec4; a1ar: Vec4; a1ag: Vec4; a1ab: Vec4; a1aa: Vec4; ar00: Vec4; ar01: Vec4; ar0r: Vec4; ar0g: Vec4; ar0b: Vec4; ar0a: Vec4; ar10: Vec4; ar11: Vec4; ar1r: Vec4; ar1g: Vec4; ar1b: Vec4; ar1a: Vec4; arr0: Vec4; arr1: Vec4; arrr: Vec4; arrg: Vec4; arrb: Vec4; arra: Vec4; arg0: Vec4; arg1: Vec4; argr: Vec4; argg: Vec4; argb: Vec4; arga: Vec4; arb0: Vec4; arb1: Vec4; arbr: Vec4; arbg: Vec4; arbb: Vec4; arba: Vec4; ara0: Vec4; ara1: Vec4; arar: Vec4; arag: Vec4; arab: Vec4; araa: Vec4; ag00: Vec4; ag01: Vec4; ag0r: Vec4; ag0g: Vec4; ag0b: Vec4; ag0a: Vec4; ag10: Vec4; ag11: Vec4; ag1r: Vec4; ag1g: Vec4; ag1b: Vec4; ag1a: Vec4; agr0: Vec4; agr1: Vec4; agrr: Vec4; agrg: Vec4; agrb: Vec4; agra: Vec4; agg0: Vec4; agg1: Vec4; aggr: Vec4; aggg: Vec4; aggb: Vec4; agga: Vec4; agb0: Vec4; agb1: Vec4; agbr: Vec4; agbg: Vec4; agbb: Vec4; agba: Vec4; aga0: Vec4; aga1: Vec4; agar: Vec4; agag: Vec4; agab: Vec4; agaa: Vec4; ab00: Vec4; ab01: Vec4; ab0r: Vec4; ab0g: Vec4; ab0b: Vec4; ab0a: Vec4; ab10: Vec4; ab11: Vec4; ab1r: Vec4; ab1g: Vec4; ab1b: Vec4; ab1a: Vec4; abr0: Vec4; abr1: Vec4; abrr: Vec4; abrg: Vec4; abrb: Vec4; abra: Vec4; abg0: Vec4; abg1: Vec4; abgr: Vec4; abgg: Vec4; abgb: Vec4; abga: Vec4; abb0: Vec4; abb1: Vec4; abbr: Vec4; abbg: Vec4; abbb: Vec4; abba: Vec4; aba0: Vec4; aba1: Vec4; abar: Vec4; abag: Vec4; abab: Vec4; abaa: Vec4; aa00: Vec4; aa01: Vec4; aa0r: Vec4; aa0g: Vec4; aa0b: Vec4; aa0a: Vec4; aa10: Vec4; aa11: Vec4; aa1r: Vec4; aa1g: Vec4; aa1b: Vec4; aa1a: Vec4; aar0: Vec4; aar1: Vec4; aarr: Vec4; aarg: Vec4; aarb: Vec4; aara: Vec4; aag0: Vec4; aag1: Vec4; aagr: Vec4; aagg: Vec4; aagb: Vec4; aaga: Vec4; aab0: Vec4; aab1: Vec4; aabr: Vec4; aabg: Vec4; aabb: Vec4; aaba: Vec4; aaa0: Vec4; aaa1: Vec4; aaar: Vec4; aaag: Vec4; aaab: Vec4; aaaa: Vec4;
  s0: Vec2; s1: Vec2; ss: Vec2; st: Vec2; t0: Vec2; t1: Vec2; ts: Vec2; tt: Vec2; s00: Vec3; s01: Vec3; s0s: Vec3; s0t: Vec3; s0p: Vec3; s10: Vec3; s11: Vec3; s1s: Vec3; s1t: Vec3; s1p: Vec3; ss0: Vec3; ss1: Vec3; sss: Vec3; sst: Vec3; ssp: Vec3; st0: Vec3; st1: Vec3; sts: Vec3; stt: Vec3; stp: Vec3; sp0: Vec3; sp1: Vec3; sps: Vec3; spt: Vec3; spp: Vec3; t00: Vec3; t01: Vec3; t0s: Vec3; t0t: Vec3; t0p: Vec3; t10: Vec3; t11: Vec3; t1s: Vec3; t1t: Vec3; t1p: Vec3; ts0: Vec3; ts1: Vec3; tss: Vec3; tst: Vec3; tsp: Vec3; tt0: Vec3; tt1: Vec3; tts: Vec3; ttt: Vec3; ttp: Vec3; tp0: Vec3; tp1: Vec3; tps: Vec3; tpt: Vec3; tpp: Vec3; p00: Vec3; p01: Vec3; p0s: Vec3; p0t: Vec3; p0p: Vec3; p10: Vec3; p11: Vec3; p1s: Vec3; p1t: Vec3; p1p: Vec3; ps0: Vec3; ps1: Vec3; pss: Vec3; pst: Vec3; psp: Vec3; pt0: Vec3; pt1: Vec3; pts: Vec3; ptt: Vec3; ptp: Vec3; pp0: Vec3; pp1: Vec3; pps: Vec3; ppt: Vec3; ppp: Vec3; s000: Vec4; s001: Vec4; s00s: Vec4; s00t: Vec4; s00p: Vec4; s00q: Vec4; s010: Vec4; s011: Vec4; s01s: Vec4; s01t: Vec4; s01p: Vec4; s01q: Vec4; s0s0: Vec4; s0s1: Vec4; s0ss: Vec4; s0st: Vec4; s0sp: Vec4; s0sq: Vec4; s0t0: Vec4; s0t1: Vec4; s0ts: Vec4; s0tt: Vec4; s0tp: Vec4; s0tq: Vec4; s0p0: Vec4; s0p1: Vec4; s0ps: Vec4; s0pt: Vec4; s0pp: Vec4; s0pq: Vec4; s0q0: Vec4; s0q1: Vec4; s0qs: Vec4; s0qt: Vec4; s0qp: Vec4; s0qq: Vec4; s100: Vec4; s101: Vec4; s10s: Vec4; s10t: Vec4; s10p: Vec4; s10q: Vec4; s110: Vec4; s111: Vec4; s11s: Vec4; s11t: Vec4; s11p: Vec4; s11q: Vec4; s1s0: Vec4; s1s1: Vec4; s1ss: Vec4; s1st: Vec4; s1sp: Vec4; s1sq: Vec4; s1t0: Vec4; s1t1: Vec4; s1ts: Vec4; s1tt: Vec4; s1tp: Vec4; s1tq: Vec4; s1p0: Vec4; s1p1: Vec4; s1ps: Vec4; s1pt: Vec4; s1pp: Vec4; s1pq: Vec4; s1q0: Vec4; s1q1: Vec4; s1qs: Vec4; s1qt: Vec4; s1qp: Vec4; s1qq: Vec4; ss00: Vec4; ss01: Vec4; ss0s: Vec4; ss0t: Vec4; ss0p: Vec4; ss0q: Vec4; ss10: Vec4; ss11: Vec4; ss1s: Vec4; ss1t: Vec4; ss1p: Vec4; ss1q: Vec4; sss0: Vec4; sss1: Vec4; ssss: Vec4; ssst: Vec4; sssp: Vec4; sssq: Vec4; sst0: Vec4; sst1: Vec4; ssts: Vec4; sstt: Vec4; sstp: Vec4; sstq: Vec4; ssp0: Vec4; ssp1: Vec4; ssps: Vec4; sspt: Vec4; sspp: Vec4; sspq: Vec4; ssq0: Vec4; ssq1: Vec4; ssqs: Vec4; ssqt: Vec4; ssqp: Vec4; ssqq: Vec4; st00: Vec4; st01: Vec4; st0s: Vec4; st0t: Vec4; st0p: Vec4; st0q: Vec4; st10: Vec4; st11: Vec4; st1s: Vec4; st1t: Vec4; st1p: Vec4; st1q: Vec4; sts0: Vec4; sts1: Vec4; stss: Vec4; stst: Vec4; stsp: Vec4; stsq: Vec4; stt0: Vec4; stt1: Vec4; stts: Vec4; sttt: Vec4; sttp: Vec4; sttq: Vec4; stp0: Vec4; stp1: Vec4; stps: Vec4; stpt: Vec4; stpp: Vec4; stpq: Vec4; stq0: Vec4; stq1: Vec4; stqs: Vec4; stqt: Vec4; stqp: Vec4; stqq: Vec4; sp00: Vec4; sp01: Vec4; sp0s: Vec4; sp0t: Vec4; sp0p: Vec4; sp0q: Vec4; sp10: Vec4; sp11: Vec4; sp1s: Vec4; sp1t: Vec4; sp1p: Vec4; sp1q: Vec4; sps0: Vec4; sps1: Vec4; spss: Vec4; spst: Vec4; spsp: Vec4; spsq: Vec4; spt0: Vec4; spt1: Vec4; spts: Vec4; sptt: Vec4; sptp: Vec4; sptq: Vec4; spp0: Vec4; spp1: Vec4; spps: Vec4; sppt: Vec4; sppp: Vec4; sppq: Vec4; spq0: Vec4; spq1: Vec4; spqs: Vec4; spqt: Vec4; spqp: Vec4; spqq: Vec4; sq00: Vec4; sq01: Vec4; sq0s: Vec4; sq0t: Vec4; sq0p: Vec4; sq0q: Vec4; sq10: Vec4; sq11: Vec4; sq1s: Vec4; sq1t: Vec4; sq1p: Vec4; sq1q: Vec4; sqs0: Vec4; sqs1: Vec4; sqss: Vec4; sqst: Vec4; sqsp: Vec4; sqsq: Vec4; sqt0: Vec4; sqt1: Vec4; sqts: Vec4; sqtt: Vec4; sqtp: Vec4; sqtq: Vec4; sqp0: Vec4; sqp1: Vec4; sqps: Vec4; sqpt: Vec4; sqpp: Vec4; sqpq: Vec4; sqq0: Vec4; sqq1: Vec4; sqqs: Vec4; sqqt: Vec4; sqqp: Vec4; sqqq: Vec4; t000: Vec4; t001: Vec4; t00s: Vec4; t00t: Vec4; t00p: Vec4; t00q: Vec4; t010: Vec4; t011: Vec4; t01s: Vec4; t01t: Vec4; t01p: Vec4; t01q: Vec4; t0s0: Vec4; t0s1: Vec4; t0ss: Vec4; t0st: Vec4; t0sp: Vec4; t0sq: Vec4; t0t0: Vec4; t0t1: Vec4; t0ts: Vec4; t0tt: Vec4; t0tp: Vec4; t0tq: Vec4; t0p0: Vec4; t0p1: Vec4; t0ps: Vec4; t0pt: Vec4; t0pp: Vec4; t0pq: Vec4; t0q0: Vec4; t0q1: Vec4; t0qs: Vec4; t0qt: Vec4; t0qp: Vec4; t0qq: Vec4; t100: Vec4; t101: Vec4; t10s: Vec4; t10t: Vec4; t10p: Vec4; t10q: Vec4; t110: Vec4; t111: Vec4; t11s: Vec4; t11t: Vec4; t11p: Vec4; t11q: Vec4; t1s0: Vec4; t1s1: Vec4; t1ss: Vec4; t1st: Vec4; t1sp: Vec4; t1sq: Vec4; t1t0: Vec4; t1t1: Vec4; t1ts: Vec4; t1tt: Vec4; t1tp: Vec4; t1tq: Vec4; t1p0: Vec4; t1p1: Vec4; t1ps: Vec4; t1pt: Vec4; t1pp: Vec4; t1pq: Vec4; t1q0: Vec4; t1q1: Vec4; t1qs: Vec4; t1qt: Vec4; t1qp: Vec4; t1qq: Vec4; ts00: Vec4; ts01: Vec4; ts0s: Vec4; ts0t: Vec4; ts0p: Vec4; ts0q: Vec4; ts10: Vec4; ts11: Vec4; ts1s: Vec4; ts1t: Vec4; ts1p: Vec4; ts1q: Vec4; tss0: Vec4; tss1: Vec4; tsss: Vec4; tsst: Vec4; tssp: Vec4; tssq: Vec4; tst0: Vec4; tst1: Vec4; tsts: Vec4; tstt: Vec4; tstp: Vec4; tstq: Vec4; tsp0: Vec4; tsp1: Vec4; tsps: Vec4; tspt: Vec4; tspp: Vec4; tspq: Vec4; tsq0: Vec4; tsq1: Vec4; tsqs: Vec4; tsqt: Vec4; tsqp: Vec4; tsqq: Vec4; tt00: Vec4; tt01: Vec4; tt0s: Vec4; tt0t: Vec4; tt0p: Vec4; tt0q: Vec4; tt10: Vec4; tt11: Vec4; tt1s: Vec4; tt1t: Vec4; tt1p: Vec4; tt1q: Vec4; tts0: Vec4; tts1: Vec4; ttss: Vec4; ttst: Vec4; ttsp: Vec4; ttsq: Vec4; ttt0: Vec4; ttt1: Vec4; ttts: Vec4; tttt: Vec4; tttp: Vec4; tttq: Vec4; ttp0: Vec4; ttp1: Vec4; ttps: Vec4; ttpt: Vec4; ttpp: Vec4; ttpq: Vec4; ttq0: Vec4; ttq1: Vec4; ttqs: Vec4; ttqt: Vec4; ttqp: Vec4; ttqq: Vec4; tp00: Vec4; tp01: Vec4; tp0s: Vec4; tp0t: Vec4; tp0p: Vec4; tp0q: Vec4; tp10: Vec4; tp11: Vec4; tp1s: Vec4; tp1t: Vec4; tp1p: Vec4; tp1q: Vec4; tps0: Vec4; tps1: Vec4; tpss: Vec4; tpst: Vec4; tpsp: Vec4; tpsq: Vec4; tpt0: Vec4; tpt1: Vec4; tpts: Vec4; tptt: Vec4; tptp: Vec4; tptq: Vec4; tpp0: Vec4; tpp1: Vec4; tpps: Vec4; tppt: Vec4; tppp: Vec4; tppq: Vec4; tpq0: Vec4; tpq1: Vec4; tpqs: Vec4; tpqt: Vec4; tpqp: Vec4; tpqq: Vec4; tq00: Vec4; tq01: Vec4; tq0s: Vec4; tq0t: Vec4; tq0p: Vec4; tq0q: Vec4; tq10: Vec4; tq11: Vec4; tq1s: Vec4; tq1t: Vec4; tq1p: Vec4; tq1q: Vec4; tqs0: Vec4; tqs1: Vec4; tqss: Vec4; tqst: Vec4; tqsp: Vec4; tqsq: Vec4; tqt0: Vec4; tqt1: Vec4; tqts: Vec4; tqtt: Vec4; tqtp: Vec4; tqtq: Vec4; tqp0: Vec4; tqp1: Vec4; tqps: Vec4; tqpt: Vec4; tqpp: Vec4; tqpq: Vec4; tqq0: Vec4; tqq1: Vec4; tqqs: Vec4; tqqt: Vec4; tqqp: Vec4; tqqq: Vec4; p000: Vec4; p001: Vec4; p00s: Vec4; p00t: Vec4; p00p: Vec4; p00q: Vec4; p010: Vec4; p011: Vec4; p01s: Vec4; p01t: Vec4; p01p: Vec4; p01q: Vec4; p0s0: Vec4; p0s1: Vec4; p0ss: Vec4; p0st: Vec4; p0sp: Vec4; p0sq: Vec4; p0t0: Vec4; p0t1: Vec4; p0ts: Vec4; p0tt: Vec4; p0tp: Vec4; p0tq: Vec4; p0p0: Vec4; p0p1: Vec4; p0ps: Vec4; p0pt: Vec4; p0pp: Vec4; p0pq: Vec4; p0q0: Vec4; p0q1: Vec4; p0qs: Vec4; p0qt: Vec4; p0qp: Vec4; p0qq: Vec4; p100: Vec4; p101: Vec4; p10s: Vec4; p10t: Vec4; p10p: Vec4; p10q: Vec4; p110: Vec4; p111: Vec4; p11s: Vec4; p11t: Vec4; p11p: Vec4; p11q: Vec4; p1s0: Vec4; p1s1: Vec4; p1ss: Vec4; p1st: Vec4; p1sp: Vec4; p1sq: Vec4; p1t0: Vec4; p1t1: Vec4; p1ts: Vec4; p1tt: Vec4; p1tp: Vec4; p1tq: Vec4; p1p0: Vec4; p1p1: Vec4; p1ps: Vec4; p1pt: Vec4; p1pp: Vec4; p1pq: Vec4; p1q0: Vec4; p1q1: Vec4; p1qs: Vec4; p1qt: Vec4; p1qp: Vec4; p1qq: Vec4; ps00: Vec4; ps01: Vec4; ps0s: Vec4; ps0t: Vec4; ps0p: Vec4; ps0q: Vec4; ps10: Vec4; ps11: Vec4; ps1s: Vec4; ps1t: Vec4; ps1p: Vec4; ps1q: Vec4; pss0: Vec4; pss1: Vec4; psss: Vec4; psst: Vec4; pssp: Vec4; pssq: Vec4; pst0: Vec4; pst1: Vec4; psts: Vec4; pstt: Vec4; pstp: Vec4; pstq: Vec4; psp0: Vec4; psp1: Vec4; psps: Vec4; pspt: Vec4; pspp: Vec4; pspq: Vec4; psq0: Vec4; psq1: Vec4; psqs: Vec4; psqt: Vec4; psqp: Vec4; psqq: Vec4; pt00: Vec4; pt01: Vec4; pt0s: Vec4; pt0t: Vec4; pt0p: Vec4; pt0q: Vec4; pt10: Vec4; pt11: Vec4; pt1s: Vec4; pt1t: Vec4; pt1p: Vec4; pt1q: Vec4; pts0: Vec4; pts1: Vec4; ptss: Vec4; ptst: Vec4; ptsp: Vec4; ptsq: Vec4; ptt0: Vec4; ptt1: Vec4; ptts: Vec4; pttt: Vec4; pttp: Vec4; pttq: Vec4; ptp0: Vec4; ptp1: Vec4; ptps: Vec4; ptpt: Vec4; ptpp: Vec4; ptpq: Vec4; ptq0: Vec4; ptq1: Vec4; ptqs: Vec4; ptqt: Vec4; ptqp: Vec4; ptqq: Vec4; pp00: Vec4; pp01: Vec4; pp0s: Vec4; pp0t: Vec4; pp0p: Vec4; pp0q: Vec4; pp10: Vec4; pp11: Vec4; pp1s: Vec4; pp1t: Vec4; pp1p: Vec4; pp1q: Vec4; pps0: Vec4; pps1: Vec4; ppss: Vec4; ppst: Vec4; ppsp: Vec4; ppsq: Vec4; ppt0: Vec4; ppt1: Vec4; ppts: Vec4; pptt: Vec4; pptp: Vec4; pptq: Vec4; ppp0: Vec4; ppp1: Vec4; ppps: Vec4; pppt: Vec4; pppp: Vec4; pppq: Vec4; ppq0: Vec4; ppq1: Vec4; ppqs: Vec4; ppqt: Vec4; ppqp: Vec4; ppqq: Vec4; pq00: Vec4; pq01: Vec4; pq0s: Vec4; pq0t: Vec4; pq0p: Vec4; pq0q: Vec4; pq10: Vec4; pq11: Vec4; pq1s: Vec4; pq1t: Vec4; pq1p: Vec4; pq1q: Vec4; pqs0: Vec4; pqs1: Vec4; pqss: Vec4; pqst: Vec4; pqsp: Vec4; pqsq: Vec4; pqt0: Vec4; pqt1: Vec4; pqts: Vec4; pqtt: Vec4; pqtp: Vec4; pqtq: Vec4; pqp0: Vec4; pqp1: Vec4; pqps: Vec4; pqpt: Vec4; pqpp: Vec4; pqpq: Vec4; pqq0: Vec4; pqq1: Vec4; pqqs: Vec4; pqqt: Vec4; pqqp: Vec4; pqqq: Vec4; q000: Vec4; q001: Vec4; q00s: Vec4; q00t: Vec4; q00p: Vec4; q00q: Vec4; q010: Vec4; q011: Vec4; q01s: Vec4; q01t: Vec4; q01p: Vec4; q01q: Vec4; q0s0: Vec4; q0s1: Vec4; q0ss: Vec4; q0st: Vec4; q0sp: Vec4; q0sq: Vec4; q0t0: Vec4; q0t1: Vec4; q0ts: Vec4; q0tt: Vec4; q0tp: Vec4; q0tq: Vec4; q0p0: Vec4; q0p1: Vec4; q0ps: Vec4; q0pt: Vec4; q0pp: Vec4; q0pq: Vec4; q0q0: Vec4; q0q1: Vec4; q0qs: Vec4; q0qt: Vec4; q0qp: Vec4; q0qq: Vec4; q100: Vec4; q101: Vec4; q10s: Vec4; q10t: Vec4; q10p: Vec4; q10q: Vec4; q110: Vec4; q111: Vec4; q11s: Vec4; q11t: Vec4; q11p: Vec4; q11q: Vec4; q1s0: Vec4; q1s1: Vec4; q1ss: Vec4; q1st: Vec4; q1sp: Vec4; q1sq: Vec4; q1t0: Vec4; q1t1: Vec4; q1ts: Vec4; q1tt: Vec4; q1tp: Vec4; q1tq: Vec4; q1p0: Vec4; q1p1: Vec4; q1ps: Vec4; q1pt: Vec4; q1pp: Vec4; q1pq: Vec4; q1q0: Vec4; q1q1: Vec4; q1qs: Vec4; q1qt: Vec4; q1qp: Vec4; q1qq: Vec4; qs00: Vec4; qs01: Vec4; qs0s: Vec4; qs0t: Vec4; qs0p: Vec4; qs0q: Vec4; qs10: Vec4; qs11: Vec4; qs1s: Vec4; qs1t: Vec4; qs1p: Vec4; qs1q: Vec4; qss0: Vec4; qss1: Vec4; qsss: Vec4; qsst: Vec4; qssp: Vec4; qssq: Vec4; qst0: Vec4; qst1: Vec4; qsts: Vec4; qstt: Vec4; qstp: Vec4; qstq: Vec4; qsp0: Vec4; qsp1: Vec4; qsps: Vec4; qspt: Vec4; qspp: Vec4; qspq: Vec4; qsq0: Vec4; qsq1: Vec4; qsqs: Vec4; qsqt: Vec4; qsqp: Vec4; qsqq: Vec4; qt00: Vec4; qt01: Vec4; qt0s: Vec4; qt0t: Vec4; qt0p: Vec4; qt0q: Vec4; qt10: Vec4; qt11: Vec4; qt1s: Vec4; qt1t: Vec4; qt1p: Vec4; qt1q: Vec4; qts0: Vec4; qts1: Vec4; qtss: Vec4; qtst: Vec4; qtsp: Vec4; qtsq: Vec4; qtt0: Vec4; qtt1: Vec4; qtts: Vec4; qttt: Vec4; qttp: Vec4; qttq: Vec4; qtp0: Vec4; qtp1: Vec4; qtps: Vec4; qtpt: Vec4; qtpp: Vec4; qtpq: Vec4; qtq0: Vec4; qtq1: Vec4; qtqs: Vec4; qtqt: Vec4; qtqp: Vec4; qtqq: Vec4; qp00: Vec4; qp01: Vec4; qp0s: Vec4; qp0t: Vec4; qp0p: Vec4; qp0q: Vec4; qp10: Vec4; qp11: Vec4; qp1s: Vec4; qp1t: Vec4; qp1p: Vec4; qp1q: Vec4; qps0: Vec4; qps1: Vec4; qpss: Vec4; qpst: Vec4; qpsp: Vec4; qpsq: Vec4; qpt0: Vec4; qpt1: Vec4; qpts: Vec4; qptt: Vec4; qptp: Vec4; qptq: Vec4; qpp0: Vec4; qpp1: Vec4; qpps: Vec4; qppt: Vec4; qppp: Vec4; qppq: Vec4; qpq0: Vec4; qpq1: Vec4; qpqs: Vec4; qpqt: Vec4; qpqp: Vec4; qpqq: Vec4; qq00: Vec4; qq01: Vec4; qq0s: Vec4; qq0t: Vec4; qq0p: Vec4; qq0q: Vec4; qq10: Vec4; qq11: Vec4; qq1s: Vec4; qq1t: Vec4; qq1p: Vec4; qq1q: Vec4; qqs0: Vec4; qqs1: Vec4; qqss: Vec4; qqst: Vec4; qqsp: Vec4; qqsq: Vec4; qqt0: Vec4; qqt1: Vec4; qqts: Vec4; qqtt: Vec4; qqtp: Vec4; qqtq: Vec4; qqp0: Vec4; qqp1: Vec4; qqps: Vec4; qqpt: Vec4; qqpp: Vec4; qqpq: Vec4; qqq0: Vec4; qqq1: Vec4; qqqs: Vec4; qqqt: Vec4; qqqp: Vec4; qqqq: Vec4;
  u0: Vec2; u1: Vec2; uu: Vec2; uv: Vec2; v0: Vec2; v1: Vec2; vu: Vec2; vv: Vec2; u00: Vec3; u01: Vec3; u0u: Vec3; u0v: Vec3; u10: Vec3; u11: Vec3; u1u: Vec3; u1v: Vec3; uu0: Vec3; uu1: Vec3; uuu: Vec3; uuv: Vec3; uv0: Vec3; uv1: Vec3; uvu: Vec3; uvv: Vec3; v00: Vec3; v01: Vec3; v0u: Vec3; v0v: Vec3; v10: Vec3; v11: Vec3; v1u: Vec3; v1v: Vec3; vu0: Vec3; vu1: Vec3; vuu: Vec3; vuv: Vec3; vv0: Vec3; vv1: Vec3; vvu: Vec3; vvv: Vec3; u000: Vec4; u001: Vec4; u00u: Vec4; u00v: Vec4; u010: Vec4; u011: Vec4; u01u: Vec4; u01v: Vec4; u0u0: Vec4; u0u1: Vec4; u0uu: Vec4; u0uv: Vec4; u0v0: Vec4; u0v1: Vec4; u0vu: Vec4; u0vv: Vec4; u100: Vec4; u101: Vec4; u10u: Vec4; u10v: Vec4; u110: Vec4; u111: Vec4; u11u: Vec4; u11v: Vec4; u1u0: Vec4; u1u1: Vec4; u1uu: Vec4; u1uv: Vec4; u1v0: Vec4; u1v1: Vec4; u1vu: Vec4; u1vv: Vec4; uu00: Vec4; uu01: Vec4; uu0u: Vec4; uu0v: Vec4; uu10: Vec4; uu11: Vec4; uu1u: Vec4; uu1v: Vec4; uuu0: Vec4; uuu1: Vec4; uuuu: Vec4; uuuv: Vec4; uuv0: Vec4; uuv1: Vec4; uuvu: Vec4; uuvv: Vec4; uv00: Vec4; uv01: Vec4; uv0u: Vec4; uv0v: Vec4; uv10: Vec4; uv11: Vec4; uv1u: Vec4; uv1v: Vec4; uvu0: Vec4; uvu1: Vec4; uvuu: Vec4; uvuv: Vec4; uvv0: Vec4; uvv1: Vec4; uvvu: Vec4; uvvv: Vec4; v000: Vec4; v001: Vec4; v00u: Vec4; v00v: Vec4; v010: Vec4; v011: Vec4; v01u: Vec4; v01v: Vec4; v0u0: Vec4; v0u1: Vec4; v0uu: Vec4; v0uv: Vec4; v0v0: Vec4; v0v1: Vec4; v0vu: Vec4; v0vv: Vec4; v100: Vec4; v101: Vec4; v10u: Vec4; v10v: Vec4; v110: Vec4; v111: Vec4; v11u: Vec4; v11v: Vec4; v1u0: Vec4; v1u1: Vec4; v1uu: Vec4; v1uv: Vec4; v1v0: Vec4; v1v1: Vec4; v1vu: Vec4; v1vv: Vec4; vu00: Vec4; vu01: Vec4; vu0u: Vec4; vu0v: Vec4; vu10: Vec4; vu11: Vec4; vu1u: Vec4; vu1v: Vec4; vuu0: Vec4; vuu1: Vec4; vuuu: Vec4; vuuv: Vec4; vuv0: Vec4; vuv1: Vec4; vuvu: Vec4; vuvv: Vec4; vv00: Vec4; vv01: Vec4; vv0u: Vec4; vv0v: Vec4; vv10: Vec4; vv11: Vec4; vv1u: Vec4; vv1v: Vec4; vvu0: Vec4; vvu1: Vec4; vvuu: Vec4; vvuv: Vec4; vvv0: Vec4; vvv1: Vec4; vvvu: Vec4; vvvv: Vec4;
}
defineSwizzles(Vec3.prototype, 3)

// @aliases
Vec3.dist = Vec3.distance
Vec3.sqrDist = Vec3.squaredDistance
Vec3.prototype.add = Vec3.prototype.plus
Vec3.prototype.sub = Vec3.prototype.minus
Vec3.prototype.subtract = Vec3.prototype.minus
Vec3.prototype.mul = Vec3.prototype.mult
Vec3.prototype.scale = Vec3.prototype.mult
Vec3.prototype.multiply = Vec3.prototype.mult
Vec3.prototype.times = Vec3.prototype.mult
Vec3.prototype.divide = Vec3.prototype.div
Vec3.prototype.neg = Vec3.prototype.negate
Vec3.prototype.unaryMinus = Vec3.prototype.negate
Vec3.prototype.sqrLen = Vec3.prototype.squaredLength
Vec3.prototype.str = Vec3.prototype.toString
Vec3.prototype.normalized = Vec3.prototype.normalize
Vec3.prototype.transformMat3x3 = Vec3.prototype.transformMat3
Vec3.prototype.transformMat4x4 = Vec3.prototype.transformMat4

const createVec3 = (...args: (number | Float32Array)[]): Vec3 => {
  const out = new Vec3()
  let i = 0
  for (const a of args) {
    if (typeof a === 'number') out[i++] = a
    else for (const v of a)    out[i++] = v
  }
  if (i == 1) out[1] = out[2] = out[0]
  return out
}
Object.setPrototypeOf(createVec3, Vec3)
export const vec3 = createVec3 as typeof createVec3 & typeof Vec3