import { useEffect, useState } from "react";
import {
  apiCreateMarketplace,
  apiUpdateMarketplace,
  apiDeleteMarketplace,
  apiBorrowRequests,
  apiApproveBorrowRequest,
  apiRejectBorrowRequest,
  apiMarketplaceItemRequests,
  apiUpdateMarketplaceItemRequestStatus,
} from "../api/admin.api";
import Modal from "../components/Modal";
import { useAuth } from "../../../state/AuthContext";
import { useToast } from "../components/Toast";
import CreateMarketplaceModal from "../components/CreateMarketplaceModal";
import { fetchMarketplaceItems } from "../services/marketplaceService";

export default function AdminMarketplacePanel() {
  const { user } = useAuth();
  const toast = useToast();
  const notify = toast?.push || (() => {});
  const [allItems, setAllItems] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [itemRequests, setItemRequests] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [itemRequestLoading, setItemRequestLoading] = useState(false);
  const [panelError, setPanelError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [createFromRequest, setCreateFromRequest] = useState(null);

  async function loadCatalog() {
    setCatalogLoading(true);
    try {
      setPanelError("");
      const res = await fetchMarketplaceItems();
      setAllItems(res || []);
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to load marketplace items";
      notify(message, "error");
      setPanelError(message);
    } finally {
      setCatalogLoading(false);
    }
  }

  async function loadBorrowRequests() {
    setRequestLoading(true);
    try {
      setPanelError("");
      const requests = await apiBorrowRequests();
      setBorrowRequests(requests || []);
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to load borrow requests";
      notify(message, "error");
      setPanelError(message);
    } finally {
      setRequestLoading(false);
    }
  }

  async function loadItemRequests() {
    setItemRequestLoading(true);
    try {
      setPanelError("");
      const requests = await apiMarketplaceItemRequests();
      setItemRequests(requests || []);
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to load item requests";
      notify(message, "error");
      setPanelError(message);
    } finally {
      setItemRequestLoading(false);
    }
  }

  async function loadAll() {
    await Promise.all([loadCatalog(), loadBorrowRequests(), loadItemRequests()]);
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAll();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-solid p-8 text-center text-slate-600">Admin only.</div>
      </div>
    );
  }

  async function createItem(payload) {
    try {
      setPanelError("");
      await apiCreateMarketplace(payload);
      if (createFromRequest?._id) {
        await apiUpdateMarketplaceItemRequestStatus(createFromRequest._id, "approved");
      }
      notify("Marketplace item added", "success");
      setCreateOpen(false);
      setCreateFromRequest(null);
      loadAll();
    } catch (e) {
      const message = e?.response?.data?.message || "Create failed";
      notify(message, "error");
      setPanelError(message);
    }
  }

  async function updateItem(payload) {
    if (!editTarget) return;
    try {
      setPanelError("");
      await apiUpdateMarketplace(editTarget._id, payload);
      notify("Marketplace item updated", "success");
      setEditTarget(null);
      loadAll();
    } catch (e) {
      const message = e?.response?.data?.message || "Update failed";
      notify(message, "error");
      setPanelError(message);
    }
  }

  async function deleteItem() {
    if (!deleteTarget) return;
    try {
      await apiDeleteMarketplace(deleteTarget._id);
      notify("Marketplace item deleted", "success");
      setDeleteTarget(null);
      loadAll();
    } catch (e) {
      notify(e?.response?.data?.message || "Delete failed", "error");
    }
  }

  async function refreshBorrowRequests() {
    loadBorrowRequests();
  }

  async function refreshItemRequests() {
    loadItemRequests();
  }

  async function updateItemRequestStatus(id, status) {
    try {
      setPanelError("");
      await apiUpdateMarketplaceItemRequestStatus(id, status);
      notify(`Request ${status}`, "success");
      loadItemRequests();
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to update item request";
      notify(message, "error");
      setPanelError(message);
    }
  }

  function useRequestAsTemplate(request) {
    setCreateFromRequest(request);
    setCreateOpen(true);
  }

  async function approveBorrow(id) {
    try {
      setPanelError("");
      await apiApproveBorrowRequest(id);
      notify("Borrow request approved", "success");
      loadAll();
    } catch (e) {
      const message = e?.response?.data?.message || "Approve request failed";
      notify(message, "error");
      setPanelError(message);
    }
  }

  async function rejectBorrow(id) {
    try {
      setPanelError("");
      await apiRejectBorrowRequest(id);
      notify("Borrow request rejected", "success");
      loadAll();
    } catch (e) {
      const message = e?.response?.data?.message || "Reject request failed";
      notify(message, "error");
      setPanelError(message);
    }
  }

  function statusBadge(status) {
    const style = {
      available: "bg-emerald-50 text-emerald-700 border-emerald-200",
      borrowed: "bg-amber-50 text-amber-700 border-amber-200",
      sold: "bg-slate-100 text-slate-700 border-slate-200",
      pending: "bg-blue-50 text-blue-700 border-blue-200",
    };

    return style[status] || "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {panelError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {panelError}
        </div>
      ) : null}

      <div className="card-solid p-5 bg-gradient-to-r from-amber-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-amber-900">Marketplace Admin Panel</div>
            <div className="text-sm text-amber-700 mt-1">Manage listings, moderation, and borrow activity.</div>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold"
          >
            + Add Marketplace Item
          </button>
        </div>
      </div>

      <div className="card-solid p-5">
        <div className="flex items-center justify-between">
          <div className="font-bold text-slate-900">All Marketplace Items</div>
          {catalogLoading ? <div className="text-sm text-slate-500">Loading...</div> : null}
        </div>

        {allItems.length === 0 && !catalogLoading ? (
          <div className="text-slate-500 py-8 text-center bg-slate-50 rounded-xl mt-4 border border-dashed border-slate-200">No items in marketplace yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {allItems.map((x) => (
              <div key={x._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-slate-600 font-medium line-clamp-1">{x.sellerName} • {x.category}</div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusBadge(x.status)}`}>
                    {x.status}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-lg mt-1 line-clamp-1">{x.title}</div>
                <div className="text-xl font-bold text-teal-600 mt-1">LKR {Number(x.price || 0).toLocaleString()}</div>
                <div className="text-sm text-slate-600 mt-1 font-medium">In stock: {Number(x.stockCount || 0)}</div>
                <div className="text-sm text-slate-700 mt-2 line-clamp-2">{x.description}</div>
                {x.borrowedBy ? (
                  <div className="text-xs text-amber-700 mt-2 font-semibold">
                    Borrowed by {x.borrowedBy.name || x.borrowedBy.email}
                  </div>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setEditTarget(x)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(x)} className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 rounded-lg font-medium text-sm transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-solid p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="font-bold text-slate-900">Borrow Requests</div>
          <button onClick={refreshBorrowRequests} className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 text-slate-700">
            Refresh
          </button>
        </div>

        {requestLoading ? (
          <div className="text-sm text-slate-500 mt-4">Loading borrow requests...</div>
        ) : borrowRequests.length === 0 ? (
          <div className="text-slate-500 py-8 text-center bg-slate-50 rounded-xl mt-4 border border-dashed border-slate-200">No borrow requests yet.</div>
        ) : (
          <div className="mt-4 space-y-2">
            {borrowRequests.map((request) => (
              <div key={request._id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{request.requester?.name || request.requester?.email} requested to borrow {request.item?.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Stock left: {Number(request.item?.stockCount || 0)}</div>
                  </div>
                  <span className="inline-flex rounded-full border border-amber-300 bg-white px-2 py-1 text-xs font-semibold uppercase text-amber-700">
                    {request.status}
                  </span>
                </div>
                {request.status === "pending" ? (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700" onClick={() => approveBorrow(request._id)}>
                      Approve
                    </button>
                    <button className="flex-1 rounded-lg bg-rose-100 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200" onClick={() => rejectBorrow(request._id)}>
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-solid p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="font-bold text-slate-900">User Item Requests</div>
          <button onClick={refreshItemRequests} className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 text-slate-700">
            Refresh
          </button>
        </div>

        {itemRequestLoading ? (
          <div className="text-sm text-slate-500 mt-4">Loading item requests...</div>
        ) : itemRequests.length === 0 ? (
          <div className="text-slate-500 py-8 text-center bg-slate-50 rounded-xl mt-4 border border-dashed border-slate-200">No user item requests yet.</div>
        ) : (
          <div className="mt-4 space-y-2">
            {itemRequests.map((request) => (
              <div key={request._id} className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {request.requester?.name || request.requester?.email} requested {request.itemName}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Category: {request.category} | Qty: {request.quantity} | Budget: LKR {Number(request.maxBudget || 0).toLocaleString()}
                    </div>
                    {request.note ? <div className="text-xs text-slate-500 mt-1">Note: {request.note}</div> : null}
                  </div>
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold uppercase ${statusBadge(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                {request.status === "pending" ? (
                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                    <button
                      className="rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      onClick={() => useRequestAsTemplate(request)}
                    >
                      Use Request
                    </button>
                    <button
                      className="rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      onClick={() => updateItemRequestStatus(request._id, "approved")}
                    >
                      Mark Approved
                    </button>
                    <button
                      className="rounded-lg bg-rose-100 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200"
                      onClick={() => updateItemRequestStatus(request._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setCreateFromRequest(null);
        }}
        title="Add Marketplace Item"
        maxWidth="max-w-2xl"
      >
        <CreateMarketplaceModal
          onSubmit={createItem}
          submitLabel="Create Item"
          initialValues={
            createFromRequest
              ? {
                  title: createFromRequest.itemName,
                  description: createFromRequest.note || `Requested by ${createFromRequest.requester?.name || "user"}`,
                  price: createFromRequest.maxBudget,
                  stockCount: createFromRequest.quantity,
                  category: createFromRequest.category,
                  condition: "good",
                  sellerContact: createFromRequest.contactNumber,
                }
              : null
          }
        />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Marketplace Item" maxWidth="max-w-2xl">
        {editTarget ? (
          <CreateMarketplaceModal
            onSubmit={updateItem}
            initialValues={editTarget}
            submitLabel="Save Changes"
          />
        ) : null}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="max-w-md">
        <div className="space-y-3">
          <div className="text-slate-700 text-sm">
            Delete this marketplace item permanently?
            <div className="font-bold mt-2 text-lg text-slate-900">{deleteTarget?.title}</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="flex-1 bg-rose-600 text-white py-2 rounded-lg" onClick={deleteItem}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
