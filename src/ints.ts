import { copyPrototype, create } from './internalUtils'
import { Vec2, Vec2i, Vec2u } from './vec2'
import { Vec3, Vec3i, Vec3u } from './vec3'
import { Vec4, Vec4i, Vec4u } from './vec4'

copyPrototype(Vec2, Vec2i)
Vec2i.prototype.$str = 'ivec2'
Vec2i.prototype.vec2 = Vec2i
Vec2i.prototype.vec3 = Vec3i
Vec2i.prototype.vec4 = Vec4i
export const vec2i = create<typeof Vec2i, Vec2>(Vec2i, 2)
export const ivec2 = vec2i

copyPrototype(Vec3, Vec3i)
Vec3i.prototype.$str = 'ivec3'
Vec3i.prototype.vec2 = Vec2i
Vec3i.prototype.vec3 = Vec3i
Vec3i.prototype.vec4 = Vec4i
export const vec3i = create<typeof Vec3i, Vec3>(Vec3i, 3)
export const ivec3 = vec3i

copyPrototype(Vec4, Vec4i)
Vec4i.prototype.$str = 'ivec4'
Vec4i.prototype.vec2 = Vec2i
Vec4i.prototype.vec3 = Vec3i
Vec4i.prototype.vec4 = Vec4i
export const vec4i = create<typeof Vec4i, Vec4>(Vec4i, 4)
export const ivec4 = vec4i

copyPrototype(Vec2, Vec2u)
Vec2u.prototype.$str = 'uvec2'
Vec2u.prototype.vec2 = Vec2u
Vec2u.prototype.vec3 = Vec3u
Vec2u.prototype.vec4 = Vec4u
export const vec2u = create<typeof Vec2u, Vec2>(Vec2u, 2)
export const uvec2 = vec2u

copyPrototype(Vec3, Vec3u)
Vec3u.prototype.$str = 'uvec3'
Vec3u.prototype.vec2 = Vec2u
Vec3u.prototype.vec3 = Vec3u
Vec3u.prototype.vec4 = Vec4u
export const vec3u = create<typeof Vec3u, Vec3>(Vec3u, 3)
export const uvec3 = vec3u

copyPrototype(Vec4, Vec4u)
Vec4u.prototype.$str = 'uvec4'
Vec4u.prototype.vec2 = Vec2u
Vec4u.prototype.vec3 = Vec3u
Vec4u.prototype.vec4 = Vec4u
export const vec4u = create<typeof Vec4u, Vec4>(Vec4u, 4)
export const uvec4 = vec4u

export { Vec2i, Vec2u, Vec3i, Vec3u, Vec4i, Vec4u }