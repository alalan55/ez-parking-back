import { ClientModel } from "../models/index.js";
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
      return new Error(error);
    }
  }
}

export default ClientService;
