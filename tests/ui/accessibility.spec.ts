import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/test';

/**
 * Accessibility scan with axe-core against WCAG 2.1 A/AA rules.
 * Critical violations fail the test; everything found is attached to the
 * HTML report so the full picture is visible without failing the build.
 */
const pages = [
  { name: 'login', path: '/', signedOut: true },
  { name: 'inventory', path: '/inventory.html', signedOut: false },
  { name: 'cart', path: '/cart.html', signedOut: false },
];

for (const { name, path, signedOut } of pages) {
  test.describe(`Accessibility: ${name} page`, () => {
    if (signedOut) test.use({ storageState: { cookies: [], origins: [] } });

    test(`has no critical WCAG 2.1 AA violations`, async ({ page }, testInfo) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      await testInfo.attach('axe-results', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      const critical = results.violations.filter((v) => v.impact === 'critical');
      expect(
        critical.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`),
        'critical accessibility violations',
      ).toEqual([]);
    });
  });
}
