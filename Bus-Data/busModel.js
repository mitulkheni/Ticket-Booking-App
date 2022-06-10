const { default: mongoose } = require("mongoose");

require("../Users/db/mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      unique: true,
      required: true,
    },
    seats: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Bus = new mongoose.model("Bus", busSchema);

module.exports = Bus;
