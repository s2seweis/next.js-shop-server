const express = require("express");
const ContactInformationRepo = require("../repos/contactInformation-repos");

const router = express.Router();

// Get all ContactInformation
router.get("/contact-information", async (req, res) => {
  try {
    const contactinformation = await ContactInformationRepo.find();

    res.send(contactinformation);
  } catch (error) {
    console.error("Error getting contactinformation:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Get ContactInformation by ID
router.get("/contact-information/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await ContactInformationRepo.findById(id);

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

router.post("/contact-information", async (req, res) => {
  try {
    const {
      user_id,
      email,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    } = req.body;

    // Assuming your ContactInformationRepo.insert method takes the necessary parameters
    const userProfile = await ContactInformationRepo.insert(
      user_id,
      email,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country
    );

    res.send(userProfile);
  } catch (error) {
    console.error("Error adding userProfile:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/contact-information/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_id,
      email,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
    } = req.body;

    // Build an object with the fields that are not undefined in the request body

    // Remove undefined values from the object

    // Use the ContactInformationRepo.update method to update the record
    const updatedProfile = await ContactInformationRepo.update(
      user_id,
      email,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country
    );

    if (updatedProfile !== undefined) {
      res.send(updatedProfile);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error updating userProfile:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Delete ContactInformation
router.delete("/contact-information/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await ContactInformationRepo.delete(id);

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
