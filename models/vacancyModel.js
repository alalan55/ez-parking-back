import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import OrganizationModel from "./organizationModel.js";
import Vehicle from "./vehicleModel.js";

const enumStatus = {
  0: "available",
  1: "ocupied",
};

const VacancyModel = sequelize.define("Vacancy", {
  status: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
});

VacancyModel.belongsTo(OrganizationModel, {
  foreignKey: {
    name: "organizationId",
  },
});
OrganizationModel.hasMany(VacancyModel, {
  foreignKey: {
    name: "organizationId",
  },
});

// VEHICLE
Vehicle.hasOne(VacancyModel, {
  foreignKey: {
    name: "vehicleId",
    allowNull: true,
  },
  onDelete: "SET NULL",
});
VacancyModel.belongsTo(Vehicle, {
  as: "vehicle",
  foreignKey: {
    name: "vehicleId",
    allowNull: true,
  },
  onDelete: "SET NULL",
});

export default VacancyModel;
