import { rubFormatter } from '../utils/formatters'

function ExtrasSelector({ extras, selectedExtras, onToggleExtra }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Расходники</h2>
        <p>Можно отметить нужные квадратики (галочки)</p>
      </div>
      <div className="extras-grid">
        {extras.map((extra) => (
          <label className="extra-item" key={extra.id}>
            <input
              type="checkbox"
              checked={Boolean(selectedExtras[extra.id])}
              onChange={(e) => onToggleExtra(extra.id, e.target.checked)}
            />
            <span>{extra.name}</span>
            <span className="badge">{rubFormatter.format(extra.price)}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

export default ExtrasSelector

