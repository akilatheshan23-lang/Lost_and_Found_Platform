const Notification = require("../Model/NotificationModel");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications.", error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    res.status(200).json({ message: "Notification marked as read.", notification });
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read.", error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Error marking all notifications as read.", error: error.message });
  }
};
