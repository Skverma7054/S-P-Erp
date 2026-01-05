import { Phone, Mail, MapPin, FileText } from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <Icon className="size-5" />
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="font-medium text-gray-800 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export const VendorInfoCard = ({ vendor }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] transition duration-300 hover:shadow-md">
      <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
        Vendor Information
      </h3>

      <div className="grid gap-6 sm:grid-cols-2">
        <InfoRow
          icon={FileText}
          label="GST Number"
          value={vendor.gst}
        />

        <InfoRow
          icon={Phone}
          label="Contact"
          value={vendor.contact}
        />

        <InfoRow
          icon={Mail}
          label="Email"
          value={vendor.email}
        />

        <InfoRow
          icon={MapPin}
          label="Address"
          value={vendor.address}
        />
      </div>
    </div>
  );
};
