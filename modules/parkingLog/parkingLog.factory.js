import sequelize from "../../config/db.js";
import ParkingLogRepository from "./parkingLog.repository.js";
import VacancyRepository from "../vacancy/vacancy.repository.js";
import VehicleRepository from "../vehicle/vehicle.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import CollaboratorRepository from "../collaborator/collaborator.repository.js";
import OccupancySnapshotRepository from "../occupancySnapshot/occupancySnapshot.repository.js";
import makeAuditLogService from "../auditLog/auditLog.factory.js";
import ParkingLogService from "./parkingLog.service.js";

export default function makeParkingLogService() {
  return new ParkingLogService({
    parkingLogRepo: new ParkingLogRepository(),
    vacancyRepo: new VacancyRepository(),
    vehicleRepo: new VehicleRepository(),
    organizationRepo: new OrganizationRepository(),
    collaboratorRepo: new CollaboratorRepository(),
    occupancySnapshotRepo: new OccupancySnapshotRepository(),
    auditLogService: makeAuditLogService(),
    sequelize,
  });
}
