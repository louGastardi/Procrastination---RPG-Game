class Overworld {
  constructor(config) {
    //Element for the game to operate on - Game container
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    //Draw on Canvas
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
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
      //Draw game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.sprite.draw(this.ctx, cameraFocus);
      });
      //Draw upper layer
      this.map.drawUpperImage(this.ctx, cameraFocus);

      requestAnimationFrame(() => {
        frame();
      });
    };
    frame();
  }

  start() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();
    this.directionInput = new DirectionInput();
    this.directionInput.start();

    this.startGameLoop();
  }
}
