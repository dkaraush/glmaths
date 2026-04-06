import glmaths from '.'
import { create, equals, copyPrototype } from './internalUtils'
import { defineSwizzles, Vec2Swizzles } from './swizzles'
import { Vec3, Vec3d, Vec3i, Vec3u, Vec3Like } from './vec3'
import { Vec4, Vec4d, Vec4i, Vec4u, Vec4Like } from './vec4'
import { Mat2 } from './mat2'
import { Mat2x3 } from './mat2x3'
import { Mat3 } from './mat3'
import { Mat4 } from './mat4'

export type Vec2Like = Vec2 | Vec2d | Vec2i | Vec2u
export const isVec2Like = (a: any): a is Vec2Like =>
  a?.length === 2

/**
 * 2 Dimensional Vector of 32-bit floats
 * @extends Float32Array
 */
export class Vec2 extends Float32Array {

  static get zero() { return new this.prototype.vec2(0, 0) }
  static get Zero() { return new this.prototype.vec2(0, 0) }
  static get ZERO() { return new this.prototype.vec2(0, 0) }
  static get one() { return new this.prototype.vec2(1, 1) }
  static get One() { return new this.prototype.vec2(1, 1) }
  static get ONE() { return new this.prototype.vec2(1, 1) }

  /**
   * Creates a new Vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   */
  constructor(x = 0, y = 0) {
    super(2)
    this[0] = x
    this[1] = y
  }

  get x() { return this[0] }
  set x(v) { this[0] = v }

  get y() { return this[1] }
  set y(v) { this[1] = v }

