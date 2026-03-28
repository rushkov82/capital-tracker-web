type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
};

export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-[12px] border border-[var(--border)] bg-[var(--background)] p-1">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              isActive
                ? "h-[36px] min-w-[128px] px-4 rounded-[10px] border border-[var(--border)] bg-[var(--card)] text-[14px] font-medium text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition"
                : "h-[36px] min-w-[128px] px-4 rounded-[10px] text-[14px] font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}