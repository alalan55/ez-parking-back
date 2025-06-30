import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Vehicle from "./vehicleModel.js";
import OrganizationModel from "./organizationModel.js";

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

ClientModel.belongsToMany(OrganizationModel, {
//  as: 'client',
  through: "ClientOrganizations",
  foreignKey: { name: "clientId" },
});

OrganizationModel.belongsToMany(ClientModel, {
 // as: 'organization',
  through: "ClientOrganizations",
  foreignKey: { name: "organizationId" },
});

export default ClientModel;
