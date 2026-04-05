import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { mat2, Mat2, vec2, Vec2 } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) { const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2; assert.ok(pass, `expected ${actual} to be close to ${expected}`) }

describe('Mat2', () => {
  describe('constructor', () => {
    it('creates zero matrix by default', () => {
      const m = mat2()
      assert.strictEqual(m[0], 0)
      assert.strictEqual(m[1], 0)
      assert.strictEqual(m[2], 0)
      assert.strictEqual(m[3], 0)
    })
    it('creates with given values', () => {
      const m = mat2(1, 2, 3, 4)
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[1], 2)
      assert.strictEqual(m[2], 3)
      assert.strictEqual(m[3], 4)
    })
    it('extends Float32Array with length 4', () => {
      assert.ok(mat2() instanceof Float32Array)
      assert.strictEqual(mat2().length, 4)
    })
  })

  describe('identity', () => {
    it('creates identity matrix', () => {
      const m = mat2.identity
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[1], 0)
      assert.strictEqual(m[2], 0)
      assert.strictEqual(m[3], 1)
    })
  })

  describe('clone', () => {
    it('creates independent copy', () => {
      const a = mat2(1, 2, 3, 4)
      const b = a.clone()
      assert.strictEqual(b[0], 1)
      b[0] = 99
      assert.strictEqual(a[0], 1)
    })
  })

  describe('transpose', () => {
    it('transposes in-place', () => {
      const m = mat2(1, 2, 3, 4)
      const r = m.transpose()
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 3)
      assert.strictEqual(r[2], 2)
      assert.strictEqual(r[3], 4)
    })
    it('transposes to out', () => {
      const m = mat2(1, 2, 3, 4)
      const out = mat2()
      m.transpose(out)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 3)
      assert.strictEqual(out[2], 2)
      assert.strictEqual(out[3], 4)
    })
  })

  describe('invert', () => {
    it('inverts a matrix', () => {
      const m = mat2.identity
      const inv = m.invert()
      assert.notStrictEqual(inv, null)
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[3], 1)
    })
    it('inverts correctly', () => {
      const m = mat2(1, 2, 3, 4)
      const out = mat2()
      m.invert(out)
      // m * m^-1 = identity
      const result = m.multiply(out!, mat2())
      closeTo(result[0], 1)
      closeTo(result[1], 0)
      closeTo(result[2], 0)
      closeTo(result[3], 1)
    })
    it('returns null for singular matrix', () => {
      const m = mat2(1, 2, 2, 4)
      assert.strictEqual(m.invert(mat2()), null)
    })
  })

  describe('adjoint', () => {
    it('calculates adjugate', () => {
      const m = mat2(1, 2, 3, 4)
      const out = mat2()
      m.adjoint(out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], -2)
      assert.strictEqual(out[2], -3)
      assert.strictEqual(out[3], 1)
    })
  })

  describe('determinant', () => {
    it('calculates determinant', () => {
      const m = mat2(1, 2, 3, 4)
      assert.strictEqual(m.determinant(), -2)
    })
    it('identity determinant is 1', () => {
      assert.strictEqual(mat2.identity.determinant(), 1)
    })
  })

  describe('rotate', () => {
    it('rotates identity by 90 degrees', () => {
      const m = mat2.identity
      const r = m.rotate(Math.PI / 2)
      closeTo(r[0], 0)
      closeTo(r[1], 1)
      closeTo(r[2], -1)
      closeTo(r[3], 0)
    })
  })

  describe('scale', () => {
    it('scales identity matrix', () => {
      const m = mat2.identity
      const r = m.scale(vec2(2, 3))
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 0)
      assert.strictEqual(r[2], 0)
      assert.strictEqual(r[3], 3)
    })
  })

  describe('static fromRotation', () => {
    it('creates rotation matrix', () => {
      const m = mat2.fromRotation(Math.PI / 2)
      closeTo(m[0], 0)
      closeTo(m[1], 1)
      closeTo(m[2], -1)
      closeTo(m[3], 0)
    })
  })

  describe('static fromScaling', () => {
    it('creates scaling matrix', () => {
      const m = mat2.fromScaling(vec2(2, 3))
      assert.strictEqual(m[0], 2)
      assert.strictEqual(m[1], 0)
      assert.strictEqual(m[2], 0)
      assert.strictEqual(m[3], 3)
    })
  })

  describe('multiply', () => {
    it('multiplies two matrices', () => {
      const a = mat2(1, 2, 3, 4)
      const b = mat2(5, 6, 7, 8)
      const out = mat2()
      a.multiply(b, out)
      assert.strictEqual(out[0], 1 * 5 + 3 * 6)
      assert.strictEqual(out[1], 2 * 5 + 4 * 6)
      assert.strictEqual(out[2], 1 * 7 + 3 * 8)
      assert.strictEqual(out[3], 2 * 7 + 4 * 8)
    })
    it('identity * A = A', () => {
      const a = mat2(1, 2, 3, 4)
      const out = mat2()
      mat2.identity.multiply(a, out)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
      assert.strictEqual(out[3], 4)
    })
  })

  describe('plus / minus', () => {
    it('adds matrices', () => {
      const a = mat2(1, 2, 3, 4)
      const b = mat2(5, 6, 7, 8)
      const out = mat2()
      a.plus(b, out)
      assert.strictEqual(out[0], 6)
      assert.strictEqual(out[1], 8)
      assert.strictEqual(out[2], 10)
      assert.strictEqual(out[3], 12)
    })
    it('subtracts matrices', () => {
      const a = mat2(5, 6, 7, 8)
      const b = mat2(1, 2, 3, 4)
      const out = mat2()
      a.minus(b, out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 4)
      assert.strictEqual(out[2], 4)
      assert.strictEqual(out[3], 4)
    })
  })

  describe('scaleScalar', () => {
    it('scales all elements', () => {
      const m = mat2(1, 2, 3, 4)
      const r = m.scaleScalar(2)
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 4)
      assert.strictEqual(r[2], 6)
      assert.strictEqual(r[3], 8)
    })
  })

  describe('equals / exactEquals', () => {
    it('exactEquals', () => {
      assert.strictEqual(mat2(1, 2, 3, 4).exactEquals(mat2(1, 2, 3, 4)), true)
      assert.strictEqual(mat2(1, 2, 3, 4).exactEquals(mat2(1, 2, 3, 5)), false)
    })
    it('equals with epsilon', () => {
      const a = mat2(1, 2, 3, 4)
      const b = mat2(1 + glmaths.EPSILON * 0.1, 2, 3, 4)
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('toString', () => {
    it('returns string representation', () => {
      assert.strictEqual(mat2(1, 2, 3, 4).toString(), 'mat2x2(1, 2, 3, 4)')
    })
  })

  describe('frob', () => {
    it('frobenius norm of identity', () => {
      closeTo(mat2.identity.frob(), Math.sqrt(2))
    })
  })

  describe('LDU', () => {
    it('factors a matrix', () => {
      const m = mat2(4, 3, 6, 3)
      const [L, D, U] = m.LDU()
      assert.ok(L instanceof Mat2)
      assert.ok(D instanceof Mat2)
      assert.ok(U instanceof Mat2)
    })
  })

  describe('factory function', () => {
    it('creates Mat2 via mat2()', () => {
      const m = mat2(1, 2, 3, 4)
      assert.ok(m instanceof Mat2)
      assert.strictEqual(m[0], 1)
    })
  })

  describe('mat * vec operators', () => {
    it('Mat2 * Vec2 rotation', () => {
      const m = mat2.fromRotation(Math.PI / 3)
      const v = vec2(3, 4)
      const expected = v.transformMat2(m, vec2())
      const r = m * v
      assert.ok(r instanceof Vec2)
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
    })
    it('Mat2 * Vec2 scale + rotation', () => {
      const m = mat2.fromScaling(vec2(2, 3))
      const rot = mat2.fromRotation(Math.PI / 5)
      const combined = rot.multiply(m, mat2())
      const v = vec2(7, -2)
      const expected = v.transformMat2(combined, vec2())
      const r = combined * v
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
    })
  })
})
