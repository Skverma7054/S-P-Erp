import React, { useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export default function FileUpload({
  name,
  value,
  onChange,
  accept = "*",
  multiple = false,
  label,
  preview = true,
}) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!value) setFiles([]);
    else if (multiple) setFiles(value);
    else setFiles([value]);
  }, [value, multiple]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    const finalFiles = multiple ? selected : selected.slice(0, 1);

    setFiles(finalFiles);
    onChange(multiple ? finalFiles : finalFiles[0]);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange(multiple ? updated : null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Upload Box */}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
        <Upload className="mb-2 h-6 w-6 text-gray-500" />
        <span className="text-sm text-gray-600">
          Click to upload {multiple ? "files" : "file"}
        </span>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleSelect}
        />
      </label>

      {/* Preview */}
      {preview && files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {files.map((file, index) => {
            const isImage = file.type?.startsWith("image");

            return (
              <div
                key={index}
                className="relative flex flex-col items-center rounded-lg border p-2"
              >
                {isImage ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="h-20 w-full rounded object-cover"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                )}

                <p className="mt-1 truncate text-xs">{file.name}</p>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
