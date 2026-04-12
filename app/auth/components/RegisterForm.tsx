"use client";

type RegisterFormProps = {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  passwordMismatch: boolean;
  error: string;
  isSubmitting: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordRepeatChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLoginClick: () => void;
};

const greenButtonClass = "app-button w-full hover:opacity-95";
const greenButtonStyle = {
  backgroundColor: "var(--accent)",
  borderColor: "var(--accent)",
  color: "#ffffff",
} as const;

const buttonTopGapClass = "pt-[30px]";

export default function RegisterForm({
  name,
  email,
  password,
  passwordRepeat,
  passwordMismatch,
  error,
  isSubmitting,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPasswordRepeatChange,
  onSubmit,
  onLoginClick,
}: RegisterFormProps) {
  return (
    <>
      <div>
        <h2 className="text-[24px] leading-[1.1] font-semibold">
          Регистрация
        </h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Создай аккаунт, чтобы сохранять свои накопления.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="register-name"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Имя
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="nickname"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="app-input"
            placeholder="Имя"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Email
          </label>
          <input
            id="register-email"
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
            htmlFor="register-password"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Пароль
          </label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="app-input"
            placeholder="Пароль"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-password-repeat"
            className="mb-2 block text-[14px] text-[var(--text-secondary)]"
          >
            Повторить пароль
          </label>
          <input
            id="register-password-repeat"
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
            disabled={passwordMismatch || isSubmitting}
            className={`${greenButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
            style={greenButtonStyle}
          >
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </div>

        {error && (
          <div className="text-[12px] leading-[16px] text-[var(--danger)]">
            {error}
          </div>
        )}
      </form>

      <div className="mt-5 text-[14px]">
        <button
          type="button"
          onClick={onLoginClick}
          className="text-left text-[var(--text-secondary)] underline-offset-4 hover:underline"
        >
          Уже есть аккаунт? Войти
        </button>
      </div>
    </>
  );
}
