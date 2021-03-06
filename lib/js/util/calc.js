const Calc = {
  distance(pos1, pos2) {
    let power1 = Math.pow(pos1[0] - pos2[0], 2);
    let power2 = Math.pow(pos1[1] - pos2[1], 2);
    return Math.sqrt(power1 + power2);
  },

  framesToTarget(lvl) {
    let frames = (1500 - 50 * lvl) / (Calc.rand(80, 120) / 100);
    if (frames < 15) frames = 15;
    return frames;
  },

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  atanXY(x, y) {
    let angle = Math.atan2(y, x);

    if (angle < 0) {
      angle = Math.PI * 2 + angle;
    }

    return angle;
  }
};

module.exports = Calc;
