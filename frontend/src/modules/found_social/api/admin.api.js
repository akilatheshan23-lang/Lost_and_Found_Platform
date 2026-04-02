import { http } from "./http";

export async function apiPending() {
  const { data } = await http.get("/api/admin/pending");
  return data;
}

export async function apiApproveFound(id) {
  const { data } = await http.post(`/api/admin/found/${id}/approve`);
  return data;
}
export async function apiRejectFound(id, note) {
  const { data } = await http.post(`/api/admin/found/${id}/reject`, { note });
  return data;
}

export async function apiApproveSocial(id) {
  const { data } = await http.post(`/api/admin/social/${id}/approve`);
  return data;
}
export async function apiRejectSocial(id, note) {
  const { data } = await http.post(`/api/admin/social/${id}/reject`, { note });
  return data;
}
export async function apiToggleHideSocial(id) {
  const { data } = await http.post(`/api/admin/social/${id}/toggle-hide`);
  return data;
}

export async function apiToggleHideFound(id) {
  const { data } = await http.post(`/api/admin/found/${id}/toggle-hide`);
  return data;
}

export async function apiUpdateFoundImage(id, payload) {
  const { data } = await http.put(`/api/admin/found/${id}/image`, payload);
  return data;
}

export async function apiDeleteFound(id) {
  const { data } = await http.delete(`/api/admin/found/${id}`);
  return data;
}


export async function apiAdminStats() {
  const { data } = await http.get("/api/admin/stats");
  return data;
}
