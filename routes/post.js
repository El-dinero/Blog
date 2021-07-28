const express = require("express");
const router = express.Router();

const post = require("../controlers/post");
const validation = require("../validation/post");

router.get("/add", validation.getPost, post.getPost);

router.post("/add", validation.createPost, post.createPost);

module.exports = router;
