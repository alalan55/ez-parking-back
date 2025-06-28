import { ResponseHandler } from "../helpers/helpers.js";
import OrganizationService from "../services/OrganizationService.js";

const organizationService = new OrganizationService();

class OrganizationControler {
  async getAll(req, res) {
    try {
      const orgs = await organizationService.getAll();
      return res
        .status(200)
        .send(ResponseHandler("Organizations retrieved", orgs));
    } catch (error) {
      res.status(400).send(ResponseHandler("Erro on fetch all organizations"));
    }
  }
  async create(req, res) {
    try {
      const org = await organizationService.create(req.body);

      res.status(201).send(ResponseHandler("Organization created", org));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail on create organization"));
    }
  }

  async findByName(req, res) {
    try {
      const org = await organizationService.findByname(req.params.name);
      if (!org) res.status(404).send(ResponseHandler("Organization not found"));

      res.status(200).send(ResponseHandler("Organization retrieved", org));
    } catch (error) {
      res.status(404).send(ResponseHandler("Fail to get organization by name"));
    }
  }

  async findById(req, res) {
    try {
      const org = await organizationService.findById(req.params.id);
      if (!org) res.status(404).send(ResponseHandler("Organization not found"));

      res.status(200).send(ResponseHandler("Organization retrieved", org));
    } catch (error) {
      res.status(404).send(ResponseHandler("Fail to get organization by id"));
    }
  }

  async update(req, res) {
    try {
      const org = await organizationService.update(req.body);
      res.status(200).send(ResponseHandler("Organization updated", org));
    } catch (error) {
      res.send(ResponseHandler(error.message || "Fail to update organization"));
    }
  }

  async delete(req, res) {
    try {
      await organizationService.delete(req.params.id);
      res.status(200).send(ResponseHandler("Organization deleted"));
    } catch (error) {
      res
        .status(400)
        .send(ResponseHandler(error.message || "Fail to delete organization"));
    }
  }

  async getOccupation(req, res) {
    try {
      const occupation = await organizationService.getOccupation(req.params.id);

      res.status(200).send(ResponseHandler("Occupation retrieved", occupation));
    } catch (error) {
      res
        .status(error.status || 400)
        .send(ResponseHandler(error.message || "Fail to get occupation"));
    }
  }
}

export default OrganizationControler;
