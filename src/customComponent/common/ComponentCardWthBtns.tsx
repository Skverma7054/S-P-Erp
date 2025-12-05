import React from "react";
import { Search, Plus, Download, LayoutList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../DropDown/Select";
// import DatePicker from "../form/date-picker";

interface ComponentCardProps {
  title?: string;
  desc?: string;
  className?: string;
  showSearch?: boolean;
  showTabs?: boolean;
  showDownload?: boolean;
  showAddButton?: boolean;
  showDropdown?: boolean;
  showDate?: boolean;
  range?: boolean;
  dropdownOptions?: { label: string; value: string }[];
  onDropdownChange?: (value: string) => void;
  onAddClick?: () => void;
  handleDateRange?: (value: [string, string] | string) => void;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  onExportClick?: () => void;
  children: React.ReactNode;
}

const ComponentCardWthBtns: React.FC<ComponentCardProps> = ({
  title,
  desc = "",
  className = "",
  showSearch = false,
  showTabs = false,
  showDownload = false,
  showAddButton = false,
  showDropdown = false,
  showDate = false,
  range = false,
  dropdownOptions,
  onExportClick,
  onDropdownChange,
  onAddClick,
  handleDateRange,
  children,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {(title ||
        showSearch ||
        showTabs ||
        showDownload ||
        showAddButton ||
        showDropdown ||
        showDate ||
        range) && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            {title && (
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {desc && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center ml-auto">
            {showDropdown && dropdownOptions?.length && (
               <div className="space-y-2 relative z-[9999]">
              {/* <label className="text-sm text-gray-700">State</label> */}
              <Select 
              // value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}
                
                >
                <SelectTrigger className="
          w-40 rounded-md border border-gray-300 bg-white 
          text-sm text-gray-700 dark:text-white dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
          transition-all duration-200
        ">
                  <SelectValue placeholder="Select Case" />
                </SelectTrigger>
                <SelectContent  className="
          bg-white border border-gray-200 dark:border-gray-700
          shadow-lg rounded-lg z-[9999]
        ">
                  {/* <SelectItem value=" ">All Cases</SelectItem> */}
                  {dropdownOptions.map(state => (
                    <SelectItem  className="
              text-gray-700 dark:text-white
              hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer
              focus:bg-green-100
            " key={state.value} value={state.value}>{state.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            )}
{/* {showDownload && (
  <button
    className="p-2 border rounded-md text-blue-500 hover:bg-blue-100 transition-all duration-200"
    title="Download"
    onClick={onExportClick}
  >
    <Download className="h-4 w-4" />
  </button>
)} */}
            {/* {range && (
              <DatePicker
                id="dateRange"
                mode="range"
                size="sm"
                onChange={(dates) => handleDateRange?.(dates)}
              />
            )}

            {showDate && (
              <DatePicker
                id="singleDate"
                onChange={([date]) => console.log("Date:", date)}
              />
            )} */}

            {showSearch && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-white focus:ring-2  focus:border-green-500 focus:ring-green-500/20 outline-none"
                />
              </div>
            )}

            {showTabs && (
              <div className="flex border border-green-600 rounded-md overflow-hidden text-sm">
                <button className="flex items-center gap-1 px-4 py-1 text-gray-700 dark:text-white">
                  Org Hierarchy
                </button>
                <button className="flex items-center gap-1 px-4 py-1 bg-green-100 text-green-700">
                  <LayoutList className="h-4 w-4" /> List
                </button>
              </div>
            )}

            {showDownload && (
              <button
                className="p-2 border rounded-md text-blue-500 hover:bg-blue-100 transition-all duration-200"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            {showAddButton && (
              <button
                className="flex items-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-sm px-3 py-1.5 rounded-md transition-all duration-200"
                onClick={onAddClick}
              >
                <Plus className="h-4 w-4" /> ADD
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCardWthBtns;
