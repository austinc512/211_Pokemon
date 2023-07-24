class Pokemon {
  constructor(textInput, displayArea, formElement, friend) {
    this.textInput = textInput;
    this.displayArea = displayArea;
    this.formElement = formElement;
    this.friend = friend;
    this.formElement.addEventListener(
      "submit",
      this.handleFormSubmit.bind(this)
    );
    this.name = "";
    this.types = [];
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(this.textInput);
    // NOTE: need to NOT fetch if text input is empty
    // also, don't fetch if a selected pokemon already exists
    const cleanName = this.textInput.value.toLowerCase().trim();
    fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        return response;
      })
      .then((response) => {
        // capturing name and types from API response
        this.name = response.name;
        console.log(this.name);
        for (let item of response.types) {
          this.types.push(item.type.name);
        }
        console.log(this.types);
        return response;
      })
      .then((response) => {
        const friendOrFoe =
          this.friend == "friend"
            ? response.sprites.back_default
            : response.sprites.front_default;
        let html = `
      <div class="data-unit">
        <img src="${friendOrFoe}">
      </div>`;
        this.displayArea.insertAdjacentHTML("beforeend", html);
      });
  };
}

const friendInput = document.getElementById("chooseMyPokemon");
const friendDisplay = document.getElementById("displayMyPokemon");
const friendForm = document.getElementById("myPokemon");

const friendPokemon = new Pokemon(
  friendInput,
  friendDisplay,
  friendForm,
  "friend"
);

const enemyInput = document.getElementById("chooseMyPokemon2");
const enemyDisplay = document.getElementById("displayMyPokemon2");
const enemyForm = document.getElementById("myPokemon2");

const enemyPokemon = new Pokemon(enemyInput, enemyDisplay, enemyForm, "enemy");

/*

Other tasks:

-make UI look nice
-make win logic

as a first-level property from the GET charizard response:

  "types": [
    {
      "slot": 1,
      "type": {
        "name": "fire",
        "url": "https://pokeapi.co/api/v2/type/10/"
      }
    },
    {
      "slot": 2,
      "type": {
        "name": "flying",
        "url": "https://pokeapi.co/api/v2/type/3/"
      }
    }
  ],


const friendTypes = [];  
for (let item of response.types) {
  friendTypes.push(item.type.name)
}  



GET https://pokeapi.co/api/v2/type/fire/


fake response:
{
    "damage_relations": {
        "double_damage_from": [
            {
                "name": "bug",
                "url": "https://pokeapi.co/api/v2/type/7/"
            },
        ],
     "double_damage_to": [
            {
                "name": "bug",
                "url": "https://pokeapi.co/api/v2/type/7/"
            },
        ],  
        "half_damage_from": [
            {
                "name": "bug",
                "url": "https://pokeapi.co/api/v2/type/7/"
            },
        ],
     "half_damage_to": [
            {
                "name": "bug",
                "url": "https://pokeapi.co/api/v2/type/7/"
            },
        ],                    
        "no_damage_from": [],
        "no_damage_to": []
} 


example: 
Fire does half damage to water.
Water also does double damage to fire.

I think the multiplier for each of these should be Math.sqrt(2)
if there's a fire vs. water match up, I want the water pokemon to be twice as likely to win.


Fire does half damage to water. - water pokemon's probability * Math.sqrt(2)
Water also does double damage to fire. - water pokemon's probability * Math.sqrt(2)

overall the water pokemon is twice as likely to win.

*/

