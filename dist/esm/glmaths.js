function equals(a, b) {
    return Math.abs(a - b) <= index.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
function copyPrototype(from, to) {
    for (const key of Object.getOwnPropertyNames(from.prototype)) {
        if (key === 'constructor')
            continue;
        Object.defineProperty(to.prototype, key, Object.getOwnPropertyDescriptor(from.prototype, key));
    }
    for (const key of Object.getOwnPropertyNames(from)) {
        if (['length', 'name', 'prototype'].includes(key))
            continue;
        Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
    }
}
const create = (Clazz, size) => {
    const factory = (...args) => {
        const out = new Clazz();
        let i = 0;
        for (const a of args) {
            if (typeof a === 'number')
                out[i++] = a;
            else
                for (const v of a)
                    out[i++] = v;
        }
        if (i === 1)
            for (let j = 1; j < size; j++)
                out[j] = out[0];
        return out;
    };
    Object.setPrototypeOf(factory, Clazz);
    return factory;
};

function defineSwizzles(prototype, N = 4, S = ['xyzw', 'rgba', 'stpq', 'uv']) {
    // let code = `interface Vec${N}Class {`
    for (let s of S) {
        // code += '\n '
        for (let n = 2; n <= N; ++n) {
            const sn = `01${s.substring(0, n)}`;
            switch (n) {
                case 2:
                    for (let a = 0; a < sn.length; ++a)
                        for (let b = 0; b < sn.length; ++b) {
                            const key = `${sn[a]}${sn[b]}`;
                            if (/^[01]/.test(key) || Object.prototype.hasOwnProperty.call(prototype, key))
                                continue;
                            // code += ` ${key}: Vec2;`
                            Object.defineProperty(prototype, key, {
                                get() {
                                    return new prototype.vec2(a < 2 ? a : this[a - 2], b < 2 ? b : this[b - 2]);
                                }
                            });
                        }
                    break;
                case 3:
                    for (let a = 0; a < sn.length; ++a)
                        for (let b = 0; b < sn.length; ++b)
                            for (let c = 0; c < sn.length; ++c) {
                                const key = `${sn[a]}${sn[b]}${sn[c]}`;
                                if (/^[01]/.test(key) || Object.prototype.hasOwnProperty.call(prototype, key))
                                    continue;
                                // code += ` ${key}: Vec3;`
                                Object.defineProperty(prototype, key, {
                                    get() {
                                        return new prototype.vec3(a < 2 ? a : this[a - 2], b < 2 ? b : this[b - 2], c < 2 ? c : this[c - 2]);
                                    }
                                });
                            }
                    break;
                case 4:
                    for (let a = 0; a < sn.length; ++a)
                        for (let b = 0; b < sn.length; ++b)
                            for (let c = 0; c < sn.length; ++c)
                                for (let d = 0; d < sn.length; ++d) {
                                    const key = `${sn[a]}${sn[b]}${sn[c]}${sn[d]}`;
                                    if (/^[01]/.test(key) || Object.prototype.hasOwnProperty.call(prototype, key))
                                        continue;
                                    // code += ` ${key}: Vec4;`
                                    Object.defineProperty(prototype, key, {
                                        get() {
                                            return new prototype.vec4(a < 2 ? a : this[a - 2], b < 2 ? b : this[b - 2], c < 2 ? c : this[c - 2], d < 2 ? d : this[d - 2]);
                                        }
                                    });
                                }
                    break;
            }
        }
    }
    // code += '\n}'
    // console.log(code)
}

const isVec2Like = (a) => a?.length === 2;
/**
 * 2 Dimensional Vector of 32-bit floats
 * @extends Float32Array
 */
class Vec2 extends Float32Array {
    static get zero() { return new this.prototype.vec2(0, 0); }
    static get Zero() { return new this.prototype.vec2(0, 0); }
    static get ZERO() { return new this.prototype.vec2(0, 0); }
    static get one() { return new this.prototype.vec2(1, 1); }
    static get One() { return new this.prototype.vec2(1, 1); }
    static get ONE() { return new this.prototype.vec2(1, 1); }
    /**
     * Creates a new Vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     */
    constructor(x = 0, y = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }
    get x() { return this[0]; }
    set x(v) { this[0] = v; }
    get y() { return this[1]; }
    set y(v) { this[1] = v; }
    /**
     * Adds two vec2's
     *
     * @param {Vec2Like | Number} b the second operand
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] + b;
            out[1] = this[1] + b;
        }
        else {
            out[0] = this[0] + b[0];
            out[1] = this[1] + b[1];
        }
        return out;
    }
    /**
     * Subtracts vector b from a vector
     *
     * @param {Vec2Like | Number} b the second operand
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] - b;
            out[1] = this[1] - b;
        }
        else {
            out[0] = this[0] - b[0];
            out[1] = this[1] - b[1];
        }
        return out;
    }
    /**
     * Multiplies two vec2's component-wise
     *
     * @param {Vec2 | Number} b the second operand
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    mult(b, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] * b;
            out[1] = this[1] * b;
        }
        else {
            out[0] = this[0] * b[0];
            out[1] = this[1] * b[1];
        }
        return out;
    }
    /**
     * Divides two vec2's component-wise
     *
     * @param {Vec2 | Number} b the second operand
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    div(b, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] / b;
            out[1] = this[1] / b;
        }
        else {
            out[0] = this[0] / b[0];
            out[1] = this[1] / b[1];
        }
        return out;
    }
    /**
     * Divides this vector by argument
     *
     * @param {Vec2 | Number} a the first operand
     * @param {Vec2Like} out the receiving vector, defaults to new Vec2()
     * @returns out
     */
    invDiv(a, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof a === 'number') {
            out[0] = a / this[0];
            out[1] = a / this[1];
        }
        else {
            out[0] = a[0] / this[0];
            out[1] = a[1] / this[1];
        }
        return out;
    }
    /**
     * Remainder of this divided by argument
     *
     * @param {Vec2 | Number} a the first operand
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    rem(b, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] % b;
            out[1] = this[1] % b;
        }
        else {
            out[0] = this[0] % b[0];
            out[1] = this[1] % b[1];
        }
        return out;
    }
    /**
     * Negates the components of a vec2
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    negate(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = -this[0];
        out[1] = -this[1];
        return out;
    }
    unaryPlus(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (!out.equals(this)) {
            out[0] = this[0];
            out[1] = this[1];
        }
        return out;
    }
    /**
     * Normalize a vector to unit length.
     *
     * @param {Vec2Like} v vector to normalize
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} this
     */
    static normalize(v, out = new this.prototype.vec2()) {
        const x = v[0], y = v[1];
        let len = x * x + y * y;
        if (len > 0) {
            len = 1.0 / Math.sqrt(len);
        }
        out[0] = x * len;
        out[1] = y * len;
        return out;
    }
    /**
     * Normalize a vector to unit length.
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} this
     */
    normalize(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const x = this[0], y = this[1];
        let len = x * x + y * y;
        if (len > 0) {
            len = 1.0 / Math.sqrt(len);
        }
        out[0] = x * len;
        out[1] = y * len;
        return out;
    }
    /**
     * Returns whether or not the vectors have approximately equal values
     *
     * @param {Vec2} b the second operand
     * @returns {Boolean} true if approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) &&
            equals(this[1], b[1]));
    }
    /**
     * Returns whether or not the vectors have exactly equal values
     *
     * @param {Vec2} b the second operand
     * @returns {Boolean} true if exactly equal
     */
    exactEquals(b) {
        return this[0] === b[0] && this[1] === b[1];
    }
    /**
     * Calculates the squared length of a vec2
     *
     * @returns {Number} squared length
     */
    squaredLength() {
        const x = this[0], y = this[1];
        return x * x + y * y;
    }
    /**
     * Calculates the length of a vec2
     *
     * @returns {Number} length of a vector
     */
    len() {
        const x = this[0], y = this[1];
        return Math.sqrt(x * x + y * y);
    }
    /**
     * Math.floor the components of a vec2
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    floor(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = Math.floor(this[0]);
        out[1] = Math.floor(this[1]);
        return out;
    }
    /**
     * Math.round the components of a vec2
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    round(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = Math.round(this[0]);
        out[1] = Math.round(this[1]);
        return out;
    }
    /**
     * Math.ceil the components of a vec2
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    ceil(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = Math.ceil(this[0]);
        out[1] = Math.ceil(this[1]);
        return out;
    }
    /**
     * Returns the inverse of the components (1/x, 1/y)
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    inverse(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = 1.0 / this[0];
        out[1] = 1.0 / this[1];
        return out;
    }
    /**
     * Creates a new vec2 initialized with values from a vector
     *
     * @returns {Vec2} a new Vec2
     */
    clone() { return new this.vec2(this[0], this[1]); }
    /**
     * Rotates a vec2 around an origin point
     *
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec2} origin the origin of the rotation, defaults to vec2(0, 0)
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    rotate(rad = 0, origin = Vec2.zero, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const p0 = this[0] - origin[0];
        const p1 = this[1] - origin[1];
        const sinC = Math.sin(rad);
        const cosC = Math.cos(rad);
        out[0] = p0 * cosC - p1 * sinC + origin[0];
        out[1] = p0 * sinC + p1 * cosC + origin[1];
        return out;
    }
    /**
     * Returns a string representation of a vector
     *
     * @returns {String} string representation
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]})`;
    }
    /**
     * Generates a random vector with the given scale (uniform distribution on a circle)
     *
     * @param {Number} scale length of the resulting vector, defaults to 1.0
     * @returns {Vec2} a new random Vec2
     */
    static random(scale = 1.0, out = new this.prototype.vec2()) {
        const angleR = index.RANDOM() * 2.0 * Math.PI;
        out[0] = Math.cos(angleR) * scale;
        out[1] = Math.sin(angleR) * scale;
        return out;
    }
    /**
     * Calculates the unsigned angle (in radians) between two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Number} angle in radians
     */
    static angle(a, b) {
        const ax = a[0], ay = a[1];
        const bx = b[0], by = b[1];
        return Math.abs(Math.atan2(ay * bx - ax * by, ax * bx + ay * by));
    }
    /**
     * Calculates the signed angle (in radians) between two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Number} signed angle in radians
     */
    static signedAngle(a, b) {
        const ax = a[0], ay = a[1];
        const bx = b[0], by = b[1];
        return Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
    }
    /**
     * Calculates the dot product of two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Number} dot product of a and b
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
    /**
     * Calculates the dot product of a vector with b
     *
     * @param {Vec2} b the second operand
     * @returns {Number} dot product
     */
    dot(b) {
        return this[0] * b[0] + this[1] * b[1];
    }
    /**
     * Computes the cross product of two vec2's.
     * Note that the cross product returns a Vec3 with the result in the z component.
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Vec3} a new Vec3 with z = a x b
     */
    static cross(a, b, out = new this.prototype.vec3()) {
        out[0] = out[1] = 0;
        out[2] = a[0] * b[1] - a[1] * b[0];
        return out;
    }
    /**
     * Calculates the euclidian distance between two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Number} distance between a and b
     */
    static distance(a, b) {
        const x = a[0] - b[0];
        const y = a[1] - b[1];
        return Math.sqrt(x * x + y * y);
    }
    /**
     * Calculates the squared euclidian distance between two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    static squaredDistance(a, b) {
        const x = a[0] - b[0];
        const y = a[1] - b[1];
        return x * x + y * y;
    }
    /**
     * Performs a linear interpolation between two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec2} a new interpolated Vec2
     */
    static lerp(a, b, t, out = new this.prototype.vec2()) {
        const a0 = a[0], a1 = a[1];
        out[0] = a0 + (b[0] - a0) * t;
        out[1] = a1 + (b[1] - a1) * t;
        return out;
    }
    /**
     * Returns the component-wise maximum of two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Vec2} a new Vec2 with max components
     */
    static max(a, b, out = new this.prototype.vec2()) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        return out;
    }
    /**
     * Returns the component-wise minimum of two vec2's
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @returns {Vec2} a new Vec2 with min components
     */
    static min(a, b, out = new this.prototype.vec2()) {
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        return out;
    }
    /**
     * Component-wise clamp between min and max
     *
     * @param {Vec2} v the vector to clamp
     * @param {Vec2 | Number} min the lower bound
     * @param {Vec2 | Number} max the upper bound
     * @returns {Vec2} a new clamped Vec2
     */
    static clamp(v, min, max, out = new this.prototype.vec2()) {
        if (typeof min === 'number' && typeof max === 'number') {
            out[0] = Math.min(Math.max(v[0], min), max);
            out[1] = Math.min(Math.max(v[1], min), max);
        }
        else {
            const minX = typeof min === 'number' ? min : min[0];
            const minY = typeof min === 'number' ? min : min[1];
            const maxX = typeof max === 'number' ? max : max[0];
            const maxY = typeof max === 'number' ? max : max[1];
            out[0] = Math.min(Math.max(v[0], minX), maxX);
            out[1] = Math.min(Math.max(v[1], minY), maxY);
        }
        return out;
    }
    /**
     * Component-wise linear interpolation (GLSL mix)
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @param {Vec2 | Number} t interpolation factor (scalar or per-component)
     * @returns {Vec2} a new interpolated Vec2
     */
    static mix(a, b, t, out = new this.prototype.vec2()) {
        if (typeof t === 'number') {
            out[0] = a[0] + (b[0] - a[0]) * t;
            out[1] = a[1] + (b[1] - a[1]) * t;
        }
        else {
            out[0] = a[0] + (b[0] - a[0]) * t[0];
            out[1] = a[1] + (b[1] - a[1]) * t[1];
        }
        return out;
    }
    /**
     * Component-wise Hermite smoothstep interpolation
     *
     * @param {Vec2 | Number} edge0 the lower edge
     * @param {Vec2 | Number} edge1 the upper edge
     * @param {Vec2} v the source vector
     * @returns {Vec2} a new smoothstepped Vec2
     */
    static smoothstep(edge0, edge1, v, out = new this.prototype.vec2()) {
        const e0x = typeof edge0 === 'number' ? edge0 : edge0[0];
        const e0y = typeof edge0 === 'number' ? edge0 : edge0[1];
        const e1x = typeof edge1 === 'number' ? edge1 : edge1[0];
        const e1y = typeof edge1 === 'number' ? edge1 : edge1[1];
        let t0 = Math.min(Math.max((v[0] - e0x) / (e1x - e0x), 0), 1);
        let t1 = Math.min(Math.max((v[1] - e0y) / (e1y - e0y), 0), 1);
        out[0] = t0 * t0 * (3 - 2 * t0);
        out[1] = t1 * t1 * (3 - 2 * t1);
        return out;
    }
    /**
     * Adds this vec2 to b vec2 scaled by a scalar
     *
     * @param {Vec2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    scaleAndAdd(b, scale, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = this[0] + b[0] * scale;
        out[1] = this[1] + b[1] * scale;
        return out;
    }
    /**
     * Component-wise absolute value
     *
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    abs(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = Math.abs(this[0]);
        out[1] = Math.abs(this[1]);
        return out;
    }
    /**
     * Component-wise sign
     *
     * @param {Vec2Like} out the receiving vector, defaults to new vec2()
     * @returns {Vec2Like} out
     */
    sign(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = this[0] > 0 ? 1 : this[0] < 0 ? -1 : 0;
        out[1] = this[1] > 0 ? 1 : this[1] < 0 ? -1 : 0;
        return out;
    }
    /**
     * Component-wise fractional part (x - floor(x))
     *
     * @param {Vec2Like} out the receiving vector, defaults to new vec2()
     * @returns {Vec2Like} out
     */
    fract(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = this[0] - Math.floor(this[0]);
        out[1] = this[1] - Math.floor(this[1]);
        return out;
    }
    /**
     * Component-wise clamp between min and max
     *
     * @param {Vec2 | Number} min the lower bound
     * @param {Vec2 | Number} max the upper bound
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    clamp(min, max, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof min === 'number' && typeof max === 'number') {
            out[0] = Math.min(Math.max(this[0], min), max);
            out[1] = Math.min(Math.max(this[1], min), max);
        }
        else {
            const minX = typeof min === 'number' ? min : min[0];
            const minY = typeof min === 'number' ? min : min[1];
            const maxX = typeof max === 'number' ? max : max[0];
            const maxY = typeof max === 'number' ? max : max[1];
            out[0] = Math.min(Math.max(this[0], minX), maxX);
            out[1] = Math.min(Math.max(this[1], minY), maxY);
        }
        return out;
    }
    /**
     * Clamp components to [0, 1]
     *
     * @param {Vec2Like} out the receiving vector, defaults to new vec2()
     * @returns {Vec2Like} out
     */
    saturate(out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        out[0] = Math.min(Math.max(this[0], 0), 1);
        out[1] = Math.min(Math.max(this[1], 0), 1);
        return out;
    }
    /**
     * Component-wise linear interpolation (GLSL mix)
     *
     * @param {Vec2Like} b the second operand
     * @param {Vec2Like | Number} t interpolation factor (scalar or per-component)
     * @param {Vec2Like} out the receiving vector, defaults to new vec2()
     * @returns {Vec2Like} out
     */
    mix(b, t, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof t === 'number') {
            out[0] = this[0] + (b[0] - this[0]) * t;
            out[1] = this[1] + (b[1] - this[1]) * t;
        }
        else {
            out[0] = this[0] + (b[0] - this[0]) * t[0];
            out[1] = this[1] + (b[1] - this[1]) * t[1];
        }
        return out;
    }
    /**
     * Component-wise step function
     *
     * @param {Vec2 | Number} edge the edge threshold
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    step(edge, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        if (typeof edge === 'number') {
            out[0] = this[0] < edge ? 0 : 1;
            out[1] = this[1] < edge ? 0 : 1;
        }
        else {
            out[0] = this[0] < edge[0] ? 0 : 1;
            out[1] = this[1] < edge[1] ? 0 : 1;
        }
        return out;
    }
    /**
     * Component-wise Hermite smoothstep interpolation
     *
     * @param {Vec2 | Number} edge0 the lower edge
     * @param {Vec2 | Number} edge1 the upper edge
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    smoothstep(edge0, edge1, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const e0x = typeof edge0 === 'number' ? edge0 : edge0[0];
        const e0y = typeof edge0 === 'number' ? edge0 : edge0[1];
        const e1x = typeof edge1 === 'number' ? edge1 : edge1[0];
        const e1y = typeof edge1 === 'number' ? edge1 : edge1[1];
        let t0 = Math.min(Math.max((this[0] - e0x) / (e1x - e0x), 0), 1);
        let t1 = Math.min(Math.max((this[1] - e0y) / (e1y - e0y), 0), 1);
        out[0] = t0 * t0 * (3 - 2 * t0);
        out[1] = t1 * t1 * (3 - 2 * t1);
        return out;
    }
    /**
     * Transforms the vec2 with a Mat2 (column-major 2x2)
     *
     * @param {Mat2} m matrix to transform with
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    transformMat2(m, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const x = this[0], y = this[1];
        out[0] = m[0] * x + m[2] * y;
        out[1] = m[1] * x + m[3] * y;
        return out;
    }
    /**
     * Transforms the vec2 with a Mat2x3 (2D affine transform)
     *
     * @param {Mat2x3} m matrix to transform with
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    transformMat2x3(m, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const x = this[0], y = this[1];
        out[0] = m[0] * x + m[2] * y + m[4];
        out[1] = m[1] * x + m[3] * y + m[5];
        return out;
    }
    /**
     * Transforms the vec2 with a Mat3 (column-major 3x3)
     *
     * @param {Mat3} m matrix to transform with
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    transformMat3(m, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const x = this[0], y = this[1];
        out[0] = m[0] * x + m[3] * y + m[6];
        out[1] = m[1] * x + m[4] * y + m[7];
        return out;
    }
    /**
     * Transforms the vec2 with a Mat4 (column-major 4x4)
     *
     * @param {Mat4} m matrix to transform with
     * @param {Vec2} out the receiving vector, defaults to new vec2()
     * @returns {Vec2} out
     */
    transformMat4(m, out = (index.ALWAYS_COPY ? new this.vec2() : this)) {
        const x = this[0], y = this[1];
        out[0] = m[0] * x + m[4] * y + m[12];
        out[1] = m[1] * x + m[5] * y + m[13];
        return out;
    }
    /**
     * Adds two vec2's after scaling the second operand by a scalar value (static)
     *
     * @param {Vec2} a the first operand
     * @param {Vec2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @param {Vec2} out the receiving vector
     * @returns {Vec2} out
     */
    static scaleAndAdd(a, b, scale, out = new this.prototype.vec2()) {
        out[0] = a[0] + b[0] * scale;
        out[1] = a[1] + b[1] * scale;
        return out;
    }
    /**
     * Reflects a vector off a surface with the given normal
     *
     * @param {Vec2} I the incident vector
     * @param {Vec2} N the normal vector (should be normalized)
     * @param {Vec2} out the receiving vector
     * @returns {Vec2} out
     */
    static reflect(I, N, out = new this.prototype.vec2()) {
        const d = Vec2.dot(N, I);
        out[0] = I[0] - 2 * d * N[0];
        out[1] = I[1] - 2 * d * N[1];
        return out;
    }
}
defineSwizzles(Vec2.prototype, 2);
// @aliases
Vec2.dist = Vec2.distance;
Vec2.sqrDist = Vec2.squaredDistance;
Vec2.prototype.add = Vec2.prototype.plus;
Vec2.prototype.sub = Vec2.prototype.minus;
Vec2.prototype.subtract = Vec2.prototype.minus;
Vec2.prototype.mul = Vec2.prototype.mult;
Vec2.prototype.multiply = Vec2.prototype.mult;
Vec2.prototype.scale = Vec2.prototype.mult;
Vec2.prototype.times = Vec2.prototype.mult;
Vec2.prototype.divide = Vec2.prototype.div;
Vec2.prototype.neg = Vec2.prototype.negate;
Vec2.prototype.unaryMinus = Vec2.prototype.negate;
Vec2.prototype.sqrLen = Vec2.prototype.squaredLength;
Vec2.prototype.str = Vec2.prototype.toString;
Vec2.prototype.lerpV = Vec2.prototype.mix;
Vec2.prototype.normalized = Vec2.prototype.normalize;
Vec2.prototype.transformMat2x2 = Vec2.prototype.transformMat2;
Vec2.prototype.transformMat3x3 = Vec2.prototype.transformMat3;
Vec2.prototype.transformMat4x4 = Vec2.prototype.transformMat4;
/**
 * 2 Dimensional Vector of 64 bit floats
 * @extends Float64Array
 */
class Vec2d extends Float64Array {
    static get zero() { return new Vec2d(0, 0); }
    static get Zero() { return new Vec2d(0, 0); }
    static get ZERO() { return new Vec2d(0, 0); }
    static get one() { return new Vec2d(1, 1); }
    static get One() { return new Vec2d(1, 1); }
    static get ONE() { return new Vec2d(1, 1); }
    /**
     * Creates a new Vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     */
    constructor(x = 0, y = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }
}
/**
 * 2 Dimensional Vector of 32-bit integers
 * @extends Int32Array
 */
class Vec2i extends Int32Array {
    static get zero() { return new Vec2i(0, 0); }
    static get Zero() { return new Vec2i(0, 0); }
    static get ZERO() { return new Vec2i(0, 0); }
    static get one() { return new Vec2i(1, 1); }
    static get One() { return new Vec2i(1, 1); }
    static get ONE() { return new Vec2i(1, 1); }
    /**
     * Creates a new Vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     */
    constructor(x = 0, y = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }
}
/**
 * 2 Dimensional Vector of unsigned 32-bit integers
 * @extends Uint32Array
 */
class Vec2u extends Uint32Array {
    static get zero() { return new Vec2u(0, 0); }
    static get Zero() { return new Vec2u(0, 0); }
    static get ZERO() { return new Vec2u(0, 0); }
    static get one() { return new Vec2u(1, 1); }
    static get One() { return new Vec2u(1, 1); }
    static get ONE() { return new Vec2u(1, 1); }
    /**
     * Creates a new Vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     */
    constructor(x = 0, y = 0) {
        super(2);
        this[0] = x;
        this[1] = y;
    }
}

const isVec3Like = (a) => a?.length === 3;
/**
 * 3 Dimensional Vector of 32-bit floats
 * @extends Float32Array
 */
