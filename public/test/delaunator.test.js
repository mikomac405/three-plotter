import { expect } from "chai";
import * as THREE from "three";
import { calculatePoints } from "../modules/delaunator.js";

describe("Delaunator tests:", function () {
  describe("Calculating points test:", function () {
    it("Calculates points for min: -0.5 and max: 0.5", function () {
      let points = calculatePoints(
        { min: -0.5, max: 0.5 },
        { min: -0.5, max: 0.5 }
      );
      let testPoints = [
        new THREE.Vector3(-0.5, 0.7071067811865476, -0.5),
        new THREE.Vector3(-0.5, 0.7071067811865476, 0.5),
        new THREE.Vector3(0.5, 0.7071067811865476, -0.5),
        new THREE.Vector3(0.5, 0.7071067811865476, 0.5),
      ];

      expect(points).to.deep.equal(testPoints);
    });
  });
});
