import api from "../../../api";

export async function fetchMarketplaceItems() {
  const { data } = await api.get("/api/marketplace");
  return data;
}

export async function createMarketplaceItem(payload) {
  // payload is expected to be FormData so it supports image upload
  const { data } = await api.post("/api/marketplace", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateMarketplaceStatus(id, status, isApproved) {
  const { data } = await api.patch(`/api/marketplace/${id}/status`, { status, isApproved });
  return data;
}
