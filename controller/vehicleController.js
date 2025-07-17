import { z } from "zod";

import VehicleService from "../services/VehicleService.js";
import { ResponseHandler, ErrorValidationHandler } from "../helpers/helpers.js";

const vehicleService = new VehicleService();

const updateVehicleSchema = z.object({
  id: z.number().min(1, "ID is required"),
  plate: z
    .string()
    .min(1, "Plate is required")
    .max(8, "Plate must be 8 characters or less")
    .optional(),
  mark: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  color: z.string().optional(),
  type: z.number().optional(),
});

class VehicleController {
  async getAllVehiclesFromClient(req, res) {
    try {
      const vehicles = await vehicleService.getAllVehiclesFromClient(
        req.params.id,
        req.params.organizationId
      );
      res
        .status(200)
        .send(ResponseHandler("Vehicles retrieved from client", vehicles));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(
          ResponseHandler(error.message || "Fail to get vehicles from client")
        );
    }
  }
  async getAll(req, res) {
    try {
      const datas = await vehicleService.getAll();
      res.status(200).send(ResponseHandler("Vehicle list retrieved", datas));
    } catch (error) {
      res.status(404).send(ResponseHandler("Vehicles not founded", null));
    }
  }

  async getById(req, res) {
    try {
      const vehicle = await vehicleService.getById(req.params.id);

      if (!vehicle)
        return res.status(404).send(ResponseHandler("Vehicle not found"));

      res.status(200).send(ResponseHandler("Vehicle retrieved:", vehicle));
    } catch (error) {
      res.status(404).send(ResponseHandler("Vehicle not found"));
    }
  }

  async create(req, res) {
    try {
      const newVehicle = await vehicleService.createVehicle(req.body);
      res.status(201).send(ResponseHandler("Vehicle created", newVehicle));
    } catch (error) {
      res.status(400).send(ResponseHandler("Falha ao criar veículo"));
    }
  }

  async update(req, res) {
    try {
      const validated = updateVehicleSchema.safeParse(req.body);

      if (!validated.success) {
        const err = await ErrorValidationHandler(validated);
        return res.status(err.status).send(ResponseHandler(err.errors));
      }
      const vehicle = await vehicleService.getById(req.params.id);

      if (!vehicle) {
        return res.status(404).send(ResponseHandler("Vehicle not found"));
      }

      const updated = await vehicleService.update(req.body);

      return res.status(200).send(ResponseHandler("Vehicle updated", updated));
    } catch (error) {
      res.status(400).send(ResponseHandler("Fail to update vehicle"));
    }
  }

  async delete(req, res) {
    try {
      const founded = await vehicleService.getById(parseFloat(req.params.id));
      if (!founded) {
        return res.status(404).send(ResponseHandler("Vehicle not founded"));
      }
      await vehicleService.delete(+req.params.id);

      res.status(200).send(ResponseHandler("Vehicle removed succefully"));
    } catch (error) {
      res.status(400).send(ResponseHandler("Fail to remove vehicle"));
    }
  }
  async getClientsBasedOnVehicle(req, res) {
    try {
      const clients = await vehicleService.getClientsBasedOnVehicle(
        req.params.plate
      );
      res.status(200).send(ResponseHandler("Clients retrieved", clients));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to retrieve clients"));
    }
  }
}

export default VehicleController;