class Vec3 extends Float32Array {
    static get zero() { return new this.prototype.vec3(0, 0, 0); }
    static get Zero() { return new this.prototype.vec3(0, 0, 0); }
    static get ZERO() { return new this.prototype.vec3(0, 0, 0); }
    static get one() { return new this.prototype.vec3(1, 1, 1); }
    static get One() { return new this.prototype.vec3(1, 1, 1); }
    static get ONE() { return new this.prototype.vec3(1, 1, 1); }
    static get unitX() { return new this.prototype.vec3(1, 0, 0); }
    static get UnitX() { return new this.prototype.vec3(1, 0, 0); }
    static get unitY() { return new this.prototype.vec3(0, 1, 0); }
    static get UnitY() { return new this.prototype.vec3(0, 1, 0); }
    static get unitZ() { return new this.prototype.vec3(0, 0, 1); }
    static get UnitZ() { return new this.prototype.vec3(0, 0, 1); }
    /**
     * Creates new vec3
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
    get x() { return this[0]; }
    set x(v) { this[0] = v; }
    get y() { return this[1]; }
    set y(v) { this[1] = v; }
    get z() { return this[2]; }
    set z(v) { this[2] = v; }
    /**
     * Adds two vec3's
     *
     * @param {Number | Vec3Like} b the second operand
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] + b;
            out[1] = this[1] + b;
            out[2] = this[2] + b;
        }
        else {
            out[0] = this[0] + b[0];
            out[1] = this[1] + b[1];
            out[2] = this[2] + b[2];
        }
        return out;
    }
    /**
     * Subtracts two vec3's
     *
     * @param {Number | Vec3Like} b the second operand
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] - b;
            out[1] = this[1] - b;
            out[2] = this[2] - b;
        }
        else {
            out[0] = this[0] - b[0];
            out[1] = this[1] - b[1];
            out[2] = this[2] - b[2];
        }
        return out;
    }
    /**
     * Multiplies two vec3's
     *
     * @param {Number | Vec3Like} b the second operand
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    mult(b, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] * b;
            out[1] = this[1] * b;
            out[2] = this[2] * b;
        }
        else {
            out[0] = this[0] * b[0];
            out[1] = this[1] * b[1];
            out[2] = this[2] * b[2];
        }
        return out;
    }
    /**
     * Divides two vec3's
     *
     * @param {Number | Vec3Like} b the second operand
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    div(b, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] / b;
            out[1] = this[1] / b;
            out[2] = this[2] / b;
        }
        else {
            out[0] = this[0] / b[0];
            out[1] = this[1] / b[1];
            out[2] = this[2] / b[2];
        }
        return out;
    }
    invDiv(b, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof b === 'number') {
            out[0] = b / this[0];
            out[1] = b / this[1];
            out[2] = b / this[2];
        }
        else {
            out[0] = b[0] / this[0];
            out[1] = b[1] / this[1];
            out[2] = b[2] / this[2];
        }
        return out;
    }
    /**
     * Negates the components of this vec3
     *
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    negate(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        return out;
    }
    unaryPlus(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (!out.equals(this)) {
            out[0] = this[0];
            out[1] = this[1];
            out[2] = this[2];
        }
        return out;
    }
    /**
     * Normalizes vec3
     *
     * @param {Vec3Like} v the vector to normalize
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static normalize(v, out = new this.prototype.vec3()) {
        const x = v[0], y = v[1], z = v[2];
        let len = x * x + y * y + z * z;
        if (len > 0)
            len = 1.0 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        return out;
    }
    /**
     * Normalizes this vec3
     *
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    normalize(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const x = this[0], y = this[1], z = this[2];
        let len = x * x + y * y + z * z;
        if (len > 0)
            len = 1.0 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        return out;
    }
    /**
     * Returns whether or not the vectors have approximately equal components
     *
     * @param {Vec3Like} b the second operand
     * @returns {Boolean} true if the vectors are approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) &&
            equals(this[1], b[1]) &&
            equals(this[2], b[2]));
    }
    /**
     * Returns whether or not the vectors have exactly equal components
     *
     * @param {Vec3Like} b the second operand
     * @returns {Boolean} true if the vectors are exactly equal
     */
    exactEquals(b) {
        return this[0] === b[0] && this[1] === b[1] && this[2] === b[2];
    }
    /**
     * Calculates the squared length of vec3
     *
     * @returns {Number} squared length of a vector
     */
    squaredLength() {
        const x = this[0], y = this[1], z = this[2];
        return x * x + y * y + z * z;
    }
    /**
     * Calculates the length of vec3
     *
     * @returns {Number} length of a vector
     */
    len() {
        const x = this[0], y = this[1], z = this[2];
        return Math.sqrt(x * x + y * y + z * z);
    }
    /**
     * Returns vec3 with each component floored
     *
     * @param {Vec3Like} v the vector to floor
     * @returns {Vec3} a new floored vector
     */
    static floor(v, out = new this.prototype.vec3()) {
        out[0] = Math.floor(v[0]);
        out[1] = Math.floor(v[1]);
        out[2] = Math.floor(v[2]);
        return out;
    }
    /**
     * Returns vec3 with each component rounded
     *
     * @param {Vec3Like} v the vector to round
     * @returns {Vec3} a new rounded vector
     */
    static round(v, out = new this.prototype.vec3()) {
        out[0] = Math.round(v[0]);
        out[1] = Math.round(v[1]);
        out[2] = Math.round(v[2]);
        return out;
    }
    /**
     * Returns vec3 with each component ceiled
     *
     * @param {Vec3Like} v the vector to ceil
     * @returns {Vec3} a new ceiled vector
     */
    static ceil(v, out = new this.prototype.vec3()) {
        out[0] = Math.ceil(v[0]);
        out[1] = Math.ceil(v[1]);
        out[2] = Math.ceil(v[2]);
        return out;
    }
    /**
     * Floors each component of vec3
     *
     * @returns {Vec3} this
     */
    floor(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = Math.floor(this[0]);
        out[1] = Math.floor(this[1]);
        out[2] = Math.floor(this[2]);
        return out;
    }
    /**
     * Rounds each component of vec3
     *
     * @returns {Vec3} this
     */
    round(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = Math.round(this[0]);
        out[1] = Math.round(this[1]);
        out[2] = Math.round(this[2]);
        return out;
    }
    /**
     * Ceils each component of vec3
     *
     * @returns {Vec3} this
     */
    ceil(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = Math.ceil(this[0]);
        out[1] = Math.ceil(this[1]);
        out[2] = Math.ceil(this[2]);
        return out;
    }
    /**
     * Returns the inverse of vec3
     *
     * @param {Vec3Like} v the source vector
     * @returns {Vec3} a new inverted vector
     */
    static inverse(v, out = new this.prototype.vec3()) {
        out[0] = 1.0 / v[0];
        out[1] = 1.0 / v[1];
        out[2] = 1.0 / v[2];
        return out;
    }
    /**
     * Inverts vec3 component-wise
     *
     * @returns {Vec3} this
     */
    inverse(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = 1.0 / this[0];
        out[1] = 1.0 / this[1];
        out[2] = 1.0 / this[2];
        return out;
    }
    /**
     * Creates vec3 initialized with values from a vector
     *
     * @returns {Vec3} vec3
     */
    clone() {
        return new this.vec3(this[0], this[1], this[2]);
    }
    /**
     * Returns a string representation of a vector
     *
     * @returns {String} string representation of the vector
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]})`;
    }
    /**
     * Generates a random vector with the given scale
     *
     * @param {Number} scale length of the resulting vector, defaults to 1.0
     * @param {Vec3} out the receiving vector, defaults to new Vec3()
     * @returns {Vec3} out vector
     */
    static random(scale = 1.0, out = new this.prototype.vec3()) {
        const r = index.RANDOM() * 2.0 * Math.PI;
        const z = index.RANDOM() * 2.0 - 1.0;
        const zScale = Math.sqrt(1.0 - z * z) * scale;
        out[0] = Math.cos(r) * zScale;
        out[1] = Math.sin(r) * zScale;
        out[2] = z * scale;
        return out;
    }
    /**
     * Calculates the angle between two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @returns {Number} the angle in radians
     */
    static angle(a, b) {
        const ax = a[0], ay = a[1], az = a[2];
        const bx = b[0], by = b[1], bz = b[2];
        const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
        const cosine = mag && Vec3.dot(a, b) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
    }
    /**
     * Calculates the dot product of two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @returns {Number} dot product of a and b
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    /**
     * Calculates the dot product of this vec3 with b
     *
     * @param {Vec3Like} b the second operand
     * @returns {Number} dot product
     */
    dot(b) {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
    }
    /**
     * Computes the cross product of two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static cross(a, b, out = new this.prototype.vec3()) {
        const ax = a[0], ay = a[1], az = a[2];
        const bx = b[0], by = b[1], bz = b[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }
    /**
     * Calculates the euclidian distance between two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @returns {Number} distance between a and b
     */
    static distance(a, b) {
        const x = a[0] - b[0];
        const y = a[1] - b[1];
        const z = a[2] - b[2];
        return Math.sqrt(x * x + y * y + z * z);
    }
    /**
     * Calculates the squared euclidian distance between two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @returns {Number} squared distance between a and b
     */
    static squaredDistance(a, b) {
        const x = a[0] - b[0];
        const y = a[1] - b[1];
        const z = a[2] - b[2];
        return x * x + y * y + z * z;
    }
    /**
     * Performs a linear interpolation between two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static lerp(a, b, t, out = new this.prototype.vec3()) {
        const ax = a[0], ay = a[1], az = a[2];
        out[0] = ax + (b[0] - ax) * t;
        out[1] = ay + (b[1] - ay) * t;
        out[2] = az + (b[2] - az) * t;
        return out;
    }
    /**
     * Performs a spherical linear interpolation between two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static slerp(a, b, t, out = new this.prototype.vec3()) {
        const angle = Math.acos(Math.min(Math.max(Vec3.dot(a, b), -1), 1));
        const sinTotal = Math.sin(angle);
        const ratioA = Math.sin((1 - t) * angle) / sinTotal;
        const ratioB = Math.sin(t * angle) / sinTotal;
        out[0] = ratioA * a[0] + ratioB * b[0];
        out[1] = ratioA * a[1] + ratioB * b[1];
        out[2] = ratioA * a[2] + ratioB * b[2];
        return out;
    }
    /**
     * Returns the maximum of two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @returns {Vec3} a new vector with the max components
     */
    static max(a, b, out = new this.prototype.vec3()) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        out[2] = Math.max(a[2], b[2]);
        return out;
    }
    /**
     * Returns the minimum of two vec3's
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @returns {Vec3} a new vector with the min components
     */
    static min(a, b, out = new this.prototype.vec3()) {
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        out[2] = Math.min(a[2], b[2]);
        return out;
    }
    /**
     * Clamps each component of v between min and max.
     *
     * @param {Vec3Like} v the vector to clamp
     * @param {Vec3Like | number} min the lower bound (per-component or scalar)
     * @param {Vec3Like | number} max the upper bound (per-component or scalar)
     * @param {Vec3} out the receiving vector
     * @returns {Vec3} out
     */
    static clamp(v, min, max, out = new this.prototype.vec3()) {
        const minX = typeof min === 'number' ? min : min[0];
        const minY = typeof min === 'number' ? min : min[1];
        const minZ = typeof min === 'number' ? min : min[2];
        const maxX = typeof max === 'number' ? max : max[0];
        const maxY = typeof max === 'number' ? max : max[1];
        const maxZ = typeof max === 'number' ? max : max[2];
        out[0] = Math.min(Math.max(v[0], minX), maxX);
        out[1] = Math.min(Math.max(v[1], minY), maxY);
        out[2] = Math.min(Math.max(v[2], minZ), maxZ);
        return out;
    }
    /**
     * Performs a linear interpolation between a and b.
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Vec3Like | number} t interpolation amount (per-component or scalar)
     * @param {Vec3} out the receiving vector
     * @returns {Vec3} out
     */
    static mix(a, b, t, out = new this.prototype.vec3()) {
        if (typeof t === 'number') {
            out[0] = a[0] + (b[0] - a[0]) * t;
            out[1] = a[1] + (b[1] - a[1]) * t;
            out[2] = a[2] + (b[2] - a[2]) * t;
        }
        else {
            out[0] = a[0] + (b[0] - a[0]) * t[0];
            out[1] = a[1] + (b[1] - a[1]) * t[1];
            out[2] = a[2] + (b[2] - a[2]) * t[2];
        }
        return out;
    }
    /**
     * Performs Hermite interpolation between two values (smoothstep).
     *
     * @param {Vec3Like | number} edge0 the lower edge (per-component or scalar)
     * @param {Vec3Like | number} edge1 the upper edge (per-component or scalar)
     * @param {Vec3Like} v the source vector
     * @param {Vec3} out the receiving vector
     * @returns {Vec3} out
     */
    static smoothstep(edge0, edge1, v, out = new this.prototype.vec3()) {
        const e0x = typeof edge0 === 'number' ? edge0 : edge0[0];
        const e0y = typeof edge0 === 'number' ? edge0 : edge0[1];
        const e0z = typeof edge0 === 'number' ? edge0 : edge0[2];
        const e1x = typeof edge1 === 'number' ? edge1 : edge1[0];
        const e1y = typeof edge1 === 'number' ? edge1 : edge1[1];
        const e1z = typeof edge1 === 'number' ? edge1 : edge1[2];
        let t0 = Math.min(Math.max((v[0] - e0x) / (e1x - e0x), 0), 1);
        let t1 = Math.min(Math.max((v[1] - e0y) / (e1y - e0y), 0), 1);
        let t2 = Math.min(Math.max((v[2] - e0z) / (e1z - e0z), 0), 1);
        out[0] = t0 * t0 * (3 - 2 * t0);
        out[1] = t1 * t1 * (3 - 2 * t1);
        out[2] = t2 * t2 * (3 - 2 * t2);
        return out;
    }
    /**
     * Rotates vec3 around the X axis
     *
     * @param {Vec3Like} v the vector to rotate
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
     * @returns {Vec3} a new rotated vector
     */
    static rotateX(v, rad, origin = Vec3.zero, out = new this.prototype.vec3()) {
        const p1 = v[1] - origin[1];
        const p2 = v[2] - origin[2];
        out[0] = v[0];
        out[1] = p1 * Math.cos(rad) - p2 * Math.sin(rad) + origin[1];
        out[2] = p1 * Math.sin(rad) + p2 * Math.cos(rad) + origin[2];
        return out;
    }
    /**
     * Rotates vec3 around the X axis
     *
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
     * @returns {Vec3} a rotated vector
     */
    rotateX(rad, origin = Vec3.zero, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const p1 = this[1] - origin[1];
        const p2 = this[2] - origin[2];
        out[0] = this[0];
        out[1] = p1 * Math.cos(rad) - p2 * Math.sin(rad) + origin[1];
        out[2] = p1 * Math.sin(rad) + p2 * Math.cos(rad) + origin[2];
        return out;
    }
    /**
     * Rotates vec3 around the Y axis
     *
     * @param {Vec3Like} v the vector to rotate
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
     * @returns {Vec3} a rotated vector
     */
    static rotateY(v, rad, origin = Vec3.zero, out = new this.prototype.vec3()) {
        const p0 = v[0] - origin[0];
        const p2 = v[2] - origin[2];
        out[0] = p2 * Math.sin(rad) + p0 * Math.cos(rad) + origin[0];
        out[1] = v[1];
        out[2] = p2 * Math.cos(rad) - p0 * Math.sin(rad) + origin[2];
        return out;
    }
    /**
     * Rotates vec3 around the Y axis
     *
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
     */
    rotateY(rad, origin = Vec3.zero, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const p0 = this[0] - origin[0];
        const p2 = this[2] - origin[2];
        out[0] = p2 * Math.sin(rad) + p0 * Math.cos(rad) + origin[0];
        out[1] = this[1];
        out[2] = p2 * Math.cos(rad) - p0 * Math.sin(rad) + origin[2];
        return out;
    }
    /**
     * Rotates vec3 around the Z axis
     *
     * @param {Vec3Like} v the vector to rotate
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec3Like} origin the origin of the rotation, defaults to ZERO
     * @returns {Vec3} a new rotated vector
     */
    static rotateZ(v, rad, origin = Vec3.zero, out = new this.prototype.vec3()) {
        const p0 = v[0] - origin[0];
        const p1 = v[1] - origin[1];
        out[0] = p0 * Math.cos(rad) - p1 * Math.sin(rad) + origin[0];
        out[1] = p0 * Math.sin(rad) + p1 * Math.cos(rad) + origin[1];
        out[2] = v[2];
        return out;
    }
    /**
     * Rotates vec3 around the Z axis
     *
     * @param {Number} rad the angle of rotation in radians
     * @param {Vec3Like} origin the origin of the rotation, defaults to vec3(0, 0, 0)
     */
    rotateZ(rad, origin = Vec3.zero, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const p0 = this[0] - origin[0];
        const p1 = this[1] - origin[1];
        out[0] = p0 * Math.cos(rad) - p1 * Math.sin(rad) + origin[0];
        out[1] = p0 * Math.sin(rad) + p1 * Math.cos(rad) + origin[1];
        out[2] = this[2];
        return out;
    }
    /**
     * Performs a hermite interpolation with two control points
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Vec3Like} c the third operand
     * @param {Vec3Like} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec3} a new vector
     */
    static hermite(a, b, c, d, t, out = new this.prototype.vec3()) {
        const factorTimes2 = t * t;
        const factor1 = factorTimes2 * (2 * t - 3) + 1;
        const factor2 = factorTimes2 * (t - 2) + t;
        const factor3 = factorTimes2 * (t - 1);
        const factor4 = factorTimes2 * (3 - 2 * t);
        out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
        out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
        out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
        return out;
    }
    /**
     * Performs a bezier interpolation with two control points
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Vec3Like} c the third operand
     * @param {Vec3Like} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec3} a new vector
     */
    static bezier(a, b, c, d, t, out = new this.prototype.vec3()) {
        const inverseFactor = 1 - t;
        const inverseFactorTimesTwo = inverseFactor * inverseFactor;
        const factorTimes2 = t * t;
        const factor1 = inverseFactorTimesTwo * inverseFactor;
        const factor2 = 3 * t * inverseFactorTimesTwo;
        const factor3 = 3 * factorTimes2 * inverseFactor;
        const factor4 = factorTimes2 * t;
        out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
        out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
        out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
        return out;
    }
    /**
     * Adds two vec3's after scaling the second operand by a scalar value
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static scaleAndAdd(a, b, scale, out = new this.prototype.vec3()) {
        out[0] = a[0] + b[0] * scale;
        out[1] = a[1] + b[1] * scale;
        out[2] = a[2] + b[2] * scale;
        return out;
    }
    /**
     * Reflects a vector off a surface with the given normal
     *
     * @param {Vec3Like} I the incident vector
     * @param {Vec3Like} N the surface normal
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static reflect(I, N, out = new this.prototype.vec3()) {
        const d = Vec3.dot(N, I) * 2;
        out[0] = I[0] - d * N[0];
        out[1] = I[1] - d * N[1];
        out[2] = I[2] - d * N[2];
        return out;
    }
    /**
     * Refracts a vector through a surface with the given normal and index of refraction ratio (Snell's law)
     *
     * @param {Vec3Like} I the incident vector
     * @param {Vec3Like} N the surface normal
     * @param {Number} eta the ratio of indices of refraction
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static refract(I, N, eta, out = new this.prototype.vec3()) {
        const d = Vec3.dot(N, I);
        const k = 1.0 - eta * eta * (1.0 - d * d);
        if (k < 0.0) {
            out[0] = out[1] = out[2] = 0;
            return out;
        }
        const f = eta * d + Math.sqrt(k);
        out[0] = eta * I[0] - f * N[0];
        out[1] = eta * I[1] - f * N[1];
        out[2] = eta * I[2] - f * N[2];
        return out;
    }
    /**
     * Returns a vector pointing in the same direction as another, based on the dot product with a reference
     *
     * @param {Vec3Like} N the vector to orient
     * @param {Vec3Like} I the incident vector
     * @param {Vec3Like} Nref the reference vector
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static faceforward(N, I, Nref, out = new this.prototype.vec3()) {
        const d = Vec3.dot(Nref, I);
        const sign = d < 0 ? 1 : -1;
        out[0] = N[0] * sign;
        out[1] = N[1] * sign;
        out[2] = N[2] * sign;
        return out;
    }
    /**
     * Computes the normalized normal of a triangle defined by three points
     *
     * @param {Vec3Like} p1 the first vertex
     * @param {Vec3Like} p2 the second vertex
     * @param {Vec3Like} p3 the third vertex
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static triangleNormal(p1, p2, p3, out = new this.prototype.vec3()) {
        const e1x = p2[0] - p1[0], e1y = p2[1] - p1[1], e1z = p2[2] - p1[2];
        const e2x = p3[0] - p1[0], e2y = p3[1] - p1[1], e2z = p3[2] - p1[2];
        out[0] = e1y * e2z - e1z * e2y;
        out[1] = e1z * e2x - e1x * e2z;
        out[2] = e1x * e2y - e1y * e2x;
        let len = out[0] * out[0] + out[1] * out[1] + out[2] * out[2];
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out[0] *= len;
            out[1] *= len;
            out[2] *= len;
        }
        return out;
    }
    /**
     * Projects vector a onto vector b
     *
     * @param {Vec3Like} a the vector to project
     * @param {Vec3Like} b the vector to project onto
     * @param {Vec3} out the receiving vector, defaults to new vec3
     * @returns {Vec3} out
     */
    static project(a, b, out = new this.prototype.vec3()) {
        const d = Vec3.dot(a, b) / Vec3.dot(b, b);
        out[0] = b[0] * d;
        out[1] = b[1] * d;
        out[2] = b[2] * d;
        return out;
    }
    /**
     * Returns the signed angle between two vec3's, using a reference axis to determine sign
     *
     * @param {Vec3Like} a the first operand
     * @param {Vec3Like} b the second operand
     * @param {Vec3Like} ref the reference axis for determining sign
     * @returns {Number} the signed angle in radians
     */
    static orientedAngle(a, b, ref) {
        const c = Vec3.cross(a, b);
        const angle = Math.atan2(c.len(), Vec3.dot(a, b));
        return Vec3.dot(c, ref) < 0 ? -angle : angle;
    }
    /**
     * Adds two vec3's after scaling the second operand by a scalar value
     *
     * @param {Vec3Like} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    scaleAndAdd(b, scale, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = this[0] + b[0] * scale;
        out[1] = this[1] + b[1] * scale;
        out[2] = this[2] + b[2] * scale;
        return out;
    }
    /**
     * Returns vec3 with each component set to its absolute value
     *
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    abs(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = Math.abs(this[0]);
        out[1] = Math.abs(this[1]);
        out[2] = Math.abs(this[2]);
        return out;
    }
    /**
     * Clamps each component of this vector between min and max.
     *
     * @param {Vec3Like | number} min the lower bound (per-component or scalar)
     * @param {Vec3Like | number} max the upper bound (per-component or scalar)
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    clamp(min, max, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const minX = typeof min === 'number' ? min : min[0];
        const minY = typeof min === 'number' ? min : min[1];
        const minZ = typeof min === 'number' ? min : min[2];
        const maxX = typeof max === 'number' ? max : max[0];
        const maxY = typeof max === 'number' ? max : max[1];
        const maxZ = typeof max === 'number' ? max : max[2];
        out[0] = Math.min(Math.max(this[0], minX), maxX);
        out[1] = Math.min(Math.max(this[1], minY), maxY);
        out[2] = Math.min(Math.max(this[2], minZ), maxZ);
        return out;
    }
    /**
     * Performs a linear interpolation between this vector and b.
     *
     * @param {Vec3Like} b the second operand
     * @param {Vec3Like | number} t interpolation amount (per-component or scalar)
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    mix(b, t, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof t === 'number') {
            out[0] = this[0] + (b[0] - this[0]) * t;
            out[1] = this[1] + (b[1] - this[1]) * t;
            out[2] = this[2] + (b[2] - this[2]) * t;
        }
        else {
            out[0] = this[0] + (b[0] - this[0]) * t[0];
            out[1] = this[1] + (b[1] - this[1]) * t[1];
            out[2] = this[2] + (b[2] - this[2]) * t[2];
        }
        return out;
    }
    /**
     * Generates a step function by comparing this vector to edge.
     *
     * @param {Vec3Like | number} edge the edge value (per-component or scalar)
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    step(edge, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        if (typeof edge === 'number') {
            out[0] = this[0] < edge ? 0 : 1;
            out[1] = this[1] < edge ? 0 : 1;
            out[2] = this[2] < edge ? 0 : 1;
        }
        else {
            out[0] = this[0] < edge[0] ? 0 : 1;
            out[1] = this[1] < edge[1] ? 0 : 1;
            out[2] = this[2] < edge[2] ? 0 : 1;
        }
        return out;
    }
    /**
     * Performs Hermite interpolation between two values (smoothstep).
     *
     * @param {Vec3Like | number} edge0 the lower edge (per-component or scalar)
     * @param {Vec3Like | number} edge1 the upper edge (per-component or scalar)
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    smoothstep(edge0, edge1, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const e0x = typeof edge0 === 'number' ? edge0 : edge0[0];
        const e0y = typeof edge0 === 'number' ? edge0 : edge0[1];
        const e0z = typeof edge0 === 'number' ? edge0 : edge0[2];
        const e1x = typeof edge1 === 'number' ? edge1 : edge1[0];
        const e1y = typeof edge1 === 'number' ? edge1 : edge1[1];
        const e1z = typeof edge1 === 'number' ? edge1 : edge1[2];
        let t0 = Math.min(Math.max((this[0] - e0x) / (e1x - e0x), 0), 1);
        let t1 = Math.min(Math.max((this[1] - e0y) / (e1y - e0y), 0), 1);
        let t2 = Math.min(Math.max((this[2] - e0z) / (e1z - e0z), 0), 1);
        out[0] = t0 * t0 * (3 - 2 * t0);
        out[1] = t1 * t1 * (3 - 2 * t1);
        out[2] = t2 * t2 * (3 - 2 * t2);
        return out;
    }
    /**
     * Returns the fractional part of each component.
     *
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    fract(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = this[0] - Math.floor(this[0]);
        out[1] = this[1] - Math.floor(this[1]);
        out[2] = this[2] - Math.floor(this[2]);
        return out;
    }
    /**
     * Returns the sign of each component (-1, 0, or 1).
     *
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    sign(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = this[0] > 0 ? 1 : this[0] < 0 ? -1 : 0;
        out[1] = this[1] > 0 ? 1 : this[1] < 0 ? -1 : 0;
        out[2] = this[2] > 0 ? 1 : this[2] < 0 ? -1 : 0;
        return out;
    }
    /**
     * Clamps each component to [0, 1].
     *
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    saturate(out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        out[0] = Math.min(Math.max(this[0], 0), 1);
        out[1] = Math.min(Math.max(this[1], 0), 1);
        out[2] = Math.min(Math.max(this[2], 0), 1);
        return out;
    }
    /**
     * Transforms this vec3 with a Mat3
     *
     * @param {Mat3} m the 3x3 matrix to transform with
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    transformMat3(m, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const x = this[0], y = this[1], z = this[2];
        out[0] = x * m[0] + y * m[3] + z * m[6];
        out[1] = x * m[1] + y * m[4] + z * m[7];
        out[2] = x * m[2] + y * m[5] + z * m[8];
        return out;
    }
    /**
     * Transforms this vec3 with a Mat4 (as a point, w=1)
     *
     * @param {Mat4} m the 4x4 matrix to transform with
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    transformMat4(m, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const x = this[0], y = this[1], z = this[2];
        let w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;
        out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return out;
    }
    /**
     * Transforms this vec3 with a quaternion
     *
     * @param {Quat} q the quaternion to transform with
     * @param {Vec3} out the receiving vector, defaults to new vec3()
     * @returns {Vec3} out
     */
    transformQuat(q, out = (index.ALWAYS_COPY ? new this.vec3() : this)) {
        const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
        const x = this[0], y = this[1], z = this[2];
        let uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
        let uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
        const w2 = qw * 2;
        uvx *= w2;
        uvy *= w2;
        uvz *= w2;
        uuvx *= 2;
        uuvy *= 2;
        uuvz *= 2;
        out[0] = x + uvx + uuvx;
        out[1] = y + uvy + uuvy;
        out[2] = z + uvz + uuvz;
        return out;
    }
}
defineSwizzles(Vec3.prototype, 3);
// @aliases
Vec3.dist = Vec3.distance;
Vec3.sqrDist = Vec3.squaredDistance;
Vec3.prototype.add = Vec3.prototype.plus;
Vec3.prototype.sub = Vec3.prototype.minus;
Vec3.prototype.subtract = Vec3.prototype.minus;
Vec3.prototype.mul = Vec3.prototype.mult;
Vec3.prototype.scale = Vec3.prototype.mult;
Vec3.prototype.multiply = Vec3.prototype.mult;
Vec3.prototype.times = Vec3.prototype.mult;
Vec3.prototype.divide = Vec3.prototype.div;
Vec3.prototype.neg = Vec3.prototype.negate;
Vec3.prototype.unaryMinus = Vec3.prototype.negate;
Vec3.prototype.sqrLen = Vec3.prototype.squaredLength;
Vec3.prototype.str = Vec3.prototype.toString;
Vec3.prototype.normalized = Vec3.prototype.normalize;
Vec3.prototype.lerpV = Vec3.prototype.mix;
Vec3.prototype.transformMat3x3 = Vec3.prototype.transformMat3;
Vec3.prototype.transformMat4x4 = Vec3.prototype.transformMat4;
/**
 * 3 Dimensional Vector of 64 bit floats
 * @extends Float64Array
 */
