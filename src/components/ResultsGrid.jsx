import { numberFormatter, rubFormatter } from '../utils/formatters'

function ResultsGrid({ totals, piecesPerSession }) {
  return (
    <section className="panel results">
      <div className="panel-header">
        <h2>Расчёт</h2>
        <p>Графы 4–11</p>
      </div>

      <div className="results-grid">
        <article>
          <p className="label">Себестоимость (4)</p>
          <strong>{rubFormatter.format(totals.baseCost)}</strong>
          <p className="hint">
            Пластик {rubFormatter.format(totals.plasticCost)} • Время{' '}
            {rubFormatter.format(totals.totalHours * 10)} • Расходники{' '}
            {rubFormatter.format(totals.extrasTotal)}
          </p>
        </article>

        <article>
          <p className="label">Себестоимость Владика (5)</p>
          <strong>{rubFormatter.format(totals.vladikaCost)}</strong>
          <p className="hint">
            Вес {numberFormatter(totals.totalWeight, 1)} г × 1.5 + время × 10 + расходники
          </p>
        </article>

        <article>
          <p className="label">Цена на продажу (6)</p>
          <strong>{rubFormatter.format(totals.salePrice)}</strong>
          <p className="hint">Графа 5 × 2.5</p>
        </article>

        <article>
          <p className="label">Чистая прибыль</p>
          <strong>{rubFormatter.format(totals.netProfit)}</strong>
          <p className="hint">
            Графа 6 − графа 4 − расходники{' '}
            {rubFormatter.format(totals.extrasTotal)}
          </p>
        </article>

        <article>
          <p className="label">Цена со скидкой (7)</p>
          <strong>{rubFormatter.format(totals.discountPrice)}</strong>
          <p className="hint">Графа 4 × 2.5</p>
        </article>

        <article>
          <p className="label">Кол-во за сеанс (8)</p>
          <strong>{numberFormatter(piecesPerSession, 0)}</strong>
        </article>

        <article>
          <p className="label">Себестоимость / шт. (9)</p>
          <strong>{rubFormatter.format(totals.perUnitCost)}</strong>
        </article>

        <article>
          <p className="label">Цена / шт. (10)</p>
          <strong>{rubFormatter.format(totals.perUnitSale)}</strong>
        </article>

        <article>
          <p className="label">Цена со скидкой / шт. (11)</p>
          <strong>{rubFormatter.format(totals.perUnitDiscount)}</strong>
        </article>
      </div>
    </section>
  )
}

export default ResultsGrid

