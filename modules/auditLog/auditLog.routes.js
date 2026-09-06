import express from "express";
import AuditLogController from "./auditLog.controller.js";
import { ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new AuditLogController();

router.get("/:orgId", ownOrganizationOnly("orgId"), (req, res) => controller.getAuditLog(req, res));

export default router;
