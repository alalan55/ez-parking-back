import { Op } from "sequelize";

import { ClientModel, Vehicle, OrganizationModel } from "../models/index.js";
import VehicleService from "./vehicleService.js";
import OrganizationService from "./OrganizationService.js";

const vehicleService = new VehicleService();
const organizationService = new OrganizationService();

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ClientService {
  async create(payload) {
    const organizationService = new OrganizationService();

    try {
      const { name, phone, organizationId } = payload;

      const newUser = await ClientModel.create({
        name,
        phone,
      });

      const organization = await organizationService.findById(organizationId);

      if (organization) await newUser.addOrganization(organization);

      return newUser;
    } catch (error) {
      return new Error(error);
    }
  }

  async createWithVehicle(payload) {
    try {
      let foundedVehicle = await vehicleService.getByPlate(payload.plate);

      if (!foundedVehicle) {
        foundedVehicle = await vehicleService.createVehicle({
          plate: payload.plate,
          mark: payload.mark,
          model: payload.model,
          year: payload.year,
          color: payload.color,
          type: payload.type,
          organizationId: payload.organizationId,
        });
      }

      const newUser = await this.create({
        name: payload.name,
        phone: payload.phone,
        organizationId: payload.organizationId,
      });

      await newUser.addVehicle(foundedVehicle);

      return { user: newUser, vehicle: foundedVehicle };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(payload) {
    try {
      const user = await ClientModel.findOne({ where: { id: payload.id } });

      if (!user) throw new Error("User not found");

      user.name = payload.name;
      user.phone = payload.phone;

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const user = await ClientModel.findOne({
        where: { id },
        include: Vehicle,
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await ClientModel.findAll();
      return users;
    } catch (error) {
      throw new Error("Error retrieving users");
    }
  }

  async getAllClientsByOrganization(organizationId, querys) {
    try {
      const { name } = querys || {};

      const organization = await organizationService.findById(organizationId);

      if (!organization) throw new HttpError("Organization not found", 404);

      const clientInclude = {};

      if (name) {
        clientInclude.where = {
          name: {
            [Op.like]: `%${name}%`,
          },
        };
      }

      const clients = await ClientModel.findAll({
        where: clientInclude.where || {},
        include: [
          {
            model: OrganizationModel,
            where: { id: organizationId },
            attributes: [], // Não retorna dados do organization
            through: { attributes: [] }, // Não retorna dados da tabela intermediária
          },
        ],
      });

      return clients;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const user = await ClientModel.findOne({ where: { id } });
      if (!user) throw new Error("User not found");

      await user.destroy();
    } catch (error) {
      throw error;
    }
  }

  async deleteFromOrganization(organizationId, userId) {
    try {
      const organization = await organizationService.findById(organizationId);
      if (!organization) throw new HttpError("Organization not found", 404);

      const user = await ClientModel.findOne({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      await user.removeOrganization(organization);

      await user.destroy();
    } catch (error) {
      throw error;
    }
  }

  async addVehicle(payload) {
    try {
      const vehicleService = new VehicleService();

      const user = await ClientModel.findOne({ where: { id: payload.userId } });

      if (!user) throw new Error("User not found");

      const organization = await organizationService.findById(
        payload.organizationId
      );

      if (!organization) throw new HttpError("Organization not found", 404);

      let vehicle = await vehicleService.getByPlate(payload.plate);

      if (!vehicle) {
        vehicle = await vehicleService.createVehicle({
          plate: payload.plate,
          mark: payload.mark,
          model: payload.model,
          year: payload.year,
          color: payload.color,
          type: payload.type,
          organizationId: payload.organizationId,
        });
      }

      await user.addVehicle(vehicle);
      await vehicle.addOrganizations(organization);

      return { user, vehicle };
    } catch (error) {
      throw error;
    }
  }

  async removeVehicle(payload) {
    try {
      const user = await ClientModel.findOne({ where: { id: payload.userId } });

      if (!user) throw new Error("User not found");

      const vehicle = await Vehicle.findOne({
        where: { id: payload.vehicleId },
      });

      if (!vehicle) throw new Error("Vehicle not found");

      await user.removeVehicle(vehicle);

      return { user, vehicle };
    } catch (error) {
      throw error;
    }
  }
}

export default ClientService;
