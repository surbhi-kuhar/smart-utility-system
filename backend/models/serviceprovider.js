const mongoose = require("mongoose");

const ServiceProviderSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    mobilenumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    availabilitystatus: {
      type: String,
      default: "available",
    },
  },
  { timestamps: true }
);

const Service_Provider = mongoose.model(
  "Service_Provider",
  ServiceProviderSchema
);
module.exports = Service_Provider;
