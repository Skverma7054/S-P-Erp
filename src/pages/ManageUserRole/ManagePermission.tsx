import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch, axiosPatch, axiosDelete } from "../../api/apiServices";
import Button from "../../components/ui/button/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
const ACTIONS = ["create", "read", "update", "delete", ];

export default function ManagePermission() {
  const queryClient = useQueryClient();
const [isModalOpen, setIsModalOpen] = useState(false);

  const [matrix, setMatrix] = useState({});
  const [originalMatrix, setOriginalMatrix] = useState({});
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editingPermissionId, setEditingPermissionId] = useState(null);
const [selectedModuleIds, setSelectedModuleIds] = useState([]);
const [activeModuleId, setActiveModuleId] = useState(null);

  // ----------------------------------------------------------
  // 1. GET MODULE LIST
  // ----------------------------------------------------------
  const { data: moduleApi } = useQuery({
    queryKey: ["modules"],
    queryFn: () => axiosGet("/module?page=1&limit=200"),
  });

  const modules = moduleApi?.modules || [];

  // ----------------------------------------------------------
  // 2. GET ALL PERMISSIONS
  // ----------------------------------------------------------
  const { data: permApi ,isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => axiosGet("/permission"),
  });

  const permissions =
    permApi?.permissions?.map((p) => ({
      id: p.id,
      action: p.action,
      modules: p.modules.map((m) => m.Name).join(", "),
      raw: p,
    })) || [];

    console.log( permissions, "DATAT====")

  // ----------------------------------------------------------
  // Initialize full matrix (all modules, all actions = false)
  // ----------------------------------------------------------
  const initEmptyMatrix = () => {
    const obj = {};
    modules.forEach((m) => {
      obj[m.id] = {
        create: false,
        read: false,
        update: false,
        delete: false,
        manage: false,
      };
    });
    return obj;
  };

const handleModalClose = ()=>{
  setIsModalOpen(false)
}

  // ----------------------------------------------------------
  // Start CREATE MODE
  // ----------------------------------------------------------
  const startCreate = () => {
  const empty = initEmptyMatrix();
  setMatrix(empty);
  setOriginalMatrix(JSON.stringify(empty));

  const firstId = modules[0]?.id || null;
  setActiveModuleId(firstId);
  setSelectedModuleIds(firstId ? [firstId] : []);

  setEditingPermissionId(null);
  setIsModalOpen(true);
};


  // ----------------------------------------------------------
  // Start EDIT MODE
  // ----------------------------------------------------------
  const startEdit = (row) => {
  const raw = row.raw;
  const newMatrix = initEmptyMatrix();

  raw.modules.forEach((mod) => {
    raw.action.forEach((a) => {
      newMatrix[mod.id][a] = true;
    });
  });

  const moduleIds = raw.modules.map((m) => m.id);

  setMatrix(newMatrix);
  setOriginalMatrix(JSON.stringify(newMatrix));
  setSelectedModuleIds(moduleIds);
  setActiveModuleId(moduleIds[0] || null);
  setEditingPermissionId(raw.id);
  setIsModalOpen(true);
};


  // ----------------------------------------------------------
  // DELETE PERMISSION
  // ----------------------------------------------------------
  const deletePermission = useMutation({
    mutationFn: (id) => axiosDelete(`/permission/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["permissions"]),
  });

  const handleDelete = (row) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      deletePermission.mutate(row.id);
    }
  };

  // ----------------------------------------------------------
  // Toggle action inside matrix
  // ----------------------------------------------------------
  const toggle = (moduleId, action) => {
  setMatrix((prev) => {
    const newValue = !prev[moduleId][action];
    const updated = { ...prev };

    selectedModuleIds.forEach((id) => {
      updated[id] = {
        ...updated[id],
        [action]: newValue,
      };
    });

    return updated;
  });
};


  // ----------------------------------------------------------
  // SAVE (Create/Update)
  // ----------------------------------------------------------
  const createPermission = useMutation({
    mutationFn: (payload) => postFetch("/permission", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["permissions"]);
      resetPanel();
    },
  });

  const updatePermission = useMutation({
    mutationFn: (payload) =>
      axiosPatch(`/permission/${editingPermissionId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["permissions"]);
      resetPanel();
    },
  });

  const resetPanel = () => {
    setMatrix({});
    setSelectedModuleId(null);
    setEditingPermissionId(null);
  };

  const handleSave = () => {
  const moduleIds = [];
  const actionSet = new Set();

  Object.entries(matrix).forEach(([moduleId, perms]) => {
    const anyTrue = Object.values(perms).some((v) => v === true);

    if (anyTrue) moduleIds.push(Number(moduleId));

    Object.entries(perms).forEach(([action, enabled]) => {
      if (enabled) actionSet.add(action);
    });
  });

  const payload = {
    action: [...actionSet],
    moduleIds,
  };

  editingPermissionId
    ? updatePermission.mutate(payload)
    : createPermission.mutate(payload);
};


  const hasChanges = JSON.stringify(matrix) !== originalMatrix;
