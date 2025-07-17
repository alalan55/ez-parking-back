import VacancyService from "../services/VacancyService.js";
import { ResponseHandler } from "../helpers/helpers.js";

const vacancyService = new VacancyService();

export default class VacancyController {
  async getVacanciesDashboard(req, res) {
    try {
      const vacancies = await vacancyService.getVacanciesDashboard(
        req.params.id,
        req.query
      );
      res
        .status(200)
        .send(ResponseHandler("Vacancies retrieved successfully", vacancies));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Failed to retrieve vacancies"));
    }
  }
}
