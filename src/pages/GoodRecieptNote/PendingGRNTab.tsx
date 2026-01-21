import React, { useState } from 'react'
import ComponentCardWthBtns from '../../customComponent/common/ComponentCardWthBtns';
import CustomTable from '../../customComponent/tables/CustomTable';
import { AxiosGetWithParams, postFetch } from '../../api/apiServices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModal } from '../../hooks/useModal';
import CustomModal from '../../customComponent/CustomModal/CustomModal';
const pendingGrnColumns = [
  { key: "po_code", label: "PO Code" },
  { key: "gate_entry_number", label: "Gate Entry" },
  { key: "vehicle_number", label: "Vehicle" },
  { key: "store_location", label: "Store" },
  { key: "received_date", label: "Received Date" },
  {
    key: "action",
    label: "Actions",
    showIcon: { select: true },
  },
];
export default function PendingGRNTab() {
    const [grnStatus, setGrnStatus] = useState("PENDING");
    const [searchText, setSearchText] = useState("");
      const queryClient = useQueryClient();

      const grnModal = useModal();
     /* ---------------- FORM STATE ---------------- */
      const [formData, setFormData] = useState({
        po_id: "",
        gate_entry_number: "",
        vehicle_number: "",
        driver_name: "",
        driver_contact: "",
        transport_mode: "ROAD",
        received_date: "",
        received_time: "",
        store_location: "",
        quality_check_completed: false,
        inspected_by: "",
        grn_remarks: "",
        material_receipts: [
          {
            material_id: "",
            ordered: "",
            received: "",
            accepted: "",
            rejected: "",
            chainage: "",
           
          },
        ],
      });
    
    const {
  data: pendingGrnData,
  isLoading: pendingGrnLoading,
} = useQuery({
  queryKey: ["pending-grn-list", searchText, grnStatus],
  queryFn: () =>
    AxiosGetWithParams("/grn", {
      quality_check_completed: grnStatus === "PENDING" ? false : true,
      search: searchText || undefined,
      page: 1,
      limit: 10,
    }),
});

const pendingGrnTableData =
  pendingGrnData?.data?.map((grn) => ({
    id: grn.id,
    po_code: grn.purchase_order.po_code,
    gate_entry_number: grn.gate_entry_number,
    vehicle_number: grn.vehicle_number,
    store_location: grn.store_location,
    received_date: new Date(grn.received_date).toLocaleDateString(),
    raw: grn, // ✅ keep full object
  })) || [];

  const handleResumeGrn = (row) => {
  const grn = row.raw;

  setFormData({
    po_id: String(grn.purchase_order.id),
    gate_entry_number: grn.gate_entry_number,
    vehicle_number: grn.vehicle_number,
    driver_name: grn.driver_name,
    driver_contact: grn.driver_contact,
    transport_mode: grn.transport_mode,
    received_date: grn.received_date.split("T")[0],
    received_time: grn.received_time,
    store_location: grn.store_location,
    quality_check_completed: grn.quality_check_completed,
    inspected_by: grn.inspected_by || "",
    grn_remarks: grn.grn_remarks || "",
    material_receipts: grn.material_receipts,
  });

  grnModal.openModal();
};
 const grnModalFields = [
    {
      heading: "Gate Entry & Basic Information",
      items: [
        // {
        //   name: "po_id",
        //   label: "Purchase Order",
        //   type: "select",
        //   options: poOptions,
        //   placeholder: "Select PO",
        //   loading: poLoading,
        // },
        {
          name: "gate_entry_number",
          label: "Gate Entry Number",
          type: "text",
          placeholder: "GE-2024-001",
        },
        {
          name: "vehicle_number",
          label: "Vehicle Number",
          type: "text",
          placeholder: "RJ14-AB-1234",
        },
        {
          name: "driver_name",
          label: "Driver Name",
          type: "text",
        },
        {
          name: "driver_contact",
          label: "Driver Contact",
          type: "text",
        },
        {
          name: "transport_mode",
          label: "Transport Mode",
          type: "select",
          options: [
            { label: "ROAD", value: "ROAD" },
            { label: "RAIL", value: "RAIL" },
            { label: "AIR", value: "AIR" },
          ],
        },
        {
          name: "received_date",
          label: "Received Date",
          type: "date",
        },
        {
          name: "received_time",
          label: "Received Time",
          type: "time",
        },
        {
          name: "store_location",
          label: "Store Location",
          type: "text",
        },
      ],
    },

    {
      heading: "Material Receipt & Quality Inspection",
      type: "array",
      name: "material_receipts",
      // addButtonLabel: "Add Item",
      Subitems: [
        { name: "material_id", label: "Material Id", type: "text" ,readOnly: true,},
         { name: "material_name", label: "Material Name", type: "text",readOnly: true, },
        { name: "ordered", label: "Ordered", type: "text",readOnly: true, },
        { name: "received", label: "Received", type: "text",readOnly: true, },
        { name: "accepted", label: "Accepted", type: "text" ,readOnly: true,},
        { name: "rejected", label: "Rejected", type: "text" },
        { name: "chainage", label: "Chainage", type: "text" },
        // {
        //   name: "quality",
        //   label: "Quality",
        //   type: "select",
        //   options: [
        //     { label: "Pending", value: "Pending" },
        //     { label: "Accepted", value: "Accepted" },
        //     { label: "Rejected", value: "Rejected" },
        //   ],
        // },
        // { name: "remarks", label: "Remarks", type: "text" },
      ],
    },

    {
      heading: "Quality Check Details",
      items: [
        {
          name: "quality_check_completed",
          label: "Quality check completed",
          type: "switch",
        },
        {
          name: "inspected_by",
          label: "Inspected By",
          type: "text",
          showIf: "quality_check_completed",
        },
        {
          name: "grn_remarks",
          label: "GRN Remarks",
          type: "textarea",
          fullWidth: true,
        },
      ],
    },
  ];

  /* ---------------- CREATE GRN ---------------- */
  const createGRN = useMutation({
    mutationFn: (payload) => postFetch("/grn", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grn-list"] });
      alert("GRN created successfully");
      grnModal.closeModal();
    },
  });
/* ---------------- SAVE ---------------- */
  const handleSave = () => {
    const payload = {
      ...formData,
      po_id: Number(formData.po_id),
      received_date: new Date(formData.received_date).toISOString(),
      received_time: formData.received_time,
    };

    createGRN.mutate(payload);
  };
  const handleUpdateMaterialItem = (groupName, rowIndex, fieldName, value) => {
  setFormData((prev) => {
    const rows = [...prev[groupName]];

    const row = { ...rows[rowIndex] };

    // Always update the changed field
    row[fieldName] = value;

    // 🔥 AUTO CALCULATION LOGIC
    if (fieldName === "rejected") {
      const received = Number(row.received || 0);
      const rejected = Math.min(Number(value || 0), received);

      row.rejected = rejected;
      row.accepted = Math.max(received - rejected, 0);
    }

    rows[rowIndex] = row;

    return {
      ...prev,
      [groupName]: rows,
    };
  });
};
 return (<>
    <ComponentCardWthBtns
      title="Pending Goods Receipt Notes"
      desc="Search and complete pending GRNs"
      showSearch
      showDropdown
      dropdownOptions={[
        { label: "Pending QC", value: "PENDING" },
        { label: "QC Completed", value: "COMPLETED" },
      ]}
      onDropdownChange={setGrnStatus}
    >
      <CustomTable
        columns={pendingGrnColumns}
        data={pendingGrnTableData}
        loading={pendingGrnLoading}
        onEdit={handleResumeGrn}
      />
    </ComponentCardWthBtns>
    <CustomModal
            isOpen={grnModal.isOpen}
            closeModal={grnModal.closeModal}
            handleSave={handleSave}
            title="Create Goods Receipt Note"
            subtitle="Record material receipt and quality inspection"
            fields={grnModalFields}
            formData={formData}
            setFormData={setFormData}
            onUpdateArrayItem={handleUpdateMaterialItem} // ✅ IMPORTANT
            saveText="Create GRN"
            closeText="Cancel"
          />
          </>
  );
}
