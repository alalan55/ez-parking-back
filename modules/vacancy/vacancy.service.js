import AppError from "../../shared/errors/appError.js";

class VacancyService {
  constructor({ vacancyRepo, organizationRepo }) {
    this.vacancyRepo = vacancyRepo;
    this.organizationRepo = organizationRepo;
  }

  async getById(id) {
    const vacancy = await this.vacancyRepo.findById({ id });
    if (!vacancy) throw new AppError("Vacancy not found", 404);
    return vacancy;
  }

  async getDashboard(organizationId, query = {}) {
    const organization = await this.organizationRepo.findById({
      id: organizationId,
    });
    if (!organization) throw new AppError("Organization not found", 404);

    const [vacancies, occupied] = await Promise.all([
      this.vacancyRepo.findAllByOrganization({
        organizationId,
        plate: query.plate,
      }),
      this.vacancyRepo.count({ organizationId, status: 1 }),
    ]);

    const occupancy = {
      occupied,
      available: organization.vacanciesQuantity - occupied,
      occupiedPercentage: (occupied / organization.vacanciesQuantity) * 100,
      organizationVacancies: organization.vacanciesQuantity,
    };

    return { vacancies, occupancy };
  }
}

export default VacancyService;
