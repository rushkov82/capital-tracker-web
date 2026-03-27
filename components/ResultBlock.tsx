type ResultBlockProps = {
  cardClass: string;
  nominalResult: string;
  realResult: string;
  errorText: string;
};

export default function ResultBlock({
  cardClass,
  nominalResult,
  realResult,
  errorText,
}: ResultBlockProps) {
  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-5">Результат</h2>

      <div className="space-y-3">
        <ResultRow
          label="Номинальный капитал"
          value={nominalResult}
          valueClassName="text-sky-500"
        />
        <ResultRow
          label="Реальный капитал"
          value={realResult}
          valueClassName="text-emerald-500"
        />

        {errorText && <p className="app-error-text pt-1">{errorText}</p>}
      </div>
    </section>
  );
}

function ResultRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="app-list-row">
      <span className="app-label">{label}</span>
      <span className={`app-text ${valueClassName || ""}`}>
        {value}
      </span>
    </div>
  );
}