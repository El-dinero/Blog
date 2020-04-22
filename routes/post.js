const express = require("express");
const router = express.Router();

const TurndownService = require("turndown");

const Post = require("../models/post");

router.get("/add", (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  if (!userId || !userLogin) {
    res.redirect("/");
  } else {
    res.render("post/add", {
      title: "Post",
      user: {
        id: userId,
        login: userLogin,
      },
    });
  }
});

router.post("/add", (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.redirect("/");
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, "");
    const body = req.body.body;
    const turndownService = new TurndownService();

    if (!title || !body) {
      const fields = [];
      if (!title) fields.push("title");
      if (!body) fields.push("body");

      res.json({
        ok: false,
        error: "Все поля должны быть заполнены!",
        fields,
      });
    } else if (title.length < 3 || title.length > 64) {
      res.json({
        ok: false,
        error: "Длина заголовка от 3 до 64 символов!",
        fields: ["title"],
      });
    } else if (body.length < 10) {
      res.json({
        ok: false,
        error: "Текст не менее 10х символов!",
        fields: ["body"],
      });
    } else {
      Post.create({
        title,
        body: turndownService.turndown(body),
        owner: userId,
      })
        .then((post) => {
          console.log(post);
          res.json({
            ok: true,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            ok: false,
          });
        });
    }
  }
});

module.exports = router;
