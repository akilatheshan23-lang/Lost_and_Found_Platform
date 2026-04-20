import { http } from "./http";

export async function apiSocialFeed(params) {
  const { data } = await http.get("/api/social", { params });
  return data;
}

export async function apiCreateSocial(payload) {
  const { data } = await http.post("/api/social", payload);
  return data;
}

export async function apiUpdateSocial(id, payload) {
  const { data } = await http.put(`/api/social/${id}`, payload);
  return data;
}

export async function apiDeleteSocial(id) {
  const { data } = await http.delete(`/api/social/${id}`);
  return data;
}

export async function apiLikeSocial(id) {
  const { data } = await http.post(`/api/social/${id}/like`);
  return data;
}

export async function apiCommentSocial(id, text) {
  const { data } = await http.post(`/api/social/${id}/comment`, { text });
  return data;
}

export async function apiEditCommentSocial(id, commentId, text) {
  const { data } = await http.put(`/api/social/${id}/comment/${commentId}`, { text });
  return data;
}

export async function apiDeleteCommentSocial(id, commentId) {
  const { data } = await http.delete(`/api/social/${id}/comment/${commentId}`);
  return data;
}
