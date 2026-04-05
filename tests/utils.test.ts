import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { radians, degrees, round, rad, deg, toRadians, toDegrees, clamp, mix, lerp, step, smoothstep, fract, sign, saturate } from '../dist/esm/glmaths'

function closeTo(actual: number, expected: number, numDigits = 5) {
  const pass = Math.abs(actual - expected) < Math.pow(10, -numDigits) / 2
  assert.ok(pass, `expected ${actual} to be close to ${expected}`)
}

describe('utils', () => {
  describe('radians', () => {
    it('converts 0 degrees to 0 radians', () => {
      assert.strictEqual(radians(0), 0)
    })
    it('converts 180 degrees to PI radians', () => {
      closeTo(radians(180), Math.PI)
    })
    it('converts 90 degrees to PI/2 radians', () => {
      closeTo(radians(90), Math.PI / 2)
    })
    it('converts 360 degrees to 2*PI radians', () => {
      closeTo(radians(360), 2 * Math.PI)
    })
    it('converts negative degrees', () => {
      closeTo(radians(-90), -Math.PI / 2)
    })
  })

  describe('degrees', () => {
    it('converts 0 radians to 0 degrees', () => {
      assert.strictEqual(degrees(0), 0)
    })
    it('converts PI radians to 180 degrees', () => {
      closeTo(degrees(Math.PI), 180)
    })
    it('converts PI/2 radians to 90 degrees', () => {
      closeTo(degrees(Math.PI / 2), 90)
    })
  })

  describe('round', () => {
    it('rounds positive numbers normally', () => {
      assert.strictEqual(round(1.5), 2)
      assert.strictEqual(round(2.3), 2)
      assert.strictEqual(round(2.7), 3)
    })
    it('rounds negative half-integers down (bankers-style)', () => {
      assert.strictEqual(round(-0.5), -1)
      assert.strictEqual(round(-1.5), -2)
    })
    it('rounds other negative numbers normally', () => {
      assert.strictEqual(round(-2.3), -2)
      assert.strictEqual(round(-2.7), -3)
    })
  })

  describe('aliases', () => {
    it('rad is radians', () => {
      assert.strictEqual(rad, radians)
    })
    it('toRadians is radians', () => {
      assert.strictEqual(toRadians, radians)
    })
    it('deg is degrees', () => {
      assert.strictEqual(deg, degrees)
    })
    it('toDegrees is degrees', () => {
      assert.strictEqual(toDegrees, degrees)
    })
  })

  describe('clamp', () => {
    it('clamps below min', () => assert.strictEqual(clamp(-1, 0, 1), 0))
    it('clamps above max', () => assert.strictEqual(clamp(2, 0, 1), 1))
    it('passes through in range', () => assert.strictEqual(clamp(0.5, 0, 1), 0.5))
  })

  describe('mix / lerp', () => {
    it('mix at 0 returns x', () => assert.strictEqual(mix(1, 2, 0), 1))
    it('mix at 1 returns y', () => assert.strictEqual(mix(1, 2, 1), 2))
    it('mix at 0.5 returns midpoint', () => assert.strictEqual(mix(0, 10, 0.5), 5))
    it('lerp is alias for mix', () => assert.strictEqual(lerp, mix))
  })

  describe('step', () => {
    it('below edge returns 0', () => assert.strictEqual(step(0.5, 0.3), 0))
    it('at edge returns 1', () => assert.strictEqual(step(0.5, 0.5), 1))
    it('above edge returns 1', () => assert.strictEqual(step(0.5, 0.7), 1))
  })

  describe('smoothstep', () => {
    it('below edge0 returns 0', () => assert.strictEqual(smoothstep(0, 1, -0.5), 0))
    it('above edge1 returns 1', () => assert.strictEqual(smoothstep(0, 1, 1.5), 1))
    it('midpoint', () => closeTo(smoothstep(0, 1, 0.5), 0.5))
  })

  describe('fract', () => {
    it('fractional part of positive', () => closeTo(fract(1.7), 0.7))
    it('fractional part of negative', () => closeTo(fract(-0.3), 0.7))
  })

  describe('sign', () => {
    it('positive returns 1', () => assert.strictEqual(sign(5), 1))
    it('negative returns -1', () => assert.strictEqual(sign(-3), -1))
    it('zero returns 0', () => assert.strictEqual(sign(0), 0))
  })

  describe('saturate', () => {
    it('clamps to 0-1', () => {
      assert.strictEqual(saturate(-1), 0)
      assert.strictEqual(saturate(0.5), 0.5)
      assert.strictEqual(saturate(2), 1)
    })
  })
})
