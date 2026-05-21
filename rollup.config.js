import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
export default {
  input: 'lib/main.js',
  output: {
    file: 'dist.js',
    format: 'es',
    esModule: false,
    interop: 'compat'
  },
  plugins: [resolve(), commonjs({defaultIsModuleExports: true}), json()]
};