import { checkinSchema, checkoutSchema } from "./parkingLog.schema.js";
import { ResponseHandler } from "../../helpers/helpers.js";
import AppError from "../../shared/errors/appError.js";
import makeParkingLogService from "./parkingLog.factory.js";

const parkingLogService = makeParkingLogService();

class ParkingLogController {
  async getLogsByOganization(req, res) {
    const logs = await parkingLogService.getLogsByOganization(req.params.id);
    res.status(200).send(ResponseHandler("Logs retrieved", logs));
  }

  async getVacancyLogsByOrganization(req, res) {
    const vacancies = await parkingLogService.getVacancyLogsByOrganization(
      req.params.id
    );
    res.status(200).send(ResponseHandler("Vacancy logs retrieved", vacancies));
  }

  async checkin(req, res) {
    req.body.organizationId = req.auth.organizationId;
    req.body.collaboratorId = req.auth.collaboratorId;

    const validated = checkinSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const log = await parkingLogService.checkin(req.body);
    res.status(200).send(ResponseHandler("Check-in successful", log));
  }

  async checkout(req, res) {
    const validated = checkoutSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const log = await parkingLogService.checkout(req.body);
    res.status(200).send(ResponseHandler("Check-out successful", log));
  }
}

export default ParkingLogController;
