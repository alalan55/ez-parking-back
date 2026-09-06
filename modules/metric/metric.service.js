import AppError from "../../shared/errors/appError.js";
import { ConvertMinutesToHours, ConvertMinutesToHoursFormated } from "../../helpers/helpers.js";

const HOURLY_RATE = 7;
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_LONG = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const isCompleted = (log) => Boolean(log.exitTime && log.entryTime);

const revenueForLogs = (logs) =>
  logs.filter(isCompleted).reduce((acc, log) => {
    const minutes = (new Date(log.exitTime) - new Date(log.entryTime)) / 1000 / 60;
    return acc + minutes * (HOURLY_RATE / 60);
  }, 0);

class MetricService {
  constructor({ organizationRepo, parkingLogRepo, vacancyRepo, occupancySnapshotRepo }) {
    this.organizationRepo = organizationRepo;
    this.parkingLogRepo = parkingLogRepo;
    this.vacancyRepo = vacancyRepo;
    this.occupancySnapshotRepo = occupancySnapshotRepo;
  }

  // A single calendar day, `daysAgo` days back from today (0 = today).
  dayRange(daysAgo) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
    return { start, end };
  }

  // The last `days` calendar days up to and including today.
  windowRange(days) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return { start, end };
  }

  // `days` = how many calendar days back to include, counting today (so
  // days=1 is "today only" — the original, unchanged default behavior).
  async getAverageDailyStay(orgId, days = 1) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    const { start, end } = this.windowRange(days - 1);
    const logs = await this.parkingLogRepo.findByRange({ organizationId: orgId, start, end });
    const logsCompleted = logs.filter(isCompleted);

    const durationsMinutes = logsCompleted.map(
      (log) => (new Date(log.exitTime) - new Date(log.entryTime)) / 1000 / 60
    );
    const totalMinutes = durationsMinutes.reduce((acc, m) => acc + m, 0);
    const averageStay = totalMinutes / logsCompleted.length;

    const { hours, minutes } = ConvertMinutesToHours(totalMinutes);
    const totalRevenue = ((hours || 0) * 60 + (minutes || 0)) * (HOURLY_RATE / 60);

    const occupied = await this.vacancyRepo.count({ organizationId: orgId, status: 1 });
    const occupancyRate = (occupied / organization.vacanciesQuantity) * 100;

    return {
      averageStay: isNaN(averageStay) ? "0h" : ConvertMinutesToHoursFormated(averageStay),
      minStay: durationsMinutes.length
        ? ConvertMinutesToHoursFormated(Math.min(...durationsMinutes))
        : null,
      maxStay: durationsMinutes.length
        ? ConvertMinutesToHoursFormated(Math.max(...durationsMinutes))
        : null,
      totalLogs: logsCompleted.length,
      openLogs: logs.length - logsCompleted.length,
      logsCompleted,
      totalRevenue,
      occupancyRate,
      capacity: organization.vacanciesQuantity,
    };
  }

  async getRevenueTrend(orgId, days = 7) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const { start, end } = this.dayRange(i);
      const logs = await this.parkingLogRepo.findByRange({ organizationId: orgId, start, end });
      const logsCompleted = logs.filter(isCompleted);

      result.push({
        date: start.toISOString().slice(0, 10),
        label: WEEKDAYS_SHORT[start.getDay()],
        revenue: Math.round(revenueForLogs(logsCompleted) * 100) / 100,
        checkIns: logsCompleted.length,
      });
    }

    return result;
  }

  async getVacancyUtilizationGraph(orgId, days = 30) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    const { start, end } = this.windowRange(days);
    const logs = await this.parkingLogRepo.findByRange({ organizationId: orgId, start, end });

    const counts = Array(7).fill(0);
    logs.forEach((log) => {
      if (!log.entryTime) return;
      counts[new Date(log.entryTime).getDay()] += 1;
    });

    return WEEKDAYS_LONG.map((weekday, idx) => ({ weekday, count: counts[idx] }));
  }

  // Check-ins bucketed by hour of day (0–23) — surfaces real peak-movement
  // hours from actual entryTime values, no synthetic curve.
  async getCheckinsByHour(orgId, days = 30) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    const { start, end } = this.windowRange(days);
    const logs = await this.parkingLogRepo.findByRange({ organizationId: orgId, start, end });

    const hours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      label: `${String(hour).padStart(2, "0")}h`,
      count: 0,
    }));

    logs.forEach((log) => {
      if (!log.entryTime) return;
      hours[new Date(log.entryTime).getHours()].count += 1;
    });

    return hours;
  }

  // Occupancy over time, from real event-sourced snapshots recorded on every
  // check-in/check-out (see modules/parkingLog/parkingLog.service.js). Days
  // with no activity simply have no snapshots — reported as `samples: 0`
  // rather than an invented rate, so the frontend can show "sem dados" for
  // that point instead of a fabricated 0%.
  async getOccupancyTrend(orgId, days = 7) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const { start, end } = this.dayRange(i);
      const snapshots = await this.occupancySnapshotRepo.findAllInRange({
        organizationId: orgId,
        start,
        end,
      });

      const avgRate = snapshots.length
        ? snapshots.reduce((acc, s) => acc + s.occupancyRate, 0) / snapshots.length
        : null;

      result.push({
        date: start.toISOString().slice(0, 10),
        label: WEEKDAYS_SHORT[start.getDay()],
        occupancyRate: avgRate !== null ? Math.round(avgRate * 10) / 10 : null,
        samples: snapshots.length,
      });
    }

    return result;
  }

  // Current-period vs immediately-preceding period of equal length, for the
  // KPI trend arrows. Returns `changePct: null` (not a fabricated 0%) when
  // there isn't a comparable previous period yet.
  async getPeriodSummary(orgId, days = 7) {
    const organization = await this.organizationRepo.findById({ id: orgId });
    if (!organization) throw new AppError("Organization not found", 404);

    const { start: currentStart, end: currentEnd } = this.windowRange(days - 1);
    const previousEnd = currentStart;
    const previousStart = new Date(
      currentStart.getFullYear(),
      currentStart.getMonth(),
      currentStart.getDate() - days
    );

    const [currentLogs, previousLogs, currentSnapshots, previousSnapshots] = await Promise.all([
      this.parkingLogRepo.findByRange({ organizationId: orgId, start: currentStart, end: currentEnd }),
      this.parkingLogRepo.findByRange({ organizationId: orgId, start: previousStart, end: previousEnd }),
      this.occupancySnapshotRepo.findAllInRange({ organizationId: orgId, start: currentStart, end: currentEnd }),
      this.occupancySnapshotRepo.findAllInRange({ organizationId: orgId, start: previousStart, end: previousEnd }),
    ]);

    const avgOccupancy = (snapshots) =>
      snapshots.length
        ? snapshots.reduce((acc, s) => acc + s.occupancyRate, 0) / snapshots.length
        : null;

    const pctChange = (curr, prev) =>
      prev === null || prev === 0 || curr === null
        ? null
        : Math.round(((curr - prev) / prev) * 1000) / 10;

    const currentRevenue = revenueForLogs(currentLogs);
    const previousRevenue = revenueForLogs(previousLogs);
    const currentOccupancy = avgOccupancy(currentSnapshots);
    const previousOccupancy = avgOccupancy(previousSnapshots);

    return {
      revenue: {
        current: Math.round(currentRevenue * 100) / 100,
        changePct: pctChange(currentRevenue, previousRevenue),
      },
      occupancy: {
        current: currentOccupancy !== null ? Math.round(currentOccupancy * 10) / 10 : null,
        changePct: pctChange(currentOccupancy, previousOccupancy),
      },
    };
  }
}

export default MetricService;
