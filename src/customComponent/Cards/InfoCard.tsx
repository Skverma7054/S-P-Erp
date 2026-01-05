const InfoRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <Icon className="size-5" />
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="font-medium text-gray-800 dark:text-white">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

export const InfoCard = ({ title, items, columns = 4,  }) => {
    const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2";
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition duration-300 hover:shadow-md">
      <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>

      <div className={`grid gap-6 ${gridCols}`}>
        {items.map((item, index) => (
          <InfoRow
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};
