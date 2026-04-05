import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { Vec4, vec4, Mat4, Quat } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

const EPSILON = glmaths.EPSILON

describe('Vec4', () => {
  describe('constructor', () => {
    it('creates zero vector by default', () => {
      const v = new Vec4()
      assert.strictEqual(v[0], 0)
      assert.strictEqual(v[1], 0)
      assert.strictEqual(v[2], 0)
      assert.strictEqual(v[3], 0)
    })
    it('creates with given values', () => {
      const v = new Vec4(1, 2, 3, 4)
      assert.strictEqual(v[0], 1)
      assert.strictEqual(v[1], 2)
      assert.strictEqual(v[2], 3)
      assert.strictEqual(v[3], 4)
    })
    it('extends Float32Array with length 4', () => {
      assert.ok(new Vec4() instanceof Float32Array)
      assert.strictEqual(new Vec4().length, 4)
    })
  })

  describe('x/y/z/w getters and setters', () => {
    it('gets and sets', () => {
      const v = new Vec4()
      v.x = 1; v.y = 2; v.z = 3; v.w = 4
      assert.strictEqual(v.x, 1)
      assert.strictEqual(v.y, 2)
      assert.strictEqual(v.z, 3)
      assert.strictEqual(v.w, 4)
    })
  })

  describe('static constants', () => {
    it('ZERO', () => {
      const v = Vec4.ZERO
      assert.strictEqual(v[0], 0)
      assert.strictEqual(v[1], 0)
      assert.strictEqual(v[2], 0)
      assert.strictEqual(v[3], 0)
    })
    it('ONE', () => {
      const v = Vec4.ONE
      assert.strictEqual(v[0], 1)
      assert.strictEqual(v[1], 1)
      assert.strictEqual(v[2], 1)
      assert.strictEqual(v[3], 1)
    })
  })

  describe('arithmetic', () => {
    it('plus with vector', () => {
      const a = new Vec4(1, 2, 3, 4)
      const b = new Vec4(5, 6, 7, 8)
      const out = new Vec4()
      a.plus(b, out)
      assert.strictEqual(out[0], 6)
      assert.strictEqual(out[1], 8)
      assert.strictEqual(out[2], 10)
      assert.strictEqual(out[3], 12)
    })
    it('plus with scalar', () => {
      const a = new Vec4(1, 2, 3, 4)
      const r = a.plus(10)
      assert.strictEqual(r[0], 11)
      assert.strictEqual(r[1], 12)
      assert.strictEqual(r[2], 13)
      assert.strictEqual(r[3], 14)
    })
    it('minus', () => {
      const a = new Vec4(5, 7, 9, 11)
      const b = new Vec4(1, 2, 3, 4)
      const out = new Vec4()
      a.minus(b, out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 5)
      assert.strictEqual(out[2], 6)
      assert.strictEqual(out[3], 7)
    })
    it('mult with vector', () => {
      const a = new Vec4(2, 3, 4, 5)
      const b = new Vec4(6, 7, 8, 9)
      const out = new Vec4()
      a.mult(b, out)
      assert.strictEqual(out[0], 12)
      assert.strictEqual(out[1], 21)
      assert.strictEqual(out[2], 32)
      assert.strictEqual(out[3], 45)
    })
    it('div with scalar', () => {
      const a = new Vec4(10, 20, 30, 40)
      const r = a.div(10)
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 2)
      assert.strictEqual(r[2], 3)
      assert.strictEqual(r[3], 4)
    })
    it('scale with number', () => {
      const a = new Vec4(1, 2, 3, 4)
      const r = a.scale(2)
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 4)
      assert.strictEqual(r[2], 6)
      assert.strictEqual(r[3], 8)
    })
    it('scale with vector', () => {
      const a = new Vec4(1, 2, 3, 4)
      const r = a.scale(new Vec4(2, 3, 4, 5))
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 6)
      assert.strictEqual(r[2], 12)
      assert.strictEqual(r[3], 20)
    })
  })

  describe('negate', () => {
    it('negates all components', () => {
      const a = new Vec4(1, -2, 3, -4)
      const r = a.negate()
      assert.strictEqual(r[0], -1)
      assert.strictEqual(r[1], 2)
      assert.strictEqual(r[2], -3)
      assert.strictEqual(r[3], 4)
    })
  })

  describe('normalize', () => {
    it('normalizes to unit length', () => {
      const a = new Vec4(1, 2, 3, 4)
      const r = a.normalize()
      closeTo(r.len(), 1)
    })
    it('handles zero vector', () => {
      const a = new Vec4(0, 0, 0, 0)
      a.normalize()
      assert.strictEqual(a[0], 0)
    })
  })

  describe('len / squaredLength', () => {
    it('length of (1,0,0,0) is 1', () => {
      assert.strictEqual(new Vec4(1, 0, 0, 0).len(), 1)
    })
    it('squared length', () => {
      assert.strictEqual(new Vec4(1, 2, 3, 4).squaredLength(), 30)
    })
  })

  describe('floor / round / ceil', () => {
    it('floor', () => {
      const v = new Vec4(1.7, 2.3, 3.9, 4.1)
      const r = v.floor()
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 2)
      assert.strictEqual(r[2], 3)
      assert.strictEqual(r[3], 4)
    })
    it('round', () => {
      const v = new Vec4(1.4, 2.6, 3.5, 4.1)
      const r = v.round()
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 3)
      assert.strictEqual(r[2], 4)
      assert.strictEqual(r[3], 4)
    })
    it('ceil', () => {
      const v = new Vec4(1.1, 2.0, 3.9, 4.01)
      const r = v.ceil()
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 2)
      assert.strictEqual(r[2], 4)
      assert.strictEqual(r[3], 5)
    })
  })

  describe('inverse', () => {
    it('inverts components', () => {
      const v = new Vec4(2, 4, 5, 10)
      const r = v.inverse()
      closeTo(r[0], 0.5)
      closeTo(r[1], 0.25)
      closeTo(r[2], 0.2)
      closeTo(r[3], 0.1)
    })
  })

  describe('clone / toString', () => {
    it('clones independently', () => {
      const a = new Vec4(1, 2, 3, 4)
      const b = a.clone()
      b[0] = 99
      assert.strictEqual(a[0], 1)
    })
    it('toString', () => {
      assert.strictEqual(new Vec4(1, 2, 3, 4).toString(), 'vec4(1, 2, 3, 4)')
    })
  })

  describe('equals / exactEquals', () => {
    it('exactEquals', () => {
      assert.strictEqual(new Vec4(1, 2, 3, 4).exactEquals(new Vec4(1, 2, 3, 4)), true)
      assert.strictEqual(new Vec4(1, 2, 3, 4).exactEquals(new Vec4(1, 2, 3, 5)), false)
    })
    it('equals with epsilon', () => {
      const a = new Vec4(1, 2, 3, 4)
      const b = new Vec4(1 + EPSILON * 0.1, 2, 3, 4)
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('static dot', () => {
    it('calculates dot product', () => {
      const a = new Vec4(1, 2, 3, 4)
      const b = new Vec4(5, 6, 7, 8)
      assert.strictEqual(Vec4.dot(a, b), 70)
    })
  })

  describe('static lerp', () => {
    it('interpolates at t=0.5', () => {
      const out = Vec4.lerp(new Vec4(0, 0, 0, 0), new Vec4(10, 20, 30, 40), 0.5)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[1], 10)
      assert.strictEqual(out[2], 15)
      assert.strictEqual(out[3], 20)
    })
  })

  describe('static distance / squaredDistance', () => {
    it('distance', () => {
      const a = new Vec4(0, 0, 0, 0)
      const b = new Vec4(1, 0, 0, 0)
      assert.strictEqual(Vec4.distance(a, b), 1)
    })
    it('squaredDistance', () => {
      const a = new Vec4(0, 0, 0, 0)
      const b = new Vec4(1, 2, 3, 4)
      assert.strictEqual(Vec4.squaredDistance(a, b), 30)
    })
  })

  describe('static max / min', () => {
    it('max', () => {
      const out = Vec4.max(new Vec4(1, 5, 3, 7), new Vec4(3, 2, 6, 4))
      assert.strictEqual(out[0], 3)
      assert.strictEqual(out[1], 5)
      assert.strictEqual(out[2], 6)
      assert.strictEqual(out[3], 7)
    })
    it('min', () => {
      const out = Vec4.min(new Vec4(1, 5, 3, 7), new Vec4(3, 2, 6, 4))
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
      assert.strictEqual(out[3], 4)
    })
  })

  describe('scaleAndAdd', () => {
    it('adds scaled vector', () => {
      const a = new Vec4(1, 2, 3, 4)
      const b = new Vec4(1, 1, 1, 1)
      const out = new Vec4()
      a.scaleAndAdd(b, 3, out)
      closeTo(out[0], 4)
      closeTo(out[1], 5)
      closeTo(out[2], 6)
      closeTo(out[3], 7)
    })
    it('static version', () => {
      const out = Vec4.scaleAndAdd(new Vec4(1, 2, 3, 4), new Vec4(2, 2, 2, 2), 0.5)
      closeTo(out[0], 2)
      closeTo(out[1], 3)
      closeTo(out[2], 4)
      closeTo(out[3], 5)
    })
  })

  describe('abs', () => {
    it('absolute value of components', () => {
      const v = new Vec4(-1, -2, 3, -4)
      const out = new Vec4()
      v.abs(out)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
      assert.strictEqual(out[3], 4)
    })
  })

  describe('transformMat4', () => {
    it('identity transform', () => {
      const v = new Vec4(1, 2, 3, 1)
      const out = new Vec4()
      v.transformMat4(Mat4.identity, out)
      closeTo(out[0], 1)
      closeTo(out[1], 2)
      closeTo(out[2], 3)
      closeTo(out[3], 1)
    })
  })

  describe('transformQuat', () => {
    it('identity quat leaves vector unchanged', () => {
      const v = new Vec4(1, 2, 3, 4)
      const out = new Vec4()
      v.transformQuat(Quat.identity, out)
      closeTo(out[0], 1)
      closeTo(out[1], 2)
      closeTo(out[2], 3)
      closeTo(out[3], 4) // w preserved
    })
  })

  describe('GLSL functions', () => {
    it('clamp', () => {
      const v = new Vec4(-1, 0.5, 2, 0.5)
      const out = new Vec4()
      v.clamp(0, 1, out)
      assert.strictEqual(out[0], 0)
      closeTo(out[1], 0.5)
      assert.strictEqual(out[2], 1)
      closeTo(out[3], 0.5)
    })
    it('mix', () => {
      const a = new Vec4(0, 0, 0, 0)
      const b = new Vec4(10, 20, 30, 40)
      const out = new Vec4()
      a.mix(b, 0.5, out)
      closeTo(out[0], 5)
      closeTo(out[1], 10)
      closeTo(out[2], 15)
      closeTo(out[3], 20)
    })
    it('step', () => {
      const v = new Vec4(0.3, 0.5, 0.7, 1.0)
      const out = new Vec4()
      v.step(0.5, out)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 1)
      assert.strictEqual(out[2], 1)
      assert.strictEqual(out[3], 1)
    })
    it('fract', () => {
      const v = new Vec4(1.7, 2.3, 3.9, 0.1)
      const out = new Vec4()
      v.fract(out)
      closeTo(out[0], 0.7)
      closeTo(out[1], 0.3)
      closeTo(out[2], 0.9)
      closeTo(out[3], 0.1)
    })
    it('sign', () => {
      const v = new Vec4(-5, 0, 3, -1)
      const out = new Vec4()
      v.sign(out)
      assert.strictEqual(out[0], -1)
      assert.strictEqual(out[1], 0)
      assert.strictEqual(out[2], 1)
      assert.strictEqual(out[3], -1)
    })
    it('saturate', () => {
      const v = new Vec4(-0.5, 0.5, 1.5, 0)
      const out = new Vec4()
      v.saturate(out)
      assert.strictEqual(out[0], 0)
      closeTo(out[1], 0.5)
      assert.strictEqual(out[2], 1)
      assert.strictEqual(out[3], 0)
    })
  })

  describe('factory function', () => {
    it('creates Vec4', () => {
      const v = vec4(1, 2, 3, 4)
      assert.ok(v instanceof Vec4)
    })
  })
})
