import { ResponseHandler } from "../../helpers/helpers.js";
import AppError from "../../shared/errors/appError.js";
import { createCollaboratorSchema, updateCollaboratorSchema } from "./collaborator.schema.js";
import makeCollaboratorService from "./collaborator.factory.js";

const collaboratorService = makeCollaboratorService();

class CollaboratorController {
  async getAll(req, res) {
    const collaborators = await collaboratorService.getAll();
    res.status(200).send(ResponseHandler("Collaborators retrieved", collaborators));
  }

  async getByOrganization(req, res) {
    const collaborators = await collaboratorService.getByCompany(req.params.id);
    res.status(200).send(ResponseHandler("Collaborators retrieved", collaborators));
  }

  async addCollaborator(req, res) {
    // A collaborator can only ever be created inside the caller's own
    // organization — ignore whatever organizationId the client sent.
    req.body.organizationId = req.auth.organizationId;
    req.body.actingCollaboratorId = req.auth.collaboratorId;

    const validated = createCollaboratorSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const collaborator = await collaboratorService.createCollaborator(req.body);
    res.status(201).send(ResponseHandler("Collaborator created", collaborator));
  }

  async update(req, res) {
    req.body.actingCollaboratorId = req.auth.collaboratorId;

    const validated = updateCollaboratorSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const collaborator = await collaboratorService.update(req.body, req.params.id);
    res.status(200).send(ResponseHandler("Collaborator updated", collaborator));
  }

  async setActive(req, res) {
    const collaborator = await collaboratorService.setActive(
      req.params.id,
      !!req.body.active,
      req.auth.collaboratorId
    );
    res.status(200).send(ResponseHandler("Collaborator status updated", collaborator));
  }

  async delete(req, res) {
    await collaboratorService.delete(req.params.id, req.auth.collaboratorId);
    res.status(200).send(ResponseHandler("Collaborator deleted"));
  }
}

export default CollaboratorController;
