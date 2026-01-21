import { useDropzone } from "react-dropzone";
import ComponentCard from "../../components/common/ComponentCard";
import { X } from "lucide-react";

type DropzoneComponentProps = {
    value?: File | null;
  title?: string;
  onFileSelect?: (files: File[]) => void;
  uploading?: boolean;
  progress?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  helperText?: string;
};

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({
    value,
  title = "Dropzone",
  onFileSelect,
   uploading = false,
  progress = 0,
  accept = {
    "image/png": [],
    "image/jpeg": [],
    "image/webp": [],
    "image/svg+xml": [],
  },
  multiple = true,
  helperText = "Drag and drop your PNG, JPG, WebP, SVG images here or browse",
}) => {
  const files: File[] = Array.isArray(value)
    ? value
    : value
    ? [value]
    : [];

  const onDrop = (acceptedFiles: File[]) => {
    if (multiple) {
      onFileSelect?.([...(files || []), ...acceptedFiles]);
    } else {
      onFileSelect?.(acceptedFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFileSelect?.(updated.length ? updated : null);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    
  });
/* ---------------- FILE PREVIEW ---------------- */
  
  if (files.length > 0) {
    return (
      <div className="w-full space-y-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="rounded-xl border border-dashed border-brand-500 bg-brand-50 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-green-100">
                  📄
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {!uploading && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Progress (shared) */}
            {uploading && (
              <div className="mt-3">
                <div className="h-2 w-full rounded bg-gray-200">
                  <div
                    className="h-2 rounded bg-orange-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Uploading… {progress}%
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
    {/* <ComponentCard title={title}> */}
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
            ${
              isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }
          `}
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center">
            {/* Icon */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className="text-center mb-5 block max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              {helperText}
            </span>

            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </form>
      </div>
    {/* </ComponentCard> */}
    </>
  );
};

export default DropzoneComponent;
