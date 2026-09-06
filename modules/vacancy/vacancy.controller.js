import { ResponseHandler } from "../../helpers/helpers.js";
import makeVacancyService from "./vacancy.factory.js";

const vacancyService = makeVacancyService();

class VacancyController {
  async getDashboard(req, res) {
    const data = await vacancyService.getDashboard(req.params.id, req.query);
    res
      .status(200)
      .send(ResponseHandler("Vacancies retrieved successfully", data));
  }
}

export default VacancyController;
