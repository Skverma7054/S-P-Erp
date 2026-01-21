type TabItem = {
  key: string;
  label: string;
  count?: number;
};

type HeaderTabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
};

export default function HeaderTabs({
  tabs,
  activeTab,
  onChange,
}: HeaderTabsProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 w-fit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
              ${
                isActive
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
          >
            {tab.label}

            {typeof tab.count === "number" && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-semibold
                  ${
                    isActive
                      ? "bg-brand-50 text-brand-600"
                      : "bg-white text-gray-600"
                  }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
