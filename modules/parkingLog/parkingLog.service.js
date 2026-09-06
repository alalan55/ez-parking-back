import AppError from "../../shared/errors/appError.js";

class ParkingLogService {
  constructor({
    parkingLogRepo,
    vacancyRepo,
    vehicleRepo,
    organizationRepo,
    collaboratorRepo,
    occupancySnapshotRepo,
    auditLogService,
    sequelize,
  }) {
    this.parkingLogRepo = parkingLogRepo;
    this.vacancyRepo = vacancyRepo;
    this.vehicleRepo = vehicleRepo;
    this.organizationRepo = organizationRepo;
    this.collaboratorRepo = collaboratorRepo;
    this.occupancySnapshotRepo = occupancySnapshotRepo;
    this.auditLogService = auditLogService;
    this.sequelize = sequelize;
  }

  // Records the occupancy right after a real state change (check-in/out).
  // Event-sourced rather than polled, so the "Taxa de ocupação" trend chart
  // is built from genuine activity only — no fabricated history.
  async recordOccupancySnapshot(organizationId, transaction) {
    const [occupied, total] = await Promise.all([
      this.vacancyRepo.count({ organizationId, status: 1, transaction }),
      this.vacancyRepo.count({ organizationId, transaction }),
    ]);

    await this.occupancySnapshotRepo.create({
      organizationId,
      occupied,
      total,
      occupancyRate: total ? (occupied / total) * 100 : 0,
      transaction,
    });
  }

  async getLogsByOganization(organizationId) {
    const organization = await this.organizationRepo.findById({
      id: organizationId,
    });
    if (!organization) throw new AppError("Organization not found", 404);

    return this.parkingLogRepo.findAllByOrganization({ organizationId });
  }

  async getVacancyLogsByOrganization(organizationId) {
    const organization = await this.organizationRepo.findById({
      id: organizationId,
    });
    if (!organization) throw new AppError("Organization not found", 404);

    return this.vacancyRepo.findAllByOrganization({ organizationId });
  }

  async checkin(payload) {
    return this.sequelize.transaction(async (transaction) => {
      const {
        collaboratorId,
        organizationId,
        vehiclePlate,
        entryTime,
        exitTime,
        observation,
      } = payload;

      const organization = await this.organizationRepo.findById({
        id: organizationId,
        transaction,
      });
      if (!organization) throw new AppError("Organization not found", 404);

      const collaborator = await this.collaboratorRepo.findOne({
        id: collaboratorId,
        organizationId,
        transaction,
      });
      
      if (!collaborator)
        throw new AppError(
          "Collaborator not found in this organization",
          404
        );

      let vehicle = await this.vehicleRepo.getByPlate({
        plate: vehiclePlate,
        transaction,
      });

      if (!vehicle) {
        vehicle = await this.vehicleRepo.create({
          transaction,
          payload: {
            plate: vehiclePlate,
            mark: payload.vehicleMark,
            model: payload.vehicleModel,
            year: payload.vehicleYear,
            color: payload.vehicleColor,
            type: payload.vehicleType,
            organizationId,
          },
        });
      }

      const alreadyParked = await this.vacancyRepo.findOccupiedByVehicle({
        vehicleId: vehicle.id,
        transaction,
      });
      if (alreadyParked) throw new AppError("Vehicle already parked", 400);

      let targetVacancy = null;

      if (payload.vacancyId) {
        const requestedVacancy = await this.vacancyRepo.findById({
          id: payload.vacancyId,
          transaction,
        });

        if (!requestedVacancy) throw new AppError("Vacancy not found", 404);
        if (requestedVacancy.organizationId !== +organizationId)
          throw new AppError("Vacancy does not belong to this organization", 400);
        if (requestedVacancy.status !== 0)
          throw new AppError("Vacancy is not available", 400);

        targetVacancy = requestedVacancy;
      } else {
        const totalVacancies = await this.vacancyRepo.count({
          organizationId,
          transaction,
        });

        const availableVacancy = await this.vacancyRepo.findAvailable({
          organizationId,
          transaction,
        });

        const vacanciesReach = organization.vacanciesQuantity;

        const canCreateNewVacancy =
          !availableVacancy && totalVacancies < vacanciesReach;
        const noVacanciesAvailable =
          !availableVacancy && totalVacancies >= vacanciesReach;

        if (noVacanciesAvailable)
          throw new AppError("No available vacancies", 400);

        targetVacancy = canCreateNewVacancy
          ? await this.vacancyRepo.create({ organizationId, transaction })
          : availableVacancy;
      }

      await this.vacancyRepo.update({
        id: targetVacancy.id,
        payload: { status: 1, vehicleId: vehicle.id },
        transaction,
      });

      const log = await this.parkingLogRepo.create({
        transaction,
        payload: {
          collaboratorId,
          organizationId,
          entryTime,
          exitTime,
          observation,
          vehicleId: vehicle.id,
          vacancyId: targetVacancy.id,
        },
      });

      await this.vacancyRepo.update({
        id: targetVacancy.id,
        payload: { status: 1, vehicleId: vehicle.id, parkingLogId: log.id },
        transaction,
      });

      await this.recordOccupancySnapshot(organizationId, transaction);

      await this.auditLogService.record({
        organizationId,
        collaboratorId,
        action: "checkin",
        resource: "Vaga",
        resourceId: targetVacancy.id,
        description: `Check-in: veículo ${vehicle.plate?.toUpperCase()} na vaga #${targetVacancy.id}`,
        transaction,
      });

      return log;
    });
  }

  async checkout(payload) {
    return this.sequelize.transaction(async (transaction) => {
      const log = await this.parkingLogRepo.findById({
        id: payload.logId,
        transaction,
      });
      if (!log) throw new AppError("Parking log not found", 404);

      const vacancy = await this.vacancyRepo.findById({
        id: log.vacancyId,
        transaction,
      });
      if (!vacancy) throw new AppError("Vacancy not found", 404);

      if (vacancy.status === 1) {
        await this.vacancyRepo.update({
          id: vacancy.id,
          payload: { status: 0, vehicleId: null, parkingLogId: null },
          transaction,
        });
      }

      await this.parkingLogRepo.update({
        id: log.id,
        payload: { exitTime: payload.exitTime },
        transaction,
      });

      await this.recordOccupancySnapshot(vacancy.organizationId, transaction);

      const vehicle = await this.vehicleRepo.findById({
        id: log.vehicleId,
        transaction,
      });

      await this.auditLogService.record({
        organizationId: vacancy.organizationId,
        collaboratorId: log.collaboratorId,
        action: "checkout",
        resource: "Vaga",
        resourceId: vacancy.id,
        description: `Check-out: veículo ${vehicle?.plate?.toUpperCase() || "?"} da vaga #${vacancy.id}`,
        transaction,
      });

      return this.parkingLogRepo.findById({ id: log.id, transaction });
    });
  }
}

export default ParkingLogService;
