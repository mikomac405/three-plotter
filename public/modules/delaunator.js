import Delaunator from "delaunator/index.js";
import * as THREE from "three";
import Formula from "fparser";
import { plot3D } from "../classes/plot3D.js";
import { colorWheel } from "../client.js";

let sphere = false;

function calculatePoints(func, x_range, y_range, z_range, precision) {
  let points = [];
  if(func.includes("x") && func.includes("y") && func.includes("z")){
    sphere = true;
    let str = func;
    str = str.trim();
    const myArr = str.split("+");
    if(myArr.length == 3){
      const poper = myArr.pop();
      const temp = poper.split("=");
      myArr.push(temp[0]);
      myArr.push(temp[1]);

      const x_0 = parseFloat(myArr[0].substring(3).replace("(","").replace(")","").replace(")^2","").trim());
      const y_0 = parseFloat(myArr[1].substring(3).replace("(","").replace(")","").replace(")^2","").trim());
      const z_0 = parseFloat(myArr[2].substring(3).replace("(","").replace(")","").replace(")^2","").trim());  

      const r = Math.sqrt(parseFloat(myArr[3]));

      console.log(x_0, y_0, z_0, r);
      for(let phi = 0; phi < 2*Math.PI; phi += 0.01)
      {
        for(let theta = 0; theta <= Math.PI; theta += 0.01){
          const x = x_0 + r * Math.sin(theta) * Math.cos(phi);
          const y = y_0 + r * Math.sin(theta) * Math.sin(phi);
          const z = z_0 + r * Math.cos(theta);
          if(
            (
              (x >= x_range.min && x <= x_range.max) &&
              (y >= y_range.min && y <= y_range.max) &&
              (z >= z_range.min && z <= z_range.max)
            ) 
            ){
              points.push(new THREE.Vector3(x,y,z));
            }
        }
      }
    }
    else{
      console.log("can't parse");
      return;
    }
  }
  else{
    try{
      const fObj = new Formula(func);
      for (let x = x_range.min; x <= x_range.max; x += precision) {
        for (let z = z_range.min; z <= z_range.max; z += precision) {
            let y = fObj.evaluate({ x: x, z: z });
            if (y >= y_range.min && y <= y_range.max) {
              points.push(new THREE.Vector3(x, y, z));
          }
        }
      }
    }
    catch(error){
      console.log(error)
    }
  }
  return points;
}

function renderFunctionMesh(
  func,
  x_range,
  y_range,
  z_range,
  precision,
  scene,
  id
) {

  let points3d = calculatePoints(func, x_range, y_range, z_range, precision);

  if(points3d.length <= 0){
    console.log("empty plot")
    return; // If array is empty - stop
  }

  let geom = new THREE.BufferGeometry().setFromPoints(points3d);

  // triangulate x, z
  let indexDelaunay = Delaunator.from(
    points3d.map((v) => {
      return [v.x, v.z];
    })
  );
  let meshIndex = []; // delaunay index => three.js index
  for (let i = 0; i < indexDelaunay.triangles.length; i++) {
    meshIndex.push(indexDelaunay.triangles[i]);
  }

  geom.setIndex(meshIndex); // add three.js index to the existing geometry
  geom.computeBoundingSphere();
  geom.computeVertexNormals();

  var mesh = new THREE.Mesh(
    geom, // re-use the existing geometry
    //new THREE.MeshPhongMaterial({ color: color, wireframe: false })
    new THREE.MeshPhongMaterial({ color: colorWheel.color.hexString, wireframe: false })
  );

  mesh.material.flatShading = false;
  mesh.material.side = THREE.DoubleSide;

  
  let plt = new plot3D(func, mesh, id);

  console.log(plt);

  scene.add(plt.mesh);

  sphere = false;
  return plt;
}

export { calculatePoints, renderFunctionMesh };
