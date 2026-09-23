import { useId } from "react";

export interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/** Brand mark: life arc + balance needle (量化人生). */
export function Logo({
  size = 48,
  showWordmark = false,
  className = "",
}: LogoProps) {
  const gradId = useId().replace(/:/g, "");
  const glowId = useId().replace(/:/g, "");
  return (
    <div
      className={`logo-brand${className ? ` ${className}` : ""}`}
      aria-label="量化人生"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-hidden={showWordmark ? undefined : true}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="rgba(15,23,42,0.9)"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
        />
        <path
          d="M 14 40 A 18 18 0 0 1 50 40"
          fill="none"
          stroke="#1e293b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 14 40 A 18 18 0 0 1 44 28"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="5"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />
        <line
          x1="32"
          y1="40"
          x2="42"
          y2="26"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="40" r="3.5" fill="#fbbf24" />
        <circle cx="18" cy="18" r="2" fill="#22d3ee" opacity="0.9" />
        <circle cx="48" cy="14" r="1.5" fill="#a855f7" opacity="0.85" />
      </svg>
      {showWordmark ? (
        <div className="logo-wordmark">
          <span className="logo-wordmark-title">量化人生</span>
          <span className="logo-wordmark-sub">Quantified Life</span>
        </div>
      ) : null}
    </div>
  );
}
