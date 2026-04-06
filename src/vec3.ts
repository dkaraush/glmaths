import glmaths from '.'
import { create, equals } from './internalUtils'
import { defineSwizzles, Vec3Swizzles } from './swizzles'
import { Vec2, Vec2d, Vec2i, Vec2u } from './vec2'
import { Vec4, Vec4d, Vec4i, Vec4u } from './vec4'
import { Mat3Like } from './mat3'
import { Mat4Like } from './mat4'
import { QuatLike } from './quat'

export type Vec3Like = Vec3 | Vec3d | Vec3i | Vec3u
export const isVec3Like = (a: any): a is Vec3Like =>
  a?.length === 3

/**
 * 3 Dimensional Vector of 32-bit floats
 * @extends Float32Array
 */
export class Vec3 extends Float32Array {

  static get zero() { return new this.prototype.vec3(0, 0, 0) }
  static get Zero() { return new this.prototype.vec3(0, 0, 0) }
  static get ZERO() { return new this.prototype.vec3(0, 0, 0) }
  static get one()  { return new this.prototype.vec3(1, 1, 1) }
  static get One()  { return new this.prototype.vec3(1, 1, 1) }
  static get ONE()  { return new this.prototype.vec3(1, 1, 1) }

  static get unitX() { return new this.prototype.vec3(1, 0, 0) }
  static get UnitX() { return new this.prototype.vec3(1, 0, 0) }
  static get unitY() { return new this.prototype.vec3(0, 1, 0) }
  static get UnitY() { return new this.prototype.vec3(0, 1, 0) }
  static get unitZ() { return new this.prototype.vec3(0, 0, 1) }
  static get UnitZ() { return new this.prototype.vec3(0, 0, 1) }

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
   * @param {Number | Vec3Like} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  plus<Out extends Vec3Like = Vec3>(
    b: number | Vec3Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Number | Vec3Like} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  minus<Out extends Vec3Like = Vec3>(
    b: number | Vec3Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Number | Vec3Like} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  mult<Out extends Vec3Like = Vec3>(
    b: number | Vec3Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Number | Vec3Like} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  div<Out extends Vec3Like = Vec3>(
    b: number | Vec3Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  invDiv<Out extends Vec3Like = Vec3>(
    b: number | Vec3Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  negate<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
    out[0] = -this[0]
    out[1] = -this[1]
    out[2] = -this[2]
    return out
  }
  unaryPlus<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like} v the vector to normalize
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static normalize<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
  normalize<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like} b the second operand
   * @returns {Boolean} true if the vectors are approximately equal
   */
  equals(b: Vec3Like) {
    return (
      equals(this[0], b[0]) &&
      equals(this[1], b[1]) &&
      equals(this[2], b[2])
    )
  }

  /**
   * Returns whether or not the vectors have exactly equal components
   *
   * @param {Vec3Like} b the second operand
   * @returns {Boolean} true if the vectors are exactly equal
   */
  exactEquals(b: Vec3Like) {
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
   * @param {Vec3Like} v the vector to floor
   * @returns {Vec3} a new floored vector
   */
  static floor<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    out[0] = Math.floor(v[0])
    out[1] = Math.floor(v[1])
    out[2] = Math.floor(v[2])
    return out
  }
  /**
   * Returns vec3 with each component rounded
   *
   * @param {Vec3Like} v the vector to round
   * @returns {Vec3} a new rounded vector
   */
  static round<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    out[0] = Math.round(v[0])
    out[1] = Math.round(v[1])
    out[2] = Math.round(v[2])
    return out
  }
  /**
   * Returns vec3 with each component ceiled
   *
   * @param {Vec3Like} v the vector to ceil
   * @returns {Vec3} a new ceiled vector
   */
  static ceil<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
  floor<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  round<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  ceil<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
    out[0] = Math.ceil(this[0])
    out[1] = Math.ceil(this[1])
    out[2] = Math.ceil(this[2])
    return out
  }

  /**
   * Returns the inverse of vec3
   *
   * @param {Vec3Like} v the source vector
   * @returns {Vec3} a new inverted vector
   */
  static inverse<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
  inverse<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
    return new this.vec3(this[0], this[1], this[2])
  }

  /**
   * Returns a string representation of a vector
   *
   * @returns {String} string representation of the vector
   */
  toString(): string {
    return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]})`
  }

  /**
   * Generates a random vector with the given scale
   *
   * @param {Number} scale length of the resulting vector, defaults to 1.0
   * @param {Vec3} out the receiving vector, defaults to new Vec3()
   * @returns {Vec3} out vector
   */
  static random<Out extends Vec3Like = Vec3>(
    scale = 1.0,
    out: Out = new this.prototype.vec3() as Out
  ) {
    const r = glmaths.RANDOM() * 2.0 * Math.PI
    const z = glmaths.RANDOM() * 2.0 - 1.0
    const zScale = Math.sqrt(1.0 - z * z) * scale
    out[0] = Math.cos(r) * zScale
    out[1] = Math.sin(r) * zScale
    out[2] = z * scale
    return out
  }

  /**
   * Calculates the angle between two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @returns {Number} the angle in radians
   */
  static angle(a: Vec3Like, b: Vec3Like) {
    const ax = a[0], ay = a[1], az = a[2]
    const bx = b[0], by = b[1], bz = b[2]
    const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz))
    const cosine = mag && Vec3.dot(a, b) / mag
    return Math.acos(Math.min(Math.max(cosine, -1), 1))
  }

  /**
   * Calculates the dot product of two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @returns {Number} dot product of a and b
   */
  static dot(a: Vec3Like, b: Vec3Like) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  }
  /**
   * Calculates the dot product of this vec3 with b
   *
   * @param {Vec3Like} b the second operand
   * @returns {Number} dot product
   */
  dot(b: Vec3Like) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2]
  }

  /**
   * Computes the cross product of two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static cross<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @returns {Number} distance between a and b
   */
  static distance(a: Vec3Like, b: Vec3Like) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    const z = a[2] - b[2]
    return Math.sqrt(x * x + y * y + z * z)
  }
  static dist: (a: Vec3Like, b: Vec3Like) => number

  /**
   * Calculates the squared euclidian distance between two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @returns {Number} squared distance between a and b
   */
  static squaredDistance(a: Vec3Like, b: Vec3Like) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    const z = a[2] - b[2]
    return x * x + y * y + z * z
  }
  static sqrDist: (a: Vec3Like, b: Vec3Like) => number

  /**
   * Performs a linear interpolation between two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static lerp<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    t: number,
    out: Out = new this.prototype.vec3() as Out
  ) {
    const ax = a[0], ay = a[1], az = a[2]
    out[0] = ax + (b[0] - ax) * t
    out[1] = ay + (b[1] - ay) * t
    out[2] = az + (b[2] - az) * t
    return out
  }
  /**
   * Performs a spherical linear interpolation between two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static slerp<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    t: number,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @returns {Vec3} a new vector with the max components
   */
  static max<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    out[2] = Math.max(a[2], b[2])
    return out
  }
  /**
   * Returns the minimum of two vec3's
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @returns {Vec3} a new vector with the min components
   */
  static min<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    out[2] = Math.min(a[2], b[2])
    return out
  }

  /**
   * Clamps each component of v between min and max.
   *
   * @param {Vec3Like} v the vector to clamp
   * @param {Vec3Like | number} min the lower bound (per-component or scalar)
   * @param {Vec3Like | number} max the upper bound (per-component or scalar)
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} out
   */
  static clamp<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    min: Vec3Like | number,
    max: Vec3Like | number,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Vec3Like | number} t interpolation amount (per-component or scalar)
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} out
   */
  static mix<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    t: Vec3Like | number,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like | number} edge0 the lower edge (per-component or scalar)
   * @param {Vec3Like | number} edge1 the upper edge (per-component or scalar)
   * @param {Vec3Like} v the source vector
   * @param {Vec3} out the receiving vector
   * @returns {Vec3} out
   */
  static smoothstep<Out extends Vec3Like = Vec3>(
    edge0: Vec3Like | number,
    edge1: Vec3Like | number,
    v: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} v the vector to rotate
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   * @returns {Vec3} a new rotated vector
   */
  static rotateX<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    rad: number,
    origin: Vec3Like = Vec3.zero,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   * @returns {Vec3} a rotated vector
   */
  rotateX<Out extends Vec3Like = Vec3>(
    rad: number,
    origin: Vec3Like = Vec3.zero,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like} v the vector to rotate
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   * @returns {Vec3} a rotated vector
   */
  static rotateY<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    rad: number,
    origin: Vec3Like = Vec3.zero,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   */
  rotateY<Out extends Vec3Like = Vec3>(
    rad: number,
    origin: Vec3Like = Vec3.zero,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like} v the vector to rotate
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec3Like} origin the origin of the rotation, defaults to ZERO
   * @returns {Vec3} a new rotated vector
   */
  static rotateZ<Out extends Vec3Like = Vec3>(
    v: Vec3Like,
    rad: number,
    origin: Vec3Like = Vec3.zero,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
   */
  rotateZ<Out extends Vec3Like = Vec3>(
    rad: number,
    origin: Vec3Like = Vec3.zero,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Vec3Like} c the third operand
   * @param {Vec3Like} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {Vec3} a new vector
   */
  static hermite<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    c: Vec3Like,
    d: Vec3Like,
    t: number,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Vec3Like} c the third operand
   * @param {Vec3Like} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {Vec3} a new vector
   */
  static bezier<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    c: Vec3Like,
    d: Vec3Like,
    t: number,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static scaleAndAdd<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    scale: number,
    out: Out = new this.prototype.vec3() as Out
  ) {
    out[0] = a[0] + b[0] * scale
    out[1] = a[1] + b[1] * scale
    out[2] = a[2] + b[2] * scale
    return out
  }

  /**
   * Reflects a vector off a surface with the given normal
   *
   * @param {Vec3Like} I the incident vector
   * @param {Vec3Like} N the surface normal
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static reflect<Out extends Vec3Like = Vec3>(
    I: Vec3Like,
    N: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    const d = Vec3.dot(N, I) * 2
    out[0] = I[0] - d * N[0]; out[1] = I[1] - d * N[1]; out[2] = I[2] - d * N[2]
    return out
  }

  /**
   * Refracts a vector through a surface with the given normal and index of refraction ratio (Snell's law)
   *
   * @param {Vec3Like} I the incident vector
   * @param {Vec3Like} N the surface normal
   * @param {Number} eta the ratio of indices of refraction
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static refract<Out extends Vec3Like = Vec3>(
    I: Vec3Like,
    N: Vec3Like,
    eta: number,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} N the vector to orient
   * @param {Vec3Like} I the incident vector
   * @param {Vec3Like} Nref the reference vector
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static faceforward<Out extends Vec3Like = Vec3>(
    N: Vec3Like,
    I: Vec3Like,
    Nref: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    const d = Vec3.dot(Nref, I)
    const sign = d < 0 ? 1 : -1
    out[0] = N[0] * sign; out[1] = N[1] * sign; out[2] = N[2] * sign
    return out
  }

  /**
   * Computes the normalized normal of a triangle defined by three points
   *
   * @param {Vec3Like} p1 the first vertex
   * @param {Vec3Like} p2 the second vertex
   * @param {Vec3Like} p3 the third vertex
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static triangleNormal<Out extends Vec3Like = Vec3>(
    p1: Vec3Like,
    p2: Vec3Like,
    p3: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
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
   * @param {Vec3Like} a the vector to project
   * @param {Vec3Like} b the vector to project onto
   * @param {Vec3} out the receiving vector, defaults to new vec3
   * @returns {Vec3} out
   */
  static project<Out extends Vec3Like = Vec3>(
    a: Vec3Like,
    b: Vec3Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    const d = Vec3.dot(a, b) / Vec3.dot(b, b)
    out[0] = b[0] * d; out[1] = b[1] * d; out[2] = b[2] * d
    return out
  }

  /**
   * Returns the signed angle between two vec3's, using a reference axis to determine sign
   *
   * @param {Vec3Like} a the first operand
   * @param {Vec3Like} b the second operand
   * @param {Vec3Like} ref the reference axis for determining sign
   * @returns {Number} the signed angle in radians
   */
  static orientedAngle(a: Vec3Like, b: Vec3Like, ref: Vec3Like) {
    const c = Vec3.cross(a, b)
    const angle = Math.atan2(c.len(), Vec3.dot(a, b))
    return Vec3.dot(c, ref) < 0 ? -angle : angle
  }

  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   *
   * @param {Vec3Like} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  scaleAndAdd<Out extends Vec3Like = Vec3>(
    b: Vec3Like,
    scale: number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  abs<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
    out[0] = Math.abs(this[0])
    out[1] = Math.abs(this[1])
    out[2] = Math.abs(this[2])
    return out
  }

  /**
   * Clamps each component of this vector between min and max.
   *
   * @param {Vec3Like | number} min the lower bound (per-component or scalar)
   * @param {Vec3Like | number} max the upper bound (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  clamp<Out extends Vec3Like = Vec3>(
    min: Vec3Like | number,
    max: Vec3Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like} b the second operand
   * @param {Vec3Like | number} t interpolation amount (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  mix<Out extends Vec3Like = Vec3>(
    b: Vec3Like,
    t: Vec3Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like | number} edge the edge value (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  step<Out extends Vec3Like = Vec3>(
    edge: Vec3Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
   * @param {Vec3Like | number} edge0 the lower edge (per-component or scalar)
   * @param {Vec3Like | number} edge1 the upper edge (per-component or scalar)
   * @param {Vec3} out the receiving vector, defaults to new vec3()
   * @returns {Vec3} out
   */
  smoothstep<Out extends Vec3Like = Vec3>(
    edge0: Vec3Like | number,
    edge1: Vec3Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  fract<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  sign<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  saturate<Out extends Vec3Like = Vec3>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  transformMat3<Out extends Vec3Like = Vec3>(
    m: Mat3Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  transformMat4<Out extends Vec3Like = Vec3>(
    m: Mat4Like,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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
  transformQuat<Out extends Vec3Like = Vec3>(
    q: QuatLike,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec3() : this) as Out
  ) {
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

interface Vec3Impl<ThisVec3 extends Vec3Like> {

  get x(): number
  set x(v: number)

  get y(): number
  set y(v: number)

  get z(): number
  set z(v: number)

  plus<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  minus<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  mult<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  div<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  invDiv<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  negate<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  unaryPlus<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  normalize<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  equals(b: Vec3Like): boolean
  exactEquals(b: Vec3Like): boolean
  squaredLength(): number
  len(): number
  floor<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  round<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  ceil<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  inverse<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  clone(): ThisVec3
  toString(): string
  dot(b: Vec3Like): number
  rotateX<Out extends Vec3Like = ThisVec3>(rad: number, origin?: Vec3Like, out?: Out): Out
  rotateY<Out extends Vec3Like = ThisVec3>(rad: number, origin?: Vec3Like, out?: Out): Out
  rotateZ<Out extends Vec3Like = ThisVec3>(rad: number, origin?: Vec3Like, out?: Out): Out
  scaleAndAdd<Out extends Vec3Like = ThisVec3>(b: Vec3Like, scale: number, out?: Out): Out
  abs<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  clamp<Out extends Vec3Like = ThisVec3>(min: Vec3Like | number, max: Vec3Like | number, out?: Out): Out
  mix<Out extends Vec3Like = ThisVec3>(b: Vec3Like, t: Vec3Like | number, out?: Out): Out
  step<Out extends Vec3Like = ThisVec3>(edge: Vec3Like | number, out?: Out): Out
  smoothstep<Out extends Vec3Like = ThisVec3>(edge0: Vec3Like | number, edge1: Vec3Like | number, out?: Out): Out
  fract<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  sign<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  saturate<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  transformMat3<Out extends Vec3Like = ThisVec3>(m: Mat3Like, out?: Out): Out
  transformMat4<Out extends Vec3Like = ThisVec3>(m: Mat4Like, out?: Out): Out
  transformQuat<Out extends Vec3Like = ThisVec3>(q: QuatLike, out?: Out): Out

  add<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  sub<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  subtract<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  mul<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  scale<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  multiply<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  times<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  divide<Out extends Vec3Like = ThisVec3>(b: Vec3Like | number, out?: Out): Out
  neg<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  unaryMinus<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  sqrLen: () => number
  str: () => string
  transformMat3x3<Out extends Vec3Like = ThisVec3>(m: Mat3Like, out?: Out): Out
  transformMat4x4<Out extends Vec3Like = ThisVec3>(m: Mat4Like, out?: Out): Out
  normalized<Out extends Vec3Like = ThisVec3>(out?: Out): Out
  lerpV<Out extends Vec3Like = ThisVec3>(b: Vec3Like, t: Vec3Like | number, out?: Out): Out
}

export interface Vec3 extends Vec3Impl<Vec3>, Vec3Swizzles<Vec2, Vec3, Vec4> {
  $str: string
  vec2: typeof Vec2
  vec3: typeof Vec3
  vec4: typeof Vec4
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
Vec3.prototype.lerpV = Vec3.prototype.mix
Vec3.prototype.transformMat3x3 = Vec3.prototype.transformMat3
Vec3.prototype.transformMat4x4 = Vec3.prototype.transformMat4

/**
 * 3 Dimensional Vector of 64 bit floats
 * @extends Float64Array
 */
export class Vec3d extends Float64Array {

  static get zero() { return new Vec3d(0, 0, 0) }
  static get Zero() { return new Vec3d(0, 0, 0) }
  static get ZERO() { return new Vec3d(0, 0, 0) }
  static get one()  { return new Vec3d(1, 1, 1) }
  static get One()  { return new Vec3d(1, 1, 1) }
  static get ONE()  { return new Vec3d(1, 1, 1) }

  static get unitX() { return new Vec3d(1, 0, 0) }
  static get UnitX() { return new Vec3d(1, 0, 0) }
  static get unitY() { return new Vec3d(0, 1, 0) }
  static get UnitY() { return new Vec3d(0, 1, 0) }
  static get unitZ() { return new Vec3d(0, 0, 1) }
  static get UnitZ() { return new Vec3d(0, 0, 1) }

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

  static normalize: <Out extends Vec3Like = Vec3d>(v: Vec3Like, out?: Out) => Out
  static random: <Out extends Vec3Like = Vec3d>(scale?: number, out?: Out) => Out
  static angle: (a: Vec3Like, b: Vec3Like) => number
  static dot: (a: Vec3Like, b: Vec3Like) => number
  static cross: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static distance: (a: Vec3Like, b: Vec3Like) => number
  static dist: (a: Vec3Like, b: Vec3Like) => number
  static squaredDistance: (a: Vec3Like, b: Vec3Like) => number
  static sqrDist: (a: Vec3Like, b: Vec3Like) => number
  static lerp: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, t: number, out?: Out) => Out
  static slerp: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, t: number, out?: Out) => Out
  static max: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static min: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static clamp: <Out extends Vec3Like = Vec3d>(v: Vec3Like, min: Vec3Like | number, max: Vec3Like | number, out?: Out) => Out
  static mix: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, t: Vec3Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec3Like = Vec3d>(edge0: Vec3Like | number, edge1: Vec3Like | number, v: Vec3Like, out?: Out) => Out
  static rotateX: <Out extends Vec3Like = Vec3d>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static rotateY: <Out extends Vec3Like = Vec3d>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static rotateZ: <Out extends Vec3Like = Vec3d>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static hermite: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, c: Vec3Like, d: Vec3Like, t: number, out?: Out) => Out
  static bezier: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, c: Vec3Like, d: Vec3Like, t: number, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, scale: number, out?: Out) => Out
  static reflect: <Out extends Vec3Like = Vec3d>(I: Vec3Like, N: Vec3Like, out?: Out) => Out
  static refract: <Out extends Vec3Like = Vec3d>(I: Vec3Like, N: Vec3Like, eta: number, out?: Out) => Out
  static faceforward: <Out extends Vec3Like = Vec3d>(N: Vec3Like, I: Vec3Like, Nref: Vec3Like, out?: Out) => Out
  static triangleNormal: <Out extends Vec3Like = Vec3d>(p1: Vec3Like, p2: Vec3Like, p3: Vec3Like, out?: Out) => Out
  static project: <Out extends Vec3Like = Vec3d>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static orientedAngle: (a: Vec3Like, b: Vec3Like, ref: Vec3Like) => number
  static floor: <Out extends Vec3Like = Vec3d>(v: Vec3Like, out?: Out) => Out
  static round: <Out extends Vec3Like = Vec3d>(v: Vec3Like, out?: Out) => Out
  static ceil: <Out extends Vec3Like = Vec3d>(v: Vec3Like, out?: Out) => Out
  static inverse: <Out extends Vec3Like = Vec3d>(v: Vec3Like, out?: Out) => Out
}
export interface Vec3d extends Vec3Impl<Vec3d>, Vec3Swizzles<Vec2d, Vec3d, Vec4d> {
  $str: string
  vec2: typeof Vec2d
  vec3: typeof Vec3d
  vec4: typeof Vec4d
}


/**
 * 3 Dimensional Vector of 32-bit integers
 * @extends Int32Array
 */
export class Vec3i extends Int32Array {

  static get zero() { return new Vec3i(0, 0, 0) }
  static get Zero() { return new Vec3i(0, 0, 0) }
  static get ZERO() { return new Vec3i(0, 0, 0) }
  static get one()  { return new Vec3i(1, 1, 1) }
  static get One()  { return new Vec3i(1, 1, 1) }
  static get ONE()  { return new Vec3i(1, 1, 1) }

  static get unitX() { return new Vec3i(1, 0, 0) }
  static get UnitX() { return new Vec3i(1, 0, 0) }
  static get unitY() { return new Vec3i(0, 1, 0) }
  static get UnitY() { return new Vec3i(0, 1, 0) }
  static get unitZ() { return new Vec3i(0, 0, 1) }
  static get UnitZ() { return new Vec3i(0, 0, 1) }

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

  static normalize: <Out extends Vec3Like = Vec3i>(v: Vec3Like, out?: Out) => Out
  static random: <Out extends Vec3Like = Vec3i>(scale?: number, out?: Out) => Out
  static angle: (a: Vec3Like, b: Vec3Like) => number
  static dot: (a: Vec3Like, b: Vec3Like) => number
  static cross: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static distance: (a: Vec3Like, b: Vec3Like) => number
  static dist: (a: Vec3Like, b: Vec3Like) => number
  static squaredDistance: (a: Vec3Like, b: Vec3Like) => number
  static sqrDist: (a: Vec3Like, b: Vec3Like) => number
  static lerp: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, t: number, out?: Out) => Out
  static slerp: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, t: number, out?: Out) => Out
  static max: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static min: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static clamp: <Out extends Vec3Like = Vec3i>(v: Vec3Like, min: Vec3Like | number, max: Vec3Like | number, out?: Out) => Out
  static mix: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, t: Vec3Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec3Like = Vec3i>(edge0: Vec3Like | number, edge1: Vec3Like | number, v: Vec3Like, out?: Out) => Out
  static rotateX: <Out extends Vec3Like = Vec3i>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static rotateY: <Out extends Vec3Like = Vec3i>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static rotateZ: <Out extends Vec3Like = Vec3i>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static hermite: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, c: Vec3Like, d: Vec3Like, t: number, out?: Out) => Out
  static bezier: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, c: Vec3Like, d: Vec3Like, t: number, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, scale: number, out?: Out) => Out
  static reflect: <Out extends Vec3Like = Vec3i>(I: Vec3Like, N: Vec3Like, out?: Out) => Out
  static refract: <Out extends Vec3Like = Vec3i>(I: Vec3Like, N: Vec3Like, eta: number, out?: Out) => Out
  static faceforward: <Out extends Vec3Like = Vec3i>(N: Vec3Like, I: Vec3Like, Nref: Vec3Like, out?: Out) => Out
  static triangleNormal: <Out extends Vec3Like = Vec3i>(p1: Vec3Like, p2: Vec3Like, p3: Vec3Like, out?: Out) => Out
  static project: <Out extends Vec3Like = Vec3i>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static orientedAngle: (a: Vec3Like, b: Vec3Like, ref: Vec3Like) => number
  static floor: <Out extends Vec3Like = Vec3i>(v: Vec3Like, out?: Out) => Out
  static round: <Out extends Vec3Like = Vec3i>(v: Vec3Like, out?: Out) => Out
  static ceil: <Out extends Vec3Like = Vec3i>(v: Vec3Like, out?: Out) => Out
  static inverse: <Out extends Vec3Like = Vec3i>(v: Vec3Like, out?: Out) => Out
}
export interface Vec3i extends Vec3Impl<Vec3i>, Vec3Swizzles<Vec2i, Vec3i, Vec4i> {
  $str: string
  vec2: typeof Vec2i
  vec3: typeof Vec3i
  vec4: typeof Vec4i
}

/**
 * 3 Dimensional Vector of unsigned 32-bit integers
 * @extends Uint32Array
 */
export class Vec3u extends Uint32Array {

  static get zero() { return new Vec3u(0, 0, 0) }
  static get Zero() { return new Vec3u(0, 0, 0) }
  static get ZERO() { return new Vec3u(0, 0, 0) }
  static get one()  { return new Vec3u(1, 1, 1) }
  static get One()  { return new Vec3u(1, 1, 1) }
  static get ONE()  { return new Vec3u(1, 1, 1) }

  static get unitX() { return new Vec3u(1, 0, 0) }
  static get UnitX() { return new Vec3u(1, 0, 0) }
  static get unitY() { return new Vec3u(0, 1, 0) }
  static get UnitY() { return new Vec3u(0, 1, 0) }
  static get unitZ() { return new Vec3u(0, 0, 1) }
  static get UnitZ() { return new Vec3u(0, 0, 1) }

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

  static normalize: <Out extends Vec3Like = Vec3u>(v: Vec3Like, out?: Out) => Out
  static random: <Out extends Vec3Like = Vec3u>(scale?: number, out?: Out) => Out
  static angle: (a: Vec3Like, b: Vec3Like) => number
  static dot: (a: Vec3Like, b: Vec3Like) => number
  static cross: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static distance: (a: Vec3Like, b: Vec3Like) => number
  static dist: (a: Vec3Like, b: Vec3Like) => number
  static squaredDistance: (a: Vec3Like, b: Vec3Like) => number
  static sqrDist: (a: Vec3Like, b: Vec3Like) => number
  static lerp: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, t: number, out?: Out) => Out
  static slerp: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, t: number, out?: Out) => Out
  static max: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static min: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static clamp: <Out extends Vec3Like = Vec3u>(v: Vec3Like, min: Vec3Like | number, max: Vec3Like | number, out?: Out) => Out
  static mix: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, t: Vec3Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec3Like = Vec3u>(edge0: Vec3Like | number, edge1: Vec3Like | number, v: Vec3Like, out?: Out) => Out
  static rotateX: <Out extends Vec3Like = Vec3u>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static rotateY: <Out extends Vec3Like = Vec3u>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static rotateZ: <Out extends Vec3Like = Vec3u>(v: Vec3Like, rad: number, origin?: Vec3Like, out?: Out) => Out
  static hermite: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, c: Vec3Like, d: Vec3Like, t: number, out?: Out) => Out
  static bezier: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, c: Vec3Like, d: Vec3Like, t: number, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, scale: number, out?: Out) => Out
  static reflect: <Out extends Vec3Like = Vec3u>(I: Vec3Like, N: Vec3Like, out?: Out) => Out
  static refract: <Out extends Vec3Like = Vec3u>(I: Vec3Like, N: Vec3Like, eta: number, out?: Out) => Out
  static faceforward: <Out extends Vec3Like = Vec3u>(N: Vec3Like, I: Vec3Like, Nref: Vec3Like, out?: Out) => Out
  static triangleNormal: <Out extends Vec3Like = Vec3u>(p1: Vec3Like, p2: Vec3Like, p3: Vec3Like, out?: Out) => Out
  static project: <Out extends Vec3Like = Vec3u>(a: Vec3Like, b: Vec3Like, out?: Out) => Out
  static orientedAngle: (a: Vec3Like, b: Vec3Like, ref: Vec3Like) => number
  static floor: <Out extends Vec3Like = Vec3u>(v: Vec3Like, out?: Out) => Out
  static round: <Out extends Vec3Like = Vec3u>(v: Vec3Like, out?: Out) => Out
  static ceil: <Out extends Vec3Like = Vec3u>(v: Vec3Like, out?: Out) => Out
  static inverse: <Out extends Vec3Like = Vec3u>(v: Vec3Like, out?: Out) => Out
}
export interface Vec3u extends Vec3Impl<Vec3u>, Vec3Swizzles<Vec2u, Vec3u, Vec4u> {
  $str: string
  vec2: typeof Vec2u
  vec3: typeof Vec3u
  vec4: typeof Vec4u
}