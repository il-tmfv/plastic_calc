import { useRef, useState } from 'react'
import { numberFormatter, rubFormatter } from '../utils/formatters'
import { gramsToKgCost } from '../utils/helpers'

const formatDate = (input) => {
  if (!input) return null
  const date = new Date(input)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDateRangeLabel = (from, to) => {
  if (!from && !to) return '—'
  if (from && !to) return from.toLocaleDateString('ru-RU')
  if (!from && to) return to.toLocaleDateString('ru-RU')
  if (from && to && from.getTime() === to.getTime()) {
    return from.toLocaleDateString('ru-RU')
  }
  return `${from.toLocaleDateString('ru-RU')} — ${to.toLocaleDateString('ru-RU')}`
}

const isExtraSelected = (selectedExtras, id) => {
  if (!selectedExtras) return false
  if (Array.isArray(selectedExtras)) return selectedExtras.includes(id)
  if (typeof selectedExtras === 'object') {
    return Boolean(selectedExtras[id])
  }
  return false
}

const calculateSnapshotTotals = (snapshot) => {
  const materials = Array.isArray(snapshot.materials) ? snapshot.materials : []
  const extras = Array.isArray(snapshot.extras) ? snapshot.extras : []
  const plasticRows = Array.isArray(snapshot.plasticRows) ? snapshot.plasticRows : []
  const materialById = materials.reduce((map, material) => {
    if (material?.id) {
      map[material.id] = material
    }
    return map
  }, {})

  const plasticCost = plasticRows.reduce((sum, row) => {
    const material = row?.materialId ? materialById[row.materialId] : null
    return sum + (material ? gramsToKgCost(material.pricePerKg, row.grams) : 0)
  }, 0)

  const totalWeight = plasticRows.reduce((sum, row) => sum + (Number(row?.grams) || 0), 0)

  const hours = Number(snapshot?.time?.hours) || 0
  const minutes = Number(snapshot?.time?.minutes) || 0
  const totalHours = hours + minutes / 60
  const timeCost = totalHours * 10

  const extrasTotal = extras.reduce(
    (sum, extra) => sum + (isExtraSelected(snapshot.selectedExtras, extra.id) ? Number(extra.price) || 0 : 0),
    0,
  )

  const baseCost = plasticCost + timeCost + extrasTotal
  const vladikaCost = totalWeight * 1.5 + totalHours * 10 + extrasTotal
  const vladikaWithoutExtras = vladikaCost - extrasTotal
  const salePrice = vladikaWithoutExtras * 2.5 + extrasTotal
  const pieces = Number(snapshot?.piecesPerSession) || 0
  const netProfit = salePrice - baseCost - extrasTotal

  return {
    totalWeight,
    totalHours,
    baseCost,
    vladikaCost,
    salePrice,
    netProfit,
    extrasTotal,
    pieces,
  }
}

const parseSnapshotPayload = (raw, fileName) => {
  const parsed = JSON.parse(raw)
  const snapshot = parsed?.state ?? parsed

  if (
    !snapshot ||
    !Array.isArray(snapshot.materials) ||
    !Array.isArray(snapshot.extras) ||
    !Array.isArray(snapshot.plasticRows)
  ) {
    throw new Error(`Файл «${fileName}» имеет неверный формат`)
  }

  return snapshot
}

const readSnapshotFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        if (typeof reader.result !== 'string') {
          throw new Error(`Файл «${file.name}» пустой`)
        }
        const snapshot = parseSnapshotPayload(reader.result, file.name)
        resolve({ snapshot, fileName: file.name })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error(`Не удалось прочитать файл «${file.name}»`))
    }

    reader.readAsText(file)
  })

function ReportsPanel() {
  const fileInputRef = useRef(null)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const buildReport = (entries) => {
    const initial = {
      totalPieces: 0,
      totalWeight: 0,
      totalHours: 0,
      totalCost: 0,
      totalVladika: 0,
      totalSale: 0,
      totalProfit: 0,
      earliest: null,
      latest: null,
    }

    const aggregated = entries.reduce((acc, entry) => {
      const { snapshot } = entry
      const totals = calculateSnapshotTotals(snapshot)
      acc.totalPieces += totals.pieces
      acc.totalWeight += totals.totalWeight
      acc.totalHours += totals.totalHours
      acc.totalCost += totals.baseCost
      acc.totalVladika += totals.vladikaCost
      acc.totalSale += totals.salePrice
      acc.totalProfit += totals.netProfit

      const date = formatDate(snapshot.printDate)
      if (date) {
        if (!acc.earliest || date < acc.earliest) acc.earliest = date
        if (!acc.latest || date > acc.latest) acc.latest = date
      }

      return acc
    }, initial)

    return {
      ...aggregated,
      periodLabel: formatDateRangeLabel(aggregated.earliest, aggregated.latest),
    }
  }

  const handleFilesChange = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setIsLoading(true)
    setError(null)
    try {
      const entries = await Promise.all(files.map(readSnapshotFile))
      const reportData = buildReport(entries)
      setReport({
        ...reportData,
        filesCount: entries.length,
      })
    } catch (err) {
      setReport(null)
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  return (
    <section className="panel">
      <div className="panel-header with-action">
        <div>
          <h2>Отчёты</h2>
          <p>Соберите статистику по нескольким сохранённым файлам</p>
        </div>
        <button type="button" onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? 'Обработка...' : 'Выбрать файлы'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFilesChange}
          multiple
          hidden
        />
      </div>

      {error && <p className="reports-error">{error}</p>}

      {!report && !error && !isLoading && (
        <p className="hint">Загрузите несколько файлов *.json, чтобы увидеть суммарную статистику.</p>
      )}

      {report && (
        <>
          <p className="reports-meta">
            Файлов обработано: <strong>{report.filesCount}</strong>
          </p>
          <ul className="reports-list">
            <li>
              <span>Период:</span>
              <strong>{report.periodLabel}</strong>
            </li>
            <li>
              <span>Кол-во изделий:</span>
              <strong>{numberFormatter(report.totalPieces, 0)}</strong>
            </li>
            <li>
              <span>Расход пластика:</span>
              <strong>{numberFormatter(report.totalWeight, 1)} г</strong>
            </li>
            <li>
              <span>Затрачено часов:</span>
              <strong>{numberFormatter(report.totalHours, 2)} ч</strong>
            </li>
            <li>
              <span>Себестоимость общая:</span>
              <strong>{rubFormatter.format(report.totalCost)}</strong>
            </li>
            <li>
              <span>Себестоимость «Владика»:</span>
              <strong>{rubFormatter.format(report.totalVladika)}</strong>
            </li>
            <li>
              <span>Общая цена продаж:</span>
              <strong>{rubFormatter.format(report.totalSale)}</strong>
            </li>
            <li>
              <span>Чистая прибыль:</span>
              <strong>{rubFormatter.format(report.totalProfit)}</strong>
            </li>
          </ul>
        </>
      )}
    </section>
  )
}

export default ReportsPanel


