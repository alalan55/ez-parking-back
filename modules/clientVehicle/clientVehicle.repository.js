import ClientVehicleModel from "./clientVehicle.model.js";

class ClientVehicleRepository {
  link({ transaction, clientId, vehicleId } = {}) {
    return ClientVehicleModel.create(
      {
        clientId,
        vehicleId,
      },
      transaction ? { transaction } : {}
    );
  }

  unlink({ transaction, clientId, vehicleId } = {}) {
    const options = {
      where: {
        clientId,
        vehicleId,
      },
    };
    if (transaction) options.transaction = transaction;
    return ClientVehicleModel.destroy(options);
  }
}

export default ClientVehicleRepository;
