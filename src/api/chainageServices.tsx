// src/api/chainageService.ts

import api, { AxiosGetWithParams } from "./apiServices";

export const getChainageConsumption = (params: {
  project_id?: string | number;
  page?: number;
  limit?: number;
}) => {
  return AxiosGetWithParams("/chainage-consumption", {
    project_id: params.project_id || "",
    page: params.page || 1,
    limit: params.limit || 10,
  });
};
/* ---------------- POST (UPLOAD EXCEL) ---------------- */
export const uploadChainageConsumption = (
  file: File,
  projectId: string | number,
 
) => {
console.log(file,projectId, "----uploadChainageConsumption");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", String(projectId));

  return api.post("/chainage-consumption", formData,{headers: {
      "Content-Type": "multipart/form-data", // ✅ override JSON
    },});
};