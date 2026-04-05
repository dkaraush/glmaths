import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import glmaths, { Vec3, vec3, Mat3, Mat4, Quat } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

const EPSILON = glmaths.EPSILON

describe('Vec3', () => {
  describe('constructor', () => {
    it('creates a zero vector by default', () => {
      const v = new Vec3()
      assert.strictEqual(v[0], 0)
      assert.strictEqual(v[1], 0)
      assert.strictEqual(v[2], 0)
    })
    it('creates with given values', () => {
      const v = new Vec3(1, 2, 3)
      assert.strictEqual(v[0], 1)
      assert.strictEqual(v[1], 2)
      assert.strictEqual(v[2], 3)
    })
    it('extends Float32Array with length 3', () => {
      const v = new Vec3()
      assert.ok(v instanceof Float32Array)
      assert.strictEqual(v.length, 3)
    })
  })

  describe('x/y/z getters and setters', () => {
    it('gets and sets correctly', () => {
      const v = new Vec3()
      v.x = 1; v.y = 2; v.z = 3
      assert.strictEqual(v.x, 1)
      assert.strictEqual(v.y, 2)
      assert.strictEqual(v.z, 3)
    })
  })

  describe('static constants', () => {
    it('ZERO', () => {
      const v = Vec3.ZERO
      assert.strictEqual(v[0], 0)
      assert.strictEqual(v[1], 0)
      assert.strictEqual(v[2], 0)
    })
    it('ONE', () => {
      const v = Vec3.ONE
      assert.strictEqual(v[0], 1)
      assert.strictEqual(v[1], 1)
      assert.strictEqual(v[2], 1)
    })
    it('unitX/Y/Z', () => {
      assert.strictEqual(Vec3.unitX[0], 1)
      assert.strictEqual(Vec3.unitX[1], 0)
      assert.strictEqual(Vec3.unitY[1], 1)
      assert.strictEqual(Vec3.unitZ[2], 1)
    })
  })

  describe('arithmetic', () => {
    it('plus with vector', () => {
      const a = new Vec3(1, 2, 3)
      const b = new Vec3(4, 5, 6)
      const out = new Vec3()
      a.plus(b, out)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[1], 7)
      assert.strictEqual(out[2], 9)
    })
    it('plus with scalar', () => {
      const a = new Vec3(1, 2, 3)
      const r = a.plus(10)
      assert.strictEqual(r[0], 11)
      assert.strictEqual(r[1], 12)
      assert.strictEqual(r[2], 13)
    })
    it('minus with vector', () => {
      const a = new Vec3(5, 7, 9)
      const b = new Vec3(1, 2, 3)
      const out = new Vec3()
      a.minus(b, out)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 5)
      assert.strictEqual(out[2], 6)
    })
    it('mult with vector', () => {
      const a = new Vec3(2, 3, 4)
      const b = new Vec3(5, 6, 7)
      const out = new Vec3()
      a.mult(b, out)
      assert.strictEqual(out[0], 10)
      assert.strictEqual(out[1], 18)
      assert.strictEqual(out[2], 28)
    })
    it('mult with scalar', () => {
      const a = new Vec3(2, 3, 4)
      const r = a.mult(3)
      assert.strictEqual(r[0], 6)
      assert.strictEqual(r[1], 9)
      assert.strictEqual(r[2], 12)
    })
    it('div with vector', () => {
      const a = new Vec3(10, 20, 30)
      const b = new Vec3(2, 4, 5)
      const out = new Vec3()
      a.div(b, out)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[1], 5)
      assert.strictEqual(out[2], 6)
    })
    it('scale', () => {
      const a = new Vec3(1, 2, 3)
      const r = a.scale(2)
      assert.strictEqual(r[0], 2)
      assert.strictEqual(r[1], 4)
      assert.strictEqual(r[2], 6)
    })
  })

  describe('negate', () => {
    it('negates components', () => {
      const a = new Vec3(1, -2, 3)
      const r = a.negate()
      assert.strictEqual(r[0], -1)
      assert.strictEqual(r[1], 2)
      assert.strictEqual(r[2], -3)
    })
  })

  describe('normalize', () => {
    it('normalizes to unit length (instance)', () => {
      const a = new Vec3(0, 3, 4)
      const r = a.normalize()
      closeTo(r.len(), 1)
      closeTo(r[0], 0)
      closeTo(r[1], 0.6)
      closeTo(r[2], 0.8)
    })
    it('normalizes to unit length (static)', () => {
      const v = new Vec3(0, 3, 4)
      const out = Vec3.normalize(v)
      closeTo(out.len(), 1)
    })
    it('handles zero vector', () => {
      const a = new Vec3(0, 0, 0)
      a.normalize()
      assert.strictEqual(a[0], 0)
      assert.strictEqual(a[1], 0)
      assert.strictEqual(a[2], 0)
    })
  })

  describe('len / squaredLength', () => {
    it('calculates length', () => {
      const a = new Vec3(1, 2, 2)
      closeTo(a.len(), 3)
    })
    it('calculates squared length', () => {
      const a = new Vec3(1, 2, 2)
      assert.strictEqual(a.squaredLength(), 9)
    })
  })

  describe('floor / round / ceil', () => {
    it('static floor', () => {
      const v = new Vec3(1.7, 2.3, 3.9)
      const out = Vec3.floor(v)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
    })
    it('instance floor', () => {
      const v = new Vec3(1.7, 2.3, 3.9)
      const r = v.floor()
      assert.strictEqual(r[0], 1)
      assert.strictEqual(r[1], 2)
      assert.strictEqual(r[2], 3)
    })
    it('static round', () => {
      const v = new Vec3(1.4, 2.6, 3.5)
      const out = Vec3.round(v)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 3)
      assert.strictEqual(out[2], 4)
    })
    it('static ceil', () => {
      const v = new Vec3(1.1, 2.0, 3.9)
      const out = Vec3.ceil(v)
      assert.strictEqual(out[0], 2)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 4)
    })
  })

  describe('inverse', () => {
    it('static inverse', () => {
      const v = new Vec3(2, 4, 5)
      const out = Vec3.inverse(v)
      closeTo(out[0], 0.5)
      closeTo(out[1], 0.25)
      closeTo(out[2], 0.2)
    })
    it('instance inverse', () => {
      const v = new Vec3(2, 4, 5)
      const r = v.inverse()
      closeTo(r[0], 0.5)
      closeTo(r[1], 0.25)
      closeTo(r[2], 0.2)
    })
  })

  describe('clone / toString', () => {
    it('clones correctly', () => {
      const a = new Vec3(1, 2, 3)
      const b = a.clone()
      assert.strictEqual(b[0], 1)
      assert.strictEqual(b[1], 2)
      assert.strictEqual(b[2], 3)
      b[0] = 99
      assert.strictEqual(a[0], 1)
    })
    it('toString', () => {
      assert.strictEqual(new Vec3(1, 2, 3).toString(), 'vec3(1, 2, 3)')
    })
  })

  describe('equals / exactEquals', () => {
    it('exactEquals', () => {
      assert.strictEqual(new Vec3(1, 2, 3).exactEquals(new Vec3(1, 2, 3)), true)
      assert.strictEqual(new Vec3(1, 2, 3).exactEquals(new Vec3(1, 2, 4)), false)
    })
    it('equals with epsilon', () => {
      const a = new Vec3(1, 2, 3)
      const b = new Vec3(1 + EPSILON * 0.1, 2, 3)
      assert.strictEqual(a.equals(b), true)
    })
  })

  describe('static dot', () => {
    it('calculates dot product', () => {
      const a = new Vec3(1, 2, 3)
      const b = new Vec3(4, 5, 6)
      assert.strictEqual(Vec3.dot(a, b), 32)
    })
  })

  describe('static cross', () => {
    it('calculates cross product', () => {
      const a = new Vec3(1, 0, 0)
      const b = new Vec3(0, 1, 0)
      const out = Vec3.cross(a, b)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 0)
      assert.strictEqual(out[2], 1)
    })
    it('cross product is anti-commutative', () => {
      const a = new Vec3(1, 0, 0)
      const b = new Vec3(0, 1, 0)
      const ab = Vec3.cross(a, b)
      const ba = Vec3.cross(b, a)
      closeTo(ab[0], -ba[0])
      closeTo(ab[1], -ba[1])
      closeTo(ab[2], -ba[2])
    })
  })

  describe('static distance / squaredDistance', () => {
    it('distance', () => {
      const a = new Vec3(0, 0, 0)
      const b = new Vec3(1, 2, 2)
      closeTo(Vec3.distance(a, b), 3)
    })
    it('squaredDistance', () => {
      const a = new Vec3(0, 0, 0)
      const b = new Vec3(1, 2, 2)
      assert.strictEqual(Vec3.squaredDistance(a, b), 9)
    })
  })

  describe('static lerp', () => {
    it('interpolates at t=0.5', () => {
      const a = new Vec3(0, 0, 0)
      const b = new Vec3(10, 20, 30)
      const out = Vec3.lerp(a, b, 0.5)
      assert.strictEqual(out[0], 5)
      assert.strictEqual(out[1], 10)
      assert.strictEqual(out[2], 15)
    })
    it('t=0 returns a', () => {
      const out = Vec3.lerp(new Vec3(1, 2, 3), new Vec3(4, 5, 6), 0)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
    })
    it('t=1 returns b', () => {
      const out = Vec3.lerp(new Vec3(1, 2, 3), new Vec3(4, 5, 6), 1)
      assert.strictEqual(out[0], 4)
      assert.strictEqual(out[1], 5)
      assert.strictEqual(out[2], 6)
    })
  })

  describe('static slerp', () => {
    it('slerp at t=0 returns a', () => {
      const a = new Vec3(1, 0, 0)
      const b = new Vec3(0, 1, 0)
      const out = Vec3.slerp(a, b, 0)
      closeTo(out[0], 1)
      closeTo(out[1], 0)
    })
    it('slerp at t=1 returns b', () => {
      const a = new Vec3(1, 0, 0)
      const b = new Vec3(0, 1, 0)
      const out = Vec3.slerp(a, b, 1)
      closeTo(out[0], 0)
      closeTo(out[1], 1)
    })
  })

  describe('static max / min', () => {
    it('max', () => {
      const out = Vec3.max(new Vec3(1, 5, 3), new Vec3(3, 2, 6))
      assert.strictEqual(out[0], 3)
      assert.strictEqual(out[1], 5)
      assert.strictEqual(out[2], 6)
    })
    it('min', () => {
      const out = Vec3.min(new Vec3(1, 5, 3), new Vec3(3, 2, 6))
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
    })
  })

  describe('static angle', () => {
    it('90 degrees between orthogonal vectors', () => {
      closeTo(Vec3.angle(new Vec3(1, 0, 0), new Vec3(0, 1, 0)), Math.PI / 2)
    })
    it('0 degrees between parallel vectors', () => {
      closeTo(Vec3.angle(new Vec3(1, 0, 0), new Vec3(5, 0, 0)), 0)
    })
    it('180 degrees between opposite vectors', () => {
      closeTo(Vec3.angle(new Vec3(1, 0, 0), new Vec3(-1, 0, 0)), Math.PI)
    })
  })

  describe('rotateX / rotateY / rotateZ', () => {
    it('rotateX by 90 degrees', () => {
      const v = new Vec3(0, 1, 0)
      const out = Vec3.rotateX(v, Math.PI / 2)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 1)
    })
    it('rotateY by 90 degrees', () => {
      const v = new Vec3(1, 0, 0)
      const out = Vec3.rotateY(v, Math.PI / 2)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], -1)
    })
    it('rotateZ by 90 degrees', () => {
      const v = new Vec3(1, 0, 0)
      const out = Vec3.rotateZ(v, Math.PI / 2)
      closeTo(out[0], 0)
      closeTo(out[1], 1)
      closeTo(out[2], 0)
    })
    it('rotateZ preserves z component', () => {
      const v = new Vec3(1, 0, 5)
      const out = Vec3.rotateZ(v, Math.PI / 2)
      closeTo(out[2], 5)
    })
    it('rotateX with origin', () => {
      const v = new Vec3(0, 2, 0)
      const origin = new Vec3(0, 1, 0)
      const out = Vec3.rotateX(v, Math.PI / 2, origin)
      closeTo(out[0], 0)
      closeTo(out[1], 1)
      closeTo(out[2], 1)
    })
    it('instance rotateX', () => {
      const v = new Vec3(0, 1, 0)
      const out = new Vec3()
      v.rotateX(Math.PI / 2, Vec3.zero, out)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 1)
    })
    it('instance rotateZ', () => {
      const v = new Vec3(1, 0, 0)
      const out = new Vec3()
      v.rotateZ(Math.PI / 2, Vec3.zero, out)
      closeTo(out[0], 0)
      closeTo(out[1], 1)
      closeTo(out[2], 0)
    })
    it('rotateZ with non-zero origin', () => {
      const v = new Vec3(2, 0, 0)
      const origin = new Vec3(1, 0, 0)
      const out = Vec3.rotateZ(v, Math.PI / 2, origin)
      closeTo(out[0], 1)
      closeTo(out[1], 1)
      closeTo(out[2], 0)
    })
  })

  describe('factory function', () => {
    it('vec3() creates Vec3', () => {
      const v = vec3(1, 2, 3)
      assert.ok(v instanceof Vec3)
      assert.strictEqual(v[0], 1)
      assert.strictEqual(v[1], 2)
      assert.strictEqual(v[2], 3)
    })
  })

  describe('scaleAndAdd', () => {
    it('adds scaled vector', () => {
      const a = new Vec3(1, 2, 3)
      const b = new Vec3(4, 5, 6)
      const out = new Vec3()
      a.scaleAndAdd(b, 2, out)
      closeTo(out[0], 9)
      closeTo(out[1], 12)
      closeTo(out[2], 15)
    })
    it('static version', () => {
      const out = Vec3.scaleAndAdd(new Vec3(1, 2, 3), new Vec3(1, 1, 1), 3)
      closeTo(out[0], 4)
      closeTo(out[1], 5)
      closeTo(out[2], 6)
    })
  })

  describe('abs', () => {
    it('absolute value of components', () => {
      const v = new Vec3(-1, -2, -3)
      const out = new Vec3()
      v.abs(out)
      assert.strictEqual(out[0], 1)
      assert.strictEqual(out[1], 2)
      assert.strictEqual(out[2], 3)
    })
  })

  describe('transformMat3', () => {
    it('transforms by 3x3 rotation matrix', () => {
      const v = new Vec3(1, 0, 0)
      const m = Mat3.identity
      const out = new Vec3()
      v.transformMat3(m, out)
      closeTo(out[0], 1)
      closeTo(out[1], 0)
      closeTo(out[2], 0)
    })
  })

  describe('transformMat4', () => {
    it('transforms by translation matrix', () => {
      const v = new Vec3(1, 2, 3)
      const m = Mat4.fromTranslation(new Vec3(10, 20, 30))
      const out = new Vec3()
      v.transformMat4(m, out)
      closeTo(out[0], 11)
      closeTo(out[1], 22)
      closeTo(out[2], 33)
    })
    it('transforms by identity', () => {
      const v = new Vec3(1, 2, 3)
      const out = new Vec3()
      v.transformMat4(Mat4.identity, out)
      closeTo(out[0], 1)
      closeTo(out[1], 2)
      closeTo(out[2], 3)
    })
  })

  describe('transformQuat', () => {
    it('identity quat leaves vector unchanged', () => {
      const v = new Vec3(1, 2, 3)
      const q = Quat.identity
      const out = new Vec3()
      v.transformQuat(q, out)
      closeTo(out[0], 1)
      closeTo(out[1], 2)
      closeTo(out[2], 3)
    })
    it('90 degree rotation around Y', () => {
      const v = new Vec3(1, 0, 0)
      const q = Quat.fromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2)
      const out = new Vec3()
      v.transformQuat(q, out)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], -1)
    })
  })

  describe('reflect', () => {
    it('reflects off a surface', () => {
      const I = new Vec3(1, -1, 0)
      const N = new Vec3(0, 1, 0)
      const out = Vec3.reflect(I, N)
      closeTo(out[0], 1)
      closeTo(out[1], 1)
      closeTo(out[2], 0)
    })
  })

  describe('refract', () => {
    it('refracts through a surface', () => {
      const I = new Vec3(0, -1, 0).normalize()
      const N = new Vec3(0, 1, 0)
      const out = Vec3.refract(I, N, 1.0)
      closeTo(out[0], 0)
      closeTo(out[1], -1)
      closeTo(out[2], 0)
    })
    it('total internal reflection returns zero', () => {
      const I = new Vec3(1, 0, 0).normalize()
      const N = new Vec3(0, 1, 0)
      const out = Vec3.refract(I, N, 1.5)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 0)
    })
  })

  describe('faceforward', () => {
    it('flips normal when facing away from incident', () => {
      const N = new Vec3(0, 1, 0)
      const I = new Vec3(0, 1, 0)
      const Nref = new Vec3(0, 1, 0)
      const out = Vec3.faceforward(N, I, Nref)
      assert.strictEqual(out[1], -1) // flipped because dot(Nref, I) > 0
    })
    it('keeps normal when facing incident', () => {
      const N = new Vec3(0, 1, 0)
      const I = new Vec3(0, -1, 0)
      const Nref = new Vec3(0, 1, 0)
      const out = Vec3.faceforward(N, I, Nref)
      assert.strictEqual(out[1], 1)
    })
  })

  describe('triangleNormal', () => {
    it('computes normal of XY triangle', () => {
      const p1 = new Vec3(0, 0, 0)
      const p2 = new Vec3(1, 0, 0)
      const p3 = new Vec3(0, 1, 0)
      const out = Vec3.triangleNormal(p1, p2, p3)
      closeTo(out[0], 0)
      closeTo(out[1], 0)
      closeTo(out[2], 1)
    })
  })

  describe('project', () => {
    it('projects vector onto another', () => {
      const a = new Vec3(3, 4, 0)
      const b = new Vec3(1, 0, 0)
      const out = Vec3.project(a, b)
      closeTo(out[0], 3)
      closeTo(out[1], 0)
      closeTo(out[2], 0)
    })
  })

  describe('orientedAngle', () => {
    it('positive angle for CCW rotation', () => {
      const a = new Vec3(1, 0, 0)
      const b = new Vec3(0, 1, 0)
      const ref = new Vec3(0, 0, 1)
      const angle = Vec3.orientedAngle(a, b, ref)
      closeTo(angle, Math.PI / 2)
    })
  })

  describe('GLSL functions', () => {
    it('clamp with scalar', () => {
      const v = new Vec3(-1, 0.5, 2)
      const out = new Vec3()
      v.clamp(0, 1, out)
      assert.strictEqual(out[0], 0)
      closeTo(out[1], 0.5)
      assert.strictEqual(out[2], 1)
    })
    it('static clamp', () => {
      const out = Vec3.clamp(new Vec3(-1, 0.5, 2), 0, 1)
      assert.strictEqual(out[0], 0)
      closeTo(out[1], 0.5)
      assert.strictEqual(out[2], 1)
    })
    it('mix', () => {
      const a = new Vec3(0, 0, 0)
      const b = new Vec3(10, 20, 30)
      const out = new Vec3()
      a.mix(b, 0.5, out)
      closeTo(out[0], 5)
      closeTo(out[1], 10)
      closeTo(out[2], 15)
    })
    it('step', () => {
      const v = new Vec3(0.3, 0.5, 0.7)
      const out = new Vec3()
      v.step(0.5, out)
      assert.strictEqual(out[0], 0)
      assert.strictEqual(out[1], 1)
      assert.strictEqual(out[2], 1)
    })
    it('smoothstep', () => {
      const v = new Vec3(0, 0.5, 1)
      const out = new Vec3()
      v.smoothstep(0, 1, out)
      closeTo(out[0], 0)
      closeTo(out[1], 0.5)
      closeTo(out[2], 1)
    })
    it('fract', () => {
      const v = new Vec3(1.7, 2.3, 3.9)
      const out = new Vec3()
      v.fract(out)
      closeTo(out[0], 0.7)
      closeTo(out[1], 0.3)
      closeTo(out[2], 0.9)
    })
    it('sign', () => {
      const v = new Vec3(-5, 0, 3)
      const out = new Vec3()
      v.sign(out)
      assert.strictEqual(out[0], -1)
      assert.strictEqual(out[1], 0)
      assert.strictEqual(out[2], 1)
    })
    it('saturate', () => {
      const v = new Vec3(-0.5, 0.5, 1.5)
      const out = new Vec3()
      v.saturate(out)
      assert.strictEqual(out[0], 0)
      closeTo(out[1], 0.5)
      assert.strictEqual(out[2], 1)
    })
  })
})
