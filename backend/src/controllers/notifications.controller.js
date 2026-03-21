import Notification from "../models/Notification.js";

export async function listMyNotifications(req, res) {
  const items = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(items);
}

export async function markAllRead(req, res) {
  await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
  res.json({ ok: true });
}
