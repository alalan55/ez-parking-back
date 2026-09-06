import express from "express";
import VehicleController from "./vehicle.controller.js";
import { ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new VehicleController();

router.get("/get-all-by-client/:id/:organizationId", ownOrganizationOnly("organizationId"), (req, res) =>
  controller.getAllVehiclesFromClient(req, res)
);

router.get("/clients-based-on-vehicle/:plate", (req, res) =>
  controller.getClientsBasedOnVehicle(req, res)
);

router.delete("/:id", (req, res) => controller.delete(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.getAll(req, res));

export default router;
