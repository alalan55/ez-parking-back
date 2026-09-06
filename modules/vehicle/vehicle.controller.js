import { ResponseHandler } from "../../helpers/helpers.js";
import AppError from "../../shared/errors/appError.js";
import { createVehicleSchema, updateVehicleSchema } from "./vehicle.schema.js";
import makeVehicleService from "./vehicle.factory.js";

const vehicleService = makeVehicleService();

class VehicleController {
  async getAll(req, res) {
    const vehicles = await vehicleService.getAll();
    res.status(200).send(ResponseHandler("Vehicle list retrieved", vehicles));
  }

  async getById(req, res) {
    const vehicle = await vehicleService.getById(req.params.id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    res.status(200).send(ResponseHandler("Vehicle retrieved", vehicle));
  }

  async create(req, res) {
    const validated = createVehicleSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const vehicle = await vehicleService.create(req.body);
    res.status(201).send(ResponseHandler("Vehicle created", vehicle));
  }

  async update(req, res) {
    const validated = updateVehicleSchema.safeParse({
      ...req.body,
      id: +req.params.id,
    });
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const vehicle = await vehicleService.update(validated.data);
    res.status(200).send(ResponseHandler("Vehicle updated", vehicle));
  }

  async delete(req, res) {
    await vehicleService.delete(+req.params.id);
    res.status(200).send(ResponseHandler("Vehicle removed successfully"));
  }

  async getAllVehiclesFromClient(req, res) {
    const vehicles = await vehicleService.getAllVehiclesFromClient(
      req.params.id,
      req.params.organizationId
    );
    res.status(200).send(ResponseHandler("Vehicles retrieved from client", vehicles));
  }

  async getClientsBasedOnVehicle(req, res) {
    const clients = await vehicleService.getClientsBasedOnVehicle(req.params.plate);
    res.status(200).send(ResponseHandler("Clients retrieved", clients));
  }
}

export default VehicleController;
