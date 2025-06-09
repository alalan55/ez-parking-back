import express from "express";
import OrganizationControler from "../controller/organizationController.js";

const router = express.Router();
const controller = new OrganizationControler();

router.post("/", (req, res) => controller.create(req, res));
router.get("/get-by-name/:name", (req, res) => controller.findByName(req, res));
router.get("/get-by-id/:id", (req, res) => controller.findById(req, res));

export default router;
