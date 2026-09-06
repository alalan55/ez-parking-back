import AppError from "../../shared/errors/appError.js";

class VehicleService {
  constructor({ vehicleRepo, organizationRepo }) {
    this.vehicleRepo = vehicleRepo;
    this.organizationRepo = organizationRepo;
  }

  async getById(id) {
    return this.vehicleRepo.findById({ id });
  }

  async getByPlate(plate) {
    return this.vehicleRepo.getByPlate({ plate: plate.toUpperCase() });
  }

  async getAll() {
    return this.vehicleRepo.getAll();
  }

  async create(payload) {
    const organization = await this.organizationRepo.findById({
      id: payload.organizationId,
    });
    if (!organization) throw new AppError("Organization not found to add vehicle", 404);

    const existingVehicle = await this.getByPlate(payload.plate);
    if (existingVehicle) {
      await existingVehicle.addOrganization(organization);
      return existingVehicle;
    }

    const newVehicle = await this.vehicleRepo.create({
      payload: {
        plate: payload.plate.toUpperCase(),
        mark: payload.mark,
        model: payload.model,
        year: payload.year,
        color: payload.color,
        type: payload.type,
      },
    });

    await newVehicle.addOrganization(organization);

    return newVehicle;
  }

  async update(payload) {
    const vehicle = await this.getById(payload.id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    vehicle.plate = payload.plate;
    vehicle.mark = payload.mark;
    vehicle.model = payload.model;
    vehicle.year = payload.year;
    vehicle.color = payload.color;
    vehicle.type = payload.type;

    await vehicle.save();

    return vehicle;
  }

  async delete(id) {
    const vehicle = await this.getById(id);
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    await this.vehicleRepo.delete({ id });
  }

  async getAllVehiclesFromClient(clientId, organizationId) {
    const organization = await this.organizationRepo.findById({ id: organizationId });
    if (!organization) throw new AppError("Organization not found", 404);

    return this.vehicleRepo.findAllByClientAndOrganization({ clientId, organizationId });
  }

  async getClientsBasedOnVehicle(plate) {
    const vehicle = await this.vehicleRepo.findByPlateLikeWithClients({ plate });
    if (!vehicle) return [];

    return vehicle.clients || [];
  }
}

export default VehicleService;
