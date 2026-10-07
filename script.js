// ======================================================
// FIGHT MANAGER
// Sistema de registro de peleadores + matchmaking
// ======================================================


// ======================================================
// ELEMENTOS DEL DOM
// ======================================================

// ------------------------------
// FORMULARIO PRINCIPAL
// ------------------------------

const fighterForm = document.getElementById("fighterForm");

const academyInput = document.getElementById("academy");
const fighterInput = document.getElementById("fighter");
const ageInput = document.getElementById("age");
const weightInput = document.getElementById("weight");

const winsInput = document.getElementById("wins");
const lossesInput = document.getElementById("losses");
const drawsInput = document.getElementById("draws");

const recordPreview = document.getElementById("recordPreview");


// ------------------------------
// TABLA
// ------------------------------

const fightersTable = document.getElementById("fightersTable");
const emptyMessage = document.getElementById("emptyMessage");


// ------------------------------
// ESTADÍSTICAS
// ------------------------------

const totalFighters = document.getElementById("totalFighters");
const totalWins = document.getElementById("totalWins");
const totalLosses = document.getElementById("totalLosses");
const visibleCount = document.getElementById("visibleCount");


// ------------------------------
// FILTROS
// ------------------------------

const searchInput = document.getElementById("searchInput");
const academyFilter = document.getElementById("academyFilter");
const weightFilter = document.getElementById("weightFilter");


// ------------------------------
// BOTONES
// ------------------------------

const clearButton = document.getElementById("clearButton");
const deleteAllButton = document.getElementById("deleteAllButton");


// ------------------------------
// MODAL
// ------------------------------

const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");

const editForm = document.getElementById("editForm");

const editId = document.getElementById("editId");
const editAcademy = document.getElementById("editAcademy");
const editName = document.getElementById("editName");
const editAge = document.getElementById("editAge");
const editWeight = document.getElementById("editWeight");

const editWins = document.getElementById("editWins");
const editLosses = document.getElementById("editLosses");
const editDraws = document.getElementById("editDraws");


// ------------------------------
// NOTIFICACIÓN
// ------------------------------

const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notificationMessage");


// ======================================================
// MATCHMAKING
// ======================================================

const fighterASelect = document.getElementById("fighterA");
const fighterBSelect = document.getElementById("fighterB");

const fighterAPreview = document.getElementById("fighterAPreview");
const fighterBPreview = document.getElementById("fighterBPreview");

const matchWarning = document.getElementById("matchWarning");

const createMatchButton = document.getElementById("createMatchButton");
const clearMatchButton = document.getElementById("clearMatchButton");

const fightCardList = document.getElementById("fightCardList");
const emptyFightCard = document.getElementById("emptyFightCard");


// ======================================================
// CARGAR PELEADORES
// ======================================================

let fighters = loadFighters();


// ======================================================
// CARGAR CARTELERA
// ======================================================

let fightCard = loadFightCard();


// ======================================================
// CARGAR PELEADORES DE LOCALSTORAGE
// ======================================================

function loadFighters() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem("fighters")
            );

        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .filter(fighter => fighter)
            .map(fighter => ({

                id: fighter.id ?? Date.now() + Math.random(),

                academy:
                    String(fighter.academy ?? "").trim(),

                name:
                    String(fighter.name ?? "").trim(),

                age:
                    Number(fighter.age) || 0,

                weight:
                    Number(fighter.weight) || 0,

                wins:
                    Math.max(0, Number(fighter.wins) || 0),

                losses:
                    Math.max(0, Number(fighter.losses) || 0),

                draws:
                    Math.max(0, Number(fighter.draws) || 0)

            }));

    } catch (error) {

        console.error(
            "Error al cargar peleadores:",
            error
        );

        return [];

    }

}


// ======================================================
// CARGAR CARTELERA
// ======================================================

function loadFightCard() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem("fightCard")
            );

        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter(
            fight =>
                fight &&
                fight.fighterAId != null &&
                fight.fighterBId != null
        );

    } catch (error) {

        console.error(
            "Error al cargar cartelera:",
            error
        );

        return [];

    }

}


