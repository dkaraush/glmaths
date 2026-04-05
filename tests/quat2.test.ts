import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Quat2, Quat, Vec3, Mat4 } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

describe('Quat2', () => {
  describe('constructor', () => {
    it('defaults to identity (0,0,0,1, 0,0,0,0)', () => {
      const dq = new Quat2()
      assert.strictEqual(dq[0], 0)
      assert.strictEqual(dq[1], 0)
      assert.strictEqual(dq[2], 0)
      assert.strictEqual(dq[3], 1)
      assert.strictEqual(dq[4], 0)
      assert.strictEqual(dq[5], 0)
      assert.strictEqual(dq[6], 0)
      assert.strictEqual(dq[7], 0)
    })
    it('extends Float32Array with length 8', () => {
      const dq = new Quat2()
      assert.ok(dq instanceof Float32Array)
      assert.strictEqual(dq.length, 8)
    })
  })

  describe('identity', () => {
    it('creates identity dual quaternion', () => {
      const dq = Quat2.identity
      assert.strictEqual(dq[3], 1)
      assert.strictEqual(dq[0], 0)
      assert.strictEqual(dq[7], 0)
    })
  })

  describe('fromRotationTranslation', () => {
    it('creates from identity rotation and translation', () => {
      const q = Quat.identity
      const t = new Vec3(2, 4, 6)
      const dq = Quat2.fromRotationTranslation(q, t)
      const out = dq.getTranslation()
      closeTo(out[0], 2)
      closeTo(out[1], 4)
      closeTo(out[2], 6)
    })
  })

  describe('fromTranslation', () => {
    it('creates from translation only', () => {
      const dq = Quat2.fromTranslation(new Vec3(1, 2, 3))
      const t = dq.getTranslation()
      closeTo(t[0], 1)
      closeTo(t[1], 2)
      closeTo(t[2], 3)
    })
  })

  describe('fromRotation', () => {
    it('creates from rotation only', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const dq = Quat2.fromRotation(q)
      closeTo(dq[0], q[0])
      closeTo(dq[1], q[1])
      closeTo(dq[2], q[2])
      closeTo(dq[3], q[3])
      assert.strictEqual(dq[4], 0)
      assert.strictEqual(dq[5], 0)
      assert.strictEqual(dq[6], 0)
      assert.strictEqual(dq[7], 0)
    })
  })

  describe('fromMat4', () => {
    it('round-trips through Mat4', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const t = new Vec3(1, 2, 3)
      const m = Mat4.fromRotationTranslation(q, t)
      const dq = Quat2.fromMat4(m)
      const tOut = dq.getTranslation()
      closeTo(tOut[0], 1)
      closeTo(tOut[1], 2)
      closeTo(tOut[2], 3)
    })
  })

  describe('getReal / getDual', () => {
    it('gets real part', () => {
      const dq = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      const real = dq.getReal()
      assert.strictEqual(real[0], 1)
      assert.strictEqual(real[1], 2)
      assert.strictEqual(real[2], 3)
      assert.strictEqual(real[3], 4)
    })
    it('gets dual part', () => {
      const dq = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      const dual = dq.getDual()
      assert.strictEqual(dual[0], 5)
      assert.strictEqual(dual[1], 6)
      assert.strictEqual(dual[2], 7)
      assert.strictEqual(dual[3], 8)
    })
  })

  describe('multiply', () => {
    it('identity * identity = identity', () => {
      const a = Quat2.identity
      const b = Quat2.identity
      const out = new Quat2()
      a.multiply(b, out)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 0)
      closeTo(out[3], 1)
      closeTo(out[4], 0)
      closeTo(out[5], 0)
      closeTo(out[6], 0)
      closeTo(out[7], 0)
    })
    it('combines rotation and translation', () => {
      const rot = Quat2.fromRotation(Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2))
      const trans = Quat2.fromTranslation(new Vec3(1, 0, 0))
      const out = new Quat2()
      rot.multiply(trans, out)
      const t = out.getTranslation()
      closeTo(t[0], 0, 1)
      closeTo(t[2], -1, 1)
    })
  })

  describe('translate', () => {
    it('adds translation', () => {
      const dq = Quat2.fromTranslation(new Vec3(1, 0, 0))
      const r = dq.translate(new Vec3(0, 2, 0))
      const t = r.getTranslation()
      closeTo(t[0], 1)
      closeTo(t[1], 2)
      closeTo(t[2], 0)
    })
  })

  describe('conjugate', () => {
    it('negates xyz of both parts, keeps w', () => {
      const dq = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      const out = new Quat2()
      dq.conjugate(out)
      assert.strictEqual(out[0], -1)
      assert.strictEqual(out[1], -2)
      assert.strictEqual(out[2], -3)
      assert.strictEqual(out[3], 4)
      assert.strictEqual(out[4], -5)
      assert.strictEqual(out[5], -6)
      assert.strictEqual(out[6], -7)
      assert.strictEqual(out[7], 8)
    })
  })

  describe('normalize', () => {
    it('normalizes the dual quaternion', () => {
      const dq = Quat2.fromRotationTranslation(Quat.identity, new Vec3(1, 2, 3))
      dq.normalize()
      const len = Math.sqrt(dq[0]*dq[0] + dq[1]*dq[1] + dq[2]*dq[2] + dq[3]*dq[3])
      closeTo(len, 1)
    })
  })

  describe('clone', () => {
    it('creates independent copy', () => {
      const a = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      const b = a.clone()
      a[0] = 99
      assert.strictEqual(b[0], 1)
    })
  })

  describe('equals / exactEquals', () => {
    it('equals returns true for same values', () => {
      const a = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      const b = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      assert.strictEqual(a.equals(b), true)
    })
    it('exactEquals returns false for different values', () => {
      const a = new Quat2(1, 2, 3, 4, 5, 6, 7, 8)
      const b = new Quat2(1, 2, 3, 4, 5, 6, 7, 9)
      assert.strictEqual(a.exactEquals(b), false)
    })
  })

  describe('toString', () => {
    it('uses dual number notation', () => {
      const dq = Quat2.identity
      const s = dq.toString()
      assert.ok(s.includes('ε'))
    })
  })

  describe('lerp', () => {
    it('interpolates at t=0 returns a', () => {
      const a = Quat2.fromTranslation(new Vec3(0, 0, 0))
      const b = Quat2.fromTranslation(new Vec3(10, 0, 0))
      const out = Quat2.lerp(a, b, 0)
      closeTo(out.getTranslation()[0], 0)
    })
    it('interpolates at t=1 returns b', () => {
      const a = Quat2.fromTranslation(new Vec3(0, 0, 0))
      const b = Quat2.fromTranslation(new Vec3(10, 0, 0))
      const out = Quat2.lerp(a, b, 1)
      closeTo(out.getTranslation()[0], 10)
    })
  })

  describe('dot', () => {
    it('computes dot product of real parts', () => {
      const a = Quat2.identity
      const b = Quat2.identity
      closeTo(Quat2.dot(a, b), 1)
    })
  })
})
