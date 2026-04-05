import { Vec2 } from './vec2'
import { Vec3 } from './vec3'
import { Vec4 } from './vec4'
import { Quat } from './quat'
import { Quat2 } from './quat2'
import { Mat2 } from './mat2'
import { Mat2x3 } from './mat2x3'
import { Mat3 } from './mat3'
import { Mat4 } from './mat4'

export type Vec = Vec2 | Vec3 | Vec4
export type Vector = Vec
export type Mat = Mat2 | Mat2x3 | Mat3 | Mat4
export type GenType = Vec | Mat | Quat | Quat2

function makeArr<T extends GenType>(a: T): T {
  if (a instanceof Vec2)   return new Vec2()   as unknown as T
  if (a instanceof Vec3)   return new Vec3()   as unknown as T
  if (a instanceof Vec4)   return new Vec4()   as unknown as T
  if (a instanceof Mat2)   return new Mat2()   as unknown as T
  if (a instanceof Mat2x3) return new Mat2x3() as unknown as T
  if (a instanceof Mat3)   return new Mat3()   as unknown as T
  if (a instanceof Mat4)   return new Mat4()   as unknown as T
  if (a instanceof Quat)   return new Quat()   as unknown as T
  if (a instanceof Quat2)  return new Quat2()  as unknown as T
  if (a instanceof Float32Array) return new Float32Array() as unknown as T
  throw `unknown type`
}

function calc1<T extends number | GenType>(
  fn: (x: number, i: number) => number,
  x: T,
  out?: T extends GenType ? T : never
) {
  if (typeof x === 'number') 
    return fn(x, 0)
  const xArr = x as GenType
  const outArr = (out && out.length === xArr.length ? out : makeArr(xArr)) as GenType
  for (let i = 0; i < xArr.length; ++i)
    outArr[i] = fn(xArr[i], i)
  return outArr as T
}

/**
 * Converts degrees to radians
 *
 * @param {Number} degrees angle in degrees
 * @returns {Number} angle in radians
 */
export function radians(degrees: number): number
export function radians<T extends GenType>(degrees: T, out?: T): T
export function radians<T extends number | GenType>(degrees: T, out?: T extends GenType ? T : never) {
  return calc1<T>(x => x / 180.0 * Math.PI, degrees, out)
}
export const rad = radians
export const toRadians = radians

/**
 * Converts radians to degrees
 *
 * @param {Number} radians angle in radians
 * @returns {Number} angle in degrees
 */
export function degrees(radians: number): number
export function degrees<T extends GenType>(radians: T, out?: T): T
export function degrees<T extends number | GenType>(radians: T, out?: T extends GenType ? T : never) {
  return calc1<T>(x => x / Math.PI * 180.0, radians, out)
}
export const deg = degrees
export const toDegrees = degrees

/**
 * Rounds a number to the nearest integer, with half-values rounding away from zero
 *
 * @param {Number} x the value to round
 * @returns {Number} the rounded value
 */
export function round(x: number): number
export function round<T extends GenType>(x: T, out?: T): T
export function round<T extends number | GenType>(x: T, out?: T extends GenType ? T : never) {
  return calc1<T>(x => x >= 0 ? Math.round(x) : x % 0.5 === 0 ? Math.floor(x) : Math.round(x), x, out)
}

/**
 * Clamps a number between a minimum and maximum value
 *
 * @param {Number} x the value to clamp
 * @param {Number} min the minimum value
 * @param {Number} max the maximum value
 * @returns {Number} the clamped value
 */
export function clamp(x: number, min: number, max: number): number
export function clamp<T extends GenType>(x: T, min: number, max: number, out?: T): T
export function clamp<T extends number | GenType>(
  x: T,
  min: number, max: number,
  out?: T extends GenType ? T : never
) {
  return calc1<T>(x => Math.min(Math.max(x, min), max), x, out)
}

/**
 * Clamps a number between 0 and 1
 *
 * @param {Number} x the value to clamp
 * @returns {Number} the clamped value in the range [0, 1]
 */
export function clamp01(x: number): number
export function clamp01<T extends GenType>(x: T, out?: T): T
export function clamp01<T extends number | GenType>(
  x: T,
  out?: T extends GenType ? T : never
) {
  return calc1<T>(x => Math.min(Math.max(x, 0), 1), x, out)
}
export const saturate = clamp01

/**
 * Performs a linear interpolation between two values
 *
 * @param {Number | Float32Array} x the first value
 * @param {Number | Float32Array} y the second value
 * @param {Number} a interpolation amount in the range [0, 1]
 * @param {Float32Array} out if given Float32Array, puts result in out
 * @returns {Number | Float32Array} the interpolated value
 */
