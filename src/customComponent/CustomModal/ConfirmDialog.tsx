import React from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,

  // Customizable props
  title = "Are you sure?",
  message = "You won’t be able to revert this!",
  confirmText = "Yes, continue",
  cancelText = "Cancel",

  type = "warning", // "success", "error", "info", "warning"
}) {
  const [loading, setLoading] = React.useState(false);

  // Icon Mapping
  const icons = {
    warning: <AlertTriangle className="text-yellow-500 w-14 h-14" />,
    success: <CheckCircle className="text-green-500 w-14 h-14" />,
    error: <XCircle className="text-red-500 w-14 h-14" />,
    info: <Info className="text-blue-500 w-14 h-14" />,
  };

  // Border Color Mapping
  const borderColors = {
    warning: "border-yellow-400",
    success: "border-green-400",
    error: "border-red-400",
    info: "border-blue-400",
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(); // wait for async action
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] m-4">
      <div
        className="
        bg-white dark:bg-gray-900 p-8 rounded-2xl text-center
        animate-[zoomIn_0.25s_ease] shadow-xl
      "
      >
        {/* Icon */}
        <div className="flex justify-center mb-4 animate-[fadeIn_0.35s_ease]">
          <div
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-white ${borderColors[type]}`}
          >
            {icons[type]}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 animate-[fadeIn_0.4s_ease]">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 animate-[fadeIn_0.45s_ease]">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 animate-[fadeIn_0.5s_ease]">
          <Button
            variant="outline"
            className="!border-gray-300 hover:!bg-gray-100 dark:hover:!bg-gray-700"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            className={`
              text-white
              ${
                type === "warning"
                  ? "bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400"
                  : type === "success"
                  ? "bg-green-600 hover:bg-green-700  disabled:bg-green-400"
                  : type === "error"
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
