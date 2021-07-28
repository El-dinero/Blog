const models = require("../models/index");
const bcrypt = require("bcrypt-nodejs");

exports.registrations = async (req, res, next) => {
    const {login, password, passwordConfirm} = req.body;
    if (!login || !password || !passwordConfirm) {
        const fields = [];
        if (!login) fields.push("login");
        if (!password) fields.push("password");
        if (!passwordConfirm) fields.push("passwordConfirm");
        res.json({ok: false, error: "Все поля должны быть заполнены!", fields});
    } else if (!/^[a-zA-Z0-9]+$/.test(login)) res.json({
        ok: false,
        error: "Только латинские буквы и цифры!",
        fields: ["login"]
    });
    else if (login.length < 3 || login.length > 16) res.json({
        ok: false,
        error: "Длина логина от 3 до 16 символов!",
        fields: ["login"]
    });
    else if (password !== passwordConfirm) res.json({
        ok: false,
        error: "Пароли не совпадают!",
        fields: ["password", "passwordConfirm"]
    });
    else if (password.length < 5) res.json({
        ok: false,
        error: "Минимальная длина пароля 5 символов!",
        fields: ["password"]
    });
    else {
         next();
    }
}

exports.login = async (req, res, next) => {
        const {password, login} = req.body;
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
            req.user = await models.User.findOne({
                login,
            });
            if (!req.user) {
                res.json({
                    ok: false,
                    error: "Логин и пароль неверны!",
                    fields: ["login", "password"],
                });
            } else {
                next();
            }
        }
}