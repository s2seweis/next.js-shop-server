const express = require("express");
const NotificationPreferencesRepo = require("../repos/notificationPreferences-repos");

const router = express.Router();

// Get all NotificationPreferences - works
router.get("/notification-preference", async (req, res) => {
  try {
    const accountStatus = await NotificationPreferencesRepo.find();
    // console.log("line:500", accountStatus);

    res.send(accountStatus);
  } catch (error) {
    console.error("Error getting accountStatus:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get NotificationPreferences by ID -works
router.get("/notification-preference/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:1", id);
    const accountStatus = await NotificationPreferencesRepo.findById(id);

    if (accountStatus) {
      res.send(accountStatus);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error getting accountStatus by ID:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Add NotificationPreferences
router.post("/notification-preference", async (req, res) => {
  try {
    const {
      user_id,
      email_notifications,
      push_notifications,
      sms_notifications,
      in_app_notifications,
    } = req.body;

    console.log("line:1", user_id);
    console.log("line:2", email_notifications);
    console.log("line:3", push_notifications);
    console.log("line:4", sms_notifications);
    console.log("line:5", in_app_notifications);

    const userPreferences = await NotificationPreferencesRepo.insert(
      user_id,
      email_notifications,
      push_notifications,
      sms_notifications,
      in_app_notifications
    );

    // Handle the response based on the result of the insertion
    res.status(201).json({ success: true, data: userPreferences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.put("/notification-preference/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:0", id);

    const {
      email_notifications,
      push_notifications,
      sms_notifications,
      in_app_notifications,
      // Add other properties from the NotificationPreferences table as needed
    } = req.body;
    console.log("line:1", email_notifications);
    console.log("line:2", push_notifications);
    console.log("line:3", sms_notifications);
    console.log("line:4", in_app_notifications);
    // Add other console.log statements for additional properties

    // Use the NotificationPreferencesRepo.update method to update the record
    const updatedProfile = await NotificationPreferencesRepo.update(
      id,
      email_notifications,
      push_notifications,
      sms_notifications,
      in_app_notifications
      // Add other parameter values here
    );
    console.log("line:11", updatedProfile);

    if (updatedProfile !== undefined) {
      res.send(updatedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating NotificationPreferences:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete NotificationPreferences
router.delete("/notification-preference/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:1", id);
    const deletedProfile = await NotificationPreferencesRepo.delete(id);
    console.log("line:2", deletedProfile);

    if (deletedProfile) {
      res.send(deletedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting accountStatus:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
