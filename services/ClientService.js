import { ClientModel, Vehicle } from "../models/index.js";
import VehicleService from "./vehicleService.js";

const vehicleService = new VehicleService();

class ClientService {
  async create(payload) {
    try {
      const { name, phone } = payload;
      const newUser = await ClientModel.create({
        name,
        phone,
      });

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
        });
      }

      const newUser = await this.create({
        name: payload.name,
        phone: payload.phone,
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

  async delete(id) {
    try {
      const user = await ClientModel.findOne({ where: { id } });
      if (!user) throw new Error("User not found");

      await user.destroy();
    } catch (error) {
      throw error;
    }
  }

  async addVehicle(payload) {
    try {
      const user = await ClientModel.findOne({ where: { id: payload.userId } });

      if (!user) throw new Error("User not found");

      let vehicle = await vehicleService.getByPlate(payload.plate);

      if (!vehicle) {
        vehicle = await vehicleService.createVehicle({
          plate: payload.plate,
          mark: payload.mark,
          model: payload.model,
          year: payload.year,
          color: payload.color,
          type: payload.type,
        });
      }

      await user.addVehicle(vehicle);

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
