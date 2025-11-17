const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");
const Especie = require("./Especie");
const Habitat = require("./Habitat");

const Animal = sequelize.define(
    "Animal",
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
        dataNascimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        sexo: {
            type: DataTypes.STRING(1),
            allowNull: false
        },
        condicaoSaude: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "animal",
        timestamps: false
    }
);

Animal.belongsTo(Especie, { foreignKey: "especie_id", as: "especie" });
Especie.hasMany(Animal, { foreignKey: "especie_id", as: "animais" });

Animal.belongsTo(Habitat, { foreignKey: "habitat_id", as: "habitat" });
Habitat.hasMany(Animal, { foreignKey: "habitat_id", as: "animais" });

module.exports = Animal;