  /**
   * Adds two vec2's
   *
   * @param {Vec2Like | Number} b the second operand
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  plus<Out extends Vec2Like = Vec2>(
    b: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] + b
      out[1] = this[1] + b
    } else {
      out[0] = this[0] + b[0]
      out[1] = this[1] + b[1]
    }
    return out
  }

  /**
   * Subtracts vector b from a vector
   *
   * @param {Vec2Like | Number} b the second operand
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  minus<Out extends Vec2Like = Vec2>(
    b: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] - b
      out[1] = this[1] - b
    } else {
      out[0] = this[0] - b[0]
      out[1] = this[1] - b[1]
    }
    return out
  }

  /**
   * Multiplies two vec2's component-wise
   *
   * @param {Vec2 | Number} b the second operand
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  mult<Out extends Vec2Like = Vec2>(
    b: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] * b
      out[1] = this[1] * b
    } else {
      out[0] = this[0] * b[0]
      out[1] = this[1] * b[1]
    }
    return out
  }

  /**
   * Divides two vec2's component-wise
   *
   * @param {Vec2 | Number} b the second operand
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  div<Out extends Vec2Like = Vec2>(
    b: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] / b
      out[1] = this[1] / b
    } else {
      out[0] = this[0] / b[0]
      out[1] = this[1] / b[1]
    }
    return out
  }

  /**
   * Divides this vector by argument
   *
   * @param {Vec2 | Number} a the first operand
   * @param {Vec2Like} out the receiving vector, defaults to new Vec2()
   * @returns out
   */
  invDiv<Out extends Vec2Like = Vec2>(
    a: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof a === 'number') {
      out[0] = a / this[0]
      out[1] = a / this[1]
    } else {
      out[0] = a[0] / this[0]
      out[1] = a[1] / this[1]
    }
    return out
  }

  /**
   * Remainder of this divided by argument
   *
   * @param {Vec2 | Number} a the first operand
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  rem<Out extends Vec2Like = Vec2>(
    b: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] % b
      out[1] = this[1] % b
    } else {
      out[0] = this[0] % b[0]
      out[1] = this[1] % b[1]
    }
    return out
  }

  /**
   * Negates the components of a vec2
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  negate<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = -this[0]
    out[1] = -this[1]
    return out
  }
  unaryPlus<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (out != this) {
      out[0] = this[0]
      out[1] = this[1]
    }
    return out
  }

  /**
   * Normalize a vector to unit length.
   *
   * @param {Vec2Like} v vector to normalize
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} this
   */
  static normalize<Out extends Vec2Like = Vec2>(
    v: Vec2Like,
    out: Out = new this.prototype.vec2() as Out
  ) {
    const x = v[0], y = v[1]
    let len = x * x + y * y
    if (len > 0) {
      len = 1.0 / Math.sqrt(len)
    }
    out[0] = x * len
    out[1] = y * len
    return out
  }

  /**
   * Normalize a vector to unit length.
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} this
   */
  normalize<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const x = this[0], y = this[1]
    let len = x * x + y * y
    if (len > 0) {
      len = 1.0 / Math.sqrt(len)
    }
    out[0] = x * len
    out[1] = y * len
    return out
  }

  /**
   * Returns whether or not the vectors have approximately equal values
   *
   * @param {Vec2} b the second operand
   * @returns {Boolean} true if approximately equal
   */
  equals(b: Vec2Like) {
    return (
      equals(this[0], b[0]) &&
      equals(this[1], b[1])
    )
  }

  /**
   * Returns whether or not the vectors have exactly equal values
   *
   * @param {Vec2} b the second operand
   * @returns {Boolean} true if exactly equal
   */
  exactEquals(b: Vec2Like) {
    return this[0] === b[0] && this[1] === b[1]
  }

  /**
   * Calculates the squared length of a vec2
   *
   * @returns {Number} squared length
   */
  squaredLength() {
    const x = this[0], y = this[1]
    return x * x + y * y
  }

  /**
   * Calculates the length of a vec2
   *
   * @returns {Number} length of a vector
   */
  len() {
    const x = this[0], y = this[1]
    return Math.sqrt(x * x + y * y)
  }

  /**
   * Math.floor the components of a vec2
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  floor<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = Math.floor(this[0])
    out[1] = Math.floor(this[1])
    return out
  }
  /**
   * Math.round the components of a vec2
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  round<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = Math.round(this[0])
    out[1] = Math.round(this[1])
    return out
  }

  /**
   * Math.ceil the components of a vec2
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  ceil<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = Math.ceil(this[0])
    out[1] = Math.ceil(this[1])
    return out
  }

  /**
   * Returns the inverse of the components (1/x, 1/y)
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  inverse<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = 1.0 / this[0]
    out[1] = 1.0 / this[1]
    return out
  }

  /**
   * Creates a new vec2 initialized with values from a vector
   *
   * @returns {Vec2} a new Vec2
   */
  clone() { return new this.vec2(this[0], this[1]) }

  /**
   * Rotates a vec2 around an origin point
   *
   * @param {Number} rad the angle of rotation in radians
   * @param {Vec2} origin the origin of the rotation, defaults to vec2(0, 0)
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  rotate<Out extends Vec2Like = Vec2>(
    rad = 0,
    origin: Vec2Like = Vec2.zero,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const p0 = this[0] - origin[0]
    const p1 = this[1] - origin[1]
    const sinC = Math.sin(rad)
    const cosC = Math.cos(rad)
    out[0] = p0 * cosC - p1 * sinC + origin[0]
    out[1] = p0 * sinC + p1 * cosC + origin[1]
    return out
  }

  /**
   * Returns a string representation of a vector
   *
   * @returns {String} string representation
   */
  toString(): string {
    return `${this.$str}(${this[0]}, ${this[1]})`
  }

  /**
   * Generates a random vector with the given scale (uniform distribution on a circle)
   *
   * @param {Number} scale length of the resulting vector, defaults to 1.0
   * @returns {Vec2} a new random Vec2
   */
  static random<Out extends Vec2Like = Vec2>(
    scale = 1.0,
    out: Out = new this.prototype.vec2() as Out
  ) {
    const angleR = glmaths.RANDOM() * 2.0 * Math.PI
    out[0] = Math.cos(angleR) * scale
    out[1] = Math.sin(angleR) * scale
    return out
  }

  /**
   * Calculates the unsigned angle (in radians) between two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Number} angle in radians
   */
  static angle(a: Vec2Like, b: Vec2Like) {
    const ax = a[0], ay = a[1]
    const bx = b[0], by = b[1]
    return Math.abs(Math.atan2(ay * bx - ax * by, ax * bx + ay * by))
  }
  /**
   * Calculates the signed angle (in radians) between two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Number} signed angle in radians
   */
  static signedAngle(a: Vec2Like, b: Vec2Like) {
    const ax = a[0], ay = a[1]
    const bx = b[0], by = b[1]
    return Math.atan2(ax * by - ay * bx, ax * bx + ay * by)
  }

  /**
   * Calculates the dot product of two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Number} dot product of a and b
   */
  static dot(a: Vec2Like, b: Vec2Like) {
    return a[0] * b[0] + a[1] * b[1]
  }

  /**
   * Calculates the dot product of a vector with b
   *
   * @param {Vec2} b the second operand
   * @returns {Number} dot product
   */
  dot(b: Vec2Like) {
    return this[0] * b[0] + this[1] * b[1]
  }
  /**
   * Computes the cross product of two vec2's.
   * Note that the cross product returns a Vec3 with the result in the z component.
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Vec3} a new Vec3 with z = a x b
   */
  static cross<Out extends Vec3Like = Vec3>(
    a: Vec2Like,
    b: Vec2Like,
    out: Out = new this.prototype.vec3() as Out
  ) {
    out[0] = out[1] = 0
    out[2] = a[0] * b[1] - a[1] * b[0]
    return out
  }

  /**
   * Calculates the euclidian distance between two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Number} distance between a and b
   */
  static distance(a: Vec2Like, b: Vec2Like) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    return Math.sqrt(x * x + y * y)
  }
  static dist: (a: Vec2Like, b: Vec2Like) => number

  /**
   * Calculates the squared euclidian distance between two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Number} squared distance between a and b
   */
  static squaredDistance(a: Vec2Like, b: Vec2Like) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    return x * x + y * y
  }
  static sqrDist: (a: Vec2Like, b: Vec2Like) => number

  /**
   * Performs a linear interpolation between two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {Vec2} a new interpolated Vec2
   */
  static lerp<Out extends Vec2Like = Vec2>(
    a: Vec2Like,
    b: Vec2Like,
    t: number,
    out: Out = new this.prototype.vec2() as Out
  ) {
    const a0 = a[0], a1 = a[1]
    out[0] = a0 + (b[0] - a0) * t
    out[1] = a1 + (b[1] - a1) * t
    return out
  }

  /**
   * Returns the component-wise maximum of two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Vec2} a new Vec2 with max components
   */
  static max<Out extends Vec2Like = Vec2>(
    a: Vec2Like,
    b: Vec2Like,
    out: Out = new this.prototype.vec2() as Out
  ) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    return out
  }
  /**
   * Returns the component-wise minimum of two vec2's
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @returns {Vec2} a new Vec2 with min components
   */
  static min<Out extends Vec2Like = Vec2>(
    a: Vec2Like,
    b: Vec2Like,
    out: Out = new this.prototype.vec2() as Out
  ) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    return out
  }

  /**
   * Component-wise clamp between min and max
   *
   * @param {Vec2} v the vector to clamp
   * @param {Vec2 | Number} min the lower bound
   * @param {Vec2 | Number} max the upper bound
   * @returns {Vec2} a new clamped Vec2
   */
  static clamp<Out extends Vec2Like = Vec2>(
    v: Vec2Like,
    min: Vec2Like | number,
    max: Vec2Like | number,
    out: Out = new this.prototype.vec2() as Out
  ) {
    if (typeof min === 'number' && typeof max === 'number') {
      out[0] = Math.min(Math.max(v[0], min), max)
      out[1] = Math.min(Math.max(v[1], min), max)
    } else {
      const minX = typeof min === 'number' ? min : min[0]
      const minY = typeof min === 'number' ? min : min[1]
      const maxX = typeof max === 'number' ? max : max[0]
      const maxY = typeof max === 'number' ? max : max[1]
      out[0] = Math.min(Math.max(v[0], minX), maxX)
      out[1] = Math.min(Math.max(v[1], minY), maxY)
    }
    return out
  }

  /**
   * Component-wise linear interpolation (GLSL mix)
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @param {Vec2 | Number} t interpolation factor (scalar or per-component)
   * @returns {Vec2} a new interpolated Vec2
   */
  static mix<Out extends Vec2Like = Vec2>(
    a: Vec2Like,
    b: Vec2Like,
    t: Vec2Like | number,
    out: Out = new this.prototype.vec2() as Out
  ) {
    if (typeof t === 'number') {
      out[0] = a[0] + (b[0] - a[0]) * t
      out[1] = a[1] + (b[1] - a[1]) * t
    } else {
      out[0] = a[0] + (b[0] - a[0]) * t[0]
      out[1] = a[1] + (b[1] - a[1]) * t[1]
    }
    return out
  }

  /**
   * Component-wise Hermite smoothstep interpolation
   *
   * @param {Vec2 | Number} edge0 the lower edge
   * @param {Vec2 | Number} edge1 the upper edge
   * @param {Vec2} v the source vector
   * @returns {Vec2} a new smoothstepped Vec2
   */
  static smoothstep<Out extends Vec2Like = Vec2>(
    edge0: Vec2Like | number,
    edge1: Vec2Like | number,
    v: Vec2Like,
    out: Out = new this.prototype.vec2() as Out
  ) {
    const e0x = typeof edge0 === 'number' ? edge0 : edge0[0]
    const e0y = typeof edge0 === 'number' ? edge0 : edge0[1]
    const e1x = typeof edge1 === 'number' ? edge1 : edge1[0]
    const e1y = typeof edge1 === 'number' ? edge1 : edge1[1]
    let t0 = Math.min(Math.max((v[0] - e0x) / (e1x - e0x), 0), 1)
    let t1 = Math.min(Math.max((v[1] - e0y) / (e1y - e0y), 0), 1)
    out[0] = t0 * t0 * (3 - 2 * t0)
    out[1] = t1 * t1 * (3 - 2 * t1)
    return out
  }

  /**
   * Adds this vec2 to b vec2 scaled by a scalar
   *
   * @param {Vec2} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  scaleAndAdd<Out extends Vec2Like = Vec2>(
    b: Vec2Like,
    scale: number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = this[0] + b[0] * scale
    out[1] = this[1] + b[1] * scale
    return out
  }

  /**
   * Component-wise absolute value
   *
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  abs<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = Math.abs(this[0])
    out[1] = Math.abs(this[1])
    return out
  }

  /**
   * Component-wise sign
   *
   * @param {Vec2Like} out the receiving vector, defaults to new vec2()
   * @returns {Vec2Like} out
   */
  sign<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = this[0] > 0 ? 1 : this[0] < 0 ? -1 : 0
    out[1] = this[1] > 0 ? 1 : this[1] < 0 ? -1 : 0
    return out
  }

  /**
   * Component-wise fractional part (x - floor(x))
   *
   * @param {Vec2Like} out the receiving vector, defaults to new vec2()
   * @returns {Vec2Like} out
   */
  fract<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = this[0] - Math.floor(this[0])
    out[1] = this[1] - Math.floor(this[1])
    return out
  }

  /**
   * Component-wise clamp between min and max
   *
   * @param {Vec2 | Number} min the lower bound
   * @param {Vec2 | Number} max the upper bound
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  clamp<Out extends Vec2Like = Vec2>(
    min: Vec2Like | number,
    max: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof min === 'number' && typeof max === 'number') {
      out[0] = Math.min(Math.max(this[0], min), max)
      out[1] = Math.min(Math.max(this[1], min), max)
    } else {
      const minX = typeof min === 'number' ? min : min[0]
      const minY = typeof min === 'number' ? min : min[1]
      const maxX = typeof max === 'number' ? max : max[0]
      const maxY = typeof max === 'number' ? max : max[1]
      out[0] = Math.min(Math.max(this[0], minX), maxX)
      out[1] = Math.min(Math.max(this[1], minY), maxY)
    }
    return out
  }

  /**
   * Clamp components to [0, 1]
   *
   * @param {Vec2Like} out the receiving vector, defaults to new vec2()
   * @returns {Vec2Like} out
   */
  saturate<Out extends Vec2Like = Vec2>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    out[0] = Math.min(Math.max(this[0], 0), 1)
    out[1] = Math.min(Math.max(this[1], 0), 1)
    return out
  }

  /**
   * Component-wise linear interpolation (GLSL mix)
   *
   * @param {Vec2Like} b the second operand
   * @param {Vec2Like | Number} t interpolation factor (scalar or per-component)
   * @param {Vec2Like} out the receiving vector, defaults to new vec2()
   * @returns {Vec2Like} out
   */
  mix<Out extends Vec2Like = Vec2>(
    b: Vec2Like,
    t: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof t === 'number') {
      out[0] = this[0] + (b[0] - this[0]) * t
      out[1] = this[1] + (b[1] - this[1]) * t
    } else {
      out[0] = this[0] + (b[0] - this[0]) * t[0]
      out[1] = this[1] + (b[1] - this[1]) * t[1]
    }
    return out
  }

  /**
   * Component-wise step function
   *
   * @param {Vec2 | Number} edge the edge threshold
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  step<Out extends Vec2Like = Vec2>(
    edge: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    if (typeof edge === 'number') {
      out[0] = this[0] < edge ? 0 : 1
      out[1] = this[1] < edge ? 0 : 1
    } else {
      out[0] = this[0] < edge[0] ? 0 : 1
      out[1] = this[1] < edge[1] ? 0 : 1
    }
    return out
  }

  /**
   * Component-wise Hermite smoothstep interpolation
   *
   * @param {Vec2 | Number} edge0 the lower edge
   * @param {Vec2 | Number} edge1 the upper edge
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  smoothstep<Out extends Vec2Like = Vec2>(
    edge0: Vec2Like | number,
    edge1: Vec2Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const e0x = typeof edge0 === 'number' ? edge0 : edge0[0]
    const e0y = typeof edge0 === 'number' ? edge0 : edge0[1]
    const e1x = typeof edge1 === 'number' ? edge1 : edge1[0]
    const e1y = typeof edge1 === 'number' ? edge1 : edge1[1]
    let t0 = Math.min(Math.max((this[0] - e0x) / (e1x - e0x), 0), 1)
    let t1 = Math.min(Math.max((this[1] - e0y) / (e1y - e0y), 0), 1)
    out[0] = t0 * t0 * (3 - 2 * t0)
    out[1] = t1 * t1 * (3 - 2 * t1)
    return out
  }

  /**
   * Transforms the vec2 with a Mat2 (column-major 2x2)
   *
   * @param {Mat2} m matrix to transform with
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  transformMat2<Out extends Vec2Like = Vec2>(
    m: Mat2,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const x = this[0], y = this[1]
    out[0] = m[0] * x + m[2] * y
    out[1] = m[1] * x + m[3] * y
    return out
  }

  /**
   * Transforms the vec2 with a Mat2x3 (2D affine transform)
   *
   * @param {Mat2x3} m matrix to transform with
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  transformMat2x3<Out extends Vec2Like = Vec2>(
    m: Mat2x3,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const x = this[0], y = this[1]
    out[0] = m[0] * x + m[2] * y + m[4]
    out[1] = m[1] * x + m[3] * y + m[5]
    return out
  }

  /**
   * Transforms the vec2 with a Mat3 (column-major 3x3)
   *
   * @param {Mat3} m matrix to transform with
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  transformMat3<Out extends Vec2Like = Vec2>(
    m: Mat3,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const x = this[0], y = this[1]
    out[0] = m[0] * x + m[3] * y + m[6]
    out[1] = m[1] * x + m[4] * y + m[7]
    return out
  }

  /**
   * Transforms the vec2 with a Mat4 (column-major 4x4)
   *
   * @param {Mat4} m matrix to transform with
   * @param {Vec2} out the receiving vector, defaults to new vec2()
   * @returns {Vec2} out
   */
  transformMat4<Out extends Vec2Like = Vec2>(
    m: Mat4,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec2() : this) as Out
  ) {
    const x = this[0], y = this[1]
    out[0] = m[0] * x + m[4] * y + m[12]
    out[1] = m[1] * x + m[5] * y + m[13]
    return out
  }

  /**
   * Adds two vec2's after scaling the second operand by a scalar value (static)
   *
   * @param {Vec2} a the first operand
   * @param {Vec2} b the second operand
   * @param {Number} scale the amount to scale b by before adding
   * @param {Vec2} out the receiving vector
   * @returns {Vec2} out
   */
  static scaleAndAdd<Out extends Vec2Like = Vec2>(
    a: Vec2Like,
    b: Vec2Like,
    scale: number,
    out: Out = new this.prototype.vec2() as Out
  ) {
    out[0] = a[0] + b[0] * scale
    out[1] = a[1] + b[1] * scale
    return out
  }

  /**
   * Reflects a vector off a surface with the given normal
   *
   * @param {Vec2} I the incident vector
   * @param {Vec2} N the normal vector (should be normalized)
   * @param {Vec2} out the receiving vector
   * @returns {Vec2} out
   */
  static reflect<Out extends Vec2Like = Vec2>(
    I: Vec2Like,
    N: Vec2Like,
    out: Out = new this.prototype.vec2() as Out
  ) {
    const d = Vec2.dot(N, I)
    out[0] = I[0] - 2 * d * N[0]
    out[1] = I[1] - 2 * d * N[1]
    return out
  }
}

