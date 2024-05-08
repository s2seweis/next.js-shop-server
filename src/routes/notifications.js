const express = require('express');
const router = express.Router();
const NotificationRepo = require('../repos/notification-repo');

router.post('/notification', async (req, res) => {
  try {
    const { title, body, messageId } = req.body;
    console.log("line:1", title);
    console.log("line:2", body);
    console.log("line:3", messageId);

    // Validate required fields
    if (!title || !body || !messageId) {
      return res.status(400).json({ error: "Title, body, and messageId are required." });
    }

    // Add the notification to the notification table
    const notification = await NotificationRepo.addNotification(title, body, messageId);

    // Respond with the added notification
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error adding notification:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to fetch all notifications
router.get('/notification', async (req, res) => {
  try {
    // Fetch all notifications from the notification table
    const notifications = await NotificationRepo.getAllNotifications();

    // Respond with the fetched notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST route to mark notifications as read
router.post('/notification/read', async (req, res) => {
  try {
    console.log("line:555 - Test");
    // Assuming you have a function in NotificationRepo to mark notifications as read
    await NotificationRepo.markNotificationsAsRead();

    // Respond with success message
    res.status(200).json({ message: 'Notifications marked as read successfully' });
  } catch (error) {
    console.error('Error marking notifications as read:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
