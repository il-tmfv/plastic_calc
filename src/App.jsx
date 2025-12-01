import { useMemo, useRef, useState } from 'react'
import './App.css'
import CalculatorHeader from './components/CalculatorHeader'
import CatalogSettings from './components/CatalogSettings'
import ExtrasSelector from './components/ExtrasSelector'
import PlasticList from './components/PlasticList'
import ProductionParams from './components/ProductionParams'
import ResultsGrid from './components/ResultsGrid'
import ReportsPanel from './components/ReportsPanel'
import { initialExtras, initialMaterials } from './constants/data'
import { generateId, gramsToKgCost } from './utils/helpers'

const pad = (value) => String(value).padStart(2, '0')
const createEmptyMaterialForm = () => ({ name: '', pricePerKg: '' })
const createEmptyExtraForm = () => ({ name: '', price: '' })
const getTodayDateString = () => {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

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
  const [newMaterial, setNewMaterial] = useState(createEmptyMaterialForm())
  const [newExtra, setNewExtra] = useState(createEmptyExtraForm())
  const [printName, setPrintName] = useState('')
  const [printDate, setPrintDate] = useState(() => getTodayDateString())
  const fileInputRef = useRef(null)

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
    setNewMaterial(createEmptyMaterialForm())
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
    setNewExtra(createEmptyExtraForm())
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

  const getDefaultFileName = () => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = pad(now.getMonth() + 1)
    const dd = pad(now.getDate())
    const hh = pad(now.getHours())
    const min = pad(now.getMinutes())
    const ss = pad(now.getSeconds())
    return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`
  }

  const buildSnapshot = () => ({
    materials,
    extras,
    plasticRows,
    time,
    piecesPerSession,
    selectedExtras,
    printName,
    printDate,
  })

  const handleSaveState = () => {
    if (typeof window === 'undefined') return
    const suggestedName = getDefaultFileName()
    const userInput = window.prompt('Введите имя файла', suggestedName)
    if (!userInput) return

    const trimmedName = userInput.trim()
    if (!trimmedName) return

    const payload = {
      version: 1,
      createdAt: new Date().toISOString(),
      state: buildSnapshot(),
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = trimmedName.endsWith('.json')
      ? trimmedName
      : `${trimmedName}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleStateFileChange = (event) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (loadEvent) => {
      try {
        const raw = loadEvent.target?.result
        if (typeof raw !== 'string') {
          throw new Error('Пустой файл')
        }

        const parsed = JSON.parse(raw)
        const snapshot = parsed.state ?? parsed

        if (
          !snapshot ||
          !Array.isArray(snapshot.materials) ||
          !Array.isArray(snapshot.extras) ||
          !Array.isArray(snapshot.plasticRows)
        ) {
          throw new Error('Некорректный формат файла')
        }

        setMaterials(snapshot.materials)
        setExtras(snapshot.extras)
        setPlasticRows(snapshot.plasticRows)
        setTime(snapshot.time ?? { hours: '', minutes: '' })
        setPiecesPerSession(snapshot.piecesPerSession ?? 1)
        setSelectedExtras(snapshot.selectedExtras ?? {})
        setNewMaterial(createEmptyMaterialForm())
        setNewExtra(createEmptyExtraForm())
        setPrintName(snapshot.printName ?? '')
        setPrintDate(snapshot.printDate ?? getTodayDateString())
      } catch (error) {
        window.alert(
          `Не удалось загрузить состояние: ${
            error instanceof Error ? error.message : 'неизвестная ошибка'
          }`,
        )
      } finally {
        input.value = ''
      }
    }

    reader.onerror = () => {
      window.alert('Не удалось прочитать файл')
      input.value = ''
    }

    reader.readAsText(file)
  }

  const handleLoadState = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="app">
      <CalculatorHeader
        printName={printName}
        printDate={printDate}
        onPrintNameChange={setPrintName}
        onPrintDateChange={setPrintDate}
        onSaveState={handleSaveState}
        onLoadState={handleLoadState}
        fileInputRef={fileInputRef}
        onFileChange={handleStateFileChange}
      />

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

      <ReportsPanel />
    </div>
  )
}

export default App
