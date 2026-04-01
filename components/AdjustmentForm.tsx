type AdjustmentFormProps = {
  cardClass: string;
  commonInputClass: string;
  selectClass: string;
  categories: string[];
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  onSave: () => void;
};

export default function AdjustmentForm({
  cardClass,
  commonInputClass,
  selectClass,
  categories,
  amount,
  setAmount,
  category,
  setCategory,
  date,
  setDate,
  comment,
  setComment,
  onSave,
}: AdjustmentFormProps) {
  return (
    <section className={cardClass}>
      <h3 className="app-card-title mb-2">Переоценка</h3>

      <div className="app-text-small mb-3">
        Учёт изменения стоимости активов
      </div>

      <div className="space-y-3">
        <FormRow label="Сумма переоценки" hint="₽">
          <input
            className={commonInputClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Например: -1500 или 2000"
          />
        </FormRow>

        <FormRow label="Категория">
          <select
            className={selectClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
            placeholder="Например: просадка по акциям"
          />
        </FormRow>

        <div className="flex justify-end pt-2">
          <button onClick={onSave} className="app-button">
            Сохранить
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