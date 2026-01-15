import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ClientOrganizationModel = sequelize.define(
  "ClientOrganization",
  {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ClientOrganizations",
    timestamps: true,
  }
);

export default ClientOrganizationModel;
