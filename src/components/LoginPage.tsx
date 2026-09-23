import { useState } from "react";
import { createSession, saveSession, type UserSession } from "../auth";
import { APP_MISSION } from "../metric-copy";
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
        <Logo size={88} showWordmark className="logo-brand--center" />
        <p className="login-tagline">{APP_MISSION}</p>

        <form className="login-form" onSubmit={submit}>
          <label className="login-field">
            <span>怎么称呼你</span>
            <input
              type="text"
              placeholder="昵称或姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="nickname"
              maxLength={24}
            />
          </label>
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "正在进入…" : "进入量化人生"}
          </button>
        </form>

        <p className="login-foot">
          数据保存在本机 · 无需注册即可体验 MVP
        </p>
      </main>
    </div>
  );
}
