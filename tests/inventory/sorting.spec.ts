import { test, expect } from '../../src/fixtures/test';
import type { SortOption } from '../../src/pages/InventoryPage';

const byName = (a: string, b: string) => a.localeCompare(b);

const cases: { id: string; option: SortOption; label: string; field: 'names' | 'prices'; order: 'asc' | 'desc' }[] = [
  { id: 'INV-001', option: 'az', label: 'Name (A to Z)', field: 'names', order: 'asc' },
  { id: 'INV-002', option: 'za', label: 'Name (Z to A)', field: 'names', order: 'desc' },
  { id: 'INV-003', option: 'lohi', label: 'Price (low to high)', field: 'prices', order: 'asc' },
  { id: 'INV-004', option: 'hilo', label: 'Price (high to low)', field: 'prices', order: 'desc' },
];

test.describe('Products sorting', () => {
  for (const c of cases) {
    test(`${c.id} sort by ${c.label}`, async ({ signedIn }) => {
      await signedIn.sortBy(c.option);
      if (c.field === 'names') {
        const names = await signedIn.names();
        const expected = [...names].sort(byName);
        expect(names).toEqual(c.order === 'asc' ? expected : expected.reverse());
      } else {
        const prices = await signedIn.prices();
        const expected = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(c.order === 'asc' ? expected : expected.reverse());
      }
    });
  }
});
