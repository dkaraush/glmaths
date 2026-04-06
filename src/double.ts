import { create, copyPrototype } from './internalUtils'
import { Vec2, Vec2d } from './vec2'
import { Vec3, Vec3d } from './vec3'
import { Vec4, Vec4d } from './vec4'
import { Quat, Quatd } from './quat'
import { Quat2, Quat2d } from './quat2'
import { Mat2, Mat2d } from './mat2'
import { Mat2x3, Mat2x3d } from './mat2x3'
import { Mat3, Mat3d } from './mat3'
import { Mat4, Mat4d } from './mat4'

copyPrototype(Vec2, Vec2d)
Vec2d.prototype.$str = 'vec2d'
Vec2d.prototype.vec2 = Vec2d
Vec2d.prototype.vec3 = Vec3d
Vec2d.prototype.vec4 = Vec4d
export const vec2d = create<typeof Vec2d, Vec2>(Vec2d, 2)

copyPrototype(Vec3, Vec3d)
Vec3d.prototype.$str = 'vec3d'
Vec3d.prototype.vec2 = Vec2d
Vec3d.prototype.vec3 = Vec3d
Vec3d.prototype.vec4 = Vec4d
export const vec3d = create<typeof Vec3d, Vec3>(Vec3d, 3)

copyPrototype(Vec4, Vec4d)
Vec4d.prototype.$str = 'vec4d'
Vec4d.prototype.vec2 = Vec2d
Vec4d.prototype.vec3 = Vec3d
Vec4d.prototype.vec4 = Vec4d
export const vec4d = create<typeof Vec4d, Vec4>(Vec4d, 4)

copyPrototype(Quat, Quatd)
Quatd.prototype.$str = 'quatd'
Quatd.prototype.quat = Quatd
Quatd.prototype.vec3 = Vec3d
Quatd.prototype.mat3 = Mat3d
Quatd.prototype.mat4 = Mat4d
Quatd.prototype.tmpVec3 = new Vec3d()
Quatd.prototype.tmp1 = new Quatd()
Quatd.prototype.tmp2 = new Quatd()
Quatd.prototype.tmpMat3 = new Mat3d()
export const quatd = create<typeof Quatd, Quat>(Quatd, 4)

copyPrototype(Quat2, Quat2d)
Quat2d.prototype.$str = 'quat2d'
Quat2d.prototype.quat = Quatd
Quat2d.prototype.quat2 = Quat2d
Quat2d.prototype.vec3 = Vec3d
export const quat2d = create<typeof Quat2d, Quat2>(Quat2d, 8)

copyPrototype(Mat2, Mat2d)
Mat2d.prototype.$str = 'mat2x2d'
Mat2d.prototype.mat2 = Mat2d
export const mat2d = create<typeof Mat2d, Mat2>(Mat2d, 4)
export const mat2x2d = mat2d

copyPrototype(Mat2x3, Mat2x3d)
Mat2x3d.prototype.$str = 'mat2x3d'
Mat2x3d.prototype.mat2x3 = Mat2x3d
export const mat2x3d = create<typeof Mat2x3d, Mat2x3>(Mat2x3d, 6)

copyPrototype(Mat3, Mat3d)
Mat3d.prototype.$str = 'mat3x3d'
Mat3d.prototype.mat3 = Mat3d
export const mat3d = create<typeof Mat3d, Mat3>(Mat3d, 9)
export const mat3x3d = mat3d

copyPrototype(Mat4, Mat4d)
Mat4d.prototype.$str = 'mat4x4d'
Mat4d.prototype.mat4 = Mat4d
Mat4d.prototype.vec2 = Vec2d
Mat4d.prototype.vec3 = Vec3d
Mat4d.prototype.vec4 = Vec4d
Mat4d.prototype.quat = Quatd
export const mat4d = create<typeof Mat4d, Mat4>(Mat4d, 4)
export const mat4x4d = mat4d

export { Vec2d, Vec3d, Vec4d, Quatd, Quat2d, Mat2d, Mat2x3d, Mat3d, Mat4d }