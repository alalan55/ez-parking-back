import express from "express";
import ParkingLogController from "./parkingLog.controller.js";
import { ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new ParkingLogController();

router.get("/vacancies/:id", ownOrganizationOnly("id"), (req, res) =>
  controller.getVacancyLogsByOrganization(req, res)
);
router.get("/:id", ownOrganizationOnly("id"), (req, res) => controller.getLogsByOganization(req, res));
router.post("/checkin", (req, res) => controller.checkin(req, res));
router.post("/checkout", (req, res) => controller.checkout(req, res));

export default router;
