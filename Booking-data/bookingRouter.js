const express = require("express");
const auth = require("../Users/middleware/authentication");
const isAdmin = require("../Users/middleware/adminAuthentication")
const Booking = require("./bookingModel");
const router = express.Router();

router.post("/bus/book", auth, async (req, res) => {
  const bookBus = new Booking({
    ...req.body, 
    userId: req.user._id
  });

  if(req.body.seatNumbers === Booking.seatNumbers){
    res.send('This seat is already booked')
  }
  try {
    await bookBus.save();
    return !bookBus
      ? res.status(400).send("Please enter the required data")
      : res.status(201).send(bookBus);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/bus/myBookings', auth, async(req, res) => {
  const bookings = await Booking.find({ userId: req.user._id})

  if(req.user.admin){
    const bookings = await Booking.find()
    return res.status(200).send(bookings)
  }

   try {
     return res.status(200).send(bookings)
   } catch (e) {
     res.status(500).send(e);  
}})

router.get("/bus/myBooking/one/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const myBooking = await Booking.findOne({ _id, userId: req.user._id})
    .populate({
      path: "routeId",
      select: "-_id -createdAt -updatedAt -__v -seats -route"})
    .select(["-_id","-userId","-createdAt","-updatedAt","-__v","-passengers._id","-departureDetails._id","-arrivalDetails._id"]);
    
  try {
    return !myBooking
      ? res.status(404).send("No booking found")
      : res.status(200).send(myBooking);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/bus/updateMyBooking/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "passengers",
    "busId",
    "routeId",
    "phone",
    "email",
    "fare",
    "seats",
    "departureDetails",
    "arrivalDetails",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const myBooking = await Booking.findById(_id);
    updates.forEach((update) => (myBooking[update] = req.body[update]));
    await myBooking.save();
    return !myBooking ? res.status(404).send() : res.send(myBooking);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/bus/cancelBooking/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const myBooking = await Booking.deleteOne({ _id });
  try {
    return !myBooking
      ? res.status(404).send
      : res.status(200).send("Your booking is deleted");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
