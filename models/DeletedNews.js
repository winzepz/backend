const mongoose = require("mongoose");

const deletedNewsSchema = new mongoose.Schema({
  newsId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tags: [{ type: String }],
  image: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "published", "rejected"],
    default: "pending",
  },
  isDraft: { type: Boolean, default: false },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("DeletedNews", deletedNewsSchema);
