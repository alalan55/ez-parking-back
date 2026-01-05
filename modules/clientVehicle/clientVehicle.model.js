import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ClientVehicleModel = sequelize.define(
  "ClientVehicle",
  {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ClientVehicles",
    timestamps: true,
  }
);

export default ClientVehicleModel;
