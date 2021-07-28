const config = require("../config");
const models = require("../models");


exports.user = async (req, res, next) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    const perPage = +config.PER_PAGE;
    const page = req.params.page || 1;
    const login = req.params.login;

    try {
        const user = await models.User.findOne({
            login,
        });
        const posts = await models.Post.find({
            owner: user.id,
        })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .sort({createdAt: -1});

        const count = await models.Post.estimatedDocumentCount({
            owner: user.id,
        });
        res.render("archive/user", {
            title: userLogin,
            posts,
            _user: user,
            current: page,
            pages: Math.ceil(count / perPage),
            user: {
                id: userId,
                login: userLogin,
            },
        });
    } catch (error) {
        next((error) => new Error("Server Error", error));
    }
}