// ======================================================
// GUARDAR PELEADORES
// ======================================================

function saveFighters() {

    localStorage.setItem(
        "fighters",
        JSON.stringify(fighters)
    );

}


// ======================================================
// GUARDAR CARTELERA
// ======================================================

function saveFightCard() {

    localStorage.setItem(
        "fightCard",
        JSON.stringify(fightCard)
    );

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ======================================================
// NOTIFICACIÓN
// ======================================================

let notificationTimer;

function showNotification(message) {

    notificationMessage.textContent = message;

    notification.classList.add("show");

    clearTimeout(notificationTimer);

    notificationTimer =
        setTimeout(() => {

            notification.classList.remove("show");

        }, 3000);

}


// ======================================================
// RECORD EN TIEMPO REAL
// ======================================================

function updateRecordPreview() {

    const wins =
        Math.max(
            0,
            Number(winsInput.value) || 0
        );

    const losses =
        Math.max(
            0,
            Number(lossesInput.value) || 0
        );

    const draws =
        Math.max(
            0,
            Number(drawsInput.value) || 0
        );

    recordPreview.textContent =
        `${wins} - ${losses} - ${draws}`;

}


winsInput.addEventListener(
    "input",
    updateRecordPreview
);

lossesInput.addEventListener(
    "input",
    updateRecordPreview
);

drawsInput.addEventListener(
    "input",
    updateRecordPreview
);


// ======================================================
// ESTADÍSTICAS
// ======================================================

function updateStatistics() {

    const wins =
        fighters.reduce(
            (total, fighter) =>
                total + Number(fighter.wins || 0),
            0
        );


    const losses =
        fighters.reduce(
            (total, fighter) =>
                total + Number(fighter.losses || 0),
            0
        );


    totalFighters.textContent =
        fighters.length;

    totalWins.textContent =
        wins;

    totalLosses.textContent =
        losses;

}


// ======================================================
// ACTUALIZAR FILTRO DE ACADEMIAS
// ======================================================

function updateAcademyFilter() {

    const currentValue =
        academyFilter.value;


    const academies =
        [...new Set(
            fighters
                .map(fighter => fighter.academy.trim())
                .filter(Boolean)
        )]
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "es",
                    {
                        sensitivity: "base"
                    }
                )
        );


    academyFilter.innerHTML = `
        <option value="">
            Todas las academias
        </option>
    `;


    academies.forEach(academy => {

        const option =
            document.createElement("option");

        option.value = academy;

        option.textContent = academy;

        academyFilter.appendChild(option);

    });


    if (academies.includes(currentValue)) {

        academyFilter.value =
            currentValue;

    }

}


// ======================================================
// FILTRO POR PESO
// ======================================================

function matchesWeightValue(weight, filter) {

    const numericWeight =
        Number(weight);


    if (!filter) {
        return true;
    }


    switch (filter) {

        case "50":

            return numericWeight <= 50;


        case "60":

            return (
                numericWeight > 50 &&
                numericWeight <= 60
            );


        case "70":

            return (
                numericWeight > 60 &&
                numericWeight <= 70
            );


        case "80":

            return (
                numericWeight > 70 &&
                numericWeight <= 80
            );


        case "90":

            return (
                numericWeight > 80 &&
                numericWeight <= 90
            );


        case "91":

            return numericWeight > 90;


        default:

            return true;

    }

}


// ======================================================
// OBTENER PELEADORES FILTRADOS
// ======================================================

function getFilteredFighters() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const academy =
        academyFilter.value;


    const weight =
        weightFilter.value;


    return fighters.filter(fighter => {

        const fighterName =
            String(fighter.name)
                .toLowerCase();


        const fighterAcademy =
            String(fighter.academy)
                .toLowerCase();


        const matchesSearch =
            !search ||
            fighterName.includes(search) ||
            fighterAcademy.includes(search);


        const matchesAcademy =
            !academy ||
            fighter.academy === academy;


        const matchesWeight =
            matchesWeightValue(
                fighter.weight,
                weight
            );


        return (
            matchesSearch &&
            matchesAcademy &&
            matchesWeight
        );

    });

}


