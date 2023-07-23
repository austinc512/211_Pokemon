// const myPokemon = document.getElementById("myPokemon");
// myPokemon.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const pokemonName = document.getElementById("chooseMyPokemon").value;
//   console.log(pokemonName);
//   const cleanName = pokemonName.toLowerCase().trim();
//   console.log(cleanName);
//   fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`)
//     .then((response) => response.json())
//     .then((response) => {
//       console.log(response);
//       return response;
//     })
//     .then((response) => {
//       console.log(response.sprites.back_default);
//       let html = `
//       <div class="data-unit">
//         <img src="${response.sprites.back_default}">
//       </div>`;
//       document
//         .getElementById("displayMyPokemon")
//         .insertAdjacentHTML("beforeend", html);
//     });
// });

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
  }
  handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Your form submission handling code here
    // For example, you can access form inputs, validate data, or send data to the server
    event.stopPropagation();
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
        console.log(
          this.friend == "friend"
            ? response.sprites.back_default
            : response.sprites.front_default
        );
        const friendOrFoe =
          this.friend == "friend"
            ? response.sprites.back_default
            : response.sprites.front_default;
        // response.sprites.front_default
        let html = `
      <div class="data-unit">
        <img src="${friendOrFoe}">
      </div>`;
        this.displayArea.insertAdjacentHTML("beforeend", html);
      });

    // If you want to access form data, you can use the following:
    // const formData = new FormData(this.formElement); // This will give you a FormData object containing form field data
  };
}

/*
textInput, displayArea, formElement
document.getElementById('chooseMyPokemon'), document.getElementById('displayMyPokemon'), document.getElementById('myPokemon')
*/

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

// const myPokemon2 = document.getElementById("myPokemon2");
// myPokemon2.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const pokemonName = friendInput.value;
//   console.log(pokemonName);
//   const cleanName = pokemonName.toLowerCase().trim();
//   console.log(cleanName);
//   fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`)
//     .then((response) => response.json())
//     .then((response) => {
//       console.log(response);
//       return response;
//     })
//     .then((response) => {
//       console.log(response.sprites.front_default);
//       let html = `
//       <div class="data-unit">
//         <img src="${response.sprites.front_default}">
//       </div>`;
//       document
//         .getElementById("displayMyPokemon2")
//         .insertAdjacentHTML("beforeend", html);
//     });
// });

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

/*
textInput, displayArea, formElement
document.getElementById('chooseMyPokemon'), document.getElementById('displayMyPokemon'), document.getElementById('myPokemon')
*/

/*
class MyClass {
  constructor() {
    this.formElement = document.getElementById("myForm"); // Assuming you have a form element with the ID "myForm"

    // Add the event listener to the form
    this.formElement.addEventListener(
      "submit",
      this.handleFormSubmit.bind(this)
    );
  }

  // Define the event handler method for form submission
  handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Your form submission handling code here
    // For example, you can access form inputs, validate data, or send data to the server
    console.log("Form submitted!");

    // If you want to access form data, you can use the following:
    // const formData = new FormData(event.target); // This will give you a FormData object containing form field data
  }

  // Other methods and properties of the class can be defined here
}

// Create an instance of the class
const myInstance = new MyClass();

*/
