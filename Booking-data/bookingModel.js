const { default: mongoose } = require("mongoose");

require("../Users/db/mongoose");

const bookingSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    passengers: [
      {
        name: { type: String, required: true, trim: true },
        gender: { type: String, required: true, trim: true },
        age: { type: Number, required: true, trim: true },
      },
    ],
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    seatNumbers: {
      type: [Number],
      required: true,
    },
    departureDetails: [
      {
        city: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        date: { type: Date, required: true, trim: true },
      },
    ],
    arrivalDetails: [
      {
        city: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        date: { type: Date, required: true, trim: true },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
