import { TrendingDown, TrendingUp } from 'lucide-react';




// --- Badge Component (Replacing import from "../ui/badge/Badge") ---
const Badge = ({ children, color }) => {
  const baseClasses = "inline-flex items-center border gap-1.5 rounded-full px-3 py-1 text-xs font-medium";
  
  // Tailwind classes for success and error states
  const colorClasses = color === "success"
    ? "bg-green-100 text-green-700 dark:bg-green-800/60 dark:text-green-400"
    : "bg-red-100 text-red-700 dark:bg-red-800/60 dark:text-red-400";

  return <span className={`${baseClasses} ${colorClasses}`}>{children}</span>;
};


/**
 * Reusable component for displaying a single metric card.
 * @param {object} metric - The metric data object.
 * @param {string} metric.title - The title of the metric (e.g., "Customers").
 * @param {string} metric.value - The main metric value (e.g., "3,782").
 * @param {string} metric.percentage - The percentage change (e.g., "11.01%").
 * @param {boolean} metric.isPositive - True for success (up arrow), false for error (down arrow).
 * @param {React.ElementType} metric.Icon - The React component for the main icon.
 */
const MetricCard = ({ metric }) => {
  const IconComponent = metric.Icon;
  const isPositive = metric.isPositive;
  const BadgeIcon = isPositive ? TrendingUp : TrendingDown;
  const badgeColor = isPositive ? "success" : "error";

  return (
    <div
      className={`rounded-2xl border ${metric.borderColor} ${metric.bgColor ||  "bg-white"} 
      p-5 dark:border-gray-800 dark:bg-gray-900/50  
      transition duration-300 hover:shadow-md`}
    >
      {/* Icon Container */}
      {IconComponent &&
      <div
        className={`flex items-center justify-center w-12 h-12 
        bg-gradient-to-br ${metric.gradient} text-white rounded-xl`}
      >
        <IconComponent className="size-6" />
      </div>
}
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            {metric.title}
          </span>
          <h4 className={`mt-2 text-3xl font-extrabold `}>
            {metric.value}
          </h4>
        </div>
{metric.percentage && 
        <div className="flex flex-col items-end">
          <Badge color={badgeColor}>
            <BadgeIcon className="size-4" />
            {metric.percentage}
          </Badge>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
        }
      </div>
    </div>
  );
};
const SkeletonCard = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:bg-gray-800 
      animate-pulse p-5 h-[150px]"
    >
      {/* Icon Placeholder */}
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>

      {/* Title Placeholder */}
      <div className="mt-5 h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>

      {/* Value Placeholder */}
      <div className="mt-4 h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
};

/**
 * Main component to display an array of metrics.
 * @param {Array<object>} metrics - Array of metric data objects.
 */
 export const DashCards = ({ metrics, loading }) => {       
  const skeletonCount = 3; // Number of skeleton cards to show                                                                                                                                                    
    return (
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
{loading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
            {!loading && metrics.map((metric) => (
                
                <MetricCard key={metric.id} metric={metric} />
            ))}
        </div>
    );
};