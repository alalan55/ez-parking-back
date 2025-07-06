import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import CollaboratorModel from "./collaboratorModel.js";
import VacancyModel from "./vacancyModel.js";
import OrganizationModel from "./organizationModel.js";
import Vehicle from "./vehicleModel.js";

const ParkingLogModel = sequelize.define("ParkingLog", {
  entryTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  exitTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  observation: {
    type: DataTypes.STRING,
  },
});

// vacancy
ParkingLogModel.belongsTo(VacancyModel, {
  as: "vacancy",
  foreignKey: {
    name: "vacancyId",
  },
});
VacancyModel.hasMany(ParkingLogModel, {
  foreignKey: {
    name: "vacancyId",
  },
});

VacancyModel.belongsTo(ParkingLogModel, {
  as: "activeVacancyLog",
  foreignKey: {
    name: "parkingLogId",
    allowNull: true,
  },
  onDelete: "SET NULL",
});

// organization
ParkingLogModel.belongsTo(OrganizationModel, {
  as: "organization",
  foreignKey: { name: "organizationId" },
});
OrganizationModel.hasMany(ParkingLogModel, {
  foreignKey: { name: "organizationId" },
});

// collaborator
ParkingLogModel.belongsTo(CollaboratorModel, {
  as: "collaborator",
  foreignKey: { name: "collaboratorId", allowNull: false },
});
CollaboratorModel.hasMany(ParkingLogModel, {
  foreignKey: { name: "collaboratorId", allowNull: false },
});

// vehicle
ParkingLogModel.belongsTo(Vehicle, {
  as: "vehicle",
  foreignKey: { name: "vehicleId", allowNull: false },
});
Vehicle.hasMany(ParkingLogModel, {
  foreignKey: { name: "vehicleId", allowNull: false },
});

export default ParkingLogModel;
