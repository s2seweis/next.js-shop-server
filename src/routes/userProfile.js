const express = require("express");
const UsersProfileRepo = require("../repos/userProfile-repos");

const router = express.Router();

// Get all userprofile
router.get("/userprofile", async (req, res) => {
  try {
    const userprofile = await UsersProfileRepo.find();
    // console.log("line:500", userprofile);

    const dateOfBirthArray = userprofile.map((item) => item.dateOfBirth);

    res.send(userprofile);
  } catch (error) {
    console.error("Error getting userprofile:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get userProfile by ID
router.get("/userprofile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:100", id);
    const userProfile = await UsersProfileRepo.findById(id);
    console.log("line:200", userProfile);

    if (userProfile) {
      res.send(userProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error getting userProfile by ID:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Add userProfile
router.post("/userprofile", async (req, res) => {
  try {
    const {
      user_id,
      bio,
      date_of_birth,
      location,
      website_url,
      profile_picture_url,
    } = req.body;
    console.log("line:1", user_id);
    console.log("line:2", bio);
    console.log("line:3", date_of_birth);
    console.log("line:4", location);
    console.log("line:5", website_url);
    console.log("line:6", profile_picture_url);
    const userProfile = await UsersProfileRepo.insert(
      user_id,
      bio,
      date_of_birth,
      location,
      website_url,
      profile_picture_url
    );
    res.send(userProfile);
  } catch (error) {
    console.error("Error adding userProfile:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update userProfile
router.put("/userprofile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("line:1", id);
    const {
      user_id,
      bio,
      date_of_birth,
      location,
      website_url,
      profile_picture_url,
    } = req.body;

    const updatedProfile = await UsersProfileRepo.update(
      user_id,
      bio,
      date_of_birth,
      location,
      website_url,
      profile_picture_url
    );

    if (updatedProfile) {
      res.send(updatedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating userProfile:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete userProfile
router.delete("/userprofile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await UsersProfileRepo.delete(id);

    if (deletedProfile) {
      res.send(deletedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting userProfile:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
