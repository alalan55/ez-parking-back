import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Vehicle from "./vehicleModel.js";

const ClientModel = sequelize.define("Client", {
  name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

ClientModel.belongsToMany(Vehicle, {
  through: "ClientVehicles",
  foreignKey: { name: "clientId" },
});
Vehicle.belongsToMany(ClientModel, {
  through: "ClientVehicles",
  foreignKey: { name: "vehicleId" },
});

export default ClientModel;
