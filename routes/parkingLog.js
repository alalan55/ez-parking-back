import express from "express";
import ParkingLogController from "../controller/parkingLogController.js";

const router = express.Router();
const controller = new ParkingLogController();

router.get("/:id", (req, res) => controller.getLogsByOganization(req, res));
router.post("/checkin", (req, res) => controller.checkin(req, res));
router.post("/checkout/:id", (req, res) => controller.checkout(req, res));

export default router;
