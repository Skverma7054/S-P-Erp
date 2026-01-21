import React, { useState } from "react";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Download, Edit, Package, Plus, Trash } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import CustomSelectModal from "../../customComponent/CustomModal/CustomSelectModal";
import { useNavigate } from "react-router";
import { axiosDelete, axiosGet, AxiosGetWithParams, axiosPatch, postFetch } from "../../api/apiServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmDialog from "../../customComponent/CustomModal/ConfirmDialog";

type Category = { id: number; name: string };
type Unit = { id: number; name: string };
type Material = any; // backend-driven, keep flexible for now
type MaterialPayload = {
  name: string;
  categoryId: number;
  unitId: number;
  status: string;
  minimum_threshold_quantity: number;
  material_code: string;
};

const columns = [
  { key: "materialName", label: "Material Name" },
  { key: "category", label: "Category" },
  { key: "unit", label: "Unit" },
  { key: "code", label: "Code" },
  { key: "minThreshold", label: "Min Threshold" },
  { key: "status", label: "Status" },

  {
    key: "action",
    label: "Actions",
    showIcon: { 
      // view: true, 
      edit: true, delete: true },
  },
];

const data = [
  {
    id: "1",
    materialName: "Portland Cement",
    category: "Cement",
    unit: "Bags",
    code: "CEM-001",
    minThreshold: 500,
    status: "Active",
  },
  {
    id: "2",
    materialName: "TMT Steel Bars",
    category: "Steel",
    unit: "Tons",
    code: "STL-001",
    minThreshold: 50,
    status: "Active",
  },
  {
    id: "3",
    materialName: "Bituminous Mix",
    category: "Bitumen",
    unit: "Tons",
    code: "BIT-001",
    minThreshold: 100,
    status: "Active",
  },
  {
    id: "4",
    materialName: "Coarse Aggregate",
    category: "Aggregate",
    unit: "Cubic Meter",
    code: "AGG-001",
    minThreshold: 200,
    status: "Active",
  },
  {
    id: "5",
    materialName: "Fine Aggregate (Sand)",
    category: "Aggregate",
    unit: "Cubic Meter",
    code: "AGG-002",
    minThreshold: 150,
    status: "Active",
  },
  {
    id: "6",
    materialName: "Ready Mix Concrete M30",
    category: "Concrete",
    unit: "Cubic Meter",
    code: "CON-001",
    minThreshold: 50,
    status: "Active",
  },
];
const modalFields = [
  {
    heading: "Material Details",
    items: [
      {
        name: "name",
        label: "Material Name",
        placeholder: "Enter material name",
        type: "text",
      },
      {
        name: "category",
        label: "Category",
        placeholder: "Select Category",
        type: "select",
        options: ["Cement", "Steel", "Bitumen"],
      },
      {
        name: "unit",
        label: "Unit",
        placeholder: "Select Unit",
        type: "select",
        options: [
          { value: "Bags", label: "Bags" },
          { value: "Tons", label: "Tons" },
          { value: "Cubic Meter", label: "Cubic Meter" },
        ],
      },
      {
        name: "code",
        label: "Material Code",
        type: "text",
        placeholder: "E.g. CEM-001",
      },
      {
        name: "minThreshold",
        label: "Minimum Threshold",
        type: "number",
        placeholder: "Enter qty",
      },
    ],
  },

  {
    heading: "Status Options",
    items: [
      {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Select Status",
        options: ["Active", "Inactive"],
        fullWidth: true,
      },
    ],
  },
];



export default function MasterCreation() {
  const { isOpen, openModal, closeModal } = useModal();

  const materialModal = useModal();  // For Add / Edit material
const projectModal = useModal();   // For Material Inventory
const navigate = useNavigate();
const queryClient = useQueryClient();

const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);

const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [materialToDelete, setMaterialToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
  name: "",
  categoryId: "",
  unitId: "",
  material_code: "",
  minimum_threshold_quantity: "",
  status: "Active",
});
  const projects = [
    { id: "p1", name: "NH-44 Highway Extension" },
    { id: "p2", name: "Metro Line 3 Construction" },
    { id: "p3", name: "Coastal Road Project" },
  ];
  const { data: categoryData ,isLoading:categoryLoading } = useQuery({
  queryKey: ["categories"],
  queryFn: () =>
    axiosGet("/category", {
      params: { page: 1, limit: 100 },
    }),
});

