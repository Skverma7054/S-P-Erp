import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  postFetch,
} from "../../api/apiServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "../../customComponent/CustomModal/ConfirmDialog";
import { toast } from "sonner";
type CategoryPayload = {
  name: string;
  description: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
};

// ------------ CATEGORY TABLE COLUMNS ------------
const columns = [
  { key: "name", label: "Category Name" },
  { key: "description", label: "Description" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: false, edit: true, delete: true },
  },
];

// ------------ MODAL FIELDS ------------
const categoryModalFields = [
  {
    heading: "Category Details",
    items: [
      {
        name: "name",
        label: "Category Name",
        type: "text",
        placeholder: "Enter category name",
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

export default function ManageCategory() {
  const modal = useModal();
  const queryClient = useQueryClient();
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // ---------- RESET FORM ----------
  const resetForm = () =>
    setFormData({
      name: "",
      description: "",
    });

  // ---------- OPEN ADD CATEGORY ----------
  const handleAddCategory = () => {
    setEditingCategoryId(null); // ✅ important
    resetForm();
    modal.openModal();
  };

  // ---------- CREATE CATEGORY ----------
  const createCategory = useMutation({
    mutationFn: (payload: CategoryPayload) => postFetch("/category", payload),
    onSuccess: () => {
       toast.success("Category created successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      modal.closeModal();
      
    },
    onError: (error: any) => {
      toast.error(
      error?.message || "Failed to create category ❌"
    );
    },
  });
  const updateCategory = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryPayload }) =>
      axiosPatch(`/category/${id}`, payload),
    onSuccess: () => {
       toast.success("Category updated successfully ✨");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      modal.closeModal();
      
    },
    onError: (error: any) => {
    toast.error(
      error?.message || "Failed to update category ❌"
    );
  },
  });
 const deleteCategory = useMutation({
  mutationFn: (id: number) => axiosDelete(`/category/${id}`),

  onSuccess: () => {
    toast.success("Category deleted successfully ✅");
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  },

  onError: (error: any) => {
    toast.error(
      error?.message || "Failed to delete category. Please try again ❌"
    );
  },
});


  // ---------- ON SAVE ----------
  const handleSave = () => {
    const payload: CategoryPayload = {
      name: formData.name,
      description: formData.description,
    };

    if (editingCategoryId) {
      updateCategory.mutate({ id: editingCategoryId, payload });
    } else {
      createCategory.mutate(payload);
    }
  };

  // ---------- GET ALL CATEGORIES ----------
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axiosGet("/category?page=1&limit=10"),
  });

  const tableData =
    categoryData?.categories?.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    })) || [];

  // ---------- ACTION BUTTONS ----------
  const actionButtons = [
    {
      label: "Add Category",
      icon: Plus,
      variant: "primary",
      onClick: handleAddCategory,
    },
  ];
  const handleEditCategory = (row: Category) => {
    setEditingCategoryId(row.id);
    setFormData({
      name: row.name,
      description: row.description,
    });
    modal.openModal();
  };
const handleDeleteClick = (row: Category) => {
  setCategoryToDelete(row);
  setDeleteDialogOpen(true);
};
const handleConfirmDelete = async () => {
  if (!categoryToDelete) return;

  try {
    await deleteCategory.mutateAsync(categoryToDelete.id);

    // ✅ Close dialog ONLY on success
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  } catch (err) {
    // ❌ Error toast already shown in mutation
    // Keep dialog open or close (your choice)
    setDeleteDialogOpen(false); // optional
  }
};


  return (
    <>
      <PageBreadcrumb
        pageTitle="Category Management"
        addButtons={actionButtons}
      />

      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Manage material categories">
          <CustomTable
            columns={columns}
            data={tableData}
            loading={isLoading}
            onEdit={(row) => handleEditCategory(row)}
 onDelete={(row) => handleDeleteClick(row)}          />
        </ComponentCardWthBtns>
      </div>

      {/* ADD CATEGORY MODAL */}
      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        handleSave={handleSave}
        title={editingCategoryId ? "Edit Category" : "Add New Category"}
        subtitle={
    editingCategoryId
      ? "Update category details"
      : "Fill the details below to add a new category"
  }
        fields={categoryModalFields}
        formData={formData}
        setFormData={setFormData}
         saveText={editingCategoryId ? "Update Category" : "Save Category"}
        closeText="Cancel"
        loading={createCategory.isPending  || updateCategory.isPending }  // ✅ ADD THIS
      />
      <ConfirmDialog
  isOpen={deleteDialogOpen}
  onClose={() => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }}
  onConfirm={handleConfirmDelete}
  title="Delete Category"
  message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
  confirmText="Yes, Delete"
  cancelText="Cancel"
  type="error"
/>

    </>
  );
}
