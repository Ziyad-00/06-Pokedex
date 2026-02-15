let charactersArray = [];
let nextUrl = '';

async function getCharacter() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await response.json();
    const shortList = data.results;
    nextUrl = data.next;

    charactersArray = [];
    // Details einzeln laden ohne map
    for (let i = 0; i < shortList.length; i++) {
        const detailResponse = await fetch(shortList[i].url);
        const pokemonDetail = await detailResponse.json();
        charactersArray.push(pokemonDetail);
    }

    render(charactersArray);
}

function render(list) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        let pokemonData = list[i];
        let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;

        // DEINE LOGIK FÜR DIE TYPEN (OHNE MAP):
        let typesArray = pokemonData.types;
        let typesHtml = "";

        for (let j = 0; j < typesArray.length; j++) {
            typeName = typesArray[j].type.name
            typesHtml += `<p>${typeName}</p>`
        }

        contentRef.innerHTML += `
        <div class="card">
            <div class="card_content">
                <h2>${pokemonData.name}</h2>
                <img src="${imageUrl}" alt="${pokemonData.name}">
                <div class="types">${typesHtml}</div>
            </div>
        </div>
        `;
    }
}

async function loadMoreFunc() {
    if (!nextUrl) return;

    const response = await fetch(nextUrl);
    const data = await response.json();

    charactersArray.push(...data.results)
    nextUrl = data.next;
    console.log("button test");

    render(charactersArray);
}






/*let charactersArray = [];
let filteredCharacters = [];
let character = []
let char_image;
let nextUrl;
async function getCharacter() {
    const characters = await fetch('https://pokeapi.co/api/v2/pokemon');
    const charactersAsJson = await characters.json();
    for (i = 0; i < charactersAsJson.results.length; i++) {
        character = charactersAsJson.results[i].name
        console.log(character);
        character = charactersAsJson.results[i];


    }
    nextUrl = charactersAsJson.next; // get nextpage link
    render(characters);
}
console.log(character);

function render(characters) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';

    for (i = 0; i < characters.length; i++) {
        contentRef.innerHTML += `
        <div class = "card">
            <h2> ${character.name} </h2>
            <div>
                <div>
                    <p>${character.type}</p>                
                    <p></p>                
                </div>
                <img src="${character.imageUrl}" >
            </div>
        </div>
        `
    }
}

*/


/*
function render(characters) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';
    for (i = 0; i < characters.length; i++) {
        const character = characters[i];
        contentRef.innerHTML += `
        <div class="card">
            <div>
                <h2> ${character['firstName']}  ${character['lastName']} </h2>
                <p> ${character['title']} </p>
            </div>
            <img src="${character['imageUrl']}" >
        </div>
        `
    }
}*/