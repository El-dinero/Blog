const express = require("express");
const router = express.Router();

const {comment} = require("../controlers/comment");

// POST is add
router.post("/add", comment);

module.exports = router;
