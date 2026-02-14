let charactersArray = [];

async function getCharacter() {
    // 1. Daten holen
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await response.json();

    // 2. Die Liste der Pokémon in unser Array speichern
    charactersArray = data.results;

    // 3. Die Render-Funktion mit dem Array aufrufen
    render(charactersArray);
    console.log(charactersArray);
}

function render(list) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        let pokemon = list[i];

        // Hinweis: Da das Bild in der Liste fehlt, nutzen wir hier einen Trick mit der ID
        let pokemonId = pokemon.url.split('/')[6];
        let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        console.log(imageUrl);

        contentRef.innerHTML += `
        <div class="card">
            <div class="card_content">
                <h2>${pokemon.name}</h2>
                <div>
                    <img src="${imageUrl}" alt="${pokemon.name}">
                </div>
            </div>
        </div>
        `;
    }
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