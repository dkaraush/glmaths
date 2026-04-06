const Benchmark = require('benchmark')

// Benchmark.options.maxTime = 0.1;
// Benchmark.options.minSamples = 1;

const glm = require('gl-matrix/gl-matrix-min.js');
const glmaths = require('./dist/cjs/glmaths.min.js');

// we expect user fully utilizing the library
glmaths.ALWAYS_COPY = false

// apparantely, this makes v8 jit load up glmaths.Vec3 in advance
// initialization is def slower than gl-matrix, if it affects the benchmark that much
class Vec2Extended extends glmaths.Vec2 { constructor() { super() } } 
class Vec3Extended extends glmaths.Vec3 { constructor() { super() } } 
class Vec4Extended extends glmaths.Vec4 { constructor() { super() } } 

const allResults = []

function formatOps(hz) {
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(1)}B`
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(1)}M`
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(1)}K`
  return `${hz.toFixed(0)}`
}

function runSuite(suite) {
  return new Promise(resolve => {
    suite
      .on('cycle', e => console.log('  ' + String(e.target)))
      .on('complete', function () {
        const fastest = this.filter('fastest').map('name');
        console.log('  → Fastest: ' + fastest.join(', '));

        const benchmarks = Array.from(this)
        const glmEntry = benchmarks.find(b => b.name.startsWith('gl-matrix'))
        const glmathsEntry = benchmarks.find(b => b.name.startsWith('glmaths'))

        if (glmEntry || glmathsEntry) {
          const row = { name: this.name }
          if (glmEntry) {
            row.glmOps = glmEntry.hz
            row.glmRme = glmEntry.stats.rme
          }
          if (glmathsEntry) {
            row.glmathsOps = glmathsEntry.hz
            row.glmathsRme = glmathsEntry.stats.rme
          }
          if (glmEntry && glmathsEntry) {
            const pct = ((glmathsEntry.hz - glmEntry.hz) / glmEntry.hz) * 100
            row.diff = pct
          }
          allResults.push(row)
        }

        if (!glmEntry && benchmarks.length > 1) {
        
        } else if (!glmEntry && !glmathsEntry) {
          for (const b of benchmarks) {
            allResults.push({
              name: `${this.name}: ${b.name}`,
              glmathsOps: b.hz,
              glmathsRme: b.stats.rme
            })
          }
        }

        resolve();
      })
      .run({ async: true });
  });
}

function printMarkdownTable() {
  console.log('\n')
  console.log('## Benchmark Results\n')
  console.log('| Operation | gl-matrix | glmaths | Diff |')
  console.log('|:---|---:|---:|---:|')

  for (const r of allResults) {
    const glmCol = r.glmOps
      ? `${formatOps(r.glmOps)} ops/s ±${r.glmRme.toFixed(1)}%`
      : '—'
    const glmathsCol = r.glmathsOps
      ? `${formatOps(r.glmathsOps)} ops/s ±${r.glmathsRme.toFixed(1)}%`
      : '—'
    let diffCol = '—'
    if (r.diff !== undefined) {
      const sign = r.diff >= 0 ? '+' : ''
      const bold = Math.abs(r.diff) > 10
      const text = `${sign}${r.diff.toFixed(0)}%`
      diffCol = bold ? `**${text}**` : text
    }
    console.log(`| ${r.name} | ${glmCol} | ${glmathsCol} | ${diffCol} |`)
  }

  console.log('')
}

// ─────────────────────────────────────────────
// Vec3 benchmarks
// ─────────────────────────────────────────────
function vec3Benchmarks() {
  
  const s1 = new Benchmark.Suite('Vec3 creation');
  s1.add('gl-matrix  vec3.fromValues(1, 2, 3)', () => {
    const v = glm.vec3.fromValues(1, 2, 3);
  });
  s1.add('gl-matrix  vec3.create() vec3.set(1, 2, 3)', () => {
    const v = glm.vec3.create()
    glm.vec3.set(v, 1, 2, 3)
  });
  s1.add('glmaths  vec3(1,2,3)', () => {
    const v = glmaths.vec3(1, 2, 3);
  });
  // s1.add('glmaths  new Vec3(1,2,3)', () => {
  //   const v = new glmaths.Vec3(1, 2, 3);
  // });

  
  const a1 = glm.vec3.fromValues(1, 2, 3);
  const b1 = glm.vec3.fromValues(4, 5, 6);
  const out1 = glm.vec3.create();
  const a2 = new glmaths.Vec3(1, 2, 3);
  const b2 = new glmaths.Vec3(4, 5, 6);
  const out2 = new glmaths.Vec3();

  const s2 = new Benchmark.Suite('Vec3 add');
  s2.add('gl-matrix  vec3.add(out, a, b)', () => {
    glm.vec3.add(out1, a1, b1);
  });
  s2.add('gl-matrix  vec3.add(a, a, b)', () => {
    glm.vec3.add(a1, a1, b1);
  });
  s2.add('glmaths  a.add(b, out)', () => {
    a2.add(b2, out2);
  });
  s2.add('glmaths  a.add(b) [in-place]', () => {
    a2.add(b2);
  });

  
  const s3 = new Benchmark.Suite('Vec3 dot');
  s3.add('gl-matrix  vec3.dot(a, b)', () => {
    glm.vec3.dot(out1, a1, b1);
  });
  s3.add('glmaths  vec3.dot(b)', () => {
    glmaths.vec3.dot(out2, a2, b2);
  });

  
  const crossOut1 = glm.vec3.create();
  const crossOut2 = new glmaths.Vec3();
  const s4 = new Benchmark.Suite('Vec3 cross');
  s4.add('gl-matrix  vec3.cross(out, a, b)', () => {
    glm.vec3.cross(crossOut1, a1, b1);
  });
  s4.add('glmaths  Vec3.cross(a, b, out)', () => {
    glmaths.Vec3.cross(a2, b2, crossOut2);
  });

  
  const normA1 = glm.vec3.fromValues(3, 4, 5);
  const normOut1 = glm.vec3.create();
  const normA2 = new glmaths.Vec3(3, 4, 5);
  const normOut2 = new glmaths.Vec3();
  const s5 = new Benchmark.Suite('Vec3 normalize');
  s5.add('gl-matrix  vec3.normalize(out, a)', () => {
    glm.vec3.normalize(normOut1, normA1);
  });
  s5.add('glmaths  a.normalize(out)', () => {
    normA2.normalize(normOut2);
  });

  
  const s6 = new Benchmark.Suite('Vec3 scale');
  s6.add('gl-matrix  vec3.scale(out, a, 2.5)', () => {
    glm.vec3.scale(out1, a1, 2.5);
  });
  s6.add('glmaths  a.scale(2.5, out)', () => {
    a2.scale(2.5, out2);
  });

  
  const s7 = new Benchmark.Suite('Vec3 length');
  s7.add('gl-matrix  vec3.length(a)', () => {
    glm.vec3.length(a1);
  });
  s7.add('glmaths  a.len()', () => {
    a2.len();
  });

  
  const s8 = new Benchmark.Suite('Vec3 distance');
  s8.add('gl-matrix  vec3.distance(a, b)', () => {
    glm.vec3.distance(a1, b1);
  });
  s8.add('glmaths  Vec3.distance(a, b)', () => {
    const c = glmaths.Vec3.distance(a2, b2);
  });

  
  const lerpOut1 = glm.vec3.create();
  const lerpOut2 = new glmaths.Vec3();
  const s9 = new Benchmark.Suite('Vec3 lerp');
  s9.add('gl-matrix  vec3.lerp(out, a, b, 0.5)', () => {
    glm.vec3.lerp(lerpOut1, a1, b1, 0.5);
  });
  s9.add('glmaths  Vec3.lerp(a, b, 0.5, out)', () => {
    const c = glmaths.Vec3.lerp(a2, b2, 0.5, lerpOut2);
  });

  return runSuite(s1)
    .then(() => runSuite(s2))
    .then(() => runSuite(s3))
    .then(() => runSuite(s4))
    .then(() => runSuite(s5))
    .then(() => runSuite(s6))
    .then(() => runSuite(s7))
    .then(() => runSuite(s8))
    .then(() => runSuite(s9));
}

// ─────────────────────────────────────────────
// Vec2 benchmarks
// ─────────────────────────────────────────────
function vec2Benchmarks() {
  
  const s1 = new Benchmark.Suite('Vec2 creation');
  s1.add('gl-matrix  vec2.fromValues(1, 2)', () => {
    const v = glm.vec2.fromValues(1, 2);
  });
  s1.add('gl-matrix  v=vec2.create() vec2.set(v, 1, 2)', () => {
    const v = glm.vec2.create()
    glm.vec2.set(v, 1, 2)
  });
  s1.add('glmaths  vec2(1,2)', () => {
    const v = glmaths.vec2(1, 2);
  });
  // s1.add('glmaths  new Vec2(1,2)', () => {
  //   const v = new glmaths.Vec2(1, 2);
  // });

  const a1 = glm.vec2.fromValues(3, 7);
  const b1 = glm.vec2.fromValues(1, 4);
  const out1 = glm.vec2.create();
  const a2 = new glmaths.Vec2(3, 7);
  const b2 = new glmaths.Vec2(1, 4);
  const out2 = new glmaths.Vec2();

  
  const s2 = new Benchmark.Suite('Vec2 add');
  s2.add('gl-matrix  vec2.add(out, a, b)', () => {
    glm.vec2.add(out1, a1, b1);
  });
  s2.add('glmaths  a.add(b, out)', () => {
    a2.add(b2, out2);
  });

  
  const normOut1 = glm.vec2.create();
  const normOut2 = new glmaths.Vec2();
  const s3 = new Benchmark.Suite('Vec2 normalize');
  s3.add('gl-matrix  vec2.normalize(out, a)', () => {
    glm.vec2.normalize(normOut1, a1);
  });
  s3.add('glmaths  a.normalize(out)', () => {
    a2.normalize(normOut2);
  });

  return runSuite(s1).then(() => runSuite(s2));
}

// ─────────────────────────────────────────────
// Vec4 benchmarks
// ─────────────────────────────────────────────
function vec4Benchmarks() {
  const a1 = glm.vec4.fromValues(1, 2, 3, 4);
  const b1 = glm.vec4.fromValues(5, 6, 7, 8);
  const out1 = glm.vec4.create();
  const a2 = new glmaths.Vec4(1, 2, 3, 4);
  const b2 = new glmaths.Vec4(5, 6, 7, 8);
  const out2 = new glmaths.Vec4();

  
  const s1 = new Benchmark.Suite('Vec4 add');
  s1.add('gl-matrix  vec4.add(out, a, b)', () => {
    glm.vec4.add(out1, a1, b1);
  });
  s1.add('glmaths  a.add(b, out)', () => {
    a2.add(b2, out2);
  });

  
  const normOut1 = glm.vec4.create();
  const normOut2 = new glmaths.Vec4();
  const s2 = new Benchmark.Suite('Vec4 normalize');
  s2.add('gl-matrix  vec4.normalize(out, a)', () => {
    glm.vec4.normalize(normOut1, a1);
  });
  s2.add('glmaths  a.normalize(out)', () => {
    a2.normalize(normOut2);
  });

  return runSuite(s1).then(() => runSuite(s2));
}

// ─────────────────────────────────────────────
// Mat4 benchmarks
// ─────────────────────────────────────────────
function mat4Benchmarks() {
  
  const s1 = new Benchmark.Suite('Mat4 creation');
  s1.add('gl-matrix  mat4.create()', () => {
    glm.mat4.create();
  });
  s1.add('glmaths  mat4()', () => {
    glmaths.mat4();
  });
  s1.add('glmaths  new Mat4()', () => {
    new glmaths.Mat4();
  });

  
  const ma1 = glm.mat4.create(); glm.mat4.fromRotation(ma1, 0.5, [0, 1, 0]);
  const mb1 = glm.mat4.create(); glm.mat4.fromTranslation(mb1, [1, 2, 3]);
  const mout1 = glm.mat4.create();

  const ma2 = glmaths.Mat4.fromRotation(0.5, new glmaths.Vec3(0, 1, 0));
  const mb2 = glmaths.Mat4.fromTranslation(new glmaths.Vec3(1, 2, 3));
  const mout2 = new glmaths.Mat4();

  const s2 = new Benchmark.Suite('Mat4 multiply');
  s2.add('gl-matrix  mat4.multiply(out, a, b)', () => {
    glm.mat4.multiply(mout1, ma1, mb1);
  });
  s2.add('glmaths  a.multiply(b, out)', () => {
    ma2.multiply(mb2, mout2);
  });

  
  const invOut1 = glm.mat4.create();
  const invOut2 = new glmaths.Mat4();
  const s3 = new Benchmark.Suite('Mat4 invert');
  s3.add('gl-matrix  mat4.invert(out, a)', () => {
    glm.mat4.invert(invOut1, ma1);
  });
  s3.add('glmaths  a.invert(out)', () => {
    ma2.invert(invOut2);
  });

  
  const trOut1 = glm.mat4.create();
  const trOut2 = new glmaths.Mat4();
  const s4 = new Benchmark.Suite('Mat4 transpose');
  s4.add('gl-matrix  mat4.transpose(out, a)', () => {
    glm.mat4.transpose(trOut1, ma1);
  });
  s4.add('glmaths  a.transpose(out)', () => {
    ma2.transpose(trOut2);
  });

  
  const tv = [1, 2, 3];
  const tv2 = new glmaths.Vec3(1, 2, 3);
  const tlOut1 = glm.mat4.create();
  const tlOut2 = new glmaths.Mat4();
  const s5 = new Benchmark.Suite('Mat4 translate');
  s5.add('gl-matrix  mat4.translate(out, a, v)', () => {
    glm.mat4.translate(tlOut1, ma1, tv);
  });
  s5.add('glmaths  a.translate(v, out)', () => {
    ma2.translate(tv2, tlOut2);
  });

  
  const sv = [2, 2, 2];
  const sv2 = new glmaths.Vec3(2, 2, 2);
  const scOut1 = glm.mat4.create();
  const scOut2 = new glmaths.Mat4();
  const s6 = new Benchmark.Suite('Mat4 scale');
  s6.add('gl-matrix  mat4.scale(out, a, v)', () => {
    glm.mat4.scale(scOut1, ma1, sv);
  });
  s6.add('glmaths  a.scale(v, out)', () => {
    ma2.scale(sv2, scOut2);
  });

  
  const rxOut1 = glm.mat4.create();
  const rxOut2 = new glmaths.Mat4();
  const s7 = new Benchmark.Suite('Mat4 rotateX');
  s7.add('gl-matrix  mat4.rotateX(out, a, rad)', () => {
    glm.mat4.rotateX(rxOut1, ma1, 0.7);
  });
  s7.add('glmaths  a.rotateX(rad, out)', () => {
    ma2.rotateX(0.7, rxOut2);
  });

  
  const s8 = new Benchmark.Suite('Mat4 determinant');
  s8.add('gl-matrix  mat4.determinant(a)', () => {
    glm.mat4.determinant(ma1);
  });
  s8.add('glmaths  a.determinant()', () => {
    ma2.determinant();
  });

  
  const pOut1 = glm.mat4.create();
  const pOut2 = new glmaths.Mat4();
  const s9 = new Benchmark.Suite('Mat4 perspective');
  s9.add('gl-matrix  mat4.perspective(out, fov, asp, near, far)', () => {
    glm.mat4.perspective(pOut1, Math.PI / 4, 16 / 9, 0.1, 1000);
  });
  s9.add('glmaths  Mat4.perspective(fov, asp, near, far, out)', () => {
    glmaths.Mat4.perspective(Math.PI / 4, 16 / 9, 0.1, 1000, pOut2);
  });

  
  const eye = [0, 5, 10];
  const center = [0, 0, 0];
  const up = [0, 1, 0];
  const eye2 = new glmaths.Vec3(0, 5, 10);
  const center2 = new glmaths.Vec3(0, 0, 0);
  const up2 = new glmaths.Vec3(0, 1, 0);
  const laOut1 = glm.mat4.create();
  const laOut2 = new glmaths.Mat4();
  const s10 = new Benchmark.Suite('Mat4 lookAt');
  s10.add('gl-matrix  mat4.lookAt(out, eye, center, up)', () => {
    glm.mat4.lookAt(laOut1, eye, center, up);
  });
  s10.add('glmaths  Mat4.lookAt(eye, center, up, out)', () => {
    glmaths.Mat4.lookAt(eye2, center2, up2, laOut2);
  });

  return runSuite(s1)
    .then(() => runSuite(s2))
    .then(() => runSuite(s3))
    .then(() => runSuite(s4))
    .then(() => runSuite(s5))
    .then(() => runSuite(s6))
    .then(() => runSuite(s7))
    .then(() => runSuite(s8))
    .then(() => runSuite(s9))
    .then(() => runSuite(s10));
}

// ─────────────────────────────────────────────
// Mat3 benchmarks
// ─────────────────────────────────────────────
function mat3Benchmarks() {
  const ma1 = glm.mat3.create();
  glm.mat3.fromRotation(ma1, 0.5);
  const mb1 = glm.mat3.create();
  glm.mat3.fromRotation(mb1, 1.2);
  const mout1 = glm.mat3.create();

  const ma2 = glmaths.Mat3.fromRotation(0.5);
  const mb2 = glmaths.Mat3.fromRotation(1.2);
  const mout2 = new glmaths.Mat3();

  
  const s1 = new Benchmark.Suite('Mat3 multiply');
  s1.add('gl-matrix  mat3.multiply(out, a, b)', () => {
    glm.mat3.multiply(mout1, ma1, mb1);
  });
  s1.add('glmaths  a.multiply(b, out)', () => {
    ma2.multiply(mb2, mout2);
  });

  
  const invOut1 = glm.mat3.create();
  const invOut2 = new glmaths.Mat3();
  const s2 = new Benchmark.Suite('Mat3 invert');
  s2.add('gl-matrix  mat3.invert(out, a)', () => {
    glm.mat3.invert(invOut1, ma1);
  });
  s2.add('glmaths  a.invert(out)', () => {
    ma2.invert(invOut2);
  });

  return runSuite(s1).then(() => runSuite(s2));
}

// ─────────────────────────────────────────────
// Quat benchmarks
// ─────────────────────────────────────────────
function quatBenchmarks() {
  const a1 = glm.quat.create(); glm.quat.rotateX(a1, a1, 0.5);
  const b1 = glm.quat.create(); glm.quat.rotateY(b1, b1, 0.8);
  const out1 = glm.quat.create();

  const a2 = new glmaths.Quat(); a2.rotateX(0.5);
  const b2 = new glmaths.Quat(); b2.rotateY(0.8);
  const out2 = new glmaths.Quat();

  
  const s1 = new Benchmark.Suite('Quat multiply');
  s1.add('gl-matrix  quat.multiply(out, a, b)', () => {
    glm.quat.multiply(out1, a1, b1);
  });
  s1.add('glmaths  a.multiply(b, out)', () => {
    a2.multiply(b2, out2);
  });

  
  const slOut1 = glm.quat.create();
  const slOut2 = new glmaths.Quat();
  const s2 = new Benchmark.Suite('Quat slerp');
  s2.add('gl-matrix  quat.slerp(out, a, b, 0.5)', () => {
    glm.quat.slerp(slOut1, a1, b1, 0.5);
  });
  s2.add('glmaths  a.slerp(b, 0.5, out)', () => {
    a2.slerp(b2, 0.5, slOut2);
  });

  
  const nOut1 = glm.quat.create();
  const nOut2 = new glmaths.Quat();
  const s3 = new Benchmark.Suite('Quat normalize');
  s3.add('gl-matrix  quat.normalize(out, a)', () => {
    glm.quat.normalize(nOut1, a1);
  });
  s3.add('glmaths  a.normalize(out)', () => {
    a2.normalize(nOut2);
  });

  
  const iOut1 = glm.quat.create();
  const iOut2 = new glmaths.Quat();
  const s4 = new Benchmark.Suite('Quat invert');
  s4.add('gl-matrix  quat.invert(out, a)', () => {
    glm.quat.invert(iOut1, a1);
  });
  s4.add('glmaths  a.invert(out)', () => {
    a2.invert(iOut2);
  });

  
  const axis = [0, 1, 0];
  const axis2 = new glmaths.Vec3(0, 1, 0);
  const faOut1 = glm.quat.create();
  const faOut2 = new glmaths.Quat();
  const s5 = new Benchmark.Suite('Quat fromAxisAngle');
  s5.add('gl-matrix  quat.setAxisAngle(out, axis, rad)', () => {
    glm.quat.setAxisAngle(faOut1, axis, 1.2);
  });
  s5.add('glmaths  Quat.fromAxisAngle(axis, rad, out)', () => {
    glmaths.Quat.fromAxisAngle(axis2, 1.2, faOut2);
  });

  return runSuite(s1)
    .then(() => runSuite(s2))
    .then(() => runSuite(s3))
    .then(() => runSuite(s4))
    .then(() => runSuite(s5));
}

// ─────────────────────────────────────────────
// Swizzle overhead (unique to glm)
// ─────────────────────────────────────────────
function swizzleBenchmarks() {
  const v = new glmaths.Vec3(1, 2, 3);

  
  const s1 = new Benchmark.Suite('Swizzle');
  s1.add('Direct component access  v[0], v[1], v[2]', () => {
    const x = v[0], y = v[1], z = v[2];
  });
  s1.add('Named property access  v.x, v.y, v.z', () => {
    const x = v.x, y = v.y, z = v.z;
  });
  s1.add('Swizzle  v.xyz', () => {
    const r = v.xyz;
  });
  s1.add('Swizzle  v.zyx', () => {
    const r = v.zyx;
  });
  s1.add('Swizzle  v.xy (Vec2)', () => {
    const r = v.xy;
  });

  return runSuite(s1);
}

// ─────────────────────────────────────────────
// New method benchmarks
// ─────────────────────────────────────────────
function newMethodBenchmarks() {
  // --- Vec3 transformMat4 ---
  const tv = new glmaths.Vec3(1, 2, 3);
  const tmat = glmaths.Mat4.fromTranslation(new glmaths.Vec3(10, 20, 30));
  const tvOut = new glmaths.Vec3();

  const tv1 = glm.vec3.fromValues(1, 2, 3);
  const tmat1 = glm.mat4.create(); glm.mat4.fromTranslation(tmat1, [10, 20, 30]);
  const tvOut1 = glm.vec3.create();

  const s1 = new Benchmark.Suite('Vec3 transformMat4');
  s1.add('gl-matrix  vec3.transformMat4(out, v, m)', () => {
    glm.vec3.transformMat4(tvOut1, tv1, tmat1);
  });
  s1.add('glmaths  v.transformMat4(m, out)', () => {
    tv.transformMat4(tmat, tvOut);
  });

  // --- Vec3 transformQuat ---
  const tq1 = glm.quat.create(); glm.quat.rotateY(tq1, tq1, 0.5);
  const tqOut1 = glm.vec3.create();
  const tq2 = new glmaths.Quat(); tq2.rotateY(0.5);
  const tqOut2 = new glmaths.Vec3();

  const s2 = new Benchmark.Suite('Vec3 transformQuat');
  s2.add('gl-matrix  vec3.transformQuat(out, v, q)', () => {
    glm.vec3.transformQuat(tqOut1, tv1, tq1);
  });
  s2.add('glmaths  v.transformQuat(q, out)', () => {
    tv.transformQuat(tq2, tqOut2);
  });

  // --- Vec3 scaleAndAdd ---
  const saA1 = glm.vec3.fromValues(1, 2, 3);
  const saB1 = glm.vec3.fromValues(4, 5, 6);
  const saOut1 = glm.vec3.create();
  const saA2 = new glmaths.Vec3(1, 2, 3);
  const saB2 = new glmaths.Vec3(4, 5, 6);
  const saOut2 = new glmaths.Vec3();

  const s3 = new Benchmark.Suite('Vec3 scaleAndAdd');
  s3.add('gl-matrix  vec3.scaleAndAdd(out, a, b, s)', () => {
    glm.vec3.scaleAndAdd(saOut1, saA1, saB1, 2.5);
  });
  s3.add('glmaths  a.scaleAndAdd(b, s, out)', () => {
    saA2.scaleAndAdd(saB2, 2.5, saOut2);
  });

  // --- Vec3 GLSL: mix/clamp ---
  const mixA2 = new glmaths.Vec3(0, 0, 0);
  const mixB2 = new glmaths.Vec3(10, 20, 30);
  const mixOut2 = new glmaths.Vec3();

  const s4 = new Benchmark.Suite('Vec3 mix (lerp)');
  s4.add('gl-matrix  vec3.lerp(out, a, b, 0.5)', () => {
    glm.vec3.lerp(saOut1, saA1, saB1, 0.5);
  });
  s4.add('glmaths  a.mix(b, 0.5, out)', () => {
    mixA2.mix(mixB2, 0.5, mixOut2);
  });

  // --- Vec4 transformMat4 ---
  const v4a1 = glm.vec4.fromValues(1, 2, 3, 1);
  const v4out1 = glm.vec4.create();
  const v4a2 = new glmaths.Vec4(1, 2, 3, 1);
  const v4out2 = new glmaths.Vec4();

  const s5 = new Benchmark.Suite('Vec4 transformMat4');
  s5.add('gl-matrix  vec4.transformMat4(out, v, m)', () => {
    glm.vec4.transformMat4(v4out1, v4a1, tmat1);
  });
  s5.add('glmaths  v.transformMat4(m, out)', () => {
    v4a2.transformMat4(tmat, v4out2);
  });

  // --- Mat4 project/unProject ---
  const projMat = glmaths.Mat4.perspective(Math.PI / 4, 16 / 9, 0.1, 100);
  const modelMat = glmaths.Mat4.identity;
  const viewport = new glmaths.Vec4(0, 0, 800, 600);
  const worldPt = new glmaths.Vec3(1, 2, -5);

  const s6 = new Benchmark.Suite('Mat4 project');
  s6.add('glmaths  Mat4.project(obj, model, proj, vp)', () => {
    glmaths.Mat4.project(worldPt, modelMat, projMat, viewport);
  });

  const winPt = glmaths.Mat4.project(worldPt, modelMat, projMat, viewport);
  const s7 = new Benchmark.Suite('Mat4 unProject');
  s7.add('glmaths  Mat4.unProject(win, model, proj, vp)', () => {
    glmaths.Mat4.unProject(winPt, modelMat, projMat, viewport);
  });

  // --- Quat euler angles ---
  const eq = new glmaths.Quat(); eq.rotateX(0.5); eq.rotateY(0.3);
  const s8 = new Benchmark.Suite('Quat eulerAngles / pitch / yaw / roll');
  s8.add('glmaths  q.pitch()', () => { eq.pitch(); });
  s8.add('glmaths  q.yaw()', () => { eq.yaw(); });
  s8.add('glmaths  q.roll()', () => { eq.roll(); });
  s8.add('glmaths  q.eulerAngles()', () => { eq.eulerAngles(); });

  // --- Quat toMat4 ---
  const qm4Out = new glmaths.Mat4();
  const s9 = new Benchmark.Suite('Quat toMat4 vs Mat4.fromQuat');
  s9.add('glmaths  Mat4.fromQuat(q, out)', () => {
    glmaths.Mat4.fromQuat(eq, qm4Out);
  });
  s9.add('glmaths  q.toMat4(out)', () => {
    eq.toMat4(qm4Out);
  });

  // --- Quat2 operations ---
  const dqA = glmaths.Quat2.fromRotationTranslation(
    glmaths.Quat.fromAxisAngle(new glmaths.Vec3(0, 1, 0), 0.5),
    new glmaths.Vec3(1, 2, 3)
  );
  const dqB = glmaths.Quat2.fromTranslation(new glmaths.Vec3(4, 5, 6));
  const dqOut = new glmaths.Quat2();

  const s10 = new Benchmark.Suite('Quat2 multiply');
  s10.add('glmaths  a.multiply(b, out)', () => {
    dqA.multiply(dqB, dqOut);
  });

  const s11 = new Benchmark.Suite('Quat2 getTranslation');
  s11.add('glmaths  dq.getTranslation()', () => {
    dqA.getTranslation();
  });

  return runSuite(s1)
    .then(() => runSuite(s2))
    .then(() => runSuite(s3))
    .then(() => runSuite(s4))
    .then(() => runSuite(s5))
    .then(() => runSuite(s6))
    .then(() => runSuite(s7))
    .then(() => runSuite(s8))
    .then(() => runSuite(s9))
    .then(() => runSuite(s10))
    .then(() => runSuite(s11));
}

// ─────────────────────────────────────────────
// Run all
// ─────────────────────────────────────────────
async function main() {
  await vec3Benchmarks();
  await vec2Benchmarks();
  await vec4Benchmarks();
  await mat4Benchmarks();
  await mat3Benchmarks();
  await quatBenchmarks();
  await swizzleBenchmarks();
  await newMethodBenchmarks();

  printMarkdownTable();
}

main().catch(console.error);
