// creates the template for a pokemon:
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
    const cleanName = this.textInput.value
      .toLowerCase()
      .trim()
      .match(/[a-z]/gi)
      .join("");
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

// create your pokemon:
const friendInput = document.getElementById("chooseMyPokemon");
const friendDisplay = document.getElementById("displayMyPokemon");
const friendForm = document.getElementById("myPokemon");

const friendPokemon = new Pokemon(
  friendInput,
  friendDisplay,
  friendForm,
  "friend"
);

// create enemy pokemon:
const enemyInput = document.getElementById("chooseMyPokemon2");
const enemyDisplay = document.getElementById("displayMyPokemon2");
const enemyForm = document.getElementById("myPokemon2");

const enemyPokemon = new Pokemon(enemyInput, enemyDisplay, enemyForm, "enemy");

/*

Outstanding tasks:

-make UI look nice
-make win logic <- I think I'm done with this now???


---- MATH LOGIC ----
example: 
Fire does half damage to water.
Water also does double damage to fire.

I think the multiplier for each of these should be Math.sqrt(2)
if there's a fire vs. water match up, I want the water pokemon to be twice as likely to win.


Fire does half damage to water. - fire pokemon's probability /= Math.sqrt(2)
Water also does double damage to fire. - water pokemon's probability *= Math.sqrt(2)

overall the water pokemon is twice as likely to win.
--- END MATH LOGIC ----

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

  // My pokemon could have 1 or 2 types, so I need to be able to handle damage comparisons for both when applicable
  // this function is modular and can be used for both scenarios
  // this also makes the code more DRY
  function handleDamageCalc(response) {
    let friendProbability = 1;
    let enemyProbability = 1;
    let myDamageRelations = new Object(response.damage_relations);
    for (let item of myDamageRelations.double_damage_from) {
      if (enemyPokemon.types.includes(item.name)) {
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
  }

  // I'm doing a final round of logging at the end of my API response handling, and then I pass the necessary information off to the next function that's declared outside of this event listener.
  // This also makes my implementation more DRY
  function processForExit() {
    console.log("friend: ", friendEffectivenessArray);
    console.log("enemy: ", enemyEffectivenessArray);
    console.log("friendPokemon.types", friendPokemon.types);
    console.log("enemyPokemon.types", enemyPokemon.types);
    handleProbability(friendEffectivenessArray, enemyEffectivenessArray);
  }

  // if pokemon has 2 types:
  if (friendPokemon.types.length > 1) {
    // the fetch request is for my pokemon's type(s) to get information about type-effectiveness
    // Ex: Water type does double damage to fire type and fire does half damage to water
    // // -Yes, I'm using the pokemons' types as a proxy for how effective they are against each other, and NOT available move-sets.
    // In the case where my pokemon has 2 types, I need to capture both API responses FIRST and then do some data handling based off of BOTH.
    // I previously iterated over my pokemon's types in a for loop, which caused a nasty bug when the 2nd promise resolved before the 1st.
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
        console.log("Response 1 damage relations:", response1.damage_relations);
        console.log("Response 2:", response2.damage_relations);
        return [response1, response2];
      })
      .then(([response1, response2]) => {
        [response1, response2].forEach((response) =>
          handleDamageCalc(response)
        );
      })
      .then(() => {
        processForExit();
      });
  }
  // or if pokemon has just 1 type:
  else {
    fetch(`https://pokeapi.co/api/v2/type/${friendPokemon.types[0]}/`)
      .then((response) => response.json())
      .then((response) => {
        handleDamageCalc(response);
      })
      .then(() => {
        processForExit();
      });
  }
});

function handleProbability(friendEffectivenessArray, enemyEffectivenessArray) {
  // If my pokemon has 2 types, this array will be of length 2, and I'm finding the average of those array values
  // When my pokemon only has 1 type arr.length = 1, so I could have just compared the values at [0], but this implementation covers both cases.
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

document.getElementById("reset").addEventListener("click", function () {
  location.reload();
});

/*

Todo: If an API response fails, display that.

There's the fetch for pokemon, and the fetch for types.

output area should display the failed request or something.

*/
