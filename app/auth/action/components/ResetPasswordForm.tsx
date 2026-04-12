"use client";

type ResetPasswordFormProps = {
  password: string;
  passwordRepeat: string;
  passwordMismatch: boolean;
  onPasswordChange: (value: string) => void;
  onPasswordRepeatChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const greenButtonClass = "app-button w-full hover:opacity-95";
const greenButtonStyle = {
  backgroundColor: "var(--accent)",
  borderColor: "var(--accent)",
  color: "#ffffff",
} as const;

const buttonTopGapClass = "pt-[30px]";

export default function ResetPasswordForm({
  password,
  passwordRepeat,
  passwordMismatch,
  onPasswordChange,
  onPasswordRepeatChange,
  onSubmit,
}: ResetPasswordFormProps) {
  return (
    <>
      <div>
        <h2 className="text-[24px] leading-[1.1] font-semibold">
          Новый пароль
        </h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Введите новый пароль для своего аккаунта.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="reset-password"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Новый пароль
          </label>
          <input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="app-input"
            placeholder="Новый пароль"
            required
          />
        </div>

        <div>
          <label
            htmlFor="reset-password-repeat"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Повторить пароль
          </label>
          <input
            id="reset-password-repeat"
            type="password"
            autoComplete="new-password"
            value={passwordRepeat}
            onChange={(e) => onPasswordRepeatChange(e.target.value)}
            className="app-input"
            placeholder="Повторить пароль"
            required
          />
          {passwordMismatch && (
            <div className="mt-2 text-[12px] leading-[16px] text-[var(--danger)]">
              Пароли не совпадают
            </div>
          )}
        </div>

        <div className={buttonTopGapClass}>
          <button
            type="submit"
            disabled={passwordMismatch}
            className={`${greenButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
            style={greenButtonStyle}
          >
            Сохранить пароль
          </button>
        </div>
      </form>
    </>
  );
}
