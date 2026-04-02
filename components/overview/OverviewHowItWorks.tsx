export default function OverviewHowItWorks() {
  return (
    <section className="app-card">
      <div className="space-y-4">
        <h2 className="app-card-title">Как это работает</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <div className="app-card-title">1. Настрой стратегию</div>
            <p className="app-text-secondary">
              Задай ежемесячный взнос, срок, инфляцию и рост взноса. Посмотри,
              к какому капиталу это может привести.
            </p>
          </div>

          <div className="space-y-1">
            <div className="app-card-title">2. Зафиксируй реальность</div>
            <p className="app-text-secondary">
              Внеси текущий капитал и дальше отмечай реальные действия:
              пополнения, выводы и изменения.
            </p>
          </div>

          <div className="space-y-1">
            <div className="app-card-title">3. Сверяй план и факт</div>
            <p className="app-text-secondary">
              Не полагайся на ощущения. Система покажет, насколько ты идёшь по
              своему же плану или начинаешь от него съезжать.
            </p>
          </div>

          <div className="space-y-1">
            <div className="app-card-title">4. Корректируй курс</div>
            <p className="app-text-secondary">
              Если цели или условия меняются, ты обновляешь стратегию и
              продолжаешь движение уже осознанно, а не вслепую.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}