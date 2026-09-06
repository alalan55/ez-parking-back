import { ResponseHandler } from "../../helpers/helpers.js";
import makeMetricService from "./metric.factory.js";

const metricService = makeMetricService();

const parseDays = (req, fallback) =>
  req.query.days ? parseInt(req.query.days, 10) : fallback;

class MetricController {
  async getAverageDailyStay(req, res) {
    const data = await metricService.getAverageDailyStay(req.params.orgId, parseDays(req, 1));
    res.status(200).send(ResponseHandler("Average daily stay retrieved", data));
  }

  async getRevenueTrend(req, res) {
    const data = await metricService.getRevenueTrend(req.params.orgId, parseDays(req, 7));
    res.status(200).send(ResponseHandler("Revenue trend retrieved", data));
  }

  async getVacancyUsageGraph(req, res) {
    const data = await metricService.getVacancyUtilizationGraph(req.params.orgId, parseDays(req, 30));
    res.status(200).send(ResponseHandler("Vacancy usage graph retrieved", data));
  }

  async getCheckinsByHour(req, res) {
    const data = await metricService.getCheckinsByHour(req.params.orgId, parseDays(req, 30));
    res.status(200).send(ResponseHandler("Check-ins by hour retrieved", data));
  }

  async getOccupancyTrend(req, res) {
    const data = await metricService.getOccupancyTrend(req.params.orgId, parseDays(req, 7));
    res.status(200).send(ResponseHandler("Occupancy trend retrieved", data));
  }

  async getPeriodSummary(req, res) {
    const data = await metricService.getPeriodSummary(req.params.orgId, parseDays(req, 7));
    res.status(200).send(ResponseHandler("Period summary retrieved", data));
  }
}

export default MetricController;
