class OverworldMap {
  constructor(config) {
    this.overword = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutSceneSpaces = config.cutSceneSpaces || {};
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraFocus) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraFocus.x, utils.withGrid(6) - cameraFocus.y);
  }

  drawUpperImage(ctx, cameraFocus) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraFocus.x, utils.withGrid(6) - cameraFocus.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let obj = this.gameObjects[key];
      obj.id = key;

      obj.mount(this);
    });
  }

  //Play cutscene
  async startCutscene(events) {
    this.isCutscenePlaying = true;
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to their default behavior
    Object.values(this.gameObjects).forEach((object) => object.doBehaviorEvent(this));
  }

  // If hero steps on square with action, this will fire
  checkForFootstepCutscene() {
    const hero = this.gameObjects['hero'];
    const match = this.cutSceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  // Try to interact woth other objects
  checkForActionCutscene() {
    const hero = this.gameObjects['hero'];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '/images/maps/DemoLower.png',
    upperSrc: '/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npc1: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: '/images/characters/people/npc1.png',
        behaviorLoop: [
          { type: 'walk', direction: 'left' },
          { type: 'walk', direction: 'up' },
          { type: 'stand', direction: 'down', time: 800 },
          { type: 'walk', direction: 'right' },
          { type: 'walk', direction: 'down' },
        ],
        talking: [
          {
            events: [{ type: 'textMessage', text: 'Hello there!', faceHero: 'npc1' }],
          },
        ],
      }),

      npc2: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: '/images/characters/people/npc1.png',
      }),
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
    cutSceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: 'npc2', type: 'walk', direction: 'left' },
            { who: 'npc2', type: 'stand', direction: 'up', time: 500 },
            { type: 'textMessage', text: 'Get the fuck out of here!' },
            { who: 'npc2', type: 'walk', direction: 'right' },
            { who: 'npc2', type: 'stand', direction: 'down', time: 500 },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
          ],
        },
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          events: [{ type: 'changeMap', map: 'Kitchen' }],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: '/images/maps/KitchenLower.png',
    upperSrc: '/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: '/images/characters/people/npc3.png',
        talking: [
          {
            events: [{ type: 'textMessage', text: 'You made it!', faceHero: 'npcB' }],
          },
        ],
      }),
    },
  },
};
