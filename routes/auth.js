const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");

const User = require("../models/user");

router.post("/register", (req, res) => {
  const { login, password, passwordConfirm } = req.body;
  if (!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push("login");
    if (!password) fields.push("password");
    if (!passwordConfirm) fields.push("passwordConfirm");
    res.json({
      ok: false,
      error: "Все поля должны быть заполнены!",
      fields,
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: "Только латинские буквы и цифры!",
      fields: ["login"],
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: "Длина логина от 3 до 16 символов!",
      fields: ["login"],
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: "Пароли не совпадают!",
      fields: ["password", "passwordConfirm"],
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: "Минимальная длина пароля 5 символов!",
      fields: ["password"],
    });
  } else {
    User.findOne({
      login,
    }).then((user) => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          User.create({
            login,
            password: hash,
          })
            .then((user) => {
              //sesies
              req.session.userId = user.id;
              req.session.userLogin = user.login;
              res.json({
                ok: true,
              });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                ok: false,
                error: "Ошибка, попробуйте позже!",
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: "Имя занято!",
          fields: ["login"],
        });
      }
    });
  }
});

// POST is login
router.post("/login", (req, res) => {
  const { password, login } = req.body;
  if (!login || !password) {
    const fields = [];
    if (!login) fields.push("login");
    if (!password) fields.push("password");

    res.json({
      ok: false,
      error: "Все поля должны быть заполнены!",
      fields,
    });
  } else {
    User.findOne({
      login,
    })
      .then((user) => {
        if (!user) {
          res.json({
            ok: false,
            error: "Логин и пароль неверны!",
            fields: ["login", "password"],
          });
        } else {
          bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
              res.json({
                ok: false,
                error: "Логин и пароль неверны!",
                fields: ["login", "password"],
              });
            } else {
              //sesies
              req.session.userId = user.id;
              req.session.userLogin = user.login;
              res.json({
                ok: true,
              });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          ok: false,
          error: "Ошибка, попробуйте позже!",
        });
      });
  }
});

// GET for logout
router.get("/logout", (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
