import express from "express";
import bodyParser from "body-parser";
import database from "./config/db.js";

import "./models/index.js";

import vehicleRouter from "./routes/vehicle.js";
import clientRouter from "./routes/client.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/vehicle", vehicleRouter);
app.use("/client", clientRouter);

app.get("/", (res) => res.send("Health"));

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
