import { Edit, Eye, Inbox, Trash2, UserRoundSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import { MoreDotIcon } from "../../icons";
import Avatar from "../../components/ui/avatar/Avatar";

interface Column<T> {
  key: keyof T | string;
  label: string;
}

interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
   loading?: boolean;  // ✅ add this
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  onMore?: (row: T) => void;
  onAdmin?: (row: T) => void;
}

export default function CustomTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,   // default false
  onEdit,
  onView,
  onDelete,
  onMore,
  onAdmin,
}: DynamicTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
         
        <Table>
          <TableHeader
            className="bg-gray-100 hover:bg-gray-200 border-b border-gray-200  border-b border-gray-100 "
            // className="border-b border-gray-100 dark:border-white/[0.05]"
          >
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key as string}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
                  //  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  // idx === 0
                  //                   ? "font-medium text-gray-800 text-theme-sm dark:text-white/90"
                  //                   : "text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          {/* className="divide-y divide-gray-100 dark:divide-gray-800" */}
          <TableBody
            // className="divide-y divide-gray-100 dark:divide-gray-800"
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
          >
           

{!loading &&
              data.length > 0 &&
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={
                  String(row[columns[0]?.key]).toLowerCase() === "total"
                    ? "bg-gray-50 hover:text-gray-1000 dark:bg-gray-700 font-bold"
                    : ""
                }
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {(() => {
                      // User column: image + name + role
                      if (col.key === "name" && typeof row.user === "object") {
                        return (
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                row.user?.image || "/images/user/default.jpg"
                              }
                              alt={row.user?.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800 dark:text-white">
                                {row.user?.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {row.user?.role}
                              </span>
                            </div>
                          </div>
                        );
                      }
if (col.key === "progress") {
  const value = Number(row.progress || 0);

  return (
    <div className="w-full">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div
          className={`h-2 rounded-full ${
            value >= 75
              ? "bg-green-500"
              : value >= 40
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 mt-1 inline-block">
        {value}%
      </span>
    </div>
  );
}

                      if (col.name === "avatar") {
                        const name = row[col.key] || row.user?.name || "User";
                        const image = row.user?.image;
                        const status = "Active"; // optional if you track online/offline
                        const initials = name
                          .split(" ")
                          .map((word: string) => word[0])
                          .join("")
                          .toUpperCase();
                        return (
                          <div className="flex items-center gap-3">
                            {image ? (
                              <Avatar
                                src={image}
                                alt={name}
                                size="medium"
                                status={status}
                              />
                            ) : (
                              <div className="relative flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium w-10 h-10">
                                {initials}
                                {status !== "none" && (
                                  <span
                                    className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
                                      {
                                        online: "bg-success-500 h-2.5 w-2.5",
                                        offline: "bg-error-400 h-2.5 w-2.5",
                                        busy: "bg-warning-500 h-2.5 w-2.5",
                                      }[status]
                                    }`}
                                  ></span>
                                )}
                              </div>
                            )}

                            <span>{name}</span>
                          </div>
                        );
                      }

                      if (col.showSubText) {
                        const subTextKey = col.showSubTextKey;
                        const mainValue = row[col.key];
                        const subValue = row[subTextKey];

                        return (
                          <div className="flex flex-col gap-0.5">
                            {/* Main text or badge */}
                            {col.badge ? (
                              <>{mainValue || "-"}</>
                            ) : (
                              <span className="font-medium text-gray-800 dark:text-white">
                                {mainValue || "-"}
                              </span>
                            )}

                            {/* Subtext (normal or badge) */}
                            {subValue &&
                              (col.badge ? (
                                <Badge
                                  // variant="solid"
                                  size="sm"
                                  color="warning"
                                  className="capitalize"
                                  bordered
                                >
                                  {subValue}
                                </Badge>
                              ) : (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {subValue}
                                </span>
                              ))}
                          </div>
                        );
                      }

                      if (col.badge) {
                        return (
                          <Badge
                            size="md"
                            variant="light"
                            className="capitalize"
                          >
                            {row[col.key]}
                          </Badge>
                        );
                      }
                      // Meeting person column: name + designation stacked
                      if (
                        col.show === "merge" &&
                        typeof row[col.key] === "object"
                      ) {
                        return (
                          <div className="flex flex-col">
                            {col.mergeKeys?.map((field, idx) => (
                              <span
                                key={field}
                                className={
                                  idx === 0
                                    ? "font-medium text-gray-800 text-theme-sm dark:text-white/90"
                                    : "text-gray-500 text-theme-xs dark:text-gray-400"
                                }
                              >
                                {row[col.key]?.[field]}
                              </span>
                            ))}
                          </div>
                        );
                      }
                      // Team column: avatar group
                      if (col.key === "team" && Array.isArray(row.team)) {
                        return (
                          <div className="flex -space-x-2">
                            {row.team.map((img: string, idx: number) => (
                              <img
                                key={idx}
                                src={img}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                                alt={`Team ${idx + 1}`}
                              />
                            ))}
                          </div>
                        );
                      }

                      // Status column: badge
                      if (col.key === "status") {
                        const statusColor =
                          row.status === "Active" || row.status === "Approved" || row.status === "active" 
                            ? "success"
                            : row.status === "Pending"
                            ? "warning"
                            : "error";

                        return (
                          <>
                            {/* <span
                            className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}
                           >
                            
                           {row.status}
                           </span> */}
                            <div className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              <Badge
                                size="sm"
                                color={statusColor}

                                //           color={
                                //   product.status === "Delivered"
                                //     ? "success"
                                //     : product.status === "Pending"
                                //     ? "warning"
                                //     : "error"
                                // }
                              >
                                {row.status}
                              </Badge>
                            </div>
                          </>
                        );
                      }

                      // Action column
                      // if (col.key === "action") {
                      //   return (
                      //     <div className="flex gap-2">
                      //       {row.action?.edit && (
                      //         <button
                      //           className="text-blue-600 hover:text-blue-800"
                      //           title="Edit"
                      //           onClick={() => onEdit?.(row)}
                      //         >
                      //           <Edit size={16} />
                      //         </button>
                      //       )}
                      //       {row.action?.delete && (
                      //         <button
                      //           className="text-red-600 hover:text-red-800"
                      //           title="Delete"
                      //         >
                      //           <Trash2 size={16} />
                      //         </button>
                      //       )}
                      //     </div>
                      //   );
                      // }
                      // Action Button
                      if (col.key === "action") {
                        return (
                          <div className="flex gap-2">
                            {col.showIcon?.edit && (
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                                onClick={() => onEdit?.(row)}
                              >
                                <Edit size={16} />
                              </button>
                            )}
                            {col.showIcon?.delete && (
                              <button
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                                onClick={() => onDelete?.(row)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {col.showIcon?.threeDot && (
                              <button
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                                onClick={() => onMore?.(row)}
                              >
                                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                              </button>
                            )}
                            {col.showIcon?.view && (
                              <button
                                className="text-green-600 hover:text-green-800"
                                title="View"
                                onClick={() => onView?.(row)} // ✅ triggers view handler
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            {col.showIcon?.admin && (
                              <button
                                className="text-brand-500 hover:text-brand-600"
                                title="View"
                                onClick={() => onAdmin?.(row)} // ✅ triggers view handler
                              >
                                <UserRoundSearch size={16} />
                              </button>
                            )}
                          </div>
                        );
                      }

                      // Default text fallback
                      return Array.isArray(row[col.key])
                        ? row[col.key].join(", ")
                        : String(row[col.key] ?? "");
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Empty State */}
 {/* --- CENTER OVERLAY (loading + empty) --- */}
        {(loading || data.length === 0) && (
          <div className="relative h-[220px]">
    <div className="absolute inset-0 flex flex-col items-center justify-center">

            {loading ? (
              <>
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-600">Loading...</p>
              </>
            ) : (
              <>
                <Inbox className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-600 text-base">No Data Found</p>
              </>
            )}
</div>
          </div>
        )}


      </div>
    </div>
  );
}
