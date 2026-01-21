import React, { useEffect, useState } from "react";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postFetch,
  axiosGet,
  axiosPatch,
  axiosDelete,
  AxiosGetWithParams,
} from "../../api/apiServices";
import { options } from "@fullcalendar/core/preact.js";

/* ---------------- TABLE COLUMNS ---------------- */
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
const approvedPrColumns = [
  { key: "pr_code", label: "PR Code" },
  { key: "project", label: "Project" },
  { key: "created_at", label: "Created Date" },
  { key: "status", label: "Status" },
  {
    key: "action",
    label: "Actions",
    showIcon: { edit: true },
  },
];

/* ---------------- COMPONENT ---------------- */
export default function PurchaseOrder() {
  const queryClient = useQueryClient();
  const poModal = useModal();
const [selectedProject, setSelectedProject] = useState("ALL");
console.log(selectedProject,"---selectedProject");

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    pr_id: "",
    project_id: "",
    vendor_id: "",
    po_code: "",
    po_date: "",
    expected_delivery_date: "",
    transport_mode: "",
    payment_terms: "",
    delivery_terms: "",
    shipping_address: "",
    billing_address: "",
    remarks: "",
    order_items: [
      {
        material_id: "",
        material_code: "",
        material_name: "",
        quantity: "",
        rate: "",
        amount: "",
      },
    ],
  });

  /* ---------------- MASTER DATA ---------------- */
  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => axiosGet("/project"),
  });

  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => axiosGet("/vendor"),
  });

  const projectOptions =
    projectData?.data?.map((p) => ({
      label: p.project_name,
      value: String(p.id),
    })) || [];