export function mix(x: number, y: number, a: number): number
export function mix<T extends GenType>(x: T, y: T, a: number, out?: T): T
export function mix<T extends number | GenType>(
  x: T, y: T, t: number,
  out?: T extends GenType ? T : never
) {
  if (typeof x === 'number')
    return x * (1 - t) + (y as number) * t
  const xArr = x as GenType
  const yArr = y as GenType
  const outArr = (out && out.length === xArr.length ? out : makeArr(xArr)) as GenType
  if (xArr.length !== yArr.length)
    throw `${xArr.length} length != ${yArr} length`
  for (let i = 0; i < xArr.length; ++i)
    outArr[i] = xArr[i] * (1 - t) + yArr[i] * t
  return outArr
}
export const lerp = mix

/**
 * Returns 0 if x is less than edge, otherwise returns 1
 *
 * @param {Number} edge the threshold value
 * @param {Number} x the value to test
 * @returns {Number} 0 or 1
 */
export function step(edge: number, x: number): number
export function step<T extends GenType>(edge: number, x: T, out?: T): T
export function step<T extends GenType>(edge: T, x: T, out?: T): T
export function step<T extends number | GenType>(edge: T, x: T, out?: T extends GenType ? T : never) {
  if (typeof x === 'number' && typeof edge === 'number')
    return x < edge ? 0 : 1
  const xArr = x as GenType
  const outArr = (out && out.length === xArr.length ? out : makeArr(xArr)) as GenType
  if (typeof edge === 'number') {
    for (let i = 0; i < xArr.length; ++i)
      outArr[i] = xArr[i] < edge ? 0 : 1
    return outArr as T
  }
  const edgeArr = edge as GenType
  if (xArr.length !== edgeArr.length)
    throw `${xArr.length} length != ${edgeArr} length`
  for (let i = 0; i < xArr.length; ++i)
    outArr[i] = xArr[i] < edgeArr[i] ? 0 : 1
  return outArr as T
}

/**
 * Performs Hermite interpolation between two values
 *
 * @param {Number} edge0 the lower edge of the Hermite function
 * @param {Number} edge1 the upper edge of the Hermite function
 * @param {Number} x the source value for interpolation
 * @returns {Number} the interpolated value in the range [0, 1]
 */
export function smoothstep(edge0: number, edge1: number, x: number): number
export function smoothstep<T extends GenType>(edge0: T, edge1: T, x: number, out?: T): T
export function smoothstep<T extends GenType>(edge0: T, edge1: T, x: T, out?: T): T
export function smoothstep<T extends number | GenType>(edge0: T, edge1: T, x: T, out?: T extends GenType ? T : never) {
  if (typeof edge0 === 'number' && typeof x === 'number') {
    const t = clamp((x - edge0) / (edge1 as number - edge0), 0, 1)
    return t * t * (3 - 2 * t)
  }
  const aArr = edge0 as GenType
  const bArr = edge1 as GenType
  if (aArr.length !== bArr.length)
    throw `${aArr.length} length != ${bArr} length`
  const outArr = (out && out.length === aArr.length ? out : makeArr(aArr)) as GenType
  if (typeof x === 'number') {
    for (let i = 0; i < aArr.length; ++i) {
      const a = aArr[i]
      const t = clamp((x - a) / (bArr[i] - a), 0, 1)
      outArr[i] = t * t * (3 - 2 * t)
    }
    return outArr as T
  }
  const xArr = x as GenType
  if (xArr.length !== aArr.length)
    throw `${xArr.length} length != ${aArr} length`
  for (let i = 0; i < aArr.length; ++i) {
    const a = aArr[i]
    const t = clamp((xArr[i] - a) / (bArr[i] - a), 0, 1)
    outArr[i] = t * t * (3 - 2 * t)
  }
  return outArr as T
}

/**
 * Returns the fractional part of a number
 *
 * @param {Number} x the value
 * @returns {Number} the fractional part of x
 */
export function fract(x: number): number
export function fract<T extends GenType>(x: T, out?: T): T
export function fract<T extends number | GenType>(x: T, out?: T extends GenType ? T : never) {
  return calc1<T>(x => x - Math.floor(x), x, out)
}

/**
 * Returns the sign of a number
 *
 * @param {Number} x the value
 * @returns {Number} -1, 0, or 1
 */
export function sign(x: number): number
export function sign<T extends GenType>(x: T, out?: T): T
export function sign<T extends number | GenType>(x: T, out?: T extends GenType ? T : never) {
  return calc1<T>(x => x > 0 ? 1 : x < 0 ? -1 : 0, x, out)
}

/**
 * Returns the absolute value of the components of a number or vector
 *
 * @param {Number} x the value
 * @returns {Number} -1, 0, or 1
 */
export function abs(x: number): number
export function abs<T extends GenType>(x: T, out?: T): T
export function abs<T extends number | GenType>(x: T, out?: T extends GenType ? T : never) {
  return calc1<T>(x => Math.abs(x), x, out)
}