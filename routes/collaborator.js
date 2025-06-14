import express from "express";
import CollaboratorController from "../controller/collaboratorController.js";

const router = express.Router();
const controller = new CollaboratorController();

router.get("/", (req, res) => controller.getAll(req, res));

export default router;
