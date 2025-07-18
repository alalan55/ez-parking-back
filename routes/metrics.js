import express from "express";
import MetricController from "../controller/metricController.js";

const router = express.Router();
const metricController = new MetricController();

router.get("/average-daily-stay/:orgId", (req, res) =>
  metricController.getAverageDailyStay(req, res)
);

router.get("/vacancy-usage-graph/:orgId", (req, res) =>
  metricController.getVacancyUsageGraph(req, res)
);

export default router;
