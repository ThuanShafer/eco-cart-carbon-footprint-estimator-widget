import { newE2EPage } from '@stencil/core/testing';

describe('carbon-offset-estimator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<carbon-offset-estimator></carbon-offset-estimator>');

    const element = await page.find('carbon-offset-estimator');
    expect(element).toHaveClass('hydrated');
  });
});