interface Vec2Impl<ThisVec2 extends Vec2Like> {

  get x(): number
  set x(v: number)

  get y(): number
  set y(v: number)

  plus<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  minus<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  mult<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  div<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  invDiv<Out extends Vec2Like = ThisVec2>(a: Vec2Like | number, out?: Out): Out
  rem<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  negate<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  unaryPlus<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  normalize<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  equals(b: Vec2Like): boolean
  exactEquals(b: Vec2Like): boolean
  squaredLength(): number
  len(): number
  floor<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  round<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  ceil<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  inverse<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  clone(): ThisVec2
  rotate<Out extends Vec2Like = ThisVec2>(rad?: number, origin?: Vec2Like, out?: Out): Out
  toString(): string
  dot(b: Vec2Like): number
  scaleAndAdd<Out extends Vec2Like = ThisVec2>(b: Vec2Like, scale: number, out?: Out): Out
  abs<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  sign<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  fract<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  clamp<Out extends Vec2Like = ThisVec2>(min: Vec2Like | number, max: Vec2Like | number, out?: Out): Out
  saturate<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  mix<Out extends Vec2Like = ThisVec2>(b: Vec2Like, t: Vec2Like | number, out?: Out): Out
  step<Out extends Vec2Like = ThisVec2>(edge: Vec2Like | number, out?: Out): Out
  smoothstep<Out extends Vec2Like = ThisVec2>(edge0: Vec2Like | number, edge1: Vec2Like | number, out?: Out): Out
  transformMat2<Out extends Vec2Like = ThisVec2>(m: Mat2, out?: Out): Out
  transformMat2x3<Out extends Vec2Like = ThisVec2>(m: Mat2x3, out?: Out): Out
  transformMat3<Out extends Vec2Like = ThisVec2>(m: Mat3, out?: Out): Out
  transformMat4<Out extends Vec2Like = ThisVec2>(m: Mat4, out?: Out): Out

