import express from "express";
import OrganizationControler from "../controller/organizationController.js";

const router = express.Router();
const controller = new OrganizationControler();

router.put("/", (req, res) => controller.update(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));
router.get("/get-by-id/:id", (req, res) => controller.findById(req, res));
router.get("/get-by-name/:name", (req, res) => controller.findByName(req, res));

export default router;
