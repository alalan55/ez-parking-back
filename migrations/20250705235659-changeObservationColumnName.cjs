"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cria a tabela temporária com o novo esquema (coluna 'observation')
    await queryInterface.createTable("ParkingLogs_new", {
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

    // Copia os dados da tabela antiga para a nova, mapeando observations → observation
    await queryInterface.sequelize.query(`
      INSERT INTO ParkingLogs_new (
        id, entryTime, exitTime, observation,
        vacancyId, organizationId, collaboratorId, vehicleId,
        createdAt, updatedAt
      )
      SELECT
        id, entryTime, exitTime, observations,
        vacancyId, organizationId, collaboratorId, vehicleId,
        createdAt, updatedAt
      FROM ParkingLogs;
    `);

    // Remove a tabela antiga
    await queryInterface.dropTable("ParkingLogs");

    // Renomeia a nova tabela para o nome original
    await queryInterface.renameTable("ParkingLogs_new", "ParkingLogs");
  },

  async down(queryInterface, Sequelize) {
    // Reverte a alteração: renomeia observation → observations

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
      observations: {
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
        id, entryTime, exitTime, observations,
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
