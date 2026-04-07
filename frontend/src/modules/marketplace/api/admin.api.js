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

export async function apiApproveMarketplace(id) {
  const { data } = await http.post(`/api/admin/marketplace/${id}/approve`);
  return data;
}
export async function apiRejectMarketplace(id) {
  const { data } = await http.post(`/api/admin/marketplace/${id}/reject`);
  return data;
}
