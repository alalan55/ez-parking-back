import express from "express";
import VehicleController from "../controller/vehicleController.js";

const router = express.Router();
const vehicleController = new VehicleController();

router.post("/", (req, res) => vehicleController.create(req, res));
router.get("/", (req, res) => vehicleController.getAll(req, res));
router.get("/:id", (req, res) => vehicleController.getById(req, res));
router.put("/:id", (req, res) => vehicleController.update(req, res));
router.delete("/:id", (req, res) => vehicleController.delete(req, res));

export default router;
