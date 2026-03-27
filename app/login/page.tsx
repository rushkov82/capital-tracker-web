"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorText(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Вход</h1>
        <p className="app-page-subtitle">
          Войди, чтобы сохранять данные в облаке и открывать их с разных
          устройств
        </p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      <section className="app-card max-w-[520px]">
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="app-label">Email</label>
            <input
              className="app-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="app-label">Пароль</label>
            <input
              className="app-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link href="/signup" className="app-button">
              Регистрация
            </Link>

            <button type="submit" className="app-button" disabled={loading}>
              {loading ? "Входим..." : "Войти"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}