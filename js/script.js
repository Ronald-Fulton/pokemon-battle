
// state
var gameState = {
  userPokemon: '',
  rivalPokemon: '',
  pokemonDB: [
    {
      name: 'charmander',
      type: 'fire',
      hp: 39,
      attack: 52,
      defense: 43,
      level: 1,
      img: 'http://www.smogon.com/dex/media/sprites/xy/charmander.gif'
    },
    {
      name: 'bulbasaur',
      type: 'grass',
      hp: 45,
      attack: 49,
      defense: 49,
      level: 1,
      img: 'http://www.smogon.com/dex/media/sprites/xy/bulbasaur.gif'
    },
    {
      name: 'squirtle',
      type: 'water',
      hp: 44,
      attack: 48,
      defense: 65,
      level: 1,
      img: 'http://www.smogon.com/dex/media/sprites/xy/squirtle.gif'
    },
  ],
  elements: {
    pokemonsEl: document.querySelector('.select-screen').querySelectorAll('.character'),
    battleScreenEl: document.getElementById('battle-screen'),
    attackBtnsEl: document.getElementById('battle-screen').querySelectorAll('.attack'),
    winnerScreen: document.getElementById('winner-screen'),
    backgroundMusic: document.getElementById('background-music'),
    fightSound: document.getElementById('fight-sound'),
    hitSound: document.getElementById('hit-sound'),
    winSound: document.getElementById('win-sound'),
    tryAgain: document.querySelector('.try-again')
  },
  init: function () {
    // elements

    console.log(gameState.elements.attackBtnsEl)

    // This is the inital loop
    var i = 0
    while (i < gameState.elements.pokemonsEl.length) {
      // add function to all characters on screen select
      gameState.elements.pokemonsEl[i].onclick = function () {
        // current selected pokemon name
        var pokemonName = this.dataset.pokemon

        // elements for images on battle screen
        var player1mg = document.querySelector('.player1').getElementsByTagName('img')
        var player2mg = document.querySelector('.player2').getElementsByTagName('img')

        // save the current pokemon
        gameState.userPokemon = pokemonName


        // cpu picks a pokemon
        gameState.cpuPick()
        // change screen to battle scene
        gameState.elements.battleScreenEl.classList.toggle('active')

        // Activates winner screen
        gameState.elements.winnerScreen.classList.toggle('active')

        gameState.elements.tryAgain.style.visibility="hidden";


        // select data from current user pokemon
        gameState.currentPokemon = gameState.pokemonDB.filter(function (pokemon) {
          return pokemon.name == gameState.userPokemon
        })
        player1mg[0].src = gameState.currentPokemon[0].img

        // select data from current cpu pokemon
        gameState.currentRivalPokemon = gameState.pokemonDB.filter(function (pokemon) {
          return pokemon.name == gameState.rivalPokemon
        })

        player2mg[0].src = gameState.currentRivalPokemon[0].img


        // current user and cpu pokemon inital health
        gameState.currentPokemon[0].health = gameState.calculateInitalHealth(gameState.currentPokemon)
        gameState.currentPokemon[0].originalHealth = gameState.calculateInitalHealth(gameState.currentPokemon)
        gameState.currentRivalPokemon[0].health = gameState.calculateInitalHealth(gameState.currentRivalPokemon)
        gameState.currentRivalPokemon[0].originalHealth = gameState.calculateInitalHealth(gameState.currentRivalPokemon)


        console.log(gameState)
        gameState.elements.fightSound.play()




      }
      i++
    }

    var a = 0
    while (a < gameState.elements.attackBtnsEl.length) {
      gameState.elements.attackBtnsEl[a].onclick = function () {
        var attackName = this.dataset.attack
        gameState.currentUserAttack = attackName

        gameState.play(attackName, gameState.cpuAttack())
      }
      a++
    }
  },
  cpuAttack: function () {
    var attacks = ['rock', 'paper', 'scissors']

    return attacks[gameState.randomNumber(0, 3)]
  },
  calculateInitalHealth: function (user) {
    return (((0.20 * Math.sqrt(user[0].level)) * user[0].defense) * user[0].hp)
  },

  attackMove: function (attack, level, stack, critical, enemy, attacker) {
    console.log(enemy.name + ' before: ' + enemy.health)
    var attackAmount = ((attack * level) * (stack + critical))
    enemy.health = enemy.health - attackAmount

    var userHP = document.querySelector('.player1').querySelector('.stats').querySelector('.health').querySelector('.health-bar').querySelector('.inside')

    var cpuHP = document.querySelector('.player2').querySelector('.stats').querySelector('.health').querySelector('.health-bar').querySelector('.inside')
    // console.log(userHP)
    if(enemy.owner == 'user') {
      setTimeout(() => {
      var minusPercent = ((enemy.health * 100) / enemy.originalHealth)
      console.log(userHP)
      userHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'
      gameState.elements.hitSound.play()
      }, 2000);
    } else {
      var minusPercent = ((enemy.health * 100) / enemy.originalHealth)
      console.log(cpuHP)
      cpuHP.style.width = ((minusPercent < 0) ? 0 : minusPercent) + '%'
      gameState.elements.hitSound.play()
    }
    gameState.checkWinner(enemy, attacker)
    console.log(enemy.name + ' after: ' + enemy.health)
  },
  checkWinner: function (enemy, attacker) {
    if (enemy.health <= 0) {
      console.log('And the winner is ' + attacker.name)
      document.getElementById("img").src=attacker.img;
      setTimeout(() => {
        gameState.elements.backgroundMusic.pause()
      }, 3000);
      setTimeout(() => {
        gameState.elements.winnerScreen.classList.toggle('test')
        gameState.elements.winSound.play()

      }, 5000);
      setTimeout(() => {
        gameState.elements.tryAgain.style.visibility="visible";
      }, 9000);
    }
  },



  randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  cpuPick: function () {
    do {
      gameState.rivalPokemon = gameState.elements.pokemonsEl[gameState.randomNumber(0, 3)].dataset.pokemon
      console.log('looping ' + gameState.rivalPokemon)
    }
    while (gameState.userPokemon == gameState.rivalPokemon)

  },
  play: function (userAttack, cpuAttack) {
    var currentPokemon = gameState.currentPokemon[0]
    var currentRivalPokemon = gameState.currentRivalPokemon[0]
    currentPokemon.owner = 'user'
    currentRivalPokemon.owner = 'cpu'
    switch (userAttack) {
      case 'rock':
        if (cpuAttack == 'paper') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
            }
          }

        }
        if (cpuAttack == 'scissors') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if (cpuAttack == 'rock') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
            }
          }
        }

        break;
      case 'paper':
        if (cpuAttack == 'paper') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
            }
          }
        }

        if (cpuAttack == 'scissors') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if (cpuAttack == 'rock') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
            }
          }
        }
        break;
      case 'scissors':
        if (cpuAttack == 'paper') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 2, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, .5, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if (cpuAttack == 'scissors') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, 1, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 1, currentPokemon, currentRivalPokemon)
            }
          }
        }
        if (cpuAttack == 'rock') {
          if (currentPokemon.health >= 1 && currentRivalPokemon.health >= 1) {
            // user
            gameState.attackMove(currentPokemon.attack, currentPokemon.level, .8, .5, currentRivalPokemon, currentPokemon)

            if (currentRivalPokemon.health >= 1) {
              // cpu
              gameState.attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, .8, 2, currentPokemon, currentRivalPokemon)
            }
          }
        }
        break;
    }
  }
}

gameState.init()

// Changes volume of music
gameState.elements.backgroundMusic.volume = "0.1";
gameState.elements.fightSound.volume = "0.4"
gameState.elements.hitSound.volume = "0.3"
gameState.elements.winSound.volume = "0.4"


// gameState.elements.hitSound.play()




// window.onload = function() {
//     gameState.elements.backgroundMusic.play();
// }
//
// window.onload














// // pokemon
// // create data for 3 different pokemons, with their names, type, weaknesses, health, and attack moves(name, attack stat, maximum)



//   var attack = 20;
//   var level = 10;
//   var stack = 1.3;
//   var defense = 39;

//   // create a formula for attacks
//   console.log((attack * level ) * stack / 7)



//   // create a formula for health
//   //HP = 0.20 x Sqrt(Pokemon_level) x (HP_base_stat)
//   console.log(((0.20 * Math.sqrt(level)) * defense) * 15)




//   // let user choose 1 and then assign a random pokemon to battle thats not the users pokemon
//   // p1 vs p2




//   // when one user loses all his health declare a winner
