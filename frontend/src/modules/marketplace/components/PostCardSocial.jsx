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
  const icons = { announcement: "📢", event: "🎉", update: "📌", general: "💬" };
  return icons[type] || "💬";
}

export default function PostCardSocial({ post, onEdit, onDelete, onOpenDetail, onLike }) {
  const { user } = useAuth();
  const canManage = user && (user.id === post.createdBy || user.isAdmin);

  const timeLabel = useMemo(() => new Date(post.createdAt).toLocaleString(), [post.createdAt]);

  return (
    <div className="card-solid card-hover overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
              {typeIcon(post.postType)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-slate-900 truncate">{post.createdByName}</div>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${typeBadge(post.postType)}`}>
                  {post.postType}
                </span>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-slate-500 text-sm">{timeLabel}</span>
              </div>
            </div>
          </div>

          {canManage ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(post)} className="btn-secondary px-3">✏️</button>
              <button onClick={() => onDelete(post)} className="btn-danger px-3">🗑️</button>
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{post.title}</h3>
          <p className="text-slate-700 mt-1 whitespace-pre-wrap">{post.content}</p>
        </div>

        {post.imageUrl ? (
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src={post.imageUrl} alt={post.title} className="w-full max-h-[420px] object-cover" loading="lazy" />
          </div>
        ) : null}

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700">#{t}</span>
            ))}
          </div>
        ) : null}

        <div className="pt-3 border-t border-slate-200 flex items-center gap-6">
          <button onClick={() => onLike(post)} className="text-slate-600 hover:text-rose-600 flex items-center gap-2">
            ❤️ <span>{post.likes || 0}</span>
          </button>
          <button onClick={() => onOpenDetail(post)} className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
            💬 <span>Details</span>
          </button>
          <button className="text-slate-600 hover:text-emerald-700 flex items-center gap-2">
            🔗 <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
