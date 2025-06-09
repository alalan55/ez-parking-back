import { OrganizationModel } from "../models/index.js";

class OrganizationService {
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
