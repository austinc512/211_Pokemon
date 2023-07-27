## Pokemon Collection

[https://www.pokeapi.co/](https://pokeapi.co/)

Instructions:

1. Sign up for api key (this no longer a requirement as of Summer 2023)
2. Create an arena that displays two Pokemon battling each other.
3. Compare the two to see who is likely to win.

Notes on my project:

My project has to make API requests to get information about my pokemon and the enemy pokemon.
For example:

GET https://pokeapi.co/api/v2/pokemon/charizard

I can use the sprites property from this response to display images of the pokemon:

```
{
  ...
  "sprites": {
    "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png",
    "back_female": null,
    "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/6.png",
    "back_shiny_female": null,
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    "front_female": null,
    "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png",
    "front_shiny_female": null,
    "other": {
      "dream_world": {
        "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg",
        "front_female": null
      },
    ...
    }
  }
...
}
```

Depending on whether it's my pokemon or the enemy pokemon, I want to display the back_default or front_default, respectively.

From the same GET request, I'll also have access to that pokemon's types:

```

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
```

I will then need to make a GET request to one or both of my pokemon's types.
Ex:

GET https://pokeapi.co/api/v2/type/fire/

```
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
```

I can use the this type effectiveness information to determine who will be the winner of the pokemon battle.

I've only implemented a type comparison of pokemon, treating all else equal. For the purposes of this project, I believe that is sufficient.
