import glmaths from '.'
import { vec3, Vec3 } from './vec3'
import { vec4, Vec4 } from './vec4'
import { Mat3 } from './mat3'
import { Mat4 } from './mat4'

/**
 * Quaternion for 3D rotations
 * @extends Vec4
 */
export class Quat extends Float32Array {

  static get identity() { return quat(0, 0, 0, 1) }
  static get Identity() { return quat(0, 0, 0, 1) }
  static get IDENTITY() { return quat(0, 0, 0, 1) }

  /**
   * Creates a new quaternion
   *
   * @param {Number} x X component, defaults to 0
   * @param {Number} y Y component, defaults to 0
   * @param {Number} z Z component, defaults to 0
   * @param {Number} w W component, defaults to 1
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(4)
    this[0] = x
    this[1] = y
    this[2] = z
    this[3] = w
  }

  /**
   * Calculates the Hamilton product of two quaternions
   *
   * @param {Quat} b the second operand
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  multiply(b: Quat | number, out: Quat = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    if (typeof b === 'number') {
      out[0] = this[0] * b
      out[1] = this[1] * b
      out[2] = this[2] * b
      out[3] = this[3] * b
      return out!
    }
    const ax = this[0], ay = this[1], az = this[2], aw = this[3]
    const bx = b[0],    by = b[1],    bz = b[2],    bw = b[3]
    out[0] = ax * bw + aw * bx + ay * bz - az * by
    out[1] = ay * bw + aw * by + az * bx - ax * bz
    out[2] = az * bw + aw * bz + ax * by - ay * bx
    out[3] = aw * bw - ax * bx - ay * by - az * bz
    return out
  }

  /**
   * Creates a quaternion from the given axis and angle of rotation
   *
   * @param {Vec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static fromAxisAngle(axis: Vec3, rad: number, out = quat()): Quat {
    rad *= 0.5
    const s = Math.sin(rad)
    out[0] = s * axis[0]
    out[1] = s * axis[1]
    out[2] = s * axis[2]
    out[3] = Math.cos(rad)
    return out
  }

  /**
   * Sets a quaternion to the given axis and angle of rotation
   *
   * @param {Vec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  setAxisAngle(axis: Vec3, rad: number, out = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    rad *= 0.5
    const s = Math.sin(rad)
    out[0] = s * axis[0]
    out[1] = s * axis[1]
    out[2] = s * axis[2]
    out[3] = Math.cos(rad)
    return out
  }

  /**
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @param {Vec3} out_axis axis to return of the rotation
   * @returns {Number} angle, in radians, of the rotation
   */
  getAxisAngle(out_axis: Vec3) {
    const rad = Math.acos(this[3]) * 2.0
    const s = Math.sin(rad / 2.0)
    if (out_axis) {
      if (s > glmaths.EPSILON) {
        out_axis[0] = this[0] / s
        out_axis[1] = this[1] / s
        out_axis[2] = this[2] / s
      } else {
        out_axis[0] = 1
        out_axis[1] = out_axis[2] = 0
      }
    }
    return rad
  }

  /**
   * Gets the angular distance between two unit quaternions
   *
   * @param {Quat} a Origin unit quaternion
   * @param {Quat} b Destination unit quaternion
   * @returns {Number} Angle, in radians, between the two quaternions
   */
  static angle(a: Quat, b: Quat) {
    const dotproduct = Quat.dot(a, b)
    return Math.acos(2 * dotproduct * dotproduct - 1)
  }

  /**
   * Gets the angular distance between two unit quaternions
   *
   * @param  {Quat} a Origin unit quaternion
   * @param  {Quat} b Destination unit quaternion
   * @return {Number} Angle, in radians, between the two quaternions
   */
  static getAngle: (a: Quat, b: Quat) => number
  
