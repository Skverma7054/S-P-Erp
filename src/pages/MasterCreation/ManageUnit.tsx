import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import CustomTable from "../../customComponent/tables/CustomTable";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { axiosGet, postFetch } from "../../api/apiServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ---------- TABLE COLUMNS ----------
const columns = [
  { key: "name", label: "Unit Name" },
  { key: "description", label: "Description" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: false, edit: true, delete: true },
  },
];

// ---------- MODAL FIELDS ----------
const unitModalFields = [
  {
    heading: "Unit Details",
    items: [
      {
        name: "name",
        label: "Unit Name",
        type: "text",
        placeholder: "Enter unit name (e.g., Bags, Ton, Cubic Meter)",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter unit description",
        fullWidth: true,
      },
    ],
  },
];

export default function ManageUnit() {
  const modal = useModal();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Reset form
  const resetForm = () =>
    setFormData({
      name: "",
      description: "",
    });

  // Open modal
  const handleAddUnit = () => {
    resetForm();
    modal.openModal();
  };

  // ---------- CREATE UNIT ----------
  const createUnit = useMutation({
    mutationFn: (payload) => postFetch("/unit", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["units"]);
      modal.closeModal();
      alert("Unit created successfully!");
    },
    onError: () => {
      alert("Failed to create unit");
    },
  });

  // Save handler
  const handleSave = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
    };

    createUnit.mutate(payload);
  };

  // ---------- GET UNITS ----------
  const { data: unitData , isLoading} = useQuery({
    queryKey: ["units"],
    queryFn: () => axiosGet("/unit?page=1&limit=10"),
  });

  const tableData =
    unitData?.units?.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    })) || [];

  // ---------- ACTION BUTTONS ----------
  const actionButtons = [
    {
      label: "Add Unit",
      icon: Plus,
      variant: "primary",
      onClick: handleAddUnit,
    },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle="Unit Management"
        addButtons={actionButtons}
      />

      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Manage measurement units">
          <CustomTable columns={columns} data={tableData} loading={isLoading} />
        </ComponentCardWthBtns>
      </div>

      {/* ADD UNIT MODAL */}
      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        handleSave={handleSave}
        title="Add New Unit"
        subtitle="Fill the details below to add a new measurement unit"
        fields={unitModalFields}
        formData={formData}
        setFormData={setFormData}
        saveText="Save Unit"
        closeText="Cancel"
      />
    </>
  );
}
