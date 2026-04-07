import { http } from "../api/http";

export async function fetchLostItems(params = {}) {
  const { data } = await http.get("/api/lost", { params });
  return data;
}

export async function createLostItem(payload) {
  // payload can be FormData OR JSON
  const isForm = payload instanceof FormData;
  const { data } = await http.post("/api/lost", payload, {
    headers: isForm ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return data;
}

export async function updateLostStatus(id, status, adminNote = "") {
  const { data } = await http.patch(`/api/lost/${id}/status`, { status, adminNote });
  return data;
}
