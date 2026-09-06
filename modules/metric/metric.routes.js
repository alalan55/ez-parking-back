import express from "express";
import MetricController from "./metric.controller.js";
import { ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new MetricController();

router.get("/average-daily-stay/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getAverageDailyStay(req, res));
router.get("/vacancy-usage-graph/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getVacancyUsageGraph(req, res));
router.get("/revenue-trend/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getRevenueTrend(req, res));
router.get("/checkins-by-hour/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getCheckinsByHour(req, res));
router.get("/occupancy-trend/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getOccupancyTrend(req, res));
router.get("/period-summary/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getPeriodSummary(req, res));

export default router;
