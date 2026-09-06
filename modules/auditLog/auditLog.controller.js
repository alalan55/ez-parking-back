import { ResponseHandler } from "../../helpers/helpers.js";
import makeAuditLogService from "./auditLog.factory.js";

const auditLogService = makeAuditLogService();

class AuditLogController {
  async getAuditLog(req, res) {
    const { days, action, resource, collaboratorId, search, page, pageSize } = req.query;

    const data = await auditLogService.getAuditLog(req.params.orgId, {
      days: days ? parseInt(days, 10) : undefined,
      action: action || undefined,
      resource: resource || undefined,
      collaboratorId: collaboratorId ? parseInt(collaboratorId, 10) : undefined,
      search: search || undefined,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });

    res.status(200).send(ResponseHandler("Audit log retrieved", data));
  }
}

export default AuditLogController;
