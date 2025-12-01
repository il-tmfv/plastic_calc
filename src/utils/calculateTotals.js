import { gramsToKgCost } from './helpers'

const isExtraSelected = (selectedExtras, id) => {
  if (!selectedExtras) return false
  if (Array.isArray(selectedExtras)) return selectedExtras.includes(id)
  if (typeof selectedExtras === 'object') {
    return Boolean(selectedExtras[id])
  }
  return false
}

const mapMaterialsById = (materials) =>
  materials.reduce((acc, material) => {
    if (material?.id) {
      acc[material.id] = material
    }
    return acc
  }, {})

export const calculateTotals = ({
  materials = [],
  extras = [],
  plasticRows = [],
  selectedExtras = {},
  time = {},
  piecesPerSession = 0,
}) => {
  const materialById = mapMaterialsById(materials)

  const plasticCost = plasticRows.reduce((sum, row) => {
    const material = row?.materialId ? materialById[row.materialId] : null
    return sum + (material ? gramsToKgCost(material.pricePerKg, row.grams) : 0)
  }, 0)

  const totalWeight = plasticRows.reduce(
    (sum, row) => sum + (Number(row?.grams) || 0),
    0,
  )

  const hours = Number(time?.hours) || 0
  const minutes = Number(time?.minutes) || 0
  const totalHours = hours + minutes / 60
  const timeCost = totalHours * 10

  const extrasTotal = extras.reduce(
    (sum, extra) =>
      sum + (isExtraSelected(selectedExtras, extra.id) ? Number(extra.price) || 0 : 0),
    0,
  )

  const baseCost = plasticCost + timeCost + extrasTotal
  const vladikaCost = totalWeight * 1.5 + totalHours * 10 + extrasTotal
  const vladikaWithoutExtras = vladikaCost - extrasTotal
  const salePrice = vladikaWithoutExtras * 2.5 + extrasTotal
  const discountPrice = baseCost * 2.5
  const pieces = Number(piecesPerSession) || 0
  const netProfit = salePrice - baseCost - extrasTotal

  return {
    plasticCost,
    totalWeight,
    totalHours,
    extrasTotal,
    baseCost,
    vladikaCost,
    salePrice,
    discountPrice,
    netProfit,
    perUnitCost: pieces > 0 ? baseCost / pieces : 0,
    perUnitSale: pieces > 0 ? salePrice / pieces : 0,
    perUnitDiscount: pieces > 0 ? discountPrice / pieces : 0,
    pieces,
  }
}