  add<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  sub<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  subtract<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  mul<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  multiply<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  scale<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  times<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  divide<Out extends Vec2Like = ThisVec2>(b: Vec2Like | number, out?: Out): Out
  neg<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  unaryMinus<Out extends Vec2Like = ThisVec2>(out?: Out): Out
  sqrLen: () => number
  str: () => string
  lerpV<Out extends Vec2Like = ThisVec2>(b: Vec2Like, t: Vec2Like | number, out?: Out): Out
  transformMat2x2<Out extends Vec2Like = ThisVec2>(m: Mat2, out?: Out): Out
  transformMat3x3<Out extends Vec2Like = ThisVec2>(m: Mat3, out?: Out): Out
  transformMat4x4<Out extends Vec2Like = ThisVec2>(m: Mat4, out?: Out): Out
  normalized<Out extends Vec2Like = ThisVec2>(out?: Out): Out
}

export interface Vec2 extends Vec2Impl<Vec2>, Vec2Swizzles<Vec2, Vec3, Vec4> {
  $str: string
  vec2: typeof Vec2
  vec3: typeof Vec3
  vec4: typeof Vec4
}
defineSwizzles(Vec2.prototype, 2)

// @aliases
Vec2.dist = Vec2.distance
Vec2.sqrDist = Vec2.squaredDistance
Vec2.prototype.add = Vec2.prototype.plus
Vec2.prototype.sub = Vec2.prototype.minus
Vec2.prototype.subtract = Vec2.prototype.minus
Vec2.prototype.mul = Vec2.prototype.mult
Vec2.prototype.multiply = Vec2.prototype.mult
Vec2.prototype.scale = Vec2.prototype.mult
Vec2.prototype.times = Vec2.prototype.mult
Vec2.prototype.divide = Vec2.prototype.div
Vec2.prototype.neg = Vec2.prototype.negate
Vec2.prototype.unaryMinus = Vec2.prototype.negate
Vec2.prototype.sqrLen = Vec2.prototype.squaredLength
Vec2.prototype.str = Vec2.prototype.toString
Vec2.prototype.lerpV = Vec2.prototype.mix
Vec2.prototype.normalized = Vec2.prototype.normalize
Vec2.prototype.transformMat2x2 = Vec2.prototype.transformMat2
Vec2.prototype.transformMat3x3 = Vec2.prototype.transformMat3
Vec2.prototype.transformMat4x4 = Vec2.prototype.transformMat4

