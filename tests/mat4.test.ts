import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { Mat4, mat4, Vec3, Vec4, Quat } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

describe('Mat4', () => {
  describe('constructor', () => {
    it('creates zero matrix by default', () => {
      const m = new Mat4()
      for (let i = 0; i < 16; i++) assert.strictEqual(m[i], 0)
    })
    it('creates with given values', () => {
      const m = Mat4.identity
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[5], 1)
      assert.strictEqual(m[10], 1)
      assert.strictEqual(m[15], 1)
    })
    it('extends Float32Array with length 16', () => {
      assert.strictEqual(new Mat4().length, 16)
    })
  })

  describe('identity', () => {
    it('is correct', () => {
      const m = Mat4.identity
      for (let i = 0; i < 16; i++) {
        assert.strictEqual(m[i], i % 5 === 0 ? 1 : 0)
      }
    })
  })

  describe('clone', () => {
    it('clones independently', () => {
      const a = Mat4.identity
      const b = a.clone()
      b[0] = 99
      assert.strictEqual(a[0], 1)
    })
  })

  describe('transpose', () => {
    it('transposes in-place', () => {
      const m = new Mat4(
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
      )
      const r = m.transpose()
      assert.strictEqual(r[1], 5)
      assert.strictEqual(r[4], 2)
      assert.strictEqual(r[2], 9)
      assert.strictEqual(r[8], 3)
    })
    it('transposes to out', () => {
      const m = Mat4.identity
      const out = new Mat4()
      m.transpose(out)
      assert.strictEqual(out.exactEquals(Mat4.identity), true)
    })
  })

  describe('invert', () => {
    it('inverts identity to identity', () => {
      const out = new Mat4()
      Mat4.identity.invert(out)
      for (let i = 0; i < 16; i++) {
        closeTo(out[i], i % 5 === 0 ? 1 : 0)
      }
    })
    it('m * m^-1 = identity', () => {
      const m = Mat4.fromRotationTranslationScale(
        Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4),
        new Vec3(1, 2, 3),
        new Vec3(1, 1, 1)
      )
      const inv = new Mat4()
      m.invert(inv)
      const result = new Mat4()
      m.multiply(inv!, result)
      for (let i = 0; i < 16; i++) {
        closeTo(result[i], i % 5 === 0 ? 1 : 0, 4)
      }
    })
    it('returns null for singular matrix', () => {
      const m = new Mat4()
      assert.strictEqual(m.invert(new Mat4()), null)
    })
  })

  describe('determinant', () => {
    it('identity determinant is 1', () => {
      closeTo(Mat4.identity.determinant(), 1)
    })
    it('scaling matrix determinant is product of scales', () => {
      const m = Mat4.fromScaling(new Vec3(2, 3, 4))
      closeTo(m.determinant(), 24)
    })
  })

  describe('multiply', () => {
    it('identity * A = A', () => {
      const a = Mat4.fromTranslation(new Vec3(1, 2, 3))
      const out = new Mat4()
      Mat4.identity.multiply(a, out)
      for (let i = 0; i < 16; i++) closeTo(out[i], a[i])
    })
    it('mul alias works', () => {
      const m = Mat4.identity
      const out = new Mat4()
      m.mul(Mat4.identity, out)
      closeTo(out[0], 1)
    })
  })

  describe('translate', () => {
    it('translates identity', () => {
      const m = Mat4.identity
      const r = m.translate(new Vec3(5, 10, 15))
      assert.strictEqual(r[12], 5)
      assert.strictEqual(r[13], 10)
      assert.strictEqual(r[14], 15)
    })
    it('translates to out', () => {
      const m = Mat4.identity
      const out = new Mat4()
      m.translate(new Vec3(5, 10, 15), out)
      assert.strictEqual(out[12], 5)
      assert.strictEqual(out[13], 10)
      assert.strictEqual(out[14], 15)
      assert.strictEqual(m[12], 0)
    })
  })

  describe('scale', () => {
    it('scales identity', () => {
      const m = Mat4.identity
      const r = m.scale(new Vec3(2, 3, 4))
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[5], 3)
      assert.strictEqual(r[10], 4)
    })
  })

  describe('rotate', () => {
    it('rotates identity around Y axis', () => {
      const m = Mat4.identity
      const r = m.rotate(Math.PI / 2, new Vec3(0, 1, 0))
      closeTo(r![0], 0)
      closeTo(r![8], 1)
    })
    it('returns null for zero axis', () => {
      const m = Mat4.identity
      assert.strictEqual(m.rotate(Math.PI / 2, new Vec3(0, 0, 0)), null)
    })
  })

  describe('rotateX / rotateY / rotateZ', () => {
    it('rotateX by PI/2', () => {
      const m = Mat4.identity
      const r = m.rotateX(Math.PI / 2)
      closeTo(r[5], 0)
      closeTo(r[6], 1)
      closeTo(r[9], -1)
      closeTo(r[10], 0)
    })
    it('rotateY by PI/2', () => {
      const m = Mat4.identity
      const r = m.rotateY(Math.PI / 2)
      closeTo(r[0], 0)
      closeTo(r[2], -1)
      closeTo(r[8], 1)
      closeTo(r[10], 0)
    })
    it('rotateZ by PI/2', () => {
      const m = Mat4.identity
      const r = m.rotateZ(Math.PI / 2)
      closeTo(r[0], 0)
      closeTo(r[1], 1)
      closeTo(r[4], -1)
      closeTo(r[5], 0)
    })
  })

  describe('getTranslation', () => {
    it('extracts translation', () => {
      const m = Mat4.fromTranslation(new Vec3(5, 10, 15))
      const t = m.getTranslation()
      assert.strictEqual(t[0], 5)
      assert.strictEqual(t[1], 10)
      assert.strictEqual(t[2], 15)
    })
  })

  describe('getScaling', () => {
    it('extracts scaling', () => {
      const m = Mat4.fromScaling(new Vec3(2, 3, 4))
      const s = m.getScaling()
      closeTo(s[0], 2)
      closeTo(s[1], 3)
      closeTo(s[2], 4)
    })
  })

  describe('getRotation', () => {
    it('extracts rotation from identity', () => {
      const q = Mat4.identity.getRotation()
      closeTo(q[0], 0)
      closeTo(q[1], 0)
      closeTo(q[2], 0)
      closeTo(q[3], 1)
    })
  })

  describe('decompose', () => {
    it('decomposes a TRS matrix', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const t = new Vec3(1, 2, 3)
      const s = new Vec3(2, 3, 4)
      const m = Mat4.fromRotationTranslationScale(q, t, s)

      const outQ = new Quat()
      const outT = new Vec3()
      const outS = new Vec3()
      m.decompose(outQ, outT, outS)

      closeTo(outT[0], 1)
      closeTo(outT[1], 2)
      closeTo(outT[2], 3)
      closeTo(outS[0], 2)
      closeTo(outS[1], 3)
      closeTo(outS[2], 4)
    })
  })

  describe('static fromTranslation', () => {
    it('creates translation matrix', () => {
      const m = Mat4.fromTranslation(new Vec3(1, 2, 3))
      assert.strictEqual(m[12], 1)
      assert.strictEqual(m[13], 2)
      assert.strictEqual(m[14], 3)
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[15], 1)
    })
  })

  describe('static fromScaling', () => {
    it('creates scaling matrix', () => {
      const m = Mat4.fromScaling(new Vec3(2, 3, 4))
      assert.strictEqual(m[0], 2)
      assert.strictEqual(m[5], 3)
      assert.strictEqual(m[10], 4)
      assert.strictEqual(m[15], 1)
    })
  })

  describe('static fromRotation', () => {
    it('creates rotation matrix', () => {
      const m = Mat4.fromRotation(Math.PI / 2, new Vec3(0, 1, 0))
      assert.notStrictEqual(m, null)
      closeTo(m![0], 0)
      assert.strictEqual(m![15], 1)
    })
    it('returns null for zero axis', () => {
      assert.strictEqual(Mat4.fromRotation(Math.PI, new Vec3(0, 0, 0)), null)
    })
  })

  describe('static axis rotation', () => {
    it('fromXRotation', () => {
      const m = Mat4.fromXRotation(Math.PI / 2)
      closeTo(m[5], 0)
      closeTo(m[6], 1)
    })
    it('fromYRotation', () => {
      const m = Mat4.fromYRotation(Math.PI / 2)
      closeTo(m[0], 0)
      closeTo(m[8], 1)
    })
    it('fromZRotation', () => {
      const m = Mat4.fromZRotation(Math.PI / 2)
      closeTo(m[0], 0)
      closeTo(m[1], 1)
    })
  })

  describe('static fromRotationTranslation', () => {
    it('creates combined matrix', () => {
      const q = Quat.identity
      const v = new Vec3(1, 2, 3)
      const m = Mat4.fromRotationTranslation(q, v)
      assert.strictEqual(m[12], 1)
      assert.strictEqual(m[13], 2)
      assert.strictEqual(m[14], 3)
      closeTo(m[0], 1)
    })
  })

  describe('static fromRotationTranslationScale', () => {
    it('creates TRS matrix', () => {
      const m = Mat4.fromRotationTranslationScale(
        Quat.identity,
        new Vec3(1, 2, 3),
        new Vec3(2, 3, 4)
      )
      assert.strictEqual(m[12], 1)
      closeTo(m[0], 2)
      closeTo(m[5], 3)
      closeTo(m[10], 4)
    })
  })

  describe('static fromQuat', () => {
    it('identity quat gives identity matrix', () => {
      const m = Mat4.fromQuat(Quat.identity)
      closeTo(m[0], 1)
      closeTo(m[5], 1)
      closeTo(m[10], 1)
      assert.strictEqual(m[15], 1)
    })
  })

  describe('static perspectiveNO', () => {
    it('creates perspective matrix with correct structure', () => {
      const fovy = Math.PI / 4, aspect = 16 / 9, near = 0.1, far = 100
      const m = Mat4.perspectiveNO(fovy, aspect, near, far)
      const f = 1.0 / Math.tan(fovy / 2)
      const nf = 1 / (near - far)
      closeTo(m[0], f / aspect)
      closeTo(m[5], f)
      closeTo(m[10], (far + near) * nf)
      assert.strictEqual(m[11], -1)
      closeTo(m[14], 2 * far * near * nf)
      assert.strictEqual(m[15], 0)
      assert.strictEqual(m[1], 0)
      assert.strictEqual(m[2], 0)
      assert.strictEqual(m[3], 0)
      assert.strictEqual(m[4], 0)
      assert.strictEqual(m[6], 0)
      assert.strictEqual(m[7], 0)
      assert.strictEqual(m[8], 0)
      assert.strictEqual(m[9], 0)
      assert.strictEqual(m[12], 0)
      assert.strictEqual(m[13], 0)
    })
    it('handles infinite far plane', () => {
      const fovy = Math.PI / 4, aspect = 16 / 9, near = 0.1
      const m = Mat4.perspectiveNO(fovy, aspect, near, Infinity)
      const f = 1.0 / Math.tan(fovy / 2)
      closeTo(m[0], f / aspect)
      closeTo(m[5], f)
      assert.strictEqual(m[10], -1)
      assert.strictEqual(m[11], -1)
      closeTo(m[14], -2 * near)
      assert.strictEqual(m[15], 0)
    })
    it('handles null far plane same as infinite', () => {
      const fovy = Math.PI / 4, aspect = 16 / 9, near = 0.1
      const m = Mat4.perspectiveNO(fovy, aspect, near, null)
      assert.strictEqual(m[10], -1)
      closeTo(m[14], -2 * near)
    })
    it('perspective is alias for perspectiveNO', () => {
      assert.strictEqual(Mat4.perspective, Mat4.perspectiveNO)
    })
  })

  describe('static perspectiveZO', () => {
    it('creates perspective matrix with [0,1] depth', () => {
      const fovy = Math.PI / 4, aspect = 16 / 9, near = 0.1, far = 100
      const m = Mat4.perspectiveZO(fovy, aspect, near, far)
      const f = 1.0 / Math.tan(fovy / 2)
      const nf = 1 / (near - far)
      closeTo(m[0], f / aspect)
      closeTo(m[5], f)
      closeTo(m[10], far * nf)
      assert.strictEqual(m[11], -1)
      closeTo(m[14], far * near * nf)
      assert.strictEqual(m[15], 0)
    })
    it('handles infinite far plane', () => {
      const m = Mat4.perspectiveZO(Math.PI / 4, 16 / 9, 0.1, Infinity)
      assert.strictEqual(m[10], -1)
      closeTo(m[14], -0.1)
    })
  })

  describe('static orthoNO', () => {
    it('creates orthographic matrix with correct values', () => {
      const left = -2, right = 2, bottom = -1, top = 1, near = 0.1, far = 100
      const m = Mat4.orthoNO(left, right, bottom, top, near, far)
      const lr = 1 / (left - right)
      const bt = 1 / (bottom - top)
      const nf = 1 / (near - far)
      closeTo(m[0], -2 * lr)
      closeTo(m[5], -2 * bt)
      closeTo(m[10], 2 * nf)
      closeTo(m[12], (left + right) * lr)
      closeTo(m[13], (top + bottom) * bt)
      closeTo(m[14], (far + near) * nf)
      assert.strictEqual(m[15], 1)
      assert.strictEqual(m[3], 0)
      assert.strictEqual(m[7], 0)
      assert.strictEqual(m[11], 0)
    })
    it('ortho is alias for orthoNO', () => {
      assert.strictEqual(Mat4.ortho, Mat4.orthoNO)
    })
  })

  describe('static orthoZO', () => {
    it('creates orthographic matrix with [0,1] depth', () => {
      const left = -1, right = 1, bottom = -1, top = 1, near = 0.1, far = 100
      const m = Mat4.orthoZO(left, right, bottom, top, near, far)
      const nf = 1 / (near - far)
      closeTo(m[0], 1)
      closeTo(m[5], 1)
      closeTo(m[10], nf)
      closeTo(m[14], near * nf)
      assert.strictEqual(m[15], 1)
      assert.strictEqual(m[11], 0)
    })
  })

  describe('static frustum', () => {
    it('creates frustum matrix with correct values', () => {
      const left = -1, right = 1, bottom = -1, top = 1, near = 1, far = 100
      const m = Mat4.frustum(left, right, bottom, top, near, far)
      const rl = 1 / (right - left)
      const tb = 1 / (top - bottom)
      const nf = 1 / (near - far)
      closeTo(m[0], near * 2 * rl)
      closeTo(m[5], near * 2 * tb)
      closeTo(m[8], (right + left) * rl)
      closeTo(m[9], (top + bottom) * tb)
      closeTo(m[10], (far + near) * nf)
      assert.strictEqual(m[11], -1)
      closeTo(m[14], far * near * 2 * nf)
      assert.strictEqual(m[15], 0)
    })
  })

  describe('static lookAt', () => {
    it('looking along -Z from origin', () => {
      const m = Mat4.lookAt(new Vec3(0, 0, 0), new Vec3(0, 0, -1), new Vec3(0, 1, 0))
      closeTo(m[0], 1)
      closeTo(m[5], 1)
      closeTo(m[10], 1)
    })
    it('returns identity when eye equals center', () => {
      const m = Mat4.lookAt(new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 1, 0))
      assert.strictEqual(m[0], 1)
      assert.strictEqual(m[5], 1)
      assert.strictEqual(m[10], 1)
      assert.strictEqual(m[15], 1)
    })
  })

  describe('static targetTo', () => {
    it('creates targeting matrix', () => {
      const m = Mat4.targetTo(new Vec3(0, 0, 5), new Vec3(0, 0, 0), new Vec3(0, 1, 0))
      assert.strictEqual(m[12], 0)
      assert.strictEqual(m[13], 0)
      assert.strictEqual(m[14], 5)
    })
  })

  describe('plus / minus / scaleScalar', () => {
    it('adds', () => {
      const a = Mat4.identity
      const b = Mat4.identity
      const out = new Mat4()
      a.plus(b, out)
      assert.strictEqual(out[0], 2)
    })
    it('subtracts', () => {
      const out = new Mat4()
      Mat4.identity.minus(Mat4.identity, out)
      for (let i = 0; i < 16; i++) assert.strictEqual(out[i], 0)
    })
    it('scaleScalar', () => {
      const m = Mat4.identity
      const r = m.scaleScalar(3)
      assert.strictEqual(r[0], 3)
      assert.strictEqual(r[5], 3)
    })
  })

  describe('frob', () => {
    it('frobenius norm of identity', () => {
      closeTo(Mat4.identity.frob(), 2)
    })
  })

  describe('equals / exactEquals', () => {
    it('exactEquals', () => {
      assert.strictEqual(Mat4.identity.exactEquals(Mat4.identity), true)
    })
    it('equals with epsilon', () => {
      const a = Mat4.identity
      const b = Mat4.identity
      b[0] = 1 + glmaths.EPSILON * 0.1
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('toString', () => {
    it('returns string', () => {
      assert.ok(Mat4.identity.toString().includes('mat4'))
    })
  })

  describe('infinitePerspective', () => {
    it('creates perspective matrix with far at infinity', () => {
      const m = Mat4.infinitePerspective(Math.PI / 4, 16 / 9, 0.1)
      closeTo(m[10], -1)
      closeTo(m[11], -1)
      closeTo(m[14], -0.2)
    })
  })

  describe('project / unProject', () => {
    it('round-trips through project and unProject', () => {
      const model = Mat4.identity
      const proj = Mat4.perspective(Math.PI / 4, 1, 0.1, 100)
      const viewport = new Vec4(0, 0, 800, 600)
      const point = new Vec3(1, 2, -5)
      const win = Mat4.project(point, model, proj, viewport)
      const back = Mat4.unProject(win, model, proj, viewport)
      assert.notStrictEqual(back, null)
      closeTo(back![0], point[0], 3)
      closeTo(back![1], point[1], 3)
      closeTo(back![2], point[2], 3)
    })
  })

  describe('factory function', () => {
    it('creates Mat4', () => {
      const m = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
      assert.ok(m instanceof Mat4)
    })
  })

  describe('mat * vec operators', () => {
    it('Mat4 * Vec4 scaling + rotation', () => {
      const m = Mat4.fromScaling(new Vec3(2, 3, 4))
      m.rotateX(Math.PI / 3)
      const v = new Vec4(1, 1, 1, 1)
      const expected = v.transformMat4(m, new Vec4())
      const r = m * v
      assert.ok(r instanceof Vec4)
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
      closeTo(r.z, expected.z)
      closeTo(r.w, expected.w)
    })
    it('Mat4 * Vec3 full transform', () => {
      const m = Mat4.identity
      m.scale(new Vec3(2, 2, 2))
      m.rotateZ(Math.PI / 3)
      m.translate(new Vec3(5, 0, 0))
      const v = new Vec3(1, 0, 0)
      const expected = v.transformMat4(m, new Vec3())
      const r = m * v
      assert.ok(r instanceof Vec3)
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
      closeTo(r.z, expected.z)
    })
    it('Mat4 * Vec4 perspective', () => {
      const m = Mat4.perspective(Math.PI / 4, 1, 0.1, 100)
      const v = new Vec4(1, 2, -5, 1)
      const expected = v.transformMat4(m, new Vec4())
      const r = m * v
      closeTo(r.x, expected.x)
      closeTo(r.y, expected.y)
      closeTo(r.z, expected.z)
      closeTo(r.w, expected.w)
    })
  })
})