const projectOptionsFilter = [
  { label: "All Projects", value: "ALL" },
  ...(projectData?.data?.map((p) => ({
    label: p.project_name,
    value: String(p.id),
  })) || []),
];

  const vendorOptions =
    vendorData?.data?.map((v) => ({
      label: v.vendor_name,
      value: String(v.id),
    })) || [];
  const { data: prData, isLoading: prLoading } = useQuery({
    queryKey: ["pr-list", formData.pr_code],
    queryFn: () =>
      AxiosGetWithParams("/pr", {
       pr_code:formData.pr_code,
        status: "APPROVED",
      }),
    enabled: !!formData.pr_code, // ✅ ONLY RUN WHEN PROJECT SELECTED
  });
  const prOptions =
    prData?.data?.map((pr) => ({
      label: pr.pr_code,
      value: String(pr.id),
    })) || [];
  console.log(prData, "PR DATA ---");

  useEffect(() => {
    if (!formData.pr_code || !prData?.data) return;

    const selectedPR = prData.data.find(
      (pr) => String(pr.pr_code) === String(formData.pr_code)
    );

    if (!selectedPR) return;

    // 🔹 Map PR material_items → PO order_items
    const mappedItems = selectedPR.material_items.map((item) => ({
      material_id: item.material.id,
      material_code: String(item.material.material_code),

      material_name: item.material.name,
      quantity: item.quantity,
      rate: "", // PO rate comes later
      amount: "", // auto-calc later
    }));

    setFormData((prev) => ({
      ...prev,
      order_items: mappedItems,
    }));
  }, [formData.pr_code, prData]);
  // useEffect(() => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     pr_id: "",
  //     vendor_id: "", // ✅ ADD
  //     order_items: [
  //       {
  //         material_id: "",
  //         material_code: "",
  //         material_name: "",
  //         quantity: "",
  //         rate: "",
  //         amount: "",
  //       },
  //     ],
  //   }));
  // }, [formData.project_id]);

  /* ---------------- MODAL FIELDS ---------------- */
  const poModalFields = [
    {
      heading: "PO Details",
      items: [
        // {
        //   name: "project_id",
        //   label: "Project",
        //   type: "select",
        //   options: projectOptions,
        //   placeholder: "Select Project",
        //   loading: projectLoading, // ✅ ADD THIS
        // },
        // {
        //   name: "pr_id",
        //   label: "Pr Id",
        //   type: "select",
        //   options: prOptions,
        //   placeholder: "Select Pr",
        //   emptyText: formData.project_id
        //     ? "No options available"
        //     : "Please Select Project First",
        //   loading: prLoading, // ✅ ADD THIS
        //   disabled: !formData.project_id, // ✅ ADD THIS
        // },
        {
          name: "vendor_id",
          label: "Vendor",
          type: "select",
          options: vendorOptions,
          placeholder: "Select Vendor",
          loading: vendorLoading, // ✅ ADD THIS
          disabled: !formData.pr_id, // ✅
        },
        {
          name: "po_code",
          label: "PO Code",
          type: "text",
        },
        {
          name: "po_date",
          label: "PO Date",
          type: "date",
        },
        {
          name: "expected_delivery_date",
          label: "Expected Delivery Date",
          type: "date",
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
          placeholder: "Select Mode",
        },
      ],
    },
    {
      heading: "Order Items",
      type: "array",
      total: true,
      name: "order_items",
      // addButtonLabel: "Add Item",
      Subitems: [
        {
          name: "material_id",
          label: "Material Id",
          type: "text",
          readOnly: true,
        },
        {
          name: "material_code",
          label: "Material Code",
          type: "text",
          readOnly: true,
        },
        {
          name: "material_name",
          label: "Material Name",
          type: "text",
          readOnly: true,
        },
        { name: "quantity", label: "Quantity", type: "number", readOnly: true, },
        { name: "rate", label: "Rate", type: "text" },
        { name: "amount", label: "Amount", type: "text", readOnly: true },
        {
          name: "action",
          label: "Action",
          // showIcon: { edit: true, delete: true, view: true },
        },
      ],
    },
    {
      heading: "Additional Info",
      items: [
        {
          name: "payment_terms",
          label: "Payment Terms",
          options: [
            { label: "Immediate Payment", value: "Immediate Payment" },
            { label: "15 days Credit", value: "15 days Credit" },
            { label: "30 Days credit", value: "30 Days credit" },
          ],
          type: "select",
        },
        {
          name: "delivery_terms",
          label: "Delivery Terms",
          options: [
            { label: "FOB Dest", value: "Immediate Payment" },
            { label: "FOB Origin", value: "15 days Credit" },
            { label: "CIF (Cost, Insurance & Freight)", value: "CIF" },
          ],
          type: "select",
        },
        {
          name: "shipping_address",
          label: "Shipping Address",
          type: "textarea",
          fullWidth: true,
        },
        {
          name: "billing_address",
          label: "Billing Address",
          type: "textarea",
          fullWidth: true,
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "textarea",
          fullWidth: true,
        },
      ],
    },
  ];

  /* ---------------- CREATE PO ---------------- */
  const createPO = useMutation({
    mutationFn: (payload:any) => postFetch("/po", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["po-list"] });
      alert("PO created successfully");
      poModal.closeModal();
    },
  });

  /* ---------------- GET PO LIST ---------------- */
  const { data: poData, isLoading } = useQuery({
    queryKey: ["po-list"],
    queryFn: () =>
      axiosGet("/po?page=1&limit=10&sort_by=created_at&sort_order=desc"),
  });

  const tableData =
    poData?.data?.map((item) => ({
      id: item.id,
      po_code: item.po_code,
      project: item.project.project_name,
      vendor: item.vendor.vendor_name,
      po_status: item.po_status,
      total_amount: item.total_amount,
    })) || [];
const {
  data: approvedPrData,
  isLoading: approvedPrLoading,
} = useQuery({
  queryKey: ["approved-pr-list", selectedProject],
  queryFn: () =>
    AxiosGetWithParams("/pr", 
      selectedProject === "ALL"
    ? { status: "APPROVED" }
    : { status: "APPROVED", project_id: selectedProject }
    ),
  enabled: !!selectedProject,
});
console.log(approvedPrData,"approvedPrData");

