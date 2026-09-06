import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ClientOrganizationModel = sequelize.define(
  "ClientOrganization",
  {
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "ClientOrganizations",
    timestamps: true,
    id: false,
  }
);

export default ClientOrganizationModel;
