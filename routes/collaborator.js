import express from "express";
import CollaboratorController from "../controller/collaboratorController.js";

const router = express.Router();
const controller = new CollaboratorController();

router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.addCollaborator(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

router.post("/organization", (req, res) =>
  controller.addCollaboratorWithOrganization(req, res)
);

router.post("/checkin", (req, res) => controller.checkin(req, res));

router.get("/organization/:id", (req, res) =>
  controller.getByOrganization(req, res)
);

export default router;
