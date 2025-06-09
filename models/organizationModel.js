import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrganizationModel = sequelize.define("Organization", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  logo: {
    type: DataTypes.STRING,
  },
  vacanciesQuantity: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

export default OrganizationModel;
