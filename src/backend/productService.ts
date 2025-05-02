import { products } from 'wix-stores-backend';

export async function getMostExpensiveUndiscountedProduct() {
  const result = await products.queryProducts().find();
  const all = result.items;

  const filtered = all.filter(p => !p.discount?.value || p.discount?.value === 0);

  if (filtered.length === 0) return null;

  const sorted = filtered.sort((a, b) => b.price.amount - a.price.amount);

  return sorted[0];
}
