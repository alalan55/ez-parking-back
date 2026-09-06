import { Op } from "sequelize";

import VacancyModel from "./vacancy.model.js";
import VehicleModel from "../vehicle/vehicle.model.js";
import ParkingLogModel from "../parkingLog/parkingLog.model.js";
import ClientModel from "../client/client.model.js";

class VacancyRepository {
  create({ organizationId, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return VacancyModel.create({ organizationId }, options);
  }

  findById({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return VacancyModel.findOne(options);
  }

  update({ id, payload, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return VacancyModel.update(payload, options);
  }

  findAvailable({ organizationId, transaction } = {}) {
    const options = { where: { organizationId, status: 0 } };
    if (transaction) options.transaction = transaction;
    return VacancyModel.findOne(options);
  }

  findOccupiedByVehicle({ vehicleId, transaction } = {}) {
    const options = { where: { vehicleId, status: 1 } };
    if (transaction) options.transaction = transaction;
    return VacancyModel.findOne(options);
  }

  count({ organizationId, status, transaction } = {}) {
    const where = { organizationId };
    if (status !== undefined) where.status = status;
    const options = { where };
    if (transaction) options.transaction = transaction;
    return VacancyModel.count(options);
  }

  findAllByOrganization({ organizationId, plate } = {}) {
    const vehicleInclude = {
      model: VehicleModel,
      as: "vehicle",
      include: [{ model: ClientModel, as: "clients" }],
    };

    if (plate) {
      vehicleInclude.where = { plate: { [Op.like]: `%${plate}%` } };
    }

    return VacancyModel.findAll({
      where: { organizationId },
      include: [
        vehicleInclude,
        { model: ParkingLogModel, as: "activeVacancyLog" },
      ],
    });
  }
}

export default VacancyRepository;
