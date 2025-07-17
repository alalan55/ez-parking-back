import { or } from "sequelize";
import { OrganizationModel } from "../models/index.js";

import VacancyService from "./VacancyService.js";

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const vacancyService = new VacancyService();

class OrganizationService {
  async getOccupation(organizationId) {
    try {
      const organization = await OrganizationModel.findOne({
        where: { id: organizationId },
      });

      if (!organization) throw new Error("Organization not found");

      const occupied =
        await vacancyService.getVacancysCoutenByStatusAndOrganization(
          organizationId,
          1
        );

      const occupiedPercentage =
        (occupied / organization.vacanciesQuantity) * 100;

      const available = organization.vacanciesQuantity - occupied;

      return {
        occupied,
        available,
        occupiedPercentage,
        organizationVacancies: organization.vacanciesQuantity,
      };
    } catch (error) {
      throw error;
    }
  }
  async create(payload) {
    try {
      const { name, address, email, phone, logo, vacanciesQuantity } = payload;

      const exists = await this.findByname(name);

      if (exists) throw new Error("Organization already created!");

      const newOrganization = await OrganizationModel.create({
        name,
        address,
        email,
        phone,
        logo,
        vacanciesQuantity,
      });

      return newOrganization;
    } catch (error) {
      throw error;
    }
  }
  async findByname(name) {
    try {
      const org = await OrganizationModel.findOne({ where: { name } });
      return org;
    } catch (error) {
      throw error;
    }
  }
  async findById(id) {
    try {
      const org = await OrganizationModel.findByPk(id);
      return org;
    } catch (error) {
      throw error;
    }
  }
  async update(payload) {
    try {
      const org = await this.findById(payload.id);

      if (!org) throw new Error("Organization not found");

      const orgVacancyCount =
        await vacancyService.getVacanciesCountByOrganization(payload.id);

      if (payload.vacanciesQuantity < orgVacancyCount) {
        throw new HttpError(
          "Cannot update organization with less vacancies than current occupied",
          400
        );
      }

      org.name = payload.name;
      org.address = payload.address;
      org.email = payload.email;
      org.phone = payload.phone;
      org.logo = payload.logo;
      org.vacanciesQuantity = payload.vacanciesQuantity;

      await org.save();

      return org;
    } catch (error) {
      throw error;
    }
  }
  async getAll() {
    try {
      const orgs = await OrganizationModel.findAll();
      return orgs;
    } catch (error) {
      throw error;
    }
  }
  async delete(id) {
    try {
      const founded = await OrganizationModel.findOne({ where: { id } });

      if (!founded) throw new Error("Org not founded");

      await founded.destroy();
    } catch (error) {
      throw error;
    }
  }
}

export default OrganizationService;
