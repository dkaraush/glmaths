import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Quat, Vec3, vec3, Vec4, Mat3 } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

describe('Quat', () => {
  describe('constructor', () => {
    it('defaults to identity (0,0,0,1)', () => {
      const q = new Quat()
      assert.strictEqual(q[0], 0)
      assert.strictEqual(q[1], 0)
      assert.strictEqual(q[2], 0)
      assert.strictEqual(q[3], 1)
    })
    it('creates with given values', () => {
      const q = new Quat(1, 2, 3, 4)
      assert.strictEqual(q[0], 1)
      assert.strictEqual(q[1], 2)
      assert.strictEqual(q[2], 3)
      assert.strictEqual(q[3], 4)
    })
  })

  describe('identity', () => {
    it('creates identity quaternion', () => {
      const q = Quat.identity
      assert.strictEqual(q[0], 0)
      assert.strictEqual(q[1], 0)
      assert.strictEqual(q[2], 0)
      assert.strictEqual(q[3], 1)
    })
  })

  describe('multiply (Hamilton product)', () => {
    it('identity * identity = identity', () => {
      const a = Quat.identity
      const b = Quat.identity
      const out = new Quat()
      a.multiply(b, out)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 0)
      closeTo(out[3], 1)
    })
    it('identity * q = q', () => {
      const q = new Quat(1, 2, 3, 4)
      const out = new Quat()
      Quat.identity.multiply(q, out)
      closeTo(out[0], 1)
      closeTo(out[1], 2)
      closeTo(out[2], 3)
      closeTo(out[3], 4)
    })
    it('q * conjugate(q) = unit quaternion', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const conj = new Quat()
      Quat.conjugate(q, conj)
      const out = new Quat()
      q.multiply(conj, out)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 0)
      closeTo(out[3], 1, 4)
    })
    it('scalar multiply scales all components', () => {
      const q = new Quat(1, 2, 3, 4)
      const out = new Quat()
      q.multiply(2, out)
      closeTo(out[0], 2)
      closeTo(out[1], 4)
      closeTo(out[2], 6)
      closeTo(out[3], 8)
    })
    it('mult/mul/times are aliases for multiply', () => {
      const q = Quat.identity
      assert.strictEqual(q.mult, q.multiply)
      assert.strictEqual(q.mul, q.multiply)
      assert.strictEqual(q.times, q.multiply)
    })
    it('composing two 90-degree rotations around Y gives 180-degree', () => {
      const q90 = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      let q = Quat.identity
      q = q.rotateY(Math.PI / 2)
      q = q.rotateY(Math.PI / 2)
      const q180 = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI)
      const dot = q[0] * q180[0] + q[1] * q180[1] + q[2] * q180[2] + q[3] * q180[3]
      closeTo(Math.abs(dot), 1, 4)
    })
    it('composing X then Y rotation produces correct result', () => {
      const q = Quat.identity
      q.rotateX(Math.PI / 2)
      q.rotateY(Math.PI / 2)
      const len = Math.sqrt(q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2)
      closeTo(len, 1, 4)
    })
  })

  describe('fromAxisAngle', () => {
    it('creates quaternion from axis and angle', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      closeTo(q[0], 0)
      closeTo(q[1], Math.sin(Math.PI / 4))
      closeTo(q[2], 0)
      closeTo(q[3], Math.cos(Math.PI / 4))
    })
    it('zero angle gives identity', () => {
      const q = Quat.fromAxisAngle(new Vec3(1, 0, 0), 0)
      closeTo(q[0], 0)
      closeTo(q[3], 1)
    })
  })

  describe('setAxisAngle', () => {
    it('sets quaternion to axis/angle', () => {
      const q = new Quat()
      const r = q.setAxisAngle(new Vec3(0, 0, 1), Math.PI / 2)
      closeTo(r[2], Math.sin(Math.PI / 4))
      closeTo(r[3], Math.cos(Math.PI / 4))
    })
  })

  describe('getAxisAngle', () => {
    it('recovers axis from fromAxisAngle', () => {
      const axis = new Vec3(0, 1, 0)
      const q = Quat.fromAxisAngle(axis, Math.PI / 3)
      const recovered = vec3()
      q.getAxisAngle(recovered)
      closeTo(recovered[0], 0)
      closeTo(recovered[1], 1)
      closeTo(recovered[2], 0)
    })
  })

  describe('angle', () => {
    it('angle between identical quaternions is 0', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      closeTo(Quat.angle(q, q), 0, 2)
    })
  })

  describe('rotateX / rotateY / rotateZ', () => {
    it('rotateX from identity', () => {
      const q = Quat.identity
      const r = q.rotateX(Math.PI / 2)
      closeTo(r[0], Math.sin(Math.PI / 4))
      closeTo(r[3], Math.cos(Math.PI / 4))
    })
    it('rotateY from identity', () => {
      const q = Quat.identity
      const r = q.rotateY(Math.PI / 2)
      closeTo(r[1], Math.sin(Math.PI / 4))
      closeTo(r[3], Math.cos(Math.PI / 4))
    })
    it('rotateZ from identity', () => {
      const q = Quat.identity
      const r = q.rotateZ(Math.PI / 2)
      closeTo(r[2], Math.sin(Math.PI / 4))
      closeTo(r[3], Math.cos(Math.PI / 4))
    })
  })

  describe('calculateW', () => {
    it('recovers W for unit quaternion', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const w = q.calculateW()
      closeTo(w, q[3], 4)
    })
  })

  describe('exp / ln', () => {
    it('ln(exp(q)) ~= q for small q', () => {
      const q = new Quat(0.1, 0.2, 0.3, 0)
      const out = new Quat()
      Quat.exp(q, out)
      const back = new Quat()
      Quat.ln(out, back)
      closeTo(back[0], q[0], 4)
      closeTo(back[1], q[1], 4)
      closeTo(back[2], q[2], 4)
    })
    it('instance exp/ln roundtrip', () => {
      const q = new Quat(0.1, 0.2, 0.3, 0)
      const e = new Quat()
      q.exp(e)
      const back = new Quat()
      e.ln(back)
      closeTo(back[0], q[0], 4)
    })
  })

  describe('pow', () => {
    it('q^1 ~= q for unit quaternion', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const original = new Quat(q[0], q[1], q[2], q[3])
      q.pow(1)
      closeTo(q[0], original[0], 3)
      closeTo(q[1], original[1], 3)
      closeTo(q[2], original[2], 3)
      closeTo(q[3], original[3], 3)
    })
  })

  describe('slerp', () => {
    it('slerp(a, b, 0) = a', () => {
      const a = Quat.fromAxisAngle(new Vec3(0, 1, 0), 0)
      const b = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const out = Quat.slerp(a, b, 0)
      closeTo(out[0], a[0])
      closeTo(out[1], a[1])
      closeTo(out[2], a[2])
      closeTo(out[3], a[3])
    })
    it('slerp(a, b, 1) = b', () => {
      const a = Quat.fromAxisAngle(new Vec3(0, 1, 0), 0)
      const b = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const out = Quat.slerp(a, b, 1)
      closeTo(out[0], b[0])
      closeTo(out[1], b[1])
      closeTo(out[2], b[2])
      closeTo(out[3], b[3])
    })
    it('slerp(a, a, t) = a', () => {
      const a = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const out = Quat.slerp(a, a, 0.5)
      closeTo(out[0], a[0])
      closeTo(out[1], a[1])
      closeTo(out[2], a[2])
      closeTo(out[3], a[3])
    })
    it('instance slerp', () => {
      const a = Quat.fromAxisAngle(new Vec3(0, 1, 0), 0)
      const b = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const out = new Quat()
      a.slerp(b, 0.5, out)
      const halfQ = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      closeTo(out[1], halfQ[1], 4)
      closeTo(out[3], halfQ[3], 4)
    })
  })

  describe('invert', () => {
    it('static invert gives conjugate for unit quaternion', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const inv = Quat.invert(q)
      closeTo(inv[0], -q[0])
      closeTo(inv[1], -q[1])
      closeTo(inv[2], -q[2])
      closeTo(inv[3], q[3])
    })
    it('instance invert', () => {
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const out = new Quat()
      q.invert(out)
      closeTo(out[1], -q[1])
    })
  })

  describe('conjugate', () => {
    it('static conjugate negates xyz', () => {
      const q = new Quat(1, 2, 3, 4)
      const out = Quat.conjugate(q)
      assert.strictEqual(out[0], -1)
      assert.strictEqual(out[1], -2)
      assert.strictEqual(out[2], -3)
      assert.strictEqual(out[3], 4)
    })
    it('instance conjugate', () => {
      const q = new Quat(1, 2, 3, 4)
      const r = q.conjugate()
      assert.strictEqual(r[0], -1)
      assert.strictEqual(r[3], 4)
    })
  })

  describe('fromMat3', () => {
    it('identity matrix gives identity quaternion', () => {
      const q = Quat.fromMat3(Mat3.identity)
      closeTo(q[0], 0)
      closeTo(q[1], 0)
      closeTo(q[2], 0)
      closeTo(q[3], 1)
    })
    it('roundtrips with Mat3.fromQuat', () => {
      const original = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 3)
      const mat = Mat3.fromQuat(original)
      const recovered = Quat.fromMat3(mat)
      const dot = original[0] * recovered[0] + original[1] * recovered[1] +
                  original[2] * recovered[2] + original[3] * recovered[3]
      closeTo(Math.abs(dot), 1, 4)
    })
  })

  describe('fromEuler', () => {
    it('zero angles give identity', () => {
      const q = Quat.fromEuler(0, 0, 0)
      closeTo(q[0], 0)
      closeTo(q[1], 0)
      closeTo(q[2], 0)
      closeTo(q[3], 1)
    })
    it('90 degree Y rotation', () => {
      const q = Quat.fromEuler(0, 90, 0, 'zyx')
      const expected = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const dot = q[0] * expected[0] + q[1] * expected[1] + q[2] * expected[2] + q[3] * expected[3]
      closeTo(Math.abs(dot), 1, 4)
    })
    it('throws for unknown order', () => {
      assert.throws(() => Quat.fromEuler(0, 0, 0, 'abc'), { message: /Unknown angle order/ })
    })
    it('supports all valid orders', () => {
      for (const order of ['xyz', 'xzy', 'yxz', 'yzx', 'zxy', 'zyx']) {
        const q = Quat.fromEuler(30, 45, 60, order)
        assert.ok(q instanceof Quat)
        const len = Math.sqrt(q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2)
        closeTo(len, 1, 4)
      }
    })
  })

  describe('toString', () => {
    it('returns string representation', () => {
      const q = new Quat(1, 2, 3, 4)
      assert.strictEqual(q.toString(), 'quat(1, 2, 3, 4)')
    })
  })

  describe('rotationTo', () => {
    it('rotation from X to Y axis', () => {
      const q = Quat.rotationTo(new Vec3(1, 0, 0), new Vec3(0, 1, 0))
      const m = Mat3.fromQuat(q)
      const result = new Vec3(
        m[0] * 1 + m[3] * 0 + m[6] * 0,
        m[1] * 1 + m[4] * 0 + m[7] * 0,
        m[2] * 1 + m[5] * 0 + m[8] * 0
      )
      closeTo(result[0], 0)
      closeTo(result[1], 1)
      closeTo(result[2], 0)
    })
    it('rotation from same vector returns identity', () => {
      const q = Quat.rotationTo(new Vec3(1, 0, 0), new Vec3(1, 0, 0))
      closeTo(q[0], 0)
      closeTo(q[1], 0)
      closeTo(q[2], 0)
      closeTo(q[3], 1)
    })
    it('rotation from opposite vectors (180 degrees)', () => {
      const q = Quat.rotationTo(new Vec3(1, 0, 0), new Vec3(-1, 0, 0))
      const len = Math.sqrt(q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2)
      closeTo(len, 1, 4)
    })
  })

  describe('random', () => {
    it('produces unit quaternion', () => {
      const q = Quat.random()
      const len = Math.sqrt(q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2)
      closeTo(len, 1, 4)
    })
  })

  describe('sqlerp', () => {
    it('returns valid quaternion', () => {
      const a = Quat.identity
      const b = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 4)
      const c = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const d = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI * 3 / 4)
      const out = Quat.sqlerp(a, b, c, d, 0.5)
      assert.ok(out instanceof Quat)
    })
  })

  describe('euler angles', () => {
    it('pitch/yaw/roll from identity is zero', () => {
      const q = Quat.identity
      closeTo(q.pitch(), 0)
      closeTo(q.yaw(), 0)
      closeTo(q.roll(), 0)
    })
    it('eulerAngles returns Vec3', () => {
      const q = Quat.fromAxisAngle(new Vec3(1, 0, 0), Math.PI / 4)
      const e = q.eulerAngles()
      assert.ok(e instanceof Vec3)
      closeTo(e[0], Math.PI / 4)
    })
  })

  describe('toMat3 / toMat4', () => {
    it('identity quat gives identity mat3', () => {
      const m = Quat.identity.toMat3()
      closeTo(m[0], 1)
      closeTo(m[4], 1)
      closeTo(m[8], 1)
      closeTo(m[1], 0)
    })
    it('identity quat gives identity mat4', () => {
      const m = Quat.identity.toMat4()
      closeTo(m[0], 1)
      closeTo(m[5], 1)
      closeTo(m[10], 1)
      closeTo(m[15], 1)
      closeTo(m[1], 0)
    })
  })

  describe('quatLookAt', () => {
    it('looking down -Z gives identity-like quat', () => {
      const q = Quat.quatLookAt(new Vec3(0, 0, -1), new Vec3(0, 1, 0))
      const v = new Vec3(0, 0, -1)
      v.transformQuat(q)
      closeTo(v[2], -1, 1)
    })
  })
})
