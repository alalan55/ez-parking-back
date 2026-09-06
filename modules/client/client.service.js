import { Op } from "sequelize";

import AppError from "../../shared/errors/appError.js";

class ClientService {
  constructor({
    clientRepo,
    organizationRepo,
    clientOrganizationRepo,
    vehicleRepo,
    clientVehicleRepo,
    auditLogService,
    sequelize,
  }) {
    this.clientRepo = clientRepo;
    this.organizationRepo = organizationRepo;
    this.clientOrganizationRepo = clientOrganizationRepo;
    this.vehicleRepo = vehicleRepo;
    this.clientVehicleRepo = clientVehicleRepo;
    this.auditLogService = auditLogService;
    this.sequelize = sequelize;
  }

  async create(payload) {
    const {
      name,
      phone,
      organizationId,
      transaction: externalTransaction,
    } = payload;

    const run = async (transaction) => {
      const newClient = await this.clientRepo.create({
        transaction,
        payload: { name, phone },
      });

      if (organizationId) {
        const organization = await this.organizationRepo.findById({
          id: organizationId,
          transaction,
        });

        if (!organization) throw new AppError("Organization not found");

        await this.clientOrganizationRepo.link(
          transaction,
          newClient.id,
          organizationId
        );

        await this.auditLogService.record({
          organizationId,
          collaboratorId: payload.collaboratorId,
          action: "created",
          resource: "Cliente",
          resourceId: newClient.id,
          description: `Novo cliente cadastrado: ${newClient.name}`,
          transaction,
        });
      }

      return newClient;
    };

    if (externalTransaction) return run(externalTransaction);
    else return this.sequelize.transaction(run);
  }

  async createWithVehicle(payload) {
    return this.sequelize.transaction(async (transaction) => {
      let foundedVehicle = await this.vehicleRepo.getByPlate({
        plate: payload.plate,
        transaction,
      });

      if (!foundedVehicle) {
        foundedVehicle = await this.vehicleRepo.create({
          transaction,
          payload: {
            plate: payload.plate,
            mark: payload.mark,
            model: payload.model,
            year: payload.year,
            color: payload.color,
            type: payload.type,
            organizationId: payload.organizationId,
          },
        });
      }

      const newClient = await this.create({
        name: payload.name,
        phone: payload.phone,
        organizationId: payload.organizationId,
        transaction,
      });

      await this.clientVehicleRepo.link({
        transaction,
        clientId: newClient.id,
        vehicleId: foundedVehicle.id,
      });

      return { user: newClient, vehicle: foundedVehicle };
    });
  }

  async addVehicle(payload) {
    return this.sequelize.transaction(async (transaction) => {
      const client = await this.clientRepo.findById({
        id: payload.userId,
        transaction,
      });

      if (!client) throw new AppError("Client not found", 404);

      const organization = await this.organizationRepo.findById({
        id: payload.organizationId,
        transaction,
      });

      if (!organization) throw new AppError("Organization not found", 404);

      let vehicle = await this.vehicleRepo.getByPlate({
        plate: payload.plate,
        transaction,
      });

      if (!vehicle) {
        vehicle = await this.vehicleRepo.create({
          transaction,
          payload: {
            plate: payload.plate,
            mark: payload.mark,
            model: payload.model,
            year: payload.year,
            color: payload.color,
            type: payload.type,
            organizationId: payload.organizationId,
          },
        });
      } else {
        await this.vehicleRepo.update({
          transaction,
          id: vehicle.id,
          payload: {
            mark: payload.mark,
            model: payload.model,
            year: payload.year,
            color: payload.color,
            type: payload.type,
            organizationId: payload.organizationId,
          },
        });
      }

      await this.clientVehicleRepo.link({
        transaction,
        clientId: client.id,
        vehicleId: vehicle.id,
      });

      await this.auditLogService.record({
        organizationId: payload.organizationId,
        collaboratorId: payload.collaboratorId,
        action: "updated",
        resource: "Veículo",
        resourceId: vehicle.id,
        description: `Veículo ${vehicle.plate?.toUpperCase()} vinculado a ${client.name}`,
        transaction,
      });

      return { client, vehicle };
    });
  }

  async removeVehicle(payload) {
    return this.sequelize.transaction(async (transaction) => {
      const client = await this.clientRepo.findById({
        id: payload.userId,
        transaction,
      });

      if (!client) throw new AppError("Client not found", 404);

      const vehicle = await this.vehicleRepo.findById({
        id: payload.vehicleId,
        transaction,
      });

      if (!vehicle) throw new AppError("Vehicle not found", 404);

      await this.clientVehicleRepo.unlink({
        transaction,
        clientId: client.id,
        vehicleId: vehicle.id,
      });

      await this.auditLogService.record({
        organizationId: payload.organizationId,
        collaboratorId: payload.collaboratorId,
        action: "updated",
        resource: "Veículo",
        resourceId: vehicle.id,
        description: `Veículo ${vehicle.plate?.toUpperCase()} desvinculado de ${client.name}`,
        transaction,
      });

      return { client, vehicle };
    });
  }

  async getAll() {
    return this.clientRepo.getAll();
  }

  async getAllByOrganiztion(organizationId, querys) {
    const { name } = querys || {};
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };

    return this.clientRepo.getAllByOrganiztion({ organizationId, where });
  }

  async deleteFromOrganization(organizationId, clientId, collaboratorId) {
    return this.sequelize.transaction(async (transaction) => {
      const organization = await this.organizationRepo.findById({
        id: organizationId,
        transaction,
      });

      if (!organization) throw new AppError("Organization not found", 404);

      const client = await this.clientRepo.findById({
        transaction,
        id: clientId,
      });

      if (!client) throw new AppError("Client not found", 404);

      await this.clientOrganizationRepo.unlink(
        transaction,
        clientId,
        organizationId
      );

      await this.auditLogService.record({
        organizationId,
        collaboratorId,
        action: "deleted",
        resource: "Cliente",
        resourceId: client.id,
        description: `Cliente removido: ${client.name}`,
        transaction,
      });
    });
  }

  async getById(id) {
    return this.clientRepo.findById({ id });
  }

  async delete(id) {
    const user = await this.getById(id);

    if (!user) throw new AppError("User not found", 404);

    await this.clientRepo.delete({ id });
  }

  async update(payload) {
    const user = await this.getById(payload.id);

    if (!user) throw new AppError("User not found", 404);

    const changes = ["name", "phone"]
      .filter((field) => payload[field] !== undefined && payload[field] !== user[field])
      .map((field) => ({ field, before: user[field], after: payload[field] }));

    const result = await this.clientRepo.update({ id: payload.id, payload });

    if (changes.length) {
      await this.auditLogService.record({
        organizationId: payload.organizationId,
        collaboratorId: payload.collaboratorId,
        action: "updated",
        resource: "Cliente",
        resourceId: user.id,
        description: `Dados atualizados: ${user.name} (${changes.map((c) => c.field).join(", ")})`,
        metadata: changes,
      });
    }

    return result;
  }
}

export default ClientService;
