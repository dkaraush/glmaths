import { create } from './internalUtils'

import { Vec2 } from './vec2'
import { Vec3 } from './vec3'
import { Vec4 } from './vec4'
import { Quat } from './quat'
import { Quat2 } from './quat2'
import { Mat2 } from './mat2'
import { Mat2x3 } from './mat2x3'
import { Mat3 } from './mat3'
import { Mat4 } from './mat4'

Vec2.prototype.$str = 'vec2'
Vec2.prototype.vec2 = Vec2
Vec2.prototype.vec3 = Vec3
Vec2.prototype.vec4 = Vec4
export const vec2 = create(Vec2, 2)

Vec3.prototype.$str = 'vec3'
Vec3.prototype.vec2 = Vec2
Vec3.prototype.vec3 = Vec3
Vec3.prototype.vec4 = Vec4
export const vec3 = create(Vec3, 3)

Vec4.prototype.$str = 'vec4'
Vec4.prototype.vec2 = Vec2
Vec4.prototype.vec3 = Vec3
Vec4.prototype.vec4 = Vec4
export const vec4 = create(Vec4, 4)

Quat.prototype.$str = 'quat'
Quat.prototype.quat = Quat
Quat.prototype.vec3 = Vec3
Quat.prototype.mat3 = Mat3
Quat.prototype.mat4 = Mat4
Quat.prototype.tmpVec3 = new Vec3()
Quat.prototype.tmp1 = new Quat()
Quat.prototype.tmp2 = new Quat()
Quat.prototype.tmpMat3 = new Mat3()
export const quat = create(Quat, 4)

Quat2.prototype.$str = 'quat2'
Quat2.prototype.quat = Quat
Quat2.prototype.quat2 = Quat2
Quat2.prototype.vec3 = Vec3
export const quat2 = create(Quat2, 8)

Mat2.prototype.$str = 'mat2x2'
Mat2.prototype.mat2 = Mat2
export const mat2 = create(Mat2, 4)
export const mat2x2 = mat2

Mat2x3.prototype.$str = 'mat2x3'
Mat2x3.prototype.mat2x3 = Mat2x3
export const mat2x3 = create(Mat2x3, 6)

Mat3.prototype.$str = 'mat3x3'
Mat3.prototype.mat3 = Mat3
export const mat3 = create(Mat3, 9)
export const mat3x3 = mat3

Mat4.prototype.$str = 'mat4x4'
Mat4.prototype.mat4 = Mat4
Mat4.prototype.vec2 = Vec2
Mat4.prototype.vec3 = Vec3
Mat4.prototype.vec4 = Vec4
Mat4.prototype.quat = Quat
export const mat4 = create(Mat4, 16)
export const mat4x4 = mat4

export { Vec2, Vec3, Vec4, Quat, Quat2, Mat2, Mat2x3, Mat3, Mat4 }