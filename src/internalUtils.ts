import glmaths from '.'
import { Vec2 } from './vec2'
import { Vec3 } from './vec3'
import { Vec4 } from './vec4'

export function equals(a: number, b: number) {
  return Math.abs(a - b) <= glmaths.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b))
}
export function defineSwizzles(prototype: any, N = 4, S = ['xyzw', 'rgba', 'stpq', 'uv']) {
  // let code = `interface Vec${N}Class {`
  for (let s of S) {
    // code += '\n '
    for (let n = 2; n <= N; ++n) {
      const sn = `01${s.substring(0, n)}`
      switch (n) {
        case 2:
          for (let a = 0; a < sn.length; ++a)
          for (let b = 0; b < sn.length; ++b) {
            const key = `${sn[a]}${sn[b]}`
            if (/^[01]/.test(key) || Object.prototype.hasOwnProperty.call(prototype, key))
              continue
            // code += ` ${key}: Vec2;`
            Object.defineProperty(prototype, key, {
              get() {
                return new Vec2(
                  a < 2 ? a : this[a - 2],
                  b < 2 ? b : this[b - 2]
                )
              }
            })
          }
          break
        case 3:
          for (let a = 0; a < sn.length; ++a)
          for (let b = 0; b < sn.length; ++b)
          for (let c = 0; c < sn.length; ++c) {
            const key = `${sn[a]}${sn[b]}${sn[c]}`
            if (/^[01]/.test(key) || Object.prototype.hasOwnProperty.call(prototype, key))
              continue
            // code += ` ${key}: Vec3;`
            Object.defineProperty(prototype, key, {
              get() {
                return new Vec3(
                  a < 2 ? a : this[a - 2],
                  b < 2 ? b : this[b - 2],
                  c < 2 ? c : this[c - 2]
                )
              }
            })
          }
          break
        case 4:
          for (let a = 0; a < sn.length; ++a)
          for (let b = 0; b < sn.length; ++b)
          for (let c = 0; c < sn.length; ++c)
          for (let d = 0; d < sn.length; ++d) {
            const key = `${sn[a]}${sn[b]}${sn[c]}${sn[d]}`
            if (/^[01]/.test(key) || Object.prototype.hasOwnProperty.call(prototype, key))
              continue
            // code += ` ${key}: Vec4;`
            Object.defineProperty(prototype, key, {
              get() {
                return new Vec4(
                  a < 2 ? a : this[a - 2],
                  b < 2 ? b : this[b - 2],
                  c < 2 ? c : this[c - 2],
                  d < 2 ? d : this[d - 2]
                )
              }
            })
          }
          break
      }
    }
  }
  // code += '\n}'
  // console.log(code)
}