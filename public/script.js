const API_BASE = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
    carregarEspecies();
    carregarHabitats();
    listarAnimais();

    const form = document.getElementById("animalForm");
    form.addEventListener("submit", salvarAnimal);
});

async function carregarEspecies() {
    const select = document.getElementById("especie");
    select.innerHTML = "<option value=''>Selecione...</option>";

    try {
        const resp = await fetch(`${API_BASE}/especies`);
        const especies = await resp.json();

        especies.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = `${e.nomeComum} (${e.grupo || ""})`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Erro ao carregar espécies:", err);
        alert("Erro ao carregar espécies. Veja o console.");
    }
}

async function carregarHabitats() {
    const select = document.getElementById("habitat");
    select.innerHTML = "<option value=''>Selecione...</option>";

    try {
        const resp = await fetch(`${API_BASE}/habitats`);
        const habitats = await resp.json();

        habitats.forEach(h => {
            const opt = document.createElement("option");
            opt.value = h.id;
            opt.textContent = `${h.nome} (${h.tipo})`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Erro ao carregar habitats:", err);
        alert("Erro ao carregar habitats. Veja o console.");
    }
}

async function listarAnimais() {
    limparFiltrosInputs();

    try {
        const resp = await fetch(`${API_BASE}/animais`);
        const animais = await resp.json();
        preencherTabela(animais);
    } catch (err) {
        console.error("Erro ao listar animais:", err);
        alert("Erro ao listar animais. Veja o console.");
    }
}

function preencherTabela(animais) {
    const tbody = document.querySelector("#tabelaAnimais tbody");
    tbody.innerHTML = "";

    animais.forEach(a => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${a.id}</td>
            <td>${a.nome}</td>
            <td>${a.especie ? a.especie.nomeComum : ""}</td>
            <td>${a.habitat ? a.habitat.nome : ""}</td>
            <td>${a.sexo}</td>
            <td>${a.dataNascimento}</td>
            <td>${renderCondicaoSaude(a.condicaoSaude)}</td>
            <td class="actions">
                <button onclick="editarAnimal(${a.id})">Editar</button>
                <button onclick="deletarAnimal(${a.id})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function renderCondicaoSaude(cond) {
    if (!cond) return "";
    let classe = "badge-healthy";

    if (cond === "Em observação") {
        classe = "badge-warning";
    } else if (cond === "Em tratamento") {
        classe = "badge-danger";
    }

    return `<span class="badge ${classe}">${cond}</span>`;
}

async function salvarAnimal(event) {
    event.preventDefault();

    const id = document.getElementById("animalId").value;
    const nome = document.getElementById("nome").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const sexo = document.getElementById("sexo").value;
    const condicaoSaude = document.getElementById("condicaoSaude").value;
    const especieId = document.getElementById("especie").value;
    const habitatId = document.getElementById("habitat").value;

    if (!nome || !dataNascimento || !sexo || !condicaoSaude || !especieId || !habitatId) {
        alert("Preencha todos os campos do formulário.");
        return;
    }

    const body = {
        nome,
        dataNascimento,
        sexo,
        condicaoSaude,
        especie: { id: Number(especieId) },
        habitat: { id: Number(habitatId) }
    };

    const url = id ? `${API_BASE}/animais/${id}` : `${API_BASE}/animais`;
    const method = id ? "PUT" : "POST";

    try {
        const resp = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!resp.ok) {
            throw new Error(`Erro HTTP ${resp.status}`);
        }

        await resp.json();
        alert("Animal salvo com sucesso!");
        limparFormulario();
        listarAnimais();
    } catch (err) {
        console.error("Erro ao salvar animal:", err);
        alert("Erro ao salvar animal. Veja o console.");
    }
}

function limparFormulario() {
    document.getElementById("animalId").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("sexo").value = "";
    document.getElementById("condicaoSaude").value = "";
    document.getElementById("especie").value = "";
    document.getElementById("habitat").value = "";
    document.getElementById("btnSalvar").textContent = "Salvar";
}

async function editarAnimal(id) {
    try {
        const resp = await fetch(`${API_BASE}/animais/${id}`);
        if (!resp.ok) {
            throw new Error(`Erro HTTP ${resp.status}`);
        }
        const a = await resp.json();

        document.getElementById("animalId").value = a.id;
        document.getElementById("nome").value = a.nome;
        document.getElementById("dataNascimento").value = a.dataNascimento;
        document.getElementById("sexo").value = a.sexo;
        document.getElementById("condicaoSaude").value = a.condicaoSaude;
        document.getElementById("especie").value = a.especie ? a.especie.id : "";
        document.getElementById("habitat").value = a.habitat ? a.habitat.id : "";

        document.getElementById("btnSalvar").textContent = "Atualizar";
        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
        console.error("Erro ao buscar animal para edição:", err);
        alert("Erro ao buscar animal.");
    }
}

async function deletarAnimal(id) {
    if (!confirm(`Tem certeza que deseja excluir o animal ID ${id}?`)) {
        return;
    }

    try {
        const resp = await fetch(`${API_BASE}/animais/${id}`, {
            method: "DELETE"
        });

        if (!resp.ok) {
            throw new Error(`Erro HTTP ${resp.status}`);
        }

        alert("Animal excluído com sucesso!");
        listarAnimais();
    } catch (err) {
        console.error("Erro ao excluir animal:", err);
        alert("Erro ao excluir animal. Veja o console.");
    }
}

function limparFiltrosInputs() {
    document.getElementById("filtroEspecie").value = "";
    document.getElementById("filtroHabitat").value = "";
}

async function aplicarFiltros() {
    const especie = document.getElementById("filtroEspecie").value.trim();
    const habitat = document.getElementById("filtroHabitat").value.trim();

    try {
        let animais = [];

        if (especie) {
            const resp = await fetch(`${API_BASE}/animais/por-especie/${encodeURIComponent(especie)}`);
            animais = await resp.json();
        } else if (habitat) {
            const resp = await fetch(`${API_BASE}/animais/por-habitat/${encodeURIComponent(habitat)}`);
            animais = await resp.json();
        } else {
            listarAnimais();
            return;
        }

        preencherTabela(animais);
    } catch (err) {
        console.error("Erro ao aplicar filtros:", err);
        alert("Erro ao aplicar filtros. Veja o console.");
    }
}
