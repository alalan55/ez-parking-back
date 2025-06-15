import e from "express";
import { VacancyModel, Vehicle } from "../models/index.js";

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

      } else {
        await vacancy.setVehicle(null);
        console.log("Vehicle removed from vacancy");
      }

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
}

export default VacancyService;
