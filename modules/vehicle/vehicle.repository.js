import { Vehicle } from "../../models/index.js";

export default class VehicleRepository {
  create({ transaction, payload } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return Vehicle.create(payload, transaction ? { transaction } : {});
  }

  update({ transaction, id, payload } = {}) {
    const options = { where: { id } };
    if (transaction) options.transaction = transaction;
    return Vehicle.update(payload, options);
  }
  
  getByPlate({ plate, transaction } = {}) {
    const options = { where: { plate } };
    if (transaction) options.transaction = transaction;
    return Vehicle.findOne(options);
  }
}
