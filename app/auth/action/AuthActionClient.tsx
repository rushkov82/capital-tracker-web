"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "../components/AuthShell";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ActionMessage from "./components/ActionMessage";

type ActionMode =
  | "confirm_loading"
  | "confirmed"
  | "confirm_error"
  | "reset"
  | "reset_success"
  | "invalid";

type ConfirmEmailResponse = {
  ok?: boolean;
  error?: string;
   alreadyConfirmed?: boolean;
};

type ResetPasswordResponse = {
  ok?: boolean;
  error?: string;
};

export default function AuthActionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawMode = searchParams.get("mode");
  const token = searchParams.get("token") ?? "";
  const [confirmAttempt, setConfirmAttempt] = useState(0);

  const initialMode: ActionMode = (() => {
    if (rawMode === "reset") return "reset";
    if (rawMode === "invalid") return "invalid";
    if (rawMode === "confirm-email") return "confirm_loading";
    return "confirmed";
  })();

  const [mode, setMode] = useState<ActionMode>(initialMode);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  const passwordMismatch = useMemo(() => {
    if (!password || !passwordRepeat) return false;
    return password !== passwordRepeat;
  }, [password, passwordRepeat]);

  useEffect(() => {
    let cancelled = false;

    async function confirmEmail() {
      if (rawMode !== "confirm-email") return;

      if (!token) {
        if (!cancelled) setMode("invalid");
        return;
      }

      try {
        const response = await fetch("/api/auth/confirm-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = (await response.json()) as ConfirmEmailResponse;

        if (!response.ok) {
          if (response.status >= 500) {
            console.error("Confirm email failed (server error):", data.error);
            if (!cancelled) setMode("confirm_error");
            return;
          }

          console.error("Confirm email failed:", data.error);
          if (!cancelled) setMode("invalid");
          return;
        }

        if (!cancelled) {
          setMode("confirmed");
        }
      } catch {
        if (!cancelled) setMode("confirm_error");
      }
    }

    void confirmEmail();

    return () => {
      cancelled = true;
    };
  }, [rawMode, token, confirmAttempt]);

  async function handleResetSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordMismatch || isResetSubmitting) return;

    if (!token) {
      setMode("invalid");
      return;
    }

    setResetError("");
    setIsResetSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = (await response.json()) as ResetPasswordResponse;

      if (!response.ok) {
        setResetError(data.error ?? "Не удалось обновить пароль.");
        return;
      }

      setMode("reset_success");
    } catch {
      setResetError("Не удалось обновить пароль.");
    } finally {
      setIsResetSubmitting(false);
    }
  }

  function handleGoToLogin() {
    router.push("/auth");
  }

  async function handleConfirmRetry() {
    setMode("confirm_loading");
    setConfirmAttempt((value) => value + 1);
  }

  return (
    <AuthShell>
      {mode === "confirm_loading" && (
        <ActionMessage
          title="Проверяем ссылку"
          text="Подождите, подтверждаем вашу почту."
          buttonText="Вернуться ко входу"
          onButtonClick={handleGoToLogin}
        />
      )}

      {mode === "confirm_error" && (
        <ActionMessage
          title="Не удалось подтвердить"
          text="Произошла временная ошибка. Попробуйте ещё раз."
          buttonText="Попробовать снова"
          onButtonClick={handleConfirmRetry}
        />
      )}

      {mode === "confirmed" && (
        <ActionMessage
          title="Почта подтверждена"
          text="Теперь можно войти в аккаунт и сохранять свои данные."
          buttonText="Перейти ко входу"
          onButtonClick={handleGoToLogin}
        />
      )}

      {mode === "reset" && (
        <>
          <ResetPasswordForm
            password={password}
            passwordRepeat={passwordRepeat}
            passwordMismatch={passwordMismatch}
            onPasswordChange={(value) => {
              setPassword(value);
              setResetError("");
            }}
            onPasswordRepeatChange={(value) => {
              setPasswordRepeat(value);
              setResetError("");
            }}
            onSubmit={handleResetSubmit}
          />

          {resetError && (
            <div className="mt-4 text-[12px] leading-[16px] text-[var(--danger)]">
              {resetError}
            </div>
          )}

          {isResetSubmitting && (
            <div className="mt-3 text-[12px] leading-[16px] text-[var(--text-secondary)]">
              Сохраняем пароль...
            </div>
          )}
        </>
      )}

      {mode === "reset_success" && (
        <ActionMessage
          title="Пароль обновлён"
          text="Теперь можно войти в аккаунт с новым паролем."
          buttonText="Перейти ко входу"
          onButtonClick={handleGoToLogin}
        />
      )}

      {mode === "invalid" && (
        <ActionMessage
          title="Ссылка недействительна"
          text="Ссылка устарела, уже использована или содержит ошибку. Запросите новую."
          buttonText="Вернуться ко входу"
          onButtonClick={handleGoToLogin}
        />
      )}
    </AuthShell>
  );
}
