import { ClientOrganizationModel } from "../../models/index.js";

class ClientOrganizationRepository {
  link(transaction, clientId, organizationId) {
    return ClientOrganizationModel.create(
      {
        clientId,
        organizationId,
      },
      { transaction }
    );
  }
  unLink(transaction, clientId, organizationId) {
    return ClientOrganizationModel.destroy({
      where: {
        clientId,
        organizationId,
      },
      transaction,
    });
  }
}

export default ClientOrganizationRepository;
