let charactersArray = [];
let filteredCharacters = [];

async function getCharacter() {
    /*const characters = await fetch('https://pokeapi.co/api/v2/pokemon');
    const characterAsJson = await characters.json();
    console.log(characterAsJson);*/



    const characters = await fetch('https://pokeapi.co/api/v2/pokemon/1/');
    const characterAsJson = await characters.json();
    console.log(characterAsJson);
    //render(characterAsJson);
}





/*
function render(characters) {
    const contentRef = document.getElementById('content');
    contentRef.innerHTML = '';
    for (i = 0; i < characters.length; i++) {
        const character = characters[i];
        contentRef.innerHTML += `
        <div class = "card">
            <h2> ${character}['name'] </h2>
            <div>
                <div>
                    <p>${character}['type']</p>                
                    <p></p>                
                </div>
                <img src="${character['imageUrl']}" >
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