  /**
   * Rotates a quaternion by the given angle about the X axis
   *
   * @param {Number} rad angle in radians to rotate
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  rotateX(rad: number, out = glmaths.ALWAYS_COPY ? quat() : this) {
    rad *= 0.5
    const ax = this[0], ay = this[1], az = this[2], aw = this[3]
    const bx = Math.sin(rad), bw = Math.cos(rad)
    out[0] = ax * bw + aw * bx
    out[1] = ay * bw + az * bx
    out[2] = az * bw - ay * bx
    out[3] = aw * bw - ax * bx
    return out
  }

  /**
   * Rotates a quaternion by the given angle about the Y axis
   *
   * @param {Number} rad angle in radians to rotate
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  rotateY(rad: number, out = glmaths.ALWAYS_COPY ? quat() : this) {
    rad *= 0.5
    const ax = this[0], ay = this[1], az = this[2], aw = this[3]
    const by = Math.sin(rad), bw = Math.cos(rad)
    out[0] = ax * bw - az * by
    out[1] = ay * bw + aw * by
    out[2] = az * bw + ax * by
    out[3] = aw * bw - ay * by
    return out
  }
  /**
   * Rotates a quaternion by the given angle about the Z axis
   *
   * @param {Number} rad angle in radians to rotate
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  rotateZ(rad: number, out = glmaths.ALWAYS_COPY ? quat() : this) {
    rad *= 0.5
    const ax = this[0], ay = this[1], az = this[2], aw = this[3]
    const bz = Math.sin(rad), bw = Math.cos(rad)
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out
  }

  /**
   * Calculates the W component of a quaternion from the X, Y, and Z components
   *
   * @returns {Number} the W component
   */
  calculateW() {
    const x = this[0], y = this[1], z = this[2]
    return Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z))
  }

  /**
   * Calculates the exponential of a unit quaternion
   *
   * @param {Quat} q the quaternion to exponentiate
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static exp(q: Quat, out = quat()): Quat {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const r = Math.sqrt(x * x + y * y + z * z)
    const et = Math.exp(w)
    const s = r > 0 ? (et * Math.sin(r)) / r : 0
    out[0] = x * s
    out[1] = y * s
    out[2] = z * s
    out[3] = et * Math.cos(r)
    return out
  }
  /**
   * Calculates the exponential of the unit quaternion
   *
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  exp(out = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    const r = Math.sqrt(x * x + y * y + z * z)
    const et = Math.exp(w)
    const s = r > 0 ? (et * Math.sin(r)) / r : 0
    out[0] = x * s
    out[1] = y * s
    out[2] = z * s
    out[3] = et * Math.cos(r)
    return out
  }

  /**
   * Calculates the natural logarithm of a unit quaternion
   *
   * @param {Quat} q the quaternion to take the logarithm of
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static ln(q: Quat, out = quat()): Quat {
    const x = q[0], y = q[1], z = q[2], w = q[3]
    const r = Math.sqrt(x * x + y * y + z * z)
    const t = r > 0 ? Math.atan2(r, w) / r : 0
    out[0] = x * t
    out[1] = y * t
    out[2] = z * t
    out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w)
    return out
  }
  /**
   * Calculates the natural logarithm of the unit quaternion
   *
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  ln(out = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    const r = Math.sqrt(x * x + y * y + z * z)
    const t = r > 0 ? Math.atan2(r, w) / r : 0
    out[0] = x * t
    out[1] = y * t
    out[2] = z * t
    out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w)
    return out
  }

  /**
   * Raises a quaternion to a scalar power
   *
   * @param {Number} b the power to raise the quaternion to
   * @returns {Quat} this
   */
  pow(b: number) {
    this.ln()
    this.scale(b)
    this.exp()
    return this
  }

  /**
   * Performs a spherical linear interpolation between two quaternions
   *
   * @param {Quat} a the first operand
   * @param {Quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static slerp(a: Quat, b: Quat, t: number, out = quat()): Quat {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3]
    let bx = b[0], by = b[1], bz = b[2], bw = b[3]

    let omega, cosom, sinom, scale0, scale1;
    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    // calculate coefficients
    if (1.0 - cosom > glmaths.EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx
    out[1] = scale0 * ay + scale1 * by
    out[2] = scale0 * az + scale1 * bz
    out[3] = scale0 * aw + scale1 * bw
    return out
  }
  /**
   * Performs a spherical linear interpolation between a quaternion and b
   *
   * @param {Quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  slerp(b: Quat, t: number, out = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    let ax = this[0], ay = this[1], az = this[2], aw = this[3]
    let bx = b[0], by = b[1], bz = b[2], bw = b[3]

    let omega, cosom, sinom, scale0, scale1;
    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    // calculate coefficients
    if (1.0 - cosom > glmaths.EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx
    out[1] = scale0 * ay + scale1 * by
    out[2] = scale0 * az + scale1 * bz
    out[3] = scale0 * aw + scale1 * bw
    return out
  }

  /**
   * Generates a random unit quaternion
   *
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static random(out = quat()) {
    // Implementation of http://planning.cs.uiuc.edu/node198.html
    // TODO: Calling random 3 times is probably not the fastest solution
    let u1 = glmaths.RANDOM()
    let u2 = glmaths.RANDOM()
    let u3 = glmaths.RANDOM()
    let sqrt1MinusU1 = Math.sqrt(1 - u1)
    let sqrtU1 = Math.sqrt(u1)
    out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2)
    out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2)
    out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3)
    out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3)
    return out
  }

  /**
   * Calculates the inverse of a quaternion
   *
   * @param {Quat} q the source quaternion
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static invert(q: Quat, out = quat()) {
    const a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3]
    const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    const invDot = dot ? 1.0 / dot : 0;
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
    out[0] = -a0 * invDot
    out[1] = -a1 * invDot
    out[2] = -a2 * invDot
    out[3] = a3 * invDot
    return out
  }
  /**
   * Calculates the inverse of a quaternion
   *
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  invert(out = glmaths.ALWAYS_COPY ? quat() : this) {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3]
    const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    const invDot = dot ? 1.0 / dot : 0;
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
    out[0] = -a0 * invDot
    out[1] = -a1 * invDot
    out[2] = -a2 * invDot
    out[3] = a3 * invDot
    return out
  }

  /**
   * Calculates the conjugate of a quaternion
   *
   * @param {Quat} q the source quaternion
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static conjugate(q: Quat, out = quat()): Quat {
    out[0] = -q[0]
    out[1] = -q[1]
    out[2] = -q[2]
    out[3] =  q[3]
    return out
  }
  /**
   * Calculates the conjugate of a quaternion
   *
   * @param {Quat} out the receiving quaternion, defaults to new quat()
   * @returns {Quat} out
   */
  conjugate(out = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    out[0] = -this[0]
    out[1] = -this[1]
    out[2] = -this[2]
    out[3] =  this[3]
    return out
  }

  /**
   * Creates a quaternion from the given 3x3 rotation matrix
   *
   * @param {Mat3} m the rotation matrix
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static fromMat3(m: Mat3, out = quat()): Quat {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    const fTrace = m[0] + m[4] + m[8]
    let fRoot
    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w
      out[3] = 0.5 * fRoot
      fRoot = 0.5 / fRoot // 1/(4w)
      out[0] = (m[5] - m[7]) * fRoot
      out[1] = (m[6] - m[2]) * fRoot
      out[2] = (m[1] - m[3]) * fRoot
    } else {
      // |w| <= 1/2
      let i = 0
      if (m[4] > m[0]) i = 1
      if (m[8] > m[i * 3 + i]) i = 2
      let j = (i + 1) % 3
      let k = (i + 2) % 3
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0)
      out[i] = 0.5 * fRoot
      fRoot = 0.5 / fRoot
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  /**
   * Creates a quaternion from the given Euler angle x, y, z using the given order
   *
   * @param {Number} x rotation around X axis in degrees
   * @param {Number} y rotation around Y axis in degrees
   * @param {Number} z rotation around Z axis in degrees
   * @param {String} order angle order, defaults to ANGLE_ORDER
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static fromEuler(x: number, y: number, z: number, order = glmaths.ANGLE_ORDER, out = quat()) {
    let halfToRad = Math.PI / 360
    x *= halfToRad
    z *= halfToRad
    y *= halfToRad
    let sx = Math.sin(x)
    let cx = Math.cos(x)
    let sy = Math.sin(y)
    let cy = Math.cos(y)
    let sz = Math.sin(z)
    let cz = Math.cos(z)
    switch (order) {
      case "xyz":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "xzy":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;
      case "yxz":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz - sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;
      case "yzx":
        out[0] = sx * cy * cz + cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "zxy":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz + sx * sy * cz;
        out[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "zyx":
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        break;
      default:
        throw new Error('Unknown angle order ' + order);
    }
    return out
  }

  /**
   * Returns a string representation of a quaternion
   *
   * @returns {String} string representation of the quaternion
   */
  toString() {
    return `quat(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`
  }

  /**
   * Returns dot product of two quaternions
   *
   * @param {Quat} a the first quaternion
   * @param {Quat} b the second quaternion
   * @returns {Number} the dot product
   */
  static dot(a: Quat, b: Quat): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
  }

  /**
   * Returns dot product of this and other quaternion
   *
   * @param {Quat} a the first quaternion
   * @param {Quat} b the second quaternion
   * @returns {Number} the dot product
   */
  dot(b: Quat): number {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3] * b[3]
  }

  /**
   * Returns whether two quaternions represent the same rotation
   *
   * @param {Quat} b the second operand
   * @returns {Boolean} true if the quaternions represent the same rotation
   */
  equals(b: Quat) {
    return Math.abs(Quat.dot(this, b)) >= 1 - glmaths.EPSILON
  }

  private static tmpVec3 = vec3()
  /**
   * Sets a quaternion to represent the shortest rotation from one vector to another
   *
   * @param {Vec3} a the initial vector
   * @param {Vec3} b the destination vector
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static rotationTo(a: Vec3, b: Vec3, out = quat()): Quat {
    const dot = vec3.dot(a, b)
    if (dot < -0.999999) {
      vec3.cross(vec3.unitX, a, Quat.tmpVec3)
      if (Quat.tmpVec3.len() < 0.000001)
        vec3.cross(vec3.unitY, a, Quat.tmpVec3)
      return this.fromAxisAngle(Quat.tmpVec3.normalize(), Math.PI, out)
    } else if (dot > 0.999999) {
      out[0] = out[1] = out[2] = 0
      out[3] = 1
      return out
    } else {
      vec3.cross(a, b, Quat.tmpVec3)
      out[0] = Quat.tmpVec3[0]
      out[1] = Quat.tmpVec3[1]
      out[2] = Quat.tmpVec3[2]
      out[3] = 1 + dot
      return out.normalize(out)
    }
  }

  private static tmp1 = new Quat()
  private static tmp2 = new Quat()
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {Quat} a the first operand
   * @param {Quat} b the second operand
   * @param {Quat} c the third operand
   * @param {Quat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static sqlerp(a: Quat, b: Quat, c: Quat, d: Quat, t: number, out = quat()): Quat {
    Quat.slerp(a, d, t, Quat.tmp1)
    Quat.slerp(b, c, t, Quat.tmp2)
    Quat.slerp(Quat.tmp1, Quat.tmp2, 2 * t * (1 - t), out)
    return out
  }

  private static tmpMat3 = new Mat3()
  /**
   * Sets the specified quaternion with values corresponding to the given axes
   *
   * @param {Vec3} view the vector representing the viewing direction
   * @param {Vec3} right the vector representing the local right direction
   * @param {Vec3} up the vector representing the local up direction
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static setAxes(view: Vec3, right: Vec3, up: Vec3, out = quat()) {
    Quat.tmpMat3[0] = right[0]
    Quat.tmpMat3[3] = right[1]
    Quat.tmpMat3[6] = right[2]

    Quat.tmpMat3[1] = up[0]
    Quat.tmpMat3[4] = up[1]
    Quat.tmpMat3[7] = up[2]

    const vs = glmaths.LEFT_HANDED ? 1 : -1
    Quat.tmpMat3[2] = vs * view[0]
    Quat.tmpMat3[5] = vs * view[1]
    Quat.tmpMat3[8] = vs * view[2]

    return Quat.fromMat3(Quat.tmpMat3, out).normalize()
  }

  /**
   * Normalizes a quaternion
   *
   * @param {Quat} q the quaternion to normalize
   * @param {Quat} out the receiving vector, defaults to new quat()
   * @returns {Quat} out
   */
  static normalize(q: Quat, out = quat()): Quat {
    const x = q[0], y = q[1], z = q[2], w = q[3]
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
   * Normalizes a quaternion
   *
   * @param {Quat} out the receiving vector, defaults to new quat()
   * @returns {Quat} out
   */
  normalize(out = glmaths.ALWAYS_COPY ? quat() : this): Quat {
    return Quat.normalize(this, out)
  }

  /**
   * Creates a quaternion that looks along the given direction vector
   *
   * @param {Vec3} direction the direction to look along
   * @param {Vec3} up the up vector
   * @param {Quat} out the receiving quaternion, defaults to quat()
   * @returns {Quat} out
   */
  static quatLookAt(direction: Vec3, up: Vec3, out = quat()): Quat {
    const f = vec3(direction[0], direction[1], direction[2]).normalize()
    const s = Vec3.cross(f, up).normalize()
    const u = Vec3.cross(s, f)
    const m = new Mat3()
    const vs = glmaths.LEFT_HANDED ? 1 : -1
    m[0] = s[0]; m[1] = u[0]; m[2] = vs * f[0]
    m[3] = s[1]; m[4] = u[1]; m[5] = vs * f[1]
    m[6] = s[2]; m[7] = u[2]; m[8] = vs * f[2]
    return Quat.fromMat3(m, out)
  }

  /**
   * Extracts the pitch (rotation around X axis) from a quaternion
   *
   * @returns {Number} pitch in radians
   */
  pitch(): number {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    return Math.atan2(2 * (y * z + w * x), w * w - x * x - y * y + z * z)
  }

  /**
   * Extracts the yaw (rotation around Y axis) from a quaternion
   *
   * @returns {Number} yaw in radians
   */
  yaw(): number {
    return Math.asin(Math.min(Math.max(-2 * (this[0] * this[2] - this[3] * this[1]), -1), 1))
  }

  /**
   * Extracts the roll (rotation around Z axis) from a quaternion
   *
   * @returns {Number} roll in radians
   */
  roll(): number {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    return Math.atan2(2 * (x * y + w * z), w * w + x * x - y * y - z * z)
  }

  /**
   * Extracts Euler angles (pitch, yaw, roll) from a quaternion
   *
   * @param {Vec3} out the receiving vector, defaults to vec3()
   * @returns {Vec3} out with [pitch, yaw, roll] in radians
   */
  eulerAngles(out = new Vec3()): Vec3 {
    out[0] = this.pitch()
    out[1] = this.yaw()
    out[2] = this.roll()
    return out
  }

  /**
   * Converts a quaternion to a 3x3 rotation matrix
   *
   * @param {Mat3} out the receiving matrix, defaults to mat3()
   * @returns {Mat3} out
   */
  toMat3(out = new Mat3()): Mat3 {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, xy = x * y2, xz = x * z2
    const yy = y * y2, yz = y * z2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2
    out[0] = 1 - (yy + zz); out[1] = xy + wz; out[2] = xz - wy
    out[3] = xy - wz; out[4] = 1 - (xx + zz); out[5] = yz + wx
    out[6] = xz + wy; out[7] = yz - wx; out[8] = 1 - (xx + yy)
    return out
  }

  /**
   * Converts a quaternion to a 4x4 rotation matrix
   *
   * @param {Mat4} out the receiving matrix, defaults to mat4()
   * @returns {Mat4} out
   */
  toMat4(out = new Mat4()): Mat4 {
    const x = this[0], y = this[1], z = this[2], w = this[3]
    const x2 = x + x, y2 = y + y, z2 = z + z
    const xx = x * x2, xy = x * y2, xz = x * z2
    const yy = y * y2, yz = y * z2, zz = z * z2
    const wx = w * x2, wy = w * y2, wz = w * z2
    out[0] = 1 - (yy + zz); out[1] = xy + wz; out[2] = xz - wy; out[3] = 0
    out[4] = xy - wz; out[5] = 1 - (xx + zz); out[6] = yz + wx; out[7] = 0
    out[8] = xz + wy; out[9] = yz - wx; out[10] = 1 - (xx + yy); out[11] = 0
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1
    return out
  }
}

// @ts-ignore
export interface Quat {
  multiply: (b: Quat | number, out?: Quat) => Quat
  mult: (b: Quat | number, out?: Quat) => Quat
  mul: (b: Quat | number, out?: Quat) => Quat
  scale: (b: Quat | number, out?: Quat) => Quat
  times: (b: Quat | number, out?: Quat) => Quat
  str: () => string
  normalized: (out?: Quat) => Quat
}

// @aliases
Quat.getAngle = Quat.angle
Quat.prototype.mult = Quat.prototype.multiply
Quat.prototype.mul = Quat.prototype.multiply
Quat.prototype.scale = Quat.prototype.multiply
Quat.prototype.times = Quat.prototype.multiply
Quat.prototype.str = Quat.prototype.toString
Quat.prototype.normalized = Quat.prototype.normalize

const createQuat = 
  (x = 0, y = 0, z = 0, w = 1) => new Quat(x, y, z, w)
Object.setPrototypeOf(createQuat, Quat)
export const quat = createQuat as typeof createQuat & typeof Quat