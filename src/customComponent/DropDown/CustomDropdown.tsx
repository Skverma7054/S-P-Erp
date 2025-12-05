import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../DropDown/Select"; // <-- update your path
import Label from "../../components/form/Label";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  placeholder = "Select",
  options,
  value,
  onChange,
  className = "",
  label
}) => {
  return (<>
    {/* {label && <label className="text-sm text-gray-700">{label}</label>} */}
        {label && <Label>{label}</Label>}

    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`
          group w-40 rounded-md border border-gray-300 bg-white 
          text-sm text-gray-700 dark:text-white dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500
          transition-all duration-200
          flex items-center justify-between
          appearance-none
          [&>svg:last-child]:hidden
          ${className}
        `}
      >
        <SelectValue placeholder={placeholder} />

        {/* Custom arrow */}
        <svg
          className="
            w-4 h-4 text-gray-600 dark:text-gray-300
            transition-transform duration-200
            group-data-[state=open]:rotate-180
          "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5.25 7.5L10 12.25L14.75 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SelectTrigger>

      <SelectContent
        className="
          bg-white border border-gray-200 dark:border-gray-700
          shadow-lg rounded-lg z-[99999]
        "
      >
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="
              text-gray-700 dark:text-white
              hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer
              focus:bg-green-100
            "
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </>
  );
};

export default CustomSelect;
