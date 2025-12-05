import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch } from "../../api/apiServices";

const columns = [
  { key: "name", label: "Role Name" },
  { key: "description", label: "Description" },
  { key: "permissions", label: "Permissions" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: false, edit: true, delete: true },
  },
];

const roleModalFields = [
  {
    heading: "Role Details",
    items: [
      {
        name: "name",
        label: "Role Name",
        type: "text",
        placeholder: "Enter role name",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter description",
        fullWidth: true,
      },
      {
        name: "permissionIds",
        label: "Permission IDs",
        type: "text",
        placeholder: "e.g. 1,2,3",
        fullWidth: true,
      },
    ],
  },
];

export default function ManageRole() {
  const modal = useModal();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    permissionIds: "",
  });

  // FETCH ROLES -------------------------------
  const { data: roleData, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => axiosGet("/role?page=1&limit=10"),
  });

  const tableData =
    roleData?.roles?.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      permissions: r.permissionIds?.join(", "),
    })) || [];

  // CREATE ROLE -------------------------------
  const createRole = useMutation({
    mutationFn: (payload) => postFetch("/role", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      modal.closeModal();
    },
  });

  // UPDATE ROLE -------------------------------
  const updateRole = useMutation({
    mutationFn: (payload) =>
      postFetch(`/role/${formData.id}`, payload, "PATCH"),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      modal.closeModal();
    },
  });

  // DELETE ROLE -------------------------------
  const deleteRole = useMutation({
    mutationFn: (id) => postFetch(`/role/${id}`, {}, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });

  // HANDLERS -----------------------------------
  const handleAddRole = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      permissionIds: "",
    });
    modal.openModal();
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      name: row.name,
      description: row.description,
      permissionIds: row.permissions,
    });
    modal.openModal();
  };

  const handleDelete = (row) => {
    if (window.confirm("Delete this role?")) {
      deleteRole.mutate(row.id);
    }
  };

  const handleSave = () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      permissionIds: formData.permissionIds
        .split(",")
        .map((n) => Number(n.trim())),
    };

    if (formData.id) {
      updateRole.mutate(payload);
    } else {
      createRole.mutate(payload);
    }
  };
 const actionButtons = [
   
    {
      label: "Add New Role",
      icon: Plus,
      variant: "primary",
      onClick: handleAddRole,
    },
   
  ];
  return (
    <>
      <PageBreadcrumb pageTitle="Manage Roles" addButtons={actionButtons} />

      <ComponentCardWthBtns
        title="Manage Application Roles"
        // addButtonText="Add Role"
        // showAddButton
        // onAddClick={handleAddRole}
      >
        <CustomTable
          columns={columns}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ComponentCardWthBtns>

      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        fields={roleModalFields}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        title={formData.id ? "Edit Role" : "Create Role"}
        saveText={formData.id ? "Update Role" : "Save Role"}
        closeText="Cancel"
      />
    </>
  );
}
