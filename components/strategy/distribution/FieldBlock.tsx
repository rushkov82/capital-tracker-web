export default function FieldBlock({
  title,
  subtitle,
  value,
  onChange,
  readOnly = false,
}: {
  title: string;
  subtitle: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="min-h-[34px] flex flex-col justify-end">
        {title ? <label className="app-label">{title}</label> : <div className="h-[20px]" />}
        <span className="app-text-small">{subtitle}</span>
      </div>

      <input
        className={`app-input ${readOnly ? "app-input-readonly" : ""}`}
        value={value}
        readOnly={readOnly}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}