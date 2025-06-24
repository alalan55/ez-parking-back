import sequelize from "../config/db.js";

import CollaboratorModel from "./collaboratorModel.js";
import VacancyModel from "./vacancyModel.js";
import OrganizationModel from "./organizationModel.js";
import Vehicle from "./vehicleModel.js";

const ParkingLogModel = sequelize.define("ParkingLog", {});

// vacancy
ParkingLogModel.belongsTo(VacancyModel);
VacancyModel.hasMany(ParkingLogModel);
VacancyModel.belongsTo(ParkingLogModel, {
  as: "activeVacancyLog",
  foreignKey: {
    name: "ParkingLogId",
    allowNull: true,
  },
  onDelete: "SET NULL",
});

// organization
ParkingLogModel.belongsTo(OrganizationModel);
OrganizationModel.hasMany(ParkingLogModel);

// collaborator
ParkingLogModel.belongsTo(CollaboratorModel);
CollaboratorModel.hasMany(ParkingLogModel);

// vehicle
ParkingLogModel.belongsTo(Vehicle);
Vehicle.hasMany(ParkingLogModel);

export default ParkingLogModel;
