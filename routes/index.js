const express = require("express");
const router = express.Router();
const moment = require("moment");
moment.locale("ua");

const index = require("../controlers/index");
const validation = require("../validation/index");

router.get("/", index.posts);

router.get("/archive/:page", index.posts);

router.get("/posts/:post", validation.onePost, index.onePost);

module.exports = router;
