import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  Vec2, Vec2d, Vec2i, vec2, vec2d, vec2i,
  Vec3, Vec3d, Vec3i, vec3, vec3d, vec3i,
  Vec4, Vec4d, Vec4i, vec4, vec4d, vec4i,
  Quat, Quatd, quat, quatd,
  Quat2, Quat2d, quat2, quat2d,
  Mat2, Mat2d, mat2, mat2d,
  Mat2x3, Mat2x3d, mat2x3, mat2x3d,
  Mat3, Mat3d, mat3, mat3d,
  Mat4, Mat4d, mat4, mat4d,
} from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

// ──────────────────────────────────────────────
// Vec2d / Vec2i
// ──────────────────────────────────────────────
describe('Vec2d (Float64Array)', () => {
  it('constructor and instanceof', () => {
    const v = vec2d(1.5, 2.5)
    assert.ok(v instanceof Float64Array)
    assert.strictEqual(v.length, 2)
    assert.strictEqual(v.x, 1.5)
    assert.strictEqual(v.y, 2.5)
  })

  it('static constants', () => {
    const z = Vec2d.ZERO
    assert.ok(z instanceof Float64Array)
    assert.strictEqual(z[0], 0)
    assert.strictEqual(z[1], 0)
    const o = Vec2d.ONE
    assert.strictEqual(o[0], 1)
    assert.strictEqual(o[1], 1)
  })

  it('arithmetic returns Vec2d', () => {
    const a = vec2d(1, 2)
    const b = vec2d(3, 4)
    const r = a.plus(b)
    assert.ok(r instanceof Float64Array)
    assert.strictEqual(r[0], 4)
    assert.strictEqual(r[1], 6)
  })

  it('normalize', () => {
    const v = vec2d(3, 4)
    const n = v.normalize(vec2d())
    assert.ok(n instanceof Float64Array)
    closeTo(n[0], 0.6)
    closeTo(n[1], 0.8)
  })

  it('static normalize returns Vec2d by default', () => {
    const v = vec2d(0, 5)
    const n = Vec2d.normalize(v)
    assert.ok(n instanceof Float64Array)
    closeTo(n[0], 0)
    closeTo(n[1], 1)
  })

  it('static lerp', () => {
    const a = vec2d(0, 0)
    const b = vec2d(10, 20)
    const r = Vec2d.lerp(a, b, 0.5)
    assert.ok(r instanceof Float64Array)
    assert.strictEqual(r[0], 5)
    assert.strictEqual(r[1], 10)
  })

  it('dot product', () => {
    assert.strictEqual(Vec2d.dot(vec2d(1, 2), vec2d(3, 4)), 11)
  })

  it('cross-type out param: Vec2d method with Vec2 out', () => {
    const a = vec2d(1, 2)
    const b = vec2d(3, 4)
    const out = vec2()
    const r = a.plus(b, out)
    assert.ok(r instanceof Float32Array)
    assert.strictEqual(r, out)
    assert.strictEqual(r[0], 4)
  })

  it('clone', () => {
    const v = vec2d(7, 8)
    const c = v.clone()
    assert.ok(c instanceof Float64Array)
    assert.strictEqual(c[0], 7)
    assert.strictEqual(c[1], 8)
    assert.notStrictEqual(c, v)
  })
})

describe('Vec2i (Int32Array)', () => {
  it('constructor and instanceof', () => {
    const v = vec2i(10, 20)
    assert.ok(v instanceof Int32Array)
    assert.strictEqual(v.x, 10)
    assert.strictEqual(v.y, 20)
  })

  it('truncates floats to integers', () => {
    const v = vec2i(3.7, 4.2)
    assert.strictEqual(v[0], 3)
    assert.strictEqual(v[1], 4)
  })

  it('arithmetic returns Vec2i', () => {
    const a = vec2i(10, 20)
    const b = vec2i(3, 7)
    const r = a.plus(b)
    assert.ok(r instanceof Int32Array)
    assert.strictEqual(r[0], 13)
    assert.strictEqual(r[1], 27)
  })

  it('static constants', () => {
    const z = Vec2i.ZERO
    assert.ok(z instanceof Int32Array)
    assert.strictEqual(z[0], 0)
    const o = Vec2i.ONE
    assert.strictEqual(o[0], 1)
  })

  it('floor/ceil are no-ops on ints', () => {
    const v = vec2i(5, 10)
    const f = v.floor(vec2i())
    assert.strictEqual(f[0], 5)
    assert.strictEqual(f[1], 10)
  })
})

