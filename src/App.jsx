import { useMemo, useState } from 'react'
import './App.css'
import CalculatorHeader from './components/CalculatorHeader'
import CatalogSettings from './components/CatalogSettings'
import ExtrasSelector from './components/ExtrasSelector'
import PlasticList from './components/PlasticList'
import ProductionParams from './components/ProductionParams'
import ResultsGrid from './components/ResultsGrid'
import { initialExtras, initialMaterials } from './constants/data'
import { generateId, gramsToKgCost } from './utils/helpers'

function App() {
  const [materials, setMaterials] = useState(initialMaterials)
  const [extras, setExtras] = useState(initialExtras)
  const [plasticRows, setPlasticRows] = useState(() => [
    {
      id: generateId(),
      materialId: initialMaterials[0]?.id ?? null,
      grams: '',
    },
  ])
  const [time, setTime] = useState({ hours: '', minutes: '' })
  const [piecesPerSession, setPiecesPerSession] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState({})
  const [newMaterial, setNewMaterial] = useState({ name: '', pricePerKg: '' })
  const [newExtra, setNewExtra] = useState({ name: '', price: '' })

  const totals = useMemo(() => {
    const plasticCost = plasticRows.reduce((sum, row) => {
      const material = materials.find((mat) => mat.id === row.materialId)
      return sum + (material ? gramsToKgCost(material.pricePerKg, row.grams) : 0)
    }, 0)

    const totalWeight = plasticRows.reduce(
      (sum, row) => sum + (Number(row.grams) || 0),
      0,
    )

    const hours = Number(time.hours) || 0
    const minutes = Number(time.minutes) || 0
    const totalHours = hours + minutes / 60
    const timeCost = totalHours * 10

    const extrasTotal = extras.reduce(
      (sum, extra) =>
        sum + (selectedExtras[extra.id] ? Number(extra.price) || 0 : 0),
      0,
    )

    const baseCost = plasticCost + timeCost + extrasTotal
    const vladikaCost = totalWeight * 1.5 + totalHours * 10 + extrasTotal
    const salePrice = vladikaCost * 2.5
    const discountPrice = baseCost * 2.5
    const pieces = Number(piecesPerSession) || 0

    return {
      plasticCost,
      totalWeight,
      totalHours,
      extrasTotal,
      baseCost,
      vladikaCost,
      salePrice,
      discountPrice,
      perUnitCost: pieces > 0 ? baseCost / pieces : 0,
      perUnitSale: pieces > 0 ? salePrice / pieces : 0,
      perUnitDiscount: pieces > 0 ? discountPrice / pieces : 0,
    }
  }, [extras, materials, piecesPerSession, plasticRows, selectedExtras, time])

  const handlePlasticChange = (rowId, field, value) => {
    setPlasticRows((rows) =>
      rows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    )
  }

  const addPlasticRow = () => {
    setPlasticRows((rows) => [
      ...rows,
      {
        id: generateId(),
        materialId: materials[0]?.id ?? null,
        grams: '',
      },
    ])
  }

  const removePlasticRow = (rowId) => {
    setPlasticRows((rows) =>
      rows.length === 1 ? rows : rows.filter((row) => row.id !== rowId),
    )
  }

  const toggleExtra = (extraId, checked) => {
    setSelectedExtras((prev) => {
      const next = { ...prev }
      if (checked) {
        next[extraId] = true
      } else {
        delete next[extraId]
      }
      return next
    })
  }

  const updateMaterialField = (id, field, value) => {
    setMaterials((prev) =>
      prev.map((mat) =>
        mat.id === id
          ? {
              ...mat,
              [field]:
                field === 'pricePerKg' ? Number(value) || 0 : value,
            }
          : mat,
      ),
    )
  }

  const updateExtraField = (id, field, value) => {
    setExtras((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'price' ? Number(value) || 0 : value,
            }
          : item,
      ),
    )
  }

  const handleNewMaterialField = (field, value) => {
    setNewMaterial((prev) => ({ ...prev, [field]: value }))
  }

  const handleNewExtraField = (field, value) => {
    setNewExtra((prev) => ({ ...prev, [field]: value }))
  }

  const addMaterial = (event) => {
    event.preventDefault()
    if (!newMaterial.name.trim() || !Number(newMaterial.pricePerKg)) return
    const created = {
      id: generateId(),
      name: newMaterial.name.trim(),
      pricePerKg: Number(newMaterial.pricePerKg),
    }
    setMaterials((prev) => [...prev, created])
    setNewMaterial({ name: '', pricePerKg: '' })
  }

  const removeMaterial = (id) => {
    setMaterials((prev) => prev.filter((mat) => mat.id !== id))
    setPlasticRows((rows) =>
      rows.map((row) =>
        row.materialId === id ? { ...row, materialId: null } : row,
      ),
    )
  }

  const addExtra = (event) => {
    event.preventDefault()
    if (!newExtra.name.trim() || !Number(newExtra.price)) return
    const created = {
      id: generateId(),
      name: newExtra.name.trim(),
      price: Number(newExtra.price),
    }
    setExtras((prev) => [...prev, created])
    setNewExtra({ name: '', price: '' })
  }

  const removeExtra = (id) => {
    setExtras((prev) => prev.filter((item) => item.id !== id))
    setSelectedExtras((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleTimeChange = (field, value) => {
    setTime((prev) => ({ ...prev, [field]: value }))
  }

  const handlePiecesChange = (value) => {
    setPiecesPerSession(value)
  }

  return (
    <div className="app">
      <CalculatorHeader />

      <PlasticList
        plasticRows={plasticRows}
        materials={materials}
        onRowChange={handlePlasticChange}
        onRemoveRow={removePlasticRow}
        onAddRow={addPlasticRow}
      />

      <ProductionParams
        time={time}
        onTimeChange={handleTimeChange}
        piecesPerSession={piecesPerSession}
        onPiecesChange={handlePiecesChange}
      />

      <ExtrasSelector
        extras={extras}
        selectedExtras={selectedExtras}
        onToggleExtra={toggleExtra}
      />

      <ResultsGrid totals={totals} piecesPerSession={piecesPerSession} />

      <CatalogSettings
        materials={materials}
        extras={extras}
        newMaterial={newMaterial}
        onMaterialFieldChange={handleNewMaterialField}
        onAddMaterial={addMaterial}
        onUpdateMaterial={updateMaterialField}
        onRemoveMaterial={removeMaterial}
        newExtra={newExtra}
        onExtraFieldChange={handleNewExtraField}
        onAddExtra={addExtra}
        onUpdateExtra={updateExtraField}
        onRemoveExtra={removeExtra}
      />
    </div>
  )
}

export default App
