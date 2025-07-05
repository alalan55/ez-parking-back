import { z } from "zod";

import { ResponseHandler, ErrorValidationHandler } from "../helpers/helpers.js";
import ParkingLogService from "../services/ParkingLogService.js";

const parkingLogService = new ParkingLogService();

const checkinSchema = z.object({
  collaboratorId: z.number().min(0, "Collaborator ID is required"),
  organizationId: z.string().min(0, "Collaborator ID is required"),
  vehiclePlate: z.string().min(1, "Vehicle plate is required"),
});

export default class ParkingLogController {
  async getVacancyLogsByOrgatnization(req, res) {
    try {
      const logs = await parkingLogService.getVacancyLogsByOrgatnization(
        req.params.id
      );
      res.status(200).send(ResponseHandler("Logs retrieved", logs));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to retrieve logs"));
    }
  }
  async getLogsByOganization(req, res) {
    try {
      const logs = await parkingLogService.getLogsByOganization(req.params.id);
      res.status(200).send(ResponseHandler("Logs retrieved", logs));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to retrieve logs"));
    }
  }

  async checkin(req, res) {
    try {
      const validated = checkinSchema.safeParse(req.body);
      
      if (!validated.success) {
        const err = ErrorValidationHandler(validated);
        return res.status(err.status).send(ResponseHandler(err.errors));
      }

      const checkin = await parkingLogService.checkin(req.body);
      res.status(200).send(ResponseHandler("Check-in successful", checkin));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to check-in"));
    }
  }

  async checkout(req, res) {
    try {
      const checkout = await parkingLogService.checkout(req.body);
      res.status(200).send(ResponseHandler("Check-out successful", checkout));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to check-out"));
    }
  }
}
