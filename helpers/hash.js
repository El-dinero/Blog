const bcrypt = require("bcrypt-nodejs");

module.exports = value => {
    const salt = bcrypt.genSaltSync(11);
    return bcrypt.hashSync(value, salt);
};