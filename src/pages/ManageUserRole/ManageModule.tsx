import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { useModal } from "../../hooks/useModal";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch, axiosDelete, axiosPatch } from "../../api/apiServices";
import ConfirmDialog from "../../customComponent/CustomModal/ConfirmDialog";

// ----------------------------------------
// TABLE COLUMNS
// ----------------------------------------
const columns = [
  { key: "Name", label: "Module Name" },
  { key: "description", label: "Description" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: false, edit: true, delete: true },
  },
];

// ----------------------------------------
// MODAL FIELDS
// ----------------------------------------
const moduleModalFields = [
  {
    heading: "Module Details",
    items: [
      {
        name: "Name",
        label: "Module Name",
        type: "text",
        placeholder: "Enter module name",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter description",
        fullWidth: true,
      },
    ],
  },
];

export default function ManageModule() {

const [confirmData, setConfirmData] = useState({
  isOpen: false,
  row: null,
});

const handleDelete = (row) => {
  setConfirmData({
    isOpen: true,
    row,
  });
};

const confirmDelete = async () => {
  await deleteModule.mutateAsync(confirmData.row.id);
  setConfirmData({ isOpen: false, row: null });
};


  const modal = useModal();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: null,
    Name: "",
    description: "",
  });

  // ----------------------------------------
  // FETCH MODULE LIST (GET API)
  // ----------------------------------------
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: () => axiosGet("/module?page=1&limit=10"),
  });

  const tableData =
    apiResponse?.modules?.map((m) => ({
      id: m.id,
      Name: m.Name,
      description: m.description,
    })) || [];

  // ----------------------------------------
  // CREATE MODULE (POST API)
  // ----------------------------------------
  const createModule = useMutation({
    mutationFn: (payload) => postFetch("/module", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["modules"]});
      modal.closeModal();
    },
  });

  // ----------------------------------------
  // UPDATE MODULE (PATCH API)
  // ----------------------------------------
  const updateModule = useMutation({
    mutationFn: (payload) =>
      axiosPatch(`/module/${formData.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["modules"]});
      modal.closeModal();
    },
  });

  // ----------------------------------------
  // DELETE MODULE (DELETE API)
  // ----------------------------------------
  const deleteModule = useMutation({
    mutationFn: (id) => axiosDelete(`/module/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["modules"]});
    },
  });

  // ----------------------------------------
  // HANDLERS
  // ----------------------------------------
  const handleAdd = () => {
    setFormData({
      id: null,
      Name: "",
      description: "",
    });
    modal.openModal();
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      Name: row.Name,
      description: row.description,
    });
    modal.openModal();
  };

//   const handleDelete = (row) => {
//     if (window.confirm("Are you sure you want to delete this module?")) {
//       deleteModule.mutate(row.id);
//     }
//   };

  const handleSave = () => {
    const payload = {
      Name: formData.Name,
      description: formData.description,
    };

    if (formData.id) {
      updateModule.mutate(payload);
    } else {
      createModule.mutate(payload);
    }
  };
const actionButtons = [
   
    {
      label: "Add Module",
      icon: Plus,
      variant: "primary",
      onClick: handleAdd,
    },
   
  ];
  return (
    <>
      <PageBreadcrumb pageTitle="Manage Modules" addButtons={actionButtons} />

      <ComponentCardWthBtns
        title="Module Management"
        // addButtonText="Add Module"
        // showAddButton
        // onAddClick={handleAdd}
      >
        <CustomTable
          columns={columns}
          data={tableData}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ComponentCardWthBtns>

      {/* Modal */}
      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        fields={moduleModalFields}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        title={formData.id ? "Edit Module" : "Create Module"}
        saveText={formData.id ? "Update Module" : "Save Module"}
        closeText="Cancel"
         loading={createModule.isPending || updateModule.isPending}   // ⬅ ADD THIS
      />
      <ConfirmDialog
  isOpen={confirmData.isOpen}
  onClose={() => setConfirmData({ isOpen: false, row: null })}
  onConfirm={confirmDelete}
  title="Delete Module?"
  message="This action cannot be undone."
  confirmText="Yes, delete it"
  cancelText="Cancel"
  type="error"
/>
    </>
  );
}
