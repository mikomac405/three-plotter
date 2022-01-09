import Delaunator from "delaunator/index.js";
import * as THREE from "three"
import Formula from 'fparser';
import { plot3D } from "../classes/plot3D.js"

function calculatePoints(func, x_range, y_range, z_range){
    let points = [];
    const fObj = new Formula(func)
    for (let x = x_range.min; x <= x_range.max; x+=0.01){
        for (let z = z_range.min; z <= z_range.max; z+=0.01){
            let y = fObj.evaluate({x:x,z:z})
            if(y >= y_range.min && y <= y_range.max){
                points.push(new THREE.Vector3(x,y,z));
            }
        }
    }
    return points
}

function renderFunctionMesh(func, x_range, y_range, z_range, scene){


    let points3d = calculatePoints(func, x_range, y_range, z_range)
    

    // for(let i = 0; i < points3d.length; i++){
    //     console.log(`Point ${i} -> x: ${points3d[i].x} | y: ${points3d[i].y} | z: ${points3d[i].z}`)
    // }

    let mat = new THREE.PointsMaterial({ color: 0x99ccff, size: 2 })
    mat.side = 2
    var geom = new THREE.BufferGeometry().setFromPoints(points3d);

    // triangulate x, z
    var indexDelaunay = Delaunator.from(
    points3d.map(v => {
        return [v.x, v.z];
    })
    );

    var meshIndex = []; // delaunay index => three.js index
    for (let i = 0; i < indexDelaunay.triangles.length; i++){
        meshIndex.push(indexDelaunay.triangles[i]);
    }

    geom.setIndex(meshIndex); // add three.js index to the existing geometry
    geom.computeVertexNormals();
    var mesh = new THREE.Mesh(
        geom, // re-use the existing geometry
        new THREE.MeshPhongMaterial({ color: "purple", wireframe: false })
        //new THREE.MeshLambertMaterial({ color: "purple", wireframe: false })
    );
    mesh.material.flatShading = false
    mesh.material.side = THREE.DoubleSide

    let plt = new plot3D(func, mesh)

    console.log(plt)

    scene.add(plt.mesh)

    return plt;
}

export { calculatePoints, renderFunctionMesh };