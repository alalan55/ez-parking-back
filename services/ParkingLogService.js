import {
  ParkingLogModel,
  OrganizationModel,
  CollaboratorModel,
  Vehicle,
  VacancyModel,
} from "../models/index.js";

import VacancyService from "./VacancyService.js";
import VehicleService from "./VehicleService.js";

const vacancyService = new VacancyService();
const vehicleService = new VehicleService();

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default class ParkingLogService {
  async createLog(payload) {
    try {
      const log = await ParkingLogModel.create({
        vacancyId: payload.vacancyId,
        organizationId: payload.organizationId,
        collaboratorId: payload.collaboratorId,
        vehicleId: payload.vehicleId,
        // entryTime: payload.entryTime,
        // exitTime: payload.exitTime
      });
      return log;
    } catch (error) {
      throw new Error("Error adding parking log: " + error.message);
    }
  }

  async getVacancyLogsByOrgatnization(organizationId) {
    try {
      const org = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!org) throw new Error("Organization not found");

      const vacancies = await VacancyModel.findAll({
        where: { OrganizationId: organizationId },
        include: [
          {
            model: ParkingLogModel,
            as: "ParkingLogs",
            include: [
              { model: OrganizationModel, as: "Organization" },
              { model: CollaboratorModel, as: "Collaborator" },
              { model: Vehicle, as: "Vehicle" },
            ],
          },
        ],
      });

      // const mapped = vacancies.map((vacancy) => {
      //   vacancy.log = vacancy.ParkingLogs.filter(
      //     (log) => log.id === vacancy.ParkingLogId
      //   );
      //   console.log("Vacancy log:", vacancy.log);

      //   return vacancies;
      // });

      return vacancies;
    } catch (error) {
      throw error;
    }
  }

  async getLogsByOganization(organizationId) {
    try {
      const org = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!org) throw new Error("Organization not found");

      const logs = await ParkingLogModel.findAll({
        where: { OrganizationId: organizationId },
        include: [
          { model: OrganizationModel, as: "organization" },
          { model: CollaboratorModel, as: "collaborator" },
          { model: Vehicle, as: "vehicle" },
          { model: VacancyModel, as: "vacancy" },
        ],
      });

      return logs;
    } catch (error) {
      throw error;
    }
  }

  async checkin(payload) {
    try {
      const { collaboratorId, organizationId, vehiclePlate } = payload;

      const organization = await OrganizationModel.findByPk(organizationId);
      if (!organization) throw new HttpError("Organization not found", 404);

      const collaborator = await CollaboratorModel.findOne({
        where: { id: collaboratorId, organizationId },
      });

      if (!collaborator)
        throw new HttpError("Collaborator not found in this organization", 404);

      let vehicle = await vehicleService.getByPlate(vehiclePlate);

      if (!vehicle) {
        vehicle = await vehicleService.createVehicle({
          plate: vehiclePlate,
          mark: payload.vehicleMark,
          model: payload.vehicleModel,
          year: payload.vehicleYear,
          color: payload.vehicleColor,
          type: payload.vehicleType,
          organizationId,
        });
      }

      const alreadyParked = await VacancyModel.findOne({
        where: { vehicleId: vehicle.id, status: 1 },
      });

      if (alreadyParked) throw new HttpError("Vehicle already parked", 400);

      const totalVacancies = await VacancyModel.count({
        where: { organizationId },
      });

      const availableVacancy = await VacancyModel.findOne({
        where: { organizationId, status: 0 },
      });

      const vacanciesReach = organization.vacanciesQuantity;

      const canCreateNewVacancy =
        !availableVacancy && totalVacancies < vacanciesReach;

      const noVacanciesAvailable =
        !availableVacancy && totalVacancies >= vacanciesReach;

      const occupyVacancy = async (vaga) => {
        const updatedVacancy = await vacancyService.updateVacancy(vaga.id, {
          status: 1,
          vehicleId: vehicle.id,
        });

        const log = await this.createLog({
          collaboratorId,
          organizationId,
          vehicleId: vehicle.id,
          vacancyId: updatedVacancy.id,
        });

        await vacancyService.updateVacancy(vaga.id, {
          status: 1,
          vehicleId: vehicle.id,
          parkingLogId: log.id,
        });

        return log;
      };

      if (noVacanciesAvailable)
        throw new HttpError("No available vacancies", 400);

      if (canCreateNewVacancy) {
        const novaVaga = await vacancyService.createVacancy(organizationId);
        return await occupyVacancy(novaVaga);
      }

      // Se há vaga disponível, ocupar
      return await occupyVacancy(availableVacancy);
    } catch (error) {
      throw error;
    }
  }

  async checkout(payload) {
    try {
      const log = await ParkingLogModel.findOne({
        where: { id: payload.logId },
      });

      if (!log) throw new HttpError("Parking log not found", 404);

      const vacancy = await vacancyService.getVacancyById(log.vacancyId);

      if (!vacancy) throw new HttpError("Vacancy not found", 404);

      if (vacancy.status === 1) {
        await vacancyService.updateVacancy(vacancy.id, {
          status: 0,
          vehicleId: null,
          parkingLogId: null,
          organizationId: vacancy.organizationId,
        });
      }

      await log.update({ updatedAt: new Date() });

      return log;
    } catch (error) {
      throw error;
    }
  }
}
