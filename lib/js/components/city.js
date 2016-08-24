class City {
  constructor(x, y) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.towers = [
      {
        begin: [this.x - 35, this.y - 40],
        width: 20,
        height: 40
      },
      {
        begin: [this.x - 14, this.y - 60],
        width: 28,
        height: 60
      },
      {
        begin: [this.x + 15, this.y - 50],
        width: 22,
        height: 50
      }
    ];
  }

  render(ctx) {
    ctx.fillStyle = 'violet';

    this.towers.forEach( tower => {
      ctx.fillRect(
        tower.begin[0],
        tower.begin[1],
        tower.width,
        tower.height
      );
    });
  }
}


module.exports = City;
