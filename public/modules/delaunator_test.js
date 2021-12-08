import * as THREE from 'three';
import Delaunator from 'delaunator/index';

function renderSinFunFromPoint(){
    var size = { x: 5, y: 5 };
    var pointsCount = 500;
    var points3d = [];
    for (let i = 0; i < pointsCount; i++) {
        let x = THREE.Math.randFloatSpread(size.x);
        let z = THREE.Math.randFloatSpread(size.y);
        let y = THREE.Math.randFloatSpread(x / size.x * 5, z / size.y * 5);
        points3d.push(new THREE.Vector3(x, y, z));
    }

    var geom = new THREE.BufferGeometry().setFromPoints(points3d);
    var cloud = new THREE.Points(
    geom,
    new THREE.PointsMaterial({ color: 0x99ccff, size: 2 })
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
    return cloud, mesh;
}

export { renderSinFunFromPoint };