class Vec3d extends Float64Array {
    static get zero() { return new Vec3d(0, 0, 0); }
    static get Zero() { return new Vec3d(0, 0, 0); }
    static get ZERO() { return new Vec3d(0, 0, 0); }
    static get one() { return new Vec3d(1, 1, 1); }
    static get One() { return new Vec3d(1, 1, 1); }
    static get ONE() { return new Vec3d(1, 1, 1); }
    static get unitX() { return new Vec3d(1, 0, 0); }
    static get UnitX() { return new Vec3d(1, 0, 0); }
    static get unitY() { return new Vec3d(0, 1, 0); }
    static get UnitY() { return new Vec3d(0, 1, 0); }
    static get unitZ() { return new Vec3d(0, 0, 1); }
    static get UnitZ() { return new Vec3d(0, 0, 1); }
    /**
     * Creates new vec3
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
}
/**
 * 3 Dimensional Vector of 32-bit integers
 * @extends Int32Array
 */
class Vec3i extends Int32Array {
    static get zero() { return new Vec3i(0, 0, 0); }
    static get Zero() { return new Vec3i(0, 0, 0); }
    static get ZERO() { return new Vec3i(0, 0, 0); }
    static get one() { return new Vec3i(1, 1, 1); }
    static get One() { return new Vec3i(1, 1, 1); }
    static get ONE() { return new Vec3i(1, 1, 1); }
    static get unitX() { return new Vec3i(1, 0, 0); }
    static get UnitX() { return new Vec3i(1, 0, 0); }
    static get unitY() { return new Vec3i(0, 1, 0); }
    static get UnitY() { return new Vec3i(0, 1, 0); }
    static get unitZ() { return new Vec3i(0, 0, 1); }
    static get UnitZ() { return new Vec3i(0, 0, 1); }
    /**
     * Creates new vec3
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
}
/**
 * 3 Dimensional Vector of unsigned 32-bit integers
 * @extends Uint32Array
 */
class Vec3u extends Uint32Array {
    static get zero() { return new Vec3u(0, 0, 0); }
    static get Zero() { return new Vec3u(0, 0, 0); }
    static get ZERO() { return new Vec3u(0, 0, 0); }
    static get one() { return new Vec3u(1, 1, 1); }
    static get One() { return new Vec3u(1, 1, 1); }
    static get ONE() { return new Vec3u(1, 1, 1); }
    static get unitX() { return new Vec3u(1, 0, 0); }
    static get UnitX() { return new Vec3u(1, 0, 0); }
    static get unitY() { return new Vec3u(0, 1, 0); }
    static get UnitY() { return new Vec3u(0, 1, 0); }
    static get unitZ() { return new Vec3u(0, 0, 1); }
    static get UnitZ() { return new Vec3u(0, 0, 1); }
    /**
     * Creates new vec3
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this[0] = x;
        this[1] = y;
        this[2] = z;
    }
}

const isVec4Like = (a) => a?.length === 4;
/**
 * 4 Dimensional Vector of 32-bit floats
 * @extends Float32Array
 */
class Vec4 extends Float32Array {
    static get zero() { return new this.prototype.vec4(0, 0, 0, 0); }
    static get Zero() { return new this.prototype.vec4(0, 0, 0, 0); }
    static get ZERO() { return new this.prototype.vec4(0, 0, 0, 0); }
    static get one() { return new this.prototype.vec4(1, 1, 1, 1); }
    static get One() { return new this.prototype.vec4(1, 1, 1, 1); }
    static get ONE() { return new this.prototype.vec4(1, 1, 1, 1); }
    /**
     * Creates a vec4
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     * @param {Number} w W component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
    get x() { return this[0]; }
    set x(v) { this[0] = v; }
    get y() { return this[1]; }
    set y(v) { this[1] = v; }
    get z() { return this[2]; }
    set z(v) { this[2] = v; }
    get w() { return this[3]; }
    set w(v) { this[3] = v; }
    /**
     * Adds two vec4's
     *
     * @param {Vec4Like | Number} b the second operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] + b;
            out[1] = this[1] + b;
            out[2] = this[2] + b;
            out[3] = this[3] + b;
        }
        else {
            out[0] = this[0] + b[0];
            out[1] = this[1] + b[1];
            out[2] = this[2] + b[2];
            out[3] = this[3] + b[3];
        }
        return out;
    }
    /**
     * Subtracts two vec4's
     *
     * @param {Vec4Like | Number} b the second operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] - b;
            out[1] = this[1] - b;
            out[2] = this[2] - b;
            out[3] = this[3] - b;
        }
        else {
            out[0] = this[0] - b[0];
            out[1] = this[1] - b[1];
            out[2] = this[2] - b[2];
            out[3] = this[3] - b[3];
        }
        return out;
    }
    /**
     * Multiplies two vec4's
     *
     * @param {Vec4Like | Number} b the second operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    mult(b, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] * b;
            out[1] = this[1] * b;
            out[2] = this[2] * b;
            out[3] = this[3] * b;
        }
        else {
            out[0] = this[0] * b[0];
            out[1] = this[1] * b[1];
            out[2] = this[2] * b[2];
            out[3] = this[3] * b[3];
        }
        return out;
    }
    /**
     * Divides two vec4's
     *
     * @param {Vec4Like | Number} b the second operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    div(b, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] / b;
            out[1] = this[1] / b;
            out[2] = this[2] / b;
            out[3] = this[3] / b;
        }
        else {
            out[0] = this[0] / b[0];
            out[1] = this[1] / b[1];
            out[2] = this[2] / b[2];
            out[3] = this[3] / b[3];
        }
        return out;
    }
    invDiv(b, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof b === 'number') {
            out[0] = b / this[0];
            out[1] = b / this[1];
            out[2] = b / this[2];
            out[3] = b / this[3];
        }
        else {
            out[0] = b[0] / this[0];
            out[1] = b[1] / this[1];
            out[2] = b[2] / this[2];
            out[3] = b[3] / this[3];
        }
        return out;
    }
    /**
     * Negates the components of a vec4
     *
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    negate(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        out[3] = -this[3];
        return out;
    }
    unaryPlus(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (!out.equals(this)) {
            out[0] = this[0];
            out[1] = this[1];
            out[2] = this[2];
            out[3] = this[3];
        }
        return out;
    }
    /**
     * Normalizes a vec4
     *
     * @param {Vec4Like} v vector to normalize
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    static normalize(v, out = new this.prototype.vec4()) {
        const x = v[0], y = v[1], z = v[2], w = v[3];
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1.0 / Math.sqrt(len);
        }
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
        return out;
    }
    /**
     * Normalizes a vec4
     *
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    normalize(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1.0 / Math.sqrt(len);
        }
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
        return out;
    }
    /**
     * Returns whether or not the vectors have approximately equal components
     *
     * @param {Vec4Like} b the second operand
     * @returns {Boolean} true if the vectors are approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) && equals(this[1], b[1]) &&
            equals(this[2], b[2]) && equals(this[3], b[3]));
    }
    /**
     * Returns whether or not the vectors have exactly equal components
     *
     * @param {Vec4Like} b the second operand
     * @returns {Boolean} true if the vectors are exactly equal
     */
    exactEquals(b) {
        return this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3];
    }
    /**
     * Calculates the squared length of a vec4
     *
     * @returns {Number} squared length of the vector
     */
    squaredLength() {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        return x * x + y * y + z * z + w * w;
    }
    /**
     * Calculates the length of a vec4
     *
     * @returns {Number} length of the vector
     */
    len() {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }
    /**
     * Math.floor the components of a vec4
     *
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    floor(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = Math.floor(this[0]);
        out[1] = Math.floor(this[1]);
        out[2] = Math.floor(this[2]);
        out[3] = Math.floor(this[3]);
        return out;
    }
    /**
     * Math.round the components of a vec4
     *
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    round(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = Math.round(this[0]);
        out[1] = Math.round(this[1]);
        out[2] = Math.round(this[2]);
        out[3] = Math.round(this[3]);
        return out;
    }
    /**
     * Math.ceil the components of a vec4
     *
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    ceil(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = Math.ceil(this[0]);
        out[1] = Math.ceil(this[1]);
        out[2] = Math.ceil(this[2]);
        out[3] = Math.ceil(this[3]);
        return out;
    }
    /**
     * Returns the inverse of the components of a vec4
     *
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    inverse(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = 1.0 / this[0];
        out[1] = 1.0 / this[1];
        out[2] = 1.0 / this[2];
        out[3] = 1.0 / this[3];
        return out;
    }
    /**
     * Creates a vec4 initialized with values from a vector
     *
     * @returns {Vec4} a vec4
     */
    clone() {
        return new this.vec4(this[0], this[1], this[2], this[3]);
    }
    /**
     * Returns a string representation of a vec4
     *
     * @returns {String} string representation of the vector
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`;
    }
    /**
     * Generates a random vector with the given scale
     *
     * @param {Number} scale length of the resulting vector, defaults to 1.0
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    static random(scale = 1.0, out = new this.prototype.vec4()) {
        // Marsaglia, George. Choosing a Point from the Surface of a
        // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
        // http://projecteuclid.org/euclid.aoms/1177692644;
        let v1, v2, v3, v4;
        let s1, s2;
        let rand;
        rand = index.RANDOM();
        v1 = rand * 2 - 1;
        v2 = (4 * index.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
        s1 = v1 * v1 + v2 * v2;
        rand = index.RANDOM();
        v3 = rand * 2 - 1;
        v4 = (4 * index.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
        s2 = v3 * v3 + v4 * v4;
        const d = Math.sqrt((1 - s1) / s2);
        out[0] = scale * v1;
        out[1] = scale * v2;
        out[2] = scale * v3 * d;
        out[3] = scale * v4 * d;
        return out;
    }
    /**
     * Calculates the dot product of two vec4's
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @returns {Number} dot product of a and b
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    /**
     * Calculates the dot product of this vec4 with b
     *
     * @param {Vec4Like} b the second operand
     * @returns {Number} dot product
     */
    dot(b) {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3] * b[3];
    }
    /**
     * Returns the cross-product of three vec4's in a 4-dimensional space
     *
     * @param {Vec4Like} u the first operand
     * @param {Vec4Like} v the second operand
     * @param {Vec4Like} w the third operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    static cross(u, v, w, out = new this.prototype.vec4()) {
        const A = v[0] * w[1] - v[1] * w[0], B = v[0] * w[2] - v[2] * w[0], C = v[0] * w[3] - v[3] * w[0], D = v[1] * w[2] - v[2] * w[1], E = v[1] * w[3] - v[3] * w[1], F = v[2] * w[3] - v[3] * w[2];
        const G = u[0], H = u[1], I = u[2], J = u[3];
        out[0] = H * F - I * E + J * D;
        out[1] = -(G * F) + I * C - J * B;
        out[2] = G * E - H * C + J * A;
        out[3] = -(G * D) + H * B - I * A;
        return out;
    }
    /**
     * Calculates the euclidean distance between two vec4's
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @returns {Number} distance between a and b
     */
    static distance(a, b) {
        const x = a[0] - b[0];
        const y = a[1] - b[1];
        const z = a[2] - b[2];
        const w = a[3] - b[3];
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }
    /**
     * Calculates the squared euclidean distance between two vec4's
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @returns {Number} squared distance between a and b
     */
    static squaredDistance(a, b) {
        const x = a[0] - b[0];
        const y = a[1] - b[1];
        const z = a[2] - b[2];
        const w = a[3] - b[3];
        return x * x + y * y + z * z + w * w;
    }
    /**
     * Performs a linear interpolation between two vec4's
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    static lerp(a, b, t, out = new this.prototype.vec4()) {
        const ax = a[0], ay = a[1], az = a[2], aw = a[3];
        out[0] = ax + (b[0] - ax) * t;
        out[1] = ay + (b[1] - ay) * t;
        out[2] = az + (b[2] - az) * t;
        out[3] = aw + (b[3] - aw) * t;
        return out;
    }
    /**
     * Returns the maximum of two vec4's
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    static max(a, b, out = new this.prototype.vec4()) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        out[2] = Math.max(a[2], b[2]);
        out[3] = Math.max(a[3], b[3]);
        return out;
    }
    /**
     * Returns the minimum of two vec4's
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @param {Vec4} out the receiving vector, defaults to new vec4()
     * @returns {Vec4} out
     */
    static min(a, b, out = new this.prototype.vec4()) {
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        out[2] = Math.min(a[2], b[2]);
        out[3] = Math.min(a[3], b[3]);
        return out;
    }
    /**
     * Clamps the components of a vec4 between min and max values.
     *
     * @param {Vec4Like} v the input vector
     * @param {Vec4Like | number} min the minimum bound
     * @param {Vec4Like | number} max the maximum bound
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    static clamp(v, min, max, out = new this.prototype.vec4()) {
        const minX = typeof min === 'number' ? min : min[0];
        const minY = typeof min === 'number' ? min : min[1];
        const minZ = typeof min === 'number' ? min : min[2];
        const minW = typeof min === 'number' ? min : min[3];
        const maxX = typeof max === 'number' ? max : max[0];
        const maxY = typeof max === 'number' ? max : max[1];
        const maxZ = typeof max === 'number' ? max : max[2];
        const maxW = typeof max === 'number' ? max : max[3];
        out[0] = Math.min(Math.max(v[0], minX), maxX);
        out[1] = Math.min(Math.max(v[1], minY), maxY);
        out[2] = Math.min(Math.max(v[2], minZ), maxZ);
        out[3] = Math.min(Math.max(v[3], minW), maxW);
        return out;
    }
    /**
     * Performs a linear interpolation between two vec4's.
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @param {Vec4Like | number} t interpolation amount
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    static mix(a, b, t, out = new this.prototype.vec4()) {
        if (typeof t === 'number') {
            out[0] = a[0] + (b[0] - a[0]) * t;
            out[1] = a[1] + (b[1] - a[1]) * t;
            out[2] = a[2] + (b[2] - a[2]) * t;
            out[3] = a[3] + (b[3] - a[3]) * t;
        }
        else {
            out[0] = a[0] + (b[0] - a[0]) * t[0];
            out[1] = a[1] + (b[1] - a[1]) * t[1];
            out[2] = a[2] + (b[2] - a[2]) * t[2];
            out[3] = a[3] + (b[3] - a[3]) * t[3];
        }
        return out;
    }
    /**
     * Performs Hermite interpolation between two values.
     *
     * @param {Vec4Like | number} edge0 the lower edge
     * @param {Vec4Like | number} edge1 the upper edge
     * @param {Vec4Like} v the source vector
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    static smoothstep(edge0, edge1, v, out = new this.prototype.vec4()) {
        const e0x = typeof edge0 === 'number' ? edge0 : edge0[0];
        const e0y = typeof edge0 === 'number' ? edge0 : edge0[1];
        const e0z = typeof edge0 === 'number' ? edge0 : edge0[2];
        const e0w = typeof edge0 === 'number' ? edge0 : edge0[3];
        const e1x = typeof edge1 === 'number' ? edge1 : edge1[0];
        const e1y = typeof edge1 === 'number' ? edge1 : edge1[1];
        const e1z = typeof edge1 === 'number' ? edge1 : edge1[2];
        const e1w = typeof edge1 === 'number' ? edge1 : edge1[3];
        let t0 = Math.min(Math.max((v[0] - e0x) / (e1x - e0x), 0), 1);
        let t1 = Math.min(Math.max((v[1] - e0y) / (e1y - e0y), 0), 1);
        let t2 = Math.min(Math.max((v[2] - e0z) / (e1z - e0z), 0), 1);
        let t3 = Math.min(Math.max((v[3] - e0w) / (e1w - e0w), 0), 1);
        out[0] = t0 * t0 * (3 - 2 * t0);
        out[1] = t1 * t1 * (3 - 2 * t1);
        out[2] = t2 * t2 * (3 - 2 * t2);
        out[3] = t3 * t3 * (3 - 2 * t3);
        return out;
    }
    /**
     * Adds two vec4's after scaling the second operand by a scalar value
     *
     * @param {Vec4Like} b the second operand
     * @param {number} scale the amount to scale b by before adding
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    scaleAndAdd(b, scale, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = this[0] + b[0] * scale;
        out[1] = this[1] + b[1] * scale;
        out[2] = this[2] + b[2] * scale;
        out[3] = this[3] + b[3] * scale;
        return out;
    }
    /**
     * Returns the absolute value of the components of a vec4
     *
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    abs(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = Math.abs(this[0]);
        out[1] = Math.abs(this[1]);
        out[2] = Math.abs(this[2]);
        out[3] = Math.abs(this[3]);
        return out;
    }
    /**
     * Clamps the components of this vec4 between min and max values.
     *
     * @param {Vec4Like | number} min the minimum bound
     * @param {Vec4Like | number} max the maximum bound
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    clamp(min, max, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        const minX = typeof min === 'number' ? min : min[0];
        const minY = typeof min === 'number' ? min : min[1];
        const minZ = typeof min === 'number' ? min : min[2];
        const minW = typeof min === 'number' ? min : min[3];
        const maxX = typeof max === 'number' ? max : max[0];
        const maxY = typeof max === 'number' ? max : max[1];
        const maxZ = typeof max === 'number' ? max : max[2];
        const maxW = typeof max === 'number' ? max : max[3];
        out[0] = Math.min(Math.max(this[0], minX), maxX);
        out[1] = Math.min(Math.max(this[1], minY), maxY);
        out[2] = Math.min(Math.max(this[2], minZ), maxZ);
        out[3] = Math.min(Math.max(this[3], minW), maxW);
        return out;
    }
    /**
     * Performs a linear interpolation between this vec4 and b.
     *
     * @param {Vec4Like} b the second operand
     * @param {Vec4Like | number} t interpolation amount
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    mix(b, t, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof t === 'number') {
            out[0] = this[0] + (b[0] - this[0]) * t;
            out[1] = this[1] + (b[1] - this[1]) * t;
            out[2] = this[2] + (b[2] - this[2]) * t;
            out[3] = this[3] + (b[3] - this[3]) * t;
        }
        else {
            out[0] = this[0] + (b[0] - this[0]) * t[0];
            out[1] = this[1] + (b[1] - this[1]) * t[1];
            out[2] = this[2] + (b[2] - this[2]) * t[2];
            out[3] = this[3] + (b[3] - this[3]) * t[3];
        }
        return out;
    }
    /**
     * Returns 0.0 if this < edge, otherwise 1.0 for each component.
     *
     * @param {Vec4Like | number} edge the edge value
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    step(edge, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        if (typeof edge === 'number') {
            out[0] = this[0] < edge ? 0 : 1;
            out[1] = this[1] < edge ? 0 : 1;
            out[2] = this[2] < edge ? 0 : 1;
            out[3] = this[3] < edge ? 0 : 1;
        }
        else {
            out[0] = this[0] < edge[0] ? 0 : 1;
            out[1] = this[1] < edge[1] ? 0 : 1;
            out[2] = this[2] < edge[2] ? 0 : 1;
            out[3] = this[3] < edge[3] ? 0 : 1;
        }
        return out;
    }
    /**
     * Performs Hermite interpolation between two values.
     *
     * @param {Vec4Like | number} edge0 the lower edge
     * @param {Vec4Like | number} edge1 the upper edge
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    smoothstep(edge0, edge1, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        const e0x = typeof edge0 === 'number' ? edge0 : edge0[0];
        const e0y = typeof edge0 === 'number' ? edge0 : edge0[1];
        const e0z = typeof edge0 === 'number' ? edge0 : edge0[2];
        const e0w = typeof edge0 === 'number' ? edge0 : edge0[3];
        const e1x = typeof edge1 === 'number' ? edge1 : edge1[0];
        const e1y = typeof edge1 === 'number' ? edge1 : edge1[1];
        const e1z = typeof edge1 === 'number' ? edge1 : edge1[2];
        const e1w = typeof edge1 === 'number' ? edge1 : edge1[3];
        let t0 = Math.min(Math.max((this[0] - e0x) / (e1x - e0x), 0), 1);
        let t1 = Math.min(Math.max((this[1] - e0y) / (e1y - e0y), 0), 1);
        let t2 = Math.min(Math.max((this[2] - e0z) / (e1z - e0z), 0), 1);
        let t3 = Math.min(Math.max((this[3] - e0w) / (e1w - e0w), 0), 1);
        out[0] = t0 * t0 * (3 - 2 * t0);
        out[1] = t1 * t1 * (3 - 2 * t1);
        out[2] = t2 * t2 * (3 - 2 * t2);
        out[3] = t3 * t3 * (3 - 2 * t3);
        return out;
    }
    /**
     * Returns the fractional part of each component.
     *
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    fract(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = this[0] - Math.floor(this[0]);
        out[1] = this[1] - Math.floor(this[1]);
        out[2] = this[2] - Math.floor(this[2]);
        out[3] = this[3] - Math.floor(this[3]);
        return out;
    }
    /**
     * Returns the sign of each component (-1, 0, or 1).
     *
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    sign(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = this[0] > 0 ? 1 : this[0] < 0 ? -1 : 0;
        out[1] = this[1] > 0 ? 1 : this[1] < 0 ? -1 : 0;
        out[2] = this[2] > 0 ? 1 : this[2] < 0 ? -1 : 0;
        out[3] = this[3] > 0 ? 1 : this[3] < 0 ? -1 : 0;
        return out;
    }
    /**
     * Clamps each component between 0 and 1.
     *
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    saturate(out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        out[0] = Math.min(Math.max(this[0], 0), 1);
        out[1] = Math.min(Math.max(this[1], 0), 1);
        out[2] = Math.min(Math.max(this[2], 0), 1);
        out[3] = Math.min(Math.max(this[3], 0), 1);
        return out;
    }
    /**
     * Transforms the vec4 with a mat4
     *
     * @param {Mat4} m matrix to transform with
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    transformMat4(m, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return out;
    }
    /**
     * Transforms the vec4's xyz components by a quat, preserving w
     *
     * @param {Quat} q quaternion to transform with
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    transformQuat(q, out = (index.ALWAYS_COPY ? new this.vec4() : this)) {
        const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
        const x = this[0], y = this[1], z = this[2];
        let uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
        let uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
        const w2 = qw * 2;
        uvx *= w2;
        uvy *= w2;
        uvz *= w2;
        uuvx *= 2;
        uuvy *= 2;
        uuvz *= 2;
        out[0] = x + uvx + uuvx;
        out[1] = y + uvy + uuvy;
        out[2] = z + uvz + uuvz;
        out[3] = this[3];
        return out;
    }
    /**
     * Adds two vec4's after scaling the second operand by a scalar value
     *
     * @param {Vec4Like} a the first operand
     * @param {Vec4Like} b the second operand
     * @param {number} scale the amount to scale b by before adding
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    static scaleAndAdd(a, b, scale, out = new this.prototype.vec4()) {
        out[0] = a[0] + b[0] * scale;
        out[1] = a[1] + b[1] * scale;
        out[2] = a[2] + b[2] * scale;
        out[3] = a[3] + b[3] * scale;
        return out;
    }
}
defineSwizzles(Vec4.prototype, 4);
// @aliases
Vec4.dist = Vec4.distance;
Vec4.sqrDist = Vec4.squaredDistance;
Vec4.prototype.add = Vec4.prototype.plus;
Vec4.prototype.divide = Vec4.prototype.div;
Vec4.prototype.sub = Vec4.prototype.minus;
Vec4.prototype.subtract = Vec4.prototype.minus;
Vec4.prototype.mul = Vec4.prototype.mult;
Vec4.prototype.scale = Vec4.prototype.mult;
Vec4.prototype.times = Vec4.prototype.mult;
Vec4.prototype.multiply = Vec4.prototype.mult;
Vec4.prototype.neg = Vec4.prototype.negate;
Vec4.prototype.unaryMinus = Vec4.prototype.negate;
Vec4.prototype.sqrLen = Vec4.prototype.squaredLength;
Vec4.prototype.str = Vec4.prototype.toString;
Vec4.prototype.normalized = Vec4.prototype.normalize;
Vec4.prototype.lerpV = Vec4.prototype.mix;
Vec4.prototype.transformMat4x4 = Vec4.prototype.transformMat4;
/**
 * 4 Dimensional Vector of 64 bit floats
 * @extends Float64Array
 */
class Vec4d extends Float64Array {
    static get zero() { return new Vec4d(0, 0, 0, 0); }
    static get Zero() { return new Vec4d(0, 0, 0, 0); }
    static get ZERO() { return new Vec4d(0, 0, 0, 0); }
    static get one() { return new Vec4d(1, 1, 1, 1); }
    static get One() { return new Vec4d(1, 1, 1, 1); }
    static get ONE() { return new Vec4d(1, 1, 1, 1); }
    /**
     * Creates a vec4
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     * @param {Number} w W component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
}
/**
 * 4 Dimensional Vector of 32-bit integers
 * @extends Int32Array
 */
class Vec4i extends Int32Array {
    static get zero() { return new Vec4i(0, 0, 0, 0); }
    static get Zero() { return new Vec4i(0, 0, 0, 0); }
    static get ZERO() { return new Vec4i(0, 0, 0, 0); }
    static get one() { return new Vec4i(1, 1, 1, 1); }
    static get One() { return new Vec4i(1, 1, 1, 1); }
    static get ONE() { return new Vec4i(1, 1, 1, 1); }
    /**
     * Creates a vec4
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     * @param {Number} w W component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
}
/**
 * 4 Dimensional Vector of unsigned 32-bit integers
 * @extends Uint32Array
 */
class Vec4u extends Uint32Array {
    static get zero() { return new Vec4u(0, 0, 0, 0); }
    static get Zero() { return new Vec4u(0, 0, 0, 0); }
    static get ZERO() { return new Vec4u(0, 0, 0, 0); }
    static get one() { return new Vec4u(1, 1, 1, 1); }
    static get One() { return new Vec4u(1, 1, 1, 1); }
    static get ONE() { return new Vec4u(1, 1, 1, 1); }
    /**
     * Creates a vec4
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     * @param {Number} w W component, defaults to 0
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
}

/**
 * Quaternion for 3D rotations
 * @extends Vec4
 */
class Quat extends Float32Array {
    static get identity() { return new this.prototype.quat(0, 0, 0, 1); }
    static get Identity() { return new this.prototype.quat(0, 0, 0, 1); }
    static get IDENTITY() { return new this.prototype.quat(0, 0, 0, 1); }
    /**
     * Creates a new quaternion
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     * @param {Number} w W component, defaults to 1
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
    /**
     * Calculates the Hamilton product of two quaternions
     *
     * @param {QuatLike | number} b the second operand
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    multiply(b, out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        if (typeof b === 'number') {
            out[0] = this[0] * b;
            out[1] = this[1] * b;
            out[2] = this[2] * b;
            out[3] = this[3] * b;
            return out;
        }
        const ax = this[0], ay = this[1], az = this[2], aw = this[3];
        const bx = b[0], by = b[1], bz = b[2], bw = b[3];
        out[0] = ax * bw + aw * bx + ay * bz - az * by;
        out[1] = ay * bw + aw * by + az * bx - ax * bz;
        out[2] = az * bw + aw * bz + ax * by - ay * bx;
        out[3] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }
    /**
     * Creates a quaternion from the given axis and angle of rotation
     *
     * @param {Vec3Like} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static fromAxisAngle(axis, rad, out = new this.prototype.quat()) {
        rad *= 0.5;
        const s = Math.sin(rad);
        out[0] = s * axis[0];
        out[1] = s * axis[1];
        out[2] = s * axis[2];
        out[3] = Math.cos(rad);
        return out;
    }
    /**
     * Sets a quaternion to the given axis and angle of rotation
     *
     * @param {Vec3Like} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    setAxisAngle(axis, rad, out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        rad *= 0.5;
        const s = Math.sin(rad);
        out[0] = s * axis[0];
        out[1] = s * axis[1];
        out[2] = s * axis[2];
        out[3] = Math.cos(rad);
        return out;
    }
    /**
     * Gets the rotation axis and angle for a given
     *  quaternion. If a quaternion is created with
     *  setAxisAngle, this method will return the same
     *  values as providied in the original parameter list
     *  OR functionally equivalent values.
     * Example: The quaternion formed by axis [0, 0, 1] and
     *  angle -90 is the same as the quaternion formed by
     *  [0, 0, 1] and 270. This method favors the latter.
     * @param {Vec3Like} out_axis axis to return of the rotation
     * @returns {Number} angle, in radians, of the rotation
     */
    getAxisAngle(out_axis) {
        const rad = Math.acos(this[3]) * 2.0;
        const s = Math.sin(rad / 2.0);
        if (out_axis) {
            if (s > index.EPSILON) {
                out_axis[0] = this[0] / s;
                out_axis[1] = this[1] / s;
                out_axis[2] = this[2] / s;
            }
            else {
                out_axis[0] = 1;
                out_axis[1] = out_axis[2] = 0;
            }
        }
        return rad;
    }
    /**
     * Gets the angular distance between two unit quaternions
     *
     * @param {QuatLike} a Origin unit quaternion
     * @param {QuatLike} b Destination unit quaternion
     * @returns {Number} Angle, in radians, between the two quaternions
     */
    static angle(a, b) {
        const dotproduct = Quat.dot(a, b);
        return Math.acos(2 * dotproduct * dotproduct - 1);
    }
    /**
     * Rotates a quaternion by the given angle about the X axis
     *
     * @param {Number} rad angle in radians to rotate
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    rotateX(rad, out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        rad *= 0.5;
        const ax = this[0], ay = this[1], az = this[2], aw = this[3];
        const bx = Math.sin(rad), bw = Math.cos(rad);
        out[0] = ax * bw + aw * bx;
        out[1] = ay * bw + az * bx;
        out[2] = az * bw - ay * bx;
        out[3] = aw * bw - ax * bx;
        return out;
    }
    /**
     * Rotates a quaternion by the given angle about the Y axis
     *
     * @param {Number} rad angle in radians to rotate
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    rotateY(rad, out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        rad *= 0.5;
        const ax = this[0], ay = this[1], az = this[2], aw = this[3];
        const by = Math.sin(rad), bw = Math.cos(rad);
        out[0] = ax * bw - az * by;
        out[1] = ay * bw + aw * by;
        out[2] = az * bw + ax * by;
        out[3] = aw * bw - ay * by;
        return out;
    }
    /**
     * Rotates a quaternion by the given angle about the Z axis
     *
     * @param {Number} rad angle in radians to rotate
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    rotateZ(rad, out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        rad *= 0.5;
        const ax = this[0], ay = this[1], az = this[2], aw = this[3];
        const bz = Math.sin(rad), bw = Math.cos(rad);
        out[0] = ax * bw + ay * bz;
        out[1] = ay * bw - ax * bz;
        out[2] = az * bw + aw * bz;
        out[3] = aw * bw - az * bz;
        return out;
    }
    /**
     * Calculates the W component of a quaternion from the X, Y, and Z components
     *
     * @returns {Number} the W component
     */
    calculateW() {
        const x = this[0], y = this[1], z = this[2];
        return Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    }
    /**
     * Calculates the exponential of a unit quaternion
     *
     * @param {QuatLike} q the quaternion to exponentiate
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static exp(q, out = new this.prototype.quat()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const r = Math.sqrt(x * x + y * y + z * z);
        const et = Math.exp(w);
        const s = r > 0 ? (et * Math.sin(r)) / r : 0;
        out[0] = x * s;
        out[1] = y * s;
        out[2] = z * s;
        out[3] = et * Math.cos(r);
        return out;
    }
    /**
     * Calculates the exponential of the unit quaternion
     *
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    exp(out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        const r = Math.sqrt(x * x + y * y + z * z);
        const et = Math.exp(w);
        const s = r > 0 ? (et * Math.sin(r)) / r : 0;
        out[0] = x * s;
        out[1] = y * s;
        out[2] = z * s;
        out[3] = et * Math.cos(r);
        return out;
    }
    /**
     * Calculates the natural logarithm of a unit quaternion
     *
     * @param {QuatLike} q the quaternion to take the logarithm of
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static ln(q, out = new this.prototype.quat()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const r = Math.sqrt(x * x + y * y + z * z);
        const t = r > 0 ? Math.atan2(r, w) / r : 0;
        out[0] = x * t;
        out[1] = y * t;
        out[2] = z * t;
        out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
        return out;
    }
    /**
     * Calculates the natural logarithm of the unit quaternion
     *
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    ln(out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        const r = Math.sqrt(x * x + y * y + z * z);
        const t = r > 0 ? Math.atan2(r, w) / r : 0;
        out[0] = x * t;
        out[1] = y * t;
        out[2] = z * t;
        out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
        return out;
    }
    /**
     * Raises a quaternion to a scalar power
     *
     * @param {Number} b the power to raise the quaternion to
     * @returns {Quat} this
     */
    pow(b) {
        this.ln();
        this.scale(b);
        this.exp();
        return this;
    }
    /**
     * Performs a spherical linear interpolation between two quaternions
     *
     * @param {QuatLike} a the first operand
     * @param {QuatLike} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static slerp(a, b, t, out = new this.prototype.quat()) {
        let ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let bx = b[0], by = b[1], bz = b[2], bw = b[3];
        let omega, cosom, sinom, scale0, scale1;
        // calc cosine
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        // calculate coefficients
        if (1.0 - cosom > index.EPSILON) {
            // standard case (slerp)
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }
        else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;
        return out;
    }
    /**
     * Performs a spherical linear interpolation between a quaternion and b
     *
     * @param {QuatLike} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    slerp(b, t, out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        let ax = this[0], ay = this[1], az = this[2], aw = this[3];
        let bx = b[0], by = b[1], bz = b[2], bw = b[3];
        let omega, cosom, sinom, scale0, scale1;
        // calc cosine
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        // calculate coefficients
        if (1.0 - cosom > index.EPSILON) {
            // standard case (slerp)
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }
        else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;
        return out;
    }
    /**
     * Generates a random unit quaternion
     *
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static random(out = new this.prototype.quat()) {
        // Implementation of http://planning.cs.uiuc.edu/node198.html
        // TODO: Calling random 3 times is probably not the fastest solution
        let u1 = index.RANDOM();
        let u2 = index.RANDOM();
        let u3 = index.RANDOM();
        let sqrt1MinusU1 = Math.sqrt(1 - u1);
        let sqrtU1 = Math.sqrt(u1);
        out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
        out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
        out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
        out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
        return out;
    }
    /**
     * Calculates the inverse of a quaternion
     *
     * @param {QuatLike} q the source quaternion
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static invert(q, out = new this.prototype.quat()) {
        const a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3];
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;
        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return out;
    }
    /**
     * Calculates the inverse of a quaternion
     *
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    invert(out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3];
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;
        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return out;
    }
    /**
     * Calculates the conjugate of a quaternion
     *
     * @param {QuatLike} q the source quaternion
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static conjugate(q, out = new this.prototype.quat()) {
        out[0] = -q[0];
        out[1] = -q[1];
        out[2] = -q[2];
        out[3] = q[3];
        return out;
    }
    /**
     * Calculates the conjugate of a quaternion
     *
     * @param {Quat} out the receiving quaternion, defaults to new quat()
     * @returns {Quat} out
     */
    conjugate(out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        out[3] = this[3];
        return out;
    }
    /**
     * Creates a quaternion from the given 3x3 rotation matrix
     *
     * @param {Mat3} m the rotation matrix
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static fromMat3(m, out = new this.prototype.quat()) {
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        const fTrace = m[0] + m[4] + m[8];
        let fRoot;
        if (fTrace > 0.0) {
            // |w| > 1/2, may as well choose w > 1/2
            fRoot = Math.sqrt(fTrace + 1.0); // 2w
            out[3] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot; // 1/(4w)
            out[0] = (m[5] - m[7]) * fRoot;
            out[1] = (m[6] - m[2]) * fRoot;
            out[2] = (m[1] - m[3]) * fRoot;
        }
        else {
            // |w| <= 1/2
            let i = 0;
            if (m[4] > m[0])
                i = 1;
            if (m[8] > m[i * 3 + i])
                i = 2;
            let j = (i + 1) % 3;
            let k = (i + 2) % 3;
            fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
            out[i] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot;
            out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
            out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
            out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
        }
        return out;
    }
    /**
     * Creates a quaternion from the given Euler angle x, y, z using the given order
     *
     * @param {Number} x rotation around X axis in degrees
     * @param {Number} y rotation around Y axis in degrees
     * @param {Number} z rotation around Z axis in degrees
     * @param {String} order angle order, defaults to ANGLE_ORDER
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static fromEuler(x, y, z, order = index.ANGLE_ORDER, out = new this.prototype.quat()) {
        let halfToRad = Math.PI / 360;
        x *= halfToRad;
        z *= halfToRad;
        y *= halfToRad;
        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);
        switch (order) {
            case "xyz":
                out[0] = sx * cy * cz + cx * sy * sz;
                out[1] = cx * sy * cz - sx * cy * sz;
                out[2] = cx * cy * sz + sx * sy * cz;
                out[3] = cx * cy * cz - sx * sy * sz;
                break;
            case "xzy":
                out[0] = sx * cy * cz - cx * sy * sz;
                out[1] = cx * sy * cz - sx * cy * sz;
                out[2] = cx * cy * sz + sx * sy * cz;
                out[3] = cx * cy * cz + sx * sy * sz;
                break;
            case "yxz":
                out[0] = sx * cy * cz + cx * sy * sz;
                out[1] = cx * sy * cz - sx * cy * sz;
                out[2] = cx * cy * sz - sx * sy * cz;
                out[3] = cx * cy * cz + sx * sy * sz;
                break;
            case "yzx":
                out[0] = sx * cy * cz + cx * sy * sz;
                out[1] = cx * sy * cz + sx * cy * sz;
                out[2] = cx * cy * sz - sx * sy * cz;
                out[3] = cx * cy * cz - sx * sy * sz;
                break;
            case "zxy":
                out[0] = sx * cy * cz - cx * sy * sz;
                out[1] = cx * sy * cz + sx * cy * sz;
                out[2] = cx * cy * sz + sx * sy * cz;
                out[3] = cx * cy * cz - sx * sy * sz;
                break;
            case "zyx":
                out[0] = sx * cy * cz - cx * sy * sz;
                out[1] = cx * sy * cz + sx * cy * sz;
                out[2] = cx * cy * sz - sx * sy * cz;
                out[3] = cx * cy * cz + sx * sy * sz;
                break;
            default:
                throw new Error('Unknown angle order ' + order);
        }
        return out;
    }
    /**
     * Returns a string representation of a quaternion
     *
     * @returns {String} string representation of the quaternion
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`;
    }
    /**
     * Returns dot product of two quaternions
     *
     * @param {QuatLike} a the first quaternion
     * @param {QuatLike} b the second quaternion
     * @returns {Number} the dot product
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    /**
     * Returns dot product of this and other quaternion
     *
     * @param {QuatLike} b the second quaternion
     * @returns {Number} the dot product
     */
    dot(b) {
        return this[0] * b[0] + this[1] * b[1] + this[2] * b[2] + this[3] * b[3];
    }
    /**
     * Returns whether two quaternions represent the same rotation
     *
     * @param {QuatLike} b the second operand
     * @returns {Boolean} true if the quaternions represent the same rotation
     */
    equals(b) {
        return Math.abs(Quat.dot(this, b)) >= 1 - index.EPSILON;
    }
    /**
     * Sets a quaternion to represent the shortest rotation from one vector to another
     *
     * @param {Vec3Like} a the initial vector
     * @param {Vec3Like} b the destination vector
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static rotationTo(a, b, out = new this.prototype.quat()) {
        const tmpVec3 = this.prototype.tmpVec3;
        const dot = Vec3.dot(a, b);
        if (dot < -0.999999) {
            Vec3.cross(Vec3.unitX, a, tmpVec3);
            if (tmpVec3.len() < 0.000001)
                Vec3.cross(Vec3.unitY, a, tmpVec3);
            return this.fromAxisAngle(tmpVec3.normalize(), Math.PI, out);
        }
        else if (dot > 0.999999) {
            out[0] = out[1] = out[2] = 0;
            out[3] = 1;
            return out;
        }
        else {
            Vec3.cross(a, b, tmpVec3);
            out[0] = tmpVec3[0];
            out[1] = tmpVec3[1];
            out[2] = tmpVec3[2];
            out[3] = 1 + dot;
            return out.normalize(out);
        }
    }
    /**
     * Performs a spherical linear interpolation with two control points
     *
     * @param {QuatLike} a the first operand
     * @param {QuatLike} b the second operand
     * @param {QuatLike} c the third operand
     * @param {QuatLike} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static sqlerp(a, b, c, d, t, out = new this.prototype.quat()) {
        const { tmp1, tmp2 } = this.prototype;
        Quat.slerp(a, d, t, tmp1);
        Quat.slerp(b, c, t, tmp2);
        Quat.slerp(tmp1, tmp2, 2 * t * (1 - t), out);
        return out;
    }
    /**
     * Sets the specified quaternion with values corresponding to the given axes
     *
     * @param {Vec3Like} view the vector representing the viewing direction
     * @param {Vec3Like} right the vector representing the local right direction
     * @param {Vec3Like} up the vector representing the local up direction
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static setAxes(view, right, up, out = new this.prototype.quat()) {
        const { tmpMat3 } = this.prototype;
        tmpMat3[0] = right[0];
        tmpMat3[3] = right[1];
        tmpMat3[6] = right[2];
        tmpMat3[1] = up[0];
        tmpMat3[4] = up[1];
        tmpMat3[7] = up[2];
        const vs = index.LEFT_HANDED ? 1 : -1;
        tmpMat3[2] = vs * view[0];
        tmpMat3[5] = vs * view[1];
        tmpMat3[8] = vs * view[2];
        return Quat.fromMat3(tmpMat3, out).normalize();
    }
    /**
     * Normalizes a quaternion
     *
     * @param {QuatLike} q the quaternion to normalize
     * @param {Quat} out the receiving vector, defaults to new quat()
     * @returns {Quat} out
     */
    static normalize(q, out = new this.prototype.quat()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1.0 / Math.sqrt(len);
        }
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
        return out;
    }
    /**
     * Normalizes a quaternion
     *
     * @param {Quat} out the receiving vector, defaults to new quat()
     * @returns {Quat} out
     */
    normalize(out = (index.ALWAYS_COPY ? new this.quat() : this)) {
        return Quat.normalize(this, out);
    }
    /**
     * Creates a quaternion that looks along the given direction vector
     *
     * @param {Vec3Like} direction the direction to look along
     * @param {Vec3Like} up the up vector
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    static quatLookAt(direction, up, out = new this.prototype.quat()) {
        const f = new this.prototype.vec3(direction[0], direction[1], direction[2]).normalize();
        const s = Vec3.cross(f, up).normalize();
        const u = Vec3.cross(s, f);
        const m = new this.prototype.mat3();
        const vs = index.LEFT_HANDED ? 1 : -1;
        m[0] = s[0];
        m[1] = u[0];
        m[2] = vs * f[0];
        m[3] = s[1];
        m[4] = u[1];
        m[5] = vs * f[1];
        m[6] = s[2];
        m[7] = u[2];
        m[8] = vs * f[2];
        return Quat.fromMat3(m, out);
    }
    /**
     * Extracts the pitch (rotation around X axis) from a quaternion
     *
     * @returns {Number} pitch in radians
     */
    pitch() {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        return Math.atan2(2 * (y * z + w * x), w * w - x * x - y * y + z * z);
    }
    /**
     * Extracts the yaw (rotation around Y axis) from a quaternion
     *
     * @returns {Number} yaw in radians
     */
    yaw() {
        return Math.asin(Math.min(Math.max(-2 * (this[0] * this[2] - this[3] * this[1]), -1), 1));
    }
    /**
     * Extracts the roll (rotation around Z axis) from a quaternion
     *
     * @returns {Number} roll in radians
     */
    roll() {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        return Math.atan2(2 * (x * y + w * z), w * w + x * x - y * y - z * z);
    }
    /**
     * Extracts Euler angles (pitch, yaw, roll) from a quaternion
     *
     * @param {Vec3} out the receiving vector, defaults to vec3()
     * @returns {Vec3} out with [pitch, yaw, roll] in radians
     */
    eulerAngles(out = new this.vec3()) {
        out[0] = this.pitch();
        out[1] = this.yaw();
        out[2] = this.roll();
        return out;
    }
    /**
     * Converts a quaternion to a 3x3 rotation matrix
     *
     * @param {Mat3} out the receiving matrix, defaults to new Mat3()
     * @returns {Mat3} out
     */
    toMat3(out = new this.mat3()) {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = xy - wz;
        out[4] = 1 - (xx + zz);
        out[5] = yz + wx;
        out[6] = xz + wy;
        out[7] = yz - wx;
        out[8] = 1 - (xx + yy);
        return out;
    }
    /**
     * Converts a quaternion to a 4x4 rotation matrix
     *
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    toMat4(out = new this.mat4()) {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = 0;
        out[4] = xy - wz;
        out[5] = 1 - (xx + zz);
        out[6] = yz + wx;
        out[7] = 0;
        out[8] = xz + wy;
        out[9] = yz - wx;
        out[10] = 1 - (xx + yy);
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }
    /**
     * Clones values into new quaternion
     *
     * @returns {Quat} new quaternion
     */
    clone() {
        return new this.quat(this[0], this[1], this[2], this[3]);
    }
}
// @aliases
Quat.getAngle = Quat.angle;
Quat.prototype.mult = Quat.prototype.multiply;
Quat.prototype.mul = Quat.prototype.multiply;
Quat.prototype.scale = Quat.prototype.multiply;
Quat.prototype.times = Quat.prototype.multiply;
Quat.prototype.str = Quat.prototype.toString;
Quat.prototype.normalized = Quat.prototype.normalize;
/**
 * Quaternion for 3D rotations
 * @extends Float64Array
 */
class Quatd extends Float64Array {
    static get identity() { return new Quatd(0, 0, 0, 1); }
    static get Identity() { return new Quatd(0, 0, 0, 1); }
    static get IDENTITY() { return new Quatd(0, 0, 0, 1); }
    /**
     * Creates a new quaternion
     *
     * @param {Number} x X component, defaults to 0
     * @param {Number} y Y component, defaults to 0
     * @param {Number} z Z component, defaults to 0
     * @param {Number} w W component, defaults to 1
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
}

/**
 * Dual Quaternion for rigid body transformations (rotation + translation)
 * Stored as [real.x, real.y, real.z, real.w, dual.x, dual.y, dual.z, dual.w]
 * @extends Float32Array
 */
class Quat2 extends Float32Array {
    static get identity() { return new this.prototype.quat2(0, 0, 0, 1, 0, 0, 0, 0); }
    static get Identity() { return new this.prototype.quat2(0, 0, 0, 1, 0, 0, 0, 0); }
    static get IDENTITY() { return new this.prototype.quat2(0, 0, 0, 1, 0, 0, 0, 0); }
    /**
     * Creates a new dual quaternion
     *
     * @param {Number} x1 real X component, defaults to 0
     * @param {Number} y1 real Y component, defaults to 0
     * @param {Number} z1 real Z component, defaults to 0
     * @param {Number} w1 real W component, defaults to 1
     * @param {Number} x2 dual X component, defaults to 0
     * @param {Number} y2 dual Y component, defaults to 0
     * @param {Number} z2 dual Z component, defaults to 0
     * @param {Number} w2 dual W component, defaults to 0
     */
    constructor(x1 = 0, y1 = 0, z1 = 0, w1 = 1, x2 = 0, y2 = 0, z2 = 0, w2 = 0) {
        super(8);
        this[0] = x1;
        this[1] = y1;
        this[2] = z1;
        this[3] = w1;
        this[4] = x2;
        this[5] = y2;
        this[6] = z2;
        this[7] = w2;
    }
    /**
     * Get the real part as a Quat
     *
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    getReal(out = new this.quat()) {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        return out;
    }
    /**
     * Get the dual part as a Quat
     *
     * @param {Quat} out the receiving quaternion, defaults to quat()
     * @returns {Quat} out
     */
    getDual(out = new this.quat()) {
        out[0] = this[4];
        out[1] = this[5];
        out[2] = this[6];
        out[3] = this[7];
        return out;
    }
    /**
     * Set the real part from a quaternion
     *
     * @param {QuatLike} q the source quaternion
     * @returns {Quat2} this
     */
    setReal(q) {
        this[0] = q[0];
        this[1] = q[1];
        this[2] = q[2];
        this[3] = q[3];
        return this;
    }
    /**
     * Set the dual part from a quaternion
     *
     * @param {QuatLike} q the source quaternion
     * @returns {Quat2} this
     */
    setDual(q) {
        this[4] = q[0];
        this[5] = q[1];
        this[6] = q[2];
        this[7] = q[3];
        return this;
    }
    /**
     * Get the translation component
     *
     * @param {Vec3} out the receiving vector, defaults to vec3()
     * @returns {Vec3} out
     */
    getTranslation(out = new this.vec3()) {
        const ax = this[4], ay = this[5], az = this[6], aw = this[7];
        const bx = -this[0], by = -this[1], bz = -this[2], bw = this[3];
        out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
        out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
        out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        return out;
    }
    /**
     * Create from rotation quaternion and translation vector
     *
     * @param {QuatLike} q the rotation quaternion
     * @param {Vec3Like} t the translation vector
     * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
     * @returns {Quat2} out
     */
    static fromRotationTranslation(q, t, out = new this.prototype.quat2()) {
        const ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5;
        const bx = q[0], by = q[1], bz = q[2], bw = q[3];
        out[0] = bx;
        out[1] = by;
        out[2] = bz;
        out[3] = bw;
        out[4] = ax * bw + ay * bz - az * by;
        out[5] = ay * bw + az * bx - ax * bz;
        out[6] = az * bw + ax * by - ay * bx;
        out[7] = -ax * bx - ay * by - az * bz;
        return out;
    }
    /**
     * Create from translation only
     *
     * @param {Vec3Like} t the translation vector
     * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
     * @returns {Quat2} out
     */
    static fromTranslation(t, out = new this.prototype.quat2()) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = t[0] * 0.5;
        out[5] = t[1] * 0.5;
        out[6] = t[2] * 0.5;
        out[7] = 0;
        return out;
    }
    /**
     * Create from rotation only
     *
     * @param {QuatLike} q the rotation quaternion
     * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
     * @returns {Quat2} out
     */
    static fromRotation(q, out = new this.prototype.quat2()) {
        out[0] = q[0];
        out[1] = q[1];
        out[2] = q[2];
        out[3] = q[3];
        out[4] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        return out;
    }
    /**
     * Create from a 4x4 matrix
     *
     * @param {Mat4} m the source matrix
     * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
     * @returns {Quat2} out
     */
    static fromMat4(m, out = new this.prototype.quat2()) {
        const r = m.getRotation();
        const t = m.getTranslation();
        return Quat2.fromRotationTranslation(r, t, out);
    }
    /**
     * Creates a copy of this dual quaternion
     *
     * @returns {Quat2} a new dual quaternion
     */
    clone() {
        return new this.quat2(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7]);
    }
    /**
     * Multiply two dual quaternions
     *
     * @param {Quat2Like} b the second operand
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    multiply(b, out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        const ax0 = this[0], ay0 = this[1], az0 = this[2], aw0 = this[3];
        const bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7];
        const ax1 = this[4], ay1 = this[5], az1 = this[6], aw1 = this[7];
        const bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
        out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
        out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
        out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
        out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
        out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 +
            ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
        out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 +
            ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
        out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 +
            az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
        out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 +
            aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
        return out;
    }
    /**
     * Translate by a Vec3
     *
     * @param {Vec3Like} v the translation vector
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    translate(v, out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        const ax1 = this[0], ay1 = this[1], az1 = this[2], aw1 = this[3];
        const bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5;
        const ax2 = this[4], ay2 = this[5], az2 = this[6], aw2 = this[7];
        out[0] = ax1;
        out[1] = ay1;
        out[2] = az1;
        out[3] = aw1;
        out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
        out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
        out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
        out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
        return out;
    }
    /**
     * Calculates the conjugate of a dual quaternion
     *
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    conjugate(out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        out[3] = this[3];
        out[4] = -this[4];
        out[5] = -this[5];
        out[6] = -this[6];
        out[7] = this[7];
        return out;
    }
    /**
     * Calculates the inverse of a dual quaternion
     *
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    invert(out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        const sqlen = this.squaredLength();
        out[0] = -this[0] / sqlen;
        out[1] = -this[1] / sqlen;
        out[2] = -this[2] / sqlen;
        out[3] = this[3] / sqlen;
        out[4] = -this[4] / sqlen;
        out[5] = -this[5] / sqlen;
        out[6] = -this[6] / sqlen;
        out[7] = this[7] / sqlen;
        return out;
    }
    /**
     * Squared length of the real part
     *
     * @returns {Number} squared length
     */
    squaredLength() {
        const x = this[0], y = this[1], z = this[2], w = this[3];
        return x * x + y * y + z * z + w * w;
    }
    /**
     * Length of the real part
     *
     * @returns {Number} length
     */
    len() {
        return Math.sqrt(this.squaredLength());
    }
    /**
     * Normalize the dual quaternion
     *
     * @param {Quat2Like} q the quaternion to normalize
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    static normalize(q, out = new this.prototype.quat2()) {
        let magnitude = q.squaredLength();
        if (magnitude > 0) {
            magnitude = Math.sqrt(magnitude);
            const a0 = q[0] / magnitude, a1 = q[1] / magnitude;
            const a2 = q[2] / magnitude, a3 = q[3] / magnitude;
            const b0 = q[4], b1 = q[5], b2 = q[6], b3 = q[7];
            const a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
            out[0] = a0;
            out[1] = a1;
            out[2] = a2;
            out[3] = a3;
            out[4] = (b0 - a0 * a_dot_b) / magnitude;
            out[5] = (b1 - a1 * a_dot_b) / magnitude;
            out[6] = (b2 - a2 * a_dot_b) / magnitude;
            out[7] = (b3 - a3 * a_dot_b) / magnitude;
        }
        return out;
    }
    /**
     * Normalize the dual quaternion
     *
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    normalize(out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        return Quat2.normalize(this, out);
    }
    /**
     * Dot product of the real parts of two dual quaternions
     *
     * @param {Quat2Like} a the first operand
     * @param {Quat2Like} b the second operand
     * @returns {Number} dot product
     */
    static dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    /**
     * Performs a linear interpolation between two dual quaternions
     *
     * @param {Quat2Like} a the first operand
     * @param {Quat2Like} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1]
     * @param {Quat2} out the receiving dual quaternion, defaults to quat2()
     * @returns {Quat2} out
     */
    static lerp(a, b, t, out = new this.prototype.quat2()) {
        const mt = 1 - t;
        if (Quat2.dot(a, b) < 0)
            t = -t;
        out[0] = a[0] * mt + b[0] * t;
        out[1] = a[1] * mt + b[1] * t;
        out[2] = a[2] * mt + b[2] * t;
        out[3] = a[3] * mt + b[3] * t;
        out[4] = a[4] * mt + b[4] * t;
        out[5] = a[5] * mt + b[5] * t;
        out[6] = a[6] * mt + b[6] * t;
        out[7] = a[7] * mt + b[7] * t;
        return out;
    }
    /**
     * Adds two dual quaternions
     *
     * @param {Quat2Like} b the second operand
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        out[0] = this[0] + b[0];
        out[1] = this[1] + b[1];
        out[2] = this[2] + b[2];
        out[3] = this[3] + b[3];
        out[4] = this[4] + b[4];
        out[5] = this[5] + b[5];
        out[6] = this[6] + b[6];
        out[7] = this[7] + b[7];
        return out;
    }
    /**
     * Scales a dual quaternion by a scalar
     *
     * @param {Number} s the scalar to scale by
     * @param {Quat2} out the receiving dual quaternion, defaults to new quat2()
     * @returns {Quat2} out
     */
    scale(s, out = (index.ALWAYS_COPY ? new this.quat2() : this)) {
        out[0] = this[0] * s;
        out[1] = this[1] * s;
        out[2] = this[2] * s;
        out[3] = this[3] * s;
        out[4] = this[4] * s;
        out[5] = this[5] * s;
        out[6] = this[6] * s;
        out[7] = this[7] * s;
        return out;
    }
    /**
     * Returns whether two dual quaternions are approximately equal
     *
     * @param {Quat2Like} b the second operand
     * @returns {Boolean} true if the dual quaternions are approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) && equals(this[1], b[1]) &&
            equals(this[2], b[2]) && equals(this[3], b[3]) &&
            equals(this[4], b[4]) && equals(this[5], b[5]) &&
            equals(this[6], b[6]) && equals(this[7], b[7]));
    }
    /**
     * Returns whether two dual quaternions are exactly equal
     *
     * @param {Quat2Like} b the second operand
     * @returns {Boolean} true if the dual quaternions are exactly equal
     */
    exactEquals(b) {
        return (this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3] &&
            this[4] === b[4] && this[5] === b[5] && this[6] === b[6] && this[7] === b[7]);
    }
    /**
     * Returns a string representation of a dual quaternion
     *
     * @returns {String} string representation of the dual quaternion
     */
    toString() {
        const fmt = (v, suffix) => {
            if (v === 0)
                return '';
            const abs = Math.abs(v);
            const s = abs === 1 && suffix ? suffix : `${abs}${suffix}`;
            return v < 0 ? ` - ${s}` : ` + ${s}`;
        };
        const qStr = (w, x, y, z) => {
            const parts = [
                w !== 0 ? `${w}` : '',
                fmt(x, 'i'),
                fmt(y, 'j'),
                fmt(z, 'k')
            ].join('').trim().replace(/^\+ /, '') || '0';
            return parts;
        };
        const real = qStr(this[3], this[0], this[1], this[2]);
        const dual = qStr(this[7], this[4], this[5], this[6]);
        return `${this.$str}((${real}) + \u03B5(${dual}))`;
    }
}
// @aliases
Quat2.prototype.sqrLen = Quat2.prototype.squaredLength;
Quat2.prototype.normalized = Quat2.prototype.normalize;
Quat2.prototype.str = Quat2.prototype.toString;
Quat2.prototype.add = Quat2.prototype.plus;
/**
 * Dual Quaternion for rigid body transformations (rotation + translation), stored with 64 bit floats
 * Stored as [real.x, real.y, real.z, real.w, dual.x, dual.y, dual.z, dual.w]
 * @extends Float64Array
 */
class Quat2d extends Float64Array {
    static get identity() { return new Quat2d(0, 0, 0, 1, 0, 0, 0, 0); }
    static get Identity() { return new Quat2d(0, 0, 0, 1, 0, 0, 0, 0); }
    static get IDENTITY() { return new Quat2d(0, 0, 0, 1, 0, 0, 0, 0); }
    /**
     * Creates a new dual quaternion
     *
     * @param {Number} x1 real X component, defaults to 0
     * @param {Number} y1 real Y component, defaults to 0
     * @param {Number} z1 real Z component, defaults to 0
     * @param {Number} w1 real W component, defaults to 1
     * @param {Number} x2 dual X component, defaults to 0
     * @param {Number} y2 dual Y component, defaults to 0
     * @param {Number} z2 dual Z component, defaults to 0
     * @param {Number} w2 dual W component, defaults to 0
     */
    constructor(x1 = 0, y1 = 0, z1 = 0, w1 = 1, x2 = 0, y2 = 0, z2 = 0, w2 = 0) {
        super(8);
        this[0] = x1;
        this[1] = y1;
        this[2] = z1;
        this[3] = w1;
        this[4] = x2;
        this[5] = y2;
        this[6] = z2;
        this[7] = w2;
    }
}

/**
 * 2x2 Matrix in column-major order
 * @extends Float32Array
 */
class Mat2 extends Float32Array {
    static get identity() { return new this.prototype.mat2(1, 0, 0, 1); }
    static get Identity() { return new this.prototype.mat2(1, 0, 0, 1); }
    static get IDENTITY() { return new this.prototype.mat2(1, 0, 0, 1); }
    /**
     * Creates a new Mat2
     *
     * @param {Number} m00 component in column 0, row 0
     * @param {Number} m01 component in column 0, row 1
     * @param {Number} m10 component in column 1, row 0
     * @param {Number} m11 component in column 1, row 1
     */
    constructor(m00 = 0, m01 = 0, m10 = 0, m11 = 0) {
        super(4);
        this[0] = m00;
        this[1] = m01;
        this[2] = m10;
        this[3] = m11;
    }
    /**
     * Creates a new Mat2 initialized with values from a matrix
     *
     * @returns {Mat2} a new Mat2
     */
    clone() {
        return new this.mat2(this[0], this[1], this[2], this[3]);
    }
    /**
     * Transposes a mat2
     *
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    transpose(out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        if (out === this) {
            const tmp = out[1];
            out[1] = out[2];
            out[2] = tmp;
        }
        else {
            out[0] = this[0];
            out[1] = this[2];
            out[2] = this[1];
            out[3] = this[3];
        }
        return out;
    }
    /**
     * Inverts a mat2
     *
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out or null if the matrix is not invertible
     */
    invert(out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3];
        // Calculate the determinant
        let det = a0 * a3 - a2 * a1;
        if (!det)
            return null;
        det = 1.0 / det;
        out[0] = a3 * det;
        out[1] = -a1 * det;
        out[2] = -a2 * det;
        out[3] = a0 * det;
        return out;
    }
    /**
     * Calculates the adjugate of a mat2
     *
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    adjoint(out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        let a0 = this[0];
        out[0] = this[3];
        out[1] = -this[1];
        out[2] = -this[2];
        out[3] = a0;
        return out;
    }
    /**
     * Calculates the determinant of a mat2
     *
     * @returns {Number} determinant of a mat2
     */
    determinant() {
        return this[0] * this[3] - this[2] * this[1];
    }
    /**
     * Rotates a mat2 by the given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    rotate(rad, out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3];
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        return out;
    }
    /**
     * Scales a mat2 by the dimensions in the given Vec2
     *
     * @param {Vec2} v the Vec2 to scale the matrix by
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    scale(v, out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        const v0 = v[0], v1 = v[1];
        out[0] = this[0] * v0;
        out[1] = this[1] * v0;
        out[2] = this[2] * v1;
        out[3] = this[3] * v1;
        return out;
    }
    /**
     * Creates a Mat2 from a given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat2} out the receiving matrix, defaults to mat2()
     * @returns {Mat2} out
     */
    static fromRotation(rad, out = new this.prototype.mat2()) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        return out;
    }
    /**
     * Creates a Mat2 from a scaling vector
     *
     * @param {Vec2} v scaling vector
     * @param {Mat2} out the receiving matrix, defaults to mat2()
     * @returns {Mat2} out
     */
    static fromScaling(v, out = new this.prototype.mat2()) {
        out[0] = v[0];
        out[1] = out[2] = 0;
        out[3] = v[1];
        return out;
    }
    /**
     * Returns a string representation of a mat2
     *
     * @returns {String} string representation of the matrix
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`;
    }
    /**
     * Returns Frobenius norm of a mat2
     * @returns {Number} Frobenius norm
     */
    frob() {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3];
        return Math.sqrt(a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3);
    }
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing a matrix
     * @param {Mat2} L the lower triangular matrix
     * @param {Mat2} D the diagonal matrix
     * @param {Mat2} U the upper triangular matrix
     */
    LDU(L = new this.mat2(), D = new this.mat2(), U = new this.mat2()) {
        L[2] = this[2] / this[0];
        U[0] = this[0];
        U[1] = this[1];
        U[3] = this[3] - L[2] * U[1];
        return [L, D, U];
    }
    /**
     * Adds two Mat2's
     *
     * @param {Mat2Like} b the second operand
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        out[0] = this[0] + b[0];
        out[1] = this[1] + b[1];
        out[2] = this[2] + b[2];
        out[3] = this[3] + b[3];
        return out;
    }
    /**
     * Subtracts matrix b from a mat2
     *
     * @param {Mat2Like} b the second operand
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        out[0] = this[0] - b[0];
        out[1] = this[1] - b[1];
        out[2] = this[2] - b[2];
        out[3] = this[3] - b[3];
        return out;
    }
    multiply(b, out = index.ALWAYS_COPY ? new this.mat2() : this) {
        if (b instanceof Vec2)
            return b.transformMat2(this);
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = a0 * b0 + a2 * b1;
        out[1] = a1 * b0 + a3 * b1;
        out[2] = a0 * b2 + a2 * b3;
        out[3] = a1 * b2 + a3 * b3;
        return out;
    }
    /**
     * Returns whether a mat2 and another Mat2 have exactly equal components
     *
     * @param {Mat2Like} b the matrix to compare against
     * @returns {Boolean} true if the matrices are exactly equal
     */
    exactEquals(b) {
        return this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3];
    }
    /**
     * Returns whether a mat2 and another Mat2 have approximately equal components
     *
     * @param {Mat2Like} b the matrix to compare against
     * @returns {Boolean} true if the matrices are approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) && equals(this[1], b[1]) &&
            equals(this[2], b[2]) && equals(this[3], b[3]));
    }
    /**
     * Multiplies each element of a mat2 by a scalar value
     *
     * @param {Number} b amount to scale the matrix's elements by
     * @param {Mat2} out the receiving matrix, defaults to new mat2()
     * @returns {Mat2} out
     */
    scaleScalar(b, out = (index.ALWAYS_COPY ? new this.mat2() : this)) {
        out[0] = this[0] * b;
        out[1] = this[1] * b;
        out[2] = this[2] * b;
        out[3] = this[3] * b;
        return out;
    }
}
// @aliases
Mat2.prototype.add = Mat2.prototype.plus;
Mat2.prototype.sub = Mat2.prototype.minus;
Mat2.prototype.subtract = Mat2.prototype.minus;
Mat2.prototype.mul = Mat2.prototype.multiply;
Mat2.prototype.mult = Mat2.prototype.multiply;
Mat2.prototype.times = Mat2.prototype.multiply;
Mat2.prototype.multiplyScalar = Mat2.prototype.scaleScalar;
Mat2.prototype.str = Mat2.prototype.toString;
/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
class Mat2d extends Float64Array {
    static get identity() { return new Mat2d(1, 0, 0, 1); }
    static get Identity() { return new Mat2d(1, 0, 0, 1); }
    static get IDENTITY() { return new Mat2d(1, 0, 0, 1); }
    /**
     * Creates a new Mat2
     *
     * @param {Number} m00 component in column 0, row 0
     * @param {Number} m01 component in column 0, row 1
     * @param {Number} m10 component in column 1, row 0
     * @param {Number} m11 component in column 1, row 1
     */
    constructor(m00 = 0, m01 = 0, m10 = 0, m11 = 0) {
        super(4);
        this[0] = m00;
        this[1] = m01;
        this[2] = m10;
        this[3] = m11;
    }
}

