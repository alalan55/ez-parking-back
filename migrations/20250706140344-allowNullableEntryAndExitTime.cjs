"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ParkingLogs_new", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entryTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      exitTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vacancyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      collaboratorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.sequelize.query(`
      INSERT INTO ParkingLogs_new (
        id, entryTime, exitTime, observation,
        vacancyId, organizationId, collaboratorId, vehicleId,
        createdAt, updatedAt
      )
      SELECT
        id, entryTime, exitTime, observation,
        vacancyId, organizationId, collaboratorId, vehicleId,
        createdAt, updatedAt
      FROM ParkingLogs;
    `);

    await queryInterface.dropTable("ParkingLogs");

    await queryInterface.renameTable("ParkingLogs_new", "ParkingLogs");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable("ParkingLogs_old", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entryTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      exitTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vacancyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      collaboratorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.sequelize.query(`
      INSERT INTO ParkingLogs_old (
        id, entryTime, exitTime, observation,
        vacancyId, organizationId, collaboratorId, vehicleId,
        createdAt, updatedAt
      )
      SELECT
        id, entryTime, exitTime, observation,
        vacancyId, organizationId, collaboratorId, vehicleId,
        createdAt, updatedAt
      FROM ParkingLogs;
    `);

    await queryInterface.dropTable("ParkingLogs");

    await queryInterface.renameTable("ParkingLogs_old", "ParkingLogs");
  },
};
