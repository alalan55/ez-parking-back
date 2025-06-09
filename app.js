import express from "express";
import bodyParser from "body-parser";
import database from "./config/db.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

import "./models/index.js";

import vehicleRouter from "./routes/vehicle.js";
import clientRouter from "./routes/client.js";
import OrganizationRouter from "./routes/organization.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/vehicle", vehicleRouter);
app.use("/client", clientRouter);
app.use("/organization", OrganizationRouter);

app.get("/", (req, res) => res.send("Health"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

(async () => {
  try {
    await database.sync();
    console.log("connectin stablieshded");
  } catch (error) {
    console.log("Fail to connect on db:", error);
  }
})();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
