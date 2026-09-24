import { Logo } from "./Logo";

export interface HomeWelcomeProps {
  displayName: string;
  stageLabel: string;
  meaningScore: number;
}

export function HomeWelcome({
  displayName,
  stageLabel,
  meaningScore,
}: HomeWelcomeProps) {
  return (
    <header className="home-welcome">
      <div className="home-welcome-glow" aria-hidden />
      <div className="home-welcome-inner">
        <Logo size={56} className="home-welcome-logo" />
        <div className="home-welcome-copy">
          <p className="home-welcome-hello">你好，{displayName}</p>
          <h1 className="home-welcome-title">Gauge 仪表盘</h1>
          <p className="home-welcome-meta">
            当前阶段 <strong>{stageLabel}</strong> · 意义分{" "}
            <strong>{Math.round(meaningScore)}</strong>
          </p>
        </div>
      </div>
    </header>
  );
}
