import { newSpecPage } from '@stencil/core/testing';
import { CarbonOffsetEstimator } from '../carbon-offset-estimator';

describe('carbon-offset-estimator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CarbonOffsetEstimator],
      html: `<carbon-offset-estimator></carbon-offset-estimator>`,
    });
    expect(page.root).toEqualHtml(`
      <carbon-offset-estimator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </carbon-offset-estimator>
    `);
  });
});
