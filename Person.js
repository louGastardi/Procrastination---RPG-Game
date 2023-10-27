class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemainning = 0;

    this.directionUpdate = {
      up: ['y', -1],
      down: ['y', 1],
      left: ['x', -1],
      right: ['x', 1],
    };
  }

  update(state) {
    this.updatePosition();

    if (this.movingProgressRemainning === 0 && state.arrow) {
      this.direction = state.arrow;
      this.movingProgressRemainning = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemainning > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemainning -= 1;
    }
  }
}
