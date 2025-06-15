import { ResponseHandler } from "../helpers/helpers.js";
import CollaboratorService from "../services/CollaboratorService.js";

const collaboratorSerivce = new CollaboratorService();

class CollaboratorController {
  async getAll(req, res) {
    try {
      const collaborators = await collaboratorSerivce.getAll();
      res
        .status(200)
        .send(ResponseHandler("Collaborators retrieved:", collaborators));
    } catch (error) {
      res
        .status(400)
        .send(
          ResponseHandler(error.message || "Error on fetch all collaborators")
        );
    }
  }

  async getByOrganization(req, res) {
    try {
      const collaboratos = await collaboratorSerivce.getByCompany(
        req.params.id
      );

      res
        .status(200)
        .send(ResponseHandler("Collaborators retrieved", collaboratos));
    } catch (error) {
      res.status(404).send(ResponseHandler(error.message || "Data not found"));
    }
  }

  async addCollaborator(req, res) {
    try {
      const collaborator = await collaboratorSerivce.createCollaborator(
        req.body
      );
      res
        .status(201)
        .send(ResponseHandler("Collaborator created:", collaborator));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail on create collaborator"));
    }
  }

  async addCollaboratorWithOrganization(req, res) {
    try {
      if (!req.body.organizationId) {
        throw new Error("Organization ID is required");
      }

      const collaborator =
        await collaboratorSerivce.createCollaboratorWithOrganization(req.body);
      res
        .status(201)
        .send(ResponseHandler("Collaborator created:", collaborator));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(
          ResponseHandler(
            error.message || "Fail to create collaborator with organization"
          )
        );
    }
  }

  async update(req, res) {
    try {
      const userId = req.params.id;

      const collaborator = await collaboratorSerivce.update(req.body, userId);
      res
        .status(200)
        .send(ResponseHandler("Collaborator updated", collaborator));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to update collaborator"));
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;

      await collaboratorSerivce.delete(id);
      res.status(200).send(ResponseHandler("Collaborator deleted"));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to delete collaborator"));
    }
  }
}

export default CollaboratorController;
