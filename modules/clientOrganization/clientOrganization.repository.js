import ClientOrganizationModel from "./clientOrganization.model.js";

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
  unlink(transaction, clientId, organizationId) {
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