/**
 * 2x3 Affine transformation matrix for 2D operations,
 * stored as 32-bit floats
 * @extends Float32Array
 */
class Mat2x3 extends Float32Array {
    static get identity() { return new this.prototype.mat2x3(1, 0, 0, 1, 0, 0); }
    static get Identity() { return new this.prototype.mat2x3(1, 0, 0, 1, 0, 0); }
    static get IDENTITY() { return new this.prototype.mat2x3(1, 0, 0, 1, 0, 0); }
    /**
     * Creates a new Mat2x3
     *
     * @param {Number} a component at index 0
     * @param {Number} b component at index 1
     * @param {Number} c component at index 2
     * @param {Number} d component at index 3
     * @param {Number} tx component at index 4
     * @param {Number} ty component at index 5
     */
    constructor(a = 0, b = 0, c = 0, d = 0, tx = 0, ty = 0) {
        super(6);
        this[0] = a;
        this[1] = b;
        this[2] = c;
        this[3] = d;
        this[4] = tx;
        this[5] = ty;
    }
    /**
     * Inverts a mat2x3
     *
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out or null if the matrix is not invertible
     */
    invert(out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        const aa = this[0], ab = this[1], ac = this[2], ad = this[3];
        const atx = this[4], aty = this[5];
        let det = aa * ad - ab * ac;
        if (!det)
            return null;
        det = 1.0 / det;
        out[0] = ad * det;
        out[1] = -ab * det;
        out[2] = -ac * det;
        out[3] = aa * det;
        out[4] = (ac * aty - ad * atx) * det;
        out[5] = (ab * atx - aa * aty) * det;
        return out;
    }
    /**
     * Calculates the determinant of a mat2x3
     *
     * @returns {Number} determinant of a mat2x3
     */
    determinant() {
        return this[0] * this[3] - this[1] * this[2];
    }
    /**
     * Rotates a mat2x3 by the given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out
     */
    rotate(rad, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5];
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        out[4] = a4;
        out[5] = a5;
        return out;
    }
    /**
     * Scales a mat2x3 by the dimensions in the given Vec2
     *
     * @param {Vec2} v the Vec2 to scale the matrix by
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out
     */
    scale(v, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5];
        const v0 = v[0], v1 = v[1];
        out[0] = a0 * v0;
        out[1] = a1 * v0;
        out[2] = a2 * v1;
        out[3] = a3 * v1;
        out[4] = a4;
        out[5] = a5;
        return out;
    }
    /**
     * Translates a mat2x3 by the dimensions in the given Vec2
     *
     * @param {Vec2} v the Vec2 to translate the matrix by
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out
     */
    translate(v, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5];
        const v0 = v[0], v1 = v[1];
        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = a0 * v0 + a2 * v1 + a4;
        out[5] = a1 * v0 + a3 * v1 + a5;
        return out;
    }
    /**
     * Creates a Mat2x3 from a given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat2x3} out the receiving matrix, defaults to mat2x3()
     * @returns {Mat2x3} out
     */
    static fromRotation(rad, out = new this.prototype.mat2x3()) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        out[4] = out[5] = 0;
        return out;
    }
    /**
     * Creates a Mat2x3 from a scaling vector
     *
     * @param {Vec2} v scaling vector
     * @param {Mat2x3} out the receiving matrix, defaults to mat2x3()
     * @returns {Mat2x3} out
     */
    static fromScaling(v, out = new this.prototype.mat2x3()) {
        out[0] = v[0];
        out[1] = out[2] = 0;
        out[3] = v[1];
        out[4] = out[5] = 0;
        return out;
    }
    /**
     * Creates a Mat2x3 from a translation vector
     *
     * @param {Vec2} v translation vector
     * @param {Mat2x3} out the receiving matrix, defaults to mat2x3()
     * @returns {Mat2x3} out
     */
    static fromTranslation(v, out = new this.prototype.mat2x3()) {
        out[0] = out[3] = 1;
        out[1] = out[2] = 0;
        out[4] = v[0];
        out[5] = v[1];
        return out;
    }
    /**
     * Returns a string representation of a mat2x3
     *
     * @returns {String} string representation of the matrix
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]},\t${this[2]}, ${this[3]},\t${this[4]}, ${this[5]})`;
    }
    /**
     * Returns Frobenius norm of a mat2x3
     *
     * @returns {Number} Frobenius norm
     */
    frob() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3] + this[4] * this[4] + this[5] * this[5] + 1);
    }
    /**
     * Adds two Mat2x3's
     *
     * @param {Mat2x3Like} b the second operand
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        out[0] = this[0] + b[0];
        out[1] = this[1] + b[1];
        out[2] = this[2] + b[2];
        out[3] = this[3] + b[3];
        out[4] = this[4] + b[4];
        out[5] = this[5] + b[5];
        return out;
    }
    /**
     * Subtracts matrix b from a mat2x3
     *
     * @param {Mat2x3Like} b the second operand
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        out[0] = this[0] - b[0];
        out[1] = this[1] - b[1];
        out[2] = this[2] - b[2];
        out[3] = this[3] - b[3];
        out[4] = this[4] - b[4];
        out[5] = this[5] - b[5];
        return out;
    }
    multiply(b, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        if (b instanceof Vec2)
            return b.transformMat2x3(this);
        const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], a4 = this[4], a5 = this[5];
        const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
        out[0] = a0 * b0 + a2 * b1;
        out[1] = a1 * b0 + a3 * b1;
        out[2] = a0 * b2 + a2 * b3;
        out[3] = a1 * b2 + a3 * b3;
        out[4] = a0 * b4 + a2 * b5 + a4;
        out[5] = a1 * b4 + a3 * b5 + a5;
        return out;
    }
    /**
     * Returns whether a mat2x3 and another Mat2x3 have approximately equal components
     *
     * @param {Mat2x3Like} b the matrix to compare against
     * @returns {Boolean} true if the matrices are approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) &&
            equals(this[3], b[3]) && equals(this[4], b[4]) && equals(this[5], b[5]));
    }
    /**
     * Returns whether a mat2x3 and another Mat2x3 have exactly equal components
     *
     * @param {Mat2x3Like} b the matrix to compare against
     * @returns {Boolean} true if the matrices are exactly equal
     */
    exactEquals(b) {
        return (this[0] === b[0] && this[1] === b[1] && this[2] === b[2] &&
            this[3] === b[3] && this[4] === b[4] && this[5] === b[5]);
    }
    /**
     * Multiplies each element of a mat2x3 by a scalar value
     *
     * @param {Number} b amount to scale the matrix's elements by
     * @param {Mat2x3} out the receiving matrix, defaults to new mat2x3()
     * @returns {Mat2x3} out
     */
    scaleScalar(b, out = (index.ALWAYS_COPY ? new this.mat2x3() : this)) {
        out[0] = this[0] * b;
        out[1] = this[1] * b;
        out[2] = this[2] * b;
        out[3] = this[3] * b;
        out[4] = this[4] * b;
        out[5] = this[5] * b;
        return out;
    }
    /**
     * Creates a new Mat2x3 initialized with values from this matrix
     *
     * @returns {Mat2x3} a new Mat2x3
     */
    clone() {
        return new this.mat2x3(this[0], this[1], this[2], this[3], this[4], this[5]);
    }
}
// @aliases
Mat2x3.prototype.add = Mat2x3.prototype.plus;
Mat2x3.prototype.sub = Mat2x3.prototype.minus;
Mat2x3.prototype.subtract = Mat2x3.prototype.minus;
Mat2x3.prototype.mul = Mat2x3.prototype.multiply;
Mat2x3.prototype.mult = Mat2x3.prototype.multiply;
Mat2x3.prototype.times = Mat2x3.prototype.multiply;
Mat2x3.prototype.str = Mat2x3.prototype.toString;
Mat2x3.prototype.multiplyScalar = Mat2x3.prototype.scaleScalar;
/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
class Mat2x3d extends Float64Array {
    static get identity() { return new Mat2x3d(1, 0, 0, 1, 0, 0); }
    static get Identity() { return new Mat2x3d(1, 0, 0, 1, 0, 0); }
    static get IDENTITY() { return new Mat2x3d(1, 0, 0, 1, 0, 0); }
    /**
     * Creates a new Mat2x3
     *
     * @param {Number} a component at index 0
     * @param {Number} b component at index 1
     * @param {Number} c component at index 2
     * @param {Number} d component at index 3
     * @param {Number} tx component at index 4
     * @param {Number} ty component at index 5
     */
    constructor(a = 0, b = 0, c = 0, d = 0, tx = 0, ty = 0) {
        super(6);
        this[0] = a;
        this[1] = b;
        this[2] = c;
        this[3] = d;
        this[4] = tx;
        this[5] = ty;
    }
}

