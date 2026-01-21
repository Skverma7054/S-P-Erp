import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import { axiosGet, AxiosGetWithParams, postFetch } from "../../api/apiServices";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
interface Project {
  id: number;
  project_name: string;
}

interface Vendor {
  id: number;
  vendor_name: string;
}

interface PRMaterialItem {
  material: {
    id: number;
    material_code: string;
    name: string;
  };
  quantity: number;
}

interface PurchaseRequest {
  id: number;
  pr_code: string;
  status: string;
  project: Project;
  material_items: PRMaterialItem[];
}

interface OrderItem {
  material_id: number | string;
  material_code: string;
  material_name: string;
  quantity: number | string;
  rate: number | string;
  amount: number | string;
}

interface POFormData {
  pr_id: string;
  pr_code: string;
  project_id: string;
  vendor_id: string;
  po_code: string;
  po_date: string;
  expected_delivery_date: string;
  transport_mode: string;
  payment_terms: string;
  delivery_terms: string;
  shipping_address: string;
  billing_address: string;
  remarks: string;
  order_items: OrderItem[];
}

export default function ApprovedPRTab() {
  /* ---------------- STATE ---------------- */
  const [selectedProject, setSelectedProject] = useState("ALL");
const [selectedPRData, setSelectedPRData] = useState<PurchaseRequest | null>(null);

  const [search, setSearch] = useState("");
  const poModal = useModal();
const queryClient = useQueryClient();

 const [formData, setFormData] = useState<POFormData>({
  pr_id: "",
  pr_code: "",
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
  order_items: [],
});


  /* ---------------- PROJECT LIST ---------------- */
  const { data: projectData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => AxiosGetWithParams("/project", {}),
  });

  const projectOptionsFilter = [
    { label: "All Projects", value: "ALL" },
    ...(projectData?.data?.map((p:Project) => ({
      label: p.project_name,
      value: String(p.id),
    })) || []),
  ];

  /* ---------------- APPROVED / DRAFT PR LIST ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: ["approved-pr-list", selectedProject, search],
    queryFn: () =>
      AxiosGetWithParams("/pr", {
        status: "APPROVED",
        project_id: selectedProject === "ALL" ? undefined : selectedProject,
        search: search || undefined,
        sort_by: "created_at",
        sort_order: "desc",
      }),
  });

  const tableData =
    data?.data?.map((pr:PurchaseRequest) => ({
      id: pr.id,
      pr_code: pr.pr_code,
      project: pr.project.project_name,
      project_id: pr.project.id,
      status: pr.status,
    })) || [];

  /* ---------------- CREATE PO FROM PR ---------------- */
  const handleSelectPr = (row:any) => {
  setFormData({
    pr_id: String(row.id),
    pr_code: row.pr_code,               // ✅ IMPORTANT
    project_id: String(row.project_id), // ✅ IMPORTANT
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
    order_items: [], // will auto-fill
  });

  poModal.openModal();
};
const { data: prData, isLoading: prLoading } = useQuery({
    queryKey: ["pr-list", formData.pr_code],
    queryFn: () =>
      AxiosGetWithParams("/pr", {
       pr_code:formData.pr_code,
        status: "APPROVED",
      }),
    enabled: !!formData.pr_code, // ✅ ONLY RUN WHEN PROJECT SELECTED
    
  });
  useEffect(() => {
  if (!prData?.data?.length) return;

  setSelectedPRData(prData.data[0]);
}, [prData]);

useEffect(() => {
 if (!poModal.isOpen || !selectedPRData) return;

//   const selectedPR = prData.data[0]; // ✅ API returns array

  const mappedItems = selectedPRData.material_items.map((item:PRMaterialItem) => ({
    material_id: item.material.id,
    material_code: item.material.material_code,
    material_name: item.material.name,
    quantity: item.quantity,
    rate: "",
    amount: "",
  }));

  setFormData((prev) => ({
    ...prev,
    order_items: mappedItems,
  }));
}, [poModal.isOpen, selectedPRData]);

const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => axiosGet("/vendor"),
  });
  const vendorOptions =
    vendorData?.data?.map((v:Vendor) => ({
      label: v.vendor_name,
      value: String(v.id),
    })) || [];
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
       { name: "pr_code", label: "PR Code", type: "text", readOnly: true },
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
  const handleAddItem = (groupName : keyof POFormData) => {
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

  const handleUpdateItem = (groupName: keyof POFormData,
  rowIndex: number,
  field: keyof OrderItem,
  value: any) => {
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
  /* ---------------- RENDER ---------------- */
  return (
    <>
      <ComponentCardWthBtns
        title="Approved Purchase Requests"
        desc="Select a PR to create a Purchase Order"
        
      >
        <CustomTable
          columns={[
            { key: "pr_code", label: "PR Code" },
            { key: "project", label: "Project" },
            { key: "status", label: "Status" },
            {
              key: "action",
              label: "Action",
              showIcon: { select: true }, // Create PO
            },
          ]}
          data={tableData}
          loading={isLoading}
          onEdit={(row) => handleSelectPr(row)}
        />
      </ComponentCardWthBtns>

      {/* ---------- CREATE PO MODAL ---------- */}
      <CustomModal
       
        isOpen={poModal.isOpen}
        closeModal={poModal.closeModal}
        handleSave={handleSave}
        title="Create Purchase Order"
        subtitle={`PO will be created from selected PR ${formData.pr_code}`}
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
