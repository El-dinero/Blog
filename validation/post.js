exports.getPost = async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    if (!userId || !userLogin) res.redirect("/");
    else next();
}

exports.createPost = async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if (!userId || !userLogin) res.redirect("/");
    else {
        const title = req.body.title.trim().replace(/ +(?= )/g, "");
        const body = req.body.body;

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
            next()
        }
    }
}