import React from "react";

type ProgressCardProps = {
  title?: string;
  subtitle?: string;
  chainage?: string;
  contractValue?: string;
  amountPaid?: string;
  balance?: string;
  duration?: string;
  progress?: number;
  loading?: boolean;
};

const ProgressCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl border p-6 animate-pulse flex flex-col gap-6">

      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-5 w-40 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-28 bg-gray-300 rounded"></div>
        </div>

        <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
      </div>

      {/* Grid Section Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>

        <div>
          <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>

        <div>
          <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>

        <div>
          <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-28 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Progress Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 w-28 bg-gray-300 rounded"></div>
          <div className="h-3 w-10 bg-gray-300 rounded"></div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gray-300 h-3 rounded-full w-1/2"></div>
        </div>
      </div>

    </div>
  );
};

const ProgressCard = ({
  title,
  subtitle,
  chainage,
  contractValue,
  amountPaid,
  balance,
  duration,
  progress = 0,
  loading = false,
}: ProgressCardProps) => {

  if (loading) return <ProgressCardSkeleton />;

  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl mb-1">{title}</h3>
          <p className="text-slate-600">{subtitle}</p>
        </div>

        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
          {chainage}
        </span>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-slate-600 text-sm mb-1">Contract Value</p>
          <p className="font-medium">₹{contractValue}</p>
        </div>

        <div>
          <p className="text-slate-600 text-sm mb-1">Amount Paid</p>
          <p className="font-medium text-green-600">₹{amountPaid}</p>
        </div>

        <div>
          <p className="text-slate-600 text-sm mb-1">Balance</p>
          <p className="font-medium text-orange-600">₹{balance}</p>
        </div>

        <div>
          <p className="text-slate-600 text-sm mb-1">Duration</p>
          <p className="font-medium text-sm">{duration}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-slate-600">Payment Progress</p>
          <p className="text-sm">{progress}%</p>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

    </div>
  );
};

export default ProgressCard;
