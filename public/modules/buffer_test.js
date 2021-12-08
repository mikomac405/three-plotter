import * as THREE from 'three';

function renderMeshFromPoints(){
    // setFromPoints example
    const fromPointsMaterial = new THREE.MeshNormalMaterial();
    let fromPointGeometry = new THREE.BufferGeometry();
    const points = [
        new THREE.Vector3(-1, 1, -1),//c
        new THREE.Vector3(-1, -1, 1),//b
        new THREE.Vector3(1, 1, 1),//a   

        new THREE.Vector3(1, 1, 1),//a    
        new THREE.Vector3(1, -1, -1),//d  
        new THREE.Vector3(-1, 1, -1),//c

        new THREE.Vector3(-1, -1, 1),//b
        new THREE.Vector3(1, -1, -1),//d  
        new THREE.Vector3(1, 1, 1),//a

        new THREE.Vector3(-1, 1, -1),//c
        new THREE.Vector3(1, -1, -1),//d    
        new THREE.Vector3(-1, -1, 1),//b
    ]


    fromPointGeometry.setFromPoints(points); 
    fromPointGeometry.computeVertexNormals();

    const fromPointsMesh = new THREE.Mesh(fromPointGeometry, fromPointsMaterial);
    fromPointsMesh.position.set(0,2,0);

    return fromPointsMesh;
}

export { renderMeshFromPoints };