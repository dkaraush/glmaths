import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { Mat2x3, mat2x3, vec2, Vec2 } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

describe('Mat2x3', () => {
  describe('constructor', () => {
    it('creates zero matrix by default', () => {
      const m = mat2x3()
      for (let i = 0; i < 6; i++) assert.strictEqual(m[i], 0)
    })
    it('creates with given values', () => {
      const m = mat2x3(1, 2, 3, 4, 5, 6)
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[5], 6)
    })
    it('extends Float32Array with length 6', () => {
      assert.ok(mat2x3() instanceof Float32Array)
      assert.strictEqual(mat2x3().length, 6)
    })
  })

  describe('identity', () => {
    it('creates identity', () => {
      const m = mat2x3.identity
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[1], 0)
      assert.strictEqual(m[2], 0)
      assert.strictEqual(m[3], 1)
      assert.strictEqual(m[4], 0)
      assert.strictEqual(m[5], 0)
    })
  })

  describe('determinant', () => {
    it('identity determinant is 1', () => {
      assert.strictEqual(mat2x3.identity.determinant(), 1)
    })
    it('calculates determinant', () => {
      const m = mat2x3(1, 2, 3, 4, 5, 6)
      assert.strictEqual(m.determinant(), 1 * 4 - 2 * 3)
    })
  })

  describe('invert', () => {
    it('inverts identity to identity', () => {
      const m = mat2x3.identity
      const out = mat2x3()
      m.invert(out)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[3], 1)
      assert.strictEqual(out[4], 0)
      assert.strictEqual(out[5], 0)
    })
    it('returns null for singular matrix', () => {
      const m = mat2x3(1, 2, 2, 4, 0, 0)
      assert.strictEqual(m.invert(mat2x3()), null)
    })
    it('inverse * original = identity (for the 2x2 part)', () => {
      const m = mat2x3(2, 1, 1, 3, 5, 7)
      const inv = mat2x3()
      m.invert(inv)
      const result = mat2x3()
      mat2x3.identity.multiply.call(m, inv!, result)
      closeTo(result[0], 1)
      closeTo(result[1], 0)
      closeTo(result[2], 0)
      closeTo(result[3], 1)
    })
  })

  describe('rotate', () => {
    it('rotates identity by PI/2', () => {
      const m = mat2x3.identity
      const r = m.rotate(Math.PI / 2)
      closeTo(r[0], 0)
      closeTo(r[1], 1)
      closeTo(r[2], -1)
      closeTo(r[3], 0)
    })
  })

  describe('scale', () => {
    it('scales identity', () => {
      const m = mat2x3.identity
      const r = m.scale(vec2(2, 3))
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[3], 3)
    })
  })

  describe('translate', () => {
    it('translates identity', () => {
      const m = mat2x3.identity
      const r = m.translate(vec2(5, 10))
      assert.strictEqual(r[4], 5)
      assert.strictEqual(r[5], 10)
    })
  })

  describe('static fromRotation', () => {
    it('creates rotation matrix', () => {
      const m = Mat2x3.fromRotation(Math.PI / 2)
      closeTo(m[0], 0)
      closeTo(m[1], 1)
      assert.strictEqual(m[4], 0)
      assert.strictEqual(m[5], 0)
    })
  })

  describe('static fromScaling', () => {
    it('creates scaling matrix', () => {
      const m = Mat2x3.fromScaling(vec2(2, 3))
      assert.strictEqual(m[0], 2)
      assert.strictEqual(m[3], 3)
    })
  })

  describe('static fromTranslation', () => {
    it('creates translation matrix', () => {
      const m = Mat2x3.fromTranslation(vec2(5, 10))
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[3], 1)
      assert.strictEqual(m[4], 5)
      assert.strictEqual(m[5], 10)
    })
  })

  describe('multiply', () => {
    it('identity * A = A', () => {
      const a = mat2x3(1, 2, 3, 4, 5, 6)
      const out = mat2x3()
      mat2x3.identity.multiply(a, out)
      for (let i = 0; i < 6; i++) assert.strictEqual(out[i], a[i])
    })
  })

  describe('plus / minus', () => {
    it('adds', () => {
      const a = mat2x3(1, 2, 3, 4, 5, 6)
      const b = mat2x3(6, 5, 4, 3, 2, 1)
      const out = mat2x3()
      a.plus(b, out)
      assert.strictEqual(out[0], 7)
      assert.strictEqual(out[5], 7)
    })
    it('subtracts', () => {
      const a = mat2x3(6, 5, 4, 3, 2, 1)
      const b = mat2x3(1, 2, 3, 4, 5, 6)
      const out = mat2x3()
      a.minus(b, out)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[5], -5)
    })
  })

  describe('equals / exactEquals', () => {
    it('exactEquals', () => {
      const a = mat2x3(1, 2, 3, 4, 5, 6)
      const b = mat2x3(1, 2, 3, 4, 5, 6)
      assert.strictEqual(a.exactEquals(b), true)
    })
    it('equals with epsilon', () => {
      const a = mat2x3(1, 2, 3, 4, 5, 6)
      const b = mat2x3(1 + glmaths.EPSILON * 0.1, 2, 3, 4, 5, 6)
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('toString', () => {
    it('returns string', () => {
      const m = mat2x3(1, 0, 0, 1, 0, 0)
      assert.ok(m.toString().includes('mat2x3'))
    })
  })

  describe('frob', () => {
    it('frobenius norm of identity', () => {
      closeTo(mat2x3.identity.frob(), Math.sqrt(3))
    })
  })

  describe('factory function', () => {
    it('creates Mat2x3', () => {
      const m = mat2x3(1, 0, 0, 1, 0, 0)
      assert.ok(m instanceof Mat2x3)
    })
  })

  describe('mat * vec operators', () => {
    it('Mat2x3 * Vec2 rotation + translation', () => {
      const m = Mat2x3.fromRotation(Math.PI / 3)
      m.translate(vec2(10, 20))
      const v = vec2(4, -1)
      const expected = v.transformMat2x3(m, vec2())
      const r = m * v
      assert.ok(r instanceof Vec2)
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
    })
    it('Mat2x3 * Vec2 scale + rotation + translation', () => {
      const m = mat2x3.identity
      m.scale(vec2(2, 3))
      m.rotate(Math.PI / 4)
      m.translate(vec2(5, 10))
      const v = vec2(3, 7)
      const expected = v.transformMat2x3(m, vec2())
      const r = m * v
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
    })
  })
})
