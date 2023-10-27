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

      // Draw lower layer
      this.map.drawLowerImage(this.ctx);
      //Draw Objects in between
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionsInput.direction,
        });
        object.sprite.draw(this.ctx);
      });
      //Draw upper layer
      this.map.drawUpperImage(this.ctx);

      requestAnimationFrame(() => {
        frame();
      });
    };
    frame();
  }

  start() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.DirectionsInput = new this.DirectionsInput();
    this.DirectionsInput().start();
    this.DirectionsInput.direction; // return "up", "down" ...
    this.startGameLoop();
  }
}
