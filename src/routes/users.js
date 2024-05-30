const express = require("express");
const UserRepo = require("../repos/users-repos");
const multer = require("multer");

const router = express.Router();
const upload = multer();

// ### Get Users - works

router.get("/users", async (req, res) => {
  // Run a query to get all users
  const users = await UserRepo.find();
  // Send the result back to the person who made this request
  res.send(users);
});

// ### Get Users by Id - works

router.get("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const user = await UserRepo.findById(user_id);

  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

// ### Get Password by Id 

router.get("/password/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const password = await UserRepo.findByIdPassword(user_id);

  if (password) {
    res.send(password);
  } else {
    res.sendStatus(404);
  }
});

// ### Add Users - updated to use multer

router.post("/users", upload.none(), async (req, res) => {
  try {
    console.log("Received form data:", req.body);

    const { username, email, full_name, profile_picture_url } = req.body;

    // Your logic to insert user data
    const user = await UserRepo.insert(
      username,
      email,
      full_name,
      profile_picture_url
    );

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ### Update Users - works

router.put("/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log("line:1", user_id);
    const { blocked, email, fullName, role, username } = req.body;
    console.log("line: body", req.body);

    console.log("line:2", blocked);
    console.log("line:3", email);
    console.log("line:4", fullName);
    console.log("line:5", role);

    const full_name = fullName;
    console.log("line:6", username);
    const profile_picture_url = 'https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png';
    console.log("line:7", profile_picture_url);

    const user = await UserRepo.update(
      user_id,
      username,
      email,
      full_name,
      profile_picture_url,
      role,
      blocked
    );

    if (user) {
      res.send(user);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ### Update Password

router.put("/password/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { userId, newPassword } = req.body;

    const password = await UserRepo.updatePassword(
      user_id,
      newPassword

    );

    if (password) {
      res.send(password);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ### Delete Users - works

router.delete("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const user = await UserRepo.delete(user_id);

  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
