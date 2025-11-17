const { Sequelize } = require("sequelize");

// AJUSTE AQUI: nome do banco, usuário e senha
const DB_NAME = "zoologico";
const DB_USER = "postgres";
const DB_PASS = "Dn250705!";
const DB_HOST = "localhost";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "postgres",
    logging: false
});

async function conectarBD() {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado ao PostgreSQL com sucesso.");
    } catch (err) {
        console.error("❌ Erro ao conectar no banco:", err);
    }
}

module.exports = { sequelize, conectarBD };