/**
 * 2 Dimensional Vector of 64 bit floats
 * @extends Float64Array
 */
export class Vec2d extends Float64Array {

  static get zero() { return new Vec2d(0, 0) }
  static get Zero() { return new Vec2d(0, 0) }
  static get ZERO() { return new Vec2d(0, 0) }
  static get one() { return new Vec2d(1, 1) }
  static get One() { return new Vec2d(1, 1) }
  static get ONE() { return new Vec2d(1, 1) }
  
  /**
   * Creates a new Vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   */
  constructor(x = 0, y = 0) {
    super(2)
    this[0] = x;
    this[1] = y;
  }

  static normalize: <Out extends Vec2Like = Vec2d>(v: Vec2Like, out?: Out) => Out
  static random: <Out extends Vec2Like = Vec2d>(scale?: number, out?: Out) => Out
  static angle: (a: Vec2Like, b: Vec2Like) => number
  static signedAngle: (a: Vec2Like, b: Vec2Like) => number
  static dot: (a: Vec2Like, b: Vec2Like) => number
  static cross: <Out extends Vec3Like = Vec3d>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static distance: (a: Vec2Like, b: Vec2Like) => number
  static dist: (a: Vec2Like, b: Vec2Like) => number
  static squaredDistance: (a: Vec2Like, b: Vec2Like) => number
  static sqrDist: (a: Vec2Like, b: Vec2Like) => number
  static lerp: <Out extends Vec2Like = Vec2d>(a: Vec2Like, b: Vec2Like, t: number, out?: Out) => Out
  static max: <Out extends Vec2Like = Vec2d>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static min: <Out extends Vec2Like = Vec2d>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static clamp: <Out extends Vec2Like = Vec2d>(v: Vec2Like, min: Vec2Like | number, max: Vec2Like | number, out?: Out) => Out
  static mix: <Out extends Vec2Like = Vec2d>(a: Vec2Like, b: Vec2Like, t: Vec2Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec2Like = Vec2d>(edge0: Vec2Like | number, edge1: Vec2Like | number, v: Vec2Like, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec2Like = Vec2d>(a: Vec2Like, b: Vec2Like, scale: number, out?: Out) => Out
  static reflect: <Out extends Vec2Like = Vec2d>(I: Vec2Like, N: Vec2Like, out?: Out) => Out
}
export interface Vec2d extends Vec2Impl<Vec2d>, Vec2Swizzles<Vec2d, Vec3d, Vec4d> {
  $str: string
  vec2: typeof Vec2d
  vec3: typeof Vec3d
  vec4: typeof Vec4d
}

/**
 * 2 Dimensional Vector of 32-bit integers
 * @extends Int32Array
 */
export class Vec2i extends Int32Array {

  static get zero() { return new Vec2i(0, 0) }
  static get Zero() { return new Vec2i(0, 0) }
  static get ZERO() { return new Vec2i(0, 0) }
  static get one() { return new Vec2i(1, 1) }
  static get One() { return new Vec2i(1, 1) }
  static get ONE() { return new Vec2i(1, 1) }

  /**
   * Creates a new Vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   */
  constructor(x = 0, y = 0) {
    super(2)
    this[0] = x;
    this[1] = y;
  }

  static normalize: <Out extends Vec2Like = Vec2i>(v: Vec2Like, out?: Out) => Out
  static random: <Out extends Vec2Like = Vec2i>(scale?: number, out?: Out) => Out
  static angle: (a: Vec2Like, b: Vec2Like) => number
  static signedAngle: (a: Vec2Like, b: Vec2Like) => number
  static dot: (a: Vec2Like, b: Vec2Like) => number
  static cross: <Out extends Vec3Like = Vec3i>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static distance: (a: Vec2Like, b: Vec2Like) => number
  static dist: (a: Vec2Like, b: Vec2Like) => number
  static squaredDistance: (a: Vec2Like, b: Vec2Like) => number
  static sqrDist: (a: Vec2Like, b: Vec2Like) => number
  static lerp: <Out extends Vec2Like = Vec2i>(a: Vec2Like, b: Vec2Like, t: number, out?: Out) => Out
  static max: <Out extends Vec2Like = Vec2i>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static min: <Out extends Vec2Like = Vec2i>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static clamp: <Out extends Vec2Like = Vec2i>(v: Vec2Like, min: Vec2Like | number, max: Vec2Like | number, out?: Out) => Out
  static mix: <Out extends Vec2Like = Vec2i>(a: Vec2Like, b: Vec2Like, t: Vec2Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec2Like = Vec2i>(edge0: Vec2Like | number, edge1: Vec2Like | number, v: Vec2Like, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec2Like = Vec2i>(a: Vec2Like, b: Vec2Like, scale: number, out?: Out) => Out
  static reflect: <Out extends Vec2Like = Vec2i>(I: Vec2Like, N: Vec2Like, out?: Out) => Out
}
export interface Vec2i extends Vec2Impl<Vec2i>, Vec2Swizzles<Vec2i, Vec3i, Vec4i> {
  $str: string
  vec2: typeof Vec2i
  vec3: typeof Vec3i
  vec4: typeof Vec4i
}

/**
 * 2 Dimensional Vector of unsigned 32-bit integers
 * @extends Uint32Array
 */
export class Vec2u extends Uint32Array {

  static get zero() { return new Vec2u(0, 0) }
  static get Zero() { return new Vec2u(0, 0) }
  static get ZERO() { return new Vec2u(0, 0) }
  static get one() { return new Vec2u(1, 1) }
  static get One() { return new Vec2u(1, 1) }
  static get ONE() { return new Vec2u(1, 1) }

  /**
   * Creates a new Vec2 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   */
  constructor(x = 0, y = 0) {
    super(2)
    this[0] = x;
    this[1] = y;
  }

  static normalize: <Out extends Vec2Like = Vec2u>(v: Vec2Like, out?: Out) => Out
  static random: <Out extends Vec2Like = Vec2u>(scale?: number, out?: Out) => Out
  static angle: (a: Vec2Like, b: Vec2Like) => number
  static signedAngle: (a: Vec2Like, b: Vec2Like) => number
  static dot: (a: Vec2Like, b: Vec2Like) => number
  static cross: <Out extends Vec3Like = Vec3i>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static distance: (a: Vec2Like, b: Vec2Like) => number
  static dist: (a: Vec2Like, b: Vec2Like) => number
  static squaredDistance: (a: Vec2Like, b: Vec2Like) => number
  static sqrDist: (a: Vec2Like, b: Vec2Like) => number
  static lerp: <Out extends Vec2Like = Vec2u>(a: Vec2Like, b: Vec2Like, t: number, out?: Out) => Out
  static max: <Out extends Vec2Like = Vec2u>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static min: <Out extends Vec2Like = Vec2u>(a: Vec2Like, b: Vec2Like, out?: Out) => Out
  static clamp: <Out extends Vec2Like = Vec2u>(v: Vec2Like, min: Vec2Like | number, max: Vec2Like | number, out?: Out) => Out
  static mix: <Out extends Vec2Like = Vec2u>(a: Vec2Like, b: Vec2Like, t: Vec2Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec2Like = Vec2u>(edge0: Vec2Like | number, edge1: Vec2Like | number, v: Vec2Like, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec2Like = Vec2u>(a: Vec2Like, b: Vec2Like, scale: number, out?: Out) => Out
  static reflect: <Out extends Vec2Like = Vec2u>(I: Vec2Like, N: Vec2Like, out?: Out) => Out
}
export interface Vec2u extends Vec2Impl<Vec2u>, Vec2Swizzles<Vec2u, Vec3u, Vec4u> {
  $str: string
  vec2: typeof Vec2u
  vec3: typeof Vec3u
  vec4: typeof Vec4u
}