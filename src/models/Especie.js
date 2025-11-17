const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Especie = sequelize.define(
    "Especie",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nomeComum: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nomeCientifico: {
            type: DataTypes.STRING
        },
        grupo: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "especie",
        timestamps: false
    }
);

module.exports = Especie;
