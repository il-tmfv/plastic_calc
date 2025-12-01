function CalculatorHeader({
  printName,
  printDate,
  onPrintNameChange,
  onPrintDateChange,
  onSaveState,
  onLoadState,
  fileInputRef,
  onFileChange,
}) {
  return (
    <header className="header">
      <div className="header-main">
        <h1>Калькулятор печати</h1>
        <p className="subtitle">
          Подбирайте нужное количество цветов пластика, учитывайте время печати
          и расходники. Все формулы из описания уже зашиты в расчёт.
        </p>
        <div className="header-fields">
          <div className="field header-field">
            <label htmlFor="print-name-input">Название печати</label>
            <input
              id="print-name-input"
              type="text"
              placeholder="Например, заказ #42"
              value={printName}
              onChange={(event) => onPrintNameChange(event.target.value)}
            />
          </div>
          <div className="field header-field">
            <label htmlFor="print-date-input">Дата печати</label>
            <input
              id="print-date-input"
              type="date"
              value={printDate}
              onChange={(event) => onPrintDateChange(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="header-actions">
        <button type="button" onClick={onSaveState}>
          Сохранить печать
        </button>
        <button type="button" className="ghost" onClick={onLoadState}>
          Загрузить печать
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          hidden
          onChange={onFileChange}
        />
      </div>
    </header>
  )
}

export default CalculatorHeader
