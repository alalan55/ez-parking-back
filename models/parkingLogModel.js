import sequelize from "../config/db.js";

import CollaboratorModel from "./collaboratorModel.js";
import VacancyModel from "./vacancyModel.js";
import OrganizationModel from "./organizationModel.js";
import Vehicle from "./vehicleModel.js";

const ParkingLogModel = sequelize.define("ParkingLog", {});

// vacancy
ParkingLogModel.hasOne(VacancyModel);
ParkingLogModel.belongsTo(VacancyModel);
VacancyModel.hasMany(ParkingLogModel);

// organization
ParkingLogModel.hasOne(OrganizationModel);
ParkingLogModel.belongsTo(OrganizationModel);
OrganizationModel.hasMany(ParkingLogModel);

// collaborator
ParkingLogModel.hasOne(CollaboratorModel);
ParkingLogModel.belongsTo(CollaboratorModel);
CollaboratorModel.hasMany(ParkingLogModel);

// vehicle
ParkingLogModel.hasOne(Vehicle);
ParkingLogModel.belongsTo(Vehicle);
Vehicle.hasMany(ParkingLogModel);



export default ParkingLogModel;
