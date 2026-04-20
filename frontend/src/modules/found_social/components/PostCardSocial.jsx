import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";

function typeBadge(type) {
  const styles = {
    announcement: "bg-rose-50 text-rose-700 border-rose-100",
    event: "bg-purple-50 text-purple-700 border-purple-100",
    update: "bg-blue-50 text-blue-700 border-blue-100",
    general: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return styles[type] || "bg-slate-50 text-slate-700 border-slate-200";
}

function typeIcon(type) {
  const icons = {
    announcement: "📢",
    event: "🎉",
    update: "📌",
    general: "💬",
  };
  return icons[type] || "💬";
}

export default function PostCardSocial({ post, onEdit, onDelete, onOpenDetail, onLike }) {
  const { user } = useAuth();

  const currentUserId = user?._id || user?.id || "";
  const currentUserName = String(user?.name || "").trim().toLowerCase();

  const postOwnerId =
    typeof post.createdBy === "object"
      ? post.createdBy?._id || post.createdBy?.id || ""
      : post.createdBy || "";

  const postOwnerName = String(post.createdByName || "").trim().toLowerCase();

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  const isOwnerById =
    Boolean(currentUserId) && Boolean(postOwnerId) && String(currentUserId) === String(postOwnerId);

  const isOwnerByNameFallback =
    !postOwnerId && Boolean(currentUserName) && Boolean(postOwnerName) && currentUserName === postOwnerName;

  const canManage = Boolean(user) && (isAdmin || isOwnerById || isOwnerByNameFallback);

  const timeLabel = useMemo(() => {
    try {
      return new Date(post.createdAt).toLocaleString();
    } catch {
      return "Unknown time";
    }
  }, [post.createdAt]);

  const imgSrc = post.imageData || post.imageUrl || "";

  const handleShare = () => {
    const text = `Check out this post on Smart Campus: ${post.title}\n\n`;
    const shareUrl = window.location.href; 

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: text,
        url: shareUrl
      }).catch(err => console.error("Error sharing:", err));
    } else {
      const waLink = `https://wa.me/?text=${encodeURIComponent(text + shareUrl)}`;
      window.open(waLink, "_blank");
    }
  };

  return (
    <div className="card-solid card-hover overflow-hidden border-white/90 bg-white/92">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-100 text-2xl ring-1 ring-indigo-100">
              {typeIcon(post.postType)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="truncate font-semibold text-slate-900">
                  {post.createdByName || "User"}
                </div>

                <span className={`rounded-full border px-2.5 py-1 text-xs ${typeBadge(post.postType)}`}>
                  {post.postType}
                </span>

                <span className="text-sm text-slate-400">•</span>
                <span className="text-sm text-slate-500">{timeLabel}</span>
              </div>
            </div>
          </div>

          {canManage ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(post)}
                className="btn-secondary px-3"
                title="Edit post"
              >
                ✏️
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(post)}
                className="btn-danger px-3"
                title="Delete post"
              >
                🗑️
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
          <p className="mt-1 whitespace-pre-wrap text-slate-700">{post.content}</p>
        </div>

        {imgSrc ? (
          <div className="overflow-hidden rounded-3xl border border-white/70 shadow-inner">
            <img
              src={imgSrc}
              alt={post.title || "Post image"}
              className="max-h-[420px] w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-6 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => onLike?.(post)}
            className="flex items-center gap-2 text-slate-600 hover:text-rose-600"
          >
            ❤️ <span>{post.likes || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDetail?.(post)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            💬 <span>{post.comments?.length || 0} Comments</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-700"
          >
            🔗 <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}