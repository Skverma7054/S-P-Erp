import React from "react";
import { Search, Plus, Download, LayoutList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../DropDown/Select";
import CustomSelect from "../DropDown/CustomDropdown";
// import DatePicker from "../form/date-picker";
export type HeaderAction =
  | {
      type: "select";
      key: string;
      options: { label: string; value: string }[];
      value?: string;
      placeholder?: string;
      disabled?: boolean;
      onChange?: (value: string) => void;
    }
  | {
      type: "search";
      key: string;
      placeholder?: string;
      onChange?: (value: string) => void;
    }
  | {
      type: "button";
      key: string;
      label: string;
      icon?: React.ElementType;
      variant?: "primary" | "secondary" | "outline";
      onClick?: () => void;
    }
  | {
      type: "download";
      key: string;
      onClick?: () => void;
    }
  | {
      type: "tabs";
      key: string;
    };

interface ComponentCardProps {
  title?: string;
  desc?: string;
  className?: string;
  actions?: HeaderAction[];
  children: React.ReactNode;
}
/* ================= HELPERS ================= */

const getButtonClass = (variant?: string) => {
  switch (variant) {
    case "secondary":
      return "flex items-center gap-1 px-3 py-1.5 border rounded-md text-sm";
    case "outline":
      return "flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm";
    default:
      return "flex items-center gap-1 px-3 py-1.5 bg-brand-500 text-white rounded-md text-sm";
  }
};
const ComponentCardWthBtns: React.FC<ComponentCardProps> = ({
  title,
  desc,
  className = "",
  actions,
  children,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {(title || actions?.length) && (
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

         {/* RIGHT ACTIONS */}
          <div className="flex flex-wrap gap-2 items-center ml-auto">
            {actions?.map((action) => {
              switch (action.type) {
                case "select":
                  return (
                    <div key={action.key} className="min-w-[180px]">
                      <CustomSelect
                        value={action.value}
                        options={action.options}
                        disabled={action.disabled}
                        placeholder={action.placeholder || "Select"}
                        onChange={(val) => action.onChange?.(val)}
                      />
                    </div>
                  );

                case "search":
                  return (
                    <div key={action.key} className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder={action.placeholder || "Search"}
                        onChange={(e) =>
                          action.onChange?.(e.target.value)
                        }
                        className="pl-8 pr-3 py-1.5 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-green-500/20 outline-none"
                      />
                    </div>
                  );

                case "button":
                  return (
                    <button
                      key={action.key}
                      onClick={action.onClick}
                      className={getButtonClass(action.variant)}
                    >
                      {action.icon && (
                        <action.icon className="h-4 w-4" />
                      )}
                      {action.label}
                    </button>
                  );

                case "download":
                  return (
                    <button
                      key={action.key}
                      onClick={action.onClick}
                      className="p-2 border rounded-md text-blue-500 hover:bg-blue-100"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  );

                case "tabs":
                  return (
                    <div
                      key={action.key}
                      className="flex border border-green-600 rounded-md overflow-hidden text-sm"
                    >
                      <button className="px-4 py-1 text-gray-700">
                        Org Hierarchy
                      </button>
                      <button className="px-4 py-1 bg-green-100 text-green-700 flex items-center gap-1">
                        <LayoutList className="h-4 w-4" /> List
                      </button>
                    </div>
                  );

                default:
                  return null;
              }
            })}
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
