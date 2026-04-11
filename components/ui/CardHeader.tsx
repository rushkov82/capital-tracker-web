import InfoHint from "@/components/ui/InfoHint";

type CardHeaderProps = {
  title: string;
  hintTitle?: string;
  hintContent?: string;
  rightSlot?: React.ReactNode;
  rightSlotMode?: "inline" | "absolute";
};

export default function CardHeader({
  title,
  hintTitle,
  hintContent,
  rightSlot,
  rightSlotMode = "inline",
}: CardHeaderProps) {
  const slot =
    rightSlot ??
    (hintContent ? (
      <InfoHint
        title={hintTitle || "Что это значит"}
        content={hintContent}
      />
    ) : null);

  const hasAbsoluteRight = Boolean(slot) && rightSlotMode === "absolute";

  return (
    <div
      className={[
        "app-card-header",
        hasAbsoluteRight ? "app-card-header-with-absolute-right" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="app-card-header-title-wrap">
        <div className="app-card-title">{title}</div>
      </div>

      {slot ? (
        <div
          className={
            hasAbsoluteRight
              ? "app-card-header-right app-card-header-right-absolute"
              : "app-card-header-right"
          }
        >
          {slot}
        </div>
      ) : null}
    </div>
  );
}