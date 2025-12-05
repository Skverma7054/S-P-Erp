import React, { useState } from "react";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Download, Edit, Package, Plus, Trash } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import CustomSelectModal from "../../customComponent/CustomModal/CustomSelectModal";
import { useNavigate } from "react-router";
import { AxiosGetWithParams, postFetch } from "../../api/apiServices";
import { useMutation, useQuery } from "@tanstack/react-query";
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
    showIcon: { view: true, edit: true, delete: true },
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

  const [formData, setFormData] = useState({
  name: "",
  category: "",
  unit: "",
  code: "",
  minThreshold: "",
  status: "Active",
});
  const projects = [
    { id: "p1", name: "NH-44 Highway Extension" },
    { id: "p2", name: "Metro Line 3 Construction" },
    { id: "p3", name: "Coastal Road Project" },
  ];

  const handleMaterialInventory = () => {
    console.log("Material Inventory Clicked");
    projectModal.openModal();
    // openModal();
    // alert("Material Inventory clicked!");
  };
  const handleAddMaterial = () => {
  setFormData({
    name: "",
    category: "",
    unit: "",
    code: "",
    minThreshold: "",
    status: "Active",
  });
  
  materialModal.openModal();
  // openModal();
};
const addMaterial = useMutation({
  mutationFn: (payload) => postFetch("/material", payload),
  onSuccess: (res) => {
    console.log("Material Created:", res);
    alert("Material added successfully!");

    materialModal.closeModal();

    // Optional: clear form
    setFormData({
      name: "",
      category: "",
      unit: "",
      code: "",
      minThreshold: "",
      status: "Active",
    });
  },
  onError: (err) => {
    console.error("Material API Error:", err);
    alert(err?.message || "Failed to add material!");
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
const tableData =
  materialData?.materials?.map((item) => ({
    id: item.id,
    materialName: item.name,
    category: item.category?.name,
categoryId: item.categoryId,
categoryDescription: item.category?.description,
    unit: item.unit.name,
    unitId:item.unit.id,
    unitDescription:item.unit.description,
    code: item.material_code,
    minThreshold: item.minimum_threshold_quantity,
    status: item.status,
  })) || [];

  const handleSave = () => {
  const payload = {
    name: formData.name,
    category: formData.category,
    unit_of_measure: formData.unit,
    status: formData.status.toLowerCase(),
    minimum_threshold_quantity: Number(formData.minThreshold),
    material_code: formData.code,
  };

  console.log("Payload sending:", payload);

  addMaterial.mutate(payload);
};

  const actionButtons = [
    {
      label: "Material Inventory",
      icon: Package,
      variant: "gray",
      onClick: handleMaterialInventory,
    },
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
  const handleEdit = (row: any) => {
    console.log(row)
  setFormData({
    name: row.materialName,
    category: row.category,
    unit: row.unit,
    code: row.code,
    minThreshold: row.minThreshold,
    status: row.status,
  });

  openModal();
};
  const handleDelete = (row: any) => alert(`Deleting: ${row.user.name}`);
  const handleExport = () => {
    alert(`Download: ${row.user.name}`);
  };
 const handleProject = (row) => {
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
          // showSearch
          // showAddButton
          // onAddClick={() => console.log("Add Case clicked")}
          // showDropdown
          // dropdownOptions={[
          //   { label: "All Cases", value: "all" },
          //   { label: "Ongoing", value: "ongoing" },
          //   { label: "Closed", value: "closed" },
          // ]}
          // onDropdownChange={(value) => console.log("Filter:", value)}
          // showDownload
          // onExportClick={handleExport}
        >
          <CustomTable
            columns={columns}
            data={tableData || []}
  loading={isLoading}
            onView={handleView}
onEdit={(row) => handleEdit(row)}
            onDelete={handleDelete}
          />
        </ComponentCardWthBtns>
      </div>
      <CustomModal
        isOpen={materialModal.isOpen}
        closeModal={materialModal.closeModal}
        handleSave={handleSave}
       title={formData.name ? "Edit Material" : "Add New Material"}

        subtitle="Fill the below details to add a new material"
        fields={modalFields}
        formData={formData}
        setFormData={setFormData}
        saveText={formData.name ? "Update Material" : "Save Material"}
// closeText={formData.name ? "Edit Material" : "Add New Material"}

        // saveText="Save Material"
        closeText="Cancel"
      />
      <CustomSelectModal
      
      projects={projects}
      isOpen={projectModal.isOpen}
      closeModal={projectModal.closeModal}
      onProjectClick={handleProject}
      />
    </>
  );
}
