const express = require("express");
const router = express.Router();
const authHelper = require(__pathHelper + "auth");

module.exports = passport => {
  router.use("/auth", require("./auth")(passport));
  router.use("/provinces", require("./provinces"));
  router.use("/districts", require("./districts"));
  router.use("/users", authHelper.isAuthenticated, require("./users"));
  return router;
};