// ──────────────────────────────────────────────
// Vec3d / Vec3i
// ──────────────────────────────────────────────
describe('Vec3d (Float64Array)', () => {
  it('constructor and instanceof', () => {
    const v = vec3d(1, 2, 3)
    assert.ok(v instanceof Float64Array)
    assert.strictEqual(v.length, 3)
    assert.strictEqual(v.z, 3)
  })

  it('static constants', () => {
    assert.ok(Vec3d.ZERO instanceof Float64Array)
    assert.strictEqual(Vec3d.unitX[0], 1)
    assert.strictEqual(Vec3d.unitX[1], 0)
    assert.strictEqual(Vec3d.unitY[1], 1)
    assert.strictEqual(Vec3d.unitZ[2], 1)
  })

  it('cross product returns Vec3d', () => {
    const a = vec3d(1, 0, 0)
    const b = vec3d(0, 1, 0)
    const r = Vec3d.cross(a, b)
    assert.ok(r instanceof Float64Array)
    assert.strictEqual(r[0], 0)
    assert.strictEqual(r[1], 0)
    assert.strictEqual(r[2], 1)
  })

  it('normalize', () => {
    const v = vec3d(0, 0, 5)
    const n = v.normalize(vec3d())
    assert.ok(n instanceof Float64Array)
    closeTo(n[2], 1)
  })

  it('transformMat4', () => {
    const v = vec3d(1, 0, 0)
    const m = Mat4.identity
    const r = v.transformMat4(m, vec3d())
    assert.ok(r instanceof Float64Array)
    closeTo(r[0], 1)
    closeTo(r[1], 0)
    closeTo(r[2], 0)
  })
})

describe('Vec3i (Int32Array)', () => {
  it('constructor', () => {
    const v = vec3i(1, 2, 3)
    assert.ok(v instanceof Int32Array)
    assert.strictEqual(v[2], 3)
  })

  it('arithmetic', () => {
    const r = vec3i(10, 20, 30).plus(vec3i(1, 2, 3))
    assert.ok(r instanceof Int32Array)
    assert.strictEqual(r[0], 11)
    assert.strictEqual(r[1], 22)
    assert.strictEqual(r[2], 33)
  })

  it('static constants', () => {
    assert.ok(Vec3i.ZERO instanceof Int32Array)
    assert.strictEqual(Vec3i.unitX[0], 1)
  })
})

// ──────────────────────────────────────────────
// Vec4d / Vec4i
// ──────────────────────────────────────────────
describe('Vec4d (Float64Array)', () => {
  it('constructor and instanceof', () => {
    const v = vec4d(1, 2, 3, 4)
    assert.ok(v instanceof Float64Array)
    assert.strictEqual(v.w, 4)
  })

  it('arithmetic', () => {
    const r = vec4d(1, 2, 3, 4).mult(2)
    assert.ok(r instanceof Float64Array)
    assert.strictEqual(r[0], 2)
    assert.strictEqual(r[3], 8)
  })

  it('normalize', () => {
    const v = vec4d(1, 0, 0, 0)
    const n = v.normalize(vec4d())
    closeTo(n[0], 1)
  })

  it('static lerp', () => {
    const r = Vec4d.lerp(vec4d(0, 0, 0, 0), vec4d(4, 8, 12, 16), 0.25)
    assert.ok(r instanceof Float64Array)
    assert.strictEqual(r[0], 1)
    assert.strictEqual(r[3], 4)
  })
})

describe('Vec4i (Int32Array)', () => {
  it('arithmetic', () => {
    const r = vec4i(2, 4, 6, 8).div(2)
    assert.ok(r instanceof Int32Array)
    assert.strictEqual(r[0], 1)
    assert.strictEqual(r[3], 4)
  })
})

