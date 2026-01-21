import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosGet, postFetch } from "../../api/apiServices";
import { Check, X } from "lucide-react";
type Role = {
  id: number;
  name: string;
};

type Module = {
  id: number;
  Name: string;
};

type Permission = {
  id: number;
  action: string[];
  roles?: { id: number }[];
  modules?: { id: number }[];
};

type PermissionMatrix = {
  [moduleId: number]: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
};

type SavePermissionPayload = {
  permissionPayload: {
    moduleId: number;
    action: string[];
  }[];
};

const ACTIONS = ["read", "create", "update", "delete"];

export default function RolePermissionMatrix() {
  const queryClient = useQueryClient();

  // ⭐ Selected Role ------------------------------------------------
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
const [matrix, setMatrix] = useState<PermissionMatrix>({});


  // ⭐ Fetch Roles ---------------------------------------------------
  const { data: roleRes } = useQuery({
    queryKey: ["roles"],
    queryFn: () => axiosGet("/role?page=1&limit=50"),
  });

  const roles : Role[] = roleRes?.roles || [];

  // ⭐ Fetch Modules -------------------------------------------------
  const { data: moduleRes } = useQuery({
    queryKey: ["modules"],
    queryFn: () => axiosGet("/module?page=1&limit=100"),
  });

  const modules : Module[] = moduleRes?.modules || [];

  // ⭐ Fetch Permissions ---------------------------------------------
  const { data: permRes } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => axiosGet("/permission?page=1&limit=200"),
  });

  const permissions : Permission[] = permRes?.permissions || [];

  // ⭐ Local Permission Matrix ---------------------------------------

  useEffect(() => {
    if (!modules.length || !permissions.length) return;

    const m = {};

    modules.forEach((mod) => {
      m[mod.id] = {
        read: false,
        create: false,
        update: false,
        delete: false,
      };
    });

    // Map DB → UI
    permissions.forEach((perm) => {
      if (!perm.roles?.some((r) => r.id === selectedRole)) return;

      perm.modules?.forEach((mod) => {
        ACTIONS.forEach((action) => {
          if (perm.action.includes(action)) {
            m[mod.id][action] = true;
          }
        });
      });
    });

    setMatrix(m);
  }, [modules, permissions, selectedRole]);

  // ⭐ Toggle Permission ---------------------------------------------
  const toggle = (moduleId: number, action: keyof PermissionMatrix[number]) => {
    setMatrix((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: !prev[moduleId][action],
      },
    }));
  };

  // ⭐ Save API ------------------------------------------------------
  const saveMutation = useMutation({
    mutationFn: (payload: SavePermissionPayload) => postFetch(`/role/${selectedRole}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:["permissions"]});
      alert("Permissions updated successfully!");
    },
  });

  const handleSave = () => {
const permissionPayload: SavePermissionPayload["permissionPayload"] = [];

    Object.keys(matrix).forEach((moduleId) => {
      const active = ACTIONS.filter((action) => matrix[moduleId][action]);

      if (active.length) {
        permissionPayload.push({
          moduleId: Number(moduleId),
          action: active,
        });
      }
    });

    saveMutation.mutate({ permissionPayload });
  };

  return (
    <div className="p-8">
      {/* ====================== TITLE ======================= */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Role & Permissions</h1>
        <p className="text-slate-600">Manage user roles and access permissions</p>
      </div>

      {/* ====================== ROLE SELECTION ======================= */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h3 className="text-xl mb-4">Select Role</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`p-4 rounded-lg border-2 transition ${
                selectedRole === role.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <h4 className="font-medium">{role.name}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* ====================== PERMISSION TABLE ======================= */}
      {selectedRole && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-xl mb-4">
            Permissions for {roles.find((r) => r.id === selectedRole)?.name}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4">Module</th>
                  {ACTIONS.map((a) => (
                    <th key={a} className="text-center py-3 px-4 capitalize">
                      {a}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {modules.map((mod) => (
                  <tr
                    key={mod.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4">{mod.Name}</td>

                    {ACTIONS.map((action) => {
                      const active = matrix?.[mod.id]?.[action];

                      return (
                        <td className="py-3 px-4 text-center" key={action}>
                          <button
                            onClick={() => toggle(mod.id, action)}
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

          {/* Save button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-white rounded-lg"
            >
              Save Permissions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
