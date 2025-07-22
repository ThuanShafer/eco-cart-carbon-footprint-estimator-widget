import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'carbon-offset-estimator-widget',
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
        { src: 'styles.css' },
        { src: 'scripts.js' }
      ]
    },
  ],
  buildEs5: 'prod',
};
