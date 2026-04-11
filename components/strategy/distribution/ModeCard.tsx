type ModeCardProps = {
  title: string;
  description: string;
  yieldText?: string;
  isApplied: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export default function ModeCard({
  title,
  description,
  yieldText,
  isApplied,
  isSelected,
  onClick,
}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative w-full rounded-2xl border p-4 text-left transition",
        "focus:outline-none",
        isSelected
          ? "border-[var(--accent-blue)] bg-[rgba(56,189,248,0.08)]"
          : "border-[var(--border)] bg-transparent hover:bg-[var(--card)]",
      ].join(" ")}
      aria-pressed={isSelected}
    >
      <div className="pr-2">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 min-w-0">
            <div
              className="text-[16px] leading-[20px] md:text-[13px] md:leading-[16px] font-semibold truncate"
              style={{
                color: isApplied ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {title}
            </div>

            {yieldText ? (
              <>
                <span
                  className="block h-[3px] w-[3px] rounded-full shrink-0"
                  style={{
                    background: isApplied
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  }}
                />

                <div
                  className="text-[16px] leading-[20px] md:text-[13px] md:leading-[16px] font-semibold shrink-0"
                  style={{
                    color: isApplied
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  }}
                >
                  {yieldText}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="app-text-small mt-2">{description}</div>
      </div>
    </button>
  );
}