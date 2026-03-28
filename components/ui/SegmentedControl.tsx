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
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div className="relative inline-flex h-[36px] rounded-[12px] bg-[var(--background)] border border-[var(--border)] p-[2px]">
      
      {/* 🔥 Активная "плавающая" плашка */}
      <div
        className="absolute top-[2px] left-[2px] h-[32px] rounded-[10px] bg-white shadow-sm transition-all duration-200"
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex items-center justify-center px-4 text-[14px] font-medium transition w-[120px]
              ${
                isActive
                  ? "text-black"
                  : "text-[var(--text-secondary)]"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}