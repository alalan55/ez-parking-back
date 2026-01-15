import express from "express";
import bodyParser from "body-parser";
import database from "./config/db.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import { errorHandler } from "./shared/http/errorHandler.js";
import cors from "cors";

import "./models/index.js";
import "./modules/models.js";

import vehicleRouter from "./routes/vehicle.js";
// import clientRouter from "./routes/client.js";
import clientRouter from "./modules/client/client.routes.js";
import OrganizationRouter from "./routes/organization.js";
import CollaboratorRouter from "./routes/collaborator.js";
import ParkingLogRouter from "./routes/parkingLog.js";
import VacancyRouter from "./routes/vacancy.js";
import DashboardRouter from "./routes/dashboard.js";
import MetricRouter from "./routes/metrics.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/vehicle", vehicleRouter);
app.use("/client", clientRouter);
app.use("/organization", OrganizationRouter);
app.use("/collaborator", CollaboratorRouter);
app.use("/parking-log", ParkingLogRouter);
app.use("/vacancy", VacancyRouter);
app.use("/dash", DashboardRouter);
app.use("/metric", MetricRouter);

app.get("/", (req, res) => res.send("Health"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

(async () => {
  try {
    await database.sync();
    console.log("Database connected");
  } catch (error) {
    console.log("Fail to connect on db:", error);
  }
})();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
