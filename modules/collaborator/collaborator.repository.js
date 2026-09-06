import { Op } from "sequelize";
import CollaboratorModel from "./collaborator.model.js";

class CollaboratorRepository {
  findByEmail({ email, excludeId, transaction } = {}) {
    const where = { email };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    const options = { where };
    if (transaction) options.transaction = transaction;
    return CollaboratorModel.findOne(options);
  }

  findOne({ id, organizationId, transaction } = {}) {
    const options = { where: { id, organizationId } };
    if (transaction) options.transaction = transaction;
    return CollaboratorModel.findOne(options);
  }

  findById({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return CollaboratorModel.findOne(options);
  }

  create({ payload, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return CollaboratorModel.create(payload, options);
  }

  update({ id, payload, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return CollaboratorModel.update(payload, options);
  }

  delete({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return CollaboratorModel.destroy(options);
  }

  getAll() {
    return CollaboratorModel.findAll();
  }

  findAllByOrganization({ organizationId } = {}) {
    return CollaboratorModel.findAll({ where: { organizationId } });
  }
}

export default CollaboratorRepository;
