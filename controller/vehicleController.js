import VehicleService from "../services/vehicleService.js";
import { ResponseHandler } from "../helpers/helpers.js";

const vehicleService = new VehicleService();

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
}

export default VehicleController;
