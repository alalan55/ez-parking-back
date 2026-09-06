import AppError from "../../shared/errors/appError.js";
import { hashPassword, sanitizeCollaborator as sanitize } from "../../shared/security/password.js";

class CollaboratorService {
  constructor({ collaboratorRepo, organizationRepo, auditLogService }) {
    this.collaboratorRepo = collaboratorRepo;
    this.organizationRepo = organizationRepo;
    this.auditLogService = auditLogService;
  }

  async getAll() {
    const collaborators = await this.collaboratorRepo.getAll();
    return collaborators.map(sanitize);
  }

  async getByCompany(organizationId) {
    const org = await this.organizationRepo.findById({ id: organizationId });
    if (!org) throw new AppError("Organization not found", 404);

    const collaborators = await this.collaboratorRepo.findAllByOrganization({ organizationId });
    return collaborators.map(sanitize);
  }

  // Collaborators aren't self-registered — an organization always creates
  // its own collaborator accounts (name/e-mail/cargo), per how this system
  // is meant to work.
  async createCollaborator(payload) {
    const { name, email, password, photo, role, organizationId } = payload;

    const org = await this.organizationRepo.findById({ id: organizationId });
    if (!org) throw new AppError("Organization not found", 404);

    const existing = await this.collaboratorRepo.findByEmail({ email });
    if (existing) throw new AppError("E-mail already in use", 400);

    const collaborator = await this.collaboratorRepo.create({
      payload: {
        name,
        email,
        hashPassword: hashPassword(password),
        photo,
        role: role ?? 2,
        organizationId,
      },
    });

    await this.auditLogService.record({
      organizationId,
      collaboratorId: payload.actingCollaboratorId,
      action: "created",
      resource: "Colaborador",
      resourceId: collaborator.id,
      description: `Novo colaborador cadastrado: ${collaborator.name}`,
    });

    return sanitize(collaborator);
  }

  async update(payload, userId) {
    const collaborator = await this.collaboratorRepo.findById({ id: userId });
    if (!collaborator) throw new AppError("Collaborator not found", 404);

    if (payload.email && payload.email !== collaborator.email) {
      const existing = await this.collaboratorRepo.findByEmail({
        email: payload.email,
        excludeId: userId,
      });
      if (existing) throw new AppError("E-mail already in use", 400);
    }

    const fields = ["name", "email", "role", "active", "photo"];
    const changes = fields
      .filter((field) => payload[field] !== undefined && payload[field] !== collaborator[field])
      .map((field) => ({ field, before: collaborator[field], after: payload[field] }));

    fields.forEach((field) => {
      if (payload[field] !== undefined) collaborator[field] = payload[field];
    });

    if (payload.password) {
      collaborator.hashPassword = hashPassword(payload.password);
      changes.push({ field: "password", before: "••••••", after: "••••••" });
    }

    await collaborator.save();

    if (changes.length) {
      await this.auditLogService.record({
        organizationId: collaborator.organizationId,
        collaboratorId: payload.actingCollaboratorId,
        action: "updated",
        resource: "Colaborador",
        resourceId: collaborator.id,
        description: `Dados atualizados: ${collaborator.name} (${changes.map((c) => c.field).join(", ")})`,
        metadata: changes.filter((c) => c.field !== "password"),
      });
    }

    return sanitize(collaborator);
  }

  async setActive(id, active, actingCollaboratorId) {
    const collaborator = await this.collaboratorRepo.findById({ id });
    if (!collaborator) throw new AppError("Collaborator not found", 404);

    collaborator.active = active;
    await collaborator.save();

    await this.auditLogService.record({
      organizationId: collaborator.organizationId,
      collaboratorId: actingCollaboratorId,
      action: "updated",
      resource: "Colaborador",
      resourceId: collaborator.id,
      description: `${active ? "Ativou" : "Desativou"} o acesso de ${collaborator.name}`,
    });

    return sanitize(collaborator);
  }

  async delete(id, actingCollaboratorId) {
    const collaborator = await this.collaboratorRepo.findById({ id });
    if (!collaborator) throw new AppError("Collaborator not found", 404);

    await this.collaboratorRepo.delete({ id });

    await this.auditLogService.record({
      organizationId: collaborator.organizationId,
      collaboratorId: actingCollaboratorId,
      action: "deleted",
      resource: "Colaborador",
      resourceId: collaborator.id,
      description: `Colaborador removido: ${collaborator.name}`,
    });
  }
}

export default CollaboratorService;
