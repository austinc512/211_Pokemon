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
    // event.stopPropagation();
    // console.log("Form submitted!");
    console.log(this.textInput);
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
        console.log(
          this.friend == "friend"
            ? response.sprites.back_default
            : response.sprites.front_default
        );
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


{
    "damage_relations": {
        "double_damage_from": [
            {
                "name": "ground",
                "url": "https://pokeapi.co/api/v2/type/5/"
            },
            {
                "name": "rock",
                "url": "https://pokeapi.co/api/v2/type/6/"
            },
            {
                "name": "water",
                "url": "https://pokeapi.co/api/v2/type/11/"
            }
        ],
        "double_damage_to": [
            {
                "name": "bug",
                "url": "https://pokeapi.co/api/v2/type/7/"
            },
            {
                "name": "steel",
                "url": "https://pokeapi.co/api/v2/type/9/"
            },
            {
                "name": "grass",
                "url": "https://pokeapi.co/api/v2/type/12/"
            },
            {
                "name": "ice",
                "url": "https://pokeapi.co/api/v2/type/15/"
            }
        ],
        "half_damage_from": [
            {
                "name": "bug",
                "url": "https://pokeapi.co/api/v2/type/7/"
            },
            {
                "name": "steel",
                "url": "https://pokeapi.co/api/v2/type/9/"
            },
            {
                "name": "fire",
                "url": "https://pokeapi.co/api/v2/type/10/"
            },
            {
                "name": "grass",
                "url": "https://pokeapi.co/api/v2/type/12/"
            },
            {
                "name": "ice",
                "url": "https://pokeapi.co/api/v2/type/15/"
            },
            {
                "name": "fairy",
                "url": "https://pokeapi.co/api/v2/type/18/"
            }
        ],
        "half_damage_to": [
            {
                "name": "rock",
                "url": "https://pokeapi.co/api/v2/type/6/"
            },
            {
                "name": "fire",
                "url": "https://pokeapi.co/api/v2/type/10/"
            },
            {
                "name": "water",
                "url": "https://pokeapi.co/api/v2/type/11/"
            },
            {
                "name": "dragon",
                "url": "https://pokeapi.co/api/v2/type/16/"
            }
        ],
        "no_damage_from": [],
        "no_damage_to": []
    },

...
}

*/

const compareBtn = document.getElementById("comparePokemon");
compareBtn.addEventListener("click", function () {
  if (!friendPokemon.name || !enemyPokemon.name) {
    console.log(`not enough info`);
    return;
  } else {
    console.log(`looks good`);
  }
  console.log(friendPokemon.types);
  console.log(enemyPokemon.types);

  // I'm only using pokemon types to predict the winner.
  // type effectiveness in pokemon is done with multipliers
  // if one of my pokemon's types is super effective against the enemy, multiply my probability by 2
  // if one of my pokemon's types is weak against the enemy, multiply enemy probability by 2
  let friendProbability = 1;
  let enemyProbability = 1;

  console.log(`types fetch: ${friendPokemon.types[0]}`);
  fetch(`https://pokeapi.co/api/v2/type/${friendPokemon.types[0]}/`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response.damage_relations);
      let myDamageRelations = new Object(response.damage_relations);
      console.log(myDamageRelations);
      for (let item of myDamageRelations.double_damage_from) {
        console.log(item.name);
        if (enemyPokemon.types.includes(item.name)) {
          console.log(`enemy has super effective type: ${item.name}`);
          enemyProbability *= 2;
        }
      }
      // for (let item of myDamageRelations.double_damage_from) {
      //   console.log(item.name);
      //   if (enemyPokemon.types.includes(item.name)) {
      //     console.log(`enemy has super effective type: ${item.name}`);
      //     enemyProbability *= 2;
      //   }
      // }
    });
});

/*

Charizard vs. Blastoise example

const friendTypes // ['fire', 'flying']
enemyTypes // ['water']

let friendScore = 1;
let enemyScore = 1;

query friend types
GET https://pokeapi.co/api/v2/type/fire/
GET https://pokeapi.co/api/v2/type/flying/

(can be 2 different types)

within each query, have to do a few things

response.damage_relations

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

iterate through response.damage_relations

for item in response.damage_relations


*/
