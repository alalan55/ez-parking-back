import { z } from "zod";
import { ResponseHandler } from "../helpers/helpers.js";
import ClientService from "../services/ClientService.js";

const clientService = new ClientService();

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  organizationId: z.number().min(1, "Organization ID is required"),
});

const createUserWithVehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  plate: z.string().min(1, "Plate is required"),
  mark: z.string().min(1, "Mark is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1, "Year is required"),
  color: z.string().optional(),
  type: z.number().min(0, "Type is required"),
  organizationId: z.number().min(1, "Organization ID is required"),
});

const addVehicleSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  plate: z.string().min(1, "Plate is required"),
  mark: z.string().min(1, "Mark is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1, "Year is required"),
  color: z.string().optional(),
  type: z.number().min(0, "Type is required"),
  organizationId: z.number().min(1, "Organization ID is required"),
});

class ClientController {
  async create(req, res) {
    try {
      const validated = createUserSchema.safeParse(req.body);

      if (!validated.success) {
        const errors = validated.error.errors.map((err) => err.message);
        return res.status(400).send(ResponseHandler(errors));
      }

      const newUser = await clientService.create(req.body);
      res.status(201).send(ResponseHandler("User creted", newUser));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail to create user"));
    }
  }

  async createWithVehicle(req, res) {
    try {
      const validated = createUserWithVehicleSchema.safeParse(req.body);

      if (!validated.success) {
        const errors = validated.error.errors.map((err) => err.message);
        return res.status(400).send(ResponseHandler(errors));
      }

      const response = await clientService.createWithVehicle(req.body);
      res.status(201).send(ResponseHandler("Created", response));
    } catch (error) {
      res
        .status(400)
        .send(
          ResponseHandler(error.message || "Fail to create user with vehicle")
        );
    }
  }

  async addVehicle(req, res) {
    try {
      const validated = addVehicleSchema.safeParse(req.body);

      if (!validated.success) {
        const errors = validated.error.errors.map((err) => err.message);
        return res.status(400).send(ResponseHandler(errors));
      }

      const response = await clientService.addVehicle(req.body);
      res.status(200).send(ResponseHandler("Vehicle added", response));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail to add vehicle"));
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

  async getAllClientsFromOrganization(req, res) {
    try {
      const clients = await clientService.getAllClientsByOrganization(
        +req.params.id,
        req.query
      );

      res.status(200).send(ResponseHandler("Clients retrieved:", clients));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(
          ResponseHandler(
            error.message || "Fail to get users from organization"
          )
        );
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

  async deleteFromOrganization(req, res) {
    try {
      await clientService.deleteFromOrganization(
        +req.params.organizationId,
        +req.params.id
      );
      res.status(200).send(ResponseHandler("User deleted from organization"));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(
          ResponseHandler(
            res.message || "Fail to delete user from organization"
          )
        );
    }
  }

  // remover veículo do cliente
  async removeVehicle(req, res) {
    try {
      const response = await clientService.removeVehicle(req.body);
      res.status(200).send(ResponseHandler("Vehicle removed", response));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail to remove vehicle"));
    }
  }
}

export default ClientController;
