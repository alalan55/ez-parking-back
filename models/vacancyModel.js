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

VacancyModel.belongsTo(OrganizationModel);
OrganizationModel.hasMany(VacancyModel);

// VEHICLE
Vehicle.hasOne(VacancyModel);
VacancyModel.belongsTo(Vehicle, {
  foreignKey: {
    allowNull: true,
  },
  onDelete: "SET NULL",
});

export default VacancyModel;
