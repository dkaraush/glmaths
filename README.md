# glmaths

Linear algebra functions for working with WebGL in TypeScript, aimed to be looking similar to GLSL code. Inspired by [`gl-matrix`](https://glmatrix.net/).

_83KB minified, 18KB gzipped_

### How to install

You can take [`dist/glmaths.min.js`](https://github.com/dkaraush/glmaths/blob/main/dist/glmaths.min.js), or install with npm:
```
npm install glmaths
```
There are also `dist/cjs/` and `dist/esm/` builds for different import formats.

### Usage Example

```ts
// from glmaths[.min].js:
const { vec3, vec4, mat4, quat } = glmaths
// from npm:
import { vec3, vec4, mat4, quat } from 'glmaths'

const vertex = vec3(2, 1, 0)
vertex.rotateX(Math.PI / 3, vec3(0.5))

const proj = mat4.perspective(Math.PI / 2, 16 / 9, 0.001, 1000)
const view = mat4.lookAt(vec3(0, 0, -10), vec3(0), vec3(0, 0, 1))
const ndc = vertex.transformMat4(proj.mult(view))

// All types extend Float32Array, so you can pass them to webgl
gl.uniformMatrix4fv(u_proj, false, proj)
```

## Swizzles!

`.xyzw`, `.rgba`, `.stpq`, `.uv` swizzles are supported on `vec2`, `vec3`, `vec4`.

`0` and `1` on not first symbol are also supported, f.ex: `a.x0z`, `b.rgb1`, `c.uv01`.

## Vector packing

You can pass vector in a vector, just like in GLSL: `vec4(vec2(0, 1), 2, 3)`

## Operator Overloading!

If you code in TypeScript, you can opt for [a fork of TypeScript](https://github.com/dkaraush/Typescript) to enable operator overloading in code! `glmaths` implements functions needed to overload these operators: `+ - * / % == ===`

```ts
const ndc = proj * view * vertex
let model = mat4()
model *= mat4.fromRotation(Math.PI / 2, vec3(0, 1, 0))
vec4(vec2(1.0, 2.0) / 2.0 + 4.0, 0.0, 1.0) + vec4(1) * vec4(4, 2, 0, 0)
```
_With this done, it totally looks like GLSL! :D_

## `out` argument

Like `gl-matrix`, all functions have `out` argument, but it is located at the end as an optional argument:
```ts
const a = vec3(0, 1, 2)
const b = vec3(2, 3, 4)
const c = vec3()
a.plus(b, /* out = */ c)
```

The idea behind `glmaths` is to make tinkering fun — so by default every operation returns a new copy, and you can just write `a.plus(b)` without thinking about memory. But when you need performance, you can pre-allocate structures and pass them as `out`, just like you would in `gl-matrix`.

You can also set `glmaths.ALWAYS_COPY = false` to make instance methods modify the structure in place by default, skipping the copy entirely. But this can bring confusion, hence why this is not the default:
```ts
glmaths.ALWAYS_COPY = false
const a = vec3(0, 1, 2)
const b = a.plus(5)
// a.x === 5, a was modified in place
```

## Other number formats

`glmaths` supports also `float64`, `int32`, `uint32` variants:

- **`Float64Array`**: `vec2d`/`dvec2`, `vec3d`/`dvec3`, `vec4d`/`dvec4`, `quatd`/`dquat`, `quat2d`/`dquat2`, `mat2d`/`mat2x2d`/`dmat2`/`dmat2x2`, `mat3d`/`mat3x3d`/`dmat3`/`dmat3x3`, `mat4d`/`mat4x4d`/`dmat4`/`dmat4x4`
- **`Int32Array`**: `vec2i`/`ivec2`, `vec3i`/`ivec3`, `vec4i`/`ivec4`
- **`Uint32Array`**: `vec2u`/`uvec2`, `vec3u`/`uvec3`, `vec4u`/`uvec4`


## Docs

- **EPSILON** = `0.000001` — used in `a.equals(b)` functions
- **RANDOM** = `Math.random` — used in `.random()` functions
- **ANGLE_ORDER** = `'zyx'` — used in [`Quat.fromEuler`](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L482)
- **[ALWAYS_COPY](#out-argument)** = `false`
- **LEFT_HANDED** = `false` — set to true for left handed geometry, used in `mat4`

<!-- These are automatically generated, look at ./docs.js -->
<!-- DOCS -->

<a id="mat2"></a>
### Mat2: [mat2](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L11), [mat2d](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L349)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L38)**(): [mat2](#mat2)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L48)**(out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L68)**(out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L89)**(out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L103)**(): number
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L114)**(rad: number, out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L131)**(v: [Vec2](#vec2), out?: [Mat2](#mat2)): [Mat2](#mat2)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L147)**(rad: number, out?: [Mat2](#mat2)): [Mat2](#mat2)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L163)**(v: [Vec2](#vec2), out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L175)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L343)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L175)**
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L183)**(): number
- **[LDU](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L194)**(L?: [Mat2](#mat2), D?: [Mat2](#mat2), U?: [Mat2](#mat2)): 
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L213)**(b: [Mat2](#mat2), out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L336)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L213)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L228)**(b: [Mat2](#mat2), out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L337)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L228)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L338)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L228)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L245)**(b: [Mat2](#mat2) | [Vec2](#vec2), out?: any): any
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L339)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L245)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L340)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L245)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L341)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L245)**
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L264)**(b: [Mat2](#mat2)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L273)**(b: [Mat2](#mat2)): boolean
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L287)**(b: number, out?: [Mat2](#mat2)): [Mat2](#mat2)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L342)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L287)**



<a id="mat2x3"></a>
### Mat2x3: [mat2x3](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L12), [mat2x3d](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L353)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L44)**(out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L64)**(): number
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L75)**(rad: number, out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L95)**(v: [Vec2](#vec2), out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L114)**(v: [Vec2](#vec2), out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L133)**(rad: number, out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L150)**(v: [Vec2](#vec2), out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L165)**(v: [Vec2](#vec2), out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L178)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L346)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L178)**
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L187)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L198)**(b: [Mat2x3](#mat2x3), out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L340)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L198)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L215)**(b: [Mat2x3](#mat2x3), out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L341)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L215)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L342)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L215)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L234)**(b: [Vec2](#vec2) | [Mat2x3](#mat2x3), out?: [Mat2x3](#mat2x3)): [vec2](#vec2) | [Mat2x3](#mat2x3)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L343)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L234)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L344)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L234)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L345)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L234)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L255)**(b: [Mat2x3](#mat2x3)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L267)**(b: [Mat2x3](#mat2x3)): boolean
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L281)**(b: number, out?: [Mat2x3](#mat2x3)): [Mat2x3](#mat2x3)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L347)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L281)**
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L296)**(): [mat2x3](#mat2x3)



<a id="mat3"></a>
### Mat3: [mat3](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L15), [mat3d](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L646)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L52)**(): [mat3](#mat3)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L62)**(out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L91)**(out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L122)**(out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L144)**(): number
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L161)**(b: [Vec2](#vec2) | [Mat3](#mat3) | [Vec3](#vec3), out?: [Mat3](#mat3)): [vec2](#vec2) | [vec3](#vec3) | [Mat3](#mat3)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L636)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L161)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L637)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L161)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L638)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L161)**
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L194)**(v: [Vec2](#vec2), out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L219)**(rad: number, out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L244)**(v: [Vec2](#vec2), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L265)**(v: [Vec2](#vec2), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L285)**(rad: number, out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L306)**(v: [Vec2](#vec2), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L326)**(a: [Mat2x3](#mat2x3), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromQuat](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L346)**(q: [Quat](#quat), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[normalFromMat4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L374)**(a: [Mat4](#mat4), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L416)**(a: [Mat4](#mat4), out?: [Mat3](#mat3)): [Mat3](#mat3)
- _static_ **[fromMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L632)** → **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L416)**
- _static_ **[projection](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L438)**(width: number, height: number, out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L456)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L471)**(b: [Mat3](#mat3), out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L633)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L471)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L491)**(b: [Mat3](#mat3), out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L634)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L491)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L635)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L491)**
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L511)**(b: number, out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L640)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L511)**
- **[multiplyScalarAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L532)**(b: [Mat3](#mat3), scale: number, out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L550)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L639)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L550)**
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L560)**(b: [Mat3](#mat3)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L580)**(b: [Mat3](#mat3)): boolean



<a id="mat4"></a>
### Mat4: [mat4](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L14), [mat4d](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1371)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L70)**(): [mat4](#mat4)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L85)**(out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L116)**(out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L164)**(out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L207)**(): number
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L234)**(b: [Vec2](#vec2) | [Vec3](#vec3) | [Mat4](#mat4) | [Vec4](#vec4), out?: [Vec2](#vec2) | [Vec3](#vec3) | [Mat4](#mat4) | [Vec4](#vec4)): [Vec2](#vec2) | [Vec3](#vec3) | [Mat4](#mat4) | [Vec4](#vec4)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1361)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L234)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1362)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L234)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1363)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L234)**
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L284)**(v: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L313)**(v: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L330)**(rad: number, axis: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L369)**(rad: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L393)**(rad: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L417)**(rad: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[getTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L440)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[getScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L451)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[getRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L470)**(out?: [Quat](#quat)): [Quat](#quat)
- **[decompose](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L517)**(out_r?: [Quat](#quat), out_t?: [Vec3](#vec3), out_s?: [Vec3](#vec3)): [Quat](#quat)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L576)**(v: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L592)**(v: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L609)**(rad: number, axis: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromXRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L633)**(rad: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromYRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L652)**(rad: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromZRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L670)**(rad: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromRotationTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L689)**(q: [Quat](#quat), v: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromRotationTranslationScale](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L713)**(q: [Quat](#quat), v: [Vec3](#vec3), s: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromRotationTranslationScaleOrigin](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L739)**(q: [Quat](#quat), v: [Vec3](#vec3), s: [Vec3](#vec3), o: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[fromQuat](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L776)**(q: [Quat](#quat), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[frustum](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L803)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[perspectiveNO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L828)**(fovy: number, aspect: number, near: number, far: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[perspectiveZO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L859)**(fovy: number, aspect: number, near: number, far: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[perspectiveFromFieldOfView](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L886)**(fov: { updegrees: number; downdegrees: number; leftdegrees: number; rightdegrees: number; }, near: number, far: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[orthoNO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L921)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[orthoZO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L948)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[lookAt](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L970)**(eye: [Vec3](#vec3), center: [Vec3](#vec3), up: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[targetTo](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1026)**(eye: [Vec3](#vec3), target: [Vec3](#vec3), up: [Vec3](#vec3), out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[infinitePerspective](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1068)**(fovy: number, aspect: number, near: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- _static_ **[project](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1091)**(obj: [Vec3](#vec3), model: [Mat4](#mat4), proj: [Mat4](#mat4), viewport: [Vec4](#vec4), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[unProject](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1123)**(win: [Vec3](#vec3), model: [Mat4](#mat4), proj: [Mat4](#mat4), viewport: [Vec4](#vec4), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1174)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1190)**(b: [Mat4](#mat4), out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1358)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1190)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1205)**(b: [Mat4](#mat4), out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1359)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1205)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1360)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1205)**
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1220)**(b: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1365)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1220)**
- **[multiplyScalarAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1236)**(b: [Mat4](#mat4), scale: number, out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1253)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1364)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1253)**
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1263)**(b: [Mat4](#mat4)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1278)**(b: [Mat4](#mat4)): boolean



<a id="quat"></a>
### Quat: [quat](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L12), [quatd](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L966)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L41)**(b: number | [Quat](#quat), out?: [Quat](#quat)): [Quat](#quat)
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L955)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L41)**
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L956)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L41)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L957)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L41)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L958)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L41)**
- _static_ **[fromAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L69)**(axis: [Vec3](#vec3), rad: number, out?: [Quat](#quat)): [Quat](#quat)
- **[setAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L91)**(axis: [Vec3](#vec3), rad: number, out?: [Quat](#quat)): [Quat](#quat)
- **[getAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L117)**(out_axis: [Vec3](#vec3)): number
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L140)**(a: [Quat](#quat), b: [Quat](#quat)): number
- _static_ **[getAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L954)** → **[angle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L140)**
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L161)**(rad: number, out?: [Quat](#quat)): [Quat](#quat)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L182)**(rad: number, out?: [Quat](#quat)): [Quat](#quat)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L202)**(rad: number, out?: [Quat](#quat)): [Quat](#quat)
- **[calculateW](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L221)**(): number
- _static_ **[exp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L233)**(q: [Quat](#quat), out?: [Quat](#quat)): [Quat](#quat)
- **[exp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L253)**(out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[ln](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L274)**(q: [Quat](#quat), out?: [Quat](#quat)): [Quat](#quat)
- **[ln](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L293)**(out?: [Quat](#quat)): [Quat](#quat)
- **[pow](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L312)**(b: number): this
- _static_ **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L328)**(a: [Quat](#quat), b: [Quat](#quat), t: number, out?: [Quat](#quat)): [Quat](#quat)
- **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L376)**(b: [Quat](#quat), t: number, out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L422)**(out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[invert](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L446)**(q: [Quat](#quat), out?: [Quat](#quat)): [Quat](#quat)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L466)**(out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L487)**(q: [Quat](#quat), out?: [Quat](#quat)): [Quat](#quat)
- **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L503)**(out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[fromMat3](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L520)**(m: [Mat3](#mat3), out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[fromEuler](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L562)**(x: number, y: number, z: number, order?: string, out?: [Quat](#quat)): [Quat](#quat)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L627)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L959)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L627)**
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L638)**(a: [Quat](#quat), b: [Quat](#quat)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L648)**(b: [Quat](#quat)): number
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L658)**(b: [Quat](#quat)): boolean
- _static_ **[rotationTo](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L670)**(a: [Vec3](#vec3), b: [Vec3](#vec3), out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[sqlerp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L707)**(a: [Quat](#quat), b: [Quat](#quat), c: [Quat](#quat), d: [Quat](#quat), t: number, out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[setAxes](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L731)**(view: [Vec3](#vec3), right: [Vec3](#vec3), up: [Vec3](#vec3), out?: [Quat](#quat)): [Quat](#quat)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L762)**(q: [Quat](#quat), out?: [Quat](#quat)): [Quat](#quat)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L960)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L762)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L784)**(out?: [Quat](#quat)): [Quat](#quat)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L960)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L784)**
- _static_ **[quatLookAt](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L798)**(direction: [Vec3](#vec3), up: [Vec3](#vec3), out?: [Quat](#quat)): [Quat](#quat)
- **[pitch](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L819)**(): number
- **[yaw](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L829)**(): number
- **[roll](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L838)**(): number
- **[eulerAngles](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L849)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[toMat3](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L862)**(out?: [Mat3](#mat3)): [Mat3](#mat3)
- **[toMat4](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L880)**(out?: [Mat4](#mat4)): [Mat4](#mat4)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L898)**(): [quat](#quat)



<a id="quat2"></a>
### Quat2: [quat2](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L14), [quat2d](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L500)
- **[getReal](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L44)**(out?: [Quat](#quat)): [Quat](#quat)
- **[getDual](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L57)**(out?: [Quat](#quat)): [Quat](#quat)
- **[setReal](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L70)**(q: [Quat](#quat)): this
- **[setDual](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L81)**(q: [Quat](#quat)): this
- **[getTranslation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L92)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[fromRotationTranslation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L111)**(q: [Quat](#quat), t: [Vec3](#vec3), out?: [Quat2](#quat2)): [Quat2](#quat2)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L133)**(t: [Vec3](#vec3), out?: [Quat2](#quat2)): [Quat2](#quat2)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L149)**(q: [Quat](#quat), out?: [Quat2](#quat2)): [Quat2](#quat2)
- _static_ **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L165)**(m: [Mat4](#mat4), out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L179)**(): [quat2](#quat2)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L190)**(b: [Quat2](#quat2), out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L222)**(v: [Vec3](#vec3), out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L243)**(out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L257)**(out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L273)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L490)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L273)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L283)**(): number
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L294)**(q: [Quat2](#quat2), out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L491)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L294)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L320)**(out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L491)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L320)**
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L333)**(a: [Quat2](#quat2), b: [Quat2](#quat2)): number
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L346)**(a: [Quat2](#quat2), b: [Quat2](#quat2), t: number, out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L372)**(b: [Quat2](#quat2), out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L493)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L372)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L390)**(s: number, out?: [Quat2](#quat2)): [Quat2](#quat2)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L407)**(b: [Quat2](#quat2)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L422)**(b: [Quat2](#quat2)): boolean
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L434)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L492)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L434)**



<a id="vec2"></a>
### Vec2: [vec2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L19), [vec2d](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L980), [vec2i](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L1031), [vec2u](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L1082)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L53)**(b: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L958)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L53)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L74)**(b: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L959)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L74)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L960)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L74)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L95)**(b: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L961)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L95)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L962)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L95)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L963)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L95)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L964)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L95)**
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L116)**(b: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[divide](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L965)** → **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L116)**
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L137)**(a: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[rem](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L158)**(b: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L178)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[neg](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L966)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L178)**
- **[unaryMinus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L967)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L178)**
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L185)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L202)**(v: [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L971)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L202)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L222)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L971)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L222)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L241)**(b: [Vec2](#vec2)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L254)**(b: [Vec2](#vec2)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L263)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L968)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L263)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L273)**(): number
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L284)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L297)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L311)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L325)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L338)**(): [vec2](#vec2)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L348)**(rad?: number, origin?: [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L367)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L969)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L367)**
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L377)**(scale?: number, out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L394)**(a: [Vec2](#vec2), b: [Vec2](#vec2)): number
- _static_ **[signedAngle](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L406)**(a: [Vec2](#vec2), b: [Vec2](#vec2)): number
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L419)**(a: [Vec2](#vec2), b: [Vec2](#vec2)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L429)**(b: [Vec2](#vec2)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L440)**(a: [Vec2](#vec2), b: [Vec2](#vec2), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L457)**(a: [Vec2](#vec2), b: [Vec2](#vec2)): number
- _static_ **[dist](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L956)** → **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L457)**
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L471)**(a: [Vec2](#vec2), b: [Vec2](#vec2)): number
- _static_ **[sqrDist](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L957)** → **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L471)**
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L486)**(a: [Vec2](#vec2), b: [Vec2](#vec2), t: number, out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L505)**(a: [Vec2](#vec2), b: [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L521)**(a: [Vec2](#vec2), b: [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L539)**(v: [Vec2](#vec2), min: number | [Vec2](#vec2), max: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L567)**(a: [Vec2](#vec2), b: [Vec2](#vec2), t: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L970)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L567)**
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L591)**(edge0: number | [Vec2](#vec2), edge1: number | [Vec2](#vec2), v: [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L616)**(b: [Vec2](#vec2), scale: number, out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L632)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L646)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L660)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L676)**(min: number | [Vec2](#vec2), max: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L701)**(out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L717)**(b: [Vec2](#vec2), t: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L970)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L717)**
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L739)**(edge: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L761)**(edge0: number | [Vec2](#vec2), edge1: number | [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[transformMat2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L784)**(m: [mat2](#mat2), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[transformMat2x2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L972)** → **[transformMat2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L784)**
- **[transformMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L801)**(m: [mat2x3](#mat2x3), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L818)**(m: [mat3](#mat3), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[transformMat3x3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L973)** → **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L818)**
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L835)**(m: [mat4](#mat4), out?: [Vec2](#vec2)): [Vec2](#vec2)
- **[transformMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L974)** → **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L835)**
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L854)**(a: [Vec2](#vec2), b: [Vec2](#vec2), scale: number, out?: [Vec2](#vec2)): [Vec2](#vec2)
- _static_ **[reflect](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L873)**(I: [Vec2](#vec2), N: [Vec2](#vec2), out?: [Vec2](#vec2)): [Vec2](#vec2)



<a id="vec3"></a>
### Vec3: [vec3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L18), [vec3d](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1335), [vec3i](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1410), [vec3u](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1484)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L64)**(b: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1314)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L64)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L87)**(b: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1315)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L87)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1316)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L87)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L110)**(b: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1317)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L110)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1318)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L110)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1319)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L110)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1320)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L110)**
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L133)**(b: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[divide](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1321)** → **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L133)**
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L148)**(b: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L170)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[neg](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1322)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L170)**
- **[unaryMinus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1323)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L170)**
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L178)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L196)**(v: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1326)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L196)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L215)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1326)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L215)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L233)**(b: [Vec3](#vec3)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L247)**(b: [Vec3](#vec3)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L256)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1324)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L256)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L266)**(): number
- _static_ **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L277)**(v: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L292)**(v: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L307)**(v: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L321)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L334)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L347)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L362)**(v: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L376)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L390)**(): [vec3](#vec3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L399)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1325)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L399)**
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L410)**(scale?: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L430)**(a: [Vec3](#vec3), b: [Vec3](#vec3)): number
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L445)**(a: [Vec3](#vec3), b: [Vec3](#vec3)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L454)**(b: [Vec3](#vec3)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L466)**(a: [Vec3](#vec3), b: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L486)**(a: [Vec3](#vec3), b: [Vec3](#vec3)): number
- _static_ **[dist](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1312)** → **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L486)**
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L501)**(a: [Vec3](#vec3), b: [Vec3](#vec3)): number
- _static_ **[sqrDist](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1313)** → **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L501)**
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L518)**(a: [Vec3](#vec3), b: [Vec3](#vec3), t: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L539)**(a: [Vec3](#vec3), b: [Vec3](#vec3), t: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L562)**(a: [Vec3](#vec3), b: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L579)**(a: [Vec3](#vec3), b: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L599)**(v: [Vec3](#vec3), min: number | [Vec3](#vec3), max: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L626)**(a: [Vec3](#vec3), b: [Vec3](#vec3), t: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1327)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L626)**
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L653)**(edge0: number | [Vec3](#vec3), edge1: number | [Vec3](#vec3), v: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L682)**(v: [Vec3](#vec3), rad: number, origin?: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L703)**(rad: number, origin?: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L724)**(v: [Vec3](#vec3), rad: number, origin?: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L744)**(rad: number, origin?: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L764)**(v: [Vec3](#vec3), rad: number, origin?: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L783)**(rad: number, origin?: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[hermite](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L806)**(a: [Vec3](#vec3), b: [Vec3](#vec3), c: [Vec3](#vec3), d: [Vec3](#vec3), t: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[bezier](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L835)**(a: [Vec3](#vec3), b: [Vec3](#vec3), c: [Vec3](#vec3), d: [Vec3](#vec3), t: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L865)**(a: [Vec3](#vec3), b: [Vec3](#vec3), scale: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[reflect](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L885)**(I: [Vec3](#vec3), N: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[refract](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L904)**(I: [Vec3](#vec3), N: [Vec3](#vec3), eta: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[faceforward](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L929)**(N: [Vec3](#vec3), I: [Vec3](#vec3), Nref: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[triangleNormal](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L950)**(p1: [Vec3](#vec3), p2: [Vec3](#vec3), p3: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[project](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L972)**(a: [Vec3](#vec3), b: [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- _static_ **[orientedAngle](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L990)**(a: [Vec3](#vec3), b: [Vec3](#vec3), ref: [Vec3](#vec3)): number
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1004)**(b: [Vec3](#vec3), scale: number, out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1021)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1038)**(min: number | [Vec3](#vec3), max: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1063)**(b: [Vec3](#vec3), t: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1327)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1063)**
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1087)**(edge: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1111)**(edge0: number | [Vec3](#vec3), edge1: number | [Vec3](#vec3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1137)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1152)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1167)**(out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1183)**(m: [Mat3](#mat3), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[transformMat3x3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1328)** → **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1183)**
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1201)**(m: [Mat4](#mat4), out?: [Vec3](#vec3)): [Vec3](#vec3)
- **[transformMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1329)** → **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1201)**
- **[transformQuat](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1221)**(q: [Quat](#quat), out?: [Vec3](#vec3)): [Vec3](#vec3)



<a id="vec4"></a>
### Vec4: [vec4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L17), [vec4d](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L993), [vec4i](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L1045), [vec4u](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L1097)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L61)**(b: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L973)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L61)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L86)**(b: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L975)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L86)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L976)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L86)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L111)**(b: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L977)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L111)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L978)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L111)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L979)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L111)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L980)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L111)**
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L136)**(b: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[divide](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L974)** → **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L136)**
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L154)**(b: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L178)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[neg](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L981)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L178)**
- **[unaryMinus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L982)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L178)**
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L187)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L206)**(v: [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L985)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L206)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L228)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L985)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L228)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L249)**(b: [Vec4](#vec4)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L261)**(b: [Vec4](#vec4)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L270)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L983)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L270)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L280)**(): number
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L291)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L306)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L321)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L337)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L352)**(): [vec4](#vec4)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L361)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L984)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L361)**
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L372)**(scale?: number, out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L408)**(a: [Vec4](#vec4), b: [Vec4](#vec4)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L417)**(b: [Vec4](#vec4)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L430)**(u: [Vec4](#vec4), v: [Vec4](#vec4), w: [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L457)**(a: [Vec4](#vec4), b: [Vec4](#vec4)): number
- _static_ **[dist](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L971)** → **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L457)**
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L473)**(a: [Vec4](#vec4), b: [Vec4](#vec4)): number
- _static_ **[sqrDist](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L972)** → **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L473)**
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L491)**(a: [Vec4](#vec4), b: [Vec4](#vec4), t: number, out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L513)**(a: [Vec4](#vec4), b: [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L532)**(a: [Vec4](#vec4), b: [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L553)**(v: [Vec4](#vec4), min: number | [Vec4](#vec4), max: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L583)**(a: [Vec4](#vec4), b: [Vec4](#vec4), t: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L986)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L583)**
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L612)**(edge0: number | [Vec4](#vec4), edge1: number | [Vec4](#vec4), v: [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L645)**(b: [Vec4](#vec4), scale: number, out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L663)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L681)**(min: number | [Vec4](#vec4), max: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L709)**(b: [Vec4](#vec4), t: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L986)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L709)**
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L735)**(edge: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L761)**(edge0: number | [Vec4](#vec4), edge1: number | [Vec4](#vec4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L791)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L807)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L823)**(out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L840)**(m: [mat4](#mat4), out?: [Vec4](#vec4)): [Vec4](#vec4)
- **[transformMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L987)** → **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L840)**
- **[transformQuat](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L859)**(q: [quat](#quat), out?: [Vec4](#vec4)): [Vec4](#vec4)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L886)**(a: [Vec4](#vec4), b: [Vec4](#vec4), scale: number, out?: [Vec4](#vec4)): [Vec4](#vec4)

<!-- DOCS -->

## Benchmark results

You can run benchmark with `npm run bench`.

Suprisingly, in most operations `glmaths` comes faster than its simpler `gl-matrix` library? I honestly quite skeptical about it.

This benchmark, though, doesn't tell the difference in loading up a library. When I started running benchmarks, I noticed how on first test `glmaths` was consistently slower, than `gl-matrix`; and I believe this is a setup cost for extending `Float32Array` with all methods and getters for swizzles. There is a hack in `bencmark.js` to overcome this.

Benchmark is run with `glmaths.ALWAYS_COPY = false`.

| Operation | gl-matrix | glmaths | Diff |
|:---|---:|---:|---:|
| Vec3 creation | 42.8M ops/s ±1.1% | 41.5M ops/s ±0.7% | -3% |
| Vec3 add | 139.5M ops/s ±1.9% | 202.6M ops/s ±3.2% | **+45%** |
| Vec3 dot | 149.9M ops/s ±3.2% | 234.8M ops/s ±4.6% | **+57%** |
| Vec3 cross | 131.8M ops/s ±2.8% | 194.0M ops/s ±3.7% | **+47%** |
| Vec3 normalize | 140.0M ops/s ±2.2% | 210.2M ops/s ±3.2% | **+50%** |
| Vec3 scale | 146.8M ops/s ±3.3% | 217.3M ops/s ±3.5% | **+48%** |
| Vec3 length | 162.3M ops/s ±2.6% | 261.0M ops/s ±6.6% | **+61%** |
| Vec3 distance | 153.7M ops/s ±2.5% | 250.1M ops/s ±3.9% | **+63%** |
| Vec3 lerp | 133.5M ops/s ±2.5% | 193.2M ops/s ±3.8% | **+45%** |
| Vec2 creation | 41.5M ops/s ±1.1% | 41.0M ops/s ±0.8% | -1% |
| Vec2 add | 145.7M ops/s ±2.6% | 218.7M ops/s ±4.1% | **+50%** |
| Vec4 add | 128.2M ops/s ±1.6% | 103.8M ops/s ±1.8% | **-19%** |
| Vec4 normalize | 130.8M ops/s ±3.3% | 106.7M ops/s ±1.9% | **-18%** |
| Mat4 creation | 41.5M ops/s ±0.7% | 44.5M ops/s ±1.1% | +7% |
| Mat4 multiply | 59.5M ops/s ±0.9% | 61.9M ops/s ±1.1% | +4% |
| Mat4 invert | 61.9M ops/s ±0.8% | 69.4M ops/s ±0.9% | **+12%** |
| Mat4 transpose | 106.5M ops/s ±1.6% | 142.2M ops/s ±2.1% | **+34%** |
| Mat4 translate | 75.7M ops/s ±2.9% | 96.8M ops/s ±1.7% | **+28%** |
| Mat4 scale | 96.0M ops/s ±1.5% | 123.2M ops/s ±1.7% | **+28%** |
| Mat4 rotateX | 92.5M ops/s ±2.3% | 122.1M ops/s ±1.9% | **+32%** |
| Mat4 determinant | 136.0M ops/s ±2.2% | 197.2M ops/s ±4.5% | **+45%** |
| Mat4 perspective | 125.9M ops/s ±2.6% | 176.6M ops/s ±3.1% | **+40%** |
| Mat4 lookAt | 45.7M ops/s ±1.1% | 56.0M ops/s ±3.3% | **+22%** |
| Mat3 multiply | 93.6M ops/s ±1.6% | 78.9M ops/s ±1.0% | **-16%** |
| Mat3 invert | 107.6M ops/s ±1.9% | 137.3M ops/s ±2.2% | **+28%** |
| Quat multiply | 117.5M ops/s ±2.2% | 167.5M ops/s ±2.9% | **+43%** |
| Quat slerp | 61.1M ops/s ±1.7% | 126.1M ops/s ±0.8% | **+106%** |
| Quat normalize | 134.2M ops/s ±2.0% | 151.4M ops/s ±2.7% | **+13%** |
| Quat invert | 134.9M ops/s ±3.1% | 198.4M ops/s ±4.3% | **+47%** |
| Quat fromAxisAngle | 145.9M ops/s ±3.4% | 208.2M ops/s ±3.6% | **+43%** |
| Vec3 transformMat4 | 102.1M ops/s ±2.0% | 140.5M ops/s ±1.8% | **+38%** |
| Vec3 transformQuat | 123.6M ops/s ±2.3% | 169.3M ops/s ±3.1% | **+37%** |
| Vec3 scaleAndAdd | 134.3M ops/s ±3.4% | 186.8M ops/s ±4.6% | **+39%** |
| Vec3 mix (lerp) | 134.3M ops/s ±1.9% | 187.0M ops/s ±3.2% | **+39%** |
| Vec4 transformMat4 | 98.1M ops/s ±1.9% | 83.3M ops/s ±1.3% | **-15%** |
| Mat4 project | — | 30.1M ops/s ±0.4% | — |
| Mat4 unProject | — | 11.4M ops/s ±0.2% | — |
| Quat eulerAngles / pitch / yaw / roll | — | 241.5M ops/s ±6.0% | — |
| Quat toMat4 vs Mat4.fromQuat | — | 150.1M ops/s ±2.4% | — |
| Quat2 multiply | — | 88.5M ops/s ±2.2% | — |
| Quat2 getTranslation | — | 42.6M ops/s ±0.7% | — |

### Tests

You can run tests with `npm run test`