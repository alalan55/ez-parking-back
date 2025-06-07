import express from "express";
import ClientController from "../controller/clientController.js";

const router = express.Router();
const controller = new ClientController();

router.post("/", (req, res) => controller.create(req, res));

router.post("/with-vehicle", (req, res) =>
  controller.createWithVehicle(req, res)
);

export default router;
