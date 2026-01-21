import React from "react";
import Label from "../../components/form/Label";
import FileInput from "../../components/form/input/FileInput";
import ComponentCard from "../../components/common/ComponentCard";


type FileUploadInputProps = {
  label?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  showCard?: boolean; // optional wrapper
  className?: string;
};

export default function FileUploadInput({
  label = "Upload File",
  value,
  onChange,
  accept,
  disabled = false,
  required = false,
  showCard = false,
  className,
}: FileUploadInputProps) {
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  const content = (
    <div className="space-y-1.5">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <FileInput
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        className={className}
      />

      {value && (
        <p className="text-xs text-gray-500 truncate">
          Selected: {value.name}
        </p>
      )}
    </div>
  );

  if (showCard) {
    return <ComponentCard title={label}>{content}</ComponentCard>;
  }

  return content;
}
