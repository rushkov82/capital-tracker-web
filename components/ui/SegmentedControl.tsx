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
  const activeIndex = options.findIndex((option) => option.value === value);
  const segmentWidth = 100 / options.length;

  // 🔥 универсально: если второй сегмент — значит "вывод"
  const isWithdraw = activeIndex === 1;

  const activeColor = isWithdraw
    ? "#ef4444" // красный
    : "var(--accent)"; // зелёный

  return (
    <div
      className="relative inline-grid rounded-[12px] border border-[var(--border)] bg-[var(--background)] p-[3px]"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(120px, 1fr))`,
      }}
    >
      {/* активная плашка */}
      <div
        className="absolute top-[3px] bottom-[3px] rounded-[10px] transition-all duration-200 ease-out shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        style={{
          left: `calc(${activeIndex * segmentWidth}% + 3px)`,
          width: `calc(${segmentWidth}% - 6px)`,
          background: activeColor,
        }}
      />

      {options.map((option, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative z-10 h-[36px] px-4 rounded-[10px] text-[14px] font-medium transition ${
              isActive
                ? "text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}