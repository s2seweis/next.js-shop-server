const express = require("express");
const usersRouter = require("./routes/users");
const assetsRouter = require("./routes/assets");
const userProfileRouter = require("./routes/userProfile");
const authRouter = require("./routes/auth");
const contactInformationRouter = require("./routes/contactInformations");
const accountStatusRouter = require("./routes/accountStatus");
const userPreferenceRouter = require("./routes/userPreference");
const notificationPreferenceRouter = require("./routes/notificationPreferences");
const productsRouter = require("./routes/products");
// ### 
const resetRouter = require("./routes/reset");
// ###
const basketRouter = require("./routes/basket");
// ### 
const notificationRouter = require("./routes/notifications");
// ### 
const categoriesRouter = require("./routes/categories");
require("dotenv").config();

const cors = require("cors");

module.exports = () => {
  const app = express();
  app.use(cors());

  app.use(express.json());
  app.use(usersRouter);
  app.use(assetsRouter);
  app.use(userProfileRouter);
  app.use(authRouter);
  app.use(contactInformationRouter);
  app.use(accountStatusRouter);
  app.use(userPreferenceRouter);
  app.use(notificationPreferenceRouter);
  app.use(productsRouter);
  app.use(basketRouter);
  app.use(resetRouter);
  app.use(notificationRouter);
  app.use(categoriesRouter);

  return app;
};
