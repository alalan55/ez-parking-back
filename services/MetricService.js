import { Op } from "sequelize";
import OrganizationService from "./OrganizationService.js";
import ParkingLogService from "./ParkingLogService.js";
import {
  HttpError,
  ConvertMinutesToHours,
  ConvertMinutesToHoursFormated,
} from "../helpers/helpers.js";

const organizationService = new OrganizationService();
const parkingLogService = new ParkingLogService();

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
      const { hours, minutes } = ConvertMinutesToHours(averageStay);

      const totalRevenue =
        (hours ? hours : 0) * 60 + (minutes ? minutes : 0) * 7; // assuming 7 is the rate per hour

      const response = {
        averageStay: isNaN(averageStay)
          ? "0h"
          : ConvertMinutesToHoursFormated(averageStay),
        totalLogs: logsCompleted.length,
        logsCompleted,
        totalRevenue,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default MetricService;
