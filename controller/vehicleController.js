import VehicleService from "../services/vehicleService.js";

const vehicleService = new VehicleService();

class VehicleController {
  async getAll(req, res) {
    try {
      const datas = await vehicleService.getAll();
      res
        .status(200)
        .send({ message: "Vehicle list retrieved", content: datas });
    } catch (error) {
      res.status(404).send({ message: "Vehicles not founded", content: null });
    }
  }

  async getById(req, res) {
    try {
      const vehicle = await vehicleService.getById(req.params.id);
      res.status(200).send({ message: "Vehicle retrieved:", content: vehicle });
    } catch (error) {
      res.status(404).send({ message: "Vehicle not found", content: null });
    }
  }

  async create(req, res) {
    try {
      const newVehicle = await vehicleService.createVehicle(req.body);
      res.status(201).send({ message: "Vehicle created", content: newVehicle });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Falha ao criar veículo", content: null });
    }
  }

  async update(req, res) {
    try {
      const vehicle = await vehicleService.getById(req.params.id);

      if (!vehicle) {
        return res
          .status(404)
          .send({ message: "Vehicle not found", content: null });
      }

      const updated = await vehicleService.update(req.body);

      return res
        .status(200)
        .send({ message: "Vehicle updated", content: updated });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Fail to update vehicle", content: null });
    }
  }

  async delete(req, res) {
    try {
      const founded = await vehicleService.getById(parseFloat(req.params.id));
      if (!founded) {
        return res
          .status(404)
          .send({ message: "Vehicle not founded", content: null });
      }
      await vehicleService.delete(+req.params.id);

      res
        .status(200)
        .send({ message: "Vehicle removed succefully", content: null });
   
    } catch (error) {
      res
        .status(400)
        .send({ message: "Fail to remove vehicle", content: null });
    }
  }
}

export default VehicleController;
