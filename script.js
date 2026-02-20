let charactersArray = [];
let allPokemonNames = [];
let searchResults = [];
let pokemonCache = {};
let nextUrl = '';
let currentIndex = 0;
let activeTab = 'about';

async function getCharacter() {
    showLoader();
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await response.json();
        allPokemonNames = data.results;
        setTimeout(loadInitialPokemon, 50); // Gibt dem Loader Zeit zu erscheinen
    } catch (e) { console.error("Fehler:", e); hideLoader(); }
}

async function loadInitialPokemon() {
    showLoader();
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon');
        const data = await response.json();
        nextUrl = data.next;
        charactersArray = [];
        for (let i = 0; i < data.results.length; i++) {
            await addToCache(data.results[i].name, data.results[i].url);
            charactersArray.push(pokemonCache[data.results[i].name]);
        }
        render(charactersArray);
    } catch (e) {
        console.error(e);
    }
    hideLoader();
}

async function addToCache(pName, url) {
    if (!pokemonCache[pName]) {
        const detailResp = await fetch(url);
        pokemonCache[pName] = await detailResp.json();
    }
}

// 2. Suche reparieren (Nur EIN Listener!)
document.getElementById('searching').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length === 0) {
        toggleLoadMoreButton(true);
        return render(charactersArray);
    }
    if (term.length >= 3) {
        showLoader();
        setTimeout(() => executeSearch(term), 50);
    }
});

function executeSearch(term) {
    searchResults = [];
    for (let i = 0; i < charactersArray.length; i++) {
        const name = charactersArray[i].name.toLowerCase();
        if (name.includes(term)) searchResults.push(charactersArray[i]);
    }
    render(searchResults);
    hideLoader();
}

function findMatches(term) {
    let found = [];
    for (let i = 0; i < allPokemonNames.length; i++) {
        if (allPokemonNames[i].name.toLowerCase().includes(term)) found.push(allPokemonNames[i]);
        if (found.length >= 20) break;
    }
    return found;
}

function render(list) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
        const pokemon = list[i];
        const color = getTypeColor(pokemon.types[0].type.name);
        let typesHtml = "";
        for (let j = 0; j < pokemon.types.length; j++) {
            typesHtml += `<span class="card-type-badge">${pokemon.types[j].type.name}</span>`;
        }
        contentRef.innerHTML += getPokemonCardTemplate(pokemon, color, typesHtml);
    }
}

function updateDialogContent(pool = charactersArray) {
    const pokemon = pool[currentIndex];
    const dialog = document.getElementById('pokemonCard');
    if (!pokemon) return;

    const color = getTypeColor(pokemon.types[0].type.name);
    const typesHtml = renderTypesHtml(pokemon.types);
    const contentHtml = prepareTabContent(pokemon);

    dialog.style.backgroundColor = color;
    dialog.innerHTML = getDialogInternalTemplate(pokemon, typesHtml, contentHtml, activeTab);
}

function prepareTabContent(pokemon) {
    if (activeTab === 'about') {
        let abilities = "";
        for (let j = 0; j < pokemon.abilities.length; j++) {
            abilities += pokemon.abilities[j].ability.name + (j < pokemon.abilities.length - 1 ? ", " : "");
        }
        return getAboutTemplate(pokemon, abilities);
    } else {
        let statsHtml = '<div class="stats-list">';
        for (let i = 0; i < pokemon.stats.length; i++) {
            const s = pokemon.stats[i];
            statsHtml += getStatRowTemplate(s.stat.name.replace('-', ' '), s.base_stat, (s.base_stat / 150) * 100);
        }
        return statsHtml + '</div>';
    }
}

function renderTypesHtml(types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        html += `<span class="type-badge">${types[i].type.name}</span>`;
    }
    return html;
}

function switchTab(tabName) {
    activeTab = tabName;
    const pool = searchResults.length > 0 ? searchResults : charactersArray;
    const tabContainer = document.getElementById('tab-body-container');
    if (tabContainer) {
        tabContainer.innerHTML = prepareTabContent(pool[currentIndex]);
        const tabs = document.querySelectorAll('.tab-menu span');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.toggle('active', tabs[i].innerText.toLowerCase().includes(tabName));
        }
    }
}

function loadMoreFunc() {
    const loader = document.getElementById('loader');
    if (!nextUrl || loader.classList.contains('active')) return;
    showLoader();
    setTimeout(fetchNextBatch, 50);
}

async function fetchNextBatch() {
    try {
        const response = await fetch(nextUrl);
        const data = await response.json();
        nextUrl = data.next;
        for (let i = 0; i < data.results.length; i++) {
            await addToCache(data.results[i].name, data.results[i].url);
            charactersArray.push(pokemonCache[data.results[i].name]);
        }
        render(charactersArray);
    } catch (e) { console.error(e); }
    hideLoader();
}

document.getElementById('searching').addEventListener('input', async (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length === 0) {
        toggleLoadMoreButton(true);
        return render(charactersArray);
    }
    toggleLoadMoreButton(false);
    if (term.length < 3) return;
});

function nextPokemon() { if (currentIndex < (searchResults.length || charactersArray.length) - 1) { currentIndex++; updateDialogContent(searchResults.length > 0 ? searchResults : charactersArray); } }
function backPokemon() { if (currentIndex > 0) { currentIndex--; updateDialogContent(searchResults.length > 0 ? searchResults : charactersArray); } }

function getTypeColor(type) {
    const colors = { grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#869215', normal: '#a3a3a3', poison: '#A43E9E', electric: '#ffd633', ground: '#c0ac75', fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038', ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8' };
    return colors[type] || '#A8A878';
}

function openDetails(id) {
    const pool = searchResults.length > 0 ? searchResults : charactersArray;
    for (let i = 0; i < pool.length; i++) { if (pool[i].id === id) { currentIndex = i; break; } }
    updateDialogContent(pool);
    document.getElementById('pokemonCard').showModal();
}

function closeDialog() { document.getElementById('pokemonCard').close(); }
function showLoader() { document.getElementById('loader')?.classList.add('active'); }
function hideLoader() { document.getElementById('loader')?.classList.remove('active'); }

document.getElementById('pokemonCard').addEventListener('click', (e) => { if (e.target.nodeName === 'DIALOG') closeDialog(); });
document.querySelector('header form')?.addEventListener('submit', (e) => e.preventDefault());