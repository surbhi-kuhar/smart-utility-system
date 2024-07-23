const mongoose = require("mongoose");

const RatingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service_provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service_Provider",
      required: true,
    },
    review: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RatingSchema);
module.exports = Rating;
