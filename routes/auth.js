const express = require("express");
const router = express.Router();
const validationAuth = require("../validation/auth");
const auth = require("../controlers/auth");

router.post("/register", validationAuth.registrations, auth.registrations);

router.post("/login", validationAuth.login, auth.login);

// GET for logout
router.get("/logout", auth.logout);

module.exports = router;
