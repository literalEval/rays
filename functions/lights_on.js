function lightsOn(walls) {
  background("#ffffffaa");

  strokeWeight(10);
  stroke("#000");

  walls.forEach((wall, index) => {
    line(wall[0][0], wall[0][1], wall[1][0], wall[1][1]);
  });
}
