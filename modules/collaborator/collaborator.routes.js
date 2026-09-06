import express from "express";
import CollaboratorController from "./collaborator.controller.js";
import { requireRole, ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new CollaboratorController();

// Managing collaborators (create/edit/activate/remove) is an Admin (1) /
// Super admin (0) action — an Operador (2) can't manage teammates.
router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", requireRole(0, 1), (req, res) => controller.addCollaborator(req, res));
router.put("/:id", requireRole(0, 1), (req, res) => controller.update(req, res));
router.patch("/:id/active", requireRole(0, 1), (req, res) => controller.setActive(req, res));
router.delete("/:id", requireRole(0, 1), (req, res) => controller.delete(req, res));

router.get("/organization/:id", ownOrganizationOnly("id"), (req, res) =>
  controller.getByOrganization(req, res)
);

export default router;
