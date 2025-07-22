import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil-community/postcss';
import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'carbon-offset-estimator-widget',
  globalStyle: 'src/global/styles/_variables.scss',
  sourceMap: false,
  transformAliasedImportPaths: false,
  plugins: [
    sass({
      injectGlobalPaths: ['src/global/styles/_variables.scss'],
    }),
    postcss({
      plugins: [autoprefixer()],
    }),
  ],
  nodeResolve: {
    browser: true,
    preferBuiltins: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'index.html' },
        { src: './demos/styles.css' },
        { src: './demos/scripts.js' }
      ]
    },
  ],
  buildEs5: 'prod',
};
