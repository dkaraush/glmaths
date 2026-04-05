import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { Mat3, mat3, Mat2x3, quat, Quat, vec2, Vec2, vec3, Vec3 } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

describe('Mat3', () => {
  describe('constructor', () => {
    it('creates zero matrix by default', () => {
      const m = mat3()
      for (let i = 0; i < 9; i++) assert.strictEqual(m[i], 0)
    })
    it('creates with given values', () => {
      const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[8], 9)
    })
    it('extends Float32Array with length 9', () => {
      assert.strictEqual(mat3().length, 9)
    })
  })

  describe('identity', () => {
    it('creates identity', () => {
      const m = mat3.identity
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[4], 1)
      assert.strictEqual(m[8], 1)
      assert.strictEqual(m[1], 0)
      assert.strictEqual(m[3], 0)
    })
  })

  describe('clone', () => {
    it('clones independently', () => {
      const a = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      const b = a.clone()
      b[0] = 99
      assert.strictEqual(a[0], 1)
    })
  })

  describe('transpose', () => {
    it('transposes in-place', () => {
      const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      const r = m.transpose()
      assert.strictEqual(r[1], 4)
      assert.strictEqual(r[3], 2)
      assert.strictEqual(r[2], 7)
      assert.strictEqual(r[6], 3)
    })
    it('transposes to out', () => {
      const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      const out = mat3()
      m.transpose(out)
      assert.strictEqual(out[1], 4)
      assert.strictEqual(out[3], 2)
    })
  })

  describe('invert', () => {
    it('inverts identity to identity', () => {
      const m = mat3.identity
      const out = mat3()
      m.invert(out)
      closeTo(out[0], 1)
      closeTo(out[4], 1)
      closeTo(out[8], 1)
    })
    it('m * m^-1 = identity', () => {
      const m = mat3(1, 0, 0, 0, 2, 0, 0, 0, 3)
      const inv = mat3()
      m.invert(inv)
      const result = mat3()
      m.multiply(inv!, result)
      closeTo(result[0], 1)
      closeTo(result[4], 1)
      closeTo(result[8], 1)
      closeTo(result[1], 0)
    })
    it('returns null for singular matrix', () => {
      const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      assert.strictEqual(m.invert(mat3()), null)
    })
  })

  describe('adjoint', () => {
    it('adjoint of identity is identity', () => {
      const out = mat3()
      mat3.identity.adjoint(out)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[4], 1)
      assert.strictEqual(out[8], 1)
    })
  })

  describe('determinant', () => {
    it('identity determinant is 1', () => {
      assert.strictEqual(mat3.identity.determinant(), 1)
    })
    it('diagonal matrix determinant is product of diagonal', () => {
      const m = mat3(2, 0, 0, 0, 3, 0, 0, 0, 4)
      assert.strictEqual(m.determinant(), 24)
    })
    it('singular matrix determinant is 0', () => {
      const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      closeTo(m.determinant(), 0)
    })
  })

  describe('multiply', () => {
    it('identity * A = A', () => {
      const a = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
      const out = mat3()
      mat3.identity.multiply(a, out)
      for (let i = 0; i < 9; i++) closeTo(out[i], a[i])
    })
  })

  describe('translate', () => {
    it('translates identity', () => {
      const m = mat3.identity
      const r = m.translate(vec2(5, 10))
      assert.strictEqual(r[6], 5)
      assert.strictEqual(r[7], 10)
      assert.strictEqual(r[8], 1)
    })
  })

  describe('rotate', () => {
    it('rotates identity by PI/2', () => {
      const m = mat3.identity
      const r = m.rotate(Math.PI / 2)
      closeTo(r[0], 0)
      closeTo(r[1], 1)
      closeTo(r[3], -1)
      closeTo(r[4], 0)
    })
  })

  describe('scale', () => {
    it('scales identity', () => {
      const m = mat3.identity
      const r = m.scale(vec2(2, 3))
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[4], 3)
      assert.strictEqual(r[8], 1)
    })
  })

  describe('static fromTranslation', () => {
    it('creates translation matrix', () => {
      const m = mat3.fromTranslation(vec2(5, 10))
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[4], 1)
      assert.strictEqual(m[6], 5)
      assert.strictEqual(m[7], 10)
      assert.strictEqual(m[8], 1)
    })
  })

  describe('static fromRotation', () => {
    it('creates rotation matrix', () => {
      const m = mat3.fromRotation(Math.PI / 2)
      closeTo(m[0], 0)
      closeTo(m[1], 1)
      closeTo(m[3], -1)
      closeTo(m[4], 0)
    })
  })

  describe('static fromScaling', () => {
    it('creates scaling matrix', () => {
      const m = mat3.fromScaling(vec2(2, 3))
      assert.strictEqual(m[0], 2)
      assert.strictEqual(m[4], 3)
      assert.strictEqual(m[8], 1)
    })
  })

  describe('static fromMat2x3', () => {
    it('converts from Mat2x3', () => {
      const a = new Mat2x3(1, 0, 0, 1, 5, 10)
      const m = mat3.fromMat2x3(a)
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[4], 1)
      assert.strictEqual(m[6], 5)
      assert.strictEqual(m[7], 10)
      assert.strictEqual(m[8], 1)
    })
  })

  describe('static fromQuat', () => {
    it('identity quaternion gives identity matrix', () => {
      const q = quat.identity
      const m = mat3.fromQuat(q)
      closeTo(m[0], 1)
      closeTo(m[4], 1)
      closeTo(m[8], 1)
      closeTo(m[1], 0)
    })
  })

  describe('static projection', () => {
    it('creates 2D projection', () => {
      const m = mat3.projection(100, 200)
      closeTo(m[0], 2 / 100)
      closeTo(m[4], -2 / 200)
    })
  })

  describe('plus / minus', () => {
    it('adds', () => {
      const a = mat3.identity
      const b = mat3.identity
      const out = mat3()
      a.plus(b, out)
      assert.strictEqual(out[0], 2)
      assert.strictEqual(out[4], 2)
    })
    it('subtracts', () => {
      const a = mat3.identity
      const b = mat3.identity
      const out = mat3()
      a.minus(b, out)
      assert.strictEqual(out[0], 0)
    })
  })

  describe('scaleScalar', () => {
    it('scales all elements', () => {
      const m = mat3.identity
      const r = m.scaleScalar(3)
      assert.strictEqual(r[0], 3)
      assert.strictEqual(r[4], 3)
      assert.strictEqual(r[8], 3)
    })
  })

  describe('frob', () => {
    it('frobenius norm of identity', () => {
      closeTo(mat3.identity.frob(), Math.sqrt(3))
    })
  })

  describe('equals / exactEquals', () => {
    it('exactEquals', () => {
      assert.strictEqual(mat3.identity.exactEquals(mat3.identity), true)
    })
    it('equals with epsilon', () => {
      const a = mat3.identity
      const b = mat3.identity
      b[0] = 1 + glmaths.EPSILON * 0.1
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('toString', () => {
    it('returns string', () => {
      assert.ok(mat3.identity.toString().includes('mat3'))
    })
  })

  describe('factory function', () => {
    it('creates Mat3', () => {
      const m = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1)
      assert.ok(m instanceof Mat3)
    })
  })

  describe('mat * vec operators', () => {
    it('Mat3 * Vec3 from quat rotation', () => {
      const q = quat.fromAxisAngle(vec3(1, 1, 0).normalize(), Math.PI / 3)
      const m = mat3.fromQuat(q)
      const v = vec3(2, 3, 4)
      const expected = v.transformMat3(m, vec3())
      const r = m * v
      assert.ok(r instanceof Vec3)
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
      closeTo(r.z, expected.z)
    })
    it('Mat3 * Vec3 scale + rotation', () => {
      const m = mat3.fromRotation(Math.PI / 3)
      m.scale(vec2(2, 3))
      const v = vec3(1, 1, 1)
      const expected = v.transformMat3(m, vec3())
      const r = m * v
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
      closeTo(r.z, expected.z)
    })
    it('Mat3 * Vec2 rotation via mat3', () => {
      const m = mat3.fromRotation(Math.PI / 4)
      const v = vec2(5, 7)
      const expected = v.transformMat3(m, vec2())
      const r = m * v
      assert.ok(r instanceof Vec2)
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
    })
  })
})
