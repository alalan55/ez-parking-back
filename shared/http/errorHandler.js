import AppError from "../errors/appError.js";
import { ValidationError } from "sequelize";

export function errorHandler(err, req, res, next) {
  // Erro conhecido da aplicação
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Erros do Sequelize
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message),
    });
  }

  // Erro inesperado
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
