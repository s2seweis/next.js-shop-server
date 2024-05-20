const express = require("express");
const AuthRepo = require("../repos/auth-repos");
const multer = require("multer");

const router = express.Router();
const upload = multer();

// Register a new user - works
router.post("/register", upload.none(), async (req, res) => {
  try {
    const { username, email, full_name, profile_picture_url, password } =
      req.body;
   
    // Check if the user already exists
    const existingUser = await AuthRepo.getUserByEmail(email);

    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
    } else {
      // Register the user
      const newUser = await AuthRepo.registerUser({
        username,
        email,
        full_name,
        profile_picture_url,
        password,
      });
      res.json({ message: "Registration successful", user: newUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register-oauth", upload.none(), async (req, res) => {
  try {
    const { email, full_name } =
      req.body;
    const role = 'user';
    const username = 'guest';
    const password = '123456'
    const profile_picture_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Placeholder_no_text.svg/150px-Placeholder_no_text.svg.png?20180902010812';

    // Check if the user already exists
    const existingUser = await AuthRepo.getUserByEmail(email);

    if (existingUser) {
      // res.status(400).json({ message: "User with this email already exists." });
      res.json({ message: "Registration successful", user: existingUser });

    } else {
      // Register the user
      const newUser = await AuthRepo.registerUserOAuth({
        username,
        email,
        full_name,
        role,
        profile_picture_url,
        password,
      });
      res.json({ message: "Registration successful", user: newUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login a new user - works
router.post("/login", upload.none(), async (req, res) => {
  try {
    const { email, password } = req.body;
   
    // Login the user
    const loginResult = await AuthRepo.loginUser({ email, password });

    // Return the token on successful login
    return res.json(loginResult);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

router.post("/login-oauth", upload.none(), async (req, res) => {
  try {
    const { email, name} = req.body;
  
    // Login the user
    const loginResult = await AuthRepo.loginUserOauth({ email});

    // Return the token on successful login
    return res.json(loginResult);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// Delete a User
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAuthentication = await AuthRepo.delete(id);

    if (deletedAuthentication) {
      res.send(deletedAuthentication);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error deleting userAuthentication:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// ... other routes ...

module.exports = router;
