import { useEffect, useRef, useState } from "react";
import { apiDeleteSocial, apiLikeSocial, apiSocialFeed, apiCommentSocial, apiEditCommentSocial, apiDeleteCommentSocial } from "../api/social.api";
import EmojiPicker from "emoji-picker-react";
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
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [showMainEmojiPicker, setShowMainEmojiPicker] = useState(false);
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false);

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

  async function submitComment() {
    if (!user) return toast.push("Login required", "warning");
    if (!commentText.trim()) return;
    try {
      const newComment = await apiCommentSocial(detailPost._id, commentText);
      setDetailPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
      setItems(prev => prev.map(p => p._id === detailPost._id ? {
        ...p,
        comments: [...(p.comments || []), newComment]
      } : p));
      setCommentText("");
      toast.push("Comment added", "success");
    } catch {
      toast.push("Failed to add comment", "error");
    }
  }

  async function submitEditComment(commentId) {
    if (!user) return toast.push("Login required", "warning");
    if (!editingCommentText.trim()) return;
    try {
      const updatedComment = await apiEditCommentSocial(detailPost._id, commentId, editingCommentText);
      const updateCommentsList = (list) => list.map(c => c._id === commentId ? updatedComment : c);

      setDetailPost(prev => ({ ...prev, comments: updateCommentsList(prev.comments || []) }));
      setItems(prev => prev.map(p => p._id === detailPost._id ? { ...p, comments: updateCommentsList(p.comments || []) } : p));
      setEditingCommentId(null);
      setEditingCommentText("");
      toast.push("Comment updated", "success");
    } catch (error) {
      toast.push(error?.response?.data?.message || "Failed to update comment", "error");
    }
  }

  async function handleDeleteComment(commentId) {
    if (!user) return toast.push("Login required", "warning");
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await apiDeleteCommentSocial(detailPost._id, commentId);
      const updateCommentsList = (list) => list.filter(c => c._id !== commentId);

      setDetailPost(prev => ({ ...prev, comments: updateCommentsList(prev.comments || []) }));
      setItems(prev => prev.map(p => p._id === detailPost._id ? { ...p, comments: updateCommentsList(p.comments || []) } : p));
      toast.push("Comment deleted", "success");
    } catch (error) {
      toast.push(error?.response?.data?.message || "Failed to delete comment", "error");
    }
  }

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
            {(detailPost.imageData || detailPost.imageUrl) ? (
              <img src={detailPost.imageData || detailPost.imageUrl} className="w-full rounded-2xl" />
            ) : null}
            <div className="pt-3 border-t text-sm">
              <div className="font-bold text-slate-700 mb-2">Comments ({detailPost.comments?.length || 0})</div>
              <div className="space-y-2 max-h-80 overflow-y-auto mb-3 pr-2">
                {detailPost.comments && detailPost.comments.length > 0 ? (
                  detailPost.comments.map((c) => {
                    const isMyComment = String(c.user) === String(user?._id || user?.id);
                    const isAdmin = user?.role === "admin" || user?.isAdmin === true;
                    const isUnder30Mins = (Date.now() - new Date(c.createdAt).getTime()) / 60000 <= 30;
                    const canEdit = isMyComment && isUnder30Mins;
                    const canDelete = isMyComment || isAdmin;
                    const isEditing = editingCommentId === c._id;

                    return (
                      <div key={c._id} className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-800 text-xs">{c.userName}</span>
                          <div className="flex items-center gap-2">
                            {canEdit && !isEditing && (
                              <button
                                onClick={() => { setEditingCommentId(c._id); setEditingCommentText(c.text); }}
                                className="text-[10px] text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && !isEditing && (
                              <button
                                onClick={() => handleDeleteComment(c._id)}
                                className="text-[10px] text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                            <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {isEditing ? (
                          <div className="mt-1 flex flex-col gap-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") submitEditComment(c._id); }}
                                className="input-field flex-1 text-sm bg-white p-1"
                                autoFocus
                              />
                              <div className="flex gap-1 items-center">
                                <button onClick={() => setShowEditEmojiPicker(!showEditEmojiPicker)} className="text-xl grayscale hover:grayscale-0" title="Emoji">😀</button>
                                <button onClick={() => { submitEditComment(c._id); setShowEditEmojiPicker(false); }} className="text-xs text-green-600 font-semibold px-2 py-1 rounded bg-green-50 hover:bg-green-100">Save</button>
                                <button onClick={() => { setEditingCommentId(null); setShowEditEmojiPicker(false); }} className="text-xs text-red-600 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100">Cancel</button>
                              </div>
                            </div>
                            {showEditEmojiPicker && (
                              <div className="mt-1 self-end z-50 shadow-xl rounded-lg">
                                <EmojiPicker onEmojiClick={(e) => { setEditingCommentText(prev => prev + e.emoji); setShowEditEmojiPicker(false); }} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 text-sm mt-1">{c.text}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-500 text-xs italic">No comments yet.</div>
                )}
              </div>
              {showMainEmojiPicker && (
                <div className="mb-2 shadow-xl rounded-lg">
                  <EmojiPicker onEmojiClick={(e) => { setCommentText(prev => prev + e.emoji); setShowMainEmojiPicker(false); }} width="100%" />
                </div>
              )}
              <div className="flex gap-2 items-center">
                <button 
                  onClick={() => setShowMainEmojiPicker(!showMainEmojiPicker)} 
                  className="text-2xl grayscale hover:grayscale-0 transition"
                  title="Add Emoji"
                >
                  😀
                </button>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { submitComment(); setShowMainEmojiPicker(false); } }}
                  placeholder="Write a comment..."
                  className="input-field flex-1 text-sm bg-slate-50"
                />
                <button onClick={() => { submitComment(); setShowMainEmojiPicker(false); }} className="btn-primary whitespace-nowrap text-sm px-4">Post</button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
