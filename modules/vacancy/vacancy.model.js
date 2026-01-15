import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const enumStatus = {
  0: "available",
  1: "ocupied",
};

const VacancyModel = sequelize.define("Vacancy", {
  status: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default VacancyModel;
