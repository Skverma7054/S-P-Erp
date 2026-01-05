import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  onChange?: Hook | Hook[];
  defaultValue?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
  calendarStyle?: React.CSSProperties;
  enableSeconds?: boolean;
};

export default function DateTimePicker({
  id,
  onChange,
  defaultValue,
  label,
  placeholder = "Select date & time",
  className,
  calendarStyle,
  enableSeconds = false,
}: PropsType) {
  useEffect(() => {
    const instance = flatpickr(`#${id}`, {
      enableTime: true,
      dateFormat: enableSeconds
        ? "Y-m-d H:i:S"
        : "Y-m-d H:i",
      time_24hr: true,
      defaultDate: defaultValue,
      static: true,
      onChange,
      onReady: (_dates, _str, fp) => {
        if (calendarStyle && fp?.calendarContainer) {
          Object.assign(fp.calendarContainer.style, calendarStyle);
        }
      },
    });

    return () => {
      if (!Array.isArray(instance)) {
        instance.destroy();
      }
    };
  }, [id, onChange, defaultValue, calendarStyle, enableSeconds]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800 ${className || ""}`}
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
