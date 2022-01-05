import Delaunator from "delaunator/index.js";
import * as THREE from "three"

function calculatePoints(size_x, size_z){
    let points = [];
    for (let x = size_x.min; x <= size_x.max; x+=1){
        for (let z = size_z.min; z <= size_z.max; z+=1){
            let y = Math.sqrt((x*x) + (z*z))
            points.push(new THREE.Vector3(x,y,z));
        }
    }
    console.log(points)
    return points
}

function renderSinFunFromPoint(){
    let num = 0.5
    let size_x = { min: -num, max: num}
    let size_z = { min: -num, max: num}
    let points3d = calculatePoints(size_x, size_z)
    

    for(let i = 0; i < points3d.length; i++){
        console.log(`Point ${i} -> x: ${points3d[i].x} | y: ${points3d[i].y} | z: ${points3d[i].z}`)
    }

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
        new THREE.MeshLambertMaterial({ color: "purple", wireframe: false })
    );
    mesh.material.flatShading = false
    mesh.material.side = THREE.DoubleSide

    return mesh;
}

export { calculatePoints, renderSinFunFromPoint };