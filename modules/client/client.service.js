import { Op } from "sequelize";

import AppError from "../../shared/errors/appError.js";

class ClientService {
  constructor({
    clientRepo,
    organizationRepo,
    clientOrganizationRepo,
    vehicleRepo,
    clientVehicleRepo,
    sequelize,
  }) {
    this.clientRepo = clientRepo;
    this.organizationRepo = organizationRepo;
    this.clientOrganizationRepo = clientOrganizationRepo;
    this.vehicleRepo = vehicleRepo;
    this.clientVehicleRepo = clientVehicleRepo;
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
        const organization = await this.organizationRepo.findById(
          organizationId,
          transaction
        );

        if (!organization) throw new AppError("Organization not found");

        await this.clientOrganizationRepo.link(
          transaction,
          newClient.id,
          organizationId
        );
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

      const organization = await this.organizationRepo.findById(
        transaction,
        payload.organizationId
      );

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

  async deleteFromOrganization(organizationId, clientId) {
    return this.sequelize.transaction(async (transaction) => {
      const organization = await this.organizationRepo.findById(
        organizationId,
        transaction
      );

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

    return this.clientRepo.update({ id: payload.id, payload });
  }
  
}

export default ClientService;
