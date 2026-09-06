import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ClientVehicleModel = sequelize.define(
  "ClientVehicle",
  {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "ClientVehicles",
    timestamps: true,
    id: false,
  }
);

export default ClientVehicleModel;
