const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;

  res.render("index", {
    title: "Home",
    user: {
      id,
      login,
    },
  });
});

module.exports = router;
