import { Suspense } from "react";
import AuthActionClient from "./AuthActionClient";

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[15px] text-[var(--text-secondary)]">
          Проверяем ссылку...
        </div>
      }
    >
      <AuthActionClient />
    </Suspense>
  );
}
