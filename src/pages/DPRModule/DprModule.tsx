import React, { useState } from "react";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Download, Edit, Package, Plus, Trash } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import CustomSelectModal from "../../customComponent/CustomModal/CustomSelectModal";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch } from "../../api/apiServices";
type VendorFormData = {
  name: string;
  vendor_type: string;
  GST_number: string;
  contact_no: string;
  email: string;
  status: boolean;
};

type TableRow = {
  id: number;
  [key: string]: any;
};

const columns = [
  { key: "dpr_no", label: "DPR No" },
  { key: "project", label: "Project" },
  { key: "chainage", label: "Chainage" },
  { key: "date", label: "Date" },
  { key: "pm_name", label: "PM Name" },
  { key: "manpower", label: "Manpower" },
  { key: "images", label: "Images" },
  { key: "status", label: "Status" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: true, edit: true, delete: true },
  },
];





const dprTableData = [
  {
    id: 1,
    dpr_no: "DPR-001",
    project: "NH-44 Highway Extension",
    chainage: "CH 12.5-15.2",
    date: "2024-11-22",
    pm_name: "Rajesh Kumar",
    manpower: 45,
    images: 12,
    status: "Approved",
  },
  {
    id: 2,
    dpr_no: "DPR-002",
    project: "Metro Line 3 Construction",
    chainage: "CH 8.0-12.5",
    date: "2024-11-22",
    pm_name: "Priya Sharma",
    manpower: 62,
    images: 18,
    status: "Pending",
  },
  {
    id: 3,
    dpr_no: "DPR-003",
    project: "Coastal Road Project",
    chainage: "CH 5.5-8.2",
    date: "2024-11-21",
    pm_name: "Amit Patel",
    manpower: 38,
    images: 10,
    status: "Approved",
  },
  {
    id: 4,
    dpr_no: "DPR-004",
    project: "NH-44 Highway Extension",
    chainage: "CH 8.0-12.0",
    date: "2024-11-21",
    pm_name: "Rajesh Kumar",
    manpower: 28,
    images: 5,
    status: "Rejected",
  },
];



const vendorModalFields = [
  {
    heading: "Vendor Details",
    items: [
      {
        name: "name",
        label: "Enter vendor name",
        type: "text",
        placeholder: "Enter vendor name",
      },
      {
        name: "vendor_type",
        label: "Select type",
        type: "select",
        options: [
          { label: "Material Supplier", value: "Material Supplier" },
          { label: "Equipment Supplier", value: "Equipment Supplier" },
          { label: "Subcontractor", value: "Subcontractor" },
        ],
        placeholder: "Select vendor type",
      },
      {
        name: "GST_number",
        label: "GST Number",
        type: "text",
        placeholder: "e.g., 27AABCS1234F1Z5",
      },
      {
        name: "contact_no",
        label: "Contact Number",
        type: "text",
        placeholder: "+91 98765 43210",
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "vendor@example.com",
      },
      {
        name: "status",
        label: "Active",
        type: "switch",
        fullWidth: true,
      },
    ],
  },
];


const projects = [
    { id: "p1", name: "NH-44 Highway Extension" },
    { id: "p2", name: "Metro Line 3 Construction" },
    { id: "p3", name: "Coastal Road Project" },
  ];

export default function DprModule() {
  const { isOpen, openModal, closeModal } = useModal();
const queryClient = useQueryClient();

  const materialModal = useModal();  // For Add / Edit material
const projectModal = useModal();   // For Material Inventory
const navigate = useNavigate();

 const [formData, setFormData] = useState<VendorFormData>({
  name: "",
  vendor_type: "",
  GST_number: "",
  contact_no: "",
  email: "",
  status: true,
});

  

  const handleMaterialInventory = () => {
    console.log("Material Inventory Clicked");
    projectModal.openModal();
    // openModal();
    // alert("Material Inventory clicked!");
  };
  const handleCreateVendor = () => {
    setFormData({
      name: "",
      vendor_type: "",
      GST_number: "",
      contact_no: "",
      email: "",
      status: true,
    });
    materialModal.openModal();
  };
const createVendor = useMutation({
  mutationFn: (payload: VendorFormData) => postFetch("/vendor", payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    alert("Vendor created!");
    materialModal.closeModal(); // ✅ FIXED
  },
  onError: (err) => console.log(err),
});


// --- React Query GET API ---
const { data: vendorData, isLoading, isError } = useQuery({
  queryKey: ["vendors"],
  queryFn: () => axiosGet("/vendor?page=1&limit=10"),
});

// --- Transform API Response ---
const tableData =
  vendorData?.vendors?.map((item: any) => ({
    id: item.id,
    name: item.name,
    vendor_type: item.vendor_type,
    GST_number: item.GST_number,
    contact_no: item.contact_no,
    email: item.email,
    rating: item.rating || "4.5",  // (optional static)
    status: item.status,
  })) || [];


const toISODate = (date:any) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

 const handleSave = () => {
    const payload = {
      name: formData.name,
      vendor_type: formData.vendor_type,
      GST_number: formData.GST_number,
      contact_no: formData.contact_no,
      email: formData.email,
      status: formData.status ? "active" : "inactive",
    };

    createVendor.mutate(payload);
  };


  const actionButtons = [
    // {
    //   label: "Material Inventory",
    //   icon: Package,
    //   variant: "gray",
    //   onClick: handleMaterialInventory,
    // },
    {
      label: "Add New Vendor",
      icon: Plus,
      variant: "primary",
      onClick: handleCreateVendor,
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
  const handleView = (row: TableRow) => {
// route to selected project
    console.log(row)
      navigate(`/dpr-detail/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };
  const handleAdminClick = (row:TableRow)=>{
    console.log(row,"handleAdminClick")
     navigate(`/sub-contractor/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  }
  const handleEdit = (row:any) => {
    setFormData({
      name: row.name,
      vendor_type: row.vendor_type,
      GST_number: row.GST_number,
      contact_no: row.contact_no,
      email: row.email,
      status: row.status === "active",
    });

    materialModal.openModal();
  };
  const handleDelete = (row: TableRow) => alert(`Deleting: ${row.user.name}`);
  const handleExport = (row: TableRow) => {
  alert(`Download vendor data: ${row.name}`);
};

 const handleProject = (row:TableRow) => {
    console.log(`handleProject: ${row}`);
    projectModal.closeModal();   // Close modal
  navigate(`/sub-vendor/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="DPR Module"   />
      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns
          title="Review and approve Daily Progress Reports"
        //   showSearch
        //   showAddButton
        //   onAddClick={() => console.log("Add Case clicked")}
        //   showDropdown
        //   dropdownOptions={[
        //     { label: "All Cases", value: "all" },
        //     { label: "Ongoing", value: "ongoing" },
        //     { label: "Closed", value: "closed" },
        //   ]}
        //   onDropdownChange={(value) => console.log("Filter:", value)}
        //   showDownload
        //   onExportClick={handleExport}
        >
          <CustomTable
            columns={columns}
            data={dprTableData}
            onView={handleView}
onAdmin={handleAdminClick}
loading={isLoading}
          />
        </ComponentCardWthBtns>
      </div>
      <CustomModal
        isOpen={materialModal.isOpen}
        closeModal={materialModal.closeModal}
        handleSave={handleSave}
       title={formData.name ? "Edit Vendor" : "Add New Vendor"}

        subtitle="Fill the details below to add/update a vendor"
        fields={vendorModalFields}
        formData={formData}
        setFormData={setFormData}
        saveText={formData.name ? "Update Vendor" : "Add Vendor"}
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
