class Overworld {
  constructor(config) {
    //Element for the game to operate on - Game container
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');

    //EndScreen
    this.gameEndScreen = document.querySelector('#game-end');
    this.gameItens = document.querySelector('.all-elements');
    //Draw on Canvas
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
    //Clock
    this.hoursAndMinutes = ``;
    this.hours = 8;
    this.minutes = 0;
    this.clockIsRunning = true;

    setInterval(() => {
      if (this.clockIsRunning) {
        this.clock();
      }
    }, 1000 / 15);

    //Check Game Over
    this.liElements = document.getElementsByTagName('li');
    this.gameWinner = false;
  }

  clock() {
    const leadingZero = (n) => (n > 9 ? n : `0${n}`);
    this.minutes++;
    if (this.minutes === 60) {
      this.minutes = 0;
      this.hours++;
      if (this.hours >= 24) {
        this.gameItens.style.display = 'none';
        this.gameEndScreen.style.display = 'block';
      }
    }

    this.hoursAndMinutes = `${leadingZero(this.hours)}:${leadingZero(this.minutes)}`;

    return (document.querySelector('#clock').innerHTML = this.hoursAndMinutes);
  }

  startGameLoop() {
    const frame = () => {
      //Clear off Canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera focus
      const cameraFocus = this.map.gameObjects.hero;

      //Update animation before drawing, to prevent glitches
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw lower layer
      this.map.drawLowerImage(this.ctx, cameraFocus);

      //Draw gameObjects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraFocus);
        });

      //Draw upper layer
      this.map.drawUpperImage(this.ctx, cameraFocus);

      this.isGameOver();

      requestAnimationFrame(() => {
        frame();
      });
    };

    frame();
  }

  bindActionInput() {
    new KeyPressListener('Space', () => {
      // Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e) => {
      if (e.detail.whoId === 'hero') {
        //Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  start() {
    this.startMap(window.OverworldMaps.Home);
    this.bindActionInput();
    this.bindHeroPositionCheck();
    this.directionInput = new DirectionInput();
    this.directionInput.start();

    this.startGameLoop();

    // PLAY CUTSCENE
    this.map.startCutscene([
      { type: 'textMessage', text: 'It is one fine day on the life of Procrastinators...' },
      // { who: 'hero', type: 'walk', direction: 'right' },
      // { who: 'hero', type: 'walk', direction: 'right' },
      // { who: 'hero', type: 'walk', direction: 'right' },
      // { who: 'hero', type: 'walk', direction: 'down' },
      { who: 'hero', type: 'walk', direction: 'down' },
      { who: 'hero', type: 'stand', direction: 'down', time: 800 },
      // { type: 'textMessage', text: 'It is one fine day on the life of Procrastinators...' },
    ]);
  }

  isGameOver() {
    for (let i = 0; i < this.liElements.length; i++) {
      if (this.liElements[i].classList.contains('addCheck')) {
        this.gameWinner = true;
      } else {
        this.gameWinner = false;
        return;
      }
    }
    if (this.gameWinner) {
      this.gameItens.style.display = 'none';
      this.gameEndScreen.style.display = 'block';
    }
  }
}
