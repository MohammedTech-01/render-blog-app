const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    title: String,
    content: String,
    summary: String,
    cover: String,
    author: {type: Schema.Types.ObjectId, ref: "User"}
  },
  {
    timestamps: true,
  }
);
const PostModel = model("Post", postSchema);

module.exports = PostModel;