// ──────────────────────────────────────────────
// Quatd
// ──────────────────────────────────────────────
describe('Quatd (Float64Array)', () => {
  it('constructor defaults to identity', () => {
    const q = quatd()
    assert.ok(q instanceof Float64Array)
    assert.strictEqual(q[0], 0)
    assert.strictEqual(q[3], 1)
  })

  it('static identity', () => {
    const q = Quatd.identity
    assert.ok(q instanceof Float64Array)
    assert.strictEqual(q[3], 1)
  })

  it('fromAxisAngle returns Quatd', () => {
    const q = Quatd.fromAxisAngle(vec3d(0, 1, 0), Math.PI / 2)
    assert.ok(q instanceof Float64Array)
    closeTo(q[1], Math.sin(Math.PI / 4))
    closeTo(q[3], Math.cos(Math.PI / 4))
  })

  it('multiply', () => {
    const a = quatd(0, 0, 0, 1)
    const b = Quatd.fromAxisAngle(vec3d(0, 0, 1), Math.PI / 2)
    const r = a.multiply(b)
    assert.ok(r instanceof Float64Array)
    closeTo(r[2], Math.sin(Math.PI / 4))
  })

  it('slerp', () => {
    const a = quatd(0, 0, 0, 1)
    const b = Quatd.fromAxisAngle(vec3d(0, 1, 0), Math.PI)
    const r = Quatd.slerp(a, b, 0.5)
    assert.ok(r instanceof Float64Array)
    closeTo(r[1], Math.sin(Math.PI / 4))
  })

  it('normalize', () => {
    const q = quatd(1, 1, 1, 1)
    const n = q.normalize(quatd())
    assert.ok(n instanceof Float64Array)
    closeTo(n[0] * n[0] + n[1] * n[1] + n[2] * n[2] + n[3] * n[3], 1)
  })

  it('conjugate', () => {
    const q = Quatd.fromAxisAngle(vec3d(0, 1, 0), Math.PI / 2)
    const c = q.conjugate(quatd())
    assert.ok(c instanceof Float64Array)
    closeTo(c[1], -q[1])
    assert.strictEqual(c[3], q[3])
  })

  it('toMat3 returns Mat3d', () => {
    const q = quatd(0, 0, 0, 1)
    const m = q.toMat3()
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m.length, 9)
    closeTo(m[0], 1)
  })

  it('toMat4 returns Mat4d', () => {
    const q = quatd(0, 0, 0, 1)
    const m = q.toMat4()
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m.length, 16)
    closeTo(m[0], 1)
    closeTo(m[15], 1)
  })

  it('eulerAngles returns Vec3d', () => {
    const q = quatd(0, 0, 0, 1)
    const e = q.eulerAngles()
    assert.ok(e instanceof Float64Array)
    assert.strictEqual(e.length, 3)
    closeTo(e[0], 0)
  })
})

// ──────────────────────────────────────────────
// Quat2d
// ──────────────────────────────────────────────
describe('Quat2d (Float64Array)', () => {
  it('constructor defaults to identity', () => {
    const q = quat2d()
    assert.ok(q instanceof Float64Array)
    assert.strictEqual(q[3], 1)
    assert.strictEqual(q[7], 0)
  })

  it('static identity', () => {
    const q = Quat2d.identity
    assert.ok(q instanceof Float64Array)
    assert.strictEqual(q[3], 1)
  })

  it('fromRotationTranslation returns Quat2d', () => {
    const rot = quatd(0, 0, 0, 1)
    const t = vec3d(1, 2, 3)
    const dq = Quat2d.fromRotationTranslation(rot, t)
    assert.ok(dq instanceof Float64Array)
    assert.strictEqual(dq.length, 8)
    assert.strictEqual(dq[3], 1)
  })

  it('getTranslation returns Vec3d', () => {
    const t = vec3d(5, 10, 15)
    const dq = Quat2d.fromTranslation(t)
    const out = dq.getTranslation()
    assert.ok(out instanceof Float64Array)
    assert.strictEqual(out.length, 3)
    closeTo(out[0], 5)
    closeTo(out[1], 10)
    closeTo(out[2], 15)
  })

  it('getReal returns Quatd', () => {
    const dq = quat2d(0, 0, 0, 1, 0, 0, 0, 0)
    const real = dq.getReal()
    assert.ok(real instanceof Float64Array)
    assert.strictEqual(real.length, 4)
    assert.strictEqual(real[3], 1)
  })

  it('normalize', () => {
    const dq = quat2d(0, 0, 0, 1, 0.5, 0, 0, 0)
    const n = dq.normalize(quat2d())
    assert.ok(n instanceof Float64Array)
    closeTo(n[3], 1)
  })
})

