import { expect }  from "chai"
import * as THREE from "three"
//import { calculatePoint } from "../modules/logic2dPlot.js"
import Formula from 'fparser';

function calculatePoint(func,x_range,precision){
    const fObj = new Formula(func)
    let point = [];
    for (let x = x_range.min; x <= x_range.max; x+=precision){
        let y = fObj.evaluate({x:x});
        point.push(new THREE.Vector3(x,y));
    }
    return point
}

describe("Logic2dPlot tests:", function() {
    describe("Calculating points test:", function() {
      it("Calculates points for min: -5 and max: 5", function() {
        let point =calculatePoint("sqrt(x^2+1)",{ min: -5, max: 5 },1)
        let testPoint = [
            new THREE.Vector3(-5, 5.0990195135927845),
            new THREE.Vector3(-4, 4.123105625617661),
            new THREE.Vector3(-3, 3.1622776601683795),
            new THREE.Vector3(-2, 2.23606797749979),
            new THREE.Vector3(-1, 1.4142135623730951),
            new THREE.Vector3(0, 1.0),
            new THREE.Vector3(1, 1.4142135623730951),
            new THREE.Vector3(2, 2.23606797749979),
            new THREE.Vector3(3, 3.1622776601683795),
            new THREE.Vector3(4, 4.123105625617661),
            new THREE.Vector3(5, 5.0990195135927845)
        ]

        expect(point).to.deep.equal(testPoint)
      });
    });
  });