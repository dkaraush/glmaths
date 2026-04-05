import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { Vec2, vec2, Vec3, Mat2, Mat2x3, Mat3, Mat4 } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

const EPSILON = glmaths.EPSILON

describe('Vec2', () => {
  describe('constructor', () => {
    it('creates a zero vector by default', () => {
      const v = vec2()
      assert.strictEqual(v[0], 0)
      assert.strictEqual(v[1], 0)
    })
    it('creates a vector with given values', () => {
      const v = vec2(3, 4)
      assert.strictEqual(v[0], 3)
      assert.strictEqual(v[1], 4)
    })
    it('extends Float32Array with length 2', () => {
      const v = vec2()
      assert.ok(v instanceof Float32Array)
      assert.strictEqual(v.length, 2)
    })
  })

  describe('x/y getters and setters', () => {
    it('gets x and y', () => {
      const v = vec2(5, 6)
      assert.strictEqual(v.x, 5)
      assert.strictEqual(v.y, 6)
    })
    it('sets x and y', () => {
      const v = vec2()
      v.x = 10
      v.y = 20
      assert.strictEqual(v[0], 10)
      assert.strictEqual(v[1], 20)
    })
  })

  describe('static constants', () => {
    it('ZERO returns (0,0)', () => {
      const v = Vec2.ZERO
      assert.strictEqual(v[0], 0)
      assert.strictEqual(v[1], 0)
    })
    it('ONE returns (1,1)', () => {
      const v = Vec2.ONE
      assert.strictEqual(v[0], 1)
      assert.strictEqual(v[1], 1)
    })
  })

  describe('plus / add', () => {
    it('adds two vectors in-place', () => {
      const a = vec2(1, 2)
      const b = vec2(3, 4)
      const result = a.plus(b)
      assert.strictEqual(result[0], 4)
      assert.strictEqual(result[1], 6)
    })
    it('adds a scalar to both components', () => {
      const a = vec2(1, 2)
      const r = a.plus(5)
      assert.strictEqual(r[0], 6)
      assert.strictEqual(r[1], 7)
    })
    it('writes to out parameter without modifying this', () => {
      const a = vec2(1, 2)
      const b = vec2(3, 4)
      const out = vec2()
      const result = a.plus(b, out)
      assert.strictEqual(result, out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 6)
      assert.strictEqual(a[0], 1)
      assert.strictEqual(a[1], 2)
    })
    it('add alias works', () => {
      const a = vec2(1, 2)
      const b = vec2(3, 4)
      const out = vec2()
      a.add(b, out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 6)
    })
  })

  describe('minus / sub / subtract', () => {
    it('subtracts two vectors', () => {
      const a = vec2(5, 7)
      const b = vec2(2, 3)
      const out = vec2()
      a.minus(b, out)
      assert.strictEqual(out[0], 3)
      assert.strictEqual(out[1], 4)
    })
    it('subtracts a scalar', () => {
      const a = vec2(5, 7)
      const r = a.minus(2)
      assert.strictEqual(r[0], 3)
      assert.strictEqual(r[1], 5)
    })
  })

  describe('mult / mul / multiply / times', () => {
    it('multiplies component-wise', () => {
      const a = vec2(2, 3)
      const b = vec2(4, 5)
      const out = vec2()
      a.mult(b, out)
      assert.strictEqual(out[0], 8)
      assert.strictEqual(out[1], 15)
    })
    it('multiplies by scalar', () => {
      const a = vec2(2, 3)
      const r = a.mult(3)
      assert.strictEqual(r[0], 6)
      assert.strictEqual(r[1], 9)
    })
  })

  describe('div / divide', () => {
    it('divides component-wise', () => {
      const a = vec2(10, 20)
      const b = vec2(2, 5)
      const out = vec2()
      a.div(b, out)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[1], 4)
    })
    it('divides by scalar', () => {
      const a = vec2(10, 20)
      const r = a.div(2)
      assert.strictEqual(r[0], 5)
      assert.strictEqual(r[1], 10)
    })
  })

  describe('invDiv', () => {
    it('divides scalar by vector components', () => {
      const a = vec2(2, 4)
      const out = vec2()
      a.invDiv(8, out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 2)
    })
  })

  describe('scale', () => {
    it('scales by a number', () => {
      const a = vec2(2, 3)
      const r = a.scale(3)
      assert.strictEqual(r[0], 6)
      assert.strictEqual(r[1], 9)
    })
    it('scales by a vector', () => {
      const a = vec2(2, 3)
      const r = a.scale(vec2(4, 5))
      assert.strictEqual(r[0], 8)
      assert.strictEqual(r[1], 15)
    })
  })

  describe('negate', () => {
    it('negates components', () => {
      const a = vec2(3, -4)
      const r = a.negate()
      assert.strictEqual(r[0], -3)
      assert.strictEqual(r[1], 4)
    })
  })

  describe('normalize', () => {
    it('normalizes a vector to unit length', () => {
      const a = vec2(3, 4)
      const r = a.normalize()
      closeTo(r[0], 0.6)
      closeTo(r[1], 0.8)
      closeTo(r.len(), 1)
    })
    it('handles zero vector', () => {
      const a = vec2(0, 0)
      a.normalize()
      assert.strictEqual(a[0], 0)
      assert.strictEqual(a[1], 0)
    })
  })

  describe('len / squaredLength', () => {
    it('calculates length', () => {
      const a = vec2(3, 4)
      closeTo(a.len(), 5)
    })
    it('calculates squared length', () => {
      const a = vec2(3, 4)
      assert.strictEqual(a.squaredLength(), 25)
    })
    it('sqrLen alias works', () => {
      const a = vec2(3, 4)
      assert.strictEqual(a.sqrLen(), 25)
    })
  })

  describe('floor / round / ceil', () => {
    it('floors components', () => {
      const a = vec2(1.7, 2.3)
      const r = a.floor()
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 2)
    })
    it('rounds components', () => {
      const a = vec2(1.4, 2.6)
      const r = a.round()
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 3)
    })
    it('ceils components', () => {
      const a = vec2(1.1, 2.9)
      const r = a.ceil()
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 3)
    })
  })

  describe('equals / exactEquals', () => {
    it('returns true for equal vectors', () => {
      const a = vec2(1, 2)
      const b = vec2(1, 2)
      assert.strictEqual(a.exactEquals(b), true)
      assert.strictEqual(a.equals(b), true)
    })
    it('returns false for different vectors', () => {
      const a = vec2(1, 2)
      const b = vec2(1, 3)
      assert.strictEqual(a.exactEquals(b), false)
      assert.strictEqual(a.equals(b), false)
    })
    it('equals allows epsilon difference', () => {
      const a = vec2(1, 2)
      const b = vec2(1 + EPSILON * 0.5, 2)
      assert.strictEqual(a.exactEquals(b), false)
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('toString', () => {
    it('returns string representation', () => {
      const a = vec2(1, 2)
      assert.strictEqual(a.toString(), 'vec2(1, 2)')
    })
  })

  describe('clone', () => {
    it('creates an independent copy', () => {
      const a = vec2(1, 2)
      const b = a.clone()
      assert.strictEqual(b[0], 1)
      assert.strictEqual(b[1], 2)
      b[0] = 99
      assert.strictEqual(a[0], 1)
    })
  })

  describe('static methods', () => {
    it('dot product', () => {
      const a = vec2(1, 2)
      const b = vec2(3, 4)
      assert.strictEqual(Vec2.dot(a, b), 11)
    })
    it('cross product returns Vec3 with z = determinant', () => {
      const a = vec2(1, 0)
      const b = vec2(0, 1)
      const out = Vec2.cross(a, b)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 0)
      assert.strictEqual(out[2], 1)
    })
    it('cross product of parallel vectors is zero', () => {
      const a = vec2(2, 0)
      const b = vec2(5, 0)
      const out = Vec2.cross(a, b)
      assert.strictEqual(out[2], 0)
    })
    it('distance', () => {
      const a = vec2(0, 0)
      const b = vec2(3, 4)
      closeTo(Vec2.distance(a, b), 5)
    })
    it('squaredDistance', () => {
      const a = vec2(0, 0)
      const b = vec2(3, 4)
      assert.strictEqual(Vec2.squaredDistance(a, b), 25)
    })
    it('lerp', () => {
      const a = vec2(0, 0)
      const b = vec2(10, 20)
      const out = Vec2.lerp(a, b, 0.5)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[1], 10)
    })
    it('lerp at t=0 returns a', () => {
      const a = vec2(1, 2)
      const b = vec2(10, 20)
      const out = Vec2.lerp(a, b, 0)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
    })
    it('lerp at t=1 returns b', () => {
      const a = vec2(1, 2)
      const b = vec2(10, 20)
      const out = Vec2.lerp(a, b, 1)
      assert.strictEqual(out[0], 10)
      assert.strictEqual(out[1], 20)
    })
    it('max', () => {
      const a = vec2(1, 5)
      const b = vec2(3, 2)
      const out = Vec2.max(a, b)
      assert.strictEqual(out[0], 3)
      assert.strictEqual(out[1], 5)
    })
    it('min', () => {
      const a = vec2(1, 5)
      const b = vec2(3, 2)
      const out = Vec2.min(a, b)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
    })
    it('angle between two vectors', () => {
      const a = vec2(1, 0)
      const b = vec2(0, 1)
      closeTo(Vec2.angle(a, b), Math.PI / 2)
    })
    it('angle between parallel vectors is 0', () => {
      const a = vec2(1, 0)
      const b = vec2(5, 0)
      closeTo(Vec2.angle(a, b), 0)
    })
    it('rotate by 90 degrees', () => {
      const v = vec2(1, 0)
      const out = vec2()
      v.rotate(Math.PI / 2, Vec2.ZERO, out)
      closeTo(out[0], 0)
      closeTo(out[1], 1)
    })
    it('rotate with origin', () => {
      const v = vec2(2, 0)
      const origin = vec2(1, 0)
      const out = vec2()
      v.rotate(Math.PI / 2, origin, out)
      closeTo(out[0], 1)
      closeTo(out[1], 1)
    })
    it('rotate by 180 degrees', () => {
      const v = vec2(1, 0)
      const out = vec2()
      v.rotate(Math.PI, Vec2.ZERO, out)
      closeTo(out[0], -1)
      closeTo(out[1], 0)
    })
  })

  describe('factory function', () => {
    it('creates Vec2 with vec2()', () => {
      const v = vec2(3, 4)
      assert.ok(v instanceof Vec2)
      assert.strictEqual(v[0], 3)
      assert.strictEqual(v[1], 4)
    })
  })

  describe('unaryMinus / unaryPlus', () => {
    it('unaryMinus negates', () => {
      const a = vec2(3, -4)
      const out = vec2()
      a.unaryMinus(out)
      assert.strictEqual(out[0], -3)
      assert.strictEqual(out[1], 4)
    })
    it('unaryPlus returns this', () => {
      const a = vec2(3, -4)
      const r = a.unaryPlus()
      assert.strictEqual(r[0], 3)
      assert.strictEqual(r[1], -4)
    })
  })

  describe('scaleAndAdd', () => {
    it('adds scaled vector', () => {
      const a = vec2(1, 2)
      const b = vec2(3, 4)
      const out = vec2()
      a.scaleAndAdd(b, 2, out)
      closeTo(out[0], 7)
      closeTo(out[1], 10)
    })
    it('static version', () => {
      const out = Vec2.scaleAndAdd(vec2(1, 2), vec2(3, 4), 0.5)
      closeTo(out[0], 2.5)
      closeTo(out[1], 4)
    })
  })

  describe('abs', () => {
    it('absolute value of components', () => {
      const v = vec2(-3, -4)
      const out = vec2()
      v.abs(out)
      assert.strictEqual(out[0], 3)
      assert.strictEqual(out[1], 4)
    })
  })

  describe('transformMat2', () => {
    it('transforms by 2x2 matrix', () => {
      const v = vec2(1, 0)
      const m = new Mat2(0, 1, -1, 0) // 90 degree rotation
      const out = vec2()
      v.transformMat2(m, out)
      closeTo(out[0], 0)
      closeTo(out[1], 1)
    })
  })

  describe('transformMat2x3', () => {
    it('transforms by 2x3 affine matrix', () => {
      const v = vec2(1, 0)
      const m = Mat2x3.fromTranslation(vec2(10, 20))
      const out = vec2()
      v.transformMat2x3(m, out)
      closeTo(out[0], 11)
      closeTo(out[1], 20)
    })
  })

  describe('transformMat3', () => {
    it('transforms by 3x3 matrix', () => {
      const v = vec2(1, 0)
      const m = Mat3.fromTranslation(vec2(5, 10))
      const out = vec2()
      v.transformMat3(m, out)
      closeTo(out[0], 6)
      closeTo(out[1], 10)
    })
  })

  describe('transformMat4', () => {
    it('transforms by 4x4 matrix', () => {
      const v = vec2(1, 2)
      const m = Mat4.fromTranslation(new Vec3(10, 20, 0))
      const out = vec2()
      v.transformMat4(m, out)
      closeTo(out[0], 11)
      closeTo(out[1], 22)
    })
  })

  describe('reflect', () => {
    it('reflects a vector', () => {
      const I = vec2(1, -1)
      const N = vec2(0, 1)
      const out = Vec2.reflect(I, N)
      closeTo(out[0], 1)
      closeTo(out[1], 1)
    })
  })

  describe('GLSL functions', () => {
    it('clamp', () => {
      const v = vec2(-1, 5)
      const out = vec2()
      v.clamp(0, 1, out)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 1)
    })
    it('clamp with vectors', () => {
      const v = vec2(-1, 5)
      const out = Vec2.clamp(v, vec2(0, 0), vec2(2, 3))
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 3)
    })
    it('mix', () => {
      const a = vec2(0, 0)
      const b = vec2(10, 20)
      const out = vec2()
      a.mix(b, 0.5, out)
      closeTo(out[0], 5)
      closeTo(out[1], 10)
    })
    it('static mix', () => {
      const out = Vec2.mix(vec2(0, 0), vec2(10, 20), 0.25)
      closeTo(out[0], 2.5)
      closeTo(out[1], 5)
    })
    it('step', () => {
      const v = vec2(0.3, 0.7)
      const out = vec2()
      v.step(0.5, out)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 1)
    })
    it('smoothstep', () => {
      const v = vec2(0.5, 1.5)
      const out = vec2()
      v.smoothstep(0, 1, out)
      closeTo(out[0], 0.5)
      closeTo(out[1], 1)
    })
    it('fract', () => {
      const v = vec2(1.7, 2.3)
      const out = vec2()
      v.fract(out)
      closeTo(out[0], 0.7)
      closeTo(out[1], 0.3)
    })
    it('sign', () => {
      const v = vec2(-5, 3)
      const out = vec2()
      v.sign(out)
      assert.strictEqual(out[0], -1)
      assert.strictEqual(out[1], 1)
    })
    it('saturate', () => {
      const v = vec2(-0.5, 1.5)
      const out = vec2()
      v.saturate(out)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 1)
    })
  })
  describe('operators', () => {
    it('+', () => {
      const a = vec2(0, 1)
      const b = vec2(2, 3)
      const c = a + b
      assert.strictEqual(c.x, 2)
      assert.strictEqual(c.y, 4)
      let d = vec2(4, 5)
      d += vec2(8, 8)
      assert.strictEqual(d.x, 12)
      assert.strictEqual(d.y, 13)
    })
    it('-', () => {
      const a = vec2(0, 1)
      const b = vec2(2, 3)
      let c = a - b
      assert.strictEqual(c.x, -2)
      assert.strictEqual(c.y, -2)
      c -= vec2(10, 20)
      assert.strictEqual(c.x, -12)
      assert.strictEqual(c.y, -22)
    })
    it('*', () => {
      const a = vec2(0, 1)
      const b = vec2(2, 3)
      let c = a * b
      assert.strictEqual(c.x, 0)
      assert.strictEqual(c.y, 3)
      c *= vec2(10)
      assert.strictEqual(c.x, 0)
      assert.strictEqual(c.y, 30)
    })
    it('/', () => {
      const a = vec2(0, 1)
      const b = vec2(2, 3)
      let c = a / b
      assert.strictEqual(c.x, 0)
      closeTo(c.y, 1 / 3)
      c /= 1 / 3
      assert.strictEqual(c.x, 0)
      closeTo(c.y, 1)
    })
    it('%', () => {
      const a = vec2(0, 3)
      const b = vec2(2, 2)
      const c = a % b
      assert.strictEqual(c.x, 0)
      assert.strictEqual(c.y, 1)
      let d = vec2(2, 5)
      d %= b
      assert.strictEqual(d.x, 0)
      assert.strictEqual(d.y, 1)
    })
    it('==', () => {
      const a = vec2(0, 3)
      assert.strictEqual(a == a, true)
      assert.strictEqual(vec2(0, 3) == vec2(0, 3), true)
      assert.strictEqual(vec2(0, 3.0000005) == vec2(0, 3), true)
      assert.strictEqual(vec2(0, 30) == vec2(0, 3), false)

      assert.strictEqual(a != a, false)
      assert.strictEqual(vec2(0, 3) != vec2(0, 3), false)
      assert.strictEqual(vec2(0, 3.0000005) != vec2(0, 3), false)
      assert.strictEqual(vec2(0, 30) != vec2(0, 3), true)
    })
    it('===', () => {
      const a = vec2(0, 3)
      assert.strictEqual(a === a, true)
      assert.strictEqual(vec2(0, 3) === vec2(0, 3), true)
      assert.strictEqual(vec2(3, 0) === vec2(0, 3), false)
      assert.strictEqual(vec2(0, 3.0000005) === vec2(0, 3), false)
      assert.strictEqual(vec2(0, 30) === vec2(0, 3), false)

      assert.strictEqual(a !== a, false)
      assert.strictEqual(vec2(0, 3) !== vec2(0, 3), false)
      assert.strictEqual(vec2(3, 0) !== vec2(0, 3), true)
      assert.strictEqual(vec2(0, 3.0000005) !== vec2(0, 3), true)
      assert.strictEqual(vec2(0, 30) !== vec2(0, 3), true)
    })
  })
})
