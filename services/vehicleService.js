import { Vehicle } from "../models/index.js";

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
      const newVehicle = await Vehicle.create({
        plate: infos.plate,
        mark: infos.mark,
        model: infos.model,
        year: infos.year,
        color: infos.color,
        type: infos.type,
      });

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
}

export default VehicleService;
