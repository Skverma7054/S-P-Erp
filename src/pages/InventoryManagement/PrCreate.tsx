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
import { getPRList } from "../../api/prService";

/* ---------------- TABLE COLUMNS ---------------- */
const columns = [
  { key: "pr_code", label: "PR Code" },
  { key: "project", label: "Project" },
  { key: "urgency_level", label: "Urgency" },
  { key: "status", label: "Status" },
  {
    key: "action",
    label: "Actions",
    showIcon: { 
      edit: true, 
      delete: true,
      view:true },
  },
];



/* ---------------- COMPONENT ---------------- */
export default function PrCreate() {
  const queryClient = useQueryClient();
  const prModal = useModal();
const [mode, setMode] = useState<"create" | "edit" | "view">("create");
const [selectedPrId, setSelectedPrId] = useState<number | null>(null);

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    project_id: "",
    urgency_level: "",
    date:"",
      material_items: [
    {
      material_code: "",
      material_id: "",
      quantity: "",
      unit: "",
      required_date: "",
    },
  ],
    remarks: "",
  });
useEffect(() => {
  console.log(formData,"formData---");
  
}, [formData])
const { data: projectData, isLoading: projectLoading } = useQuery({
  queryKey: ["projects"],
  queryFn: () => axiosGet("/project"),
});
const projectOptions =
  projectData?.data?.map((project) => ({
    label: project.project_name,
    value: String(project.id),
  })) || [];
  const { data: materialData, isLoading: materialLoading } = useQuery({
  queryKey: ["materials-active"],
  queryFn: () =>
    AxiosGetWithParams("/material", {
      page: 1,
      limit: 100,
      categoryId: "",
      status: "active",
    }),
});
console.log(materialData,"Material data --");

const materialOptions =
  materialData?.materials?.map((mat) => ({
    label: `${mat.name}-${mat.material_code}`,
    value: String(mat.id), // material_id
  })) || [];

// 🔑 For auto-fill
const materialMap =
  materialData?.materials?.reduce((acc, mat) => {
    acc[mat.id] = mat;
    return acc;
  }, {}) || {};

