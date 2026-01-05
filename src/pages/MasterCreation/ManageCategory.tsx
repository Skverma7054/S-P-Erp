import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { axiosGet, postFetch } from "../../api/apiServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
    resetForm();
    modal.openModal();
  };

  // ---------- CREATE CATEGORY ----------
  const createCategory = useMutation({
    mutationFn: (payload) => postFetch("/category", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["categories"]});
      modal.closeModal();
      alert("Category created!");
    },
    onError: (err) => {
      console.log(err);
      alert("Failed to create category");
    },
  });

  // ---------- ON SAVE ----------
  const handleSave = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
    };

    createCategory.mutate(payload);
  };

  // ---------- GET ALL CATEGORIES ----------
  const { data: categoryData,isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axiosGet("/category?page=1&limit=10"),
  });

  const tableData =
    categoryData?.categories?.map((item) => ({
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

  return (
    <>
      <PageBreadcrumb
        pageTitle="Category Management"
        addButtons={actionButtons}
      />

      <div className="space-y-6 mt-6">
        <ComponentCardWthBtns title="Manage material categories">
          <CustomTable columns={columns} data={tableData} loading={isLoading} />
        </ComponentCardWthBtns>
      </div>

      {/* ADD CATEGORY MODAL */}
      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        handleSave={handleSave}
        title="Add New Category"
        subtitle="Fill the details below to add a new category"
        fields={categoryModalFields}
        formData={formData}
        setFormData={setFormData}
        saveText="Save Category"
        closeText="Cancel"
      />
    </>
  );
}