const actionButtons = [
   
    {
      label: "Add Permission",
      icon: Plus,
      variant: "primary",
      onClick: startCreate,
    },
   
  ];
  // ----------------------------------------------------------
  // UI STARTS HERE
  // ----------------------------------------------------------
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Manage Permissions"
        addButtons={actionButtons}
      />

      {/* ------------------- PERMISSION LIST TABLE ------------------- */}
      <ComponentCardWthBtns title="Permission List">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
         
        <Table>
          <TableHeader
            className="bg-gray-100 hover:bg-gray-200 border-b border-gray-200  border-b border-gray-100 "
            // className="border-b border-gray-100 dark:border-white/[0.05]"
          >
            <TableRow>
              <TableCell
              isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
              >
ID
              </TableCell>
               <TableCell
              isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
              >
Modules
              </TableCell>
              {ACTIONS.map((a) => (
               <TableCell
              isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
              >
{a}              </TableCell>
               ))}
                <TableCell
              isHeader
                  className="px-5 py-3 font-medium text-gray-800 text-start text-theme-sm dark:text-gray-400"
              >
Manage
              </TableCell>
            </TableRow>

            </TableHeader>
             <TableBody
            // className="divide-y divide-gray-100 dark:divide-gray-800"
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
          >
            {permissions.map((p) => (
<TableRow
                key={p}
                
              >
 <TableCell
                    key={p}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {p.id}
                  </TableCell>
<TableCell
                    key={p}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                   {p.modules}
                  </TableCell>
                   {ACTIONS.map((a) => (
<TableCell
                    key={a}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
<button
                            // onClick={() => toggle(mod.id, action)}
                            className={`p-2 rounded-lg transition ${
                              p.raw.action.includes(a)
                                ? "bg-green-100 hover:bg-green-200"
                                : "bg-red-100 hover:bg-red-200"
                            }`}
                          >
            {p.raw.action.includes(a) ? (
              <Check className="text-green-700 w-5 h-5" />
            ) : (
              <X className="text-red-700 w-5 h-5" />
            )}
            </button>
                  </TableCell>
                    ))}
                    <TableCell  key={p}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
{/* MANAGE BUTTONS */}
       <div className="flex gap-2">
          <button
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit"
                               onClick={() => startEdit(p)}
                              >
                                <Edit size={16} />
                              </button>
          
<button
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                               onClick={() => handleDelete(p)}
                              >
                                <Trash2 size={16} />
                              </button>
          </div>
       
                    </TableCell>
              </TableRow>
 ))}


          </TableBody>
      </Table>
