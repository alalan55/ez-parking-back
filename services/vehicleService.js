import { Op } from "sequelize";

import { Vehicle, OrganizationModel, ClientModel } from "../models/index.js";
import OrganizationService from "./OrganizationService.js";

const organizationService = new OrganizationService();

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
class VehicleService {
  async getById(id) {
    try {
      const data = await Vehicle.findOne({ where: { id } });
      return data;
    } catch (error) {
      return new Error(error);
    }
  }

  async getByPlate(plate) {
    try {
      const data = await Vehicle.findOne({ where: { plate } });
      return data;
    } catch (error) {
      return new Error(error);
    }
  }

  async getAll() {
    try {
      const list = await Vehicle.findAll();
      return list;
    } catch (error) {
      return new Error(error);
    }
  }

  async createVehicle(infos) {
    try {
      const organization = await organizationService.findById(
        infos.organizationId
      );

      if (!organization)
        throw new Error("Organization not found to add vehicle");

      const existingVehivle = await Vehicle.findOne({
        where: {
          plate: {
            [Op.like]: `%${infos.plate}%`,
          },
        },
      });

      if (existingVehivle) {
        await exxistingVehivle.addOrganizations(organization);
        return existingVehivle;
      }

      const newVehicle = await Vehicle.create({
        plate: infos.plate.toUpperCase(),
        mark: infos.mark,
        model: infos.model,
        year: infos.year,
        color: infos.color,
        type: infos.type,
      });

      await newVehicle.addOrganizations(organization);

      return newVehicle;
    } catch (error) {
      return new Error(error);
    }
  }

  async update(infos) {
    try {
      const data = await Vehicle.findOne({ where: { id: infos.id } });

      const { plate, mark, model, year, color, type } = infos;

      data.plate = plate;
      data.mark = mark;
      data.model = model;
      data.year = year;
      data.color = color;
      data.type = type;

      await data.save();
      return data;
    } catch (error) {
      return new Error(error);
    }
  }

  async delete(id) {
    try {
      await Vehicle.destroy({ where: { id } });
    } catch (error) {
      return new Error(error);
    }
  }

  async getAllVehiclesFromClient(id, organizationId) {
    try {
      const organization = await organizationService.findById(organizationId);

      if (!organization) throw new HttpError("Organization not found", 404);

      const vehicles = await Vehicle.findAll({
        include: [
          {
            model: OrganizationModel,
            where: { id: organizationId },
            attributes: [],
            through: { attributes: [] },
          },
          {
            model: ClientModel,
            where: { id },
            attributes: [],
            through: { attributes: [] },
          },
        ],
      });

      return vehicles;
    } catch (error) {
      return new Error(error);
    }
  }
}

export default VehicleService;
