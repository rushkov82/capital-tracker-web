"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "./components/AuthShell";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import EmailSentState from "./components/EmailSentState";
import DemoWarning from "./components/DemoWarning";
import {
  clearDemoStorage,
  hasDemoData,
  readDemoOperations,
  readDemoPlan,
} from "@/lib/demo-storage";
import type { Operation } from "@/lib/operations";

type AuthMode =
  | "login"
  | "register"
  | "forgot"
  | "email_sent_register"
  | "email_sent_reset"
  | "demo_warning";

type RegisterResponse = {
  ok?: boolean;
  error?: string;
};

type LoginResponse = {
  ok?: boolean;
  error?: string;
};

type ForgotPasswordResponse = {
  ok?: boolean;
  error?: string;
};

type RawPlanResponse =
  | {
      monthlyContribution?: string;
      inflation?: string;
      contributionGrowth?: string;
      years?: string;
    }
  | null;

async function tryMigrateDemoDataAfterLogin() {
  if (!hasDemoData()) {
    return;
  }

  try {
    const [planResponse, operationsResponse] = await Promise.all([
      fetch("/api/plan", {
        method: "GET",
        cache: "no-store",
      }),
      fetch("/api/operations", {
        method: "GET",
        cache: "no-store",
      }),
    ]);

    if (!planResponse.ok || !operationsResponse.ok) {
      clearDemoStorage();
      return;
    }

    const remotePlan = (await planResponse.json()) as RawPlanResponse;
    const remoteOperations = (await operationsResponse.json()) as Operation[];

    const accountHasData =
      remotePlan !== null || (Array.isArray(remoteOperations) && remoteOperations.length > 0);

    if (accountHasData) {
      clearDemoStorage();
      return;
    }

    const demoPlan = readDemoPlan();
    const demoOperations = readDemoOperations();

    await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(demoPlan),
    });

    for (const operation of demoOperations) {
      await fetch("/api/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: operation.amount,
          comment: operation.comment,
          operation_date: operation.operation_date,
          asset_category: operation.asset_category,
          type: operation.type,
        }),
      });
    }

    clearDemoStorage();
  } catch {
    // молча, как и договаривались
  }
}

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordRepeat, setRegisterPasswordRepeat] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  const registerPasswordMismatch = useMemo(() => {
    if (!registerPassword || !registerPasswordRepeat) return false;
    return registerPassword !== registerPasswordRepeat;
  }, [registerPassword, registerPasswordRepeat]);

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoginSubmitting) return;

    setLoginError("");
    setIsLoginSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setLoginError(data.error ?? "Не удалось выполнить вход.");
        return;
      }

      await tryMigrateDemoDataAfterLogin();
      router.push("/app/overview");
    } catch {
      setLoginError("Не удалось выполнить вход.");
    } finally {
      setIsLoginSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (registerPasswordMismatch || isRegisterSubmitting) {
      return;
    }

    setRegisterError("");
    setIsRegisterSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setRegisterError(data.error ?? "Не удалось зарегистрироваться.");
        return;
      }

      setMode("email_sent_register");
    } catch {
      setRegisterError("Не удалось зарегистрироваться.");
    } finally {
      setIsRegisterSubmitting(false);
    }
  }

  async function handleForgotSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setForgotError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      });

      const data = (await response.json()) as ForgotPasswordResponse;

      if (!response.ok) {
        setForgotError(data.error ?? "Не удалось отправить ссылку.");
        return;
      }

      setMode("email_sent_reset");
    } catch {
      setForgotError("Не удалось отправить ссылку.");
    }
  }

  function handleEnterDemo() {
    try {
      localStorage.setItem("captrack_mode", "demo");
    } catch {}
    router.push("/app/overview");
  }

  return (
    <AuthShell>
      {mode === "login" && (
        <LoginForm
          email={loginEmail}
          password={loginPassword}
          error={loginError}
          isSubmitting={isLoginSubmitting}
          onEmailChange={(value) => {
            setLoginEmail(value);
            setLoginError("");
          }}
          onPasswordChange={(value) => {
            setLoginPassword(value);
            setLoginError("");
          }}
          onSubmit={handleLoginSubmit}
          onForgotClick={() => setMode("forgot")}
          onRegisterClick={() => setMode("register")}
          onDemoClick={() => setMode("demo_warning")}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          name={registerName}
          email={registerEmail}
          password={registerPassword}
          passwordRepeat={registerPasswordRepeat}
          passwordMismatch={registerPasswordMismatch}
          error={registerError}
          isSubmitting={isRegisterSubmitting}
          onNameChange={setRegisterName}
          onEmailChange={(value) => {
            setRegisterEmail(value);
            setRegisterError("");
          }}
          onPasswordChange={(value) => {
            setRegisterPassword(value);
            setRegisterError("");
          }}
          onPasswordRepeatChange={(value) => {
            setRegisterPasswordRepeat(value);
            setRegisterError("");
          }}
          onSubmit={handleRegisterSubmit}
          onLoginClick={() => {
            setRegisterError("");
            setMode("login");
          }}
        />
      )}

      {mode === "forgot" && (
        <>
          <ForgotPasswordForm
            email={forgotEmail}
            onEmailChange={(value) => {
              setForgotEmail(value);
              setForgotError("");
            }}
            onSubmit={handleForgotSubmit}
            onBackClick={() => setMode("login")}
          />

          {forgotError && (
            <div className="mt-4 text-[12px] leading-[16px] text-[var(--danger)]">
              {forgotError}
            </div>
          )}
        </>
      )}

      {mode === "email_sent_register" && (
        <EmailSentState
          text="Письмо для подтверждения email отправлено. После подтверждения можно будет войти в аккаунт."
          buttonText="Перейти ко входу"
          onButtonClick={() => setMode("login")}
        />
      )}

      {mode === "email_sent_reset" && (
        <EmailSentState
          text="Если такой email существует, мы отправили ссылку для восстановления пароля."
          buttonText="Вернуться ко входу"
          onButtonClick={() => setMode("login")}
        />
      )}

      {mode === "demo_warning" && (
        <DemoWarning
          onRegisterClick={() => setMode("register")}
          onContinueClick={handleEnterDemo}
          onBackClick={() => setMode("login")}
        />
      )}
    </AuthShell>
  );
}
