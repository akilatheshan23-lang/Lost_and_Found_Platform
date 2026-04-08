import React from "react";

export default function StatusBadge({ status }) {
  let cls = "status-pending";
  if (status === "approved") cls = "status-approved";
  if (status === "rejected") cls = "status-rejected";
  if (status === "collected") cls = "status-collected";
  return <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap capitalize ${cls}`}>{status}</span>;
}
