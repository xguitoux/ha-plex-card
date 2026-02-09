import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/ha-plex-card.ts',
  output: {
    file: 'dist/ha-plex-card.js',
    format: 'es',
    sourcemap: !production,
  },
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
    }),
    json(),
    production && terser({
      format: {
        comments: false,
      },
    }),
  ],
  watch: {
    clearScreen: false,
  },
};
