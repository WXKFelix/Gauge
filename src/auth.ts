export const SESSION_KEY = "quantified-life:session";

export interface UserSession {
  displayName: string;
  loggedInAt: string;
}

export function loadSession(): UserSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as UserSession;
    if (!data.displayName?.trim()) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function createSession(displayName: string): UserSession {
  return {
    displayName: displayName.trim() || "旅人",
    loggedInAt: new Date().toISOString(),
  };
}
