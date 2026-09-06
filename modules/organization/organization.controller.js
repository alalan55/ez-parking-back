import { ResponseHandler } from "../../helpers/helpers.js";
import AppError from "../../shared/errors/appError.js";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "./organization.schema.js";
import makeOrganizationService from "./organization.factory.js";

const organizationService = makeOrganizationService();

class OrganizationController {
  async getAll(req, res) {
    const orgs = await organizationService.getAll();
    res.status(200).send(ResponseHandler("Organizations retrieved", orgs));
  }

  async create(req, res) {
    const validated = createOrganizationSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const org = await organizationService.create(req.body);
    res.status(201).send(ResponseHandler("Organization created", org));
  }

  async findByName(req, res) {
    const org = await organizationService.findByName(req.params.name);
    if (!org) throw new AppError("Organization not found", 404);

    res.status(200).send(ResponseHandler("Organization retrieved", org));
  }

  async findById(req, res) {
    const org = await organizationService.findById(req.params.id);
    if (!org) throw new AppError("Organization not found", 404);

    res.status(200).send(ResponseHandler("Organization retrieved", org));
  }

  async update(req, res) {
    // An organization can only ever update itself — ignore whatever `id` the
    // client sent and use the one from the verified token instead.
    req.body.id = req.auth.organizationId;
    req.body.collaboratorId = req.auth.collaboratorId;

    const validated = updateOrganizationSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const org = await organizationService.update(req.body);
    res.status(200).send(ResponseHandler("Organization updated", org));
  }

  async delete(req, res) {
    await organizationService.delete(req.params.id);
    res.status(200).send(ResponseHandler("Organization deleted"));
  }

  async getOccupation(req, res) {
    const occupation = await organizationService.getOccupation(req.params.id);
    res.status(200).send(ResponseHandler("Occupation retrieved", occupation));
  }
}

export default OrganizationController;
