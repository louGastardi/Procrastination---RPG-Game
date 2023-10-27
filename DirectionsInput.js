class DirectionsInput {
  constructor() {
    //RESPONSENESS OF KEYDOWN
    this.heldDirections = [];
    this.map = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  start() {
    document.addEventListener('keydown', (event) => {
      const direction = this.map[event.code];

      //RESPONSENESS OF KEYDOWN
      if (direction && this.heldDirections.indexOf(direction) === -1) {
        this.heldDirections.unshift(dir);
      }
    });

    document.addEventListener('keyup', (event) => {
      const direction = this.map[event.code];
      const index = tthis.heldDirections.indexOf(direction);

      //RESPONSENESS OF KEYUP
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}
