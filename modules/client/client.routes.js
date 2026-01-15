import express from "express";
import ClientController from "./client.controller.js";

const router = express.Router();
const controller = new ClientController();

//#region Client Routes by Organization
router.get("/get-all-by-organization/:id", (req, res) =>
  controller.getAllClientsFromOrganization(req, res)
);

router.delete("/delete-from-organization/:organizationId/:id", (req, res) =>
  controller.deleteFromOrganization(req, res)
);

//#endregion

//#region Client Routes with Vehicle
router.post("/with-vehicle", (req, res) =>
  controller.createWithVehicle(req, res)
);

router.post("/add-vehicle", (req, res) => controller.addVehicle(req, res));

router.post("/remove-vehicle", (req, res) =>
  controller.removeVehicle(req, res)
);
//#endregion

//#region Client Routes CRUD
router.post("/", (req, res) => controller.create(req, res));
router.patch("/", (req, res) => controller.update(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

//#endregion


export default router;
