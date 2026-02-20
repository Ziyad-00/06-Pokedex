let charactersArray = [], allPokemonNames = [], searchResults = [], pokemonCache = {};
let nextUrl = '', currentIndex = 0, activeTab = 'about';

async function getCharacter() {
    showLoader();
    try {
        const resp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await resp.json();
        allPokemonNames = data.results;
        setTimeout(loadInitialPokemon, 200);
    } catch (e) { console.error("Fehler:", e); hideLoader(); }
}

async function loadInitialPokemon() {
    const resp = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await resp.json();
    nextUrl = data.next;
    for (let i = 0; i < data.results.length; i++) {
        await addToCache(data.results[i].name, data.results[i].url);
        charactersArray.push(pokemonCache[data.results[i].name]);
    }
    render(charactersArray);
    hideLoader();
}

async function addToCache(pName, url) {
    if (!pokemonCache[pName]) {
        const detailResp = await fetch(url);
        pokemonCache[pName] = await detailResp.json();
    }
}

function toggleLoadMoreButton(show) {
    const btn = document.getElementById('loadMore');
    if (btn) btn.style.display = show ? 'flex' : 'none';
}
document.getElementById('searching').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();

    if (term.length === 0) {
        searchResults = [];
        toggleLoadMoreButton(true);
        return render(charactersArray);
    }
    toggleLoadMoreButton(false);
    if (term.length >= 3) {
        showLoader();
        setTimeout(() => executeSearch(term), 800);
    }
});


function executeSearch(term) {
    searchResults = [];
    for (let i = 0; i < charactersArray.length; i++) {
        const name = charactersArray[i].name.toLowerCase();
        if (name.includes(term)) {
            searchResults.push(charactersArray[i]);
        }
    }
    render(searchResults);
    hideLoader();
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
    if (!pokemon) return;
    const color = getTypeColor(pokemon.types[0].type.name);
    const contentHtml = prepareTabContent(pokemon);
    const dialog = document.getElementById('pokemonCard');
    dialog.style.backgroundColor = color;
    dialog.innerHTML = getDialogInternalTemplate(pokemon, renderTypesHtml(pokemon.types), contentHtml, activeTab);
}

function switchTab(tabName) {
    activeTab = tabName;
    const pool = searchResults.length > 0 ? searchResults : charactersArray;
    const tabContainer = document.querySelector('.tab-body');
    if (tabContainer) {
        tabContainer.innerHTML = prepareTabContent(pool[currentIndex]);
        const tabs = document.querySelectorAll('.tab-menu span');
        for (let i = 0; i < tabs.length; i++) {
            const isActive = tabs[i].innerText.toLowerCase().includes(tabName);
            tabs[i].classList.toggle('active', isActive);
        }
    }
}

function prepareTabContent(pokemon) {
    if (activeTab === 'about') return getAboutTemplate(pokemon, getAbilitiesString(pokemon));
    let statsHtml = '<div class="stats-list">';
    for (let i = 0; i < pokemon.stats.length; i++) {
        const s = pokemon.stats[i];
        const label = s.stat.name.replace('-', ' ');
        statsHtml += getStatRowTemplate(label, s.base_stat, (s.base_stat / 150) * 100);
    }
    return statsHtml + '</div>';
}

function getAbilitiesString(pokemon) {
    let abs = "";
    for (let j = 0; j < pokemon.abilities.length; j++) {
        abs += pokemon.abilities[j].ability.name + (j < pokemon.abilities.length - 1 ? ", " : "");
    }
    return abs;
}

async function fetchNextBatch() {
    try {
        const resp = await fetch(nextUrl);
        const data = await resp.json();
        nextUrl = data.next;
        for (let i = 0; i < data.results.length; i++) {
            await addToCache(data.results[i].name, data.results[i].url);
            charactersArray.push(pokemonCache[data.results[i].name]);
        }
        render(charactersArray);
    } catch (e) { console.error(e); } finally { hideLoader(); }
}

function loadMoreFunc() {
    if (!nextUrl || document.getElementById('loader').classList.contains('active')) return;
    showLoader();
    setTimeout(fetchNextBatch, 200);
}

function openDetails(id) {
    const pool = searchResults.length > 0 ? searchResults : charactersArray;
    for (let i = 0; i < pool.length; i++) {
        if (pool[i].id === id) { currentIndex = i; break; }
    }
    updateDialogContent(pool);
    document.getElementById('pokemonCard').showModal();
}

function renderTypesHtml(types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        html += `<span class="type-badge">${types[i].type.name}</span>`;
    }
    return html;
}

function nextPokemon() {
    const pool = searchResults.length > 0 ? searchResults : charactersArray;
    if (currentIndex >= pool.length - 1) {
        currentIndex = 0;
    } else {
        currentIndex++;
    }
    updateDialogContent(pool);
}

function backPokemon() {
    const pool = searchResults.length > 0 ? searchResults : charactersArray;
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = pool.length - 1;
    }
    updateDialogContent(pool);
}
function getTypeColor(type) {
    const colors = { grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#869215', normal: '#a3a3a3', poison: '#A43E9E', electric: '#ffd633', ground: '#c0ac75', fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038', ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8' };
    return colors[type] || '#A8A878';
}
function closeDialog() { document.getElementById('pokemonCard').close(); }
function showLoader() { document.getElementById('loader')?.classList.add('active'); }
function hideLoader() { document.getElementById('loader')?.classList.remove('active'); }
document.getElementById('pokemonCard').addEventListener('click', (e) => { if (e.target.nodeName === 'DIALOG') closeDialog(); });
document.querySelector('header form')?.addEventListener('submit', (e) => e.preventDefault());

function goHome() {
    window.location.href = window.location.pathname;
}