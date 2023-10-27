class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    //Generic Shadow
    this.shadow = new Image();

    if (this.useShadow) {
      this.shadow.src = '/images/characters/shadow.png';
    }
    this.shadow.onload = () => {
      this.isLoaded = true;
    };

    //configure animation and initial state
    this.animations = config.animations || {
      idleDown: [[0, 0]],
      walkDown: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
    };
    this.currentAnimation = config.currentAnimation || 'idleDown';
    this.currentAnimationFrame = 0;

    //Reference the game Object
    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    //If !isLoaded character wont appear
    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
    this.isLoaded && ctx.drawImage(this.image, 0, 0, 32, 32, x, y, 32, 32);
  }
}
