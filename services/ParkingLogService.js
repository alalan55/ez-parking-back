import { ParkingLogModel, OrganizationModel } from "../models/index.js";

export default class ParkingLogService {
  async createLog(payload) {
    try {
      const log = await ParkingLogModel.create({
        VacancyId: payload.vacancyId,
        OrganizationId: payload.organizationId,
        CollaboratorId: payload.collaboratorId,
        VehicleId: payload.vehicleId,
        // entryTime: payload.entryTime,
        // exitTime: payload.exitTime
      });
      return log;
    } catch (error) {
      throw new Error("Error adding parking log: " + error.message);
    }
  }
}
