import VehicleRepository from "./vehicle.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import VehicleService from "./vehicle.service.js";

export default function makeVehicleService() {
  return new VehicleService({
    vehicleRepo: new VehicleRepository(),
    organizationRepo: new OrganizationRepository(),
  });
}
