const models = require("../models/index");
const bcrypt = require("bcrypt-nodejs");

exports.registrations = async (req, res, next) => {
    try {

        let user = await models.User.findOne({login: req.body.login})
        if (!user) {
            user = await models.User.create({login: req.body.login, password: req.body.password});
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            res.json({ok: true});
        } else {
            res.json({
                ok: false,
                error: "Имя занято!",
                fields: ["login"],
            });
        }
    } catch (err) {
        res.json({ok: false, error: "Ошибка, попробуйте позже!"});
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const isMatch = bcrypt.compareSync(req.body.password, req.user.password);
        if (!isMatch) res.json({
            ok: false,
            error: "Логин и пароль неверны!",
            fields: ["login", "password"],
        });
        else {
            //sesies
            req.session.userId = req.user.id;
            req.session.userLogin = req.user.login;
            res.json({
                ok: true,
            });
        }
    } catch (err) {
        next(err);
        res.json({
            ok: false,
            error: "Ошибка, попробуйте позже!",
        });
    }
}


exports.logout = (req, res) => {
    if (req.session) req.session.destroy(() => res.redirect("/"));
    else res.redirect("/");
}