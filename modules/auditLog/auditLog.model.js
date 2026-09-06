import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

// One row per real write operation (client/vehicle/organization CRUD,
// check-in/check-out) — recorded by the services themselves right after the
// change succeeds. No fabricated actors, IPs, hashes or session ids: only
// what the system actually knows about the event.
const AuditLogModel = sequelize.define("AuditLog", {
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  collaboratorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING, // "created" | "updated" | "deleted" | "checkin" | "checkout"
    allowNull: false,
  },
  resource: {
    type: DataTypes.STRING, // "Cliente" | "Veículo" | "Organização" | "Vaga"
    allowNull: false,
  },
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.TEXT, // optional JSON string (e.g. { field, before, after })
    allowNull: true,
  },
});

export default AuditLogModel;
