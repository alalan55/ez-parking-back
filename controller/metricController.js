import { ResponseHandler } from "../helpers/helpers.js";
import MetricService from "../services/MetricService.js";

const metricService = new MetricService();

class MetricController {
  async getAverageDailyStay(req, res) {
    try {
      const orgId = req.params.orgId;

      const averageStay = await metricService.getAverageDailyStay(orgId);

      return res
        .status(200)
        .send(ResponseHandler("Average daily stay retrieved", averageStay));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(
          ResponseHandler(
            error.message || "Fail to retrieve average daily stay"
          )
        );
    }
  }
}

export default MetricController;
