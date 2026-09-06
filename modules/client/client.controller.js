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
    req.body.collaboratorId = req.auth.collaboratorId;
    req.body.organizationId = req.auth.organizationId;

    const validated = createUserSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const newUser = await clientService.create(req.body);

    res.status(201).send(ResponseHandler("User created", newUser));
  }

  async createWithVehicle(req, res) {
    req.body.organizationId = req.auth.organizationId;

    const validated = createUserWithVehicleSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const response = await clientService.createWithVehicle(req.body);

    res.status(201).send(ResponseHandler("Created", response));
  }

  async addVehicle(req, res) {
    req.body.collaboratorId = req.auth.collaboratorId;
    req.body.organizationId = req.auth.organizationId;

    const validated = addVehicleSchema.safeParse(req.body);

    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const response = await clientService.addVehicle(req.body);

    res.status(200).send(ResponseHandler("Vehicle added", response));
  }

  async removeVehicle(req, res){
    req.body.collaboratorId = req.auth.collaboratorId;
    req.body.organizationId = req.auth.organizationId;

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

  async getAllClientsFromOrganization(req, res) {
    const organizationId = req.params.id;

    const querys = req.query;

    const users = await clientService.getAllByOrganiztion(
      organizationId,
      querys
    );

    res.status(200).send(ResponseHandler("Users retrieved", users));
  }

  async deleteFromOrganization(req, res) {
    const { id } = req.params;

    // Ignore whatever organizationId the URL carries — a collaborator can
    // only ever remove a client from their own organization.
    await clientService.deleteFromOrganization(req.auth.organizationId, +id, req.auth.collaboratorId);

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
    req.body.collaboratorId = req.auth.collaboratorId;
    req.body.organizationId = req.auth.organizationId;

    const updatedUser = await clientService.update(req.body);

    res.status(200).send(ResponseHandler("User updated", updatedUser));
  }

}

export default ClientController;
