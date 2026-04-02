import { http } from "../api/http";

export async function fetchClaims() {
  const { data } = await http.get("/api/claims");
  return data;
}

export async function createClaim(payload) {
  const { data } = await http.post("/api/claims", payload);
  return data;
}

export async function updateClaimStatus(id, status, adminNote = "") {
  const { data } = await http.patch(`/api/claims/${id}/status`, { status, adminNote });
  return data;
}

export async function submitFeedback(id, feedback, feedbackRating) {
  const { data } = await http.patch(`/api/claims/${id}/feedback`, { feedback, feedbackRating });
  return data;
}

export function approvalPdfUrl(id) {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseURL}/api/claims/${id}/document`;
}
