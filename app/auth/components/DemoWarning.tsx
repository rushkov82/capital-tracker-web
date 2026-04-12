"use client";

type DemoWarningProps = {
  onRegisterClick: () => void;
  onContinueClick: () => void;
  onBackClick: () => void;
};

const greenButtonClass = "app-button w-full hover:opacity-95";
const greenButtonStyle = {
  backgroundColor: "var(--accent)",
  borderColor: "var(--accent)",
  color: "#ffffff",
} as const;

export default function DemoWarning({
  onRegisterClick,
  onContinueClick,
  onBackClick,
}: DemoWarningProps) {
  return (
    <>
      <div>
        <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Без входа в аккаунт можно попробовать все функции, но введенные данные
          не сохранятся.
          <br />
          Чтобы сохранять данные и возвращаться к ним позже, нужно войти или
          зарегистрироваться.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onRegisterClick}
          className={greenButtonClass}
          style={greenButtonStyle}
        >
          Войти или зарегистрироваться
        </button>

        <button
          type="button"
          onClick={onContinueClick}
          className="app-button-secondary w-full"
        >
          Продолжить без регистрации
        </button>

        <button
          type="button"
          onClick={onBackClick}
          className="block w-full text-center text-[14px] text-[var(--text-secondary)] underline-offset-4 hover:underline"
        >
          Вернуться назад
        </button>
      </div>
    </>
  );
}
