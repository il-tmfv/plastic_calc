function CatalogSettings({
  materials,
  extras,
  newMaterial,
  onMaterialFieldChange,
  onAddMaterial,
  onUpdateMaterial,
  onRemoveMaterial,
  newExtra,
  onExtraFieldChange,
  onAddExtra,
  onUpdateExtra,
  onRemoveExtra,
}) {
  return (
    <section className="panel settings">
      <div className="panel-header">
        <h2>Настройки каталога</h2>
        <p>Здесь можно управлять списками пластика и расходников</p>
      </div>

      <div className="settings-grid">
        <div>
          <h3>Пластик</h3>
          <form className="inline-form" onSubmit={onAddMaterial}>
            <input
              placeholder="Название"
              value={newMaterial.name}
              onChange={(e) => onMaterialFieldChange('name', e.target.value)}
            />
            <input
              placeholder="Цена за кг"
              type="number"
              min="0"
              value={newMaterial.pricePerKg}
              onChange={(e) => onMaterialFieldChange('pricePerKg', e.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>

          <ul className="settings-list">
            {materials.map((mat) => (
              <li key={mat.id}>
                <input
                  value={mat.name}
                  onChange={(e) => onUpdateMaterial(mat.id, 'name', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  value={mat.pricePerKg}
                  onChange={(e) =>
                    onUpdateMaterial(mat.id, 'pricePerKg', e.target.value)
                  }
                />
                <button type="button" onClick={() => onRemoveMaterial(mat.id)}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Доп. расходники</h3>
          <form className="inline-form" onSubmit={onAddExtra}>
            <input
              placeholder="Название"
              value={newExtra.name}
              onChange={(e) => onExtraFieldChange('name', e.target.value)}
            />
            <input
              placeholder="Цена"
              type="number"
              min="0"
              value={newExtra.price}
              onChange={(e) => onExtraFieldChange('price', e.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>

          <ul className="settings-list">
            {extras.map((item) => (
              <li key={item.id}>
                <input
                  value={item.name}
                  onChange={(e) => onUpdateExtra(item.id, 'name', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => onUpdateExtra(item.id, 'price', e.target.value)}
                />
                <button type="button" onClick={() => onRemoveExtra(item.id)}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CatalogSettings

