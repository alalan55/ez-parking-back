import {
  createUserSchema,
  createUserWithVehicleSchema,
  addVehicleSchema,
  removeVehicleSchema,
} from "./client.schema.js";

import {
  ResponseHandler,
  ErrorValidationHandler,
} from "../../helpers/helpers.js";

import AppError from "../../shared/errors/appError.js";

import makeClientService from "./client.factory.js";

const clientService = makeClientService();

class ClientController {
  async create(req, res) {
    const validated = createUserSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const newUser = await clientService.create(req.body);

    res.status(201).send(ResponseHandler("User created", newUser));
  }

  async createWithVehicle(req, res) {
    const validated = createUserWithVehicleSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const response = await clientService.createWithVehicle(req.body);

    res.status(201).send(ResponseHandler("Created", response));
  }

  async addVehicle(req, res) {
    const validated = addVehicleSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const response = await clientService.addVehicle(req.body);

    res.status(200).send(ResponseHandler("Vehicle added", response));
  }

  async removeVehicle(req, res){
    const validated = removeVehicleSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const response = await clientService.removeVehicle(req.body);

    res.status(200).send(ResponseHandler("Vehicle removed", response));
  }

  async getAll(req, res) {
    const users = await clientService.getAll();

    res.status(200).send(ResponseHandler("Users retrieved", users));
  }

  async getAllFromOrganization(req, res) {
    const { organizationId } = req.params;

    const querys = req.query;

    const users = await clientService.getAllByOrganiztion(
      organizationId,
      querys
    );

    res.status(200).send(ResponseHandler("Users retrieved", users));
  }

  async deleteFromOrganization(req, res) {
    const { organizationId, id } = req.params;

    await clientService.deleteFromOrganization(+organizationId, +id);

    res.status(200).send(ResponseHandler("User removed from organization"));
  }

  async getById(req, res) {
    const { id } = req.params;

    const user = await clientService.getById(id);

    res.status(200).send(ResponseHandler("User retrieved", user));
  }

  async delete(req, res) {
    const { id } = req.params;

    await clientService.delete(id);

    res.status(200).send(ResponseHandler("User deleted"));
  }

  async update(req, res) {
    const updatedUser = await clientService.update(req.body);

    res.status(200).send(ResponseHandler("User updated", updatedUser));
  }

}

export default ClientController;
