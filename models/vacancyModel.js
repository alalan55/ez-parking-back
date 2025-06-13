import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { OrganizationModel, Vehicle } from "./index.js";

const VacancyModel = sequelize.define("Vacancy", {
  status: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

VacancyModel.hasOne(OrganizationModel);
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
