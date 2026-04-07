import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import MarketplaceCard from "../components/MarketplaceCard";
import CreateMarketplaceModal from "../components/CreateMarketplaceModal";
import Modal from "../../found_social/components/Modal";
import { fetchMarketplaceItems, createMarketplaceItem } from "../services/marketplaceService";

export default function MarketplaceFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const handlePostSubmit = async (payload) => {
    try {
      setSubmitError("");
      await createMarketplaceItem(payload);
      setIsModalOpen(false);
      loadFeed();
    } catch (e) {
      setSubmitError(e?.response?.data?.message || "Failed to post item.");
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-emerald-600/20 shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Sell an Item
        </button>
      </div>

      <div className="glass rounded-2xl p-4 mb-8 border border-white/50 premium-glow shadow-sm">
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
              : "The marketplace is empty. Be the first to sell something!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MarketplaceCard key={item._id} item={item} />
          ))}
        </div>
      )}

      <Modal open={isModalOpen} title="Post Item for Sale" onClose={() => setIsModalOpen(false)}>
         {submitError && (
           <div className="mb-4 bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-200 text-sm font-semibold">
             {submitError}
           </div>
         )}
         <CreateMarketplaceModal onSubmit={handlePostSubmit} />
      </Modal>

    </div>
  );
}
