import { Op } from "sequelize";
import AuditLogModel from "./auditLog.model.js";
import CollaboratorModel from "../collaborator/collaborator.model.js";

class AuditLogRepository {
  create({ organizationId, collaboratorId, action, resource, resourceId, description, metadata, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return AuditLogModel.create(
      {
        organizationId,
        collaboratorId,
        action,
        resource,
        resourceId,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      options
    );
  }

  async findAllByOrganization({
    organizationId,
    start,
    end,
    action,
    resource,
    collaboratorId,
    search,
    limit = 20,
    offset = 0,
  } = {}) {
    const where = { organizationId };
    if (start && end) where.createdAt = { [Op.gte]: start, [Op.lt]: end };
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (collaboratorId) where.collaboratorId = collaboratorId;
    if (search) where.description = { [Op.like]: `%${search}%` };

    const { rows, count } = await AuditLogModel.findAndCountAll({
      where,
      include: [
        {
          model: CollaboratorModel,
          as: "collaborator",
          attributes: { exclude: ["hashPassword"] },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { events: rows, total: count };
  }
}

export default AuditLogRepository;
