import * as THREE from 'three';
import Delaunator from 'delaunator/index';
import { DoubleSide } from 'three';

function renderSinFunFromPoint(){
    var size = { x: 5, y: 5 };
    var pointsCount = 3;
    var points3d = [];

    for (let x = -3; x < pointsCount; x+=0.1){
        for (let z = -3; z < pointsCount; z+=0.1){
            let y = x*x+(z/2);
            points3d.push(new THREE.Vector3(x,y,z));
        }
    }

    for(let i = 0; i < points3d.length; i++){
        console.log(`Point ${i} -> x: ${points3d[i].x} | y: ${points3d[i].y} | z: ${points3d[i].z}`)
    }

    let mat = new THREE.PointsMaterial({ color: 0x99ccff, size: 2 })
    mat.side = 2
    var geom = new THREE.BufferGeometry().setFromPoints(points3d);
    var cloud = new THREE.Points(
    geom,
    
    );

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
    new THREE.MeshLambertMaterial({ color: "purple", wireframe: false })
    );
    mesh.material.flatShading = false
    mesh.material.side = DoubleSide

    return cloud, mesh;
}

export { renderSinFunFromPoint };