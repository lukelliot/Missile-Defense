class Turret {
  constructor() {
    this.x = 400;
    this.y = 520;
    this.missilesRemaining = 15;
    this.hitPoints = 3;
    this.active = true;
  }
}

module.exports = Turret;