// ──────────────────────────────────────────────
// Mat2d
// ──────────────────────────────────────────────
describe('Mat2d (Float64Array)', () => {
  it('constructor', () => {
    const m = mat2d(1, 0, 0, 1)
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m.length, 4)
  })

  it('static identity', () => {
    const m = Mat2d.identity
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m[0], 1)
    assert.strictEqual(m[3], 1)
  })

  it('fromRotation returns Mat2d', () => {
    const m = Mat2d.fromRotation(Math.PI / 4)
    assert.ok(m instanceof Float64Array)
    closeTo(m[0], Math.cos(Math.PI / 4))
    closeTo(m[1], Math.sin(Math.PI / 4))
  })

  it('multiply', () => {
    const a = Mat2d.identity
    const b = Mat2d.fromRotation(Math.PI / 2)
    const r = a.multiply(b)
    assert.ok(r instanceof Float64Array)
    closeTo(r[0], Math.cos(Math.PI / 2))
  })

  it('determinant', () => {
    const m = Mat2d.identity
    closeTo(m.determinant(), 1)
  })
})

// ──────────────────────────────────────────────
// Mat2x3d
// ──────────────────────────────────────────────
describe('Mat2x3d (Float64Array)', () => {
  it('constructor', () => {
    const m = mat2x3d(1, 0, 0, 1, 0, 0)
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m.length, 6)
  })

  it('static identity', () => {
    const m = Mat2x3d.identity
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m[0], 1)
    assert.strictEqual(m[3], 1)
    assert.strictEqual(m[4], 0)
  })

  it('fromTranslation returns Mat2x3d', () => {
    const m = Mat2x3d.fromTranslation(vec2d(5, 10))
    assert.ok(m instanceof Float64Array)
    closeTo(m[4], 5)
    closeTo(m[5], 10)
  })

  it('translate', () => {
    const m = Mat2x3d.identity
    const r = m.translate(vec2d(3, 4))
    assert.ok(r instanceof Float64Array)
    closeTo(r[4], 3)
    closeTo(r[5], 4)
  })
})

// ──────────────────────────────────────────────
// Mat3d
// ──────────────────────────────────────────────
describe('Mat3d (Float64Array)', () => {
  it('constructor', () => {
    const m = mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1)
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m.length, 9)
  })

  it('static identity', () => {
    const m = Mat3d.identity
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m[0], 1)
    assert.strictEqual(m[4], 1)
    assert.strictEqual(m[8], 1)
  })

  it('fromRotation returns Mat3d', () => {
    const m = Mat3d.fromRotation(Math.PI / 4)
    assert.ok(m instanceof Float64Array)
    closeTo(m[0], Math.cos(Math.PI / 4))
  })

  it('multiply', () => {
    const a = Mat3d.identity
    const b = Mat3d.identity
    const r = a.multiply(b)
    assert.ok(r instanceof Float64Array)
    closeTo(r[0], 1)
    closeTo(r[4], 1)
  })

  it('determinant', () => {
    closeTo(Mat3d.identity.determinant(), 1)
  })

  it('transpose', () => {
    const m = mat3d(1, 2, 3, 4, 5, 6, 7, 8, 9)
    const t = m.transpose(mat3d())
    assert.ok(t instanceof Float64Array)
    assert.strictEqual(t[1], 4)
    assert.strictEqual(t[3], 2)
  })
})

