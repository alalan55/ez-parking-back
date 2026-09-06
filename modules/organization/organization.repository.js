import OrganizationModel from "./organization.model.js";

class OrganizationRepository {
  create({ payload, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return OrganizationModel.create(payload, options);
  }

  update({ id, payload, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return OrganizationModel.update(payload, options);
  }

  delete({ id, transaction } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return OrganizationModel.destroy(options);
  }

  findById({ id, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return OrganizationModel.findByPk(id, options);
  }

  findByName({ name, transaction } = {}) {
    const options = { where: { name } };
    if (transaction) options.transaction = transaction;
    return OrganizationModel.findOne(options);
  }

  getAll() {
    return OrganizationModel.findAll();
  }
}

export default OrganizationRepository;
