import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';

export default [
  {
    input: './src/MMM-SpencerHill.ts',
    external: ['logger'],
    plugins: [typescript({ module: 'ESNext' }), nodeResolve(), commonjs(), terser()],
    output: {
      file: './MMM-SpencerHill.js',
      format: 'iife',
      globals: {
        logger: 'Log',
      },
    },
  },
  {
    input: './src/node_helper.ts',
    external: ['node_helper', 'logger'],
    plugins: [typescript({ module: 'ESNext' }), nodeResolve(), commonjs(), json(), terser()],
    output: {
      file: './node_helper.js',
      format: 'cjs',
      interop: 'auto',
    },
  },
  {
    input: './styles/MMM-SpencerHill.scss',
    plugins: [
      scss({
        fileName: 'MMM-SpencerHill.css',
        failOnError: true,
        outputStyle: 'compressed',
      }),
    ],
    output: {
      file: './MMM-SpencerHill.css',
    },
  },
];
