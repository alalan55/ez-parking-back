import AppError from "../../shared/errors/appError.js";
import { hashPassword, verifyPassword, sanitizeCollaborator } from "../../shared/security/password.js";
import { signToken } from "../../shared/security/jwt.js";

class AuthService {
  constructor({ collaboratorRepo, organizationRepo, auditLogService, sequelize }) {
    this.collaboratorRepo = collaboratorRepo;
    this.organizationRepo = organizationRepo;
    this.auditLogService = auditLogService;
    this.sequelize = sequelize;
  }

  buildToken(collaborator) {
    return signToken({
      collaboratorId: collaborator.id,
      organizationId: collaborator.organizationId,
      role: collaborator.role,
    });
  }

  // Creating an organization creates its first collaborator as Super admin
  // (role 0) — this is the "owner" of the organization. There is no separate
  // self-signup: every other collaborator is created by this one (or another
  // Admin/Super admin) from inside the app, never through this endpoint.
  async register(payload) {
    const {
      name,
      email,
      password,
      organizationName,
      organizationEmail,
      organizationAddress,
      organizationPhone,
      organizationVacanciesQuantity,
    } = payload;

    return this.sequelize.transaction(async (transaction) => {
      const existingOrg = await this.organizationRepo.findByName({
        name: organizationName,
        transaction,
      });
      if (existingOrg) throw new AppError("Organization already exists", 400);

      const existingCollaborator = await this.collaboratorRepo.findByEmail({
        email,
        transaction,
      });
      if (existingCollaborator) throw new AppError("E-mail already in use", 400);

      const organization = await this.organizationRepo.create({
        payload: {
          name: organizationName,
          email: organizationEmail,
          address: organizationAddress,
          phone: organizationPhone,
          vacanciesQuantity: organizationVacanciesQuantity,
        },
        transaction,
      });

      const collaborator = await this.collaboratorRepo.create({
        payload: {
          name,
          email,
          hashPassword: hashPassword(password),
          role: 0,
          active: true,
          organizationId: organization.id,
        },
        transaction,
      });

      await this.auditLogService.record({
        organizationId: organization.id,
        collaboratorId: collaborator.id,
        action: "created",
        resource: "Organização",
        resourceId: organization.id,
        description: `Organização criada: ${organization.name} (por ${collaborator.name})`,
        transaction,
      });

      return {
        token: this.buildToken(collaborator),
        collaborator: sanitizeCollaborator(collaborator),
        organization,
      };
    });
  }

  async login({ email, password }) {
    const collaborator = await this.collaboratorRepo.findByEmail({ email });
    if (!collaborator || !verifyPassword(password, collaborator.hashPassword)) {
      throw new AppError("Invalid credentials", 401);
    }
    if (!collaborator.active) {
      throw new AppError("This account has been deactivated", 403);
    }

    return {
      token: this.buildToken(collaborator),
      collaborator: sanitizeCollaborator(collaborator),
    };
  }

  async me(auth) {
    const collaborator = await this.collaboratorRepo.findById({ id: auth.collaboratorId });
    if (!collaborator) throw new AppError("Collaborator not found", 404);
    return sanitizeCollaborator(collaborator);
  }
}

export default AuthService;
