import { CollaboratorModel, OrganizationModel } from "../models/index.js";

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class CollaboratorService {
  async getAll() {
    try {
      const collaborators = await CollaboratorModel.findAll();
      return collaborators;
    } catch (error) {
      throw new Error("Error on fetch all collaborators");
    }
  }

  async getByCompany(organizationId) {
    try {
      const org = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!org) throw new Error("Organization not found");

      const collaborators = await CollaboratorModel.findAll({
        where: { organizationId },
      });

      return collaborators;
    } catch (error) {
      throw error;
    }
  }

  async createCollaborator(payload) {
    try {
      const { name, email, hashPassword, photo, role, organizationId } =
        payload;

      const collaborator = await CollaboratorModel.create({
        name,
        email,
        hashPassword,
        photo,
        role,
        organizationId,
      });

      return collaborator;
    } catch (error) {
      throw error;
    }
  }

  async createCollaboratorWithOrganization(payload) {
    try {
      const { organizationId } = payload;

      const org = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!org) throw new HttpError("Organization not found", 404);

      const collaborator = await this.createCollaborator(payload);

      await org.addCollaborator(collaborator);

      return collaborator;
    } catch (error) {
      throw error;
    }
  }

  async update(payload, userId) {
    try {
      const { name, email, hashPassword, photo, role } = payload;

      const collaborator = await CollaboratorModel.findOne({
        where: { id: userId },
      });

      if (!collaborator) throw new HttpError("Collaborator not found", 404);

      collaborator.name = name;
      collaborator.email = email;
      collaborator.hashPassword = hashPassword;
      collaborator.photo = photo;
      collaborator.role = role;

      await collaborator.save();

      return collaborator;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const collaborator = await CollaboratorModel.findOne({ where: { id } });

      if (!collaborator) throw new HttpError("Collaborator not found", 404);

      await collaborator.destroy();
    } catch (error) {
      throw error;
    }
  }
}

export default CollaboratorService;
