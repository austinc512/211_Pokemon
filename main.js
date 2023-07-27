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


Fire does half damage to water. - fire pokemon's probability /= Math.sqrt(2)
Water also does double damage to fire. - water pokemon's probability *= Math.sqrt(2)

overall the water pokemon is twice as likely to win.

*/

// this is completely fucked due to async nature of promises.
// need to fetch both requests BEFORE handling anything

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

  /*

if my pokemon has 2 types, do both fetch requests first.

if 1 type
  handle

if 2 types
  separate handle  

  




*/

  // a pokemon can have either 1 or 2 types
  if (friendPokemon.types.length > 1) {
    // promise.all
    function fetchAPI(url) {
      return fetch(url).then((response) => response.json());
    }
    function handleAPIRequests(apiEndpoints) {
      const promises = apiEndpoints.map((endpoint) => fetchAPI(endpoint));

      return Promise.all(promises);
    }

    handleAPIRequests([
      `https://pokeapi.co/api/v2/type/${friendPokemon.types[0]}/`,
      `https://pokeapi.co/api/v2/type/${friendPokemon.types[1]}/`,
    ])
      .then(([response1, response2]) => {
        // Logic using both API responses
        console.log("Response 1 damage relations:", response1.damage_relations);
        console.log("Response 2:", response2.damage_relations);
        return [response1, response2];
      })
      .then(([response1, response2]) => {
        [response1, response2].forEach((element) => {
          let friendProbability = 1;
          let enemyProbability = 1;
          let myDamageRelations = new Object(element.damage_relations);
          for (let item of myDamageRelations.double_damage_from) {
            // w/o creating myDamageRelations object, this was just returning the names of elements b/c it's an API response in JSON, I think...
            // not even 100% sure what the hell happened there, but creating this object solved the problem.
            if (enemyPokemon.types.includes(item.name)) {
              // this DOES increment twice. good.
              console.log(`My pokemon takes double damage from: ${item.name}`);
              enemyProbability *= Math.sqrt(2);
              console.log(`enemyProbability: ${enemyProbability}`);
            }
          }
          for (let item of myDamageRelations.double_damage_to) {
            if (enemyPokemon.types.includes(item.name)) {
              console.log(
                `My pokemon has deals double damage to: ${item.name}`
              );
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
        });
      })
      .then(() => {
        console.log("friend: ", friendEffectivenessArray);
        console.log("enemy: ", enemyEffectivenessArray);
        console.log("friendPokemon.types", friendPokemon.types);
        console.log("enemyPokemon.types", enemyPokemon.types);
        handleProbability(friendEffectivenessArray, enemyEffectivenessArray);

        // this looks good for when my pokemon has 1 type
        // it's also fine whenever the enemy has 2 types and I have 1 type.
      });
    // so far I now have access to BOTH damage_relations objects now

    // now I can iterate over both of these damage relations objects
    // .then(([response1, response2]) => {
    //   let friendProbability = 1;
    //   let enemyProbability = 1;
    //   for (response in response1) {
    //     console.log(response.damage_relations);
    //   }
    // });
  } else {
    // singular
    fetch(`https://pokeapi.co/api/v2/type/${friendPokemon.types[0]}/`)
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
            // this DOES increment twice. good.
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
        console.log("friend: ", friendEffectivenessArray);
        console.log("enemy: ", enemyEffectivenessArray);
        console.log("friendPokemon.types", friendPokemon.types);
        console.log("enemyPokemon.types", enemyPokemon.types);
        handleProbability(friendEffectivenessArray, enemyEffectivenessArray);

        // this looks good for when my pokemon has 1 type
        // it's also fine whenever the enemy has 2 types and I have 1 type.
      });
  }

  // for (let i = 0; i < friendPokemon.types.length; i++) {
  //   fetch(`https://pokeapi.co/api/v2/type/${friendPokemon.types[i]}/`)
  //     // Sometimes I have to make 2 GET requests.
  //     // the second promise is getting resolved before the first sometimes, which causes a bug.
  //     .then((response) => response.json())
  //     .then((response) => {
  //       let friendProbability = 1;
  //       let enemyProbability = 1;
  //       let myDamageRelations = new Object(response.damage_relations);
  //       // ^^ Is there a JSON method I could also use here?
  //       console.log(myDamageRelations);
  //       for (let item of myDamageRelations.double_damage_from) {
  //         // w/o creating myDamageRelations object, this was just returning the names of elements b/c it's an API response in JSON, I think...
  //         // not even 100% sure what the hell happened there, but creating this object solved the problem.
  //         if (enemyPokemon.types.includes(item.name)) {
  //           // this DOES increment twice. good.
  //           console.log(`My pokemon takes double damage from: ${item.name}`);
  //           enemyProbability *= Math.sqrt(2);
  //           console.log(`enemyProbability: ${enemyProbability}`);
  //         }
  //       }
  //       for (let item of myDamageRelations.double_damage_to) {
  //         if (enemyPokemon.types.includes(item.name)) {
  //           console.log(`My pokemon has deals double damage to: ${item.name}`);
  //           friendProbability *= Math.sqrt(2);
  //           console.log(`friendProbability: ${friendProbability}`);
  //         }
  //       }
  //       for (let item of myDamageRelations.half_damage_from) {
  //         if (enemyPokemon.types.includes(item.name)) {
  //           console.log(`My pokemon takes half damage from: ${item.name}`);
  //           enemyProbability /= Math.sqrt(2);
  //           console.log(
  //             `enemyProbability got divided by sqrt(2): ${enemyProbability}`
  //           );
  //         }
  //       }
  //       for (let item of myDamageRelations.half_damage_to) {
  //         if (enemyPokemon.types.includes(item.name)) {
  //           console.log(`My pokemon deals half damage to: ${item.name}`);
  //           friendProbability /= Math.sqrt(2);
  //           console.log(
  //             `My probability got divided by sqrt(2): ${friendProbability}`
  //           );
  //         }
  //       }
  //       for (let item of myDamageRelations.no_damage_from) {
  //         if (enemyPokemon.types.includes(item.name)) {
  //           console.log(`My pokemon takes no damage from: ${item.name}`);
  //           enemyProbability = 0;
  //           console.log(`enemyProbability for this iteration became 0`);
  //         }
  //       }
  //       for (let item of myDamageRelations.no_damage_to) {
  //         if (enemyPokemon.types.includes(item.name)) {
  //           console.log(`My pokemon deals no damage to: ${item.name}`);
  //           friendProbability = 0;
  //           console.log(`friendProbability for this iteration became 0`);
  //         }
  //       }

  //       friendEffectivenessArray.push(friendProbability);
  //       enemyEffectivenessArray.push(enemyProbability);
  //     })
  //     .then(() => {
  //       // there's too much shit going on in this function, so I'm handling the rest separately.
  //       console.log("i:", i);
  //       console.log("friend: ", friendEffectivenessArray);
  //       console.log("enemy: ", enemyEffectivenessArray);
  //       console.log("friendPokemon.types", friendPokemon.types);
  //       console.log("enemyPokemon.types", enemyPokemon.types);
  //       handleProbability(
  //         i,
  //         friendEffectivenessArray,
  //         enemyEffectivenessArray,
  //         friendPokemon.types.length
  //       );
  //     });
  // }
});

function handleProbability(friendEffectivenessArray, enemyEffectivenessArray) {
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
    winnerOutput.innerHTML = `This logic only considers the pokemons' types, so we do not have enough info to make a prediction
      
      friend: ${friendPokemon.types}
      enemy: ${enemyPokemon.types}`;
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
