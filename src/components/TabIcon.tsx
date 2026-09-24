type TabIconId = "home" | "journey" | "nodes" | "metrics";

export interface TabIconProps {
  id: TabIconId;
  active?: boolean;
}

const size = 24;

export function TabIcon({ id, active = false }: TabIconProps) {
  const className = `tab-icon${active ? " tab-icon--active" : ""}`;
  const stroke = active ? "#22d3ee" : "#64748b";
  const fill = active ? "rgba(34, 211, 238, 0.15)" : "none";
  const accent = active ? "#fbbf24" : "#475569";

  switch (id) {
    case "home":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5h-6V20.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="1.2" fill={accent} />
        </svg>
      );
    case "journey":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M5 17c2-4 4-6 7-8s5-1 7 1"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 2"
          />
          <circle cx="5" cy="17" r="2.2" fill={fill} stroke={accent} strokeWidth="1.4" />
          <circle cx="12" cy="9" r="2" fill={fill} stroke={stroke} strokeWidth="1.4" />
          <circle cx="19" cy="10" r="2.2" fill={fill} stroke={stroke} strokeWidth="1.4" />
        </svg>
      );
    case "nodes":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M12 4v4M12 16v4M8 12H4M20 12h-4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3.2" fill={fill} stroke={accent} strokeWidth="1.6" />
          <circle cx="12" cy="4" r="1.6" fill={stroke} />
          <circle cx="12" cy="20" r="1.6" fill={stroke} />
          <circle cx="4" cy="12" r="1.6" fill={stroke} />
          <circle cx="20" cy="12" r="1.6" fill={stroke} />
        </svg>
      );
    case "metrics":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M5 17a7 7 0 1 1 14 0"
            fill="none"
            stroke="#334155"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M5 17a7 7 0 0 1 12-4"
            fill="none"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="17"
            x2="16"
            y2="10"
            stroke={accent}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="1.5" fill={accent} />
        </svg>
      );
  }
}
