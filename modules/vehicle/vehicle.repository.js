import { Op } from "sequelize";
import VehicleModel from "./vehicle.model.js";
import OrganizationModel from "../organization/organization.model.js";
import ClientModel from "../client/client.model.js";

export default class VehicleRepository {
  create({ transaction, payload } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return VehicleModel.create(payload, options);
  }

  update({ transaction, id, payload } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return VehicleModel.update(payload, options);
  }

  delete({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return VehicleModel.destroy(options);
  }

  findById({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return VehicleModel.findOne(options);
  }

  getByPlate({ plate, transaction } = {}) {
    const options = { where: { plate } };
    if (transaction) options.transaction = transaction;
    return VehicleModel.findOne(options);
  }

  getAll() {
    return VehicleModel.findAll();
  }

  findAllByClientAndOrganization({ clientId, organizationId } = {}) {
    return VehicleModel.findAll({
      include: [
        {
          model: OrganizationModel,
          where: { id: organizationId },
          attributes: [],
          through: { attributes: [] },
        },
        {
          model: ClientModel,
          as: "clients",
          where: { id: clientId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });
  }

  findByPlateLikeWithClients({ plate } = {}) {
    return VehicleModel.findOne({
      where: { plate: { [Op.like]: `%${plate}%` } },
      include: [{ model: ClientModel, as: "clients", through: { attributes: [] } }],
    });
  }
}
