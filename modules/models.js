import ClientModel from "./client/client.model.js";
import ClientVehicleModel from "./clientVehicle/clientVehicle.model.js";
import ClientOrganizationModel from "./clientOrganization/clientOrganization.model.js";
import OrganizationModel from "./organization/organization.model.js";
import CollaboratorModel from "./collaborator/collaborator.model.js";
import VehicleModel from "./vehicle/vehicle.model.js";
import ParkingLogModel from "./parkingLog/parkingLog.model.js";
import VacancyModel from "./vacancy/vacancy.model.js";

//#region Associations

//  Vehicle - Organization
VehicleModel.belongsToMany(OrganizationModel, {
  through: "OrganizationVehicles",
  foreignKey: { name: "vehicleId" },
});

OrganizationModel.belongsToMany(VehicleModel, {
  through: "OrganizationVehicles",
  foreignKey: { name: "organizationId" },
});

// Collaborator - Organization
OrganizationModel.hasMany(CollaboratorModel, {
  foreignKey: {
    name: "organizationId",
    allowNull: true,
  },
});

CollaboratorModel.belongsTo(OrganizationModel, {
  foreignKey: {
    allowNull: true,
    name: "organizationId",
  },
  onDelete: "SET NULL",
});

// ParkingLog - other models
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

ParkingLogModel.belongsTo(OrganizationModel, {
  as: "organization",
  foreignKey: { name: "organizationId" },
});

OrganizationModel.hasMany(ParkingLogModel, {
  foreignKey: { name: "organizationId" },
});

ParkingLogModel.belongsTo(CollaboratorModel, {
  as: "collaborator",
  foreignKey: { name: "collaboratorId", allowNull: false },
});

CollaboratorModel.hasMany(ParkingLogModel, {
  foreignKey: { name: "collaboratorId", allowNull: false },
});

ParkingLogModel.belongsTo(VehicleModel, {
  as: "vehicle",
  foreignKey: { name: "vehicleId", allowNull: false },
});

VehicleModel.hasMany(ParkingLogModel, {
  foreignKey: { name: "vehicleId", allowNull: false },
});

VacancyModel.belongsTo(OrganizationModel, {
  as: "vacancy",
  foreignKey: {
    name: "organizationId",
  },
});

OrganizationModel.hasMany(VacancyModel, {
  foreignKey: {
    name: "organizationId",
  },
});

// Vacancy - Vehicle
VehicleModel.hasOne(VacancyModel, {
  foreignKey: {
    name: "vehicleId",
    allowNull: true,
  },
  onDelete: "SET NULL",
});

VacancyModel.belongsTo(VehicleModel, {
  as: "vehicle",
  foreignKey: {
    name: "vehicleId",
    allowNull: true,
  },
  onDelete: "SET NULL",
});

//#endregion

export {
  ClientModel,
  ClientVehicleModel,
  ClientOrganizationModel,
  OrganizationModel,
  CollaboratorModel,
  VehicleModel,
  ParkingLogModel,
};
