import { ClientModel, Vehicle, OrganizationModel } from "../../models/index.js";

class OrganizationRepository {
  findById(transaction, id) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return OrganizationModel.findByPk(id, options);
  }
}

export default OrganizationRepository;
