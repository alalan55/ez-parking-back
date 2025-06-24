import { VacancyModel, Vehicle, ParkingLogModel } from "../models/index.js";
import OrganizationService from "./OrganizationService.js";

const organizationService = new OrganizationService();

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class VacancyService {
  async createVacancy(organizationId) {
    try {
      const vacancy = await VacancyModel.create({
        OrganizationId: organizationId,
      });

      return vacancy;
    } catch (error) {
      throw new Error("Error creating vacancy: " + error.message);
    }
  }

  async updateVacancy(vacancyId, payload) {
    try {
      const vacancy = await VacancyModel.findOne({ where: { id: vacancyId } });

      if (!vacancy) throw new Error("Vacancy not found");

      Object.assign(vacancy, payload);

      await vacancy.save();

      if (payload.vehicleId) {
        const vehicle = await Vehicle.findOne({
          where: { id: payload.vehicleId },
        });

        if (!vehicle) throw new Error("Vehicle not found");

        await vacancy.setVehicle(vehicle);
      } else await vacancy.setVehicle(null);

      return vacancy;
    } catch (error) {
      throw new Error("Error updating vacancy: " + error.message);
    }
  }

  async getVacancyById(vacancyId) {
    try {
      const vacancy = await VacancyModel.findOne({
        where: { id: vacancyId },
      });

      if (!vacancy) throw new Error("Vacancy not found");

      return vacancy;
    } catch (error) {
      throw new Error("Error fetching vacancy: " + error.message);
    }
  }

  async getVacanciesDashboard(organizationId) {
    try {
      const org = await organizationService.findById(organizationId);
      if (!org) throw new HttpError("Organization not found", 404);

      const vacancies = await VacancyModel.findAll({
        where: { OrganizationId: organizationId },
        include: [
          {
            model: Vehicle,
           // as: "Vehicle",
          },
          {
            model: ParkingLogModel,
            as: "activeVacancyLog",
          },
        ],
      });

      return vacancies;
    } catch (error) {
      throw error;
    }
  }
}

export default VacancyService;
