import { rubFormatter } from '../utils/formatters'

function PlasticList({
  plasticRows,
  materials,
  onRowChange,
  onRemoveRow,
  onAddRow,
}) {
  return (
    <section className="panel">
      <div className="panel-header with-action">
        <div>
          <h2>Цвета и вес</h2>
          <p>Столбцы 1–2</p>
        </div>
        <button className="add-color" type="button" onClick={onAddRow}>
          + Добавить цвет пластика
        </button>
      </div>

      <div className="plastic-list">
        {plasticRows.map((row, index) => (
          <div className="plastic-row" key={row.id}>
            <div className="field">
              <label>Пластик #{index + 1}</label>
              <select
                value={row.materialId ?? ''}
                onChange={(e) =>
                  onRowChange(row.id, 'materialId', e.target.value || null)
                }
              >
                <option value="">— выберите цвет —</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({rubFormatter.format(material.pricePerKg)} / кг)
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Вес, г</label>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={row.grams}
                onChange={(e) => onRowChange(row.id, 'grams', e.target.value)}
              />
            </div>

            <button
              type="button"
              className="ghost"
              onClick={() => onRemoveRow(row.id)}
              disabled={plasticRows.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PlasticList

