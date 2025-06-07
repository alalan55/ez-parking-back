import { ResponseHandler } from "../helpers/helpers.js";
import ClientService from "../services/ClientService.js";

const clientService = new ClientService();

class ClientController {
  async create(req, res) {
    try {
      const newUser = await clientService.create(req.body);
      res.status(201).send(ResponseHandler("User creted", newUser));
    } catch (error) {
      res.status(400).send(ResponseHandler("Fail on create client"));
    }
  }

  async createWithVehicle(req, res) {
    try {
      const response = await clientService.createWithVehicle(req.body);
      res.status(201).send(ResponseHandler("Created", response));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler("Fail to create client with vehicle"));
    }
  }

  async update(req, res) {
    try {
      const response = await clientService.update(req.body);
      res.status(200).send(ResponseHandler("User updated", response));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail to update user"));
    }
  }

  async getById(req, res) {
    try {
      const response = await clientService.getById(req.params.id);
      res.status(200).send(ResponseHandler("User retrieved", response));
    } catch (error) {
      res.status(404).send(ResponseHandler(error.message || "User not found"));
    }
  }

  async getAllUsers(req, res) {
    try {
      const response = await clientService.getAllUsers();

      res.status(200).send(ResponseHandler("Users retrieved", response));
    } catch (error) {
      res
        .status(500)
        .send(ResponseHandler(error.message || "Fail to retrieve users"));
    }
  }

  async delete(req, res) {
    try {
      await clientService.delete(req.params.id);
      res.status(200).send(ResponseHandler("User deleted"));
    } catch (error) {
      res.status(404).send(ResponseHandler(error.message || "User not found"));
    }
  }

  async addVehicle(req, res) {
    try {
      const response = await clientService.addVehicle(req.body);
      res.status(200).send(ResponseHandler("Vehicle added", response));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail to add vehicle"));
    }
  }
}

export default ClientController;
