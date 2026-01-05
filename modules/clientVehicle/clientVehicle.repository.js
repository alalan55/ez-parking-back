import ClientVehicleModel from "./clientVehicle.model";

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
}

export default ClientVehicleRepository;
