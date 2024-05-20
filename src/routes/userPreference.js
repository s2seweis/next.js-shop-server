const express = require("express");
const UserPreferenceRepo = require("../repos/userPreferences-repos");

const router = express.Router();

// Get all UserPreferences - works
router.get("/user-preference", async (req, res) => {
  try {
    const accountStatus = await UserPreferenceRepo.find();

    res.send(accountStatus);
  } catch (error) {
    console.error("Error getting accountStatus:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get UserPreferences by ID -works
router.get("/user-preference/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accountStatus = await UserPreferenceRepo.findById(id);

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

// ### here at the moment
// Add UserPreferences
router.post("/user-preference", async (req, res) => {
  try {
    const {
      user_id,
      theme,
      language,
      receive_email_notifications,
      show_online_status,
    } = req.body;
  
    const userPreferences = await UserPreferenceRepo.insert(
      user_id,
      theme,
      language,
      receive_email_notifications,
      show_online_status
    );

    // Handle the response based on the result of the insertion
    res.status(201).json({ success: true, data: userPreferences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Update UserPreferences
router.put("/user-preference/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      theme,
      language,
      receive_email_notifications,
      show_online_status,
      // Add other properties from the UserPreferences table as needed
    } = req.body;
   
    // Add other console.log statements for additional properties
    // Use the UserPreferenceRepo.update method to update the record
    const updatedProfile = await UserPreferenceRepo.update(
      id,
      theme,
      language,
      receive_email_notifications,
      show_online_status
      // Add other parameter values here
    );

    if (updatedProfile !== undefined) {
      res.send(updatedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating UserPreferences:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete UserPreferences
router.delete("/user-preference/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await UserPreferenceRepo.delete(id);

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
