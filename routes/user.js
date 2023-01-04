const express = require("express");
const router = express.Router();

const {user} = require("../controlers/user");

// users posts
router.get("/:login/:page*?", user);

module.exports = router;
