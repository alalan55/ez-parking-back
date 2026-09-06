import { ResponseHandler } from "../../helpers/helpers.js";
import AppError from "../../shared/errors/appError.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import makeAuthService from "./auth.factory.js";

const authService = makeAuthService();

class AuthController {
  async register(req, res) {
    const validated = registerSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const result = await authService.register(req.body);
    res.status(201).send(ResponseHandler("Organization registered", result));
  }

  async login(req, res) {
    const validated = loginSchema.safeParse(req.body);
    if (!validated.success) {
      const errors = validated.error.errors.map((err) => err.message);
      throw new AppError(errors, 400);
    }

    const result = await authService.login(req.body);
    res.status(200).send(ResponseHandler("Login successful", result));
  }

  async me(req, res) {
    const collaborator = await authService.me(req.auth);
    res.status(200).send(ResponseHandler("Current session", collaborator));
  }
}

export default AuthController;
