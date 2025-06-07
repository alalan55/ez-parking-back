import express from "express";

import { vehicle_list } from "../mock.js";

const all_data = [...vehicle_list];

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Vehicle list", content: all_data });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const vehicle = all_data.find((v) => v.id === +id);

  if (!vehicle)
    return res
      .status(404)
      .send({ message: "Vehicle not found", content: null });

  res.send({ message: "Vehicle found", content: vehicle });
});

router.post("/", (req, res) => {
  const { plate, mark, model, year, color, type } = req.body;

  if (!plate || !mark || !model || !year || !color || type === undefined) {
    return res
      .status(400)
      .send({ message: "All fields are required", content: null });
  }

  const vehicleRegisted = all_data.find((v) => v.plate === plate);

  if (vehicleRegisted) {
    return res
      .status(400)
      .send({ message: "Vehicle alrady registered:", content: null });
  }

  const newVehicle = { ...req.body, id: all_data.length + 1 };

  all_data.push(newVehicle);

  return res
    .status(201)
    .send({ message: "Vehicle created", content: newVehicle });
});

router.put("/:id", (req, res) => {
  const vehicleId = req.params.id;

  const index = all_data.findIndex((v) => v.id === +vehicleId);

  if (index < 0)
    return res
      .status(404)
      .send({ message: "Vehicle not found", content: null });

  all_data[index] = req.body;

  return res
    .status(200)
    .send({ message: "Vehicle updated", content: req.body });
});

router.delete("/:id", (req, res) => {
  const id = +req.params.id;

  const vehicleIndex = all_data.findIndex((v) => v.id === id);

  if (vehicleIndex < 0) {
    return res
      .status(404)
      .send({ message: "Vehicle not found", content: null });
  }

  all_data.splice(vehicleIndex, 1);

  return res.status(200).send({ message: "Vehicle removed", content: null });
});

export default router;
