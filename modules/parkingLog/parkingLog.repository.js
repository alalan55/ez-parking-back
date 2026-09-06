import { Op } from "sequelize";
import ParkingLogModel from "./parkingLog.model.js";
import OrganizationModel from "../organization/organization.model.js";
import CollaboratorModel from "../collaborator/collaborator.model.js";
import VehicleModel from "../vehicle/vehicle.model.js";
import VacancyModel from "../vacancy/vacancy.model.js";

class ParkingLogRepository {
  create({ payload, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return ParkingLogModel.create(payload, options);
  }

  findById({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return ParkingLogModel.findOne(options);
  }

  update({ id, payload, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return ParkingLogModel.update(payload, options);
  }

  // Plain range query — callers group/aggregate in JS (weekday, hour-of-day,
  // completed vs. open, ...) instead of each needing its own raw-SQL query.
  findByRange({ organizationId, start, end, transaction } = {}) {
    const options = {
      where: {
        organizationId,
        entryTime: { [Op.between]: [start, end] },
      },
    };
    if (transaction) options.transaction = transaction;
    return ParkingLogModel.findAll(options);
  }

  findAllByOrganization({ organizationId } = {}) {
    return ParkingLogModel.findAll({
      where: { organizationId },
      include: [
        { model: OrganizationModel, as: "organization" },
        {
          model: CollaboratorModel,
          as: "collaborator",
          attributes: { exclude: ["hashPassword"] },
        },
        { model: VehicleModel, as: "vehicle" },
        { model: VacancyModel, as: "vacancy" },
      ],
    });
  }
}

export default ParkingLogRepository;
