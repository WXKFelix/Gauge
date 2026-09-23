import { useState } from "react";
import { clearSession, loadSession, type UserSession } from "./auth";
import { LoginPage } from "./components/LoginPage";
import { MainApp } from "./MainApp";

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() =>
    typeof window !== "undefined" ? loadSession() : null
  );

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  return (
    <MainApp
      session={session}
      onLogout={() => {
        clearSession();
        setSession(null);
      }}
    />
  );
}
