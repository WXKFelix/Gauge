import { useState } from "react";
import { createSession, saveSession, type UserSession } from "../auth";
import { Logo } from "./Logo";

export interface LoginPageProps {
  onLogin: (session: UserSession) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      const session = createSession(name || "旅人");
      saveSession(session);
      onLogin(session);
      setLoading(false);
    }, 520);
  };

  return (
    <div className="login-screen">
      <div className="login-orb login-orb--a" aria-hidden />
      <div className="login-orb login-orb--b" aria-hidden />
      <div className="login-grid" aria-hidden />

      <main className="login-card">
        <Logo size={96} showWordmark className="logo-brand--center login-hero-logo" />

        <form className="login-form" onSubmit={submit}>
          <input
            className="login-input"
            type="text"
            placeholder="昵称或姓名"
            aria-label="昵称或姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="nickname"
            maxLength={24}
          />
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "正在进入…" : "进入 BEARING"}
          </button>
        </form>
      </main>
    </div>
  );
}
