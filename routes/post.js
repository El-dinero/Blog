const express = require("express");
const router = express.Router();

router.get("/add", (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render("post/add", {
    title: "Post",
    user: {
      id,
      login,
    },
  });
});

module.exports = router;
