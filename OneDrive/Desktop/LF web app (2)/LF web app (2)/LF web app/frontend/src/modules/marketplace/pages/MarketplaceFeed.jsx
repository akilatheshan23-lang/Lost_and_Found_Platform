import React, { useEffect, useState, useMemo } from "react";
import MarketplaceCard from "../components/MarketplaceCard";
import Modal from "../components/Modal";
import RequestMarketplaceItemModal from "../components/RequestMarketplaceItemModal";
import {
  fetchMarketplaceItems,
  borrowMarketplaceItem,
  createMarketplaceItemRequest,
} from "../services/marketplaceService";

export default function MarketplaceFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowingItemId, setBorrowingItemId] = useState("");
  const [borrowMessage, setBorrowMessage] = useState("");
  const [borrowError, setBorrowError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("marketplace_view_mode") || "grid");

  const loadFeed = async () => {
    try {
      setLoading(true);
      const data = await fetchMarketplaceItems();
      setItems(data || []);
    } catch (e) {
      console.error("Failed to fetch marketplace", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    localStorage.setItem("marketplace_view_mode", viewMode);
  }, [viewMode]);

  const handleBorrow = async (itemId) => {
    try {
      setBorrowError("");
      setBorrowMessage("");
      setBorrowingItemId(itemId);
      await borrowMarketplaceItem(itemId);
      setBorrowMessage("Borrow request submitted. Admin will review it.");
      await loadFeed();
    } catch (e) {
      setBorrowError(e?.response?.data?.message || "Failed to borrow item.");
    } finally {
      setBorrowingItemId("");
    }
  };

  const handleCreateRequest = async (payload) => {
    try {
      setRequestError("");
      setRequestMessage("");
      await createMarketplaceItemRequest(payload);
      setRequestMessage("Item request submitted. Admin will review your request.");
      setShowRequestModal(false);
    } catch (e) {
      const message = e?.response?.data?.message || "Failed to submit item request.";
      setRequestError(message);
      throw e;
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const matchCat = filterCategory ? it.category === filterCategory.toLowerCase() : true;
      const matchSearch = it.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          it.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, filterCategory, searchQuery]);

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">University Marketplace</h2>
          <p className="text-slate-500 font-medium">Safe peer-to-peer trading for students and staff.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <button
            onClick={() => setShowRequestModal(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Request New Item
          </button>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                viewMode === "list" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 mb-8 border border-white/50 premium-glow shadow-sm">
        {borrowMessage ? (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {borrowMessage}
          </div>
        ) : null}
        {borrowError ? (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {borrowError}
          </div>
        ) : null}
        {requestMessage ? (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {requestMessage}
          </div>
        ) : null}
        {requestError ? (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {requestError}
          </div>
        ) : null}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <span className="absolute left-4 top-3 text-slate-400">🔍</span>
             <input
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search for textbooks, electronics..."
               className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
             />
           </div>
           
           <div className="flex gap-2 min-w-max pb-1 overflow-x-auto items-center hidden-scrollbar">
             {["All", "Electronics", "Textbooks", "Furniture", "Clothing", "Accessories", "Other"].map((cat) => (
               <button
                 key={cat}
                 onClick={() => setFilterCategory(cat === "All" ? "" : cat)}
                 className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                   (filterCategory || "All") === cat
                     ? "bg-slate-800 text-white shadow-md shadow-slate-800/20"
                     : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/60"
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/50 premium-glow shadow-sm">
          <span className="text-6xl mb-4 block opacity-80">🏷️</span>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No items found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {searchQuery || filterCategory 
              ? "Try adjusting your search filters to find what you're looking for."
              : "No items are available right now. Please check back later."}
          </p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "grid grid-cols-1 gap-4"}>
          {filteredItems.map((item) => (
            <MarketplaceCard
              key={item._id}
              item={item}
              onBorrow={handleBorrow}
              isBorrowing={borrowingItemId === item._id}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      <Modal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request a New Marketplace Item"
      >
        <RequestMarketplaceItemModal onSubmit={handleCreateRequest} />
      </Modal>

    </div>
  );
}
