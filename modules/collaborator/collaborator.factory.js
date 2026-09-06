import CollaboratorRepository from "./collaborator.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import makeAuditLogService from "../auditLog/auditLog.factory.js";
import CollaboratorService from "./collaborator.service.js";

export default function makeCollaboratorService() {
  return new CollaboratorService({
    collaboratorRepo: new CollaboratorRepository(),
    organizationRepo: new OrganizationRepository(),
    auditLogService: makeAuditLogService(),
  });
}
