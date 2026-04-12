"use client";

type ForgotPasswordFormProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBackClick: () => void;
};

const greenButtonClass = "app-button w-full hover:opacity-95";
const greenButtonStyle = {
  backgroundColor: "var(--accent)",
  borderColor: "var(--accent)",
  color: "#ffffff",
} as const;
const buttonTopGapClass = "pt-[30px]";

export default function ForgotPasswordForm({
  email,
  onEmailChange,
  onSubmit,
  onBackClick,
}: ForgotPasswordFormProps) {
  return (
    <>
      <div>
        <h2 className="text-[24px] leading-[1.1] font-semibold">
          Восстановление пароля
        </h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Введите email, и мы отправим ссылку для восстановления.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="app-input"
            placeholder="Email"
            required
          />
        </div>

        <div className={buttonTopGapClass}>
          <button
            type="submit"
            className={greenButtonClass}
            style={greenButtonStyle}
          >
            Отправить ссылку
          </button>
        </div>
      </form>

      <div className="mt-5 text-[14px]">
        <button
          type="button"
          onClick={onBackClick}
          className="text-left text-[var(--text-secondary)] underline-offset-4 hover:underline"
        >
          Вернуться ко входу
        </button>
      </div>
    </>
  );
}
