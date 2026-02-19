function getPokemonCardTemplate(pokemonData, color) {
    let typesHtml = "";
    for (let i = 0; i < pokemonData.types.length; i++) {
        typesHtml += `<span class="card-type-badge">${pokemonData.types[i].type.name}</span>`;
    }

    return `
        <div class="card" onclick="openDetails(${pokemonData.id})" style="background-color: ${color}">
            <div class="card_content">
                <div class="card-header-info">
                    <h2>${pokemonData.name}</h2>
                </div>
                <img class="card-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png">
                <div class="card-types-container">
                    ${typesHtml}
                </div>
            </div>
        </div>`;
}

function getDialogInternalTemplate(pokemon, color, activeTab) {
    return `
        <div class="card-header">
            <div class="header-top-row">
                <h2>${pokemon.name.toUpperCase()}</h2>
                <span class="pokemon-id">#${pokemon.id}</span>
            </div>
            <div class="types-row">${renderTypes(pokemon.types)}</div>
            <img id="closeBtn" src="./assets/icons/multiplizieren.png" onclick="closeDialog()">
            <img class="header-pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png">
        </div>
        <div class="card-white-content">
            <nav class="tab-menu">
                <span class="${activeTab === 'about' ? 'active' : ''}" onclick="switchTab('about')">About</span>
                <span class="${activeTab === 'stats' ? 'active' : ''}" onclick="switchTab('stats')">Base Stats</span>
            </nav>
            <div class="tab-body">
                ${renderActiveTabContent(pokemon, activeTab)}
            </div>
            <div class="card-footer">
                <img class="nav-arrow" src="./assets/icons/backArrow.png" onclick="backPokemon()">
                <img class="nav-arrow" src="./assets/icons/nextArrow.png" onclick="nextPokemon()">
            </div>
        </div>`;
}

function getStatsTemplate(pokemon) {
    let statsHtml = "";
    for (let i = 0; i < pokemon.stats.length; i++) {
        const stat = pokemon.stats[i];
        statsHtml += `
            <div class="stat-row">
                <span class="stat-label">${stat.stat.name.replace('-', ' ')}</span>
                <span class="stat-number">${stat.base_stat}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${(stat.base_stat / 150) * 100}%"></div>
                </div>
            </div>`;
    }
    return `<div class="stats-list">${statsHtml}</div>`;
}

function renderActiveTabContent(pokemon, tab) {
    if (tab === 'about') {
        let abilities = "";
        for (let j = 0; j < pokemon.abilities.length; j++) {
            abilities += pokemon.abilities[j].ability.name + (j < pokemon.abilities.length - 1 ? ", " : "");
        }
        return `<div class="info-row"><span>Species</span> <span>${pokemon.name}</span></div>
                <div class="info-row"><span>Height</span> <span>${pokemon.height / 10} m</span></div>
                <div class="info-row"><span>Weight</span> <span>${pokemon.weight / 10} kg</span></div>
                <div class="info-row"><span>Abilities</span> <span>${abilities}</span></div>`;
    }
    return getStatsTemplate(pokemon);
}