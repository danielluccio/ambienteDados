const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize, conectarBD } = require("./db");
const Especie = require("./models/Especie");
const Habitat = require("./models/Habitat");
const Animal = require("./models/Animal");

const app = express();
const PORT = 8080; // mesma porta do front

app.use(cors());
app.use(express.json());

// servir arquivos estáticos (index.html, script.js) da pasta /public
app.use(express.static(path.join(__dirname, "..", "public")));

// ================== ROTAS ESPECIE ==================

app.get("/api/especies", async (req, res) => {
    try {
        const especies = await Especie.findAll();
        res.json(especies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao listar espécies" });
    }
});

app.get("/api/especies/:id", async (req, res) => {
    try {
        const especie = await Especie.findByPk(req.params.id);
        if (!especie) return res.status(404).json({ erro: "Espécie não encontrada" });
        res.json(especie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar espécie" });
    }
});

app.post("/api/especies", async (req, res) => {
    try {
        const especie = await Especie.create(req.body);
        res.status(201).json(especie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar espécie" });
    }
});

app.put("/api/especies/:id", async (req, res) => {
    try {
        const especie = await Especie.findByPk(req.params.id);
        if (!especie) return res.status(404).json({ erro: "Espécie não encontrada" });

        await especie.update(req.body);
        res.json(especie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao atualizar espécie" });
    }
});

app.delete("/api/especies/:id", async (req, res) => {
    try {
        const especie = await Especie.findByPk(req.params.id);
        if (!especie) return res.status(404).json({ erro: "Espécie não encontrada" });

        await especie.destroy();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao deletar espécie" });
    }
});

// ================== ROTAS HABITAT ==================

app.get("/api/habitats", async (req, res) => {
    try {
        const habitats = await Habitat.findAll();
        res.json(habitats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao listar habitats" });
    }
});

app.get("/api/habitats/:id", async (req, res) => {
    try {
        const habitat = await Habitat.findByPk(req.params.id);
        if (!habitat) return res.status(404).json({ erro: "Habitat não encontrado" });
        res.json(habitat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar habitat" });
    }
});

app.post("/api/habitats", async (req, res) => {
    try {
        const habitat = await Habitat.create(req.body);
        res.status(201).json(habitat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar habitat" });
    }
});

app.put("/api/habitats/:id", async (req, res) => {
    try {
        const habitat = await Habitat.findByPk(req.params.id);
        if (!habitat) return res.status(404).json({ erro: "Habitat não encontrado" });

        await habitat.update(req.body);
        res.json(habitat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao atualizar habitat" });
    }
});

app.delete("/api/habitats/:id", async (req, res) => {
    try {
        const habitat = await Habitat.findByPk(req.params.id);
        if (!habitat) return res.status(404).json({ erro: "Habitat não encontrado" });

        await habitat.destroy();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao deletar habitat" });
    }
});

// ================== ROTAS ANIMAL ==================

// rotas mais específicas primeiro
app.get("/api/animais/por-especie/:nome", async (req, res) => {
    try {
        const nome = req.params.nome;
        const animais = await Animal.findAll({
            include: [
                { model: Especie, as: "especie", where: { nomeComum: nome } },
                { model: Habitat, as: "habitat" }
            ]
        });
        res.json(animais);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar animais por espécie" });
    }
});

app.get("/api/animais/por-habitat/:tipo", async (req, res) => {
    try {
        const tipo = req.params.tipo;
        const animais = await Animal.findAll({
            include: [
                { model: Especie, as: "especie" },
                { model: Habitat, as: "habitat", where: { tipo } }
            ]
        });
        res.json(animais);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar animais por habitat" });
    }
});

app.get("/api/animais/mais-velho", async (req, res) => {
    try {
        const animal = await Animal.findOne({
            order: [["dataNascimento", "ASC"]],
            include: [
                { model: Especie, as: "especie" },
                { model: Habitat, as: "habitat" }
            ]
        });
        res.json(animal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar animal mais velho" });
    }
});

app.get("/api/animais/media-idade-por-especie", async (req, res) => {
    try {
        const [results] = await sequelize.query(`
      SELECT e.nome_comum AS especie,
             AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, a.data_nascimento))) AS idade_media
      FROM animal a
      JOIN especie e ON a.especie_id = e.id
      GROUP BY e.nome_comum
      ORDER BY e.nome_comum;
    `);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao calcular média de idade" });
    }
});

// CRUD básico de animais

app.get("/api/animais", async (req, res) => {
    try {
        const animais = await Animal.findAll({
            include: [
                { model: Especie, as: "especie" },
                { model: Habitat, as: "habitat" }
            ]
        });
        res.json(animais);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao listar animais" });
    }
});

app.get("/api/animais/:id", async (req, res) => {
    try {
        const animal = await Animal.findByPk(req.params.id, {
            include: [
                { model: Especie, as: "especie" },
                { model: Habitat, as: "habitat" }
            ]
        });
        if (!animal) return res.status(404).json({ erro: "Animal não encontrado" });
        res.json(animal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar animal" });
    }
});

app.post("/api/animais", async (req, res) => {
    try {
        const { nome, dataNascimento, sexo, condicaoSaude, especie, habitat } = req.body;

        const animal = await Animal.create({
            nome,
            dataNascimento,
            sexo,
            condicaoSaude,
            especie_id: especie.id,
            habitat_id: habitat.id
        });

        const animalCompleto = await Animal.findByPk(animal.id, {
            include: [
                { model: Especie, as: "especie" },
                { model: Habitat, as: "habitat" }
            ]
        });

        res.status(201).json(animalCompleto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar animal" });
    }
});

app.put("/api/animais/:id", async (req, res) => {
    try {
        const animal = await Animal.findByPk(req.params.id);
        if (!animal) return res.status(404).json({ erro: "Animal não encontrado" });

        const { nome, dataNascimento, sexo, condicaoSaude, especie, habitat } = req.body;

        await animal.update({
            nome,
            dataNascimento,
            sexo,
            condicaoSaude,
            especie_id: especie.id,
            habitat_id: habitat.id
        });

        const animalAtualizado = await Animal.findByPk(animal.id, {
            include: [
                { model: Especie, as: "especie" },
                { model: Habitat, as: "habitat" }
            ]
        });

        res.json(animalAtualizado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao atualizar animal" });
    }
});

app.delete("/api/animais/:id", async (req, res) => {
    try {
        const animal = await Animal.findByPk(req.params.id);
        if (!animal) return res.status(404).json({ erro: "Animal não encontrado" });

        await animal.destroy();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao deletar animal" });
    }
});

// ================== SEED / INICIALIZAÇÃO ==================

async function seedInicial() {
    const countEspecie = await Especie.count();
    if (countEspecie > 0) return;

    console.log("🔄 Populando dados iniciais...");

    const [leao, elefante, girafa, pinguim, cobra] = await Promise.all([
        Especie.create({ nomeComum: "Leão", nomeCientifico: "Panthera leo", grupo: "Mamífero" }),
        Especie.create({ nomeComum: "Elefante", nomeCientifico: "Loxodonta africana", grupo: "Mamífero" }),
        Especie.create({ nomeComum: "Girafa", nomeCientifico: "Giraffa camelopardalis", grupo: "Mamífero" }),
        Especie.create({ nomeComum: "Pinguim", nomeCientifico: "Aptenodytes forsteri", grupo: "Ave" }),
        Especie.create({ nomeComum: "Cobra", nomeCientifico: "Serpentes spp.", grupo: "Réptil" })
    ]);

    const [savana1, savana2, aquario, terrario, floresta] = await Promise.all([
        Habitat.create({ nome: "Savana 1", tipo: "savana", descricao: "Área ampla com gramíneas e poucas árvores" }),
        Habitat.create({ nome: "Savana 2", tipo: "savana", descricao: "Área semelhante à Savana 1, para grandes felinos" }),
        Habitat.create({ nome: "Aquário Polar", tipo: "aquático", descricao: "Ambiente frio para pinguins" }),
        Habitat.create({ nome: "Terrário Répteis", tipo: "deserto", descricao: "Ambiente seco e quente para répteis" }),
        Habitat.create({ nome: "Floresta Tropical", tipo: "floresta", descricao: "Ambiente úmido com vegetação densa" })
    ]);

    await Promise.all([
        Animal.create({ nome: "Simba", dataNascimento: "2015-05-10", sexo: "M", condicaoSaude: "Saudável", especie_id: leao.id, habitat_id: savana2.id }),
        Animal.create({ nome: "Nala", dataNascimento: "2016-08-15", sexo: "F", condicaoSaude: "Saudável", especie_id: leao.id, habitat_id: savana2.id }),
        Animal.create({ nome: "Dumbo", dataNascimento: "2010-03-22", sexo: "M", condicaoSaude: "Em observação", especie_id: elefante.id, habitat_id: savana1.id }),
        Animal.create({ nome: "Ellie", dataNascimento: "2012-11-05", sexo: "F", condicaoSaude: "Saudável", especie_id: elefante.id, habitat_id: savana1.id }),
        Animal.create({ nome: "Longneck", dataNascimento: "2018-01-30", sexo: "M", condicaoSaude: "Saudável", especie_id: girafa.id, habitat_id: floresta.id }),
        Animal.create({ nome: "Spot", dataNascimento: "2019-07-19", sexo: "F", condicaoSaude: "Saudável", especie_id: girafa.id, habitat_id: floresta.id }),
        Animal.create({ nome: "Pingo", dataNascimento: "2020-02-01", sexo: "M", condicaoSaude: "Saudável", especie_id: pinguim.id, habitat_id: aquario.id }),
        Animal.create({ nome: "Fria", dataNascimento: "2019-12-11", sexo: "F", condicaoSaude: "Saudável", especie_id: pinguim.id, habitat_id: aquario.id }),
        Animal.create({ nome: "Slytherin", dataNascimento: "2014-09-09", sexo: "M", condicaoSaude: "Em tratamento", especie_id: cobra.id, habitat_id: terrario.id }),
        Animal.create({ nome: "Víbora", dataNascimento: "2013-04-25", sexo: "F", condicaoSaude: "Saudável", especie_id: cobra.id, habitat_id: terrario.id })
    ]);

    console.log("✅ Dados iniciais populados.");
}

async function start() {
    await conectarBD();

    // cria/atualiza tabelas sem dropar
    await sequelize.sync({ alter: true });

    await seedInicial();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
}

start();
