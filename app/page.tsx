import Link from "next/link";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <section className="app-card">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="app-page-title">Capital Tracker</h1>
            <p className="app-page-subtitle">
              Система планирования и контроля личного капитала
            </p>
          </div>

          <p className="app-text-secondary max-w-[760px]">
            Не калькулятор на два вечера, а рабочий инструмент, который помогает
            держать в одной системе стратегию, реальные взносы и текущую
            структуру капитала.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/strategy" className="app-button">
              Открыть стратегию
            </Link>
            <Link href="/capital" className="app-button">
              Открыть капитал
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="app-card">
          <div className="space-y-2">
            <h2 className="app-card-title">Стратегия</h2>
            <p className="app-text-secondary">
              Собрать целевую модель капитала: срок, взнос, инфляция, структура
              портфеля и ориентир по результату.
            </p>
          </div>
        </div>

        <div className="app-card">
          <div className="space-y-2">
            <h2 className="app-card-title">Капитал</h2>
            <p className="app-text-secondary">
              Вносить реальные пополнения, видеть текущую сумму капитала,
              историю операций и фактическую структуру.
            </p>
          </div>
        </div>

        <div className="app-card">
          <div className="space-y-2">
            <h2 className="app-card-title">Контроль</h2>
            <p className="app-text-secondary">
              Держать план и факт в одном поле зрения и принимать решения не по
              ощущениям, а по цифрам.
            </p>
          </div>
        </div>
      </section>

      <section className="app-card">
        <div className="space-y-4">
          <h2 className="app-card-title">Как это работает</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="app-card-title">1. Настрой стратегию</div>
              <p className="app-text-secondary">
                Задай срок, регулярный взнос и целевую структуру капитала.
              </p>
            </div>

            <div className="space-y-1">
              <div className="app-card-title">2. Вноси факт</div>
              <p className="app-text-secondary">
                Добавляй реальные пополнения по мере движения денег.
              </p>
            </div>

            <div className="space-y-1">
              <div className="app-card-title">3. Следи за результатом</div>
              <p className="app-text-secondary">
                Смотри текущую сумму капитала, историю операций и распределение
                по категориям.
              </p>
            </div>

            <div className="space-y-1">
              <div className="app-card-title">4. Корректируй курс</div>
              <p className="app-text-secondary">
                Если цели или условия меняются, обновляй стратегию и продолжай
                двигаться по системе.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="app-card">
          <div className="space-y-3">
            <h2 className="app-card-title">Кому подойдёт</h2>

            <div className="space-y-2">
              <p className="app-text-secondary">
                Тем, кто хочет собирать капитал системно, а не по настроению.
              </p>
              <p className="app-text-secondary">
                Тем, кто хочет видеть не только план, но и фактические действия.
              </p>
              <p className="app-text-secondary">
                Тем, кто хочет превратить накопление денег в управляемый
                процесс.
              </p>
            </div>
          </div>
        </div>

        <div className="app-card">
          <div className="space-y-3">
            <h2 className="app-card-title">Что уже есть в системе</h2>

            <div className="space-y-2">
              <p className="app-text-secondary">Стратегия роста капитала</p>
              <p className="app-text-secondary">Учёт фактических взносов</p>
              <p className="app-text-secondary">Текущая сумма капитала</p>
              <p className="app-text-secondary">Структура по категориям</p>
              <p className="app-text-secondary">История операций</p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-card">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="app-card-title">Начать можно с любого режима</h2>
            <p className="app-text-secondary max-w-[760px]">
              Если хочешь сначала понять ориентир — переходи в Стратегию. Если
              уже ведёшь реальные взносы — открывай Капитал.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/strategy" className="app-button">
              Перейти в стратегию
            </Link>
            <Link href="/capital" className="app-button">
              Перейти в капитал
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}