

exports.onePost = async (req, res, next) => {
    const url = req.params.post.trim().replace(/ +(?= )/g, "");
    const userId = req.session.userId;
    const userLogin = req.session.userLogin;

    if (!url) {
        const err = new Error("Not Found url onePost!");
        err.status = 422;
        next(err);
    } else if (!userId || !userLogin) {
        const err = new Error("Not Found userId or userLogin onePost!");
        err.status = 422;
        next(err);
    } else {
        next()
    }
}