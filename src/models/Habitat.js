const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Habitat = sequelize.define(
    "Habitat",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: "habitat",
        timestamps: false
    }
);

module.exports = Habitat;
