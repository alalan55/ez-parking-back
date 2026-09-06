import OrganizationRepository from "../organization/organization.repository.js";
import ParkingLogRepository from "../parkingLog/parkingLog.repository.js";
import VacancyRepository from "../vacancy/vacancy.repository.js";
import OccupancySnapshotRepository from "../occupancySnapshot/occupancySnapshot.repository.js";
import MetricService from "./metric.service.js";

export default function makeMetricService() {
  return new MetricService({
    organizationRepo: new OrganizationRepository(),
    parkingLogRepo: new ParkingLogRepository(),
    vacancyRepo: new VacancyRepository(),
    occupancySnapshotRepo: new OccupancySnapshotRepository(),
  });
}
