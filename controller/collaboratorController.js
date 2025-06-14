import { ResponseHandler } from "../helpers/helpers.js";
import CollaboratorService from "../services/CollaboratorService.js";

const collaboratorSerivce = new CollaboratorService();

class CollaboratorController {
  async getAll(req, res) {
    try {
      const collaborators = await collaboratorSerivce.getAll();
      res
        .status(200)
        .send(ResponseHandler("Collaborators retrieved:", collaborators));
    } catch (error) {
      res
        .status(400)
        .send(
          ResponseHandler(error.message || "Error on fetch all collaborators")
        );
    }
  }
}

export default CollaboratorController;
