import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { Plus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch, axiosPatch, axiosDelete } from "../../api/apiServices";

// -------------------------------------------------
// TABLE COLUMNS
// -------------------------------------------------
const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobileNumber", label: "Mobile" },
  { key: "roleName", label: "Role" },
  {
    key: "action",
    label: "Actions",
    showIcon: { view: false, edit: true, delete: true },
  },
];

// -------------------------------------------------
// MODAL FIELDS
// -------------------------------------------------
const userModalFields = [
  {
    heading: "User Details",
    items: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        placeholder: "Enter email address",
      },
      {
        name: "password",
        label: "Password",
        type: "text",
        placeholder: "Enter password",
        showIf: (data) => !data.id, // show only on create
      },
      {
        name: "mobileNumber",
        label: "Mobile Number",
        type: "text",
        placeholder: "+91 9876543210",
      },
      {
        name: "roleId",
        label: "Select Role",
        type: "select",
        placeholder: "Choose role",
        options: [], // dynamically filled
      },
      {
        name: "fileId",
        label: "File ID",
        type: "number",
        placeholder: "Enter File ID",
      },
    ],
  },
];

export default function ManageUser() {
  const modal = useModal();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    roleId: "",
    fileId: "",
  });

  // -------------------------------------------------
  // GET USERS
  // -------------------------------------------------
  const { data: userApi, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => axiosGet("/user?page=1&limit=10"),
  });

  const users =
    userApi?.users?.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      mobileNumber: u.mobileNumber,
      roleId: u.roleId,
      roleName: u.role?.Name,
    })) || [];

  // -------------------------------------------------
  // GET ROLES (for dropdown)
  // -------------------------------------------------
  const { data: roleApi } = useQuery({
    queryKey: ["roles"],
    queryFn: () => axiosGet("/role?page=1&limit=100"),
  });

  const roles =
    roleApi?.roles?.map((r) => ({
      label: r.name,
      value: r.id,
    })) || [];

  // Inject role options into modal dynamically
  userModalFields[0].items.find((f) => f.name === "roleId").options = roles;

  // -------------------------------------------------
  // CREATE USER
  // -------------------------------------------------
  const createUser = useMutation({
    mutationFn: (payload) => postFetch("/user/register", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      modal.closeModal();
    },
  });

  // -------------------------------------------------
  // UPDATE USER
  // -------------------------------------------------
  const updateUser = useMutation({
    mutationFn: (payload) =>
      axiosPatch(`/user/users/${formData.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      modal.closeModal();
    },
  });

  // -------------------------------------------------
  // DELETE USER
  // -------------------------------------------------
  const deleteUser = useMutation({
    mutationFn: (id) => axiosDelete(`/user/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // -------------------------------------------------
  // HANDLERS
  // -------------------------------------------------

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      mobileNumber: "",
      roleId: "",
      fileId: "",
    });
    modal.openModal();
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      name: row.name,
      email: row.email,
      password: "",
      mobileNumber: row.mobileNumber,
      roleId: row.roleId,
      fileId: row.fileId || "",
    });
    modal.openModal();
  };

  const handleDelete = (row) => {
    modal.openConfirm({
      title: "Are you sure?",
      message: "This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      onConfirm: () => deleteUser.mutate(row.id),
    });
  };

  const handleSave = () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      roleId: formData.roleId,
      fileId: Number(formData.fileId),
    };

    if (!formData.id) {
      payload.password = formData.password;
      createUser.mutate(payload);
    } else {
      updateUser.mutate(payload);
    }
  };

  const actionButtons = [
    {
      label: "Add User",
      icon: Plus,
      variant: "primary",
      onClick: handleAdd,
    },
  ];

  return (
    <>
      <PageBreadcrumb pageTitle="Manage Users" addButtons={actionButtons} />

      <ComponentCardWthBtns title="User Management">
        <CustomTable
          columns={columns}
          data={users}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ComponentCardWthBtns>

      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        fields={userModalFields}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
        title={formData.id ? "Edit User" : "Create User"}
        saveText={formData.id ? "Update User" : "Create User"}
        closeText="Cancel"
        loading={createUser.isPending || updateUser.isPending}
      />
    </>
  );
}
