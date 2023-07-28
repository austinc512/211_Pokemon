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
    this.counter = 0;
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(this.textInput);
    const snippet =
      this.friend == "friend" ? `your pokemon!` : `an enemy pokemon!`;
    // Don't fetch if a selected pokemon already exists
    if (this.counter > 0) {
      alert(`You've already selected ${snippet}`);
      return;
    }
    // Don't fetch if text input is empty
    if (!this.textInput.value) {
      alert(`you haven't selected ${snippet}`);
      return;
    }
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
      .catch((error) => {
        alert(`That doesn't look like a valid pokemon name, sorry.`);
        console.log(error);
      })
      .then((response) => {
        console.log(response);
        // capturing name and types from API response
        this.name = response.name;
        console.log(this.name);
        // this.counter handles whether a pokemon already exists
        this.counter = 1;
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

// Compare types of both pokemon to determine a winner:
const compareBtn = document.getElementById("comparePokemon");
compareBtn.addEventListener("click", function () {
  if (!friendPokemon.name || !enemyPokemon.name) {
    alert(`You haven't selected both pokemon.`);
    return;
  }
  console.log(friendPokemon.types);
  console.log(enemyPokemon.types);

  const friendEffectivenessArray = [];
  const enemyEffectivenessArray = [];

  // My pokemon could have 1 or 2 types
  // this function is modular and can be used for both of these scenarios
  // this also makes the code more DRY
  function handleDamageCalc(response) {
    let friendProbability = 1;
    let enemyProbability = 1;
    let myDamageRelations = new Object(response.damage_relations);
    for (let item of myDamageRelations.double_damage_from) {
      if (enemyPokemon.types.includes(item.name)) {
        console.log(`My pokemon takes double damage from: ${item.name}`);
        enemyProbability *= Math.sqrt(2);
        console.log(
          `enemyProbability got multiplied by sqrt(2): ${enemyProbability}`
        );
      }
    }
    for (let item of myDamageRelations.double_damage_to) {
      if (enemyPokemon.types.includes(item.name)) {
        console.log(`My pokemon has deals double damage to: ${item.name}`);
        friendProbability *= Math.sqrt(2);
        console.log(
          `friendProbability got multiplied by sqrt(2): ${friendProbability}`
        );
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
          `friendProbability got divided by sqrt(2): ${friendProbability}`
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

  // I'm doing a final round of logging at the end of my API response handling
  // then I pass the necessary information to the next function outside of this event listener.
  // This also makes my implementation more DRY
  function processForExit() {
    console.log("friend: ", friendEffectivenessArray);
    console.log("enemy: ", enemyEffectivenessArray);
    console.log("friendPokemon.types", friendPokemon.types);
    console.log("enemyPokemon.types", enemyPokemon.types);
    handleProbability(friendEffectivenessArray, enemyEffectivenessArray);
  }

  // if pokemon has just 1 type this is super straightforward:
  if (friendPokemon.types.length == 1) {
    fetch(`https://pokeapi.co/api/v2/type/${friendPokemon.types[0]}/`)
      .then((response) => response.json())
      .then((response) => {
        handleDamageCalc(response);
      })
      .then(() => {
        processForExit();
      });
  }

  // if pokemon has 2 types:
  else if (friendPokemon.types.length > 1) {
    // the fetch request is for my pokemon's type(s) to get information about type-effectiveness
    // Ex: Water type does double damage to fire type and fire does half damage to water
    // In the case where my pokemon has 2 types, I need to capture both API responses FIRST and then do some data handling based off of BOTH.
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
        // ^^ calls handleProbability(friend, enemy) function
      });
  }
});

function handleProbability(friendEffectivenessArray, enemyEffectivenessArray) {
  // find the average of scores:
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
      <br>
      friend: ${friendPokemon.types}
      <br>
      enemy: ${enemyPokemon.types}`;
  }
}

document.getElementById("reset").addEventListener("click", function () {
  location.reload();
});
