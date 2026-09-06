import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { DataTypes } from "sequelize";
import database from "./config/db.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import { errorHandler } from "./shared/http/errorHandler.js";
import { authenticate } from "./shared/http/authenticate.js";
import cors from "cors";

import "./modules/models.js";

import authRouter from "./modules/auth/auth.routes.js";
import vehicleRouter from "./modules/vehicle/vehicle.routes.js";
import clientRouter from "./modules/client/client.routes.js";
import organizationRouter from "./modules/organization/organization.routes.js";
import collaboratorRouter from "./modules/collaborator/collaborator.routes.js";
import parkingLogRouter from "./modules/parkingLog/parkingLog.routes.js";
import vacancyRouter from "./modules/vacancy/vacancy.routes.js";
import metricRouter from "./modules/metric/metric.routes.js";
import auditLogRouter from "./modules/auditLog/auditLog.routes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Public routes — mounted before the `authenticate` gate below.
app.get("/", (req, res) => res.send("Health"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRouter);

// Everything mounted after this line requires a valid Bearer token.
app.use(authenticate);

app.use("/vehicle", vehicleRouter);
app.use("/client", clientRouter);
app.use("/organization", organizationRouter);
app.use("/collaborator", collaboratorRouter);
app.use("/parking-log", parkingLogRouter);
app.use("/vacancy", vacancyRouter);
app.use("/metric", metricRouter);
app.use("/audit-log", auditLogRouter);

app.use(errorHandler);

(async () => {
  try {
    await database.sync();

    // `sync()` only creates missing tables — it never alters an existing
    // one. `active` was added to an already-existing Collaborators table,
    // so a plain sync() can't add the column on a database.sqlite that
    // predates it (e.g. after a `git checkout -- database.sqlite` reset).
    // Self-heal it here instead of a full migration runner.
    const queryInterface = database.getQueryInterface();
    const collaboratorColumns = await queryInterface.describeTable("Collaborators");
    if (!collaboratorColumns.active) {
      await queryInterface.addColumn("Collaborators", "active", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
      console.log("Added missing 'active' column to Collaborators");
    }

    console.log("Database connected");
  } catch (error) {
    console.log("Fail to connect on db:", error);
  }
})();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
