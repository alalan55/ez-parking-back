import { CollaboratorModel } from "../models/index.js";

class CollaboratorService {
  async getAll() {
    try {
      const collaborators = await CollaboratorModel.findAll();
      return collaborators;
    } catch (error) {
      throw new Error("Error on fetch all collaborators");
    }
  }
}

export default CollaboratorService;
