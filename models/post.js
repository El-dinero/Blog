const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const URLSlugs = require("mongoose-url-slugs");
const tr = require("transliter");

const schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        commentCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

schema.statics.incCommentCount = function incCommentCount(postId) {
    return this.updateOne({_id: postId}, {$inc: {commentCount: 1}});
}

schema.plugin(
    URLSlugs("title", {
        field: "url",
        generator: (text) => tr.slugify(text),
    })
);

schema.set('toObject', {virtuals: true});
schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model("Post", schema);
