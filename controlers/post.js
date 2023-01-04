const TurndownService = require("turndown");
const Post = require("../models/post");
exports.getPost = async (req, res) => {
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;
    res.render("post/add", {
        title: "Post",
        user: {
            id: userId,
            login: userLogin,
        },
    });
}

exports.createPost = async (req, res, next) => {
    try {
        const userId = req.session.userId;

        const title = req.body.title.trim().replace(/ +(?= )/g, "");
        const body = req.body.body;
        const turndownService = new TurndownService();
        await Post.create({
            title,
            body: turndownService.turndown(body),
            owner: userId,
        });
        res.json({
            ok: true,
        });
    } catch (err) {
        next(err);
        console.log(err);
        res.json({
            ok: false,
        });
    }
}