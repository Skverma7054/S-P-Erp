import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { TimeIcon } from "../../icons";

type PropsType = {
  id: string;
  onChange?: Hook | Hook[];
  defaultTime?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
  calendarStyle?: React.CSSProperties;
};

export default function TimePicker({
  id,
  onChange,
  label,
  defaultTime,
  placeholder = "Select Time",
  className,
  calendarStyle,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",        // 24-hour format
      time_24hr: true,
      defaultDate: defaultTime,
      static: true,
      onChange,
      onReady: (_selectedDates, _dateStr, instance) => {
        if (calendarStyle && instance?.calendarContainer) {
          Object.assign(instance.calendarContainer.style, calendarStyle);
        }
      },
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [id, onChange, defaultTime, calendarStyle]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${className || ""}`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <TimeIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
