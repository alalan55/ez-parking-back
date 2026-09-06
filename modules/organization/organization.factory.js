import OrganizationRepository from "./organization.repository.js";
import VacancyRepository from "../vacancy/vacancy.repository.js";
import makeAuditLogService from "../auditLog/auditLog.factory.js";
import OrganizationService from "./organization.service.js";

export default function makeOrganizationService() {
  return new OrganizationService({
    organizationRepo: new OrganizationRepository(),
    vacancyRepo: new VacancyRepository(),
    auditLogService: makeAuditLogService(),
  });
}
