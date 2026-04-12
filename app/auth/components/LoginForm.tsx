"use client";

type LoginFormProps = {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onForgotClick: () => void;
  onRegisterClick: () => void;
  onDemoClick: () => void;
};

const greenButtonClass = "app-button w-full hover:opacity-95";
const greenButtonStyle = {
  backgroundColor: "var(--accent)",
  borderColor: "var(--accent)",
  color: "#ffffff",
} as const;
const buttonTopGapClass = "pt-[30px]";

export default function LoginForm({
  email,
  password,
  error,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotClick,
  onRegisterClick,
  onDemoClick,
}: LoginFormProps) {
  return (
    <>
      <div>
        <h2 className="text-[24px] leading-[1.1] font-semibold">Вход</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Войти, чтобы внесенные данные сохранялись
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="app-input"
            placeholder="Email"
            required
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="app-input"
            placeholder="Пароль"
            required
          />
        </div>

        <div className={buttonTopGapClass}>
          <button
            type="submit"
            className={greenButtonClass}
            style={greenButtonStyle}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </div>

        {error && (
          <div className="text-[12px] leading-[16px] text-[var(--danger)]">
            {error}
          </div>
        )}
      </form>

      <div className="mt-5 flex flex-col gap-3 text-[14px]">
        <button
          type="button"
          onClick={onForgotClick}
          className="text-left text-[var(--text-secondary)] underline-offset-4 hover:underline"
        >
          Забыли пароль?
        </button>

        <button
          type="button"
          onClick={onRegisterClick}
          className="text-left text-[var(--text-secondary)] underline-offset-4 hover:underline"
        >
          Нет аккаунта? Зарегистрироваться
        </button>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-5">
        <button
          type="button"
          onClick={onDemoClick}
          className="text-[14px] text-[var(--text-secondary)] underline-offset-4 hover:underline"
        >
          Продолжить без входа и регистрации
        </button>
      </div>
    </>
  );
}
