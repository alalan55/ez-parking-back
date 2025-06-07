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
}

export default ClientController;
