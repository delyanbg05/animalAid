const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  replyTo: {
    type: Number,
  },
  date: {
    type: Number,
    required: true,
    default: () => {
      return parseInt(new Date().getTime().toString());
    },
  },
});
module.exports = schema;