// ======================================================
// RENDERIZAR TABLA
// ======================================================

function renderFighters() {

    const filtered =
        getFilteredFighters();


    fightersTable.innerHTML = "";


    visibleCount.textContent =
        filtered.length;


    emptyMessage.style.display =
        filtered.length === 0
            ? "block"
            : "none";


    filtered.forEach(
        (fighter, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <span class="academy-name">
                        ${escapeHTML(fighter.academy)}
                    </span>
                </td>

                <td>
                    <span class="fighter-name">
                        ${escapeHTML(fighter.name)}
                    </span>
                </td>

                <td>
                    ${fighter.age}
                </td>

                <td>
                    ${fighter.weight} kg
                </td>

                <td>
                    <span class="record">
                        ${fighter.wins} -
                        ${fighter.losses} -
                        ${fighter.draws}
                    </span>
                </td>

                <td>

                    <div class="actions">

                        <button
                            type="button"
                            class="action-btn edit-btn"
                            onclick="openEditModal('${fighter.id}')"
                        >
                            ✏ Editar
                        </button>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            onclick="deleteFighter('${fighter.id}')"
                        >
                            🗑
                        </button>

                    </div>

                </td>

            `;


            fightersTable.appendChild(row);

        }
    );

}


// ======================================================
// REGISTRAR PELEADOR
// ======================================================

fighterForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const academy =
            academyInput.value.trim();


        const name =
            fighterInput.value.trim();


        const age =
            Number(ageInput.value);


        const weight =
            Number(weightInput.value);


        const wins =
            Math.max(
                0,
                Number(winsInput.value) || 0
            );


        const losses =
            Math.max(
                0,
                Number(lossesInput.value) || 0
            );


        const draws =
            Math.max(
                0,
                Number(drawsInput.value) || 0
            );


        // ----------------------------
        // VALIDACIONES
        // ----------------------------

        if (!academy) {

            showNotification(
                "Ingresa el nombre de la academia."
            );

            academyInput.focus();

            return;

        }


        if (!name) {

            showNotification(
                "Ingresa el nombre del peleador."
            );

            fighterInput.focus();

            return;

        }


        if (
            !Number.isFinite(age) ||
            age < 10 ||
            age > 100
        ) {

            showNotification(
                "La edad debe estar entre 10 y 100 años."
            );

            ageInput.focus();

            return;

        }


        if (
            !Number.isFinite(weight) ||
            weight < 20 ||
            weight > 300
        ) {

            showNotification(
                "El peso debe estar entre 20 y 300 kg."
            );

            weightInput.focus();

            return;

        }


        // ----------------------------
        // CREAR PELEADOR
        // ----------------------------

        const fighter = {

            id:
                Date.now().toString() +
                Math.random()
                    .toString(16)
                    .slice(2),

            academy,

            name,

            age,

            weight,

            wins,

            losses,

            draws

        };


        fighters.push(fighter);


        saveFighters();


        updateAcademyFilter();

        updateStatistics();

        renderFighters();

        refreshMatchmaking();


        resetMainForm();


        showNotification(
            "Peleador registrado correctamente."
        );

    }
);


// ======================================================
// RESET FORMULARIO
// ======================================================

function resetMainForm() {

    fighterForm.reset();


    winsInput.value = 0;

    lossesInput.value = 0;

    drawsInput.value = 0;


    updateRecordPreview();

}


// ======================================================
// ELIMINAR PELEADOR
// ======================================================

function deleteFighter(id) {

    const fighter =
        findFighter(id);


    if (!fighter) {
        return;
    }


    const confirmation =
        confirm(
            `¿Eliminar a ${fighter.name}?`
        );


    if (!confirmation) {
        return;
    }


    fighters =
        fighters.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    // IMPORTANTE:
    // También eliminamos sus peleas.

    removeFightsForFighter(id);


    saveFighters();


    updateAcademyFilter();

    updateStatistics();

    renderFighters();

    refreshMatchmaking();


    showNotification(
        "Peleador eliminado."
    );

}


// ======================================================
// ELIMINAR TODOS
// ======================================================

deleteAllButton.addEventListener(
    "click",
    function() {

        if (fighters.length === 0) {

            showNotification(
                "No existen registros."
            );

            return;

        }


        const confirmation =
            confirm(
                "¿Seguro que deseas eliminar TODOS los peleadores y la cartelera?"
            );


        if (!confirmation) {
            return;
        }


        fighters = [];

        fightCard = [];


        saveFighters();

        saveFightCard();


        updateAcademyFilter();

        updateStatistics();

        renderFighters();

        refreshMatchmaking();


        clearMatchSelection();


        showNotification(
            "Todos los registros fueron eliminados."
        );

    }
);


// ======================================================
// ABRIR MODAL DE EDICIÓN
// ======================================================

function openEditModal(id) {

    const fighter =
        findFighter(id);


    if (!fighter) {

        showNotification(
            "No se encontró el peleador."
        );

        return;

    }


    editId.value =
        fighter.id;


    editAcademy.value =
        fighter.academy;


    editName.value =
        fighter.name;


    editAge.value =
        fighter.age;


    editWeight.value =
        fighter.weight;


    editWins.value =
        fighter.wins;


    editLosses.value =
        fighter.losses;


    editDraws.value =
        fighter.draws;


    editModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        editAcademy.focus();

    }, 100);

}


// ======================================================
// CERRAR MODAL
// ======================================================

function closeEditModal() {

    editModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


// ======================================================
// CERRAR MODAL HACIENDO CLICK AFUERA
// ======================================================

editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


// ======================================================
// ESC PARA CERRAR MODAL
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            editModal.classList.contains("active")
        ) {

            closeEditModal();

        }

    }
);


// ======================================================
// GUARDAR CAMBIOS DEL MODAL
// ======================================================

editForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            editId.value;


        const fighter =
            findFighter(id);


        if (!fighter) {

            showNotification(
                "No se encontró el peleador."
            );

            return;

        }


        const academy =
            editAcademy.value.trim();


        const name =
            editName.value.trim();


        const age =
            Number(editAge.value);


        const weight =
            Number(editWeight.value);


        const wins =
            Math.max(
                0,
                Number(editWins.value) || 0
            );


        const losses =
            Math.max(
                0,
                Number(editLosses.value) || 0
            );


        const draws =
            Math.max(
                0,
                Number(editDraws.value) || 0
            );


        // ----------------------------
        // VALIDACIONES
        // ----------------------------

        if (!academy) {

            showNotification(
                "Ingresa el nombre de la academia."
            );

            editAcademy.focus();

            return;

        }


        if (!name) {

            showNotification(
                "Ingresa el nombre del peleador."
            );

            editName.focus();

            return;

        }


        if (
            !Number.isFinite(age) ||
            age < 10 ||
            age > 100
        ) {

            showNotification(
                "La edad debe estar entre 10 y 100."
            );

            editAge.focus();

            return;

        }


        if (
            !Number.isFinite(weight) ||
            weight < 20 ||
            weight > 300
        ) {

            showNotification(
                "Peso no válido."
            );

            editWeight.focus();

            return;

        }


        // ----------------------------
        // ACTUALIZAR
        // ----------------------------

        fighter.academy =
            academy;

        fighter.name =
            name;

        fighter.age =
            age;

        fighter.weight =
            weight;

        fighter.wins =
            wins;

        fighter.losses =
            losses;

        fighter.draws =
            draws;


        saveFighters();


        updateAcademyFilter();

        updateStatistics();

        renderFighters();

        refreshMatchmaking();


        closeEditModal();


        showNotification(
            "Cambios guardados correctamente."
        );

    }
);


// ======================================================
// LIMPIAR FORMULARIO PRINCIPAL
// ======================================================

clearButton.addEventListener(
    "click",
    function() {

        resetMainForm();

        academyInput.focus();

    }
);


// ======================================================
// FILTROS
// ======================================================

searchInput.addEventListener(
    "input",
    renderFighters
);


academyFilter.addEventListener(
    "change",
    renderFighters
);


weightFilter.addEventListener(
    "change",
    renderFighters
);


// ======================================================
// MATCHMAKING
// ======================================================


// ======================================================
// GUARDAR / ACTUALIZAR SELECTS
// ======================================================

function updateMatchmakingSelects() {

    const selectedA =
        fighterASelect.value;


    const selectedB =
        fighterBSelect.value;


    fighterASelect.innerHTML = `
        <option value="">
            Seleccionar peleador
        </option>
    `;


    fighterBSelect.innerHTML = `
        <option value="">
            Seleccionar peleador
        </option>
    `;


    fighters.forEach(fighter => {

        const optionA =
            document.createElement("option");


        optionA.value =
            fighter.id;


        optionA.textContent =
            `${fighter.name} — ${fighter.weight} kg`;


        fighterASelect.appendChild(
            optionA
        );


        const optionB =
            document.createElement("option");


        optionB.value =
            fighter.id;


        optionB.textContent =
            `${fighter.name} — ${fighter.weight} kg`;


        fighterBSelect.appendChild(
            optionB
        );

    });


    // Mantener selección si todavía existe.

    if (
        fighters.some(
            fighter =>
                String(fighter.id) ===
                String(selectedA)
        )
    ) {

        fighterASelect.value =
            selectedA;

    }


    if (
        fighters.some(
            fighter =>
                String(fighter.id) ===
                String(selectedB)
        )
    ) {

        fighterBSelect.value =
            selectedB;

    }

}


// ======================================================
// BUSCAR PELEADOR
// ======================================================

function findFighter(id) {

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {

        return null;

    }


    return fighters.find(
        fighter =>
            String(fighter.id) ===
            String(id)
    ) || null;

}


// ======================================================
// PREVIEW DEL PELEADOR
// ======================================================

function updateFighterPreview(
    select,
    preview
) {

    const fighter =
        findFighter(
            select.value
        );


    if (!fighter) {

        preview.innerHTML = `
            <span>
                Selecciona un peleador
            </span>
        `;

        return;

    }


    preview.innerHTML = `

        <strong>
            ${escapeHTML(fighter.name)}
        </strong>

        <span>
            ${escapeHTML(fighter.academy)}
        </span>

        <span>
            ${fighter.weight} kg
            ·
            Récord:
            ${fighter.wins}-${fighter.losses}-${fighter.draws}
        </span>

    `;

}


// ======================================================
// VALIDAR ENFRENTAMIENTO
// ======================================================

function validateMatch() {

    matchWarning.textContent = "";


    const fighterA =
        findFighter(
            fighterASelect.value
        );


    const fighterB =
        findFighter(
            fighterBSelect.value
        );


    if (!fighterA || !fighterB) {

        return false;

    }


    // ----------------------------
    // MISMO PELEADOR
    // ----------------------------

    if (
        String(fighterA.id) ===
        String(fighterB.id)
    ) {

        matchWarning.textContent =
            "⚠️ Un peleador no puede enfrentarse contra sí mismo.";

        return false;

    }


    // ----------------------------
    // DIFERENCIA DE PESO
    // ----------------------------

    const weightDifference =
        Math.abs(
            Number(fighterA.weight) -
            Number(fighterB.weight)
        );


    if (weightDifference > 5) {

        matchWarning.textContent =
            `⚠️ La diferencia de peso es de ${weightDifference.toFixed(1)} kg. Máximo permitido: 5 kg.`;

        return false;

    }


    return true;

}


// ======================================================
// ACTUALIZAR SELECCIÓN
// ======================================================

function updateMatchSelection() {

    updateFighterPreview(
        fighterASelect,
        fighterAPreview
    );


    updateFighterPreview(
        fighterBSelect,
        fighterBPreview
    );


    validateMatch();

}


fighterASelect.addEventListener(
    "change",
    updateMatchSelection
);


fighterBSelect.addEventListener(
    "change",
    updateMatchSelection
);


// ======================================================
// CREAR PELEA
// ======================================================

createMatchButton.addEventListener(
    "click",
    function() {

        const fighterA =
            findFighter(
                fighterASelect.value
            );


        const fighterB =
            findFighter(
                fighterBSelect.value
            );


        if (!fighterA || !fighterB) {

            showNotification(
                "Selecciona los dos peleadores."
            );

            return;

        }


        if (!validateMatch()) {

            showNotification(
                "No se puede crear este enfrentamiento."
            );

            return;

        }


        // ----------------------------
        // EVITAR DUPLICADOS
        // ----------------------------

        const alreadyExists =
            fightCard.some(
                fight => {

                    const sameOrder =
                        String(fight.fighterAId) ===
                        String(fighterA.id) &&
                        String(fight.fighterBId) ===
                        String(fighterB.id);


                    const reverseOrder =
                        String(fight.fighterAId) ===
                        String(fighterB.id) &&
                        String(fight.fighterBId) ===
                        String(fighterA.id);


                    return (
                        sameOrder ||
                        reverseOrder
                    );

                }
            );


        if (alreadyExists) {

            showNotification(
                "Estos peleadores ya tienen una pelea programada."
            );

            return;

        }


        // ----------------------------
        // CREAR PELEA
        // ----------------------------

        const newFight = {

            id:
                Date.now().toString() +
                Math.random()
                    .toString(16)
                    .slice(2),

            fighterAId:
                fighterA.id,

            fighterBId:
                fighterB.id

        };


        fightCard.push(
            newFight
        );


        saveFightCard();


        renderFightCard();


        clearMatchSelection();


        showNotification(
            "Pelea agregada a la cartelera."
        );

    }
);


// ======================================================
// LIMPIAR SELECCIÓN
// ======================================================

function clearMatchSelection() {

    fighterASelect.value = "";

    fighterBSelect.value = "";

    matchWarning.textContent = "";


    updateFighterPreview(
        fighterASelect,
        fighterAPreview
    );


    updateFighterPreview(
        fighterBSelect,
        fighterBPreview
    );

}


clearMatchButton.addEventListener(
    "click",
    clearMatchSelection
);


// ======================================================
// RENDERIZAR CARTELERA
// ======================================================

function renderFightCard() {

    fightCardList.innerHTML = "";


    // ----------------------------
    // LIMPIAR PELEAS INVALIDAS
    // ----------------------------

    const validFightCard =
        fightCard.filter(
            fight =>
                findFighter(fight.fighterAId) &&
                findFighter(fight.fighterBId)
        );


    if (
        validFightCard.length !==
        fightCard.length
    ) {

        fightCard =
            validFightCard;

        saveFightCard();

    }


    // ----------------------------
    // SIN PELEAS
    // ----------------------------

    if (fightCard.length === 0) {

        emptyFightCard.style.display =
            "block";

        return;

    }


    emptyFightCard.style.display =
        "none";


    // ----------------------------
    // MOSTRAR PELEAS
    // ----------------------------

    fightCard.forEach(
        (fight, index) => {

            const fighterA =
                findFighter(
                    fight.fighterAId
                );


            const fighterB =
                findFighter(
                    fight.fighterBId
                );


            if (!fighterA || !fighterB) {
                return;
            }


            const card =
                document.createElement("div");


            card.className =
                "fight-card";


            card.innerHTML = `

                <div class="fight-number">

                    <span>
                        Pelea
                    </span>

                    <strong>
                        ${index + 1}
                    </strong>

                </div>


                <div class="fighter-side red">

                    <strong>
                        ${escapeHTML(fighterA.name)}
                    </strong>

                    <span>
                        ${escapeHTML(fighterA.academy)}
                    </span>

                    <span>
                        ${fighterA.weight} kg
                        ·
                        ${fighterA.wins}-${fighterA.losses}-${fighterA.draws}
                    </span>

                </div>


                <div class="fight-vs">
                    VS
                </div>


                <div class="fighter-side blue">

                    <strong>
                        ${escapeHTML(fighterB.name)}
                    </strong>

                    <span>
                        ${escapeHTML(fighterB.academy)}
                    </span>

                    <span>
                        ${fighterB.weight} kg
                        ·
                        ${fighterB.wins}-${fighterB.losses}-${fighterB.draws}
                    </span>

                </div>


                <div class="fight-actions">

                    <button
                        type="button"
                        class="order-btn"
                        title="Subir"
                        onclick="moveFightUp(${index})"
                        ${index === 0 ? "disabled" : ""}
                    >
                        ↑
                    </button>


                    <button
                        type="button"
                        class="order-btn"
                        title="Bajar"
                        onclick="moveFightDown(${index})"
                        ${index === fightCard.length - 1 ? "disabled" : ""}
                    >
                        ↓
                    </button>


                    <button
                        type="button"
                        class="remove-fight-btn"
                        onclick="removeFight(${index})"
                    >
                        🗑 Eliminar
                    </button>

                </div>

            `;


            fightCardList.appendChild(
                card
            );

        }
    );

}


// ======================================================
// SUBIR PELEA
// ======================================================

function moveFightUp(index) {

    if (
        index <= 0 ||
        index >= fightCard.length
    ) {

        return;

    }


    [
        fightCard[index - 1],
        fightCard[index]
    ] = [
        fightCard[index],
        fightCard[index - 1]
    ];


    saveFightCard();

    renderFightCard();

}


// ======================================================
// BAJAR PELEA
// ======================================================

function moveFightDown(index) {

    if (
        index < 0 ||
        index >= fightCard.length - 1
    ) {

        return;

    }


    [
        fightCard[index],
        fightCard[index + 1]
    ] = [
        fightCard[index + 1],
        fightCard[index]
    ];


    saveFightCard();

    renderFightCard();

}


// ======================================================
// ELIMINAR PELEA
// ======================================================

function removeFight(index) {

    const fight =
        fightCard[index];


    if (!fight) {
        return;
    }


    const fighterA =
        findFighter(
            fight.fighterAId
        );


    const fighterB =
        findFighter(
            fight.fighterBId
        );


    const nameA =
        fighterA
            ? fighterA.name
            : "Peleador eliminado";


    const nameB =
        fighterB
            ? fighterB.name
            : "Peleador eliminado";


    const confirmation =
        confirm(
            `¿Eliminar la pelea ${nameA} vs ${nameB}?`
        );


    if (!confirmation) {
        return;
    }


    fightCard.splice(
        index,
        1
    );


    saveFightCard();


    renderFightCard();


    showNotification(
        "Pelea eliminada de la cartelera."
    );

}


// ======================================================
// ELIMINAR PELEAS DE UN PELEADOR
// ======================================================

function removeFightsForFighter(
    fighterId
) {

    const originalLength =
        fightCard.length;


    fightCard =
        fightCard.filter(
            fight =>
                String(fight.fighterAId) !==
                    String(fighterId) &&
                String(fight.fighterBId) !==
                    String(fighterId)
        );


    if (
        fightCard.length !==
        originalLength
    ) {

        saveFightCard();

        renderFightCard();

    }

}


// ======================================================
// ACTUALIZAR MATCHMAKING
// ======================================================

function refreshMatchmaking() {

    updateMatchmakingSelects();


    renderFightCard();


    updateFighterPreview(
        fighterASelect,
        fighterAPreview
    );


    updateFighterPreview(
        fighterBSelect,
        fighterBPreview
    );


    validateMatch();

}


// ======================================================
// INICIALIZACIÓN
// ======================================================

updateRecordPreview();

updateAcademyFilter();

updateStatistics();

renderFighters();

refreshMatchmaking();


// ======================================================
// EXPONER FUNCIONES PARA LOS BOTONES HTML
// ======================================================

window.openEditModal =
    openEditModal;

window.deleteFighter =
    deleteFighter;

window.moveFightUp =
    moveFightUp;

window.moveFightDown =
    moveFightDown;

window.removeFight =
    removeFight;
