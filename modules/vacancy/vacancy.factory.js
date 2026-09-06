import VacancyRepository from "./vacancy.repository.js";
import OrganizationRepository from "../organization/organization.repository.js";
import VacancyService from "./vacancy.service.js";

export default function makeVacancyService() {
  return new VacancyService({
    vacancyRepo: new VacancyRepository(),
    organizationRepo: new OrganizationRepository(),
  });
}
