import express from "express";
import VacancyController from "../controller/vacancyController.js";

const router = express.Router();
const controller = new VacancyController();

router.get("/dash/:id", (req, res) =>
  controller.getVacanciesDashboard(req, res)
);

export default router;
