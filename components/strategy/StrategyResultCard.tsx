"use client";

import CardHeader from "@/components/ui/CardHeader";

type StrategyResultCardProps = {
  years: string;
  nominalCapital: number;
  realCapital: number;
  getYearsWord: (value: number) => string;
};

function formatMoney(value: number) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded));

  const parts: string[] = [];
  for (let i = digits.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    parts.unshift(digits.slice(start, i));
  }

  return `${sign}${parts.join(" ")}`;
}

function toInt(value: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

export default function StrategyResultCard({
  years,
  nominalCapital,
  realCapital,
  getYearsWord,
}: StrategyResultCardProps) {
  const yearsNumber = toInt(years);
  const yearsLabel =
    yearsNumber > 0 ? `${yearsNumber} ${getYearsWord(yearsNumber)}` : "срок";

  return (
    <section className="app-card">
      <div className="app-card-stack">
        <CardHeader
          title={`Твой капитал через ${yearsLabel}`}
          hintTitle="Как это считается"
          hintContent={`Это прогноз по текущим параметрам, а не гарантия.

Что учитывается:
• ежемесячный взнос
• ежегодное увеличение взноса
• срок накопления
• доходность структуры
• инфляция

Как считается:
1. Система моделирует регулярные пополнения на всём сроке.
2. На накопленную сумму начисляется ожидаемая доходность портфеля.
3. Для блока «В сегодняшних деньгах» результат дополнительно корректируется на инфляцию.

Важно:
• если доходность будет ниже — итог тоже будет ниже
• если инфляция будет выше — покупательная сила результата будет ниже
• это ориентир для планирования, а не обещание точной суммы`}
          rightSlotMode="absolute"
        />

        <div className="space-y-1">
          <div className="text-[14px] leading-[18px] font-medium text-[var(--accent)]">
            Будет на счёте
          </div>
          <div className="app-metric-primary text-[var(--accent)]">
            {formatMoney(nominalCapital)} ₽
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[14px] leading-[18px] font-medium text-[var(--accent-blue)]">
            В сегодняшних деньгах
          </div>
          <div className="app-metric-primary text-[var(--accent-blue)]">
            {formatMoney(realCapital)} ₽
          </div>
        </div>
      </div>
    </section>
  );
}