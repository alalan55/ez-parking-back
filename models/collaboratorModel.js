import { DataTypes } from "sequelize";
import OrganizationModel from "./organizationModel.js";
import sequelize from "../config/db.js";

const CollaboratorModel = sequelize.define("Collaborator", {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  hashPassword: {
    type: DataTypes.STRING,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 1,
  },
});

OrganizationModel.hasMany(CollaboratorModel);
CollaboratorModel.belongsTo(OrganizationModel);

export default CollaboratorModel;
