import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchLostItems } from "../services/lostService";
import { fetchClaims } from "../services/claimService";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [lostItems, setLostItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [l, c] = await Promise.all([fetchLostItems(), fetchClaims()]);
      setLostItems(l);
      setClaims(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const notifications = useMemo(() => {
    const lostNoti = lostItems
      .filter((x) => ["approved", "rejected"].includes(x.status))
      .map((x) => ({
        kind: "lost",
        id: x._id,
        status: x.status,
        title: x.itemName,
        note: x.adminNote || "",
        createdAt: x.updatedAt || x.createdAt,
      }));

    const claimNoti = claims
      .filter((x) => ["approved", "rejected", "collected"].includes(x.status))
      .map((x) => ({
        kind: "claim",
        id: x._id,
        status: x.status,
        title: x.claimItem?.itemName || x.itemName || "Claim",
        note: x.approvalNotification || x.adminNote || "",
        createdAt: x.updatedAt || x.createdAt,
      }));

    return [...lostNoti, ...claimNoti].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [lostItems, claims]);

  const stats = useMemo(() => {
    const totalLost = lostItems.length;
    const totalClaims = claims.length;
    const pending = [...lostItems, ...claims].filter((x) => x.status === "pending").length;
    const resolved = [...lostItems, ...claims].filter((x) => ["approved", "collected"].includes(x.status)).length;
    return { totalLost, totalClaims, pending, resolved };
  }, [lostItems, claims]);

  const value = useMemo(
    () => ({
      lostItems,
      claims,
      loading,
      refreshAll,
      notifications,
      stats,
      setLostItems,
      setClaims,
    }),
    [lostItems, claims, loading, refreshAll, notifications, stats]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
