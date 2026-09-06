import { Op } from "sequelize";
import OccupancySnapshotModel from "./occupancySnapshot.model.js";

class OccupancySnapshotRepository {
  create({ organizationId, occupied, total, occupancyRate, transaction } = {}) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return OccupancySnapshotModel.create(
      { organizationId, occupied, total, occupancyRate },
      options
    );
  }

  findAllInRange({ organizationId, start, end } = {}) {
    return OccupancySnapshotModel.findAll({
      where: {
        organizationId,
        capturedAt: { [Op.gte]: start, [Op.lt]: end },
      },
      order: [["capturedAt", "ASC"]],
    });
  }
}

export default OccupancySnapshotRepository;
