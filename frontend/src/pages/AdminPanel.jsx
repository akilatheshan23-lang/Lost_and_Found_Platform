import { useEffect, useMemo, useState } from "react";
import {
  apiApproveFound,
  apiApproveSocial,
  apiPending,
  apiRejectFound,
  apiRejectSocial,
  apiToggleHideSocial,
  apiToggleHideFound,
  apiUpdateFoundImage,
  apiDeleteFound,
  apiAdminStats,
} from "../api/admin.api";
import Modal from "../components/Modal";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";
import { fileToDataUrl } from "../utils/image";

function StatCard({ title, value, hint }) {
  return (
    <div className="card-solid p-5">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-extrabold text-slate-900 mt-1">{value}</div>
      {hint ? <div className="text-xs text-slate-500 mt-2">{hint}</div> : null}
    </div>
  );
}

function Thumb({ src, alt }) {
  if (!src) {
    return (
      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
        <span className="text-slate-500 text-xl">📷</span>
      </div>
    );
  }
  return (
    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState("overview"); // overview | pending

  const [pendingData, setPendingData] = useState({ found: [], social: [] });
  const [stats, setStats] = useState(null);

  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null); // {kind, id, title}
  const [rejectNote, setRejectNote] = useState("");

  // Image edit (Found)
  const [imageTarget, setImageTarget] = useState(null); // {id, title, imageUrl, imageData}
  const [imageMode, setImageMode] = useState("upload"); // upload | url
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [savingImage, setSavingImage] = useState(false);

  // Delete confirm (Found)
  const [deleteTarget, setDeleteTarget] = useState(null); // {id, title}

  async function loadPending() {
    setLoadingPending(true);
    try {
      const res = await apiPending();
      setPendingData(res);
    } catch (e) {
      toast.push(e?.response?.data?.message || "Failed to load pending data", "error");
    } finally {
      setLoadingPending(false);
    }
  }

  async function loadStats() {
    setLoadingStats(true);
    try {
      const res = await apiAdminStats();
      setStats(res);
    } catch (e) {
      toast.push(e?.response?.data?.message || "Failed to load stats", "error");
    } finally {
      setLoadingStats(false);
    }
  }

  async function refreshAll() {
    await Promise.all([loadPending(), loadStats()]);
  }

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = stats?.counts;
  const recent = stats?.recent;

  const pendingCount = useMemo(
    () => (pendingData.found?.length || 0) + (pendingData.social?.length || 0),
    [pendingData]
  );

  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-solid p-8 text-center text-slate-600">Admin only.</div>
      </div>
    );
  }

  async function approve(kind, id) {
    try {
      if (kind === "found") await apiApproveFound(id);
      else await apiApproveSocial(id);
      toast.push("Approved ✅", "success");
      refreshAll();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Approve failed", "error");
    }
  }

  function openReject(kind, id, title) {
    setRejectTarget({ kind, id, title });
    setRejectNote("");
  }

  async function reject() {
    if (!rejectTarget) return;
    try {
      if (rejectTarget.kind === "found") await apiRejectFound(rejectTarget.id, rejectNote);
      else await apiRejectSocial(rejectTarget.id, rejectNote);
      toast.push("Rejected ❌", "success");
      setRejectTarget(null);
      refreshAll();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Reject failed", "error");
    }
  }

  async function toggleHide(id) {
    try {
      await apiToggleHideSocial(id);
      toast.push("Toggled hide/unhide", "success");
      loadStats();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Action failed", "error");
    }
  }

  async function toggleHideFound(id) {
    try {
      await apiToggleHideFound(id);
      toast.push("Updated visibility", "success");
      loadStats();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Action failed", "error");
    }
  }

  function openImageEditor(item) {
    setImageTarget({ id: item._id, title: item.title, imageUrl: item.imageUrl || "", imageData: item.imageData || "" });
    // default to upload mode (supports offline upload)
    setImageMode("upload");
    setImagePreview(item.imageData || "");
    setImageUrl(item.imageUrl || "");
  }

  async function onPickImageFile(f) {
    if (!f) return;
    try {
      const dataUrl = await fileToDataUrl(f);
      setImagePreview(dataUrl);
      toast.push("📷 Image selected", "success");
    } catch (e) {
      toast.push(e?.message || "Invalid image", "error");
    }
  }

  async function saveImage() {
    if (!imageTarget) return;
    setSavingImage(true);
    try {
      const payload = {
        imageUrl: imageMode === "url" ? (imageUrl || "") : "",
        imageData: imageMode === "upload" ? (imagePreview || "") : "",
      };
      await apiUpdateFoundImage(imageTarget.id, payload);
      toast.push("✅ Image updated", "success");
      setImageTarget(null);
      await refreshAll();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Failed to update image", "error");
    } finally {
      setSavingImage(false);
    }
  }

  async function deleteFound() {
    if (!deleteTarget) return;
    try {
      await apiDeleteFound(deleteTarget.id);
      toast.push("🗑️ Deleted", "success");
      setDeleteTarget(null);
      await refreshAll();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Delete failed", "error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="card-solid p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-2xl font-bold text-slate-900">🛡️ Admin Dashboard</div>
            <div className="text-sm text-slate-500 mt-1">
              Manage approvals, review activity, and moderate posts.
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setTab("overview")} className={`pill ${tab === "overview" ? "pill-active" : "pill-idle"}`}>
              Overview
            </button>
            <button onClick={() => setTab("pending")} className={`pill ${tab === "pending" ? "pill-active" : "pill-idle"}`}>
              Pending ({pendingCount})
            </button>
            <button onClick={refreshAll} className="btn-secondary">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {tab === "overview" ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="👥 Users"
              value={counts?.users ?? (loadingStats ? "…" : 0)}
              hint="Registered accounts"
            />
            <StatCard
              title="🔎 Found (Pending)"
              value={counts?.found?.pending ?? (loadingStats ? "…" : 0)}
              hint={`Total: ${counts?.found?.total ?? 0} • Approved: ${counts?.found?.approved ?? 0} • Hidden: ${counts?.found?.hidden ?? 0}`}
            />
            <StatCard
              title="✅ Found (Claimed)"
              value={counts?.found?.claimed ?? (loadingStats ? "…" : 0)}
              hint="Marked claimed"
            />
            <StatCard
              title="📱 Social (Hidden)"
              value={counts?.social?.hidden ?? (loadingStats ? "…" : 0)}
              hint={`Pending: ${counts?.social?.pending ?? 0} • Total: ${counts?.social?.total ?? 0}`}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card-solid p-5">
              <div className="font-bold text-slate-900">🕘 Recent Found Activity</div>
              <div className="mt-3 space-y-3">
                {recent?.found?.length ? (
                  recent.found.map((x) => {
                    const img = x.imageData || x.imageUrl || "";
                    return (
                      <div key={x._id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200">
                        <Thumb src={img} alt={x.title} />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 truncate">{x.title}</div>
                          <div className="text-xs text-slate-500">
                            {x.createdByName} • {x.userType} • {new Date(x.createdAt).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            Status: {x.status}{x.hidden ? " • Hidden" : ""}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap justify-end">
                          <button onClick={() => openImageEditor(x)} className="btn-secondary">
                            🖼️ Edit Photo
                          </button>
                          {x.status === "approved" ? (
                            <button onClick={() => toggleHideFound(x._id)} className="btn-secondary">
                              {x.hidden ? "👁️ Unhide" : "🙈 Hide"}
                            </button>
                          ) : null}
                          <button
                            onClick={() => setDeleteTarget({ id: x._id, title: x.title })}
                            className="btn-danger"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500 text-sm">{loadingStats ? "Loading..." : "No data"}</div>
                )}
              </div>
            </div>

            <div className="card-solid p-5">
              <div className="font-bold text-slate-900">🕘 Recent Social Activity</div>
              <div className="mt-3 space-y-3">
                {recent?.social?.length ? (
                  recent.social.map((x) => {
                    const img = x.imageData || x.imageUrl || "";
                    return (
                      <div key={x._id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200">
                        <Thumb src={img} alt={x.title} />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{x.title}</div>
                          <div className="text-xs text-slate-500">
                            {x.createdByName} • {x.postType} • {new Date(x.createdAt).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            Status: {x.status}{x.hidden ? " • Hidden" : ""}
                          </div>
                        </div>
                        {x.status === "approved" ? (
                          <button onClick={() => toggleHide(x._id)} className="btn-secondary">
                            🙈 Toggle Hide
                          </button>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500 text-sm">{loadingStats ? "Loading..." : "No data"}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "pending" ? (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card-solid p-5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">⏳ Pending Found Items</div>
              {loadingPending ? <div className="text-sm text-slate-500">Loading...</div> : null}
            </div>

            {pendingData.found.length === 0 && !loadingPending ? (
              <div className="text-slate-500 py-8 text-center">No pending found items</div>
            ) : (
              <div className="space-y-3 mt-3">
                {pendingData.found.map((x) => {
                  const img = x.imageData || x.imageUrl || "";
                  return (
                    <div key={x._id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                      <div className="flex gap-3">
                        <Thumb src={img} alt={x.title} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-slate-600 mb-1">
                            {x.createdByName} • {x.userType}
                          </div>
                          <div className="font-bold text-slate-900 truncate">{x.title}</div>
                          <div className="text-sm text-slate-700 mt-1 line-clamp-2">{x.description}</div>
                          <div className="text-xs text-slate-500 mt-1">📍 {x.location}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <button onClick={() => approve("found", x._id)} className="btn-success">
                          ✅ Approve
                        </button>
                        <button onClick={() => openReject("found", x._id, x.title)} className="btn-danger">
                          ❌ Reject
                        </button>
                        <button onClick={() => openImageEditor(x)} className="btn-secondary">
                          🖼️ Edit Photo
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: x._id, title: x.title })}
                          className="btn-danger"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-solid p-5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900">⏳ Pending Social Posts</div>
              {loadingPending ? <div className="text-sm text-slate-500">Loading...</div> : null}
            </div>

            {pendingData.social.length === 0 && !loadingPending ? (
              <div className="text-slate-500 py-8 text-center">No pending social posts</div>
            ) : (
              <div className="space-y-3 mt-3">
                {pendingData.social.map((x) => {
                  const img = x.imageData || x.imageUrl || "";
                  return (
                    <div key={x._id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                      <div className="flex gap-3">
                        <Thumb src={img} alt={x.title} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-slate-600 mb-1">
                            {x.createdByName} • {x.postType}
                          </div>
                          <div className="font-bold text-slate-900 truncate">{x.title}</div>
                          <div className="text-sm text-slate-700 mt-1 line-clamp-2">{x.content}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <button onClick={() => approve("social", x._id)} className="btn-success">
                          ✅ Approve
                        </button>
                        <button onClick={() => openReject("social", x._id, x.title)} className="btn-danger">
                          ❌ Reject
                        </button>
                        <button onClick={() => toggleHide(x._id)} className="btn-secondary">
                          🙈 Toggle Hide
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject with note (optional)"
        maxWidth="max-w-md"
      >
        <div className="space-y-3">
          <div className="text-slate-700 text-sm">
            Rejecting: <span className="font-medium">{rejectTarget?.title}</span>
          </div>
          <textarea
            className="input"
            rows={4}
            placeholder="Reason (optional)"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
          <button className="btn-danger w-full" onClick={reject}>
            Reject
          </button>
        </div>
      </Modal>

      {/* Update Found Image */}
      <Modal
        open={!!imageTarget}
        onClose={() => setImageTarget(null)}
        title="Update Found Item Photo"
        maxWidth="max-w-lg"
      >
        <div className="space-y-3">
          <div className="text-slate-700 text-sm">
            Editing: <span className="font-medium">{imageTarget?.title}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={`pill ${imageMode === "upload" ? "pill-active" : "pill-idle"}`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setImageMode("url")}
              className={`pill ${imageMode === "url" ? "pill-active" : "pill-idle"}`}
            >
              URL
            </button>
          </div>

          {imageMode === "upload" ? (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={(e) => onPickImageFile(e.target.files?.[0])}
              />
              {imagePreview ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-[320px] object-cover" />
                </div>
              ) : (
                <div className="text-xs text-slate-500">Choose an image under 1.5MB.</div>
              )}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setImagePreview("")}
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                className="input"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={imageUrl} alt="Preview" className="w-full max-h-[320px] object-cover" />
                </div>
              ) : null}
            </div>
          )}

          <button className="btn-primary w-full" disabled={savingImage} onClick={saveImage}>
            {savingImage ? "Saving..." : "Save Photo"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Found Item?"
        maxWidth="max-w-md"
      >
        <div className="space-y-3">
          <div className="text-slate-700 text-sm">
            This will permanently remove:
            <div className="font-semibold text-slate-900 mt-1">{deleteTarget?.title}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex-1" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="btn-danger flex-1" onClick={deleteFound}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
