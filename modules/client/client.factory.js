import sequelize from "../../config/db.js";
import ClientRepository from "./client.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import ClientOrganizationRepository from "../clientOrganization/clientOrganization.repository.js";
import ClientVehicleRepository from "../clientVehicle/clientVehicle.repository.js";
import VehicleRepository from "../vehicle/vehicle.repository.js";
import ClientService from "./client.service.js";

export default function makeClientService() {
  return new ClientService({
    clientRepo: new ClientRepository(),
    organizationRepo: new OrganizationRepository(),
    clientOrganizationRepo: new ClientOrganizationRepository(),
    vehicleRepo: new VehicleRepository(),
    clientVehicleRepo: new ClientVehicleRepository(),
    sequelize,
  });
}
