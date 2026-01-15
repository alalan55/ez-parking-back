import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";


const ClientModel = sequelize.define("Client", {
  name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

export default ClientModel;
