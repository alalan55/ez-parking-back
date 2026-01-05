import { Vehicle } from "../../models";

export default class VehicleRepository {
  create({ transaction, payload } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return Vehicle.create(payload, transaction ? { transaction } : {});
  }
  
  getByPlate({ plate, transaction } = {}) {
    const options = { where: { plate } };
    if (transaction) options.transaction = transaction;
    return Vehicle.findOne(options);
  }
}
