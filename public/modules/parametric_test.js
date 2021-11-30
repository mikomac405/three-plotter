import * as THREE from 'three';
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";


function renderParametricMesh(){
    // Rendering parametric geometry
    let xMin = -0.5, yMin = -0.5;
    let xMax = 0.5, yMax = 0.5;
    let xRange = xMax-xMin, yRange = yMax-yMin;

    let parametricFunction = function (x, y, target){
        x = xRange * x + xMin;
        y = yRange * y + yMin;
        // TODO: Create or find parser
        let z = 2*x + (y*y);
        target.set(x,y,z);
    }

    let parametricGeometry = new ParametricGeometry(parametricFunction, 100,100);
    let parametricMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
    let parametricMesh = new THREE.Mesh(parametricGeometry, parametricMaterial);
    parametricMesh.position.set(0,0,0);
    // Debug
    // console.log(parametricMesh);
    return parametricMesh;
}

export { renderParametricMesh };