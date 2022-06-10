const express = require("express");
const Bus = require("./busModel");
const auth = require("../Users/middleware/authentication");
const isAdmin = require("../Users/middleware/adminAuthentication")

const router = new express.Router();

router.get("/bus",auth, isAdmin, async (req, res) => {
  const bus = await Bus.find();
  try {
     return res.status(200).send(bus)
    }
     catch (e) {
    res.status(500).send();
  }
});

router.get("/bus/one/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const bus = await Bus.findOne({ _id });

  try {
    return !bus
      ? res.status(404).send("No bus found")
      : res.status(200).send(bus);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/bus/add", auth, isAdmin, async (req, res) => {
  const bus = new Bus(req.body);
  try {
      await bus.save();
      res.status(201).send(bus);
  } catch (e) {
    res.status(500).json({
      message: "Please enter the valid data",
    });
  }
});

router.patch("/bus/update/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["seats", "busNumber"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const bus = await Bus.findOne({ _id });

    updates.forEach((update) => (bus[update] = req.body[update]));
    await bus.save();
    return !bus ? res.status(400).send() : res.status(200).send(bus);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/bus/remove/:id", auth, isAdmin, async (req, res) => {
  const _id = req.params.id;
  const bus = await Bus.findOneAndDelete({ _id });

  try {
    return !bus
      ? res.status(404).json({ Error: "No bus found with this number" })
      : res.status(200).send("Bus details deleted");
  } catch (e) {
    res.status(500).send("No bus found with this number");
  }
});

module.exports = router;