const { data: unitData , isLoading:unitLoading } = useQuery({
  queryKey: ["units"],
  queryFn: () =>
    axiosGet("/unit", {
      params: { page: 1, limit: 100 },
    }),
});
const categoryOptions =
  categoryData?.categories?.map((cat: Category) => ({
    value: String(cat.id),
    label: cat.name,
  })) || [];

const unitOptions =
  unitData?.units?.map((unit:Unit) => ({
    value: String(unit.id),
    label: unit.name,
  })) || [];

const modalFields = [
  {
    heading: "Material Details",
    items: [
      {
        name: "name",
        label: "Material Name",
        placeholder: "Enter material name",
        type: "text",
      },
      {
        name: "categoryId",
        label: "Category",
        placeholder: "Select Category",
        type: "select",
        options: categoryOptions,
        loading:categoryLoading,
      },
      {
        name: "unitId",
        label: "Unit",
        placeholder: "Select Unit",
        type: "select",
        options: unitOptions,
        loading:unitLoading,
      },
      {
        name: "material_code",
        label: "Material Code",
        type: "text",
        placeholder: "E.g. CEM-001",
      },
      {
        name: "minimum_threshold_quantity",
        label: "Minimum Threshold",
        type: "number",
        placeholder: "Enter qty",
      },
    ],
  },

  {
    heading: "Status Options",
    items: [
      {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Select Status",
        options: ["Active", "Inactive"],
        fullWidth: true,
      },
    ],
  },
];
  const handleMaterialInventory = () => {
    console.log("Material Inventory Clicked");
    projectModal.openModal();
    // openModal();
    // alert("Material Inventory clicked!");
  };
  const handleAddMaterial = () => {
     setEditingMaterialId(null); // ✅ important
  setFormData({
   name: "",
  categoryId: "",
  unitId: "",
  material_code: "",
  minimum_threshold_quantity: "",
  status: "Active",
  });
  
  materialModal.openModal();
  // openModal();
};
const createMaterial = useMutation({
  mutationFn: (payload: MaterialPayload) => postFetch("/material", payload),

  onSuccess: () => {
    toast.success("Material created successfully ✅");
    queryClient.invalidateQueries({ queryKey: ["materials"] });
    materialModal.closeModal();
  },

  onError: (err: any) => {
    toast.error(err?.message || "Failed to create material ❌");
  },
});
const updateMaterial = useMutation({
  mutationFn: ({ id, payload }: { id: number; payload: MaterialPayload }) =>
    axiosPatch(`/material/${id}`, payload),

  onSuccess: () => {
    toast.success("Material updated successfully ✨");
    queryClient.invalidateQueries({ queryKey: ["materials"] });
    materialModal.closeModal();
  },

  onError: (err: any) => {
    toast.error(err?.message || "Failed to update material ❌");
  },
});
const deleteMaterial = useMutation({
  mutationFn: (id: number) => axiosDelete(`/material/${id}`),

  onSuccess: () => {
    toast.success("Material deleted successfully ✅");
    queryClient.invalidateQueries({ queryKey: ["materials"] });
  },

  onError: (err: any) => {
    toast.error(err?.message || "Failed to delete material ❌");
  },
});

const { data: materialData, isLoading, isError } = useQuery({
  queryKey: ["materials"],               // cache key
  queryFn: () =>
    AxiosGetWithParams("/material", {
      page: 1,
      limit: 10,
      category: "",
      status: "",
    }),
});
console.log(materialData,"----Material data");

