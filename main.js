// function getPokemon(str) {
//   const query = str.toLowerCase().trim();
//   fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
//     .then((response) => response.json())
//     .then((response) => {
//       console.log(response);
//       return response;
//     })
//     .then((response) => (Charizard = response));
// }

let storeMyPokemon;

const myPokemon = document.getElementById("myPokemon");
myPokemon.addEventListener("submit", function (e) {
  e.preventDefault();
  // e.stopPropagation();
  const pokemonName = document.getElementById("chooseMyPokemon").value;
  console.log(pokemonName);
  const cleanName = pokemonName.toLowerCase().trim();
  console.log(cleanName);
  fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((response) => {
      console.log(response.sprites.back_default);
      let html = `
      <div class="data-unit">
        <img src="${response.sprites.back_default}">
      </div>`;
      document
        .getElementById("displayMyPokemon")
        .insertAdjacentHTML("beforeend", html);
    });
});

const myPokemon2 = document.getElementById("myPokemon2");
myPokemon2.addEventListener("submit", function (e) {
  e.preventDefault();
  // e.stopPropagation();
  const pokemonName = document.getElementById("chooseMyPokemon2").value;
  console.log(pokemonName);
  const cleanName = pokemonName.toLowerCase().trim();
  console.log(cleanName);
  fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((response) => {
      console.log(response.sprites.front_default);
      let html = `
      <div class="data-unit">
        <img src="${response.sprites.front_default}">
      </div>`;
      document
        .getElementById("displayMyPokemon2")
        .insertAdjacentHTML("beforeend", html);
    });
});

// .then((response) => (Charizard = response));
// sprites.frontDefault
//         <h3>${person.name.first} ${person.name.last}</h3>
//         <button id="${index}" onclick="toggleFunction(${index})" >Show More Info</button>

/*

I want to try to do this with a class.

What things do we need for a pokemon?

-we need a text input area for the pokemon
  document.getElementById('chooseMyPokemon')
- we need a display area for that pokemon
  document.getElementById('displayMyPokemon')
    .insertAdjacentHTML("beforeend", html);



-query that pokemon (will be a method)


*/

class Human {
  constructor(name, height, weight, dob) {
    this.name = name;
    this.height = height;
    this.weight = weight;
    this.dob = dob;
  }
  greeting() {
    return "Hello " + this.name + "!";
  }
}
