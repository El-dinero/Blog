const mongoose = require("mongoose");
const hash = require('../helpers/hash');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        login: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            set: value => hash(value)
        },
    },
    {
        timestamps: true,
    }
);


schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("User", schema);
