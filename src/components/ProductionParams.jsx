function ProductionParams({
  time,
  onTimeChange,
  piecesPerSession,
  onPiecesChange,
}) {
  return (
    <section className="panel grid-two">
      <div className="field-group">
        <h2>Время печати (графа 3)</h2>
        <div className="time-inputs">
          <label>
            <span>Часы</span>
            <input
              type="number"
              min="0"
              value={time.hours}
              onChange={(e) => onTimeChange('hours', e.target.value)}
            />
          </label>
          <label>
            <span>Минуты</span>
            <input
              type="number"
              min="0"
              max="59"
              value={time.minutes}
              onChange={(e) => onTimeChange('minutes', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="field-group">
        <h2>Кол-во деталей (графа 8)</h2>
        <input
          type="number"
          min="1"
          value={piecesPerSession}
          onChange={(e) => onPiecesChange(e.target.value)}
        />
      </div>
    </section>
  )
}

export default ProductionParams

