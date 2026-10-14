import { test, expect } from '../../fixtures/test';
import { products } from '../../test-data/checkout';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows the full catalog of 6 products @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sorts by name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.names();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorts by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.names();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sorts by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('cart badge tracks items added and removed', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('product detail page matches the catalog price', async ({ page, inventoryPage }) => {
    const listPrice = await inventoryPage.priceOf(products.fleeceJacket);

    await inventoryPage.item(products.fleeceJacket).getByTestId('inventory-item-name').click();

    await expect(page.getByTestId('inventory-item-name')).toHaveText(products.fleeceJacket);
    await expect(page.getByTestId('inventory-item-price')).toHaveText(`$${listPrice.toFixed(2)}`);
  });
});