const tableData =
  materialData?.materials?.map((item:Material) => ({
    id: item.id,
    materialName: item.name ?? "-", // fallback
    category: item.category?.name ?? "-", // ✅ safe
    categoryId: item.category?.id ?? "",
    categoryDescription: item.category?.description ?? "",

    unit: item.unit?.name ?? "-", // ✅ safe
    unitId: item.unit?.id ?? "",
    unitDescription: item.unit?.description ?? "",

    code: item.material_code ?? "-",
    minThreshold: item.minimum_threshold_quantity ?? 0,
    status: item.status ?? "inactive",
  })) || [];


 const handleSave = () => {
  const payload = {
    name: formData.name,
    categoryId: Number(formData.categoryId),
    unitId: Number(formData.unitId),
    status: formData.status.toLowerCase(),
    minimum_threshold_quantity: Number(formData.minimum_threshold_quantity),
    material_code: formData.material_code,
  };

  if (editingMaterialId) {
    updateMaterial.mutate({ id: editingMaterialId, payload });
  } else {
    createMaterial.mutate(payload);
  }
};
const handleEdit = (row: any) => {
  console.log(row,"---HAndle Edit");
  
  setEditingMaterialId(row.id);

  setFormData({
    name: row.materialName,
     categoryId: String(row.categoryId), // ✅ force string
    unitId: String(row.unitId),         // ✅ force string
    material_code: row.code,
    minimum_threshold_quantity: row.minThreshold,
    status:
      row.status?.toLowerCase() === "active"
        ? "Active"
        : "Inactive", // ✅ normalize
  });

  materialModal.openModal();
};
const handleDelete = (row: any) => {
  setMaterialToDelete(row);
  setDeleteDialogOpen(true);
};

const handleConfirmDelete = async () => {
  if (!materialToDelete) return;

  await deleteMaterial.mutateAsync(materialToDelete.id);

  setDeleteDialogOpen(false);
  setMaterialToDelete(null);
};


  const actionButtons = [
    // {
    //   label: "Material Inventory",
    //   icon: Package,
    //   variant: "gray",
    //   onClick: handleMaterialInventory,
    // },
    {
      label: "Add New Material",
      icon: Plus,
      variant: "primary",
      onClick: handleAddMaterial,
    },
    // {
    //   label: "Download",
    //   icon: Download,
    //   variant: "warning",
    //   onClick: () => console.log("Download clicked"),
    // },

    // {
    //   label: "Delete",
    //   icon: Trash,
    //   variant: "danger",
    //   onClick: () => console.log("Delete clicked"),
    // },
  ];
  const handleView = (row: any) => alert(`Viewing: ${row}`);
//   const handleEdit = (row:any) => {
//   setFormData({
//     name: row.materialName ?? "",
//     categoryId: row.categoryId || "",
//     unitId: row.unitId || "",
//     material_code: row.code ?? "",
//     minimum_threshold_quantity: row.minThreshold ?? "",
//     status: row.status ?? "Active",
//   });

//   materialModal.openModal();
// };


  const handleExport = () => {
  alert("Download triggered");
};

 const handleProject = (row:any) => {
    console.log(`handleProject: ${row}`);
    projectModal.closeModal();   // Close modal
  navigate(`/project-material/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Master Creation" addButtons={actionButtons} />
      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns
          title="Manage material master data"
         
        >
          <CustomTable
            columns={columns}
            data={tableData || []}
  loading={isLoading}
            onView={handleView}
 onEdit={handleEdit}
  onDelete={handleDelete}
          />
        </ComponentCardWthBtns>
      </div>
      <CustomModal
        isOpen={materialModal.isOpen}
        closeModal={materialModal.closeModal}
        handleSave={handleSave}
       title={editingMaterialId ? "Edit Material" : "Add New Material"}

        subtitle="Fill the below details to save material"
        fields={modalFields}
        formData={formData}
        setFormData={setFormData}
       saveText={editingMaterialId ? "Update Material" : "Save Material"}

        // saveText="Save Material"
        closeText="Cancel"
        loading={createMaterial.isPending || updateMaterial.isPending} // ✅ FIX
      />
      <ConfirmDialog
  isOpen={deleteDialogOpen}
  onClose={() => {
    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
  }}
  onConfirm={handleConfirmDelete}
  title="Delete Material"
  message={`Are you sure you want to delete "${materialToDelete?.materialName}"?`}
  confirmText="Yes, Delete"
  cancelText="Cancel"
  type="error"
/>

      {/* <CustomSelectModal
      projects={projects}
      isOpen={projectModal.isOpen}
      closeModal={projectModal.closeModal}
      onProjectClick={handleProject}
      /> */}
    </>
  );
}
