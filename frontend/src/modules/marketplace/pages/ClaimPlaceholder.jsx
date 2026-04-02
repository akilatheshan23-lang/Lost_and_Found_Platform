import { useParams, Link } from "react-router-dom";

export default function ClaimPlaceholder() {
  const { foundId } = useParams();
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-solid p-6">
        <div className="text-2xl font-bold text-slate-900">🙋 Claim Management</div>
        <div className="text-slate-600 mt-2">
          This page is reserved for your Claim module. Found item id:
          <span className="font-mono ml-2 text-slate-900">{foundId}</span>
        </div>
        <div className="mt-5">
          <Link className="btn-primary" to="/found">
            ← Back to Found
          </Link>
        </div>
      </div>
    </div>
  );
}
