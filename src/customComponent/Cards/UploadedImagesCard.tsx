import { Image as ImageIcon } from "lucide-react";

export const UploadedImagesCard = ({ images = [] }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Uploaded Images ({images.length})
        </h3>
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
          <ImageIcon className="mb-2 size-6" />
          No images uploaded
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <img
                src={img.url}
                alt={`uploaded-${index}`}
                className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
