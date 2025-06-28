import express from "express";

import ParkingLogController from "../controller/parkingLogController.js";
import OrganizationControler from "../controller/organizationController.js";
import VacancyController from "../controller/vacancyController.js";

const router = express.Router();

const parkingLogController = new ParkingLogController();
const organizationController = new OrganizationControler();
const vacancyController = new VacancyController();

// router.get("/vacancies-by-organization/:id", (req, res) =>
//   parkingLogController.getVacancyLogsByOrgatnization(req, res)
// );

router.get("/vacancies-by-organization/:id", (req, res) =>
  vacancyController.getVacanciesDashboard(req, res)
);

router.get("/logs-by-organization/:id", (req, res) =>
  parkingLogController.getLogsByOganization(req, res)
);

router.post("/checkin", (req, res) => parkingLogController.checkin(req, res));

router.post("/checkout/:id", (req, res) =>
  parkingLogController.checkout(req, res)
);

router.get("/organization-occupancy/:id", (req, res) =>
  organizationController.getOccupation(req, res)
);

export default router;
