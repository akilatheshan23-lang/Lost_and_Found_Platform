import { useEffect, useRef, useState } from "react";
import { apiDeleteSocial, apiLikeSocial, apiSocialFeed } from "../api/social.api";
import CreateSocialModal from "../components/CreateSocialModal";
import EditSocialModal from "../components/EditSocialModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import PostCardSocial from "../components/PostCardSocial";
import Modal from "../components/Modal";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

export default function SocialFeed() {
  const { user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [detailPost, setDetailPost] = useState(null);

  const sentinelRef = useRef(null);

  async function load(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const data = await apiSocialFeed({ limit: 8, cursor: reset ? null : cursor, type: type || undefined });
      setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
      setCursor(data.nextCursor);
    } catch {
      toast.push("Failed to load social feed", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor) load(false);
    });
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, loading]);

  async function onLike(post) {
    if (!user) return toast.push("Login required", "warning");
    try {
      const res = await apiLikeSocial(post._id);
      setItems((prev) => prev.map((p) => (p._id === post._id ? { ...p, likes: res.likes } : p)));
    } catch {
      toast.push("Failed to like", "error");
    }
  }

  async function confirmDelete() {
    if (!deletePost) return;
    setDeleteBusy(true);
    try {
      await apiDeleteSocial(deletePost._id);
      toast.push("Post deleted", "success");
      setDeletePost(null);
      load(true);
    } catch (e) {
      toast.push(e?.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteBusy(false);
    }
  }

  const filterButtons = [
    ["", "All"],
    ["announcement", "📢 Announcements"],
    ["event", "🎉 Events"],
    ["update", "📌 Updates"],
    ["general", "💬 General"],
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="card-solid p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">🗞️ Social Feed</div>
            <div className="text-sm text-slate-500 mt-1">Announcements, updates, events and important messages.</div>
          </div>

          <button
            onClick={() => (user ? setOpenCreate(true) : toast.push("Login required", "warning"))}
            className="btn-success"
          >
            📝 Create Post
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filterButtons.map(([v, label]) => (
            <button
              key={v}
              onClick={() => setType(v)}
              className={`pill ${type === v ? "pill-active" : "pill-idle"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="card-solid p-10 text-center text-slate-500">No posts yet (or none approved).</div>
      ) : null}

      <div className="space-y-4">
        {items.map((p) => (
          <PostCardSocial
            key={p._id}
            post={p}
            onEdit={(x) => setEditPost(x)}
            onDelete={(x) => setDeletePost(x)}
            onOpenDetail={(x) => setDetailPost(x)}
            onLike={onLike}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10" />
      {loading ? <div className="text-center text-slate-500">Loading...</div> : null}

      <CreateSocialModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={() => load(true)} />
      <EditSocialModal open={!!editPost} onClose={() => setEditPost(null)} post={editPost} onSaved={() => load(true)} />

      <ConfirmDeleteModal
        open={!!deletePost}
        onClose={() => setDeletePost(null)}
        title="Delete this post?"
        message="This action cannot be undone."
        busy={deleteBusy}
        onConfirm={confirmDelete}
      />

      <Modal open={!!detailPost} onClose={() => setDetailPost(null)} title="Post Details" maxWidth="max-w-2xl">
        {detailPost ? (
          <div className="space-y-3">
            <div className="text-xl font-bold text-slate-900">{detailPost.title}</div>
            <div className="text-sm text-slate-500">
              {detailPost.createdByName} • {new Date(detailPost.createdAt).toLocaleString()}
            </div>
            <div className="text-slate-700 whitespace-pre-wrap">{detailPost.content}</div>
            {detailPost.imageUrl ? <img src={detailPost.imageUrl} className="w-full rounded-2xl" /> : null}
            <div className="pt-3 border-t text-slate-500 text-sm">
              Comments feature coming soon.
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
