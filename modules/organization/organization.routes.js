import express from "express";
import OrganizationController from "./organization.controller.js";
import { requireRole, ownOrganizationOnly } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new OrganizationController();

// Only Admin (1) / Super admin (0) can edit the organization's own data.
router.put("/", requireRole(0, 1), (req, res) => controller.update(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.get("/get-by-id/:id", ownOrganizationOnly("id"), (req, res) => controller.findById(req, res));
router.get("/get-by-name/:name", (req, res) => controller.findByName(req, res));
router.get("/:id/occupancy", ownOrganizationOnly("id"), (req, res) => controller.getOccupation(req, res));

export default router;
