import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/ha-plooum-buttonbadge-card.js',
  output: {
    file: 'ha-plooum-buttonbadge-card.js',
    format: 'iife',
    name: 'HaPlooumButtonBadgeCard',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};