export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const customer: CustomerInfo = {
  firstName: 'Jane',
  lastName: 'Tester',
  postalCode: '43215',
};

/** Product names as they appear in the SauceDemo catalog. */
export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;

/** SauceDemo charges 8% tax on the item subtotal. */
export const TAX_RATE = 0.08;
