import { http } from "./http";

export async function apiNotifications() {
  const { data } = await http.get("/api/notifications");
  return data;
}

export async function apiReadAll() {
  const { data } = await http.post("/api/notifications/read-all");
  return data;
}
