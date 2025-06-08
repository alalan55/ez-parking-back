import express from "express";
import ClientController from "../controller/clientController.js";

const router = express.Router();
const controller = new ClientController();

router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.getAllUsers(req, res));
router.put("/", (req, res) => controller.update(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.post("/with-vehicle", (req, res) =>
  controller.createWithVehicle(req, res)
);
router.post("/add-vehicle", (req, res) => controller.addVehicle(req, res));
router.post("/remove-vehicle", (req, res) =>
  controller.removeVehicle(req, res)
);

export default router;