// ──────────────────────────────────────────────
// Mat4d
// ──────────────────────────────────────────────
describe('Mat4d (Float64Array)', () => {
  it('constructor', () => {
    const m = mat4d()
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m.length, 16)
  })

  it('static identity', () => {
    const m = Mat4d.identity
    assert.ok(m instanceof Float64Array)
    assert.strictEqual(m[0], 1)
    assert.strictEqual(m[5], 1)
    assert.strictEqual(m[10], 1)
    assert.strictEqual(m[15], 1)
  })

  it('fromTranslation returns Mat4d', () => {
    const m = Mat4d.fromTranslation(vec3d(1, 2, 3))
    assert.ok(m instanceof Float64Array)
    closeTo(m[12], 1)
    closeTo(m[13], 2)
    closeTo(m[14], 3)
  })

  it('fromRotation returns Mat4d', () => {
    const m = Mat4d.fromRotation(Math.PI / 2, vec3d(0, 1, 0))
    assert.ok(m instanceof Float64Array)
    closeTo(m[0], Math.cos(Math.PI / 2))
  })

  it('multiply', () => {
    const a = Mat4d.identity
    const t = Mat4d.fromTranslation(vec3d(5, 0, 0))
    const r = a.multiply(t)
    assert.ok(r instanceof Float64Array)
    closeTo(r[12], 5)
  })

  it('translate', () => {
    const m = Mat4d.identity
    const r = m.translate(vec3d(1, 2, 3))
    assert.ok(r instanceof Float64Array)
    closeTo(r[12], 1)
    closeTo(r[13], 2)
    closeTo(r[14], 3)
  })

  it('getTranslation returns Vec3d', () => {
    const m = Mat4d.fromTranslation(vec3d(7, 8, 9))
    const t = m.getTranslation()
    assert.ok(t instanceof Float64Array)
    assert.strictEqual(t.length, 3)
    closeTo(t[0], 7)
    closeTo(t[1], 8)
    closeTo(t[2], 9)
  })

  it('getRotation returns Quatd', () => {
    const m = Mat4d.identity
    const q = m.getRotation()
    assert.ok(q instanceof Float64Array)
    assert.strictEqual(q.length, 4)
    closeTo(q[3], 1)
  })

  it('decompose returns correct types', () => {
    const m = Mat4d.fromTranslation(vec3d(1, 2, 3))
    const r = m.decompose()
    assert.ok(r instanceof Float64Array) // out_r (Quatd)
    assert.strictEqual(r.length, 4)
  })

  it('determinant', () => {
    closeTo(Mat4d.identity.determinant(), 1)
  })

  it('invert', () => {
    const m = Mat4d.fromTranslation(vec3d(5, 0, 0))
    const inv = m.invert(mat4d())
    assert.ok(inv instanceof Float64Array)
    closeTo(inv![12], -5)
  })

  it('perspective', () => {
    const m = Mat4d.perspectiveNO(Math.PI / 4, 1, 0.1, 100)
    assert.ok(m instanceof Float64Array)
    assert.ok(m[0] !== 0)
    assert.ok(m[5] !== 0)
  })

  it('lookAt', () => {
    const m = Mat4d.lookAt(vec3d(0, 0, 5), vec3d(0, 0, 0), vec3d(0, 1, 0))
    assert.ok(m instanceof Float64Array)
    closeTo(m[14], -5)
  })

  it('ortho', () => {
    const m = Mat4d.orthoNO(-1, 1, -1, 1, 0.1, 100)
    assert.ok(m instanceof Float64Array)
    assert.ok(m[0] !== 0)
  })
})

// ──────────────────────────────────────────────
// Cross-type interop
// ──────────────────────────────────────────────
describe('Cross-type interop', () => {
  it('Vec2d can output to Vec2 out param', () => {
    const a = vec2d(1, 2)
    const out = vec2()
    const r = a.mult(3, out)
    assert.ok(r instanceof Float32Array)
    assert.strictEqual(r[0], 3)
    assert.strictEqual(r[1], 6)
  })

  it('Vec3d can output to Vec3 out param', () => {
    const a = vec3d(2, 4, 6)
    const out = vec3()
    const r = a.div(2, out)
    assert.ok(r instanceof Float32Array)
    assert.strictEqual(r[0], 1)
    assert.strictEqual(r[2], 3)
  })

  it('Vec2i can output to Vec2 out param', () => {
    const a = vec2i(10, 20)
    const out = vec2()
    const r = a.plus(vec2i(1, 2), out)
    assert.ok(r instanceof Float32Array)
    assert.strictEqual(r[0], 11)
  })

  it('Quatd.slerp can output to Quat out', () => {
    const a = quatd(0, 0, 0, 1)
    const b = Quatd.fromAxisAngle(vec3d(0, 1, 0), Math.PI)
    const out = quat()
    const r = Quatd.slerp(a, b, 0.5, out)
    assert.ok(r instanceof Float32Array)
    assert.strictEqual(r, out)
  })

  it('Mat4d can output to Mat4 out', () => {
    const m = Mat4d.identity
    const out = mat4()
    const r = m.transpose(out)
    assert.ok(r instanceof Float32Array)
    assert.strictEqual(r, out)
    closeTo(r[0], 1)
  })

  it('Vec3Like accepted as input across types', () => {
    const a = vec3d(1, 0, 0)
    const b = vec3(0, 1, 0)
    const dot = Vec3d.dot(a, b)
    assert.strictEqual(dot, 0)

    const dist = Vec3d.distance(a, b)
    closeTo(dist, Math.sqrt(2))
  })
})
