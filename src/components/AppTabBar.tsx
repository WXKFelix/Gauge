import { TabIcon } from "./TabIcon";

export type AppTabId =
  | "home"
  | "navigator"
  | "journey"
  | "nodes"
  | "metrics";

const TABS: { id: AppTabId; label: string }[] = [
  { id: "home", label: "首页" },
  { id: "navigator", label: "领航" },
  { id: "journey", label: "坐标" },
  { id: "nodes", label: "节点" },
  { id: "metrics", label: "指标" },
];

export interface AppTabBarProps {
  active: AppTabId;
  onChange: (tab: AppTabId) => void;
  nodeBadge?: boolean;
  navigatorBadge?: boolean;
}

export function AppTabBar({
  active,
  onChange,
  nodeBadge,
  navigatorBadge,
}: AppTabBarProps) {
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
                <TabIcon id={tab.id} active={selected} />
                {tab.id === "nodes" && nodeBadge ? (
                  <span className="tab-bar-badge" aria-label="有新建议" />
                ) : null}
                {tab.id === "navigator" && navigatorBadge ? (
                  <span className="tab-bar-badge" aria-label="有待办" />
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
