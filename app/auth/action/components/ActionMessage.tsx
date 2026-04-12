"use client";

type ActionMessageProps = {
  title: string;
  text: string;
  buttonText: string;
  onButtonClick: () => void;
};

const greenButtonClass = "app-button w-full hover:opacity-95";
const greenButtonStyle = {
  backgroundColor: "var(--accent)",
  borderColor: "var(--accent)",
  color: "#ffffff",
} as const;

export default function ActionMessage({
  title,
  text,
  buttonText,
  onButtonClick,
}: ActionMessageProps) {
  return (
    <>
      <div>
        <h2 className="text-[24px] leading-[1.1] font-semibold">{title}</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          {text}
        </p>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onButtonClick}
          className={greenButtonClass}
          style={greenButtonStyle}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}