const approvedPrTableData =
  approvedPrData?.data?.map((pr) => ({
    id: pr.id,
    pr_code: pr.pr_code,
    project: pr.project.project_name,
    project_id:pr.project_id,
    created_at: new Date(pr.created_at).toLocaleDateString(),
    status: pr.status,
  })) || [];

  /* ---------------- SAVE PO ---------------- */
  const handleSave = () => {
    const orderItemsPayload = formData.order_items.map((item) => ({
      material_id: Number(item.material_id),
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    }));

    const payload = {
      pr_id: Number(formData.pr_id || 0),
      project_id: Number(formData.project_id),
      vendor_id: Number(formData.vendor_id),
      po_code: formData.po_code,
      po_date: new Date(formData.po_date).toISOString(),
      expected_delivery_date: new Date(
        formData.expected_delivery_date
      ).toISOString(),
      transport_mode: formData.transport_mode,
      po_status: "DRAFT",
      payment_terms: formData.payment_terms,
      delivery_terms: formData.delivery_terms,
      shipping_address: formData.shipping_address,
      billing_address: formData.billing_address,
      remarks: formData.remarks,
      order_items: orderItemsPayload,
    };

    console.log("🚀 PO Payload:", payload);
    createPO.mutate(payload);
  };

  /* ---------------- DELETE PO ---------------- */
  const deletePO = useMutation({
    mutationFn: (id: number) => axiosDelete(`/po/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["po-list"] });
      alert("PO deleted");
    },
  });

  /* ---------------- HEADER BUTTONS ---------------- */
  const actionButtons = [
    {
      label: "Create PO",
      icon: Plus,
      variant: "primary",
      onClick: () => {
        setFormData({
          pr_id: "",
          project_id: "",
          vendor_id: "",
          po_code: "",
          po_date: "",
          expected_delivery_date: "",
          transport_mode: "",
          payment_terms: "",
          delivery_terms: "",
          shipping_address: "",
          billing_address: "",
          remarks: "",
          order_items: [
            {
              material_id: "",
              material_code: "",
              material_name: "",
              quantity: "",
              rate: "",
              amount: "",
            },
          ],
        });
        poModal.openModal();
      },
    },
  ];
  const handleAddItem = (groupName) => {
    setFormData((prev) => ({
      ...prev,
      [groupName]: [
        ...(prev[groupName] || []),
        {
          material_id: "",
          material_code: "",
          material_name: "",
          quantity: "",
          rate: "",
          amount: "",
        },
      ],
    }));
  };

  const handleUpdateItem = (groupName, rowIndex, field, value) => {
    const rows = [...formData[groupName]];
    rows[rowIndex][field] = value;

    // 🔥 auto-calc amount
    if (field === "quantity" || field === "rate") {
      const qty = Number(rows[rowIndex].quantity || 0);
      const rate = Number(rows[rowIndex].rate || 0);
      rows[rowIndex].amount = (qty * rate).toFixed(2);
    }

    setFormData({ ...formData, [groupName]: rows });
  };

  const handleRemoveItem = (groupName, rowIndex) => {
    const rows = [...formData[groupName]];
    rows.splice(rowIndex, 1);
    setFormData({ ...formData, [groupName]: rows });
  };
const handleProject = (value)=>{
console.log(value,"--value");

}
const handleSelectPr = (row) => {
  // 1️⃣ Set Project
  console.log(row,"----handleSelectPr");
  
  setFormData((prev) => ({
    ...prev,
    project_id: String(row.project_id),
    pr_id: String(row.id),
    pr_code:String(row.pr_code)
  }));

  // 2️⃣ Open PO modal
  poModal.openModal();
};

  return (
    <>
      <PageBreadcrumb pageTitle="Purchase Orders" addButtons={actionButtons} />
<ComponentCardWthBtns
  title="Approved Purchase Requests"
  desc="Select project to view approved PRs"
  showDropdown
  dropdownOptions={projectOptionsFilter}
  onDropdownChange={(value) => setSelectedProject(value)}
>
  <CustomTable
    columns={approvedPrColumns}
    data={approvedPrTableData}
    loading={approvedPrLoading}
    onEdit={(row) => handleSelectPr(row)}
  />
</ComponentCardWthBtns>

      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Create and manage purchase orders">
          <CustomTable
            columns={columns}
            data={tableData}
            loading={isLoading}
            onDelete={(row) => deletePO.mutate(row.id)}
          />
        </ComponentCardWthBtns>
      </div>

      <CustomModal
        isOpen={poModal.isOpen}
        closeModal={poModal.closeModal}
        handleSave={handleSave}
        title="Create Purchase Order"
        subtitle="Fill details to create PO"
        fields={poModalFields}
        formData={formData}
        setFormData={setFormData}
        saveText="Save PO"
        closeText="Cancel"
        onAddArrayItem={handleAddItem}
        onUpdateArrayItem={handleUpdateItem}
        onRemoveArrayItem={handleRemoveItem}
      />
    </>
  );
}
