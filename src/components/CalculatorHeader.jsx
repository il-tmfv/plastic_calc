function CalculatorHeader({
  onSaveState,
  onLoadState,
  fileInputRef,
  onFileChange,
}) {
  return (
    <header className="header">
      <div>
        <h1>Калькулятор печати</h1>
        <p className="subtitle">
          Подбирайте нужное количество цветов пластика, учитывайте время печати
          и расходники. Все формулы из описания уже зашиты в расчёт.
        </p>
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
