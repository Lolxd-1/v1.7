export function formatList(items: string[] | undefined): string {
  if (!items || items.length === 0) return 'None specified';
  if (items.length === 1) return items[0];
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(', ')} and ${lastItem}`;
}