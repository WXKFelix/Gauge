export type AppTabId = "home" | "journey" | "nodes" | "metrics";

const TABS: { id: AppTabId; label: string; icon: string }[] = [
  { id: "home", label: "首页", icon: "⌂" },
  { id: "journey", label: "坐标", icon: "◎" },
  { id: "nodes", label: "节点", icon: "◈" },
  { id: "metrics", label: "指标", icon: "◔" },
];

export interface AppTabBarProps {
  active: AppTabId;
  onChange: (tab: AppTabId) => void;
  nodeBadge?: boolean;
}

export function AppTabBar({ active, onChange, nodeBadge }: AppTabBarProps) {
  return (
    <nav className="tab-bar" aria-label="主导航">
      <div className="tab-bar-inner" role="tablist">
        {TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              className={`tab-bar-item${selected ? " tab-bar-item--active" : ""}`}
              onClick={() => onChange(tab.id)}
            >
              <span className="tab-bar-icon" aria-hidden>
                {tab.icon}
                {tab.id === "nodes" && nodeBadge ? (
                  <span className="tab-bar-badge" aria-label="有新建议" />
                ) : null}
              </span>
              <span className="tab-bar-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
