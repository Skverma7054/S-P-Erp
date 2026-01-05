import { axiosDelete, AxiosGetWithParams, axiosPatch, postFetch } from "./apiServices";

/**
 * CREATE PR
 */
export const createPR = async (payload: any) => {
  const res = await postFetch("/pr", payload);
  return res.data; // backend response
};

/**
 * GET PR LIST
 */
export const getPRList = async (params: any) => {
  return AxiosGetWithParams("/pr", {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    project_id: params.project_id,
    user_id: params.user_id,
    status: params.status,
    urgency_level: params.urgency_level,
    search: params.search,
    pr_code: params.pr_code,
    start_date: params.start_date,
    end_date: params.end_date,
    sort_by: params.sort_by ?? "created_at",
    sort_order: params.sort_order ?? "desc",
  });
};
/**
 * UPDATE PR
 */
export const updatePR = async (id: number, payload: any) => {
  return axiosPatch(`/pr/${id}`, payload);
};

/**
 * DELETE PR
 */
export const deletePR = async (id: number) => {
  return axiosDelete(`/pr/${id}`);
};
