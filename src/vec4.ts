import glmaths from '.'
import { create, equals, copyPrototype } from './internalUtils'
import { defineSwizzles, Vec4Swizzles } from './swizzles'
import { Vec2, Vec2d, Vec2i, Vec2u } from './vec2'
import { Vec3, Vec3d, Vec3i, Vec3u } from './vec3'
import { Mat4 } from './mat4'
import { Quat } from './quat'

export type Vec4Like = Vec4 | Vec4d | Vec4i | Vec4u
export const isVec4Like = (a: any): a is Vec4Like =>
  a?.length === 4

/**
 * 4 Dimensional Vector of 32-bit floats
 * @extends Float32Array
 */
export class Vec4 extends Float32Array {

  static get zero() { return new this.prototype.vec4(0, 0, 0, 0) }
  static get Zero() { return new this.prototype.vec4(0, 0, 0, 0) }
  static get ZERO() { return new this.prototype.vec4(0, 0, 0, 0) }
  static get one()  { return new this.prototype.vec4(1, 1, 1, 1) }
  static get One()  { return new this.prototype.vec4(1, 1, 1, 1) }
  static get ONE()  { return new this.prototype.vec4(1, 1, 1, 1) }

  /**
   * Creates a vec4
   *
   * @param {Number} x X component, defaults to 0
   * @param {Number} y Y component, defaults to 0
   * @param {Number} z Z component, defaults to 0
   * @param {Number} w W component, defaults to 0
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4)
    this[0] = x
    this[1] = y
    this[2] = z
    this[3] = w
  }

  get x() { return this[0] }
  set x(v) { this[0] = v }

  get y() { return this[1] }
  set y(v) { this[1] = v }

  get z() { return this[2] }
  set z(v) { this[2] = v }

  get w() { return this[3] }
  set w(v) { this[3] = v }

  /**
   * Adds two vec4's
   *
   * @param {Vec4Like | Number} b the second operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  plus<Out extends Vec4Like = Vec4>(
    b: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] + b
      out[1] = this[1] + b
      out[2] = this[2] + b
      out[3] = this[3] + b
    } else {
      out[0] = this[0] + b[0]
      out[1] = this[1] + b[1]
      out[2] = this[2] + b[2]
      out[3] = this[3] + b[3]
    }
    return out
  }

  /**
   * Subtracts two vec4's
   *
   * @param {Vec4Like | Number} b the second operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  minus<Out extends Vec4Like = Vec4>(
    b: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] - b
      out[1] = this[1] - b
      out[2] = this[2] - b
      out[3] = this[3] - b
    } else {
      out[0] = this[0] - b[0]
      out[1] = this[1] - b[1]
      out[2] = this[2] - b[2]
      out[3] = this[3] - b[3]
    }
    return out
  }

  /**
   * Multiplies two vec4's
   *
   * @param {Vec4Like | Number} b the second operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  mult<Out extends Vec4Like = Vec4>(
    b: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] * b
      out[1] = this[1] * b
      out[2] = this[2] * b
      out[3] = this[3] * b
    } else {
      out[0] = this[0] * b[0]
      out[1] = this[1] * b[1]
      out[2] = this[2] * b[2]
      out[3] = this[3] * b[3]
    }
    return out
  }

  /**
   * Divides two vec4's
   *
   * @param {Vec4Like | Number} b the second operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  div<Out extends Vec4Like = Vec4>(
    b: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = this[0] / b
      out[1] = this[1] / b
      out[2] = this[2] / b
      out[3] = this[3] / b
    } else {
      out[0] = this[0] / b[0]
      out[1] = this[1] / b[1]
      out[2] = this[2] / b[2]
      out[3] = this[3] / b[3]
    }
    return out
  }

  invDiv<Out extends Vec4Like = Vec4>(
    b: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof b === 'number') {
      out[0] = b / this[0]
      out[1] = b / this[1]
      out[2] = b / this[2]
      out[3] = b / this[3]
    } else {
      out[0] = b[0] / this[0]
      out[1] = b[1] / this[1]
      out[2] = b[2] / this[2]
      out[3] = b[3] / this[3]
    }
    return out
  }

  /**
   * Negates the components of a vec4
   *
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  negate<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = -this[0]
    out[1] = -this[1]
    out[2] = -this[2]
    out[3] = -this[3]
    return out
  }
  unaryPlus<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (out != this) {
      out[0] = this[0]
      out[1] = this[1]
      out[2] = this[2]
      out[3] = this[3]
    }
    return out
  }

  /**
   * Normalizes a vec4
   *
   * @param {Vec4Like} v vector to normalize
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  static normalize<Out extends Vec4Like = Vec4>(
    v: Vec4Like,
    out: Out = new this.prototype.vec4() as Out
  ) {
    const x = v[0], y = v[1], z = v[2], w = v[3]
    let len = x * x + y * y + z * z + w * w
    if (len > 0) {
      len = 1.0 / Math.sqrt(len)
    }
    out[0] = x * len
    out[1] = y * len
    out[2] = z * len
    out[3] = w * len
    return out
  }

  /**
   * Normalizes a vec4
   *
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  normalize<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    let len = x * x + y * y + z * z + w * w
    if (len > 0) {
      len = 1.0 / Math.sqrt(len)
    }
    out[0] = x * len
    out[1] = y * len
    out[2] = z * len
    out[3] = w * len
    return out
  }

  /**
   * Returns whether or not the vectors have approximately equal components
   *
   * @param {Vec4Like} b the second operand
   * @returns {Boolean} true if the vectors are approximately equal
   */
  equals(b: Vec4Like) {
    return (
      equals(this[0], b[0]) && equals(this[1], b[1]) &&
      equals(this[2], b[2]) && equals(this[3], b[3])
    )
  }
  /**
   * Returns whether or not the vectors have exactly equal components
   *
   * @param {Vec4Like} b the second operand
   * @returns {Boolean} true if the vectors are exactly equal
   */
  exactEquals(b: Vec4Like) {
    return this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3]
  }

  /**
   * Calculates the squared length of a vec4
   *
   * @returns {Number} squared length of the vector
   */
  squaredLength() {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    return x * x + y * y + z * z + w * w
  }

  /**
   * Calculates the length of a vec4
   *
   * @returns {Number} length of the vector
   */
  len() {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    return Math.sqrt(x * x + y * y + z * z + w * w)
  }

  /**
   * Math.floor the components of a vec4
   *
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  floor<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = Math.floor(this[0])
    out[1] = Math.floor(this[1])
    out[2] = Math.floor(this[2])
    out[3] = Math.floor(this[3])
    return out
  }
  /**
   * Math.round the components of a vec4
   *
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  round<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = Math.round(this[0])
    out[1] = Math.round(this[1])
    out[2] = Math.round(this[2])
    out[3] = Math.round(this[3])
    return out
  }
  /**
   * Math.ceil the components of a vec4
   *
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  ceil<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = Math.ceil(this[0])
    out[1] = Math.ceil(this[1])
    out[2] = Math.ceil(this[2])
    out[3] = Math.ceil(this[3])
    return out
  }

  /**
   * Returns the inverse of the components of a vec4
   *
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  inverse<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = 1.0 / this[0]
    out[1] = 1.0 / this[1]
    out[2] = 1.0 / this[2]
    out[3] = 1.0 / this[3]
    return out
  }

  /**
   * Creates a vec4 initialized with values from a vector
   *
   * @returns {Vec4} a vec4
   */
  clone() {
    return new this.vec4(this[0], this[1], this[2], this[3])
  }

  /**
   * Returns a string representation of a vec4
   *
   * @returns {String} string representation of the vector
   */
  toString(): string {
    return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`
  }

  /**
   * Generates a random vector with the given scale
   *
   * @param {Number} scale length of the resulting vector, defaults to 1.0
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  static random<Out extends Vec4Like = Vec4>(
    scale = 1.0,
    out: Out = new this.prototype.vec4() as Out
  ) {
    // Marsaglia, George. Choosing a Point from the Surface of a
    // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
    // http://projecteuclid.org/euclid.aoms/1177692644;
    let v1, v2, v3, v4
    let s1, s2
    let rand

    rand = glmaths.RANDOM()
    v1 = rand * 2 - 1
    v2 = (4 * glmaths.RANDOM() - 2) * Math.sqrt(rand * -rand + rand)
    s1 = v1 * v1 + v2 * v2

    rand = glmaths.RANDOM()
    v3 = rand * 2 - 1
    v4 = (4 * glmaths.RANDOM() - 2) * Math.sqrt(rand * -rand + rand)
    s2 = v3 * v3 + v4 * v4

    const d = Math.sqrt((1 - s1) / s2)
    out[0] = scale * v1
    out[1] = scale * v2
    out[2] = scale * v3 * d
    out[3] = scale * v4 * d
    return out
  }

  /**
   * Calculates the dot product of two vec4's
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @returns {Number} dot product of a and b
   */
  static dot(a: Vec4Like, b: Vec4Like) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
  }
  /**
   * Calculates the dot product of this vec4 with b
   *
   * @param {Vec4Like} b the second operand
   * @returns {Number} dot product
   */
  dot(b: Vec4Like) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3] * b[3]
  }

  /**
   * Returns the cross-product of three vec4's in a 4-dimensional space
   *
   * @param {Vec4Like} u the first operand
   * @param {Vec4Like} v the second operand
   * @param {Vec4Like} w the third operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  static cross<Out extends Vec4Like = Vec4>(
    u: Vec4Like,
    v: Vec4Like,
    w: Vec4Like,
    out: Out = new this.prototype.vec4() as Out
  ) {
    const A = v[0] * w[1] - v[1] * w[0],
          B = v[0] * w[2] - v[2] * w[0],
          C = v[0] * w[3] - v[3] * w[0],
          D = v[1] * w[2] - v[2] * w[1],
          E = v[1] * w[3] - v[3] * w[1],
          F = v[2] * w[3] - v[3] * w[2]
    const G = u[0], H = u[1], I = u[2], J = u[3]
    out[0] = H * F - I * E + J * D
    out[1] = -(G * F) + I * C - J * B
    out[2] = G * E - H * C + J * A
    out[3] = -(G * D) + H * B - I * A
    return out
  }

  /**
   * Calculates the euclidean distance between two vec4's
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @returns {Number} distance between a and b
   */
  static distance(a: Vec4Like, b: Vec4Like) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    const z = a[2] - b[2]
    const w = a[3] - b[3]
    return Math.sqrt(x * x + y * y + z * z + w * w)
  }
  static dist: (a: Vec4Like, b: Vec4Like) => number

  /**
   * Calculates the squared euclidean distance between two vec4's
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @returns {Number} squared distance between a and b
   */
  static squaredDistance(a: Vec4Like, b: Vec4Like) {
    const x = a[0] - b[0]
    const y = a[1] - b[1]
    const z = a[2] - b[2]
    const w = a[3] - b[3]
    return x * x + y * y + z * z + w * w
  }
  static sqrDist: (a: Vec4Like, b: Vec4Like) => number

  /**
   * Performs a linear interpolation between two vec4's
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  static lerp<Out extends Vec4Like = Vec4>(
    a: Vec4Like,
    b: Vec4Like,
    t: number,
    out: Out = new this.prototype.vec4() as Out
  ) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3]
    out[0] = ax + (b[0] - ax) * t
    out[1] = ay + (b[1] - ay) * t
    out[2] = az + (b[2] - az) * t
    out[3] = aw + (b[3] - aw) * t
    return out
  }

  /**
   * Returns the maximum of two vec4's
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  static max<Out extends Vec4Like = Vec4>(
    a: Vec4Like,
    b: Vec4Like,
    out: Out = new this.prototype.vec4() as Out
  ) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    out[2] = Math.max(a[2], b[2])
    out[3] = Math.max(a[3], b[3])
    return out
  }
  /**
   * Returns the minimum of two vec4's
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @param {Vec4} out the receiving vector, defaults to new vec4()
   * @returns {Vec4} out
   */
  static min<Out extends Vec4Like = Vec4>(
    a: Vec4Like,
    b: Vec4Like,
    out: Out = new this.prototype.vec4() as Out
  ) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    out[2] = Math.min(a[2], b[2])
    out[3] = Math.min(a[3], b[3])
    return out
  }

  /**
   * Clamps the components of a vec4 between min and max values.
   *
   * @param {Vec4Like} v the input vector
   * @param {Vec4Like | number} min the minimum bound
   * @param {Vec4Like | number} max the maximum bound
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  static clamp<Out extends Vec4Like = Vec4>(
    v: Vec4Like,
    min: Vec4Like | number,
    max: Vec4Like | number,
    out: Out = new this.prototype.vec4() as Out
  ) {
    const minX = typeof min === 'number' ? min : min[0]
    const minY = typeof min === 'number' ? min : min[1]
    const minZ = typeof min === 'number' ? min : min[2]
    const minW = typeof min === 'number' ? min : min[3]
    const maxX = typeof max === 'number' ? max : max[0]
    const maxY = typeof max === 'number' ? max : max[1]
    const maxZ = typeof max === 'number' ? max : max[2]
    const maxW = typeof max === 'number' ? max : max[3]
    out[0] = Math.min(Math.max(v[0], minX), maxX)
    out[1] = Math.min(Math.max(v[1], minY), maxY)
    out[2] = Math.min(Math.max(v[2], minZ), maxZ)
    out[3] = Math.min(Math.max(v[3], minW), maxW)
    return out
  }

  /**
   * Performs a linear interpolation between two vec4's.
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @param {Vec4Like | number} t interpolation amount
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  static mix<Out extends Vec4Like = Vec4>(
    a: Vec4Like,
    b: Vec4Like,
    t: Vec4Like | number,
    out: Out = new this.prototype.vec4() as Out
  ) {
    if (typeof t === 'number') {
      out[0] = a[0] + (b[0] - a[0]) * t
      out[1] = a[1] + (b[1] - a[1]) * t
      out[2] = a[2] + (b[2] - a[2]) * t
      out[3] = a[3] + (b[3] - a[3]) * t
    } else {
      out[0] = a[0] + (b[0] - a[0]) * t[0]
      out[1] = a[1] + (b[1] - a[1]) * t[1]
      out[2] = a[2] + (b[2] - a[2]) * t[2]
      out[3] = a[3] + (b[3] - a[3]) * t[3]
    }
    return out
  }

  /**
   * Performs Hermite interpolation between two values.
   *
   * @param {Vec4Like | number} edge0 the lower edge
   * @param {Vec4Like | number} edge1 the upper edge
   * @param {Vec4Like} v the source vector
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  static smoothstep<Out extends Vec4Like = Vec4>(
    edge0: Vec4Like | number,
    edge1: Vec4Like | number,
    v: Vec4Like,
    out: Out = new this.prototype.vec4() as Out
  ) {
    const e0x = typeof edge0 === 'number' ? edge0 : edge0[0]
    const e0y = typeof edge0 === 'number' ? edge0 : edge0[1]
    const e0z = typeof edge0 === 'number' ? edge0 : edge0[2]
    const e0w = typeof edge0 === 'number' ? edge0 : edge0[3]
    const e1x = typeof edge1 === 'number' ? edge1 : edge1[0]
    const e1y = typeof edge1 === 'number' ? edge1 : edge1[1]
    const e1z = typeof edge1 === 'number' ? edge1 : edge1[2]
    const e1w = typeof edge1 === 'number' ? edge1 : edge1[3]
    let t0 = Math.min(Math.max((v[0] - e0x) / (e1x - e0x), 0), 1)
    let t1 = Math.min(Math.max((v[1] - e0y) / (e1y - e0y), 0), 1)
    let t2 = Math.min(Math.max((v[2] - e0z) / (e1z - e0z), 0), 1)
    let t3 = Math.min(Math.max((v[3] - e0w) / (e1w - e0w), 0), 1)
    out[0] = t0 * t0 * (3 - 2 * t0)
    out[1] = t1 * t1 * (3 - 2 * t1)
    out[2] = t2 * t2 * (3 - 2 * t2)
    out[3] = t3 * t3 * (3 - 2 * t3)
    return out
  }

  /**
   * Adds two vec4's after scaling the second operand by a scalar value
   *
   * @param {Vec4Like} b the second operand
   * @param {number} scale the amount to scale b by before adding
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  scaleAndAdd<Out extends Vec4Like = Vec4>(
    b: Vec4Like,
    scale: number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = this[0] + b[0] * scale
    out[1] = this[1] + b[1] * scale
    out[2] = this[2] + b[2] * scale
    out[3] = this[3] + b[3] * scale
    return out
  }

  /**
   * Returns the absolute value of the components of a vec4
   *
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  abs<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = Math.abs(this[0])
    out[1] = Math.abs(this[1])
    out[2] = Math.abs(this[2])
    out[3] = Math.abs(this[3])
    return out
  }

  /**
   * Clamps the components of this vec4 between min and max values.
   *
   * @param {Vec4Like | number} min the minimum bound
   * @param {Vec4Like | number} max the maximum bound
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  clamp<Out extends Vec4Like = Vec4>(
    min: Vec4Like | number,
    max: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    const minX = typeof min === 'number' ? min : min[0]
    const minY = typeof min === 'number' ? min : min[1]
    const minZ = typeof min === 'number' ? min : min[2]
    const minW = typeof min === 'number' ? min : min[3]
    const maxX = typeof max === 'number' ? max : max[0]
    const maxY = typeof max === 'number' ? max : max[1]
    const maxZ = typeof max === 'number' ? max : max[2]
    const maxW = typeof max === 'number' ? max : max[3]
    out[0] = Math.min(Math.max(this[0], minX), maxX)
    out[1] = Math.min(Math.max(this[1], minY), maxY)
    out[2] = Math.min(Math.max(this[2], minZ), maxZ)
    out[3] = Math.min(Math.max(this[3], minW), maxW)
    return out
  }

  /**
   * Performs a linear interpolation between this vec4 and b.
   *
   * @param {Vec4Like} b the second operand
   * @param {Vec4Like | number} t interpolation amount
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  mix<Out extends Vec4Like = Vec4>(
    b: Vec4Like,
    t: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof t === 'number') {
      out[0] = this[0] + (b[0] - this[0]) * t
      out[1] = this[1] + (b[1] - this[1]) * t
      out[2] = this[2] + (b[2] - this[2]) * t
      out[3] = this[3] + (b[3] - this[3]) * t
    } else {
      out[0] = this[0] + (b[0] - this[0]) * t[0]
      out[1] = this[1] + (b[1] - this[1]) * t[1]
      out[2] = this[2] + (b[2] - this[2]) * t[2]
      out[3] = this[3] + (b[3] - this[3]) * t[3]
    }
    return out
  }

  /**
   * Returns 0.0 if this < edge, otherwise 1.0 for each component.
   *
   * @param {Vec4Like | number} edge the edge value
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  step<Out extends Vec4Like = Vec4>(
    edge: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    if (typeof edge === 'number') {
      out[0] = this[0] < edge ? 0 : 1
      out[1] = this[1] < edge ? 0 : 1
      out[2] = this[2] < edge ? 0 : 1
      out[3] = this[3] < edge ? 0 : 1
    } else {
      out[0] = this[0] < edge[0] ? 0 : 1
      out[1] = this[1] < edge[1] ? 0 : 1
      out[2] = this[2] < edge[2] ? 0 : 1
      out[3] = this[3] < edge[3] ? 0 : 1
    }
    return out
  }

  /**
   * Performs Hermite interpolation between two values.
   *
   * @param {Vec4Like | number} edge0 the lower edge
   * @param {Vec4Like | number} edge1 the upper edge
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  smoothstep<Out extends Vec4Like = Vec4>(
    edge0: Vec4Like | number,
    edge1: Vec4Like | number,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    const e0x = typeof edge0 === 'number' ? edge0 : edge0[0]
    const e0y = typeof edge0 === 'number' ? edge0 : edge0[1]
    const e0z = typeof edge0 === 'number' ? edge0 : edge0[2]
    const e0w = typeof edge0 === 'number' ? edge0 : edge0[3]
    const e1x = typeof edge1 === 'number' ? edge1 : edge1[0]
    const e1y = typeof edge1 === 'number' ? edge1 : edge1[1]
    const e1z = typeof edge1 === 'number' ? edge1 : edge1[2]
    const e1w = typeof edge1 === 'number' ? edge1 : edge1[3]
    let t0 = Math.min(Math.max((this[0] - e0x) / (e1x - e0x), 0), 1)
    let t1 = Math.min(Math.max((this[1] - e0y) / (e1y - e0y), 0), 1)
    let t2 = Math.min(Math.max((this[2] - e0z) / (e1z - e0z), 0), 1)
    let t3 = Math.min(Math.max((this[3] - e0w) / (e1w - e0w), 0), 1)
    out[0] = t0 * t0 * (3 - 2 * t0)
    out[1] = t1 * t1 * (3 - 2 * t1)
    out[2] = t2 * t2 * (3 - 2 * t2)
    out[3] = t3 * t3 * (3 - 2 * t3)
    return out
  }

  /**
   * Returns the fractional part of each component.
   *
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  fract<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = this[0] - Math.floor(this[0])
    out[1] = this[1] - Math.floor(this[1])
    out[2] = this[2] - Math.floor(this[2])
    out[3] = this[3] - Math.floor(this[3])
    return out
  }

  /**
   * Returns the sign of each component (-1, 0, or 1).
   *
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  sign<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = this[0] > 0 ? 1 : this[0] < 0 ? -1 : 0
    out[1] = this[1] > 0 ? 1 : this[1] < 0 ? -1 : 0
    out[2] = this[2] > 0 ? 1 : this[2] < 0 ? -1 : 0
    out[3] = this[3] > 0 ? 1 : this[3] < 0 ? -1 : 0
    return out
  }

  /**
   * Clamps each component between 0 and 1.
   *
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  saturate<Out extends Vec4Like = Vec4>(
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    out[0] = Math.min(Math.max(this[0], 0), 1)
    out[1] = Math.min(Math.max(this[1], 0), 1)
    out[2] = Math.min(Math.max(this[2], 0), 1)
    out[3] = Math.min(Math.max(this[3], 0), 1)
    return out
  }

  /**
   * Transforms the vec4 with a mat4
   *
   * @param {Mat4} m matrix to transform with
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  transformMat4<Out extends Vec4Like = Vec4>(
    m: Mat4,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
  ) {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w
    return out
  }

  /**
   * Transforms the vec4's xyz components by a quat, preserving w
   *
   * @param {Quat} q quaternion to transform with
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  transformQuat<Out extends Vec4Like = Vec4>(
    q: Quat,
    out: Out = (glmaths.ALWAYS_COPY ? new this.vec4() : this) as Out
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
    out[3] = this[3]
    return out
  }

  /**
   * Adds two vec4's after scaling the second operand by a scalar value
   *
   * @param {Vec4Like} a the first operand
   * @param {Vec4Like} b the second operand
   * @param {number} scale the amount to scale b by before adding
   * @param {Vec4} out the receiving vector
   * @returns {Vec4} out
   */
  static scaleAndAdd<Out extends Vec4Like = Vec4>(
    a: Vec4Like,
    b: Vec4Like,
    scale: number,
    out: Out = new this.prototype.vec4() as Out
  ) {
    out[0] = a[0] + b[0] * scale
    out[1] = a[1] + b[1] * scale
    out[2] = a[2] + b[2] * scale
    out[3] = a[3] + b[3] * scale
    return out
  }
}

interface Vec4Impl<ThisVec4 extends Vec4Like> {

  get x(): number
  set x(v: number)

  get y(): number
  set y(v: number)

  get z(): number
  set z(v: number)

  get w(): number
  set w(v: number)

  plus<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  minus<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  mult<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  div<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  invDiv<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  negate<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  unaryPlus<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  normalize<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  equals(b: Vec4Like): boolean
  exactEquals(b: Vec4Like): boolean
  squaredLength(): number
  len(): number
  floor<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  round<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  ceil<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  inverse<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  clone(): ThisVec4
  toString(): string
  dot(b: Vec4Like): number
  scaleAndAdd<Out extends Vec4Like = ThisVec4>(b: Vec4Like, scale: number, out?: Out): Out
  abs<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  clamp<Out extends Vec4Like = ThisVec4>(min: Vec4Like | number, max: Vec4Like | number, out?: Out): Out
  mix<Out extends Vec4Like = ThisVec4>(b: Vec4Like, t: Vec4Like | number, out?: Out): Out
  step<Out extends Vec4Like = ThisVec4>(edge: Vec4Like | number, out?: Out): Out
  smoothstep<Out extends Vec4Like = ThisVec4>(edge0: Vec4Like | number, edge1: Vec4Like | number, out?: Out): Out
  fract<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  sign<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  saturate<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  transformMat4<Out extends Vec4Like = ThisVec4>(m: Mat4, out?: Out): Out
  transformQuat<Out extends Vec4Like = ThisVec4>(q: Quat, out?: Out): Out

  add<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  sub<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  subtract<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  mul<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  scale<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  multiply<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  times<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  divide<Out extends Vec4Like = ThisVec4>(b: Vec4Like | number, out?: Out): Out
  neg<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  unaryMinus<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  sqrLen: () => number
  str: () => string
  transformMat4x4<Out extends Vec4Like = ThisVec4>(m: Mat4, out?: Out): Out
  normalized<Out extends Vec4Like = ThisVec4>(out?: Out): Out
  lerpV<Out extends Vec4Like = ThisVec4>(b: Vec4Like, t: Vec4Like | number, out?: Out): Out
}

export interface Vec4 extends Vec4Impl<Vec4>, Vec4Swizzles<Vec2, Vec3, Vec4> {
  $str: string
  vec2: typeof Vec2
  vec3: typeof Vec3
  vec4: typeof Vec4
}
defineSwizzles(Vec4.prototype, 4)

// @aliases
Vec4.dist = Vec4.distance
Vec4.sqrDist = Vec4.squaredDistance
Vec4.prototype.add = Vec4.prototype.plus
Vec4.prototype.divide = Vec4.prototype.div
Vec4.prototype.sub = Vec4.prototype.minus
Vec4.prototype.subtract = Vec4.prototype.minus
Vec4.prototype.mul = Vec4.prototype.mult
Vec4.prototype.scale = Vec4.prototype.mult
Vec4.prototype.times = Vec4.prototype.mult
Vec4.prototype.multiply = Vec4.prototype.mult
Vec4.prototype.neg = Vec4.prototype.negate
Vec4.prototype.unaryMinus = Vec4.prototype.negate
Vec4.prototype.sqrLen = Vec4.prototype.squaredLength
Vec4.prototype.str = Vec4.prototype.toString
Vec4.prototype.normalized = Vec4.prototype.normalize
Vec4.prototype.lerpV = Vec4.prototype.mix
Vec4.prototype.transformMat4x4 = Vec4.prototype.transformMat4

/**
 * 4 Dimensional Vector of 64 bit floats
 * @extends Float64Array
 */
export class Vec4d extends Float64Array {

  static get zero() { return new Vec4d(0, 0, 0, 0) }
  static get Zero() { return new Vec4d(0, 0, 0, 0) }
  static get ZERO() { return new Vec4d(0, 0, 0, 0) }
  static get one()  { return new Vec4d(1, 1, 1, 1) }
  static get One()  { return new Vec4d(1, 1, 1, 1) }
  static get ONE()  { return new Vec4d(1, 1, 1, 1) }

  /**
   * Creates a vec4
   *
   * @param {Number} x X component, defaults to 0
   * @param {Number} y Y component, defaults to 0
   * @param {Number} z Z component, defaults to 0
   * @param {Number} w W component, defaults to 0
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4)
    this[0] = x
    this[1] = y
    this[2] = z
    this[3] = w
  }

  static normalize: <Out extends Vec4Like = Vec4d>(v: Vec4Like, out?: Out) => Out
  static random: <Out extends Vec4Like = Vec4d>(scale?: number, out?: Out) => Out
  static dot: (a: Vec4Like, b: Vec4Like) => number
  static cross: <Out extends Vec4Like = Vec4d>(u: Vec4Like, v: Vec4Like, w: Vec4Like, out?: Out) => Out
  static distance: (a: Vec4Like, b: Vec4Like) => number
  static dist: (a: Vec4Like, b: Vec4Like) => number
  static squaredDistance: (a: Vec4Like, b: Vec4Like) => number
  static sqrDist: (a: Vec4Like, b: Vec4Like) => number
  static lerp: <Out extends Vec4Like = Vec4d>(a: Vec4Like, b: Vec4Like, t: number, out?: Out) => Out
  static max: <Out extends Vec4Like = Vec4d>(a: Vec4Like, b: Vec4Like, out?: Out) => Out
  static min: <Out extends Vec4Like = Vec4d>(a: Vec4Like, b: Vec4Like, out?: Out) => Out
  static clamp: <Out extends Vec4Like = Vec4d>(v: Vec4Like, min: Vec4Like | number, max: Vec4Like | number, out?: Out) => Out
  static mix: <Out extends Vec4Like = Vec4d>(a: Vec4Like, b: Vec4Like, t: Vec4Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec4Like = Vec4d>(edge0: Vec4Like | number, edge1: Vec4Like | number, v: Vec4Like, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec4Like = Vec4d>(a: Vec4Like, b: Vec4Like, scale: number, out?: Out) => Out
}
export interface Vec4d extends Vec4Impl<Vec4d>, Vec4Swizzles<Vec2d, Vec3d, Vec4d> {
  $str: string
  vec2: typeof Vec2d
  vec3: typeof Vec3d
  vec4: typeof Vec4d
}

/**
 * 4 Dimensional Vector of 32-bit integers
 * @extends Int32Array
 */
export class Vec4i extends Int32Array {

  static get zero() { return new Vec4i(0, 0, 0, 0) }
  static get Zero() { return new Vec4i(0, 0, 0, 0) }
  static get ZERO() { return new Vec4i(0, 0, 0, 0) }
  static get one()  { return new Vec4i(1, 1, 1, 1) }
  static get One()  { return new Vec4i(1, 1, 1, 1) }
  static get ONE()  { return new Vec4i(1, 1, 1, 1) }

  /**
   * Creates a vec4
   *
   * @param {Number} x X component, defaults to 0
   * @param {Number} y Y component, defaults to 0
   * @param {Number} z Z component, defaults to 0
   * @param {Number} w W component, defaults to 0
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4)
    this[0] = x
    this[1] = y
    this[2] = z
    this[3] = w
  }

  static normalize: <Out extends Vec4Like = Vec4i>(v: Vec4Like, out?: Out) => Out
  static random: <Out extends Vec4Like = Vec4i>(scale?: number, out?: Out) => Out
  static dot: (a: Vec4Like, b: Vec4Like) => number
  static cross: <Out extends Vec4Like = Vec4i>(u: Vec4Like, v: Vec4Like, w: Vec4Like, out?: Out) => Out
  static distance: (a: Vec4Like, b: Vec4Like) => number
  static dist: (a: Vec4Like, b: Vec4Like) => number
  static squaredDistance: (a: Vec4Like, b: Vec4Like) => number
  static sqrDist: (a: Vec4Like, b: Vec4Like) => number
  static lerp: <Out extends Vec4Like = Vec4i>(a: Vec4Like, b: Vec4Like, t: number, out?: Out) => Out
  static max: <Out extends Vec4Like = Vec4i>(a: Vec4Like, b: Vec4Like, out?: Out) => Out
  static min: <Out extends Vec4Like = Vec4i>(a: Vec4Like, b: Vec4Like, out?: Out) => Out
  static clamp: <Out extends Vec4Like = Vec4i>(v: Vec4Like, min: Vec4Like | number, max: Vec4Like | number, out?: Out) => Out
  static mix: <Out extends Vec4Like = Vec4i>(a: Vec4Like, b: Vec4Like, t: Vec4Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec4Like = Vec4i>(edge0: Vec4Like | number, edge1: Vec4Like | number, v: Vec4Like, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec4Like = Vec4i>(a: Vec4Like, b: Vec4Like, scale: number, out?: Out) => Out
}
export interface Vec4i extends Vec4Impl<Vec4i>, Vec4Swizzles<Vec2i, Vec3i, Vec4i> {
  $str: string
  vec2: typeof Vec2i
  vec3: typeof Vec3i
  vec4: typeof Vec4i
}

/**
 * 4 Dimensional Vector of unsigned 32-bit integers
 * @extends Uint32Array
 */
export class Vec4u extends Uint32Array {

  static get zero() { return new Vec4u(0, 0, 0, 0) }
  static get Zero() { return new Vec4u(0, 0, 0, 0) }
  static get ZERO() { return new Vec4u(0, 0, 0, 0) }
  static get one()  { return new Vec4u(1, 1, 1, 1) }
  static get One()  { return new Vec4u(1, 1, 1, 1) }
  static get ONE()  { return new Vec4u(1, 1, 1, 1) }

  /**
   * Creates a vec4
   *
   * @param {Number} x X component, defaults to 0
   * @param {Number} y Y component, defaults to 0
   * @param {Number} z Z component, defaults to 0
   * @param {Number} w W component, defaults to 0
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(4)
    this[0] = x
    this[1] = y
    this[2] = z
    this[3] = w
  }

  static normalize: <Out extends Vec4Like = Vec4u>(v: Vec4Like, out?: Out) => Out
  static random: <Out extends Vec4Like = Vec4u>(scale?: number, out?: Out) => Out
  static dot: (a: Vec4Like, b: Vec4Like) => number
  static cross: <Out extends Vec4Like = Vec4u>(u: Vec4Like, v: Vec4Like, w: Vec4Like, out?: Out) => Out
  static distance: (a: Vec4Like, b: Vec4Like) => number
  static dist: (a: Vec4Like, b: Vec4Like) => number
  static squaredDistance: (a: Vec4Like, b: Vec4Like) => number
  static sqrDist: (a: Vec4Like, b: Vec4Like) => number
  static lerp: <Out extends Vec4Like = Vec4u>(a: Vec4Like, b: Vec4Like, t: number, out?: Out) => Out
  static max: <Out extends Vec4Like = Vec4u>(a: Vec4Like, b: Vec4Like, out?: Out) => Out
  static min: <Out extends Vec4Like = Vec4u>(a: Vec4Like, b: Vec4Like, out?: Out) => Out
  static clamp: <Out extends Vec4Like = Vec4u>(v: Vec4Like, min: Vec4Like | number, max: Vec4Like | number, out?: Out) => Out
  static mix: <Out extends Vec4Like = Vec4u>(a: Vec4Like, b: Vec4Like, t: Vec4Like | number, out?: Out) => Out
  static smoothstep: <Out extends Vec4Like = Vec4u>(edge0: Vec4Like | number, edge1: Vec4Like | number, v: Vec4Like, out?: Out) => Out
  static scaleAndAdd: <Out extends Vec4Like = Vec4u>(a: Vec4Like, b: Vec4Like, scale: number, out?: Out) => Out
}
export interface Vec4u extends Vec4Impl<Vec4u>, Vec4Swizzles<Vec2u, Vec3u, Vec4u> {
  $str: string
  vec2: typeof Vec2u
  vec3: typeof Vec3u
  vec4: typeof Vec4u
}
