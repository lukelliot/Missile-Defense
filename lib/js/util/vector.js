const Vector = {
  distance(pos1, pos2) {
    let power1 = Math.pow(pos1[0] - pos2[0], 2);
    let power2 = Math.pow(pos1[1] - pos2[1], 2);
    return Math.sqrt(power1 + power2);
  },

  magnitude(vector) {
    return Util.distance([0, 0], vector);
  },

  scale(vector, mag) {
    return [vector[0] * mag, vector[1] * mag];
  },
  
  direction(vector) {
    let mag = Util.magnitude(vector);
    return Util.scale(vector, 1 / mag);
  }
};

module.exports = Vector;
