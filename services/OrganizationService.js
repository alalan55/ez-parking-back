import { OrganizationModel } from "../models/index.js";

class OrganizationService {
  async createOrg(payload) {
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
}

export default OrganizationService;
