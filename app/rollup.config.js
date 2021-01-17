import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

const { dependencies } = Object.keys(require('./package.json'));
const tsconfigDefaults = { compilerOptions: { declaration: true } };
const tsconfigOverride = { compilerOptions: { declaration: false } };

const plugins = [
  peerDepsExternal(),
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  typescript({
    tsconfigDefaults,
    tsconfig: './tsconfig.prod.json',
    tsconfigOverride,
  }),
  nodeResolve({
    jsnext: true,
    main: true,
  }),
  commonjs({
    include: 'node_modules/**',
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  postcss({
    extract: false,
  }),
  terser(),
];

export default [
  {
    external: dependencies,
    input: './src/index.js',
    plugins,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
  },
  {
    input: './src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
