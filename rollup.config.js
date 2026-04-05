import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import { rmSync } from "fs";

const cleanupTypes = {
  name: "cleanup-types",
  closeBundle() {
    rmSync("dist/types", { recursive: true, force: true });
  }
};

const TERSER_OPTIONS = {
  compress: {
    passes: 3,
    unsafe: true,
    unsafe_math: true,
    pure_getters: true
  }
}

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/cjs/glmaths.js", format: "cjs", sourcemap: true },
      { file: "dist/cjs/glmaths.min.js", format: "cjs", sourcemap: true, plugins: [terser(TERSER_OPTIONS)] },
      { file: "dist/esm/glmaths.js", format: "esm", sourcemap: true },
      { file: "dist/esm/glmaths.min.js", format: "esm", sourcemap: true, plugins: [terser(TERSER_OPTIONS)] },
    ],
    plugins: [typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      declarationMap: false
    })],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/glmaths.js",
        format: "iife",
        name: "glmaths",
        sourcemap: true,
      },
      {
        file: "dist/glmaths.min.js",
        format: "iife",
        name: "glmaths",
        plugins: [terser(TERSER_OPTIONS)],
        sourcemap: true,
      }
    ],
    plugins: [typescript({
      tsconfig: "./tsconfig.json",
      declarationDir: "./dist/types",
      declaration: true,
      outDir: undefined
    })],
  },
  {
    input: "dist/types/index.d.ts",
    output: [
      { file: "dist/glmaths.d.ts", format: "es" },
      { file: "dist/esm/glmaths.d.ts", format: "esm" },
      { file: "dist/cjs/glmaths.d.ts", format: "cjs" }
    ],
    plugins: [dts(), cleanupTypes],
  }
];