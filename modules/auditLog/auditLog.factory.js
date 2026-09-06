import AuditLogRepository from "./auditLog.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import AuditLogService from "./auditLog.service.js";

let instance;

// Singleton: other modules (client, vehicle, organization, parkingLog) pull
// this same instance in to call `.record(...)` after their own writes.
export default function makeAuditLogService() {
  if (!instance) {
    instance = new AuditLogService({
      auditLogRepo: new AuditLogRepository(),
      organizationRepo: new OrganizationRepository(),
    });
  }
  return instance;
}
