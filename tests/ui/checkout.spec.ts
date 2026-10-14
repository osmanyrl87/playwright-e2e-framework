import { test, expect } from '../../fixtures/test';
import { customer, products, TAX_RATE } from '../../test-data/checkout';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('customer can buy two items end to end @smoke', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const selection = [products.backpack, products.boltTShirt];
    const expectedSubtotal =
      (await inventoryPage.priceOf(products.backpack)) +
      (await inventoryPage.priceOf(products.boltTShirt));

    await test.step('add items and open the cart', async () => {
      await inventoryPage.addToCart(...selection);
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
      await expect(cartPage.itemNames).toHaveText(selection);
    });

    await test.step('enter customer details', async () => {
      await cartPage.checkout();
      await checkoutPage.fillInformation(customer);
    });

    await test.step('verify the order totals', async () => {
      await expect(checkoutPage.itemNames).toHaveText(selection);
      const { subtotal, tax, total } = await checkoutPage.summary();
      expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
      expect(tax).toBeCloseTo(Math.round(expectedSubtotal * TAX_RATE * 100) / 100, 2);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await test.step('place the order', async () => {
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(inventoryPage.cartBadge).toBeHidden();
    });

    await test.step('return to the catalog', async () => {
      await checkoutPage.backHomeButton.click();
      await expect(page).toHaveURL(/inventory\.html/);
    });
  });

  test('item removed in the cart does not reach the order', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart(products.backpack, products.onesie);
    await inventoryPage.openCart();
    await cartPage.remove(products.onesie);
    await expect(cartPage.itemNames).toHaveText([products.backpack]);

    await cartPage.checkout();
    await checkoutPage.fillInformation(customer);
    await expect(checkoutPage.itemNames).toHaveText([products.backpack]);
  });

  const requiredFields = [
    { missing: 'first name', info: { ...customer, firstName: '' }, error: 'First Name is required' },
    { missing: 'last name', info: { ...customer, lastName: '' }, error: 'Last Name is required' },
    { missing: 'postal code', info: { ...customer, postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const { missing, info, error } of requiredFields) {
    test(`checkout blocks a missing ${missing}`, async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addToCart(products.bikeLight);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutPage.fillInformation(info);
      await expect(checkoutPage.error).toContainText(error);
    });
  }
});
