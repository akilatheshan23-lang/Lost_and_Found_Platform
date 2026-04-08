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

export async function apiMarketplaceItems() {
  const { data } = await http.get("/api/marketplace");
  return data;
}

export async function apiCreateMarketplace(payload) {
  const { data } = await http.post("/api/marketplace", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function apiUpdateMarketplace(id, payload) {
  const { data } = await http.put(`/api/admin/marketplace/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function apiDeleteMarketplace(id) {
  const { data } = await http.delete(`/api/admin/marketplace/${id}`);
  return data;
}

export async function apiBorrowRequests() {
  const { data } = await http.get("/api/admin/marketplace/borrows");
  return data;
}

export async function apiApproveBorrowRequest(id) {
  const { data } = await http.patch(`/api/admin/marketplace/borrows/${id}/approve`);
  return data;
}

export async function apiRejectBorrowRequest(id) {
  const { data } = await http.patch(`/api/admin/marketplace/borrows/${id}/reject`);
  return data;
}

export async function apiMarketplaceItemRequests() {
  const { data } = await http.get("/api/admin/marketplace/requests");
  return data;
}

export async function apiUpdateMarketplaceItemRequestStatus(id, status) {
  const { data } = await http.patch(`/api/admin/marketplace/requests/${id}/status`, { status });
  return data;
}

export async function apiNotifications() {
  const { data } = await http.get("/api/notifications");
  return data;
}

export async function apiReadAllNotifications() {
  const { data } = await http.patch("/api/notifications/read-all");
  return data;
}