/* ---------------- MODAL FIELDS ---------------- */
const prModalFields = [
  {
    heading: "PR Details",
    items: [
      {
        name: "project_id",
        label: "Project",
        type: "select",
        options: projectOptions,
        placeholder: projectLoading ? "Loading projects..." : "Select Project",
        loading:projectLoading,
      },
    
     {
       name: "pr_code",
        label: "PR Code",
        type: "text",
        readOnly: mode === "view",
    },
      {
        name: "urgency_level",
        label: "Urgency Level",
        type: "select",
        options: [
          { label: "LOW", value: "LOW" },
          { label: "MEDIUM", value: "MEDIUM" },
          { label: "HIGH", value: "HIGH" },
                    { label: "CRITICAL", value: "CRITICAL" },

        ],
        placeholder:"Select Urgency Level",
      },
      {
        name: "remarks",
        label: "Remarks / Justification",
        type: "textarea",
        placeholder: "Enter reason for this requisition",
        fullWidth: true,
      },
    ],
  },
  {
    heading: "Material Items",
    type: "array",
    name: "material_items",
    addButtonLabel: "Add Item",
    Subitems: [
      {
        name: "material_code",
        label: "Material Code",
        type:"text",
         readOnly:true,
      // material_code: "",
      // material_name: "",
      // quantity: "",
      // unit: "",
      // required_date: "",
    },
    {
       name: "material_id",
        label: "Material Name",
        type: "select",
       options: materialOptions,
  placeholder: materialLoading
    ? "Loading materials..."
    : "Select Material",
    loading:materialLoading,
    },
    {
       name: "quantity",
        label: "Quantity",
         type:"text",
          readOnly: mode === "view",
    },
     {
       name: "unit",
        label: "Unit",
        type:"text",
        readOnly:true,
        // options:[
        //               { label: "Unit", value: "Unit" },
        //               { label: "Bag", value: "Bag" },
        //               { label: "Kg", value: "Kg" },
        //               { label: "Ton", value: "Ton" },
        //             ]
    },
     {
       name: "required_date",
        label: "Required Date",
        type: "date",
        readOnly: mode === "view",
    },
     { name: "action", label: "Action", showIcon:{delete:true}
          
         },
    ],
  },
];
  /* ---------------- CREATE PR ---------------- */
  const createPR = useMutation({
    mutationFn: (payload) => postFetch("/pr", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-list"] });
      alert("PR created successfully");
      prModal.closeModal();
    },
  });

  /* ---------------- GET PR LIST ---------------- */
  const { data: prData, isLoading } = useQuery({
    queryKey: ["pr-list"],
    queryFn: () =>
      axiosGet(
        "/pr?page=1&limit=10&sort_by=created_at&sort_order=desc"
      ),
  });

  const tableData =
    prData?.data?.map((item: any) => ({
      id: item.id,
      pr_code: item.pr_code,
      project: item.project.project_name,
      urgency_level: item.urgency_level,
      status: item.status,
    })) || [];

  /* ---------------- SAVE PR ---------------- */
 const handleSave = () => {
  // 1️⃣ Map material items
  const materialItemsPayload = formData.material_items
    .filter(item => item.quantity && item.required_date) // safety
    .map(item => ({
      material_id: Number(item.material_id), // OR item.material_id
      quantity: item.quantity,
      required_date: new Date(item.required_date).toISOString(),
    }));

  // 2️⃣ Final payload
  const payload = {
    project_id: Number(formData.project_id),
    pr_code: formData.pr_code,
    urgency_level: formData.urgency_level,
    // status: "DRAFT",
    remarks: formData.remarks,
    // user_id: "user-001",
    // approved_by: null,
    material_items: materialItemsPayload,
  };

  console.log("🚀 PR Payload:", payload);

  // 3️⃣ API call
  if (mode === "edit" && selectedPrId) {
    updatePR.mutate({ id: selectedPrId, payload });
  } else {
    createPR.mutate(payload);
  }
};


  /* ---------------- EDIT PR ---------------- */
 const handleEdit = (row: any) => {
  console.log(row,"Handle Edit");
  
  setMode("edit");
  setSelectedPrId(row.id);

  setFormData({
    project_id: String(row.project.id),
    pr_code: row.pr_code,
    urgency_level: row.urgency_level,
    remarks: row.remarks || "",
    material_items: row.material_items.map((item) => ({
      material_id: String(item.material_id),
      material_code: item.material.material_code,
      quantity: String(item.quantity),
      unit: item.material.unit?.name || "",
      required_date: item.required_date?.split("T")[0],
    })),
  });

  prModal.openModal();
};
const handleView = async (row: any) => {
  console.log(row,"ROWWW");
  
  setMode("view");

  const res = await getPRList({
    pr_code: row.pr_code,
    limit: 1,
  });
console.log(res);

  const pr = res?.data?.[0];
  if (!pr) return;

  setFormData({
    project_id: String(pr.project.id),
    pr_code: pr.pr_code,
    urgency_level: pr.urgency_level,
    remarks: pr.remarks || "",
    material_items: pr.material_items.map((item: any) => ({
      material_id: String(item.material_id),
      material_code: item.material?.material_code || "",
      quantity: String(item.quantity),
      unit: item.material?.unit?.name || "",
      required_date: item.required_date?.split("T")[0],
    })),
  });

  prModal.openModal();
};


  /* ---------------- UPDATE PR ---------------- */
  const updatePR = useMutation({
    mutationFn: ({ id, payload }: any) =>
      axiosPatch(`/pr/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-list"] });
      alert("PR updated successfully");
      prModal.closeModal();
    },
  });

  /* ---------------- DELETE PR ---------------- */
  const deletePR = useMutation({
    mutationFn: (id: number) => axiosDelete(`/pr/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-list"] });
      alert("PR deleted successfully");
    },
  });

  const handleDelete = (row: any) => {
    if (confirm("Are you sure you want to delete this PR?")) {
      deletePR.mutate(row.id);
    }
  };

  /* ---------------- HEADER BUTTONS ---------------- */
  const actionButtons = [
    {
      label: "Create PR",
      icon: Plus,
      variant: "primary",
      onClick: () => {
        setFormData({
          project_id: "",
          urgency_level: "",
          remarks: "",
           material_items: [
      {
        material_code: "",
        material_id: "",
        quantity: "",
        unit: "",
        required_date: "",
      },
    ],
  });
        prModal.openModal();
      },
    },
  ];

  /* ---------------- RENDER ---------------- */
  const handleMaterialChange = (index: number, materialId: string) => {
  const material = materialMap[Number(materialId)];
  if (!material) return;

  setFormData((prev) => {
    const updatedItems = [...prev.material_items];

    updatedItems[index] = {
      ...updatedItems[index],
      material_code: material.material_code || "",
      unit: material.unit?.name || "",
    };

    return { ...prev, material_items: updatedItems };
  });
};
const handleUpdateArrayItem = (
  groupName,
  rowIndex,
  fieldName,
  value
) => {
  setFormData((prev) => {
    const rows = [...prev[groupName]];

    // Update selected field
    rows[rowIndex] = {
      ...rows[rowIndex],
      [fieldName]: value,
    };

    // 🔥 Auto-fill when material changes
    if (fieldName === "material_id") {
      const material = materialMap[Number(value)];

      if (material) {
        rows[rowIndex].material_code =
          material.material_code || "";

        rows[rowIndex].unit =
          material.unit?.name || ""; // safe for null
      }
    }

    return { ...prev, [groupName]: rows };
  });
};

  return (
    <>
      <PageBreadcrumb
        pageTitle="Purchase Requisition"
        addButtons={actionButtons}
      />

      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Create and manage purchase requisitions">
          <CustomTable
            columns={columns}
            data={tableData}
            loading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </ComponentCardWthBtns>
      </div>

      {/* ---------------- CREATE / EDIT MODAL ---------------- */}
      <CustomModal
        isOpen={prModal.isOpen}
        closeModal={prModal.closeModal}
        handleSave={handleSave}
        title="Create Purchase Requisition"
        subtitle="Fill the details below to create PR"
        fields={prModalFields}
        formData={formData}
        setFormData={setFormData}
        onUpdateArrayItem={handleUpdateArrayItem}
        saveText="Save PR"
        closeText="Cancel"
      />
    </>
  );
}
