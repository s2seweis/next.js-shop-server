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
  console.log("line:1000 - #####", user_id);
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
  console.log("line:99 - #####", user_id);
  const password = await UserRepo.findByIdPassword(user_id);
  console.log("line:100", password);

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
    console.log("line:99", user_id);
    const { username, email, full_name, profile_picture_url, role } = req.body;
    console.log("line:100", username);
    console.log("line:101", email);
    console.log("line:102", full_name);
    console.log("line:103", username);
    console.log("line:104", profile_picture_url);
    console.log("line:105", role);
    // console.log("line:105", role);

    const user = await UserRepo.update(
      user_id,
      username,
      email,
      full_name,
      profile_picture_url,
      role
    );
    console.log("line:200", user);

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
    console.log("line:99", user_id);
    const { userId, newPassword } = req.body;
    console.log("line:100", userId);
    console.log("line:101", newPassword);
    
    const password = await UserRepo.updatePassword(
     user_id,
     newPassword
  
    );
    console.log("line:200", password);

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
  // console.log("line:500", user_id);
  const user = await UserRepo.delete(user_id);

  if (user) {
    res.send(user);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
