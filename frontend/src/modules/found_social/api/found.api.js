import { http } from "./http";

export async function apiFoundFeed(params) {
  const { data } = await http.get("/api/found", { params });
  return data;
}

export async function apiCreateFound(payload) {
  const { data } = await http.post("/api/found", payload);
  return data;
}

export async function apiGetFoundQr(id) {
  const { data } = await http.get(`/api/found/${id}/qr`);
  return data;
}

export async function apiGetFoundScanData(token) {
  const { data } = await http.get(`/api/found/scan/${token}`);
  return data;
}