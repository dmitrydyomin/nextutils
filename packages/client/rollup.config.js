const autoprefixer = require('autoprefixer');
const postcss = require('rollup-plugin-postcss');
const typescript = require('@rollup/plugin-typescript');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

module.exports = {
  input: 'src/index.ts',

  output: {
    dir: 'dist',
    format: 'es',
  },

  plugins: [
    peerDepsExternal(),
    typescript(),
    postcss({
      plugins: [autoprefixer()],
      sourceMap: true,
      extract: true,
      minimize: true,
    }),
  ],
};
