const Calc = {
  distance(pos1, pos2) {
    let power1 = Math.pow(pos1[0] - pos2[0], 2);
    let power2 = Math.pow(pos1[1] - pos2[1], 2);
    return Math.sqrt(power1 + power2);
  },

  magnitude(vector) {
    return Calc.distance([0, 0], vector);
  },

  scale(vector, mag) {
    return [vector[0] * mag, vector[1] * mag];
  },

  direction(vector) {
    let mag = Calc.magnitude(vector);
    return Calc.scale(vector, 1 / mag);
  },

  framesToTarget(lvl) {
    let frames = (600 - 10 * lvl) / (Calc.rand(80, 120) / 100);
    if (frames < 20) frames = 20;
    return frames;
  },

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

module.exports = Calc;
