const express = require("express");
const AccountStatusRepo = require("../repos/accountStatus-repos");

const router = express.Router();

// Get all AccountStatus
router.get("/account-status", async (req, res) => {
  try {
    const accountStatus = await AccountStatusRepo.find();

    res.send(accountStatus);
  } catch (error) {
    console.error("Error getting accountStatus:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get AccountStatus by ID
router.get("/account-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accountStatus = await AccountStatusRepo.findById(id);

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

// Add AccountStatus
router.post("/account-status", async (req, res) => {
  try {
    const { user_id, is_active, is_suspended, is_deactivated, last_login } =
      req.body;
 
    const accountStatus = await AccountStatusRepo.insert(
      user_id,
      is_active,
      is_suspended,
      is_deactivated,
      last_login
    );

    // Handle the response based on the result of the insertion
    res.status(201).json({ success: true, data: accountStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.put("/account-status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_id,
      is_active,
      is_suspended,
      is_deactivated,
      last_login,
      // Other status-related fields can be added here
    } = req.body;
   
    // Use the AccountStatusRepo.update method to update the record
    const updatedProfile = await AccountStatusRepo.update(
      user_id,
      is_active,
      is_suspended,
      is_deactivated,
      last_login /* Add other parameter values here */
    );

    if (updatedProfile !== undefined) {
      res.send(updatedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating accountStatus:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete AccountStatus
router.delete("/account-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await AccountStatusRepo.delete(id);

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
