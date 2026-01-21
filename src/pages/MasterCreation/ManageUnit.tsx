import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import CustomTable from "../../customComponent/tables/CustomTable";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { axiosDelete, axiosGet, axiosPatch, postFetch } from "../../api/apiServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmDialog from "../../customComponent/CustomModal/ConfirmDialog";
type UnitPayload = {
  name: string;
  description: string;
};

type Unit = {
  id: number;
  name: string;
  description: string;
};
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
 const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  // Reset form
  const resetForm = () =>
    setFormData({
      name: "",
      description: "",
    });

  // Open modal
  const handleAddUnit = () => {
    setEditingUnitId(null);
    resetForm();
    modal.openModal();
  };

  // ---------- CREATE UNIT ----------
  const createUnit = useMutation({
    mutationFn: (payload: UnitPayload) => postFetch("/unit", payload),
    onSuccess: () => {
      toast.success("Unit created successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["units"] });
      modal.closeModal();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create unit ❌");
    },
  });
 // ---------- UPDATE ----------
  const updateUnit = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UnitPayload }) =>
      axiosPatch(`/unit/${id}`, payload),
    onSuccess: () => {
      toast.success("Unit updated successfully ✨");
      queryClient.invalidateQueries({ queryKey: ["units"] });
      modal.closeModal();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update unit ❌");
    },
  });

  // ---------- DELETE ----------
  const deleteUnit = useMutation({
    mutationFn: (id: number) => axiosDelete(`/unit/${id}`),
    onSuccess: () => {
      toast.success("Unit deleted successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete unit ❌");
    },
  });
  // ---------- SAVE ----------
  const handleSave = () => {
    const payload: UnitPayload = {
      name: formData.name,
      description: formData.description,
    };

    if (editingUnitId) {
      updateUnit.mutate({ id: editingUnitId, payload });
    } else {
      createUnit.mutate(payload);
    }
  };

  // ---------- GET UNITS ----------
  const { data: unitData , isLoading} = useQuery({
    queryKey: ["units"],
    queryFn: () => axiosGet("/unit?page=1&limit=10"),
  });

  const tableData =
    unitData?.units?.map((item:Unit) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    })) || [];
 // ---------- EDIT ----------
  const handleEditUnit = (row: Unit) => {
    setEditingUnitId(row.id);
    setFormData({
      name: row.name,
      description: row.description,
    });
    modal.openModal();
  };

  // ---------- DELETE ----------
  const handleDeleteClick = (row: Unit) => {
    setUnitToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!unitToDelete) return;
    await deleteUnit.mutateAsync(unitToDelete.id);
    setDeleteDialogOpen(false);
    setUnitToDelete(null);
  };

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
          <CustomTable columns={columns} data={tableData} loading={isLoading}  onEdit={handleEditUnit}
            onDelete={handleDeleteClick}/>
        </ComponentCardWthBtns>
      </div>

      {/* ADD UNIT MODAL */}
      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        handleSave={handleSave}
        title={editingUnitId ? "Edit Unit" : "Add New Unit"}
         subtitle={
          editingUnitId
            ? "Update unit details"
            : "Fill the details below to add a new unit"
        }
        fields={unitModalFields}
        formData={formData}
        setFormData={setFormData}
       saveText={editingUnitId ? "Update Unit" : "Save Unit"}
        closeText="Cancel"
        loading={createUnit.isPending || updateUnit.isPending} // ✅ correct
      />
      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setUnitToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Unit"
        message={`Are you sure you want to delete "${unitToDelete?.name}"?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="error"
      />
    </>
  );
}