const compareBtn = document.getElementById("comparePokemon");
compareBtn.addEventListener("click", function () {
  if (!friendPokemon.name || !enemyPokemon.name) {
    console.log(`not enough info`);
    return;
  }
  console.log(friendPokemon.types);
  console.log(enemyPokemon.types);

  const friendEffectivenessArray = [];
  const enemyEffectivenessArray = [];

  // my pokemon's type(s) get passed into the for loop
  // we check each one against the enemy's type(s) and see if any of these are matched:
  // double_damage_from, double_damage_to, half_damage_from, half_damage_to, no_damage_from, no_damage_to
  for (let i = 0; i < friendPokemon.types.length; i++) {
    fetch(`https://pokeapi.co/api/v2/type/${friendPokemon.types[i]}/`)
      // Sometimes I have to make 2 GET requests, and the implementation has to suit my use of a for loop here.
      .then((response) => response.json())
      .then((response) => {
        let friendProbability = 1;
        let enemyProbability = 1;
        let myDamageRelations = new Object(response.damage_relations);
        // ^^ Is there a JSON method I could also use here?
        console.log(myDamageRelations);
        for (let item of myDamageRelations.double_damage_from) {
          // w/o creating myDamageRelations object, this was just returning the names of elements b/c it's an API response in JSON, I think...
          // not even 100% sure what the hell happened there, but creating this object solved the problem.
          if (enemyPokemon.types.includes(item.name)) {
            // if BOTH of enemy Pokemon's types are super effective, I'm still only changing the probability once.
            // one strength of this approach is when the enemy has 2 types and one of those types causes it to be immune from my current type iteration
            // I think this is a good middle ground, and I can't be bothered otherwise.
            console.log(`My pokemon takes double damage from: ${item.name}`);
            enemyProbability *= Math.sqrt(2);
            console.log(`enemyProbability: ${enemyProbability}`);
          }
        }
        for (let item of myDamageRelations.double_damage_to) {
          if (enemyPokemon.types.includes(item.name)) {
            console.log(`My pokemon has deals double damage to: ${item.name}`);
            friendProbability *= Math.sqrt(2);
            console.log(`friendProbability: ${friendProbability}`);
          }
        }
        for (let item of myDamageRelations.half_damage_from) {
          if (enemyPokemon.types.includes(item.name)) {
            console.log(`My pokemon takes half damage from: ${item.name}`);
            enemyProbability /= Math.sqrt(2);
            console.log(
              `enemyProbability got divided by sqrt(2): ${enemyProbability}`
            );
          }
        }
        for (let item of myDamageRelations.half_damage_to) {
          if (enemyPokemon.types.includes(item.name)) {
            console.log(`My pokemon deals half damage to: ${item.name}`);
            friendProbability /= Math.sqrt(2);
            console.log(
              `My probability got divided by sqrt(2): ${friendProbability}`
            );
          }
        }
        for (let item of myDamageRelations.no_damage_from) {
          if (enemyPokemon.types.includes(item.name)) {
            console.log(`My pokemon takes no damage from: ${item.name}`);
            enemyProbability = 0;
            console.log(`enemyProbability for this iteration became 0`);
          }
        }
        for (let item of myDamageRelations.no_damage_to) {
          if (enemyPokemon.types.includes(item.name)) {
            console.log(`My pokemon deals no damage to: ${item.name}`);
            friendProbability = 0;
            console.log(`friendProbability for this iteration became 0`);
          }
        }

        friendEffectivenessArray.push(friendProbability);
        enemyEffectivenessArray.push(enemyProbability);
      })
      .then(() => {
        // there's too much shit going on in this function, so I'm handling the rest separately.
        console.log("i:", i);
        console.log("friend: ", friendEffectivenessArray);
        console.log("enemy: ", enemyEffectivenessArray);
        console.log("friendPokemon.types", friendPokemon.types);
        console.log("enemyPokemon.types", enemyPokemon.types);
        handleProbability(
          i,
          friendEffectivenessArray,
          enemyEffectivenessArray,
          friendPokemon.types.length
        );
      });
  }
});

function handleProbability(
  i,
  friendEffectivenessArray,
  enemyEffectivenessArray,
  friendPokemonTypeCount
) {
  if (i + 1 < friendPokemonTypeCount) {
    console.log(
      `We haven't finished iterating over my pokemon's types yet. Waiting.`
    );
    // this allows me to deal with the asychronous nature the for loop in the event handler
  } else {
    const friendScore =
      friendEffectivenessArray.reduce((acc, curr) => acc + curr, 0) /
      friendEffectivenessArray.length;
    const enemyScore =
      enemyEffectivenessArray.reduce((acc, curr) => acc + curr, 0) /
      enemyEffectivenessArray.length;
    const winnerOutput = document.getElementById("predictWinner");
    if (friendScore > enemyScore) {
      console.log(`${friendPokemon.name} is predicted to be the winner`);
      winnerOutput.innerHTML = `${friendPokemon.name} is predicted to be the winner`;
    } else if (enemyScore > friendScore) {
      console.log(`${enemyPokemon.name} is predicted to be the winner`);
      winnerOutput.innerHTML = `${enemyPokemon.name} is predicted to be the winner`;
    } else {
      console.log(
        `This logic only considers the pokemons' types, so we do not have enough info to make a prediction`
      );
      winnerOutput.innerHTML = `This logic only considers the pokemons' types, so we do not have enough info to make a prediction`;
    }
  }
}

/*

myDamageRelations:

{double_damage_from: Array(3), double_damage_to: Array(4), half_damage_from: Array(6), half_damage_to: Array(4), no_damage_from: Array(0), …}
double_damage_from: 
(3) [{…}, {…}, {…}]
double_damage_to: 
(4) [{…}, {…}, {…}, {…}]
half_damage_from: 
(6) [{…}, {…}, {…}, {…}, {…}, {…}]
half_damage_to: 
(4) [{…}, {…}, {…}, {…}]
no_damage_from: 
[]
no_damage_to: 
[]
[[Prototype]]
: 
Object

*/

document.getElementById("reset").addEventListener("click", function () {
  location.reload();
});
