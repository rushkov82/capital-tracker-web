type StrategyFloatingSummaryProps = {
  visible: boolean;
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

export default function StrategyFloatingSummary({
  visible,
  nominalCapital,
  realCapital,
}: StrategyFloatingSummaryProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed left-4 right-4 z-40 transition-all duration-200 md:hidden"
      style={{
        top: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="rounded-[16px] border border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.14)] backdrop-blur">
        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <div className="app-text-small">Будет на счёте</div>
            <div
              className="truncate text-[22px] font-semibold leading-[1.1]"
              style={{ color: "var(--accent)" }}
            >
              {formatMoney(nominalCapital)} ₽
            </div>
          </div>

          <div className="min-w-0">
            <div className="app-text-small">В сегодняшних деньгах</div>
            <div
              className="truncate text-[22px] font-semibold leading-[1.1]"
              style={{ color: "var(--accent-blue)" }}
            >
              {formatMoney(realCapital)} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}