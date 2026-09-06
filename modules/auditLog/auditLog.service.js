import AppError from "../../shared/errors/appError.js";

const ACTIONS = ["created", "updated", "deleted", "checkin", "checkout"];

class AuditLogService {
  constructor({ auditLogRepo, organizationRepo }) {
    this.auditLogRepo = auditLogRepo;
    this.organizationRepo = organizationRepo;
  }

  // Fire-and-log helper other services call right after a write succeeds.
  // Swallows its own errors — a failed audit write should never break the
  // actual operation it's describing.
  async record({ organizationId, collaboratorId, action, resource, resourceId, description, metadata, transaction }) {
    try {
      await this.auditLogRepo.create({
        organizationId,
        collaboratorId,
        action,
        resource,
        resourceId,
        description,
        metadata,
        transaction,
      });
    } catch (error) {
      console.error("Failed to record audit event:", error);
    }
  }

  async getAuditLog(
    orgId,
    { days = 7, action, resource, collaboratorId, search, page = 1, pageSize = 20 } = {}
  ) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    if (action && !ACTIONS.includes(action)) {
      throw new AppError(`Invalid action filter: ${action}`, 400);
    }

    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days + 1);

    const { events, total } = await this.auditLogRepo.findAllByOrganization({
      organizationId: orgId,
      start,
      end,
      action,
      resource,
      collaboratorId,
      search,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return { events, total, page, pageSize };
  }
}

export default AuditLogService;