</div>
</div>
      </ComponentCardWthBtns>

      {/* ------------------- EDITOR PANEL ------------------- */}
     {/* ------------------- EDITOR MODAL ------------------- */}
{isModalOpen && (
 <Modal isOpen={isModalOpen} onClose={handleModalClose} className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-semibold">
          {editingPermissionId ? "Edit Permission" : "Create Permission"}
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-4 gap-6">

        {/* LEFT MODULE LIST */}
        <div className="col-span-1 border-r pr-4">
          <h3 className="mb-3 font-semibold">Modules</h3>

          {modules.map((m) => (
            <div
              key={m.id}
             onClick={() => {
  setSelectedModuleIds((prev) => {
    const isSelected = prev.includes(m.id);

    // If selecting NEW module → copy CRUD from active module
    if (!isSelected && activeModuleId) {
      setMatrix((old) => ({
        ...old,
        [m.id]: { ...old[activeModuleId] },
      }));
    }

    return isSelected
      ? prev.filter((id) => id !== m.id)
      : [...prev, m.id];
  });

  setActiveModuleId(m.id);
}}

              className={`p-3 rounded cursor-pointer mb-2 ${
                selectedModuleIds.includes(m.id)
                  ? "bg-orange-100 border border-orange-500"
                  : "bg-slate-100"
              }`}
            >
              {m.Name}
            </div>
          ))}
        </div>

        {/* RIGHT PERMISSION MATRIX */}
        <div className="col-span-3">
          <h3 className="mb-3 font-semibold">
            Permissions for {modules.find((m) => m.id === selectedModuleId)?.Name}
          </h3>

          <table className="w-full border">
            <thead>
              <tr className="bg-slate-100">
                {ACTIONS.map((a) => (
                  <th key={a} className="text-center p-2 capitalize">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {ACTIONS.map((a) => {
                  const active = matrix[activeModuleId]?.[a];

                  return (
                    <td key={a} className="p-3 text-center">
                      <button
                        onClick={() => toggle(activeModuleId, a)}
                        className={`p-2 rounded ${
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
            </tbody>
          </table>

          {/* SAVE BUTTON */}
          {/* <div className="mt-6 text-right">
            <button
              disabled={!hasChanges}
              onClick={() => {
                handleSave();
                setIsModalOpen(false);
              }}
              className={`px-6 py-3 rounded text-white ${
                hasChanges ? "bg-brand-500 hover:bg-brand-600" : "bg-gray-400"
              }`}
            >
              Save Changes
            </button>
          </div> */}

           
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
  size="sm"
  onClick={() => {
                handleSave();
                setIsModalOpen(false);
              }}
  // onClick={handleSave}
  disabled={!hasChanges}
  className="flex items-center gap-2"
>
  {isLoading && (
    <span className="animate-spin">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          opacity="0.5"
          cx="10"
          cy="10"
          r="8.75"
          stroke="white"
          strokeWidth="2.5"
        ></circle>
        <path
          d="M18.2372 12.9506C18.8873 13.1835 19.6113 12.846 19.7613 12.1719C20.0138 11.0369 
          20.0672 9.86319 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 
          3.01467 16.1303 1.94151 14.7319 1.19042C13.7019 0.637155 12.5858 0.270357 11.435 0.103491
          C10.7516 0.00440265 10.179 0.561473 10.1659 1.25187C10.1528 1.94226 10.7059 2.50202 
          11.3845 2.6295C12.1384 2.77112 12.8686 3.02803 13.5487 3.39333C14.5973 3.95661 15.4968 
          4.76141 16.1728 5.74121C16.8488 6.721 17.2819 7.84764 17.4361 9.02796C17.5362 9.79345 
          17.5172 10.5673 17.3819 11.3223C17.2602 12.002 17.5871 12.7178 18.2372 12.9506Z"
          stroke="white"
          strokeWidth="4"
        ></path>
      </svg>
    </span>
  )}
  {isLoading ? "Processing..." : "Save"}
</Button>

          </div>
      </div>

    </div>
  </Modal>
)}

    </div>
  );
}
