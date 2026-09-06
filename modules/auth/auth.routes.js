import express from "express";
import AuthController from "./auth.controller.js";
import { authenticate } from "../../shared/http/authenticate.js";

const router = express.Router();
const controller = new AuthController();

router.post("/register", (req, res) => controller.register(req, res));
router.post("/login", (req, res) => controller.login(req, res));
router.get("/me", authenticate, (req, res) => controller.me(req, res));

export default router;
