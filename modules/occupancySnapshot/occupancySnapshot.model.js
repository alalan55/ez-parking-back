import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

// One row per real occupancy change (check-in/check-out), not a polled
// interval — so the history is exactly as granular as real activity, with
// zero fabricated data. Feeds the "Taxa de ocupação" trend chart in
// Métricas; naturally starts empty and builds up from here on.
const OccupancySnapshotModel = sequelize.define("OccupancySnapshot", {
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  occupied: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  occupancyRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  capturedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default OccupancySnapshotModel;
