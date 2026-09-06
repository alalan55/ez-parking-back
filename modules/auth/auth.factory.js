import sequelize from "../../config/db.js";
import CollaboratorRepository from "../collaborator/collaborator.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import makeAuditLogService from "../auditLog/auditLog.factory.js";
import AuthService from "./auth.service.js";

export default function makeAuthService() {
  return new AuthService({
    collaboratorRepo: new CollaboratorRepository(),
    organizationRepo: new OrganizationRepository(),
    auditLogService: makeAuditLogService(),
    sequelize,
  });
}
