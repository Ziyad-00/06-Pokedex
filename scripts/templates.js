function getPokemonCardTemplate(pokemon, color, typesHtml) {
    return `
        <div class="card" onclick="openDetails(${pokemon.id})" style="background-color: ${color}">
            <div class="card_content">
                <div class="card-header-info">
                    <h2>${pokemon.name}</h2>
                </div>
                <img class="card-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png">
                <div class="card-types-container">
                    ${typesHtml}
                </div>
            </div>
        </div>`;
}

function getDialogInternalTemplate(pokemon, typesHtml, contentHtml, activeTab) {
    return `
        <div class="card-header">
            <div class="header-top-row">
                <h2>${pokemon.name.toUpperCase()}</h2>
                <span class="pokemon-id">#${pokemon.id}</span>
            </div>
            <div class="types-row">${typesHtml}</div>
            <img id="closeBtn" src="./assets/icons/multiplizieren.png" onclick="closeDialog()">
            <img class="header-pokemon-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png">
        </div>
        <div class="card-white-content">
            <nav class="tab-menu">
                <span class="${activeTab === 'about' ? 'active' : ''}" onclick="switchTab('about')">About</span>
                <span class="${activeTab === 'stats' ? 'active' : ''}" onclick="switchTab('stats')">Base Stats</span>
            </nav>
            <div class="tab-body">
                ${contentHtml}
            </div>
            <div class="card-footer">
                <img class="nav-arrow" src="./assets/icons/backArrow.png" onclick="backPokemon()">
                <img class="nav-arrow" src="./assets/icons/nextArrow.png" onclick="nextPokemon()">
            </div>
        </div>`;
}

function getAboutTemplate(pokemon, abilities) {
    return `
        <div class="info-row"><span>Species</span> <span>${pokemon.name}</span></div>
        <div class="info-row"><span>Height</span> <span>${pokemon.height / 10} m</span></div>
        <div class="info-row"><span>Weight</span> <span>${pokemon.weight / 10} kg</span></div>
        <div class="info-row"><span>Abilities</span> <span>${abilities}</span></div>`;
}

function getStatRowTemplate(label, value, percent) {
    return `
        <div class="stat-row">
            <span class="stat-label">${label}</span>
            <span class="stat-number">${value}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${percent}%"></div>
            </div>
        </div>`;
}