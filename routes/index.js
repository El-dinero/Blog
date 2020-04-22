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
        .catch(() => {
          throw new Error("Server Error");
        });
    })
    .catch(() => {
      throw new Error("Server Error");
    });
}

// routers
router.get("/", (req, res) => posts(req, res));
router.get("/archive/:page", (req, res) => posts(req, res));
router.get("/posts/:post", (req, res, next) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const url = req.params.post.trim().replace(/ +(?= )/g, "");

  if (!url) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    Post.findOne({
      url,
    }).then((post) => {
      if (!post) {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
      } else {
        res.render("post/onePost", {
          title: "OnePost",
          post,
          user: {
            id: userId,
            login: userLogin,
          },
        });
      }
    });
  }
});

module.exports = router;
