const express = require("express");
const router = express.Router();

const config = require("../config");
const models = require("../models");

async function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  try {
    const posts = await models.Post.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("owner")
      .sort({ createdAt: -1 });

    const count = await models.Post.estimatedDocumentCount();

    res.render("index", {
      title: "Blog",
      posts,
      current: page,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin,
      },
    });
  } catch (error) {
    throw new Error("Server Error");
  }
}

// routers
router.get("/", (req, res) => posts(req, res));
router.get("/archive/:page", (req, res) => posts(req, res));

router.get("/posts/:post", async (req, res, next) => {
  const url = req.params.post.trim().replace(/ +(?= )/g, "");
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!url) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    try {
      const post = await models.Post.findOne({
        url,
      });

      if (!post) {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
      } else {
        res.render("post/onePost", {
          title: post.title,
          post,
          user: {
            id: userId,
            login: userLogin,
          },
        });
      }
    } catch (error) {
      throw new Error("Server Error");
    }
  }
});

module.exports = router;
