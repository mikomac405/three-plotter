import { expect }  from "chai"
import * as THREE from "three"
//import { calculatePoints } from "../modules/delaunator.js"
import Formula from 'fparser';

function calculatePoints(func, x_range, y_range, z_range, precision){
  let points = [];
  const fObj = new Formula(func)
  for (let x = x_range.min; x <= x_range.max; x+=precision){
      for (let z = z_range.min; z <= z_range.max; z+=precision){
          let y = fObj.evaluate({x:x,z:z})
          if(y >= y_range.min && y <= y_range.max){
              points.push(new THREE.Vector3(x,y,z));
          }
      }
  }
  return points
}

describe("Delaunator tests:", function() {
  describe("Calculating points test:", function() {
    it("Calculates points for min: -5 and max: 5", function() {
      let points = calculatePoints("sqrt(x^2+z^2)",{ min: -5, max: 5 },{ min: 0, max: 10 }, { min: -5, max: 5 },1)
      let testPoints = [
        new THREE.Vector3(-5, 7.0710678118654755, -5),
        new THREE.Vector3(-5, 6.4031242374328485, -4),
        new THREE.Vector3(-5, 5.830951894845301, -3),
        new THREE.Vector3(-5, 5.385164807134504, -2),
        new THREE.Vector3(-5, 5.0990195135927845, -1),
        new THREE.Vector3(-5, 5, 0),
        new THREE.Vector3(-5, 5.0990195135927845, 1),
        new THREE.Vector3(-5, 5.385164807134504, 2),
        new THREE.Vector3(-5, 5.830951894845301, 3),
        new THREE.Vector3(-5, 6.4031242374328485, 4),
        new THREE.Vector3(-5, 7.0710678118654755, 5),
        new THREE.Vector3(-4, 6.4031242374328485, -5),
        new THREE.Vector3(-4, 5.656854249492381, -4),
        new THREE.Vector3(-4, 5, -3),
        new THREE.Vector3(-4, 4.47213595499958, -2),
        new THREE.Vector3(-4, 4.123105625617661, -1),
        new THREE.Vector3(-4, 4, 0),
        new THREE.Vector3(-4, 4.123105625617661, 1),
        new THREE.Vector3(-4, 4.47213595499958, 2),
        new THREE.Vector3(-4, 5, 3),
        new THREE.Vector3(-4, 5.656854249492381, 4),
        new THREE.Vector3(-4, 6.4031242374328485, 5),
        new THREE.Vector3(-3, 5.830951894845301, -5),
        new THREE.Vector3(-3, 5, -4),
        new THREE.Vector3(-3, 4.242640687119285, -3),
        new THREE.Vector3(-3, 3.605551275463989, -2),
        new THREE.Vector3(-3, 3.1622776601683795, -1),
        new THREE.Vector3(-3, 3, 0),
        new THREE.Vector3(-3, 3.1622776601683795, 1),
        new THREE.Vector3(-3, 3.605551275463989, 2),
        new THREE.Vector3(-3, 4.242640687119285, 3),
        new THREE.Vector3(-3, 5, 4),
        new THREE.Vector3(-3, 5.830951894845301, 5),
        new THREE.Vector3(-2, 5.385164807134504, -5),
        new THREE.Vector3(-2, 4.47213595499958, -4),
        new THREE.Vector3(-2, 3.605551275463989, -3),
        new THREE.Vector3(-2, 2.8284271247461903, -2),
        new THREE.Vector3(-2, 2.23606797749979, -1),
        new THREE.Vector3(-2, 2, 0),
        new THREE.Vector3(-2, 2.23606797749979, 1),
        new THREE.Vector3(-2, 2.8284271247461903, 2),
        new THREE.Vector3(-2, 3.605551275463989, 3),
        new THREE.Vector3(-2, 4.47213595499958, 4),
        new THREE.Vector3(-2, 5.385164807134504, 5),
        new THREE.Vector3(-1, 5.0990195135927845, -5),
        new THREE.Vector3(-1, 4.123105625617661, -4),
        new THREE.Vector3(-1, 3.1622776601683795, -3),
        new THREE.Vector3(-1, 2.23606797749979, -2),
        new THREE.Vector3(-1, 1.4142135623730951, -1),
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(-1, 1.4142135623730951, 1),
        new THREE.Vector3(-1, 2.23606797749979, 2),
        new THREE.Vector3(-1, 3.1622776601683795, 3),
        new THREE.Vector3(-1, 4.123105625617661, 4),
        new THREE.Vector3(-1, 5.0990195135927845, 5),
        new THREE.Vector3(0, 5, -5),
        new THREE.Vector3(0, 4, -4),
        new THREE.Vector3(0, 3, -3),
        new THREE.Vector3(0, 2, -2),
        new THREE.Vector3(0, 1, -1),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 1),
        new THREE.Vector3(0, 2, 2),
        new THREE.Vector3(0, 3, 3),
        new THREE.Vector3(0, 4, 4),
        new THREE.Vector3(0, 5, 5),
        new THREE.Vector3(1, 5.0990195135927845, -5),
        new THREE.Vector3(1, 4.123105625617661, -4),
        new THREE.Vector3(1, 3.1622776601683795, -3),
        new THREE.Vector3(1, 2.23606797749979, -2),
        new THREE.Vector3(1, 1.4142135623730951, -1),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(1, 1.4142135623730951, 1),
        new THREE.Vector3(1, 2.23606797749979, 2),
        new THREE.Vector3(1, 3.1622776601683795, 3),
        new THREE.Vector3(1, 4.123105625617661, 4),
        new THREE.Vector3(1, 5.0990195135927845, 5),
        new THREE.Vector3(2, 5.385164807134504, -5),
        new THREE.Vector3(2, 4.47213595499958, -4),
        new THREE.Vector3(2, 3.605551275463989, -3),
        new THREE.Vector3(2, 2.8284271247461903, -2),
        new THREE.Vector3(2, 2.23606797749979, -1),
        new THREE.Vector3(2, 2, 0),
        new THREE.Vector3(2, 2.23606797749979, 1),
        new THREE.Vector3(2, 2.8284271247461903, 2),
        new THREE.Vector3(2, 3.605551275463989, 3),
        new THREE.Vector3(2, 4.47213595499958, 4),
        new THREE.Vector3(2, 5.385164807134504, 5),
        new THREE.Vector3(3, 5.830951894845301, -5),
        new THREE.Vector3(3, 5, -4),
        new THREE.Vector3(3, 4.242640687119285, -3),
        new THREE.Vector3(3, 3.605551275463989, -2),
        new THREE.Vector3(3, 3.1622776601683795, -1),
        new THREE.Vector3(3, 3, 0),
        new THREE.Vector3(3, 3.1622776601683795, 1),
        new THREE.Vector3(3, 3.605551275463989, 2),
        new THREE.Vector3(3, 4.242640687119285, 3),
        new THREE.Vector3(3, 5, 4),
        new THREE.Vector3(3, 5.830951894845301, 5),
        new THREE.Vector3(4, 6.4031242374328485, -5),
        new THREE.Vector3(4, 5.656854249492381, -4),
        new THREE.Vector3(4, 5, -3),
        new THREE.Vector3(4, 4.47213595499958, -2),
        new THREE.Vector3(4, 4.123105625617661, -1),
        new THREE.Vector3(4, 4, 0),
        new THREE.Vector3(4, 4.123105625617661, 1),
        new THREE.Vector3(4, 4.47213595499958, 2),
        new THREE.Vector3(4, 5, 3),
        new THREE.Vector3(4, 5.656854249492381, 4),
        new THREE.Vector3(4, 6.4031242374328485, 5),
        new THREE.Vector3(5, 7.0710678118654755, -5),
        new THREE.Vector3(5, 6.4031242374328485, -4),
        new THREE.Vector3(5, 5.830951894845301, -3),
        new THREE.Vector3(5, 5.385164807134504, -2),
        new THREE.Vector3(5, 5.0990195135927845, -1),
        new THREE.Vector3(5, 5, 0),
        new THREE.Vector3(5, 5.0990195135927845, 1),
        new THREE.Vector3(5, 5.385164807134504, 2),
        new THREE.Vector3(5, 5.830951894845301, 3),
        new THREE.Vector3(5, 6.4031242374328485, 4),
        new THREE.Vector3(5, 7.0710678118654755, 5)
      ]

      expect(points).to.deep.equal(testPoints)
    });
  });
});