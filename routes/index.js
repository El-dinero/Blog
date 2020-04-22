const express = require("express");
const router = express.Router();

const config = require("../config");
const Post = require("../models/post");

function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  Post.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then((posts) => {
      Post.count()
        .then((count) => {
          res.render("index", {
            title: "Home",
            posts,
            current: page,
            pages: Math.ceil(count / perPage),
            user: {
              id: userId,
              login: userLogin,
            },
          });
        })
        .catch(console.log);
    })
    .catch(console.log);
}

// routers
router.get("/", (req, res) => posts(req, res));
router.get("/archive/:page", (req, res) => posts(req, res));

module.exports = router;
