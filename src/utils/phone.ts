/**
 * Helper utility to normalize and compare phone numbers
 */
export function normalizePhone(phone: string): string {
  return (phone || '').replace(/[^0-9]/g, '');
}

export function isSamePhone(p1: string, p2: string): boolean {
  const c1 = normalizePhone(p1);
  const c2 = normalizePhone(p2);
  if (!c1 || !c2) return false;
  
  // Compare the last 9 digits for Gulf/Middle East mobile compatibility
  const s1 = c1.slice(-9);
  const s2 = c2.slice(-9);
  return s1 === s2 && s1.length === 9;
}
