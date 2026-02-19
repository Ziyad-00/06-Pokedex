let charactersArray = [];
let allPokemonNames = [];
let searchResults = [];
let pokemonCache = {};
let nextUrl = '';
let currentIndex = 0;
let activeTab = 'about';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getCharacter() {
    showLoader();
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await response.json();
        allPokemonNames = data.results;
        await loadInitialPokemon();
    } catch (e) {
        console.error("Fehler:", e);
        hideLoader();
    }
}

async function loadInitialPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await response.json();
    nextUrl = data.next;

    charactersArray = [];
    for (let i = 0; i < data.results.length; i++) {
        const pName = data.results[i].name;
        if (!pokemonCache[pName]) {
            const detailResp = await fetch(data.results[i].url);
            pokemonCache[pName] = await detailResp.json();
        }
        charactersArray.push(pokemonCache[pName]);
    }
    await sleep(800);
    render(charactersArray);
    hideLoader();
}

document.getElementById('searching').addEventListener('input', async (e) => {
    const term = e.target.value.toLowerCase();
    if (term.length === 0) return render(charactersArray);
    if (term.length < 3) return;
    showLoader();
    const matches = findMatches(term);
    searchResults = [];
    for (let i = 0; i < matches.length; i++) {
        const name = matches[i].name;
        if (!pokemonCache[name]) pokemonCache[name] = await (await fetch(matches[i].url)).json();
        searchResults.push(pokemonCache[name]);
    }
    render(searchResults);
    hideLoader();
});

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
        const color = getTypeColor(list[i].types[0].type.name);
        contentRef.innerHTML += getPokemonCardTemplate(list[i], color);
    }
}

async function openDetails(id) {
    const dialog = document.getElementById('pokemonCard');
    let combined = charactersArray.concat(searchResults);

    currentIndex = -1;
    for (let i = 0; i < combined.length; i++) {
        if (combined[i].id === id) { currentIndex = i; break; }
    }
    updateDialogContent(combined);
    dialog.showModal();
}

function getTypeColor(type) {
    const colors = {
        grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#869215',
        normal: '#a3a3a3', poison: '#A43E9E', electric: '#ffd633', ground: '#c0ac75',
        fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
        ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8'
    };
    return colors[type] || '#A8A878';
}

function renderTypes(types) {
    let html = "";
    for (let i = 0; i < types.length; i++) {
        html += `<span class="type-badge">${types[i].type.name}</span>`;
    }
    return html;
}

document.getElementById('pokemonCard').addEventListener('click', function (event) {
    const dialog = event.target;

    if (event.target.nodeName === 'DIALOG') {
        closeDialog();
    }
});

async function loadMoreFunc() {
    if (!nextUrl || document.getElementById('loader').classList.contains('active')) return;

    showLoader();
    try {
        const response = await fetch(nextUrl);
        const data = await response.json();
        nextUrl = data.next;

        for (let i = 0; i < data.results.length; i++) {
            const pName = data.results[i].name;
            if (!pokemonCache[pName]) {
                const detailResp = await fetch(data.results[i].url);
                pokemonCache[pName] = await detailResp.json();
            }
            charactersArray.push(pokemonCache[pName]);
        }
        render(charactersArray);
    } catch (e) {
        console.error("Ladefehler:", e);
    }
    hideLoader();
}

function updateDialogContent(pool = charactersArray) {
    const pokemon = pool[currentIndex];
    const dialog = document.getElementById('pokemonCard');
    if (pokemon) {
        const color = getTypeColor(pokemon.types[0].type.name);
        dialog.style.backgroundColor = color;
        dialog.innerHTML = getDialogInternalTemplate(pokemon, color, activeTab);
    }
}

function showLoader() { document.getElementById('loader')?.classList.add('active'); }
function hideLoader() { document.getElementById('loader')?.classList.remove('active'); }
function switchTab(tabName) { activeTab = tabName; updateDialogContent(); }
function closeDialog() { document.getElementById('pokemonCard').close(); }
function nextPokemon() { if (currentIndex < charactersArray.length - 1) { currentIndex++; updateDialogContent(); } }
function backPokemon() { if (currentIndex > 0) { currentIndex--; updateDialogContent(); } }