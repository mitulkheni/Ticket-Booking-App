const { default: mongoose } = require("mongoose");

require("../Users/db/mongoose");

const routeSchema = new mongoose.Schema(
  {
    Location: {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    arrivalTime: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Route = new mongoose.model("Route", routeSchema);
module.exports = Route;
