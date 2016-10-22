module.exports = {};

module.exports.pointZUnderPlane = function(planeDef, pointX, pointY){
  // var planeDef = [
  //   {x: 0, y: 0, z: 0},// mark center (A)
  //   {x: 1, y: 0, z: 1},// right edge (roll) (B)
  //   {x: 0, y: 1, z: 1},// front (pitch) (C)
  // ] // 3 points define a plane
  // var pointX = 0.9; // X coordinate we're solving for.
  // var pointY = 0.9; // Y coordinate we're solving for.
  var one = planeDef[0];
  var two = planeDef[1];
  var three = planeDef[2];
  var a1 = one.x;
  var b1 = one.y;
  var c1 = one.z;
  var a2 = two.x;
  var b2 = two.y;
  var c2 = two.z;
  var a3 = three.x;
  var b3 = three.y;
  var c3 = three.z;
  // First, construct two vectors determined by these three points:
  var v1 = [a1-a2, b1-b2, c1-c2];
  var v2 = [a1-a3, b1-b3, c1-c3];
  // then cross compute product of the vectors
  var ax = v1[0];
  var ay = v1[1];
  var az = v1[2];
  var bx = v2[0];
  var by = v2[1];
  var bz = v2[2];
  var cross = [(ay*bz - az*by), (az*bx - ax*bz), ((ax*by) - (ay*bx))]
  var r = cross[0];
  var s = cross[1];
  var t = cross[2];
  // ok, given our plane:
  // rx+sy+tz=k
  // find K for plane
  var k = r*a1 + s*b1 + t*c1;
  var x = pointX;
  var y = pointY;
  // Finally, given the x and y coordinate of a point, you can find the value of z by solving:
  var z = (1/t)*(r*a1 + s*b1 + t*c1 - r*x - s*y);
  return {
    x: x,
    y: y,
    z: z
  }
}