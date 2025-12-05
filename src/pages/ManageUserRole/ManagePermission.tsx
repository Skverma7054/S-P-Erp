import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import CustomModal from "../../customComponent/CustomModal/CustomModal";
import { Plus, Check, X } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch, axiosPatch, axiosDelete } from "../../api/apiServices";

const ACTIONS = ["create", "read", "update", "delete", "manage"];

// TABLE COLUMNS
const columns = [
  { key: "id", label: "ID" },
  { key: "action", label: "Actions" },
  { key: "modules", label: "Modules" },
  {
    key: "actionBtns",
    label: "Action",
    showIcon: { view: false, edit: true, delete: true },
  },
];

export default function ManagePermission() {
  const modal = useModal();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id: null,
    matrix: {}, // matrix[moduleId] = { create: true/false, read: true/false… }
  });

  // -----------------------------------
  // FETCH PERMISSIONS
  // -----------------------------------
  const { data: permApi, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => axiosGet("/permission?page=1&limit=50"),
  });

  // Table formatted data
  const permissions =
    permApi?.permissions?.map((p) => ({
      id: p.id,
      action: p.action.join(", "),
      modules: p.modules.map((m) => m.Name).join(", "),
      raw: p,
    })) || [];

  // -----------------------------------
  // FETCH MODULES
  // -----------------------------------
  const { data: moduleApi } = useQuery({
    queryKey: ["modules"],
    queryFn: () => axiosGet("/module?page=1&limit=200"),
  });

  const modules = moduleApi?.modules || [];

  // -----------------------------------
  // OPEN MODAL → CREATE
  // -----------------------------------
  const handleAdd = () => {
    const initialMatrix = {};
    modules.forEach((m) => {
      initialMatrix[m.id] = {
        create: false,
        read: false,
        update: false,
        delete: false,
        manage: false,
      };
    });

    setFormData({
      id: null,
      matrix: initialMatrix,
    });

    modal.openModal();
  };

  // -----------------------------------
  // OPEN MODAL → EDIT
  // -----------------------------------
  const handleEdit = (row) => {
    const raw = row.raw;

    const initialMatrix = {};
    modules.forEach((m) => {
      initialMatrix[m.id] = {
        create: false,
        read: false,
        update: false,
        delete: false,
        manage: false,
      };
    });

    raw.modules.forEach((mod) => {
      raw.action.forEach((a) => {
        initialMatrix[mod.id][a] = true;
      });
    });

    setFormData({
      id: raw.id,
      matrix: initialMatrix,
    });

    modal.openModal();
  };

  // -----------------------------------
  // DELETE
  // -----------------------------------
  const deletePermission = useMutation({
    mutationFn: (id) => axiosDelete(`/permission/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["permissions"]);
    },
  });

  const handleDelete = (row) => {
    modal.openConfirm({
      title: "Delete Permission?",
      message: "This action cannot be undone.",
      confirmText: "Yes, Delete",
      onConfirm: () => deletePermission.mutate(row.id),
    });
  };

  // -----------------------------------
  // SAVE (CREATE / UPDATE)
  // -----------------------------------
  const createPermission = useMutation({
    mutationFn: (payload) => postFetch("/permission", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["permissions"]);
      modal.closeModal();
    },
  });

  const updatePermission = useMutation({
    mutationFn: (payload) =>
      axiosPatch(`/permission/${formData.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["permissions"]);
      modal.closeModal();
    },
  });

  const handleSave = () => {
    const moduleIds = [];
    const actionSet = new Set();

    Object.entries(formData.matrix).forEach(([moduleId, actions]) => {
      const active = Object.entries(actions)
        .filter(([_, v]) => v)
        .map(([k]) => k);

      if (active.length > 0) {
        moduleIds.push(Number(moduleId));
        active.forEach((a) => actionSet.add(a));
      }
    });

    const payload = {
      action: [...actionSet],
      moduleIds,
    };

    formData.id ? updatePermission.mutate(payload) : createPermission.mutate(payload);
  };

  // -----------------------------------
  // TOGGLE FUNCTION FOR MATRIX
  // -----------------------------------
  const toggle = (moduleId, action) => {
    setFormData((prev) => ({
      ...prev,
      matrix: {
        ...prev.matrix,
        [moduleId]: {
          ...prev.matrix[moduleId],
          [action]: !prev.matrix[moduleId][action],
        },
      },
    }));
  };

  // -----------------------------------
  // ACTION BUTTONS
  // -----------------------------------
  const actionButtons = [
    {
      label: "Add Permission",
      icon: Plus,
      variant: "primary",
      onClick: handleAdd,
    },
  ];

  return (
    <>
      <PageBreadcrumb
        pageTitle="Manage Permissions"
        addButtons={actionButtons}
      />

      <ComponentCardWthBtns title="Permission Management">
        <CustomTable
          columns={columns}
          data={permissions}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ComponentCardWthBtns>

      {/* ------------------------------ */}
      {/* CUSTOM MODAL WITH MATRIX TABLE */}
      {/* ------------------------------ */}
      <CustomModal
        isOpen={modal.isOpen}
        closeModal={modal.closeModal}
        title={formData.id ? "Edit Permission" : "Create Permission"}
        saveText={"Save Permissions"}
        closeText={"Cancel"}
        handleSave={handleSave}
        loading={createPermission.isPending || updatePermission.isPending}
        fields={[
          {
            heading: "Set Permissions",
            items: [
              {
                name: "matrix",
                label: "Module-wise Permissions",
                type: "custom",
                component: (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="p-2">Module</th>
                          {ACTIONS.map((a) => (
                            <th key={a} className="p-2 text-center capitalize">
                              {a}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {modules.map((mod) => (
                          <tr key={mod.id} className="border-b">
                            <td className="p-2">{mod.Name}</td>

                            {ACTIONS.map((a) => {
                              const active = formData.matrix?.[mod.id]?.[a];

                              return (
                                <td key={a} className="p-2 text-center">
                                  <button
                                    onClick={() => toggle(mod.id, a)}
                                    className={`p-2 rounded-lg transition ${
                                      active
                                        ? "bg-green-100 hover:bg-green-200"
                                        : "bg-red-100 hover:bg-red-200"
                                    }`}
                                  >
                                    {active ? (
                                      <Check className="text-green-700 w-5 h-5" />
                                    ) : (
                                      <X className="text-red-700 w-5 h-5" />
                                    )}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
              },
            ],
          },
        ]}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