/**
 * 3x3 Matrix in column-major order, stored as 32-bit floats
 * @extends Float32Array
 */
class Mat3 extends Float32Array {
    static get identity() { return new this.prototype.mat3(1, 0, 0, 0, 1, 0, 0, 0, 1); }
    static get Identity() { return new this.prototype.mat3(1, 0, 0, 0, 1, 0, 0, 0, 1); }
    static get IDENTITY() { return new this.prototype.mat3(1, 0, 0, 0, 1, 0, 0, 0, 1); }
    /**
     * Create a new mat3 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     */
    constructor(m00 = 0, m01 = 0, m02 = 0, m10 = 0, m11 = 0, m12 = 0, m20 = 0, m21 = 0, m22 = 0) {
        super(9);
        this[0] = m00;
        this[1] = m01;
        this[2] = m02;
        this[3] = m10;
        this[4] = m11;
        this[5] = m12;
        this[6] = m20;
        this[7] = m21;
        this[8] = m22;
    }
    /**
     * Creates a new mat3 initialized with values from a matrix
     *
     * @returns {Mat3} a new Mat3
     */
    clone() {
        return new this.mat3(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8]);
    }
    /**
     * Transposes a mat3
     *
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    transpose(out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        if (out === this) {
            const a01 = this[1], a02 = this[2], a12 = this[5];
            out[1] = this[3];
            out[2] = this[6];
            out[3] = a01;
            out[5] = this[7];
            out[6] = a02;
            out[7] = a12;
        }
        else {
            out[0] = this[0];
            out[1] = this[3];
            out[2] = this[6];
            out[3] = this[1];
            out[4] = this[4];
            out[5] = this[7];
            out[6] = this[2];
            out[7] = this[5];
            out[8] = this[8];
        }
        return out;
    }
    /**
     * Inverts a mat3
     *
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3|null} out, or null if not invertible
     */
    invert(out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        const a00 = this[0], a01 = this[1], a02 = this[2];
        const a10 = this[3], a11 = this[4], a12 = this[5];
        const a20 = this[6], a21 = this[7], a22 = this[8];
        const b01 = a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 = a21 * a10 - a11 * a20;
        let det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det)
            return null;
        det = 1.0 / det;
        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = (a12 * a01 - a02 * a11) * det;
        out[3] = b11 * det;
        out[4] = (a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;
        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = (a11 * a00 - a01 * a10) * det;
        return out;
    }
    /**
     * Calculates the adjugate of a mat3
     *
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    adjoint(out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        const a00 = this[0], a01 = this[1], a02 = this[2];
        const a10 = this[3], a11 = this[4], a12 = this[5];
        const a20 = this[6], a21 = this[7], a22 = this[8];
        out[0] = a11 * a22 - a12 * a21;
        out[1] = a02 * a21 - a01 * a22;
        out[2] = a01 * a12 - a02 * a11;
        out[3] = a12 * a20 - a10 * a22;
        out[4] = a00 * a22 - a02 * a20;
        out[5] = a02 * a10 - a00 * a12;
        out[6] = a10 * a21 - a11 * a20;
        out[7] = a01 * a20 - a00 * a21;
        out[8] = a00 * a11 - a01 * a10;
        return out;
    }
    /**
     * Calculates the determinant of this mat3
     *
     * @returns {Number} determinant of this mat3
     */
    determinant() {
        const a00 = this[0], a01 = this[1], a02 = this[2];
        const a10 = this[3], a11 = this[4], a12 = this[5];
        const a20 = this[6], a21 = this[7], a22 = this[8];
        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }
    multiply(b, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        if (b instanceof Vec2)
            return b.transformMat3(this);
        if (b instanceof Vec3)
            return b.transformMat3(this);
        const a00 = this[0], a01 = this[1], a02 = this[2];
        const a10 = this[3], a11 = this[4], a12 = this[5];
        const a20 = this[6], a21 = this[7], a22 = this[8];
        const b00 = b[0], b01 = b[1], b02 = b[2];
        const b10 = b[3], b11 = b[4], b12 = b[5];
        const b20 = b[6], b21 = b[7], b22 = b[8];
        out[0] = b00 * a00 + b01 * a10 + b02 * a20;
        out[1] = b00 * a01 + b01 * a11 + b02 * a21;
        out[2] = b00 * a02 + b01 * a12 + b02 * a22;
        out[3] = b10 * a00 + b11 * a10 + b12 * a20;
        out[4] = b10 * a01 + b11 * a11 + b12 * a21;
        out[5] = b10 * a02 + b11 * a12 + b12 * a22;
        out[6] = b20 * a00 + b21 * a10 + b22 * a20;
        out[7] = b20 * a01 + b21 * a11 + b22 * a21;
        out[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return out;
    }
    /**
     * Translates a mat3 by the given vector
     *
     * @param {Vec2} v vector to translate by
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    translate(v, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        const a00 = this[0], a01 = this[1], a02 = this[2];
        const a10 = this[3], a11 = this[4], a12 = this[5];
        const a20 = this[6], a21 = this[7], a22 = this[8];
        const x = v[0], y = v[1];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a10;
        out[4] = a11;
        out[5] = a12;
        out[6] = x * a00 + y * a10 + a20;
        out[7] = x * a01 + y * a11 + a21;
        out[8] = x * a02 + y * a12 + a22;
        return out;
    }
    /**
     * Rotates a mat3 by the given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    rotate(rad, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        const a00 = this[0], a01 = this[1], a02 = this[2];
        const a10 = this[3], a11 = this[4], a12 = this[5];
        const a20 = this[6], a21 = this[7], a22 = this[8];
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c * a00 + s * a10;
        out[1] = c * a01 + s * a11;
        out[2] = c * a02 + s * a12;
        out[3] = c * a10 - s * a00;
        out[4] = c * a11 - s * a01;
        out[5] = c * a12 - s * a02;
        out[6] = a20;
        out[7] = a21;
        out[8] = a22;
        return out;
    }
    /**
     * Scales a mat3 by the given vector
     *
     * @param {Vec2} v the vector to scale by
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    scale(v, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        const x = v[0], y = v[1];
        out[0] = x * this[0];
        out[1] = x * this[1];
        out[2] = x * this[2];
        out[3] = y * this[3];
        out[4] = y * this[4];
        out[5] = y * this[5];
        out[6] = this[6];
        out[7] = this[7];
        out[8] = this[8];
        return out;
    }
    /**
     * Creates a matrix from a translation vector
     *
     * @param {Vec2} v translation vector
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static fromTranslation(v, out = new this.prototype.mat3()) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = v[0];
        out[7] = v[1];
        out[8] = 1;
        return out;
    }
    /**
     * Creates a matrix from a given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static fromRotation(rad, out = new this.prototype.mat3()) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = 0;
        out[3] = -s;
        out[4] = c;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
    }
    /**
     * Creates a matrix from a scaling vector
     *
     * @param {Vec2} v scaling vector
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static fromScaling(v, out = new this.prototype.mat3()) {
        out[0] = v[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = v[1];
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
    }
    /**
     * Creates a mat3 from a Mat2x3
     *
     * @param {Mat2x3} a the Mat2x3 to convert
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static fromMat2x3(a, out = new this.prototype.mat3()) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = 0;
        out[3] = a[2];
        out[4] = a[3];
        out[5] = 0;
        out[6] = a[4];
        out[7] = a[5];
        out[8] = 1;
        return out;
    }
    /**
     * Calculates a mat3 from the given quaternion
     *
     * @param {Quat} q quaternion to create matrix from
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static fromQuat(q, out = new this.prototype.mat3()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, yx = y * x2, yy = y * y2;
        const zx = z * x2, zy = z * y2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        out[0] = 1 - yy - zz;
        out[3] = yx - wz;
        out[6] = zx + wy;
        out[1] = yx + wz;
        out[4] = 1 - xx - zz;
        out[7] = zy - wx;
        out[2] = zx - wy;
        out[5] = zy + wx;
        out[8] = 1 - xx - yy;
        return out;
    }
    /**
     * Calculates a mat3 normal matrix (transpose inverse) from a mat4
     *
     * @param {Mat4} a the source mat4 to derive the normal matrix from
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3|null} out, or null if not invertible
     */
    static normalFromMat4(a, out = new this.prototype.mat3()) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det)
            return null;
        det = 1.0 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        return out;
    }
    /**
     * Copies the upper-left 3x3 values of a mat4 into a mat3
     *
     * @param {Mat4} a the source mat4
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static fromMat4(a, out = new this.prototype.mat3()) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[4];
        out[4] = a[5];
        out[5] = a[6];
        out[6] = a[8];
        out[7] = a[9];
        out[8] = a[10];
        return out;
    }
    /**
     * Generates a 2D projection matrix with the given bounds
     *
     * @param {Number} width width of the projection
     * @param {Number} height height of the projection
     * @param {Mat3} out the receiving matrix, defaults to mat3()
     * @returns {Mat3} out
     */
    static projection(width, height, out = new this.prototype.mat3()) {
        out[0] = 2 / width;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = -2 / height;
        out[5] = 0;
        out[6] = -1;
        out[7] = 1;
        out[8] = 1;
        return out;
    }
    /**
     * Returns Frobenius norm of this mat3
     *
     * @returns {Number} Frobenius norm
     */
    frob() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] +
            this[3] * this[3] + this[4] * this[4] + this[5] * this[5] +
            this[6] * this[6] + this[7] * this[7] + this[8] * this[8]);
    }
    /**
     * Adds two mat3's
     *
     * @param {Mat3Like} b the second operand
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        out[0] = this[0] + b[0];
        out[1] = this[1] + b[1];
        out[2] = this[2] + b[2];
        out[3] = this[3] + b[3];
        out[4] = this[4] + b[4];
        out[5] = this[5] + b[5];
        out[6] = this[6] + b[6];
        out[7] = this[7] + b[7];
        out[8] = this[8] + b[8];
        return out;
    }
    /**
     * Subtracts matrix b from this
     *
     * @param {Mat3Like} b the second operand
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        out[0] = this[0] - b[0];
        out[1] = this[1] - b[1];
        out[2] = this[2] - b[2];
        out[3] = this[3] - b[3];
        out[4] = this[4] - b[4];
        out[5] = this[5] - b[5];
        out[6] = this[6] - b[6];
        out[7] = this[7] - b[7];
        out[8] = this[8] - b[8];
        return out;
    }
    /**
     * Multiplies each element of a mat3 by a scalar number
     *
     * @param {Number} b amount to scale the matrix's elements by
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    scaleScalar(b, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        out[0] = this[0] * b;
        out[1] = this[1] * b;
        out[2] = this[2] * b;
        out[3] = this[3] * b;
        out[4] = this[4] * b;
        out[5] = this[5] * b;
        out[6] = this[6] * b;
        out[7] = this[7] * b;
        out[8] = this[8] * b;
        return out;
    }
    /**
     * Adds two mat3's after multiplying each element of the second operand by a scalar value
     *
     * @param {Mat3Like} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @param {Mat3} out the receiving matrix, defaults to new mat3()
     * @returns {Mat3} out
     */
    multiplyScalarAndAdd(b, scale, out = (index.ALWAYS_COPY ? new this.mat3() : this)) {
        out[0] = this[0] + b[0] * scale;
        out[1] = this[1] + b[1] * scale;
        out[2] = this[2] + b[2] * scale;
        out[3] = this[3] + b[3] * scale;
        out[4] = this[4] + b[4] * scale;
        out[5] = this[5] + b[5] * scale;
        out[6] = this[6] + b[6] * scale;
        out[7] = this[7] + b[7] * scale;
        out[8] = this[8] + b[8] * scale;
        return out;
    }
    /**
     * Returns a string representation of a mat3
     *
     * @returns {String} string representation of the matrix
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]},\t${this[3]}, ${this[4]}, ${this[5]},\t${this[6]}, ${this[7]}, ${this[8]})`;
    }
    /**
     * Returns whether two mat3's have exactly equal elements
     *
     * @param {Mat3Like} b the second matrix
     * @returns {Boolean} true if the matrices are exactly equal
     */
    exactEquals(b) {
        return (this[0] === b[0] &&
            this[1] === b[1] &&
            this[2] === b[2] &&
            this[3] === b[3] &&
            this[4] === b[4] &&
            this[5] === b[5] &&
            this[6] === b[6] &&
            this[7] === b[7] &&
            this[8] === b[8]);
    }
    /**
     * Returns whether two mat3's have approximately equal elements
     *
     * @param {Mat3Like} b the second matrix
     * @returns {Boolean} true if the matrices are approximately equal
     */
    equals(b) {
        return (equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) &&
            equals(this[3], b[3]) && equals(this[4], b[4]) && equals(this[5], b[5]) &&
            equals(this[6], b[6]) && equals(this[7], b[7]) && equals(this[8], b[8]));
    }
}
// @aliases
Mat3.fromMat4x4 = Mat3.fromMat4;
Mat3.prototype.add = Mat3.prototype.plus;
Mat3.prototype.sub = Mat3.prototype.minus;
Mat3.prototype.subtract = Mat3.prototype.minus;
Mat3.prototype.mul = Mat3.prototype.multiply;
Mat3.prototype.mult = Mat3.prototype.multiply;
Mat3.prototype.times = Mat3.prototype.multiply;
Mat3.prototype.str = Mat3.prototype.toString;
Mat3.prototype.multiplyScalar = Mat3.prototype.scaleScalar;
/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
class Mat3d extends Float64Array {
    static get identity() { return new Mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1); }
    static get Identity() { return new Mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1); }
    static get IDENTITY() { return new Mat3d(1, 0, 0, 0, 1, 0, 0, 0, 1); }
    /**
     * Create a new mat3 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     */
    constructor(m00 = 0, m01 = 0, m02 = 0, m10 = 0, m11 = 0, m12 = 0, m20 = 0, m21 = 0, m22 = 0) {
        super(9);
        this[0] = m00;
        this[1] = m01;
        this[2] = m02;
        this[3] = m10;
        this[4] = m11;
        this[5] = m12;
        this[6] = m20;
        this[7] = m21;
        this[8] = m22;
    }
}

