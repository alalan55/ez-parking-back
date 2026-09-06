import ClientModel from "./client.model.js";
import OrganizationModel from "../organization/organization.model.js";
import VehicleModel from "../vehicle/vehicle.model.js";

class UserRepository {
  create({ transaction, payload } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return ClientModel.create(payload, transaction ? { transaction } : {});
  }

  getAll() {
    return ClientModel.findAll();
  }

  getAllByOrganiztion({ organizationId, where = {} } = {}) {
    return ClientModel.findAll({
      where,
      include: [
        {
          model: OrganizationModel,
          where: { id: organizationId },
          through: { attributes: [] },
          attributes: [],
        },
        {
          model: VehicleModel,
          as: "vehicles",
          through: { attributes: [] },
          attributes: ["id", "plate"],
        },
      ],
    });
  }

  findById({ transaction, id } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return ClientModel.findByPk(id, { transaction, id });
  }

  delete({ transaction, id } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return ClientModel.destroy(options);
  }

  update({ transaction, id, payload } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return ClientModel.update(payload, options);
  }
}

export default UserRepository;
