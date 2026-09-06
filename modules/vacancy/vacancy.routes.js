import express from "express";
import VacancyController from "./vacancy.controller.js";
import { ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new VacancyController();

router.get("/dash/:id", ownOrganizationOnly("id"), (req, res) => controller.getDashboard(req, res));

export default router;
