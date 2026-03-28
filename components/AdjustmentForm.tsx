type AdjustmentFormProps = {
  cardClass: string;
  commonInputClass: string;
  amount: string;
  setAmount: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  onSave: () => void;
};

export default function AdjustmentForm({
  cardClass,
  commonInputClass,
  amount,
  setAmount,
  date,
  setDate,
  comment,
  setComment,
  onSave,
}: AdjustmentFormProps) {
  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-2">Корректировка капитала</h2>

      <div className="app-text-small mb-3">
        Используется для учёта изменения стоимости активов
      </div>

      <div className="space-y-3">
        <FormRow label="Сумма корректировки" hint="₽">
          <input
            className={commonInputClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Например: -1500 или 2000"
          />
        </FormRow>

        <FormRow label="Дата">
          <input
            type="date"
            className={commonInputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormRow>

        <FormRow label="Комментарий" hint="необязательно">
          <input
            className={commonInputClass}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: просадка рынка"
          />
        </FormRow>

        <div className="flex justify-end pt-2">
          <button onClick={onSave} className="app-button">
            Добавить корректировку
          </button>
        </div>
      </div>
    </section>
  );
}

function FormRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <label className="app-label">{label}</label>
        {hint ? <span className="app-text-small">{hint}</span> : <span />}
      </div>
      {children}
    </div>
  );
}