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

const columns = [
  { key: "name", label: "Vendor Name" },
  { key: "vendor_type", label: "Category" },
  { key: "GST_number", label: "GST Number" },
  { key: "contact_no", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "rating", label: "Rating" }, // static or future use
  { key: "status", label: "Status" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: true, edit: true, delete: true },
  },
];




const data = [
  {
    id: 1,
    vendorName: "Supreme Cement Suppliers",
    vendorType: "Material Supplier",
    gstNumber: "27AABCS1234F1Z5",
    contact: "+91 98765 43210",
    email: "info@supremecement.com",
    rating: "4.5",
    status: "Active",
  },
  {
    id: 2,
    vendorName: "Steel King Industries",
    vendorType: "Material Supplier",
    gstNumber: "27AABSK9876E2Y8",
    contact: "+91 98765 43211",
    email: "sales@steelking.com",
    rating: "4.8",
    status: "Active",
  },
  {
    id: 3,
    vendorName: "Heavy Equipment Rentals",
    vendorType: "Equipment Supplier",
    gstNumber: "27AABHE5432D3X9",
    contact: "+91 98765 43212",
    email: "rent@heavyequip.com",
    rating: "4.2",
    status: "Active",
  },
  {
    id: 4,
    vendorName: "Bitumen Solutions Pvt Ltd",
    vendorType: "Material Supplier",
    gstNumber: "27AABBS7890C4W6",
    contact: "+91 98765 43213",
    email: "contact@bitumensol.com",
    rating: "4.6",
    status: "Active",
  },
  {
    id: 5,
    vendorName: "Metro Contractors",
    vendorType: "Subcontractor",
    gstNumber: "27AABMC3456B5V3",
    contact: "+91 98765 43214",
    email: "info@metrocontractors.com",
    rating: "4.4",
    status: "Active",
  },
];





const projects = [
    { id: "p1", name: "NH-44 Highway Extension" },
    { id: "p2", name: "Metro Line 3 Construction" },
    { id: "p3", name: "Coastal Road Project" },
  ];

export default function VendorManagement() {
  const { isOpen, openModal, closeModal } = useModal();
const queryClient = useQueryClient();

  const materialModal = useModal();  // For Add / Edit material
const projectModal = useModal();   // For Material Inventory
const navigate = useNavigate();

 const [formData, setFormData] = useState({
  vendor_name: "",
  category_id: "",
  contact_number: "",
  email_address: "",
  address: "",
  gst_number: "",
  pan_number: "",
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
  mutationFn: (payload) => postFetch("/vendor", payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    alert("Vendor created!");
    materialModal.closeModal();
  },
  onError: (err) => console.log(err),
});
const { data: categoryData, isLoading: categoryLoading } = useQuery({
  queryKey: ["vendor-categories"],
  queryFn: () =>
    axiosGet("/category", {
      params: { page: 1, limit: 100 },
    }),
});
console.log(categoryData,"categoryData");

const categoryOptions =
  categoryData?.categories?.map((cat: any) => ({
    label: cat.name,
    value: String(cat.id), // or cat.id if backend expects ID
  })) || [];

const vendorModalFields = [
  {
    heading: "Vendor Details",
    items: [
      {
        name: "vendor_name",
        label: "Enter vendor name",
        type: "text",
        placeholder: "Enter vendor name",
      },
      {
        name: "contact_number",
        label: "Contact Number",
        type: "text",
        placeholder: "+91 98765 43210",
      },
       {
        name: "email_address",
        label: "Email",
        type: "text",
        placeholder: "vendor@example.com",
      },
      
      {
        name: "category_id",
        label: "Category",
        type: "select",
        options: categoryOptions,
        placeholder: categoryLoading ? "Loading categories..." : "Select vendor category",
  loading: categoryLoading,
      },
      {
        name: "gst_number",
        label: "GST Number",
        type: "text",
        placeholder: "e.g., 27AABCS1234F1Z5",
      },
       {
        name: "pan_number",
        label: "PAN Number",
        type: "text",
        placeholder: "e.g., AABCS1234F",
      },
      {
        name: "address",
        label: "Address",
        type: "textarea",
        placeholder: "complete address with city and pincode",
        fullWidth: true,
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

// --- React Query GET API ---
const { data: vendorData, isLoading, isError } = useQuery({
  queryKey: ["vendors"],
  queryFn: () => axiosGet("/vendor?page=1&limit=10"),
});

// --- Transform API Response ---
const tableData =
  vendorData?.data?.map((item: any) => ({
    id: item.id,
    name: item.vendor_name,
    vendor_type:item.category.name,
    category_id: item.category_id,
    GST_number: item.gst_number,
    contact_no: item.contact_number,
    email: item.email_address,
    rating: item.rating || "4.5",  // (optional static)
    status: item.status,
  })) || [];


const toISODate = (date:any) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

 const handleSave = () => {
     const payload = {
    vendor_name: formData.vendor_name,
    category_id: Number(formData.category_id),
    contact_number: formData.contact_number,
    email_address: formData.email_address,
    address: formData.address,
    gst_number: formData.gst_number,
    pan_number: formData.pan_number,
    status: formData.status ? "ACTIVE" : "INACTIVE",
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
  const handleView = (row: any) => {
// route to selected project
    console.log(row)
      navigate(`/vendor-detail/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };
  const handleAdminClick = (row:any)=>{
    console.log(row,"handleAdminClick")
     navigate(`/sub-contractor/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  }
  const handleEdit = (row) => {
   setFormData({
    vendor_name: row.name,
    category_id: row.category_id,
    contact_number: row.contact_no,
    email_address: row.email,
    gst_number: row.GST_number,
    pan_number: row.pan_number || "",
    address: row.address || "",
    payment_terms: row.payment_terms || "",
    status: row.status === "ACTIVE",
  });

    materialModal.openModal();
  };
  const handleDelete = (row: any) => alert(`Deleting: ${row.user.name}`);
  const handleExport = () => {
    alert(`Download: ${row.user.name}`);
  };
 const handleProject = (row) => {
    console.log(`handleProject: ${row}`);
    projectModal.closeModal();   // Close modal
  navigate(`/sub-vendor/${row.id}`, {
    state: { row },        // Optional: Pass full object
  });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Vendor Management"  addButtons={actionButtons} />
      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns
          title="Manage vendors, suppliers, and subcontractors"
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
            data={tableData}
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
