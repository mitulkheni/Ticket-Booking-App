const express = require("express");
const router = express.Router()
const auth = require("../Users/middleware/authentication");
const isAdmin = require("../Users/middleware/adminAuthentication")

const Location = require("./locationModel");

router.post("/location/add", auth, isAdmin, async (req, res) => {
  const location = new Location(req.body);
  try {
    await location.save();
    res.status(201).send(location);
  } catch (e) {
    res.status(500).json();
  }
});

router.get("/locations/available", auth, isAdmin, async (req, res) => {
  const location = await Location.find({});
  try {
    return !location ? res.status(404).send() : res.status(200).send(location);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/location/update/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['location'];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const location = await Location.findOne({ _id });

    updates.forEach((update) => (location[update] = req.body[update]));
    await location.save();
    return !location ? res.status(400).send() : res.status(200).send(location);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/location/remove/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const location = await Location.findOneAndDelete({ _id });

  try {
    return !location ? res.status(404).json({ Error: "No location data found" }) : res.status(200).send("Location details deleted");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
