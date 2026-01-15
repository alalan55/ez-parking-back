import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ParkingLogModel = sequelize.define("ParkingLog", {
  entryTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  exitTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  observation: {
    type: DataTypes.STRING,
  },
});

export default ParkingLogModel;
