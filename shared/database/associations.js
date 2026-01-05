import ClientModel from "../../modules/client/client.model.js";
import Vehicle from "../../models/vehicleModel.js";
import OrganizationModel from "../../models/organizationModel.js";

export function setupAssociations() {
  //#region Client - Vehicle
  ClientModel.belongsToMany(Vehicle, {
    as: "vehicles",
    through: "ClientVehicles",
    foreignKey: { name: "clientId" },
  });

  Vehicle.belongsToMany(ClientModel, {
    as: "clients",
    through: "ClientVehicles",
    foreignKey: { name: "vehicleId" },
  });

  ClientModel.belongsToMany(OrganizationModel, {
    through: "ClientOrganizations",
    foreignKey: { name: "clientId" },
  });

  OrganizationModel.belongsToMany(ClientModel, {
    through: "ClientOrganizations",
    foreignKey: { name: "organizationId" },
  });
  //#endregion
}
