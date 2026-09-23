import { Gauge } from "./Gauge";

export interface HeroMeaningCardProps {
  meaningScore: number;
  stageLabel: string;
  stageProgress: number;
  age: number;
  gaugeSize: number;
}

export function HeroMeaningCard({
  meaningScore,
  stageLabel,
  stageProgress,
  age,
  gaugeSize,
}: HeroMeaningCardProps) {
  return (
    <section className="hero-card" aria-label="人生意义总览">
      <div className="hero-card-glow" aria-hidden />
      <div className="hero-card-body">
        <Gauge
          label="人生意义分"
          value={meaningScore}
          min={0}
          max={100}
          unit="分"
          size={gaugeSize}
          featured
        />
        <ul className="hero-stats">
          <li>
            <span className="hero-stats-label">阶段</span>
            <span className="hero-stats-value">{stageLabel}</span>
          </li>
          <li>
            <span className="hero-stats-label">年龄</span>
            <span className="hero-stats-value">{age} 岁</span>
          </li>
          <li>
            <span className="hero-stats-label">进度</span>
            <span className="hero-stats-value">{stageProgress.toFixed(0)}%</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
