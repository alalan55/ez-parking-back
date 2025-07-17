import { DataTypes } from "sequelize";
import OrganizationModel from "./organizationModel.js";
import sequelize from "../config/db.js";


const roleEnum = {
  0: 'Super admin',
  1: 'Admin',
  2: 'Normal'
}

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
    defaultValue: 2,
  },
});

OrganizationModel.hasMany(CollaboratorModel,{
   foreignKey: {
    name: "organizationId",
    allowNull: true,
  },
});

CollaboratorModel.belongsTo(OrganizationModel, {
  foreignKey: {
    allowNull: true,
    name: "organizationId",
  },
  onDelete: "SET NULL",
});

export default CollaboratorModel;
