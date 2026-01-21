import React from 'react'
import ComponentCardWthBtns from '../../customComponent/common/ComponentCardWthBtns';
import CustomTable from '../../customComponent/tables/CustomTable';
import { axiosDelete, AxiosGetWithParams } from '../../api/apiServices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const columns = [
  // { key: "grn_number", label: "GRN No" },
  { key: "po_code", label: "PO Code" },
  { key: "gate_entry_number", label: "Gate Entry" },
  { key: "vehicle_number", label: "Vehicle" },
  { key: "transport_mode", label: "Transport" },
  { key: "store_location", label: "Store Location" },
  { key: "quality_check_completed", label: "QC Done" },
  {
    key: "action",
    label: "Actions",
    showIcon: { edit: true, delete: true },
  },
];
export default function GRNListTab() {
  const queryClient = useQueryClient();

/* ---------------- GET GRN LIST ---------------- */
  const { data: grnData, isLoading } = useQuery({
    queryKey: ["grn-list"],
    queryFn: () =>
      AxiosGetWithParams("/grn", {
        page: 1,
        limit: 10,
        sort_by: "created_at",
        sort_order: "desc",
      }),
  });
    const tableData =
    grnData?.data?.map((grn) => ({
      id: grn.id,
      grn_number: grn.grn_number,
      po_code: grn.purchase_order.po_code,
      gate_entry_number: grn.gate_entry_number,
      vehicle_number: grn.vehicle_number,
      transport_mode: grn.transport_mode,
      store_location: grn.store_location,
      quality_check_completed: grn.quality_check_completed ? "Yes" : "No",
    })) || [];

    /* ---------------- DELETE ---------------- */
  const deleteGRN = useMutation({
    mutationFn: (id) => axiosDelete(`/grn/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grn-list"] });
    },
  });
  return (
    <ComponentCardWthBtns title="GRN Records">
      <CustomTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        onDelete={(row) => deleteGRN.mutate(row.id)}
      />
    </ComponentCardWthBtns>
  );
}
