import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const enumType = {
  0: "car",
  1: "motorcycle",
  2: "truck",
  3: "bus",
};

const VehicleModel = sequelize.define("Vehicle", {
  plate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mark: {
    type: DataTypes.STRING,
  },
  model: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.NUMBER,
  },
  color: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.NUMBER,
    defaultValue: 0,
  },
});

export default VehicleModel;
