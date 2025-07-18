import { Op } from "sequelize";
import OrganizationService from "./OrganizationService.js";
import ParkingLogService from "./ParkingLogService.js";
import VacancyService from "./VacancyService.js";

import {
  HttpError,
  ConvertMinutesToHours,
  ConvertMinutesToHoursFormated,
} from "../helpers/helpers.js";

const organizationService = new OrganizationService();
const parkingLogService = new ParkingLogService();
const vacancyService = new VacancyService();

class MetricService {
  async getAverageDailyStay(orgId) {
    try {
      const organization = await organizationService.findById(orgId);
      if (!organization) throw new HttpError("Organization not found", 404);

      const today = new Date();

      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const logs = await parkingLogService.getLogsBasedOnRange(
        organization.id,
        startOfDay,
        endOfDay
      );

      const logsCompleted = logs.filter(
        (log) => log.exitTime !== null && log.entryTime !== null
      );

      const totalMinutes = logsCompleted.reduce((acc, log) => {
        const entry = new Date(log.entryTime);
        const exit = new Date(log.exitTime);
        const minutes = (exit - entry) / 1000 / 60;
        return acc + minutes;
      }, 0);

      const averageStay = totalMinutes / logsCompleted.length;

      const { hours, minutes } = ConvertMinutesToHours(totalMinutes);

      const totalRevenue =
        ((hours ? hours : 0) * 60 + (minutes ? minutes : 0)) * (7 / 60); // assuming 7 is the value per hour

      const occupied =
        await vacancyService.getVacancysCoutenByStatusAndOrganization(
          organization.id,
          1
        );

      const occupancyRate = (occupied / organization.vacanciesQuantity) * 100;

      const response = {
        averageStay: isNaN(averageStay)
          ? "0h"
          : ConvertMinutesToHoursFormated(averageStay),
        totalLogs: logsCompleted.length,
        logsCompleted,
        totalRevenue,
        occupancyRate,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getVacancyUtilizationGraph(orgId) {
    try {
      const organization = await organizationService.findById(orgId);
      if (!organization) throw new HttpError("Organization not found", 404);

      // get last 30 days
      const today = new Date();

      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 30
      );

      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const logs = await parkingLogService.getLogsBasedOnRangeGroupedByDay(
        organization.id,
        startDate,
        endDate
      );

      return logs;
    } catch (error) {
      throw error;
    }
  }
}

export default MetricService;
