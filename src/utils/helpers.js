export const generateId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9)

export const gramsToKgCost = (pricePerKg, grams) =>
  (Number(pricePerKg) || 0) / 1000 * (Number(grams) || 0)

