import { vec3, vec4, mat4 } from '../dist/esm/glmaths.js';
// --- WebGL setup ---
const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl');
function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
}
resize();
addEventListener('resize', resize);
// --- Shaders ---
const vsSource = `
  attribute vec3 aPos;
  attribute vec3 aColor;
  uniform mat4 uProj;
  uniform mat4 uView;
  uniform mat4 uModel;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_Position = uProj * uView * uModel * vec4(aPos, 1.0);
  }
`;
const fsSource = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;
function compileShader(src, type) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s));
    return s;
}
const prog = gl.createProgram();
gl.attachShader(prog, compileShader(vsSource, gl.VERTEX_SHADER));
gl.attachShader(prog, compileShader(fsSource, gl.FRAGMENT_SHADER));
gl.linkProgram(prog);
gl.useProgram(prog);
const aPos = gl.getAttribLocation(prog, 'aPos');
const aColor = gl.getAttribLocation(prog, 'aColor');
const uProj = gl.getUniformLocation(prog, 'uProj');
const uView = gl.getUniformLocation(prog, 'uView');
const uModel = gl.getUniformLocation(prog, 'uModel');
// --- Cube geometry ---
const S = 0.5;
const positions = [
    -S, -S, -S, S, -S, -S, S, S, -S, -S, S, -S,
    -S, -S, S, S, -S, S, S, S, S, -S, S, S,
];
const colors = [
    1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0,
    1, 0, 1, 0, 1, 1, 1, 1, 1, 0.5, 0.5, 0,
];
const indices = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    0, 4, 7, 0, 7, 3,
    1, 5, 6, 1, 6, 2,
    3, 2, 6, 3, 6, 7,
    0, 1, 5, 0, 5, 4,
];
const posBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
const colBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
const idxBuf = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.07, 0.07, 0.1, 1);
// --- Matrices ---
const proj = mat4.perspective(Math.PI / 4, canvas.width / canvas.height, 0.1, 100);
const view = mat4.lookAt(vec3(0, 2, 5), vec3(0), vec3(0, 1, 0));
let model = mat4.identity;
const invProjView = mat4();
// --- Mouse tracking ---
let mouseX = 0, mouseY = 0;
addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
// Unproject screen coords to world ray using (proj * view)^-1
function screenToRay(sx, sy) {
    const ndcX = (sx / innerWidth) * 2 - 1;
    const ndcY = 1 - (sy / innerHeight) * 2;
    (proj.times(view)).invert(invProjView);
    const nearW = invProjView.times(vec4(ndcX, ndcY, -1, 1));
    const farW = invProjView.times(vec4(ndcX, ndcY, 1, 1));
    const nearPt = nearW.xyz.div(nearW.w);
    const farPt = farW.xyz.div(farW.w);
    const dir = (farPt.minus(nearPt)).normalized();
    return { origin: nearPt, dir };
}
// --- Render loop ---
const info = document.getElementById('info');
let lastT = performance.now();
function frame(now) {
    requestAnimationFrame(frame);
    const dt = (now - lastT) / 1000;
    lastT = now;
    mat4.perspective(Math.PI / 4, canvas.width / canvas.height, 0.1, 100, proj);
    model = model.times(mat4.fromYRotation(dt * 0.7));
    model = model.times(mat4.fromXRotation(dt * 0.42));
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.uniformMatrix4fv(uProj, false, proj);
    gl.uniformMatrix4fv(uView, false, view);
    gl.uniformMatrix4fv(uModel, false, model);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    const ray = screenToRay(mouseX, mouseY);
    info.textContent =
        `ray origin: ${ray.origin.x.toFixed(2)}, ${ray.origin.y.toFixed(2)}, ${ray.origin.z.toFixed(2)}\n` +
            `ray dir:    ${ray.dir.x.toFixed(2)}, ${ray.dir.y.toFixed(2)}, ${ray.dir.z.toFixed(2)}`;
}
requestAnimationFrame(frame);
