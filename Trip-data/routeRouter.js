const Route = require("./routeModel");
const express = require("express");
const auth = require("../Users/middleware/authentication");
const isAdmin = require("../Users/middleware/adminAuthentication")
const router = express.Router();
const app = express();
const Booking = require("../Booking-data/bookingModel");
app.use(express.json());

router.post("/trip/add", auth, isAdmin, async (req, res) => {
  const route = new Route(req.body);

  if(req.body.Location.from === req.body.Location.to){
    return res.status(405).json(`From-Location and To-Location must be different`)
  }

  try {
    await route.save();
    res.status(201).send(route);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/trips", async (req, res) => {
  if (!req.query.from || !req.query.to || !req.query.date) {
    return res.send({
      error: "Please enter the data to get the trip",
    });
  }
  const { from, to, date } = req.query;

  const routes = await Route.find({
    "Location.from": from,
    "Location.to": to,
    date,
  });
  return !routes ? res.status(500).send() : res.status(200).send(routes);
});

router.get("/trip/single", async (req, res) => {
  if (!req.query.from || !req.query.to || !req.query.date) {
    return res.send({
      error: "Please enter the data to get the trip",
    });
  }
  const { from, to, date, busId } = req.query;

  const routes = await Route.find({
    "Location.from": from,
    "Location.to": to,
    busId,
    date: date.toString(),
  });

  const matchedBus = await routes.filter(() => {
    return Route.busId === routes._id;
  });

  const bookings = await Booking.find({
    routeId: { $in: matchedBus.map((matchedBus) => matchedBus._id) },
  });
  const busIdWithSeatsObj = {};

  for (let i = 0; i < matchedBus.length; i++) {
    const currentBusSeats = [];

    bookings.forEach((booking) => {
      currentBusSeats.push(...booking.seatNumbers);
    });

    busIdWithSeatsObj[matchedBus[i].busId] = currentBusSeats;
  }
  return !routes || !matchedBus ||!busIdWithSeatsObj ? res.status(400).send() :res.status(200).send({ routes, matchedBus, busIdWithSeatsObj });
  
});

router.patch("/trip/update/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [ "Location","busId","date","departureTime","arrivalTime" ];

  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const route = await Route.findOne({ _id });

    updates.forEach((update) => (route[update] = req.body[update]));
    await route.save();
    return !route ? res.status(400).send() : res.status(200).send(route);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/trip/remove/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const route = await Route.findOneAndDelete({ _id });

  try {
    return !route
      ? res.status(404).json({ Error: "No route found" })
      : res.status(200).send("Route details deleted");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
