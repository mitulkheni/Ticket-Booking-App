const { default: mongoose } = require("mongoose");
var schema = mongoose.Schema;

require("../Users/db/mongoose");

const locationSchema = new mongoose.Schema(
  {
    location: {
      name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
      },
      subLocation: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Location = new mongoose.model("Location", locationSchema);
module.exports = Location;