var _a;
/**
 * 4x4 Matrix in column-major order, stored as 32-bit floats
 * @extends Float32Array
 */
class Mat4 extends Float32Array {
    static get identity() { return new this.prototype.mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    static get Identity() { return new this.prototype.mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    static get IDENTITY() { return new this.prototype.mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    /**
     * Creates a new 4x4 matrix
     *
     * @param {Number} m00 component in column 0, row 0
     * @param {Number} m01 component in column 0, row 1
     * @param {Number} m02 component in column 0, row 2
     * @param {Number} m03 component in column 0, row 3
     * @param {Number} m10 component in column 1, row 0
     * @param {Number} m11 component in column 1, row 1
     * @param {Number} m12 component in column 1, row 2
     * @param {Number} m13 component in column 1, row 3
     * @param {Number} m20 component in column 2, row 0
     * @param {Number} m21 component in column 2, row 1
     * @param {Number} m22 component in column 2, row 2
     * @param {Number} m23 component in column 2, row 3
     * @param {Number} m30 component in column 3, row 0
     * @param {Number} m31 component in column 3, row 1
     * @param {Number} m32 component in column 3, row 2
     * @param {Number} m33 component in column 3, row 3
     */
    constructor(m00 = 0, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 0, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 0, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 0) {
        super(16);
        this[0] = m00;
        this[1] = m01;
        this[2] = m02;
        this[3] = m03;
        this[4] = m10;
        this[5] = m11;
        this[6] = m12;
        this[7] = m13;
        this[8] = m20;
        this[9] = m21;
        this[10] = m22;
        this[11] = m23;
        this[12] = m30;
        this[13] = m31;
        this[14] = m32;
        this[15] = m33;
    }
    /**
     * Creates a new mat4 initialized with values from a matrix
     *
     * @returns {Mat4} a new 4x4 matrix
     */
    clone() {
        return new this.mat4(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8], this[9], this[10], this[11], this[12], this[13], this[14], this[15]);
    }
    /**
     * Transposes a mat4
     *
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    transpose(out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        if (out === this) {
            const a01 = this[1], a02 = this[2], a03 = this[3];
            const a12 = this[6], a13 = this[7], a23 = this[11];
            out[1] = this[4];
            out[2] = this[8];
            out[3] = this[12];
            out[4] = a01;
            out[6] = this[9];
            out[7] = this[13];
            out[8] = a02;
            out[9] = a12;
            out[11] = this[14];
            out[12] = a03;
            out[13] = a13;
            out[14] = a23;
        }
        else {
            out[0] = this[0];
            out[1] = this[4];
            out[2] = this[8];
            out[3] = this[12];
            out[4] = this[1];
            out[5] = this[5];
            out[6] = this[9];
            out[7] = this[13];
            out[8] = this[2];
            out[9] = this[6];
            out[10] = this[10];
            out[11] = this[14];
            out[12] = this[3];
            out[13] = this[7];
            out[14] = this[11];
            out[15] = this[15];
        }
        return out;
    }
    /**
     * Inverts a mat4
     *
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    invert(out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det)
            return null;
        det = 1.0 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
    }
    /**
     * Calculates the adjugate of a mat4
     *
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    adjoint(out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        out[0] = a11 * b11 - a12 * b10 + a13 * b09;
        out[1] = a02 * b10 - a01 * b11 - a03 * b09;
        out[2] = a31 * b05 - a32 * b04 + a33 * b03;
        out[3] = a22 * b04 - a21 * b05 - a23 * b03;
        out[4] = a12 * b08 - a10 * b11 - a13 * b07;
        out[5] = a00 * b11 - a02 * b08 + a03 * b07;
        out[6] = a32 * b02 - a30 * b05 - a33 * b01;
        out[7] = a20 * b05 - a22 * b02 + a23 * b01;
        out[8] = a10 * b10 - a11 * b08 + a13 * b06;
        out[9] = a01 * b08 - a00 * b10 - a03 * b06;
        out[10] = a30 * b04 - a31 * b02 + a33 * b00;
        out[11] = a21 * b02 - a20 * b04 - a23 * b00;
        out[12] = a11 * b07 - a10 * b09 - a12 * b06;
        out[13] = a00 * b09 - a01 * b07 + a02 * b06;
        out[14] = a31 * b01 - a30 * b03 - a32 * b00;
        out[15] = a20 * b03 - a21 * b01 + a22 * b00;
        return out;
    }
    /**
     * Calculates the determinant of a mat4
     *
     * @returns {Number} determinant of a mat4
     */
    determinant() {
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];
        return ((a00 * a11 - a01 * a10) * (a22 * a33 - a23 * a32) -
            (a00 * a12 - a02 * a10) * (a21 * a33 - a23 * a31) +
            (a00 * a13 - a03 * a10) * (a21 * a32 - a22 * a31) +
            (a01 * a12 - a02 * a11) * (a20 * a33 - a23 * a30) -
            (a01 * a13 - a03 * a11) * (a20 * a32 - a22 * a30) +
            (a02 * a13 - a03 * a12) * (a20 * a31 - a21 * a30));
    }
    multiply(b, out) {
        if (isVec2Like(b))
            return b.transformMat4(this, out ?? new this.vec2());
        if (isVec3Like(b))
            return b.transformMat4(this, out ?? new this.vec3());
        if (isVec4Like(b))
            return b.transformMat4(this, out ?? new this.vec4());
        out ?? (out = index.ALWAYS_COPY ? new this.mat4() : this);
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        const a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];
        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    }
    /**
     * Translates a mat4 by the given Vec3
     *
     * @param {Vec3} v vector to translate by
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    translate(v, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const x = v[0], y = v[1], z = v[2];
        if (out === this) {
            out[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
            out[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
            out[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
            out[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
        }
        else {
            const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
            const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
            const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a03;
            out[4] = a10;
            out[5] = a11;
            out[6] = a12;
            out[7] = a13;
            out[8] = a20;
            out[9] = a21;
            out[10] = a22;
            out[11] = a23;
            out[12] = a00 * x + a10 * y + a20 * z + this[12];
            out[13] = a01 * x + a11 * y + a21 * z + this[13];
            out[14] = a02 * x + a12 * y + a22 * z + this[14];
            out[15] = a03 * x + a13 * y + a23 * z + this[15];
        }
        return out;
    }
    /**
     * Scales a mat4 by the dimensions in the given Vec3 not using vectorization
     *
     * @param {Vec3} v the Vec3 to scale the matrix by
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    scale(v, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const x = v[0], y = v[1], z = v[2];
        out[0] = this[0] * x;
        out[1] = this[1] * x;
        out[2] = this[2] * x;
        out[3] = this[3] * x;
        out[4] = this[4] * y;
        out[5] = this[5] * y;
        out[6] = this[6] * y;
        out[7] = this[7] * y;
        out[8] = this[8] * z;
        out[9] = this[9] * z;
        out[10] = this[10] * z;
        out[11] = this[11] * z;
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }
    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vec3} axis the axis to rotate around
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    rotate(rad, axis, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        let x = axis[0], y = axis[1], z = axis[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        if (len < index.EPSILON)
            return null;
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        const s = Math.sin(rad), c = Math.cos(rad), t = 1 - c;
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }
    /**
     * Rotates a mat4 by the given angle around the X axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    rotateX(rad, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const s = Math.sin(rad), c = Math.cos(rad);
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        if (out !== this) {
            out[0] = this[0];
            out[1] = this[1];
            out[2] = this[2];
            out[3] = this[3];
            out[12] = this[12];
            out[13] = this[13];
            out[14] = this[14];
            out[15] = this[15];
        }
        return out;
    }
    /**
     * Rotates a mat4 by the given angle around the Y axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    rotateY(rad, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const s = Math.sin(rad), c = Math.cos(rad);
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        if (out !== this) {
            out[4] = this[4];
            out[5] = this[5];
            out[6] = this[6];
            out[7] = this[7];
            out[12] = this[12];
            out[13] = this[13];
            out[14] = this[14];
            out[15] = this[15];
        }
        return out;
    }
    /**
     * Rotates a mat4 by the given angle around the Z axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    rotateZ(rad, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        const s = Math.sin(rad), c = Math.cos(rad);
        const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3];
        const a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        if (out !== this) {
            out[8] = this[8];
            out[9] = this[9];
            out[10] = this[10];
            out[11] = this[11];
            out[12] = this[12];
            out[13] = this[13];
            out[14] = this[14];
            out[15] = this[15];
        }
        return out;
    }
    /**
     * Returns the translation vector component of a transformation matrix
     *
     * @param {Vec3} out vector to receive the translation values, defaults to new Vec3()
     * @returns {Vec3} out
     */
    getTranslation(out = new this.vec3()) {
        out[0] = this[12];
        out[1] = this[13];
        out[2] = this[14];
        return out;
    }
    /**
     * Returns the scaling factor component of a transformation matrix
     *
     * @param {Vec3} out vector to receive the scaling factor values, defaults to new Vec3()
     * @returns {Vec3} out
     */
    getScaling(out = new this.vec3()) {
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[4], m22 = this[5], m23 = this[6];
        const m31 = this[8], m32 = this[9], m33 = this[10];
        out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
        out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
        out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
        return out;
    }
    /**
     * Returns a quaternion representing the rotational component
     *  of a transformation matrix. If a matrix is built with
     *  fromRotationTranslation, the returned quaternion will be the
     *  same as the quaternion originally supplied.
     *
     * @param {Quat} out quaternion to receive the rotation values, defaults to new Quat()
     * @returns {Quat} out
     */
    getRotation(out = new this.quat()) {
        const scaling = this.getScaling();
        const is1 = 1 / scaling[0], is2 = 1 / scaling[1], is3 = 1 / scaling[2];
        const sm11 = this[0] * is1, sm12 = this[1] * is2, sm13 = this[2] * is3;
        const sm21 = this[4] * is1, sm22 = this[5] * is2, sm23 = this[6] * is3;
        const sm31 = this[8] * is1, sm32 = this[9] * is2, sm33 = this[10] * is3;
        const trace = sm11 + sm22 + sm33;
        let S = 0;
        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out[3] = 0.25 * S;
            out[0] = (sm23 - sm32) / S;
            out[1] = (sm31 - sm13) / S;
            out[2] = (sm12 - sm21) / S;
        }
        else if (sm11 > sm22 && sm11 > sm33) {
            S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
            out[3] = (sm23 - sm32) / S;
            out[0] = 0.25 * S;
            out[1] = (sm12 + sm21) / S;
            out[2] = (sm31 + sm13) / S;
        }
        else if (sm22 > sm33) {
            S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
            out[3] = (sm31 - sm13) / S;
            out[0] = (sm12 + sm21) / S;
            out[1] = 0.25 * S;
            out[2] = (sm23 + sm32) / S;
        }
        else {
            S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
            out[3] = (sm12 - sm21) / S;
            out[0] = (sm31 + sm13) / S;
            out[1] = (sm23 + sm32) / S;
            out[2] = 0.25 * S;
        }
        return out;
    }
    /**
     * Decomposes a transformation matrix into its rotation, translation, and scale components
     *
     * @param {Quat} out_r quaternion to receive the rotation component, defaults to new Quat()
     * @param {Vec3} out_t vector to receive the translation component, defaults to new Vec3()
     * @param {Vec3} out_s vector to receive the scaling component, defaults to new Vec3()
     * @returns {Quat} out_r
     */
    decompose(out_r = new this.quat(), out_t = new this.vec3(), out_s = new this.vec3()) {
        out_t[0] = this[12];
        out_t[1] = this[13];
        out_t[2] = this[14];
        const m11 = this[0], m12 = this[1], m13 = this[2];
        const m21 = this[4], m22 = this[5], m23 = this[6];
        const m31 = this[8], m32 = this[9], m33 = this[10];
        out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
        out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
        out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
        const is1 = 1 / out_s[0], is2 = 1 / out_s[1], is3 = 1 / out_s[2];
        const sm11 = m11 * is1, sm12 = m12 * is2, sm13 = m13 * is3;
        const sm21 = m21 * is1, sm22 = m22 * is2, sm23 = m23 * is3;
        const sm31 = m31 * is1, sm32 = m32 * is2, sm33 = m33 * is3;
        const trace = sm11 + sm22 + sm33;
        let S = 0;
        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out_r[3] = 0.25 * S;
            out_r[0] = (sm23 - sm32) / S;
            out_r[1] = (sm31 - sm13) / S;
            out_r[2] = (sm12 - sm21) / S;
        }
        else if (sm11 > sm22 && sm11 > sm33) {
            S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
            out_r[3] = (sm23 - sm32) / S;
            out_r[0] = 0.25 * S;
            out_r[1] = (sm12 + sm21) / S;
            out_r[2] = (sm31 + sm13) / S;
        }
        else if (sm22 > sm33) {
            S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
            out_r[3] = (sm31 - sm13) / S;
            out_r[0] = (sm12 + sm21) / S;
            out_r[1] = 0.25 * S;
            out_r[2] = (sm23 + sm32) / S;
        }
        else {
            S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
            out_r[3] = (sm12 - sm21) / S;
            out_r[0] = (sm31 + sm13) / S;
            out_r[1] = (sm23 + sm32) / S;
            out_r[2] = 0.25 * S;
        }
        return out_r;
    }
    /**
     * Creates a matrix from a vector translation
     *
     * @param {Vec3} v translation vector
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromTranslation(v, out = new this.prototype.mat4()) {
        out[0] = out[5] = out[10] = out[15] = 1;
        out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        return out;
    }
    /**
     * Creates a matrix from a vector scaling
     *
     * @param {Vec3} v scaling vector
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromScaling(v, out = new this.prototype.mat4()) {
        out[0] = v[0];
        out[5] = v[1];
        out[10] = v[2];
        out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[11] = out[12] = out[13] = out[14] = 0;
        out[15] = 1;
        return out;
    }
    /**
     * Creates a matrix from a given angle around a given axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vec3} axis the axis to rotate around
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromRotation(rad, axis, out = new this.prototype.mat4()) {
        let x = axis[0], y = axis[1], z = axis[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        if (len < index.EPSILON)
            return null;
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        const s = Math.sin(rad), c = Math.cos(rad), t = 1 - c;
        out[0] = x * x * t + c;
        out[1] = y * x * t + z * s;
        out[2] = z * x * t - y * s;
        out[3] = 0;
        out[4] = x * y * t - z * s;
        out[5] = y * y * t + c;
        out[6] = z * y * t + x * s;
        out[7] = 0;
        out[8] = x * z * t + y * s;
        out[9] = y * z * t - x * s;
        out[10] = z * z * t + c;
        out[11] = 0;
        out[12] = out[13] = out[14] = 0;
        out[15] = 1;
        return out;
    }
    /**
     * Creates a matrix from the given angle around the X axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromXRotation(rad, out = new this.prototype.mat4()) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = 1;
        out[1] = out[2] = out[3] = out[4] = out[7] = out[8] = out[11] = out[12] = out[13] = out[14] = 0;
        out[5] = c;
        out[6] = s;
        out[9] = -s;
        out[10] = c;
        out[15] = 1;
        return out;
    }
    /**
     * Creates a matrix from the given angle around the Y axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromYRotation(rad, out = new this.prototype.mat4()) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = out[3] = out[4] = out[6] = out[7] = out[9] = out[11] = out[12] = out[13] = out[14] = 0;
        out[2] = -s;
        out[5] = out[15] = 1;
        out[8] = s;
        out[10] = c;
        return out;
    }
    /**
     * Creates a matrix from the given angle around the Z axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromZRotation(rad, out = new this.prototype.mat4()) {
        const s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[4] = -s;
        out[5] = c;
        out[2] = out[3] = out[6] = out[7] = out[8] = out[9] = out[11] = out[12] = out[13] = out[14] = 0;
        out[10] = out[15] = 1;
        return out;
    }
    /**
     * Creates a matrix from a quaternion rotation and vector translation
     *
     * @param {Quat} q rotation quaternion
     * @param {Vec3} v translation vector
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromRotationTranslation(q, v, out = new this.prototype.mat4()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = out[7] = out[11] = 0;
        out[4] = xy - wz;
        out[5] = 1 - (xx + zz);
        out[6] = yz + wx;
        out[8] = xz + wy;
        out[9] = yz - wx;
        out[10] = 1 - (xx + yy);
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
    }
    /**
     * Creates a matrix from a quaternion rotation, vector translation, and vector scale
     *
     * @param {Quat} q rotation quaternion
     * @param {Vec3} v translation vector
     * @param {Vec3} s scaling vector
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromRotationTranslationScale(q, v, s, out = new this.prototype.mat4()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = s[0], sy = s[1], sz = s[2];
        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[3] = out[7] = out[11] = 0;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
    }
    /**
     * Creates a matrix from a quaternion rotation, vector translation, vector scale, and origin
     *
     * @param {Quat} q rotation quaternion
     * @param {Vec3} v translation vector
     * @param {Vec3} s scaling vector
     * @param {Vec3} o the origin vector
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromRotationTranslationScaleOrigin(q, v, s, o, out = new this.prototype.mat4()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = s[0], sy = s[1], sz = s[2];
        const ox = o[0], oy = o[1], oz = o[2];
        const out0 = (1 - (yy + zz)) * sx;
        const out1 = (xy + wz) * sx;
        const out2 = (xz - wy) * sx;
        const out4 = (xy - wz) * sy;
        const out5 = (1 - (xx + zz)) * sy;
        const out6 = (yz + wx) * sy;
        const out8 = (xz + wy) * sz;
        const out9 = (yz - wx) * sz;
        const out10 = (1 - (xx + yy)) * sz;
        out[0] = out0;
        out[1] = out1;
        out[2] = out2;
        out[4] = out4;
        out[5] = out5;
        out[6] = out6;
        out[8] = out8;
        out[9] = out9;
        out[10] = out10;
        out[3] = out[7] = out[11] = 0;
        out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
        out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
        out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
        out[15] = 1;
        return out;
    }
    /**
     * Calculates a 4x4 matrix from the given quaternion
     *
     * @param {Quat} q quaternion to create matrix from
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static fromQuat(q, out = new this.prototype.mat4()) {
        const x = q[0], y = q[1], z = q[2], w = q[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, yx = y * x2, yy = y * y2;
        const zx = z * x2, zy = z * y2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        out[0] = 1 - yy - zz;
        out[1] = yx + wz;
        out[2] = zx - wy;
        out[4] = yx - wz;
        out[5] = 1 - xx - zz;
        out[6] = zy + wx;
        out[8] = zx + wy;
        out[9] = zy - wx;
        out[10] = 1 - xx - yy;
        out[3] = out[7] = out[11] = out[12] = out[13] = out[14] = 0;
        out[15] = 1;
        return out;
    }
    /**
     * Generates a frustum matrix with the given bounds
     *
     * @param {Number} left left bound of the frustum
     * @param {Number} right right bound of the frustum
     * @param {Number} bottom bottom bound of the frustum
     * @param {Number} top top bound of the frustum
     * @param {Number} near near bound of the frustum
     * @param {Number} far far bound of the frustum
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static frustum(left, right, bottom, top, near, far, out = new this.prototype.mat4()) {
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const nf = 1 / (near - far);
        const lh = index.LEFT_HANDED;
        out[0] = near * 2 * rl;
        out[5] = near * 2 * tb;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = lh ? -(far + near) * nf : (far + near) * nf;
        out[11] = lh ? 1 : -1;
        out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[12] = out[13] = out[15] = 0;
        out[14] = far * near * 2 * nf;
        return out;
    }
    /**
     * Generates a perspective projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
     * which matches WebGL/OpenGL's clip volume.
     *
     * @param {Number} fovy vertical field of view in radians
     * @param {Number} aspect aspect ratio, typically viewport width / height
     * @param {Number} near near bound of the frustum
     * @param {Number | null} far far bound of the frustum, can be null or Infinity
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static perspectiveNO(fovy, aspect, near, far, out = new this.prototype.mat4()) {
        const f = 1.0 / Math.tan(fovy / 2);
        const lh = index.LEFT_HANDED;
        out[0] = f / aspect;
        out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[12] = out[13] = out[15] = 0;
        out[5] = f;
        out[11] = lh ? 1 : -1;
        if (far != null && far !== Infinity) {
            const nf = 1 / (near - far);
            out[10] = lh ? -(far + near) * nf : (far + near) * nf;
            out[14] = 2 * far * near * nf;
        }
        else {
            out[10] = lh ? 1 : -1;
            out[14] = -2 * near;
        }
        return out;
    }
    /**
     * Generates a perspective projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
     * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
     *
     * @param {Number} fovy vertical field of view in radians
     * @param {Number} aspect aspect ratio, typically viewport width / height
     * @param {Number} near near bound of the frustum
     * @param {Number | null} far far bound of the frustum, can be null or Infinity
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static perspectiveZO(fovy, aspect, near, far, out = new this.prototype.mat4()) {
        const f = 1.0 / Math.tan(fovy / 2);
        const lh = index.LEFT_HANDED;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = lh ? 1 : -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;
        if (far != null && far !== Infinity) {
            const nf = 1 / (near - far);
            out[10] = lh ? -far * nf : far * nf;
            out[14] = far * near * nf;
        }
        else {
            out[10] = lh ? 1 : -1;
            out[14] = -near;
        }
        return out;
    }
    /**
     * Generates a perspective projection matrix with the given field of view
     *
     * @param {Object} fov object containing upDegrees, downDegrees, leftDegrees, rightDegrees
     * @param {Number} near near bound of the frustum
     * @param {Number} far far bound of the frustum
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static perspectiveFromFieldOfView(fov, near, far, out = new this.prototype.mat4()) {
        const upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0);
        const downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0);
        const leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0);
        const rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0);
        const xScale = 2.0 / (leftTan + rightTan);
        const yScale = 2.0 / (upTan + downTan);
        out[0] = xScale;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = yScale;
        out[6] = 0;
        out[7] = 0;
        const lh = index.LEFT_HANDED;
        out[8] = -((leftTan - rightTan) * xScale * 0.5);
        out[9] = (upTan - downTan) * yScale * 0.5;
        out[10] = lh ? -far / (near - far) : far / (near - far);
        out[11] = lh ? 1.0 : -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (far * near) / (near - far);
        out[15] = 0;
        return out;
    }
    /**
     * Generates an orthogonal projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
     * which matches WebGL/OpenGL's clip volume.
     *
     * @param {Number} left left bound of the frustum
     * @param {Number} right right bound of the frustum
     * @param {Number} bottom bottom bound of the frustum
     * @param {Number} top top bound of the frustum
     * @param {Number} near near bound of the frustum
     * @param {Number} far far bound of the frustum
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static orthoNO(left, right, bottom, top, near, far, out = new this.prototype.mat4()) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        const s = index.LEFT_HANDED ? -1 : 1;
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = s * 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    }
    /**
     * Generates an orthogonal projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
     * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
     *
     * @param {Number} left left bound of the frustum
     * @param {Number} right right bound of the frustum
     * @param {Number} bottom bottom bound of the frustum
     * @param {Number} top top bound of the frustum
     * @param {Number} near near bound of the frustum
     * @param {Number} far far bound of the frustum
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static orthoZO(left, right, bottom, top, near, far, out = new this.prototype.mat4()) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        const s = index.LEFT_HANDED ? -1 : 1;
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = s * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = near * nf;
        out[15] = 1;
        return out;
    }
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, use targetTo instead.
     *
     * @param {Vec3} eye position of the viewer
     * @param {Vec3} center point the viewer is looking at
     * @param {Vec3} up vector pointing up
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static lookAt(eye, center, up, out = new this.prototype.mat4()) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        const eyex = eye[0], eyey = eye[1], eyez = eye[2];
        const upx = up[0], upy = up[1], upz = up[2];
        const centerx = center[0], centery = center[1], centerz = center[2];
        if (eye.equals(center)) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        if (index.LEFT_HANDED) {
            z0 = centerx - eyex;
            z1 = centery - eyey;
            z2 = centerz - eyez;
        }
        else {
            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;
        }
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
        return out;
    }
    /**
     * Generates a matrix that makes something look at a given point from a given eye position
     *
     * @param {Vec3} eye position of the viewer
     * @param {Vec3} target point the viewer is looking at
     * @param {Vec3} up vector pointing up
     * @param {Mat4} out the receiving matrix, defaults to mat4()
     * @returns {Mat4} out
     */
    static targetTo(eye, target, up, out = new this.prototype.mat4()) {
        const eyex = eye[0], eyey = eye[1], eyez = eye[2];
        const upx = up[0], upy = up[1], upz = up[2];
        let z0, z1, z2;
        if (index.LEFT_HANDED) {
            z0 = target[0] - eyex;
            z1 = target[1] - eyey;
            z2 = target[2] - eyez;
        }
        else {
            z0 = eyex - target[0];
            z1 = eyey - target[1];
            z2 = eyez - target[2];
        }
        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            z0 *= len;
            z1 *= len;
            z2 *= len;
        }
        let x0 = upy * z2 - upz * z1;
        let x1 = upz * z0 - upx * z2;
        let x2 = upx * z1 - upy * z0;
        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
    }
    /**
     * Generates a perspective projection matrix with the far plane at infinity.
     * Uses clip space z range of [-1, 1].
     *
     * @param {Number} fovy Vertical field of view in radians
     * @param {Number} aspect Aspect ratio (width / height)
     * @param {Number} near Near bound of the frustum
     * @param {Mat4} out the receiving matrix, defaults to a new Mat4
     * @returns {Mat4} out
     */
    static infinitePerspective(fovy, aspect, near, out = new this.prototype.mat4()) {
        const f = 1.0 / Math.tan(fovy / 2);
        const lh = index.LEFT_HANDED;
        out[0] = f / aspect;
        out[1] = out[2] = out[3] = out[4] = out[6] = out[7] = out[8] = out[9] = out[12] = out[13] = out[15] = 0;
        out[5] = f;
        out[10] = lh ? 1 : -1;
        out[11] = lh ? 1 : -1;
        out[14] = -2 * near;
        return out;
    }
    /**
     * Projects a 3D point to window coordinates using the given model and
     * projection matrices and viewport.
     *
     * @param {Vec3} obj the 3D point to project
     * @param {Mat4} model the model matrix
     * @param {Mat4} proj the projection matrix
     * @param {Vec4} viewport the viewport as [x, y, width, height]
     * @param {Vec3} out the receiving vector, defaults to a new Vec3
     * @returns {Vec3} out
     */
    static project(obj, model, proj, viewport, out = new this.prototype.vec3()) {
        const x = obj[0], y = obj[1], z = obj[2];
        const tx = model[0] * x + model[4] * y + model[8] * z + model[12];
        const ty = model[1] * x + model[5] * y + model[9] * z + model[13];
        const tz = model[2] * x + model[6] * y + model[10] * z + model[14];
        const tw = model[3] * x + model[7] * y + model[11] * z + model[15];
        let px = proj[0] * tx + proj[4] * ty + proj[8] * tz + proj[12] * tw;
        let py = proj[1] * tx + proj[5] * ty + proj[9] * tz + proj[13] * tw;
        let pz = proj[2] * tx + proj[6] * ty + proj[10] * tz + proj[14] * tw;
        let pw = proj[3] * tx + proj[7] * ty + proj[11] * tz + proj[15] * tw;
        pw = pw || 1.0;
        px /= pw;
        py /= pw;
        pz /= pw;
        out[0] = viewport[0] + viewport[2] * (px * 0.5 + 0.5);
        out[1] = viewport[1] + viewport[3] * (py * 0.5 + 0.5);
        out[2] = pz * 0.5 + 0.5;
        return out;
    }
    /**
     * Unprojects a 2D window coordinate back to 3D world coordinates using the
     * given model and projection matrices and viewport.
     *
     * @param {Vec3} win the window coordinate [x, y, z] where z is depth (0 to 1)
     * @param {Mat4} model the model matrix
     * @param {Mat4} proj the projection matrix
     * @param {Vec4} viewport the viewport as [x, y, width, height]
     * @param {Vec3} out the receiving vector, defaults to a new Vec3
     * @returns {Vec3 | null} out, or null if the combined matrix is not invertible
     */
    static unProject(win, model, proj, viewport, out = new this.prototype.vec3()) {
        const a00 = model[0], a01 = model[1], a02 = model[2], a03 = model[3];
        const a10 = model[4], a11 = model[5], a12 = model[6], a13 = model[7];
        const a20 = model[8], a21 = model[9], a22 = model[10], a23 = model[11];
        const a30 = model[12], a31 = model[13], a32 = model[14], a33 = model[15];
        const pm = new this.prototype.mat4();
        let b0 = proj[0], b1 = proj[1], b2 = proj[2], b3 = proj[3];
        pm[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        pm[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        pm[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        pm[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = proj[4];
        b1 = proj[5];
        b2 = proj[6];
        b3 = proj[7];
        pm[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        pm[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        pm[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        pm[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = proj[8];
        b1 = proj[9];
        b2 = proj[10];
        b3 = proj[11];
        pm[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        pm[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        pm[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        pm[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = proj[12];
        b1 = proj[13];
        b2 = proj[14];
        b3 = proj[15];
        pm[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        pm[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        pm[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        pm[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        const inv = pm.invert();
        if (!inv)
            return null;
        const nx = (win[0] - viewport[0]) / viewport[2] * 2 - 1;
        const ny = (win[1] - viewport[1]) / viewport[3] * 2 - 1;
        const nz = win[2] * 2 - 1;
        let w = inv[3] * nx + inv[7] * ny + inv[11] * nz + inv[15];
        w = w || 1.0;
        out[0] = (inv[0] * nx + inv[4] * ny + inv[8] * nz + inv[12]) / w;
        out[1] = (inv[1] * nx + inv[5] * ny + inv[9] * nz + inv[13]) / w;
        out[2] = (inv[2] * nx + inv[6] * ny + inv[10] * nz + inv[14]) / w;
        return out;
    }
    /**
     * Returns Frobenius norm of a mat4
     *
     * @returns {Number} Frobenius norm
     */
    frob() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3] +
            this[4] * this[4] + this[5] * this[5] + this[6] * this[6] + this[7] * this[7] +
            this[8] * this[8] + this[9] * this[9] + this[10] * this[10] + this[11] * this[11] +
            this[12] * this[12] + this[13] * this[13] + this[14] * this[14] + this[15] * this[15]);
    }
    /**
     * Adds two mat4's
     *
     * @param {Mat4Like} b the second operand
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    plus(b, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        out[0] = this[0] + b[0];
        out[1] = this[1] + b[1];
        out[2] = this[2] + b[2];
        out[3] = this[3] + b[3];
        out[4] = this[4] + b[4];
        out[5] = this[5] + b[5];
        out[6] = this[6] + b[6];
        out[7] = this[7] + b[7];
        out[8] = this[8] + b[8];
        out[9] = this[9] + b[9];
        out[10] = this[10] + b[10];
        out[11] = this[11] + b[11];
        out[12] = this[12] + b[12];
        out[13] = this[13] + b[13];
        out[14] = this[14] + b[14];
        out[15] = this[15] + b[15];
        return out;
    }
    /**
     * Subtracts matrix b from a mat4
     *
     * @param {Mat4Like} b the second operand
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    minus(b, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        out[0] = this[0] - b[0];
        out[1] = this[1] - b[1];
        out[2] = this[2] - b[2];
        out[3] = this[3] - b[3];
        out[4] = this[4] - b[4];
        out[5] = this[5] - b[5];
        out[6] = this[6] - b[6];
        out[7] = this[7] - b[7];
        out[8] = this[8] - b[8];
        out[9] = this[9] - b[9];
        out[10] = this[10] - b[10];
        out[11] = this[11] - b[11];
        out[12] = this[12] - b[12];
        out[13] = this[13] - b[13];
        out[14] = this[14] - b[14];
        out[15] = this[15] - b[15];
        return out;
    }
    /**
     * Multiplies each element of a mat4 by a scalar number
     *
     * @param {Number} b amount to scale the matrix's elements by
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    scaleScalar(b, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        out[0] = this[0] * b;
        out[1] = this[1] * b;
        out[2] = this[2] * b;
        out[3] = this[3] * b;
        out[4] = this[4] * b;
        out[5] = this[5] * b;
        out[6] = this[6] * b;
        out[7] = this[7] * b;
        out[8] = this[8] * b;
        out[9] = this[9] * b;
        out[10] = this[10] * b;
        out[11] = this[11] * b;
        out[12] = this[12] * b;
        out[13] = this[13] * b;
        out[14] = this[14] * b;
        out[15] = this[15] * b;
        return out;
    }
    /**
     * Adds two mat4's after multiplying each element of the second operand by a scalar value
     *
     * @param {Mat4Like} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @param {Mat4} out the receiving matrix, defaults to new mat4()
     * @returns {Mat4} out
     */
    multiplyScalarAndAdd(b, scale, out = (index.ALWAYS_COPY ? new this.mat4() : this)) {
        out[0] = this[0] + b[0] * scale;
        out[1] = this[1] + b[1] * scale;
        out[2] = this[2] + b[2] * scale;
        out[3] = this[3] + b[3] * scale;
        out[4] = this[4] + b[4] * scale;
        out[5] = this[5] + b[5] * scale;
        out[6] = this[6] + b[6] * scale;
        out[7] = this[7] + b[7] * scale;
        out[8] = this[8] + b[8] * scale;
        out[9] = this[9] + b[9] * scale;
        out[10] = this[10] + b[10] * scale;
        out[11] = this[11] + b[11] * scale;
        out[12] = this[12] + b[12] * scale;
        out[13] = this[13] + b[13] * scale;
        out[14] = this[14] + b[14] * scale;
        out[15] = this[15] + b[15] * scale;
        return out;
    }
    /**
     * Returns a string representation of a mat4
     *
     * @returns {String} string representation of the matrix
     */
    toString() {
        return `${this.$str}(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]},\t${this[4]}, ${this[5]}, ${this[6]}, ${this[7]},\t${this[8]}, ${this[9]}, ${this[10]}, ${this[11]},\t${this[12]}, ${this[13]}, ${this[14]}, ${this[15]})`;
    }
    /**
     * Returns whether a mat4 and another have exactly the same elements in the same position
     *
     * @param {Mat4Like} b the matrix to compare against
     * @returns {Boolean} true if the matrices are equal, false otherwise
     */
    exactEquals(b) {
        return (this[0] === b[0] && this[1] === b[1] && this[2] === b[2] && this[3] === b[3] &&
            this[4] === b[4] && this[5] === b[5] && this[6] === b[6] && this[7] === b[7] &&
            this[8] === b[8] && this[9] === b[9] && this[10] === b[10] && this[11] === b[11] &&
            this[12] === b[12] && this[13] === b[13] && this[14] === b[14] && this[15] === b[15]);
    }
    /**
     * Returns whether a mat4 and another are approximately equal
     *
     * @param {Mat4Like} b the matrix to compare against
     * @returns {Boolean} true if the matrices are approximately equal, false otherwise
     */
    equals(b) {
        return (equals(this[0], b[0]) && equals(this[1], b[1]) && equals(this[2], b[2]) && equals(this[3], b[3]) &&
            equals(this[4], b[4]) && equals(this[5], b[5]) && equals(this[6], b[6]) && equals(this[7], b[7]) &&
            equals(this[8], b[8]) && equals(this[9], b[9]) && equals(this[10], b[10]) && equals(this[11], b[11]) &&
            equals(this[12], b[12]) && equals(this[13], b[13]) && equals(this[14], b[14]) && equals(this[15], b[15]));
    }
}
_a = Mat4;
Mat4.perspective = _a.perspectiveNO;
Mat4.ortho = _a.orthoNO;
// @aliases
Mat4.prototype.add = Mat4.prototype.plus;
Mat4.prototype.sub = Mat4.prototype.minus;
Mat4.prototype.subtract = Mat4.prototype.minus;
Mat4.prototype.mul = Mat4.prototype.multiply;
Mat4.prototype.mult = Mat4.prototype.multiply;
Mat4.prototype.times = Mat4.prototype.multiply;
Mat4.prototype.str = Mat4.prototype.toString;
Mat4.prototype.multiplyScalar = Mat4.prototype.scaleScalar;
/**
 * 2x2 Matrix in column-major order, stored as 64 bit floats
 * @extends Float64Array
 */
class Mat4d extends Float64Array {
    static get identity() { return new Mat4d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    static get Identity() { return new Mat4d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    static get IDENTITY() { return new Mat4d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
    /**
     * Creates a new 4x4 matrix
     *
     * @param {Number} m00 component in column 0, row 0
     * @param {Number} m01 component in column 0, row 1
     * @param {Number} m02 component in column 0, row 2
     * @param {Number} m03 component in column 0, row 3
     * @param {Number} m10 component in column 1, row 0
     * @param {Number} m11 component in column 1, row 1
     * @param {Number} m12 component in column 1, row 2
     * @param {Number} m13 component in column 1, row 3
     * @param {Number} m20 component in column 2, row 0
     * @param {Number} m21 component in column 2, row 1
     * @param {Number} m22 component in column 2, row 2
     * @param {Number} m23 component in column 2, row 3
     * @param {Number} m30 component in column 3, row 0
     * @param {Number} m31 component in column 3, row 1
     * @param {Number} m32 component in column 3, row 2
     * @param {Number} m33 component in column 3, row 3
     */
    constructor(m00 = 0, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 0, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 0, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 0) {
        super(16);
        this[0] = m00;
        this[1] = m01;
        this[2] = m02;
        this[3] = m03;
        this[4] = m10;
        this[5] = m11;
        this[6] = m12;
        this[7] = m13;
        this[8] = m20;
        this[9] = m21;
        this[10] = m22;
        this[11] = m23;
        this[12] = m30;
        this[13] = m31;
        this[14] = m32;
        this[15] = m33;
    }
}

function makeArr(a) {
    if (a instanceof Vec2)
        return new Vec2();
    if (a instanceof Vec3)
        return new Vec3();
    if (a instanceof Vec4)
        return new Vec4();
    if (a instanceof Mat2)
        return new Mat2();
    if (a instanceof Mat2x3)
        return new Mat2x3();
    if (a instanceof Mat3)
        return new Mat3();
    if (a instanceof Mat4)
        return new Mat4();
    if (a instanceof Quat)
        return new Quat();
    if (a instanceof Quat2)
        return new Quat2();
    if (a instanceof Float32Array)
        return new Float32Array();
    throw `unknown type`;
}
function calc1(fn, x, out) {
    if (typeof x === 'number')
        return fn(x, 0);
    const xArr = x;
    const outArr = (out && out.length === xArr.length ? out : makeArr(xArr));
    for (let i = 0; i < xArr.length; ++i)
        outArr[i] = fn(xArr[i], i);
    return outArr;
}
function radians(degrees, out) {
    return calc1(x => x / 180.0 * Math.PI, degrees, out);
}
const rad = radians;
const toRadians = radians;
function degrees(radians, out) {
    return calc1(x => x / Math.PI * 180.0, radians, out);
}
const deg = degrees;
const toDegrees = degrees;
function round(x, out) {
    return calc1(x => x >= 0 ? Math.round(x) : x % 0.5 === 0 ? Math.floor(x) : Math.round(x), x, out);
}
function clamp(x, min, max, out) {
    return calc1(x => Math.min(Math.max(x, min), max), x, out);
}
function clamp01(x, out) {
    return calc1(x => Math.min(Math.max(x, 0), 1), x, out);
}
const saturate = clamp01;
function mix(x, y, t, out) {
    if (typeof x === 'number')
        return x * (1 - t) + y * t;
    const xArr = x;
    const yArr = y;
    const outArr = (out && out.length === xArr.length ? out : makeArr(xArr));
    if (xArr.length !== yArr.length)
        throw `${xArr.length} length != ${yArr} length`;
    for (let i = 0; i < xArr.length; ++i)
        outArr[i] = xArr[i] * (1 - t) + yArr[i] * t;
    return outArr;
}
const lerp = mix;
function step(edge, x, out) {
    if (typeof x === 'number' && typeof edge === 'number')
        return x < edge ? 0 : 1;
    const xArr = x;
    const outArr = (out && out.length === xArr.length ? out : makeArr(xArr));
    if (typeof edge === 'number') {
        for (let i = 0; i < xArr.length; ++i)
            outArr[i] = xArr[i] < edge ? 0 : 1;
        return outArr;
    }
    const edgeArr = edge;
    if (xArr.length !== edgeArr.length)
        throw `${xArr.length} length != ${edgeArr} length`;
    for (let i = 0; i < xArr.length; ++i)
        outArr[i] = xArr[i] < edgeArr[i] ? 0 : 1;
    return outArr;
}
function smoothstep(edge0, edge1, x, out) {
    if (typeof edge0 === 'number' && typeof x === 'number') {
        const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }
    const aArr = edge0;
    const bArr = edge1;
    if (aArr.length !== bArr.length)
        throw `${aArr.length} length != ${bArr} length`;
    const outArr = (out && out.length === aArr.length ? out : makeArr(aArr));
    if (typeof x === 'number') {
        for (let i = 0; i < aArr.length; ++i) {
            const a = aArr[i];
            const t = clamp((x - a) / (bArr[i] - a), 0, 1);
            outArr[i] = t * t * (3 - 2 * t);
        }
        return outArr;
    }
    const xArr = x;
    if (xArr.length !== aArr.length)
        throw `${xArr.length} length != ${aArr} length`;
    for (let i = 0; i < aArr.length; ++i) {
        const a = aArr[i];
        const t = clamp((xArr[i] - a) / (bArr[i] - a), 0, 1);
        outArr[i] = t * t * (3 - 2 * t);
    }
    return outArr;
}
function fract(x, out) {
    return calc1(x => x - Math.floor(x), x, out);
}
function sign(x, out) {
    return calc1(x => x > 0 ? 1 : x < 0 ? -1 : 0, x, out);
}
function abs(x, out) {
    return calc1(x => Math.abs(x), x, out);
}

Vec2.prototype.$str = 'vec2';
Vec2.prototype.vec2 = Vec2;
Vec2.prototype.vec3 = Vec3;
Vec2.prototype.vec4 = Vec4;
const vec2 = create(Vec2, 2);
Vec3.prototype.$str = 'vec3';
Vec3.prototype.vec2 = Vec2;
Vec3.prototype.vec3 = Vec3;
Vec3.prototype.vec4 = Vec4;
const vec3 = create(Vec3, 3);
Vec4.prototype.$str = 'vec4';
Vec4.prototype.vec2 = Vec2;
Vec4.prototype.vec3 = Vec3;
Vec4.prototype.vec4 = Vec4;
const vec4 = create(Vec4, 4);
Quat.prototype.$str = 'quat';
Quat.prototype.quat = Quat;
Quat.prototype.vec3 = Vec3;
Quat.prototype.mat3 = Mat3;
Quat.prototype.mat4 = Mat4;
Quat.prototype.tmpVec3 = new Vec3();
Quat.prototype.tmp1 = new Quat();
Quat.prototype.tmp2 = new Quat();
Quat.prototype.tmpMat3 = new Mat3();
const quat = create(Quat, 4);
Quat2.prototype.$str = 'quat2';
Quat2.prototype.quat = Quat;
Quat2.prototype.quat2 = Quat2;
Quat2.prototype.vec3 = Vec3;
const quat2 = create(Quat2, 8);
Mat2.prototype.$str = 'mat2x2';
Mat2.prototype.mat2 = Mat2;
const mat2 = create(Mat2, 4);
const mat2x2 = mat2;
Mat2x3.prototype.$str = 'mat2x3';
Mat2x3.prototype.mat2x3 = Mat2x3;
const mat2x3 = create(Mat2x3, 6);
Mat3.prototype.$str = 'mat3x3';
Mat3.prototype.mat3 = Mat3;
const mat3 = create(Mat3, 9);
const mat3x3 = mat3;
Mat4.prototype.$str = 'mat4x4';
Mat4.prototype.mat4 = Mat4;
Mat4.prototype.vec2 = Vec2;
Mat4.prototype.vec3 = Vec3;
Mat4.prototype.vec4 = Vec4;
Mat4.prototype.quat = Quat;
const mat4 = create(Mat4, 16);
const mat4x4 = mat4;

copyPrototype(Vec2, Vec2d);
Vec2d.prototype.$str = 'vec2d';
Vec2d.prototype.vec2 = Vec2d;
Vec2d.prototype.vec3 = Vec3d;
Vec2d.prototype.vec4 = Vec4d;
const vec2d = create(Vec2d, 2);
const dvec2 = vec2d;
copyPrototype(Vec3, Vec3d);
Vec3d.prototype.$str = 'vec3d';
Vec3d.prototype.vec2 = Vec2d;
Vec3d.prototype.vec3 = Vec3d;
Vec3d.prototype.vec4 = Vec4d;
const vec3d = create(Vec3d, 3);
const dvec3 = vec3d;
copyPrototype(Vec4, Vec4d);
Vec4d.prototype.$str = 'vec4d';
Vec4d.prototype.vec2 = Vec2d;
Vec4d.prototype.vec3 = Vec3d;
Vec4d.prototype.vec4 = Vec4d;
const vec4d = create(Vec4d, 4);
const dvec4 = vec4d;
copyPrototype(Quat, Quatd);
Quatd.prototype.$str = 'quatd';
Quatd.prototype.quat = Quatd;
Quatd.prototype.vec3 = Vec3d;
Quatd.prototype.mat3 = Mat3d;
Quatd.prototype.mat4 = Mat4d;
Quatd.prototype.tmpVec3 = new Vec3d();
Quatd.prototype.tmp1 = new Quatd();
Quatd.prototype.tmp2 = new Quatd();
Quatd.prototype.tmpMat3 = new Mat3d();
const quatd = create(Quatd, 4);
const dquat = quatd;
copyPrototype(Quat2, Quat2d);
Quat2d.prototype.$str = 'quat2d';
Quat2d.prototype.quat = Quatd;
Quat2d.prototype.quat2 = Quat2d;
Quat2d.prototype.vec3 = Vec3d;
const quat2d = create(Quat2d, 8);
const dquat2 = quat2d;
copyPrototype(Mat2, Mat2d);
Mat2d.prototype.$str = 'mat2x2d';
Mat2d.prototype.mat2 = Mat2d;
const mat2d = create(Mat2d, 4);
const mat2x2d = mat2d;
const dmat2 = mat2d;
const dmat2x2 = mat2x2d;
copyPrototype(Mat2x3, Mat2x3d);
Mat2x3d.prototype.$str = 'mat2x3d';
Mat2x3d.prototype.mat2x3 = Mat2x3d;
const mat2x3d = create(Mat2x3d, 6);
const dmat2x3 = mat2x3d;
copyPrototype(Mat3, Mat3d);
Mat3d.prototype.$str = 'mat3x3d';
Mat3d.prototype.mat3 = Mat3d;
const mat3d = create(Mat3d, 9);
const mat3x3d = mat3d;
const dmat3 = mat3d;
const dmat3x3 = mat3d;
copyPrototype(Mat4, Mat4d);
Mat4d.prototype.$str = 'mat4x4d';
Mat4d.prototype.mat4 = Mat4d;
Mat4d.prototype.vec2 = Vec2d;
Mat4d.prototype.vec3 = Vec3d;
Mat4d.prototype.vec4 = Vec4d;
Mat4d.prototype.quat = Quatd;
const mat4d = create(Mat4d, 4);
const mat4x4d = mat4d;
const dmat4 = mat4d;
const dmat4x4 = mat4d;

copyPrototype(Vec2, Vec2i);
Vec2i.prototype.$str = 'ivec2';
Vec2i.prototype.vec2 = Vec2i;
Vec2i.prototype.vec3 = Vec3i;
Vec2i.prototype.vec4 = Vec4i;
const vec2i = create(Vec2i, 2);
const ivec2 = vec2i;
copyPrototype(Vec3, Vec3i);
Vec3i.prototype.$str = 'ivec3';
Vec3i.prototype.vec2 = Vec2i;
Vec3i.prototype.vec3 = Vec3i;
Vec3i.prototype.vec4 = Vec4i;
const vec3i = create(Vec3i, 3);
const ivec3 = vec3i;
copyPrototype(Vec4, Vec4i);
Vec4i.prototype.$str = 'ivec4';
Vec4i.prototype.vec2 = Vec2i;
Vec4i.prototype.vec3 = Vec3i;
Vec4i.prototype.vec4 = Vec4i;
const vec4i = create(Vec4i, 4);
const ivec4 = vec4i;
copyPrototype(Vec2, Vec2u);
Vec2u.prototype.$str = 'uvec2';
Vec2u.prototype.vec2 = Vec2u;
Vec2u.prototype.vec3 = Vec3u;
Vec2u.prototype.vec4 = Vec4u;
const vec2u = create(Vec2u, 2);
const uvec2 = vec2u;
copyPrototype(Vec3, Vec3u);
Vec3u.prototype.$str = 'uvec3';
Vec3u.prototype.vec2 = Vec2u;
Vec3u.prototype.vec3 = Vec3u;
Vec3u.prototype.vec4 = Vec4u;
const vec3u = create(Vec3u, 3);
const uvec3 = vec3u;
copyPrototype(Vec4, Vec4u);
Vec4u.prototype.$str = 'uvec4';
Vec4u.prototype.vec2 = Vec2u;
Vec4u.prototype.vec3 = Vec3u;
Vec4u.prototype.vec4 = Vec4u;
const vec4u = create(Vec4u, 4);
const uvec4 = vec4u;

var index = {
    EPSILON: 0.000001,
    RANDOM: Math.random,
    ANGLE_ORDER: 'zyx',
    ALWAYS_COPY: true,
    LEFT_HANDED: false
};

export { Mat2d as DMat2, Mat2d as DMat2x2, Mat2x3d as DMat2x3, Mat3d as DMat3, Mat3d as DMat3x3, Mat4d as DMat4, Mat4d as DMat4x4, Quatd as DQuat, Quat2d as DQuat2, Vec2d as DVec2, Vec3d as DVec3, Vec4d as DVec4, Vec2i as IVec2, Vec3i as IVec3, Vec4i as IVec4, Mat2, Mat2d, Mat2 as Mat2x2, Mat2x3, Mat2x3d, Mat3, Mat3d, Mat3 as Mat3x3, Mat4, Mat4d, Mat4 as Mat4x4, Quat, Quat2, Quat2d, Quatd, Vec2u as UVec2, Vec3u as UVec3, Vec4u as UVec4, Vec2, Vec2d, Vec2i, Vec2u, Vec3, Vec3d, Vec3i, Vec3u, Vec4, Vec4d, Vec4i, Vec4u, abs, clamp, clamp01, index as default, deg, degrees, dmat2, dmat2x2, dmat2x3, dmat3, dmat3x3, dmat4, dmat4x4, dquat, dquat2, dvec2, dvec3, dvec4, fract, ivec2, ivec3, ivec4, lerp, mat2, mat2d, mat2x2, mat2x2d, mat2x3, mat2x3d, mat3, mat3d, mat3x3, mat3x3d, mat4, mat4d, mat4x4, mat4x4d, mix, quat, quat2, quat2d, quatd, rad, radians, round, saturate, sign, smoothstep, step, toDegrees, toRadians, uvec2, uvec3, uvec4, vec2, vec2d, vec2i, vec2u, vec3, vec3d, vec3i, vec3u, vec4, vec4d, vec4i, vec4u };
//# sourceMappingURL=glmaths.js.map
