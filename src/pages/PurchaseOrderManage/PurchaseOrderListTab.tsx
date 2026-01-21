import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosDelete, axiosGet } from "../../api/apiServices";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";

/* ---------------- TYPES ---------------- */

interface Project {
  project_name: string;
}

interface Vendor {
  vendor_name: string;
}

interface PurchaseOrder {
  id: number;
  po_code: string;
  project: Project;
  vendor: Vendor;
  po_status: string;
  total_amount: number;
}

interface PurchaseOrderRow {
  id: number;
  po_code: string;
  project: string;
  vendor: string;
  po_status: string;
  total_amount: number;
}
const columns = [
  { key: "po_code", label: "PO Code" },
  { key: "project", label: "Project" },
  { key: "vendor", label: "Vendor" },
  { key: "po_status", label: "Status" },
  { key: "total_amount", label: "Total Amount" },
  {
    key: "action",
    label: "Actions",
    showIcon: { edit: true, delete: true },
  },
];
export default function PurchaseOrderListTab() {
 const queryClient = useQueryClient(); // ✅ ADD THIS
     /* ---------------- GET PO LIST ---------------- */
  const { data: poData, isLoading } = useQuery<{
    data: PurchaseOrder[];
  }>({
    queryKey: ["po-list"],
    queryFn: () =>
      axiosGet("/po?page=1&limit=10&sort_by=created_at&sort_order=desc"),
  });

  const tableData: PurchaseOrderRow[]  =
    poData?.data?.map((item: PurchaseOrder) => ({
      id: item.id,
      po_code: item.po_code,
      project: item.project.project_name,
      vendor: item.vendor.vendor_name,
      po_status: item.po_status,
      total_amount: item.total_amount,
    })) || [];
    /* ---------------- DELETE PO ---------------- */
  const deletePO = useMutation({
    mutationFn: (id: number) => axiosDelete(`/po/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["po-list"] });
      alert("PO deleted");
    },
  });
  return (
    <ComponentCardWthBtns
      title="Purchase Orders"
      desc="All created purchase orders"
      
    >
     <CustomTable
                 columns={columns}
                 data={tableData}
                 loading={isLoading}
                 onDelete={(row) => deletePO.mutate(row.id)}
               />
    </ComponentCardWthBtns>
  );
}
