# glmaths

Linear algebra functions for working with WebGL in TypeScript, aimed to be looking similar to GLSL code. Inspired by [`gl-matrix`](https://glmatrix.net/).

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

## Docs

- **EPSILON** = `0.000001` — used in `a.equals(b)` functions
- **RANDOM** = `Math.random` — used in `.random()` functions
- **ANGLE_ORDER** = `'zyx'` — used in [`Quat.fromEuler`](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L482)
- **[ALWAYS_COPY](#out-argument)** = `false`
- **LEFT_HANDED** = `false` — set to true for left handed geometry, used in `mat4`

<!-- These are automatically generated, look at ./docs.js -->
<!-- DOCS -->

### [mat2](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L8)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L35)**(): [mat2](#mat2)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L45)**(out?: [mat2](#mat2)): [mat2](#mat2)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L65)**(out?: [mat2](#mat2)): [mat2](#mat2) | null
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L86)**(out?: [mat2](#mat2)): [mat2](#mat2)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L100)**(): number
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L111)**(rad: number, out?: [mat2](#mat2)): [mat2](#mat2)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L128)**(v: [vec2](#vec2), out?: [mat2](#mat2)): [mat2](#mat2)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L144)**(rad: number, out?: [mat2](#mat2)): [mat2](#mat2)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L160)**(v: [vec2](#vec2), out?: [mat2](#mat2)): [mat2](#mat2)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L172)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L311)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L172)**
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L180)**(): number
- **[LDU](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L191)**(L?: [mat2](#mat2), D?: [mat2](#mat2), U?: [mat2](#mat2)): mat2[]
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L206)**(b: [mat2](#mat2), out?: [mat2](#mat2)): [mat2](#mat2)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L304)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L206)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L221)**(b: [mat2](#mat2), out?: [mat2](#mat2)): [mat2](#mat2)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L305)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L221)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L306)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L221)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L238)**(b: [mat2](#mat2) | [vec2](#vec2), out?: [mat2](#mat2)): [mat2](#mat2) | [vec2](#vec2)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L307)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L238)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L308)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L238)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L309)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L238)**
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L257)**(b: [mat2](#mat2)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L266)**(b: [mat2](#mat2)): boolean
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L280)**(b: number, out?: [mat2](#mat2)): [mat2](#mat2)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L310)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2.ts#L280)**



### [mat2x3](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L8)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L40)**(out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3) | null
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L60)**(): number
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L71)**(rad: number, out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L91)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L110)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L129)**(rad: number, out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L146)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L161)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L174)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L320)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L174)**
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L183)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L194)**(b: [mat2x3](#mat2x3), out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L314)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L194)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L211)**(b: [mat2x3](#mat2x3), out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L315)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L211)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L316)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L211)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L230)**(b: [vec2](#vec2) | [mat2x3](#mat2x3), out?: [mat2x3](#mat2x3)): [vec2](#vec2) | [mat2x3](#mat2x3)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L317)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L230)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L318)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L230)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L319)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L230)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L251)**(b: [mat2x3](#mat2x3)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L263)**(b: [mat2x3](#mat2x3)): boolean
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L277)**(b: number, out?: [mat2x3](#mat2x3)): [mat2x3](#mat2x3)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L321)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L277)**
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat2x3.ts#L292)**(): [mat2x3](#mat2x3)



### [mat3](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L13)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L50)**(): [mat3](#mat3)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L60)**(out?: [mat3](#mat3)): [mat3](#mat3)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L89)**(out?: [mat3](#mat3)): [mat3](#mat3) | null
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L120)**(out?: [mat3](#mat3)): [mat3](#mat3)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L142)**(): number
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L159)**(b: [vec2](#vec2) | [vec3](#vec3) | [mat3](#mat3), out?: [mat3](#mat3)): [vec2](#vec2) | [vec3](#vec3) | [mat3](#mat3)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L611)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L159)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L612)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L159)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L613)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L159)**
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L192)**(v: [vec2](#vec2), out?: [mat3](#mat3)): [mat3](#mat3)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L217)**(rad: number, out?: [mat3](#mat3)): [mat3](#mat3)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L242)**(v: [vec2](#vec2), out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L263)**(v: [vec2](#vec2), out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L283)**(rad: number, out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L304)**(v: [vec2](#vec2), out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[fromMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L324)**(a: [mat2x3](#mat2x3), out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[fromMat2d](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L606)** → **[fromMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L324)**
- _static_ **[fromQuat](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L345)**(q: [quat](#quat), out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[normalFromMat4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L373)**(a: [mat4](#mat4), out?: [mat3](#mat3)): [mat3](#mat3) | null
- _static_ **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L415)**(a: [mat4](#mat4), out?: [mat3](#mat3)): [mat3](#mat3)
- _static_ **[fromMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L607)** → **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L415)**
- _static_ **[projection](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L437)**(width: number, height: number, out?: [mat3](#mat3)): [mat3](#mat3)
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L455)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L470)**(b: [mat3](#mat3), out?: [mat3](#mat3)): [mat3](#mat3)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L608)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L470)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L490)**(b: [mat3](#mat3), out?: [mat3](#mat3)): [mat3](#mat3)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L609)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L490)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L610)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L490)**
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L510)**(b: number, out?: [mat3](#mat3)): [mat3](#mat3)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L615)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L510)**
- **[multiplyScalarAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L531)**(b: [mat3](#mat3), scale: number, out?: [mat3](#mat3)): [mat3](#mat3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L549)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L614)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L549)**
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L559)**(b: [mat3](#mat3)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat3.ts#L579)**(b: [mat3](#mat3)): boolean



### [mat4](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L12)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L68)**(): [mat4](#mat4)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L83)**(out?: [mat4](#mat4)): [mat4](#mat4)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L114)**(out?: [mat4](#mat4)): [mat4](#mat4) | null
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L162)**(out?: [mat4](#mat4)): [mat4](#mat4)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L205)**(): number
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L231)**(b: [vec2](#vec2) | [vec3](#vec3) | [vec4](#vec4) | [mat4](#mat4), out?: [mat4](#mat4)): [vec2](#vec2) | [vec3](#vec3) | [vec4](#vec4) | [mat4](#mat4)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1301)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L231)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1302)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L231)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1303)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L231)**
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L277)**(v: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L306)**(v: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L323)**(rad: number, axis: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4) | null
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L362)**(rad: number, out?: [mat4](#mat4)): [mat4](#mat4)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L386)**(rad: number, out?: [mat4](#mat4)): [mat4](#mat4)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L410)**(rad: number, out?: [mat4](#mat4)): [mat4](#mat4)
- **[getTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L433)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[getScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L444)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[getRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L463)**(out?: [quat](#quat)): [quat](#quat)
- **[decompose](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L510)**(out_r?: [quat](#quat), out_t?: [vec3](#vec3), out_s?: [vec3](#vec3)): [quat](#quat)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L565)**(v: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L581)**(v: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L598)**(rad: number, axis: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4) | null
- _static_ **[fromXRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L622)**(rad: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromYRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L641)**(rad: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromZRotation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L659)**(rad: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromRotationTranslation](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L678)**(q: [quat](#quat), v: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromRotationTranslationScale](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L702)**(q: [quat](#quat), v: [vec3](#vec3), s: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromRotationTranslationScaleOrigin](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L728)**(q: [quat](#quat), v: [vec3](#vec3), s: [vec3](#vec3), o: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[fromQuat](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L765)**(q: [quat](#quat), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[frustum](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L792)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[perspectiveNO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L817)**(fovy: number, aspect: number, near: number, far: number | null, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[perspectiveZO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L848)**(fovy: number, aspect: number, near: number, far: number | null, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[perspectiveFromFieldOfView](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L875)**(fov: { updegrees: number; downdegrees: number; leftdegrees: number; rightdegrees: number; }, near: number, far: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[orthoNO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L910)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[orthoZO](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L937)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[lookAt](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L959)**(eye: [vec3](#vec3), center: [vec3](#vec3), up: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[targetTo](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1015)**(eye: [vec3](#vec3), target: [vec3](#vec3), up: [vec3](#vec3), out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[infinitePerspective](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1057)**(fovy: number, aspect: number, near: number, out?: [mat4](#mat4)): [mat4](#mat4)
- _static_ **[project](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1080)**(obj: [vec3](#vec3), model: [mat4](#mat4), proj: [mat4](#mat4), viewport: [vec4](#vec4), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[unProject](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1112)**(win: [vec3](#vec3), model: [mat4](#mat4), proj: [mat4](#mat4), viewport: [vec4](#vec4), out?: [vec3](#vec3)): [vec3](#vec3) | null
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1163)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1179)**(b: [mat4](#mat4), out?: [mat4](#mat4)): [mat4](#mat4)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1298)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1179)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1194)**(b: [mat4](#mat4), out?: [mat4](#mat4)): [mat4](#mat4)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1299)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1194)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1300)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1194)**
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1209)**(b: number, out?: [mat4](#mat4)): [mat4](#mat4)
- **[multiplyScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1305)** → **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1209)**
- **[multiplyScalarAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1225)**(b: [mat4](#mat4), scale: number, out?: [mat4](#mat4)): [mat4](#mat4)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1242)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1304)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1242)**
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1252)**(b: [mat4](#mat4)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/mat4.ts#L1267)**(b: [mat4](#mat4)): boolean



### [quat](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L11)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L40)**(b: number | [quat](#quat), out?: [quat](#quat)): [quat](#quat)
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L822)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L40)**
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L823)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L40)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L824)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L40)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L825)** → **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L40)**
- _static_ **[fromAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L65)**(axis: [vec3](#vec3), rad: number, out?: [quat](#quat)): [quat](#quat)
- **[setAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L83)**(axis: [vec3](#vec3), rad: number, out?: [quat](#quat)): [quat](#quat)
- **[getAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L105)**(out_axis: [vec3](#vec3)): number
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L128)**(a: [quat](#quat), b: [quat](#quat)): number
- _static_ **[getAngle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L821)** → **[angle](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L128)**
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L149)**(rad: number, out?: [quat](#quat)): [quat](#quat)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L167)**(rad: number, out?: [quat](#quat)): [quat](#quat)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L184)**(rad: number, out?: [quat](#quat)): [quat](#quat)
- **[calculateW](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L200)**(): number
- _static_ **[exp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L212)**(q: [quat](#quat), out?: [quat](#quat)): [quat](#quat)
- **[exp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L229)**(out?: [quat](#quat)): [quat](#quat)
- _static_ **[ln](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L248)**(q: [quat](#quat), out?: [quat](#quat)): [quat](#quat)
- **[ln](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L264)**(out?: [quat](#quat)): [quat](#quat)
- **[pow](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L281)**(b: number): this
- _static_ **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L297)**(a: [quat](#quat), b: [quat](#quat), t: number, out?: [quat](#quat)): [quat](#quat)
- **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L340)**(b: [quat](#quat), t: number, out?: [quat](#quat)): [quat](#quat)
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L382)**(out?: [quat](#quat)): [quat](#quat)
- _static_ **[invert](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L404)**(q: [quat](#quat), out?: [quat](#quat)): [quat](#quat)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L421)**(out?: [quat](#quat)): [quat](#quat)
- _static_ **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L440)**(q: [quat](#quat), out?: [quat](#quat)): [quat](#quat)
- **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L453)**(out?: [quat](#quat)): [quat](#quat)
- _static_ **[fromMat3](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L468)**(m: [mat3](#mat3), out?: [quat](#quat)): [quat](#quat)
- _static_ **[fromEuler](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L507)**(x: number, y: number, z: number, order?: string, out?: [quat](#quat)): [quat](#quat)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L566)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L826)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L566)**
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L577)**(a: [quat](#quat), b: [quat](#quat)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L588)**(b: [quat](#quat)): number
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L598)**(b: [quat](#quat)): boolean
- _static_ **[rotationTo](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L611)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [quat](#quat)): [quat](#quat)
- _static_ **[sqlerp](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L645)**(a: [quat](#quat), b: [quat](#quat), c: [quat](#quat), d: [quat](#quat), t: number, out?: [quat](#quat)): [quat](#quat)
- _static_ **[setAxes](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L662)**(view: [vec3](#vec3), right: [vec3](#vec3), up: [vec3](#vec3), out?: [quat](#quat)): [quat](#quat)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L686)**(q: [quat](#quat), out?: [quat](#quat)): [quat](#quat)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L827)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L686)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L705)**(out?: [quat](#quat)): [quat](#quat)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L827)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L705)**
- _static_ **[quatLookAt](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L717)**(direction: [vec3](#vec3), up: [vec3](#vec3), out?: [quat](#quat)): [quat](#quat)
- **[pitch](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L734)**(): number
- **[yaw](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L744)**(): number
- **[roll](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L753)**(): number
- **[eulerAngles](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L764)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[toMat3](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L777)**(out?: [mat3](#mat3)): [mat3](#mat3)
- **[toMat4](https://github.com/dkaraush/glmaths/blob/main/src/quat.ts#L795)**(out?: [mat4](#mat4)): [mat4](#mat4)



### [quat2](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L12)
- **[getReal](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L42)**(out?: [quat](#quat)): [quat](#quat)
- **[getDual](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L53)**(out?: [quat](#quat)): [quat](#quat)
- **[setReal](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L64)**(q: [quat](#quat)): this
- **[setDual](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L75)**(q: [quat](#quat)): this
- **[getTranslation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L86)**(out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[fromRotationTranslation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L103)**(q: [quat](#quat), t: [vec3](#vec3), out?: [quat2](#quat2)): [quat2](#quat2)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L121)**(t: [vec3](#vec3), out?: [quat2](#quat2)): [quat2](#quat2)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L134)**(q: [quat](#quat), out?: [quat2](#quat2)): [quat2](#quat2)
- _static_ **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L147)**(m: [mat4](#mat4), out?: [quat2](#quat2)): [quat2](#quat2)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L158)**(): [quat2](#quat2)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L199)**(v: [vec3](#vec3), out?: [quat2](#quat2)): [quat2](#quat2)
- **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L217)**(out?: [quat2](#quat2)): [quat2](#quat2)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L229)**(out?: [quat2](#quat2)): [quat2](#quat2)
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L243)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L417)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L243)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L253)**(): number
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L264)**(q: [quat2](#quat2), out?: [quat2](#quat2)): [quat2](#quat2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L418)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L264)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L287)**(out?: [quat2](#quat2)): [quat2](#quat2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L418)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L287)**
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L298)**(a: [quat2](#quat2), b: [quat2](#quat2)): number
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L311)**(a: [quat2](#quat2), b: [quat2](#quat2), t: number, out?: [quat2](#quat2)): [quat2](#quat2)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L332)**(b: [quat2](#quat2), out?: [quat2](#quat2)): [quat2](#quat2)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L420)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L332)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L347)**(s: number, out?: [quat2](#quat2)): [quat2](#quat2)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L361)**(b: [quat2](#quat2)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L376)**(b: [quat2](#quat2)): boolean
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L388)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L419)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/quat2.ts#L388)**



### [vec2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L14)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L48)**(b: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L788)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L48)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L66)**(b: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L789)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L66)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L790)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L66)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L84)**(b: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L791)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L84)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L792)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L84)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L793)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L84)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L794)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L84)**
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L102)**(b: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[divide](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L795)** → **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L102)**
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L120)**(a: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[rem](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L138)**(b: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L155)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[neg](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L796)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L155)**
- **[unaryMinus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L797)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L155)**
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L160)**(out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L174)**(v: [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L801)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L174)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L191)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L801)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L191)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L208)**(b: [vec2](#vec2)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L221)**(b: [vec2](#vec2)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L230)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L798)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L230)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L240)**(): number
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L251)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L262)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L274)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L286)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L297)**(): [vec2](#vec2)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L307)**(rad?: number, origin?: [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L322)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L799)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L322)**
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L332)**(scale?: number, out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L346)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[signedAngle](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L358)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L371)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L381)**(b: [vec2](#vec2)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L392)**(a: [vec2](#vec2), b: [vec2](#vec2), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L405)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[dist](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L786)** → **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L405)**
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L419)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[sqrDist](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L787)** → **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L419)**
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L434)**(a: [vec2](#vec2), b: [vec2](#vec2), t: number, out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L448)**(a: [vec2](#vec2), b: [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L460)**(a: [vec2](#vec2), b: [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L474)**(v: [vec2](#vec2), min: number | [vec2](#vec2), max: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L497)**(a: [vec2](#vec2), b: [vec2](#vec2), t: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L800)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L497)**
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L516)**(edge0: number | [vec2](#vec2), edge1: number | [vec2](#vec2), v: [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L536)**(b: [vec2](#vec2), scale: number, out?: [vec2](#vec2)): [vec2](#vec2)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L548)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L560)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L572)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L586)**(min: number | [vec2](#vec2), max: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L607)**(out?: [vec2](#vec2)): [vec2](#vec2)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L621)**(b: [vec2](#vec2), t: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[lerpV](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L800)** → **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L621)**
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L639)**(edge: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L658)**(edge0: number | [vec2](#vec2), edge1: number | [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[transformMat2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L677)**(m: [mat2](#mat2), out?: [vec2](#vec2)): [vec2](#vec2)
- **[transformMat2x2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L802)** → **[transformMat2](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L677)**
- **[transformMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L691)**(m: [mat2x3](#mat2x3), out?: [vec2](#vec2)): [vec2](#vec2)
- **[transformMat2d](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L803)** → **[transformMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L691)**
- **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L705)**(m: [mat3](#mat3), out?: [vec2](#vec2)): [vec2](#vec2)
- **[transformMat3x3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L804)** → **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L705)**
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L719)**(m: [mat4](#mat4), out?: [vec2](#vec2)): [vec2](#vec2)
- **[transformMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L805)** → **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L719)**
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L735)**(a: [vec2](#vec2), b: [vec2](#vec2), scale: number, out?: [vec2](#vec2)): [vec2](#vec2)
- _static_ **[reflect](https://github.com/dkaraush/glmaths/blob/main/src/vec2.ts#L749)**(I: [vec2](#vec2), N: [vec2](#vec2), out?: [vec2](#vec2)): [vec2](#vec2)



### [vec3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L13)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L59)**(b: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1064)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L59)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L79)**(b: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1065)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L79)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1066)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L79)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L99)**(b: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1067)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L99)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1068)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L99)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1069)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L99)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1070)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L99)**
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L119)**(b: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[divide](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1071)** → **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L119)**
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L131)**(b: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L150)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[neg](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1072)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L150)**
- **[unaryMinus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1073)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L150)**
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L156)**(out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L172)**(v: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1076)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L172)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L188)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1076)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L188)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L204)**(b: [vec3](#vec3)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L218)**(b: [vec3](#vec3)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L227)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1074)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L227)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L237)**(): number
- _static_ **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L248)**(v: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L260)**(v: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L272)**(v: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L283)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L294)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L305)**(out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L318)**(v: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L329)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L341)**(): [vec3](#vec3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L350)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1075)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L350)**
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L360)**(scale?: number): [vec3](#vec3)
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L378)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L393)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L404)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L420)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[dist](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1062)** → **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L420)**
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L435)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[sqrDist](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1063)** → **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L435)**
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L452)**(a: [vec3](#vec3), b: [vec3](#vec3), t: number, out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L468)**(a: [vec3](#vec3), b: [vec3](#vec3), t: number, out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L486)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L499)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L515)**(v: [vec3](#vec3), min: number | [vec3](#vec3), max: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L537)**(a: [vec3](#vec3), b: [vec3](#vec3), t: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L559)**(edge0: number | [vec3](#vec3), edge1: number | [vec3](#vec3), v: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L583)**(v: [vec3](#vec3), rad: number, origin?: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L599)**(rad: number, origin?: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L616)**(v: [vec3](#vec3), rad: number, origin?: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L631)**(rad: number, origin?: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L647)**(v: [vec3](#vec3), rad: number, origin?: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L661)**(rad: number, origin?: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[hermite](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L680)**(a: [vec3](#vec3), b: [vec3](#vec3), c: [vec3](#vec3), d: [vec3](#vec3), t: number, out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[bezier](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L702)**(a: [vec3](#vec3), b: [vec3](#vec3), c: [vec3](#vec3), d: [vec3](#vec3), t: number, out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L725)**(a: [vec3](#vec3), b: [vec3](#vec3), scale: number, out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[reflect](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L740)**(I: [vec3](#vec3), N: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[refract](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L755)**(I: [vec3](#vec3), N: [vec3](#vec3), eta: number, out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[faceforward](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L775)**(N: [vec3](#vec3), I: [vec3](#vec3), Nref: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[triangleNormal](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L791)**(p1: [vec3](#vec3), p2: [vec3](#vec3), p3: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[project](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L808)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- _static_ **[orientedAngle](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L822)**(a: [vec3](#vec3), b: [vec3](#vec3), ref: [vec3](#vec3)): number
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L836)**(b: [vec3](#vec3), scale: number, out?: [vec3](#vec3)): [vec3](#vec3)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L849)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L864)**(min: number | [vec3](#vec3), max: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L885)**(b: [vec3](#vec3), t: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L905)**(edge: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L926)**(edge0: number | [vec3](#vec3), edge1: number | [vec3](#vec3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L948)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L961)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L974)**(out?: [vec3](#vec3)): [vec3](#vec3)
- **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L988)**(m: [mat3](#mat3), out?: [vec3](#vec3)): [vec3](#vec3)
- **[transformMat3x3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1077)** → **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L988)**
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1003)**(m: [mat4](#mat4), out?: [vec3](#vec3)): [vec3](#vec3)
- **[transformMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1078)** → **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1003)**
- **[transformQuat](https://github.com/dkaraush/glmaths/blob/main/src/vec3.ts#L1020)**(q: [quat](#quat), out?: [vec3](#vec3)): [vec3](#vec3)



### [vec4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L12)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L56)**(b: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[add](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L806)** → **[plus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L56)**
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L78)**(b: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[sub](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L808)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L78)**
- **[subtract](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L809)** → **[minus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L78)**
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L100)**(b: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[mul](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L810)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L100)**
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L811)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L100)**
- **[times](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L812)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L100)**
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L813)** → **[mult](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L100)**
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L122)**(b: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[divide](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L807)** → **[div](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L122)**
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L137)**(b: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L158)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[neg](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L814)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L158)**
- **[unaryMinus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L815)** → **[negate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L158)**
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L165)**(out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L182)**(v: [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L818)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L182)**
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L201)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[normalized](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L818)** → **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L201)**
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L220)**(b: [vec4](#vec4)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L232)**(b: [vec4](#vec4)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L241)**(): number
- **[sqrLen](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L816)** → **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L241)**
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L251)**(): number
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L262)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L275)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L288)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L302)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L315)**(): [vec4](#vec4)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L324)**(): string
- **[str](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L817)** → **[toString](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L324)**
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L335)**(scale?: number, out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L368)**(a: [vec4](#vec4), b: [vec4](#vec4)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L380)**(u: [vec4](#vec4), v: [vec4](#vec4), w: [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L402)**(a: [vec4](#vec4), b: [vec4](#vec4)): number
- _static_ **[dist](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L804)** → **[distance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L402)**
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L418)**(a: [vec4](#vec4), b: [vec4](#vec4)): number
- _static_ **[sqrDist](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L805)** → **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L418)**
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L436)**(a: [vec4](#vec4), b: [vec4](#vec4), t: number, out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L453)**(a: [vec4](#vec4), b: [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L468)**(a: [vec4](#vec4), b: [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L485)**(v: [vec4](#vec4), min: number | [vec4](#vec4), max: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L510)**(a: [vec4](#vec4), b: [vec4](#vec4), t: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L534)**(edge0: number | [vec4](#vec4), edge1: number | [vec4](#vec4), v: [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L562)**(b: [vec4](#vec4), scale: number, out?: [vec4](#vec4)): [vec4](#vec4)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L576)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L592)**(min: number | [vec4](#vec4), max: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L616)**(b: [vec4](#vec4), t: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L638)**(edge: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L661)**(edge0: number | [vec4](#vec4), edge1: number | [vec4](#vec4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L687)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L701)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L715)**(out?: [vec4](#vec4)): [vec4](#vec4)
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L730)**(m: [mat4](#mat4), out?: [vec4](#vec4)): [vec4](#vec4)
- **[transformMat4x4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L819)** → **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L730)**
- **[transformQuat](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L746)**(q: [quat](#quat), out?: [vec4](#vec4)): [vec4](#vec4)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/vec4.ts#L770)**(a: [vec4](#vec4), b: [vec4](#vec4), scale: number, out?: [vec4](#vec4)): [vec4](#vec4)



### [mat2x3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L25)**(out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3) | null
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L31)**(): number
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L39)**(rad: number, out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L47)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L55)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L63)**(rad: number, out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L71)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L79)**(v: [vec2](#vec2), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L85)**(): string
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L91)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L99)**(b: [mat2x3](#mat2x3), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L107)**(b: [mat2x3](#mat2x3), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L115)**(b: [vec2](#vec2)): [vec2](#vec2)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L116)**(b: [mat2x3](#mat2x3), out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L123)**(b: [mat2x3](#mat2x3)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L130)**(b: [mat2x3](#mat2x3)): boolean
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L138)**(b: number, out?: [mat2x3](#mat2x3) | undefined): [mat2x3](#mat2x3)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L144)**(): [mat2x3](#mat2x3)



### [mat3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L167)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L190)**(): [mat3](#mat3)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L197)**(out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L204)**(out?: [mat3](#mat3) | undefined): [mat3](#mat3) | null
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L211)**(out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L217)**(): number
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L225)**(b: [vec2](#vec2)): [vec2](#vec2)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L226)**(b: [vec3](#vec3)): [vec3](#vec3)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L227)**(b: [mat3](#mat3), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L235)**(v: [vec2](#vec2), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L243)**(rad: number, out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L251)**(v: [vec2](#vec2), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L259)**(v: [vec2](#vec2), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L267)**(rad: number, out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L275)**(v: [vec2](#vec2), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[fromMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L283)**(a: [mat2x3](#mat2x3), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[fromQuat](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L292)**(q: [quat](#quat), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[normalFromMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L300)**(a: [mat4](#mat4), out?: [mat3](#mat3) | undefined): [mat3](#mat3) | null
- _static_ **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L308)**(a: [mat4](#mat4), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- _static_ **[projection](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L318)**(width: number, height: number, out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L324)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L332)**(b: [mat3](#mat3), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L340)**(b: [mat3](#mat3), out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L348)**(b: number, out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[multiplyScalarAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L357)**(b: [mat3](#mat3), scale: number, out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L363)**(): string
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L370)**(b: [mat3](#mat3)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L377)**(b: [mat3](#mat3)): boolean



### [quat](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L403)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L423)**(b: number | [quat](#quat), out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[fromAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L432)**(axis: [vec3](#vec3), rad: number, out?: [quat](#quat) | undefined): [quat](#quat)
- **[setAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L441)**(axis: [vec3](#vec3), rad: number, out?: [quat](#quat) | undefined): [quat](#quat)
- **[getAxisAngle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L454)**(out_axis: [vec3](#vec3)): number
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L462)**(a: [quat](#quat), b: [quat](#quat)): number
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L478)**(rad: number, out?: [quat](#quat) | undefined): [quat](#quat)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L486)**(rad: number, out?: [quat](#quat) | undefined): [quat](#quat)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L494)**(rad: number, out?: [quat](#quat) | undefined): [quat](#quat)
- **[calculateW](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L500)**(): number
- _static_ **[exp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L508)**(q: [quat](#quat), out?: [quat](#quat) | undefined): [quat](#quat)
- **[exp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L515)**(out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[ln](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L523)**(q: [quat](#quat), out?: [quat](#quat) | undefined): [quat](#quat)
- **[ln](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L530)**(out?: [quat](#quat) | undefined): [quat](#quat)
- **[pow](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L537)**(b: number): this
- _static_ **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L547)**(a: [quat](#quat), b: [quat](#quat), t: number, out?: [quat](#quat) | undefined): [quat](#quat)
- **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L556)**(b: [quat](#quat), t: number, out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L563)**(out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L571)**(q: [quat](#quat), out?: [quat](#quat) | undefined): [quat](#quat)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L578)**(out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L586)**(q: [quat](#quat), out?: [quat](#quat) | undefined): [quat](#quat)
- **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L593)**(out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[fromMat3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L601)**(m: [mat3](#mat3), out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[fromEuler](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L612)**(x: number, y: number, z: number, order?: string | undefined, out?: [quat](#quat) | undefined): [quat](#quat)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L618)**(): string
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L626)**(a: [quat](#quat), b: [quat](#quat)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L634)**(b: [quat](#quat)): number
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L641)**(b: [quat](#quat)): boolean
- _static_ **[rotationTo](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L651)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[sqlerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L665)**(a: [quat](#quat), b: [quat](#quat), c: [quat](#quat), d: [quat](#quat), t: number, out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[setAxes](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L676)**(view: [vec3](#vec3), right: [vec3](#vec3), up: [vec3](#vec3), out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L684)**(q: [quat](#quat), out?: [quat](#quat) | undefined): [quat](#quat)
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L691)**(out?: [quat](#quat) | undefined): [quat](#quat)
- _static_ **[quatLookAt](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L700)**(direction: [vec3](#vec3), up: [vec3](#vec3), out?: [quat](#quat) | undefined): [quat](#quat)
- **[pitch](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L706)**(): number
- **[yaw](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L712)**(): number
- **[roll](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L718)**(): number
- **[eulerAngles](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L725)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[toMat3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L732)**(out?: [mat3](#mat3) | undefined): [mat3](#mat3)
- **[toMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L739)**(out?: [mat4](#mat4) | undefined): [mat4](#mat4)



### [mat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L757)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L787)**(): [mat4](#mat4)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L794)**(out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L801)**(out?: [mat4](#mat4) | undefined): [mat4](#mat4) | null
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L808)**(out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L814)**(): number
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L822)**(b: [vec2](#vec2)): [vec2](#vec2)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L823)**(b: [vec3](#vec3)): [vec3](#vec3)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L824)**(b: [vec4](#vec4)): [vec4](#vec4)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L825)**(b: [mat4](#mat4), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L833)**(v: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L841)**(v: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L850)**(rad: number, axis: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4) | null
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L858)**(rad: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L866)**(rad: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L874)**(rad: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[getTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L881)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[getScaling](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L888)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[getRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L898)**(out?: [quat](#quat) | undefined): [quat](#quat)
- **[decompose](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L907)**(out_r?: [quat](#quat) | undefined, out_t?: [vec3](#vec3) | undefined, out_s?: [vec3](#vec3) | undefined): [quat](#quat)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L915)**(v: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L923)**(v: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L932)**(rad: number, axis: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4) | null
- _static_ **[fromXRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L940)**(rad: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromYRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L948)**(rad: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromZRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L956)**(rad: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromRotationTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L965)**(q: [quat](#quat), v: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromRotationTranslationScale](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L975)**(q: [quat](#quat), v: [vec3](#vec3), s: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromRotationTranslationScaleOrigin](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L986)**(q: [quat](#quat), v: [vec3](#vec3), s: [vec3](#vec3), o: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[fromQuat](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L994)**(q: [quat](#quat), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[frustum](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1007)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[perspectiveNO](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1020)**(fovy: number, aspect: number, near: number, far: number | null, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[perspectiveZO](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1034)**(fovy: number, aspect: number, near: number, far: number | null, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[perspectiveFromFieldOfView](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1044)**(fov: { updegrees: number; downdegrees: number; leftdegrees: number; rightdegrees: number; }, near: number, far: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[orthoNO](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1064)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[orthoZO](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1080)**(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[lookAt](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1091)**(eye: [vec3](#vec3), center: [vec3](#vec3), up: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[targetTo](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1101)**(eye: [vec3](#vec3), target: [vec3](#vec3), up: [vec3](#vec3), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[infinitePerspective](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1112)**(fovy: number, aspect: number, near: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- _static_ **[project](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1124)**(obj: [vec3](#vec3), model: [mat4](#mat4), proj: [mat4](#mat4), viewport: [vec4](#vec4), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[unProject](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1136)**(win: [vec3](#vec3), model: [mat4](#mat4), proj: [mat4](#mat4), viewport: [vec4](#vec4), out?: [vec3](#vec3) | undefined): [vec3](#vec3) | null
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1142)**(): number
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1150)**(b: [mat4](#mat4), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1158)**(b: [mat4](#mat4), out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1166)**(b: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[multiplyScalarAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1175)**(b: [mat4](#mat4), scale: number, out?: [mat4](#mat4) | undefined): [mat4](#mat4)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1181)**(): string
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1188)**(b: [mat4](#mat4)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1195)**(b: [mat4](#mat4)): boolean



### [vec4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1224)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1255)**(b: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1263)**(b: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1271)**(b: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1279)**(b: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1280)**(b: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1287)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1288)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1296)**(v: [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1303)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1310)**(b: [vec4](#vec4)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1317)**(b: [vec4](#vec4)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1323)**(): number
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1329)**(): number
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1336)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1343)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1350)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1357)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1363)**(): [vec4](#vec4)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1369)**(): string
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1377)**(scale?: number | undefined, out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1385)**(a: [vec4](#vec4), b: [vec4](#vec4)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1395)**(u: [vec4](#vec4), v: [vec4](#vec4), w: [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1403)**(a: [vec4](#vec4), b: [vec4](#vec4)): number
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1412)**(a: [vec4](#vec4), b: [vec4](#vec4)): number
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1423)**(a: [vec4](#vec4), b: [vec4](#vec4), t: number, out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1432)**(a: [vec4](#vec4), b: [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1441)**(a: [vec4](#vec4), b: [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1451)**(v: [vec4](#vec4), min: number | [vec4](#vec4), max: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1461)**(a: [vec4](#vec4), b: [vec4](#vec4), t: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1471)**(edge0: number | [vec4](#vec4), edge1: number | [vec4](#vec4), v: [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1480)**(b: [vec4](#vec4), scale: number, out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1487)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1496)**(min: number | [vec4](#vec4), max: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1505)**(b: [vec4](#vec4), t: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1513)**(edge: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1522)**(edge0: number | [vec4](#vec4), edge1: number | [vec4](#vec4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1529)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1536)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1543)**(out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1551)**(m: [mat4](#mat4), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- **[transformQuat](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1559)**(q: [quat](#quat), out?: [vec4](#vec4) | undefined): [vec4](#vec4)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L1569)**(a: [vec4](#vec4), b: [vec4](#vec4), scale: number, out?: [vec4](#vec4) | undefined): [vec4](#vec4)



### [vec3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4603)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4637)**(b: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4645)**(b: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4653)**(b: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4661)**(b: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4662)**(b: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4669)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4670)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4678)**(v: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4685)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4692)**(b: [vec3](#vec3)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4699)**(b: [vec3](#vec3)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4705)**(): number
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4711)**(): number
- _static_ **[floor](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4718)**(v: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[round](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4725)**(v: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4732)**(v: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4738)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4744)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4750)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4757)**(v: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4763)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4769)**(): [vec3](#vec3)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4775)**(): string
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4782)**(scale?: number | undefined): [vec3](#vec3)
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4790)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4798)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4807)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4815)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4824)**(a: [vec3](#vec3), b: [vec3](#vec3)): number
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4835)**(a: [vec3](#vec3), b: [vec3](#vec3), t: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[slerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4845)**(a: [vec3](#vec3), b: [vec3](#vec3), t: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4853)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4861)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4871)**(v: [vec3](#vec3), min: number | [vec3](#vec3), max: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4881)**(a: [vec3](#vec3), b: [vec3](#vec3), t: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4891)**(edge0: number | [vec3](#vec3), edge1: number | [vec3](#vec3), v: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4900)**(v: [vec3](#vec3), rad: number, origin?: [vec3](#vec3) | undefined, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[rotateX](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4908)**(rad: number, origin?: [vec3](#vec3) | undefined, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4917)**(v: [vec3](#vec3), rad: number, origin?: [vec3](#vec3) | undefined, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[rotateY](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4924)**(rad: number, origin?: [vec3](#vec3) | undefined, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4933)**(v: [vec3](#vec3), rad: number, origin?: [vec3](#vec3) | undefined, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[rotateZ](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4940)**(rad: number, origin?: [vec3](#vec3) | undefined, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[hermite](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4951)**(a: [vec3](#vec3), b: [vec3](#vec3), c: [vec3](#vec3), d: [vec3](#vec3), t: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[bezier](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4962)**(a: [vec3](#vec3), b: [vec3](#vec3), c: [vec3](#vec3), d: [vec3](#vec3), t: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4972)**(a: [vec3](#vec3), b: [vec3](#vec3), scale: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[reflect](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4981)**(I: [vec3](#vec3), N: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[refract](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L4991)**(I: [vec3](#vec3), N: [vec3](#vec3), eta: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[faceforward](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5001)**(N: [vec3](#vec3), I: [vec3](#vec3), Nref: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[triangleNormal](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5011)**(p1: [vec3](#vec3), p2: [vec3](#vec3), p3: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[project](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5020)**(a: [vec3](#vec3), b: [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[orientedAngle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5029)**(a: [vec3](#vec3), b: [vec3](#vec3), ref: [vec3](#vec3)): number
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5038)**(b: [vec3](#vec3), scale: number, out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5045)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5054)**(min: number | [vec3](#vec3), max: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5063)**(b: [vec3](#vec3), t: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5071)**(edge: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5080)**(edge0: number | [vec3](#vec3), edge1: number | [vec3](#vec3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5087)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5094)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5101)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5109)**(m: [mat3](#mat3), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5117)**(m: [mat4](#mat4), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- **[transformQuat](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L5125)**(q: [quat](#quat), out?: [vec3](#vec3) | undefined): [vec3](#vec3)



### [mat2](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8159)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8177)**(): [mat2](#mat2)
- **[transpose](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8184)**(out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8191)**(out?: [mat2](#mat2) | undefined): [mat2](#mat2) | null
- **[adjoint](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8198)**(out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[determinant](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8204)**(): number
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8212)**(rad: number, out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8220)**(v: [vec2](#vec2), out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8228)**(rad: number, out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- _static_ **[fromScaling](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8236)**(v: [vec2](#vec2), out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8242)**(): string
- **[frob](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8247)**(): number
- **[LDU](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8254)**(L?: [mat2](#mat2) | undefined, D?: [mat2](#mat2) | undefined, U?: [mat2](#mat2) | undefined): mat2[]
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8262)**(b: [mat2](#mat2), out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8270)**(b: [mat2](#mat2), out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8278)**(b: [vec2](#vec2)): [vec2](#vec2)
- **[multiply](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8279)**(b: [mat2](#mat2), out?: [mat2](#mat2) | undefined): [mat2](#mat2)
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8286)**(b: [mat2](#mat2)): boolean
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8293)**(b: [mat2](#mat2)): boolean
- **[scaleScalar](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8301)**(b: number, out?: [mat2](#mat2) | undefined): [mat2](#mat2)



### [vec2](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8324)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8349)**(b: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[minus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8357)**(b: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[mult](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8365)**(b: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[div](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8373)**(b: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[invDiv](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8381)**(a: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[rem](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8389)**(b: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[negate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8396)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[unaryPlus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8397)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8404)**(v: [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8411)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8418)**(b: [vec2](#vec2)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8425)**(b: [vec2](#vec2)): boolean
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8431)**(): number
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8437)**(): number
- **[floor](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8444)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[round](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8451)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[ceil](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8458)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[inverse](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8465)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8471)**(): [vec2](#vec2)
- **[rotate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8480)**(rad?: number | undefined, origin?: [vec2](#vec2) | undefined, out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8486)**(): string
- _static_ **[random](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8493)**(scale?: number | undefined, out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[angle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8501)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[signedAngle](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8509)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8517)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8524)**(b: [vec2](#vec2)): number
- _static_ **[cross](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8533)**(a: [vec2](#vec2), b: [vec2](#vec2), out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[distance](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8541)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[squaredDistance](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8550)**(a: [vec2](#vec2), b: [vec2](#vec2)): number
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8560)**(a: [vec2](#vec2), b: [vec2](#vec2), t: number, out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[max](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8568)**(a: [vec2](#vec2), b: [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[min](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8576)**(a: [vec2](#vec2), b: [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8585)**(v: [vec2](#vec2), min: number | [vec2](#vec2), max: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[mix](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8594)**(a: [vec2](#vec2), b: [vec2](#vec2), t: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8603)**(edge0: number | [vec2](#vec2), edge1: number | [vec2](#vec2), v: [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8612)**(b: [vec2](#vec2), scale: number, out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[abs](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8619)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[sign](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8626)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[fract](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8633)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[clamp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8642)**(min: number | [vec2](#vec2), max: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[saturate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8649)**(out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[mix](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8658)**(b: [vec2](#vec2), t: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[step](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8666)**(edge: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[smoothstep](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8675)**(edge0: number | [vec2](#vec2), edge1: number | [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[transformMat2](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8683)**(m: [mat2](#mat2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[transformMat2x3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8691)**(m: [mat2x3](#mat2x3), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[transformMat3](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8699)**(m: [mat3](#mat3), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- **[transformMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8707)**(m: [mat4](#mat4), out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[scaleAndAdd](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8717)**(a: [vec2](#vec2), b: [vec2](#vec2), scale: number, out?: [vec2](#vec2) | undefined): [vec2](#vec2)
- _static_ **[reflect](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L8726)**(I: [vec2](#vec2), N: [vec2](#vec2), out?: [vec2](#vec2) | undefined): [vec2](#vec2)



### [quat2](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11765)
- **[getReal](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11788)**(out?: [quat](#quat) | undefined): [quat](#quat)
- **[getDual](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11795)**(out?: [quat](#quat) | undefined): [quat](#quat)
- **[setReal](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11802)**(q: [quat](#quat)): this
- **[setDual](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11809)**(q: [quat](#quat)): this
- **[getTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11816)**(out?: [vec3](#vec3) | undefined): [vec3](#vec3)
- _static_ **[fromRotationTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11825)**(q: [quat](#quat), t: [vec3](#vec3), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- _static_ **[fromTranslation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11833)**(t: [vec3](#vec3), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- _static_ **[fromRotation](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11841)**(q: [quat](#quat), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- _static_ **[fromMat4](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11849)**(m: [mat4](#mat4), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[clone](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11855)**(): [quat2](#quat2)
- **[translate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11871)**(v: [vec3](#vec3), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[conjugate](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11878)**(out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[invert](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11885)**(out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[squaredLength](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11891)**(): number
- **[len](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11897)**(): number
- _static_ **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11905)**(q: [quat2](#quat2), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[normalize](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11912)**(out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- _static_ **[dot](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11920)**(a: [quat2](#quat2), b: [quat2](#quat2)): number
- _static_ **[lerp](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11930)**(a: [quat2](#quat2), b: [quat2](#quat2), t: number, out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[plus](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11938)**(b: [quat2](#quat2), out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[scale](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11946)**(s: number, out?: [quat2](#quat2) | undefined): [quat2](#quat2)
- **[equals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11953)**(b: [quat2](#quat2)): boolean
- **[exactEquals](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11960)**(b: [quat2](#quat2)): boolean
- **[toString](https://github.com/dkaraush/glmaths/blob/main/src/glmaths.d.ts#L11966)**(): string

<!-- DOCS -->

## Benchmark results

You can run benchmark with `npm run bench`.

Suprisingly, in most operations `glmaths` comes faster than its simpler `gl-matrix` library? I honestly quite skeptical about it.

This benchmark, though, doesn't tell the difference in loading up a library. When I started running benchmarks, I noticed how on first test `glmaths` was consistently slower, than `gl-matrix`; and I believe this is a setup cost for extending `Float32Array` with all methods and getters for swizzles. There is a hack in `bencmark.js` to overcome this.

Benchmark is run with `glmaths.ALWAYS_COPY = false`.

| Operation | gl-matrix | glmaths | Diff |
|:---|---:|---:|---:|
| Vec3 creation | 41.8M ops/s ±3.0% | 40.9M ops/s ±1.5% | -2% |
| Vec3 add | 137.9M ops/s ±3.1% | 193.8M ops/s ±4.6% | **+40%** |
| Vec3 dot | 151.6M ops/s ±3.5% | 234.1M ops/s ±5.3% | **+54%** |
| Vec3 cross | 135.0M ops/s ±2.8% | 196.2M ops/s ±3.6% | **+45%** |
| Vec3 normalize | 136.5M ops/s ±2.5% | 207.2M ops/s ±4.0% | **+52%** |
| Vec3 scale | 143.2M ops/s ±4.0% | 216.0M ops/s ±4.1% | **+51%** |
| Vec3 length | 162.0M ops/s ±3.1% | 258.5M ops/s ±5.1% | **+60%** |
| Vec3 distance | 155.4M ops/s ±2.8% | 235.8M ops/s ±5.3% | **+52%** |
| Vec3 lerp | 132.8M ops/s ±3.6% | 192.0M ops/s ±4.3% | **+45%** |
| Vec2 creation | 41.8M ops/s ±1.4% | 42.4M ops/s ±1.2% | +2% |
| Vec2 add | 142.5M ops/s ±3.3% | 220.5M ops/s ±4.2% | **+55%** |
| Vec4 add | 131.1M ops/s ±2.4% | 107.3M ops/s ±2.5% | **-18%** |
| Vec4 normalize | 127.3M ops/s ±2.2% | 111.6M ops/s ±3.0% | **-12%** |
| Mat4 creation | 41.1M ops/s ±1.6% | 44.0M ops/s ±1.4% | +7% |
| Mat4 multiply | 58.1M ops/s ±2.1% | 52.6M ops/s ±1.4% | -9% |
| Mat4 invert | 60.6M ops/s ±2.7% | 69.5M ops/s ±1.0% | **+15%** |
| Mat4 transpose | 107.7M ops/s ±2.4% | 120.1M ops/s ±2.6% | **+11%** |
| Mat4 translate | 78.0M ops/s ±2.0% | 73.7M ops/s ±2.2% | -5% |
| Mat4 scale | 96.6M ops/s ±2.2% | 123.3M ops/s ±2.1% | **+28%** |
| Mat4 rotateX | 95.3M ops/s ±2.6% | 102.5M ops/s ±2.8% | +8% |
| Mat4 determinant | 133.1M ops/s ±2.6% | 194.2M ops/s ±5.2% | **+46%** |
| Mat4 perspective | 125.5M ops/s ±2.1% | 175.5M ops/s ±3.2% | **+40%** |
| Mat4 lookAt | 45.7M ops/s ±1.9% | 55.6M ops/s ±2.1% | **+22%** |
| Mat3 multiply | 94.3M ops/s ±1.7% | 78.5M ops/s ±2.1% | **-17%** |
| Mat3 invert | 106.1M ops/s ±2.3% | 139.9M ops/s ±2.6% | **+32%** |
| Quat multiply | 121.1M ops/s ±2.6% | 167.3M ops/s ±4.3% | **+38%** |
| Quat slerp | 56.6M ops/s ±2.0% | 125.3M ops/s ±1.6% | **+121%** |
| Quat normalize | 130.7M ops/s ±2.2% | 173.0M ops/s ±3.5% | **+32%** |
| Quat invert | 133.4M ops/s ±2.7% | 195.1M ops/s ±4.2% | **+46%** |
| Quat fromAxisAngle | 143.0M ops/s ±3.2% | 201.9M ops/s ±4.5% | **+41%** |
| Vec3 transformMat4 | 102.4M ops/s ±2.7% | 140.3M ops/s ±2.0% | **+37%** |
| Vec3 transformQuat | 121.1M ops/s ±3.0% | 165.9M ops/s ±4.5% | **+37%** |
| Vec3 scaleAndAdd | 137.1M ops/s ±2.5% | 191.9M ops/s ±4.3% | **+40%** |
| Vec3 mix (lerp) | 134.1M ops/s ±2.8% | 189.6M ops/s ±3.6% | **+41%** |
| Vec4 transformMat4 | 100.5M ops/s ±2.5% | 84.8M ops/s ±1.8% | **-16%** |
| Mat4 project | — | 31.5M ops/s ±1.0% | — |
| Mat4 unProject | — | 11.9M ops/s ±1.1% | — |
| Quat eulerAngles / pitch / yaw / roll | — | 248.4M ops/s ±5.1% | — |
| Quat toMat4 vs Mat4.fromQuat | — | 148.5M ops/s ±2.9% | — |
| Quat2 multiply | — | 89.9M ops/s ±2.2% | — |
| Quat2 getTranslation | — | 42.5M ops/s ±1.1% | — |

### Tests

You can run tests with `npm run test`