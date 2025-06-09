import { ResponseHandler } from "../helpers/helpers.js";
import OrganizationService from "../services/OrganizationService.js";

const organizationService = new OrganizationService();

class OrganizationControler {
  async create(req, res) {
    try {
      const org = await organizationService.createOrg(req.body);

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
}

export default OrganizationControler;
