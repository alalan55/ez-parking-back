import express from "express";
import bodyParser from "body-parser";

import vehicleRouter from "./routes/vehicle.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/vehicle", vehicleRouter);

app.get("/", (req, res) => {
  res.send("Hello, World! from route");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
