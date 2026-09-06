import AppError from "../../shared/errors/appError.js";

class OrganizationService {
  constructor({ organizationRepo, vacancyRepo, auditLogService }) {
    this.organizationRepo = organizationRepo;
    this.vacancyRepo = vacancyRepo;
    this.auditLogService = auditLogService;
  }

  async create(payload) {
    const { name, address, email, phone, logo, vacanciesQuantity } = payload;

    const exists = await this.organizationRepo.findByName({ name });
    if (exists) throw new AppError("Organization already created!", 400);

    return this.organizationRepo.create({
      payload: { name, address, email, phone, logo, vacanciesQuantity },
    });
  }

  async findById(id) {
    return this.organizationRepo.findById({ id });
  }

  async findByName(name) {
    return this.organizationRepo.findByName({ name });
  }

  async getAll() {
    return this.organizationRepo.getAll();
  }

  async update(payload) {
    const org = await this.findById(payload.id);
    if (!org) throw new AppError("Organization not found", 404);

    const occupiedCount = await this.vacancyRepo.count({
      organizationId: payload.id,
      status: 1,
    });

    if (payload.vacanciesQuantity < occupiedCount) {
      throw new AppError(
        "Cannot update organization with less vacancies than current occupied",
        400
      );
    }

    const fields = ["name", "address", "email", "phone", "logo", "vacanciesQuantity"];
    const changes = fields
      .filter((field) => payload[field] !== undefined && payload[field] !== org[field])
      .map((field) => ({ field, before: org[field], after: payload[field] }));

    await this.organizationRepo.update({
      id: payload.id,
      payload: {
        name: payload.name,
        address: payload.address,
        email: payload.email,
        phone: payload.phone,
        logo: payload.logo,
        vacanciesQuantity: payload.vacanciesQuantity,
      },
    });

    if (changes.length) {
      await this.auditLogService.record({
        organizationId: payload.id,
        collaboratorId: payload.collaboratorId,
        action: "updated",
        resource: "Organização",
        resourceId: payload.id,
        description: `Dados da organização atualizados (${changes.map((c) => c.field).join(", ")})`,
        metadata: changes,
      });
    }

    return this.findById(payload.id);
  }

  async delete(id) {
    const org = await this.findById(id);
    if (!org) throw new AppError("Organization not found", 404);

    await this.organizationRepo.delete({ id });
  }

  async getOccupation(organizationId) {
    const org = await this.findById(organizationId);
    if (!org) throw new AppError("Organization not found", 404);

    const occupied = await this.vacancyRepo.count({
      organizationId,
      status: 1,
    });

    return {
      occupied,
      available: org.vacanciesQuantity - occupied,
      occupiedPercentage: (occupied / org.vacanciesQuantity) * 100,
      organizationVacancies: org.vacanciesQuantity,
    };
  }
}

export default OrganizationService;
