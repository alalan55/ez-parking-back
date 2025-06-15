import {
  CollaboratorModel,
  OrganizationModel,
  VacancyModel,
} from "../models/index.js";

import VacancyService from "./VacancyService.js";
import VehicleService from "./VehicleService.js";
import ParkingLogService from "./ParkingLogService.js";

const vacancyService = new VacancyService();
const vehicleService = new VehicleService();
const parkingLogService = new ParkingLogService();
class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class CollaboratorService {
  async getAll() {
    try {
      const collaborators = await CollaboratorModel.findAll();
      return collaborators;
    } catch (error) {
      throw new Error("Error on fetch all collaborators");
    }
  }

  async getByCompany(organizationId) {
    try {
      const org = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!org) throw new Error("Organization not found");

      const collaborators = await CollaboratorModel.findAll({
        where: { organizationId },
      });

      return collaborators;
    } catch (error) {
      throw error;
    }
  }

  async createCollaborator(payload) {
    try {
      const { name, email, hashPassword, photo, role, organizationId } =
        payload;

      const collaborator = await CollaboratorModel.create({
        name,
        email,
        hashPassword,
        photo,
        role,
        organizationId,
      });

      return collaborator;
    } catch (error) {
      throw error;
    }
  }

  async createCollaboratorWithOrganization(payload) {
    try {
      const { organizationId } = payload;

      const org = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!org) throw new HttpError("Organization not found", 404);

      const collaborator = await this.createCollaborator(payload);

      await org.addCollaborator(collaborator);

      return collaborator;
    } catch (error) {
      throw error;
    }
  }

  async update(payload, userId) {
    try {
      const { name, email, hashPassword, photo, role } = payload;

      const collaborator = await CollaboratorModel.findOne({
        where: { id: userId },
      });

      if (!collaborator) throw new HttpError("Collaborator not found", 404);

      collaborator.name = name;
      collaborator.email = email;
      collaborator.hashPassword = hashPassword;
      collaborator.photo = photo;
      collaborator.role = role;

      await collaborator.save();

      return collaborator;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const collaborator = await CollaboratorModel.findOne({ where: { id } });

      if (!collaborator) throw new HttpError("Collaborator not found", 404);

      await collaborator.destroy();
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

        return parkingLogService.createLog({
          collaboratorId,
          organizationId,
          vehicleId: vehicle.id,
          vacancyId: updatedVacancy.id,
        });
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
}

export default CollaboratorService;
