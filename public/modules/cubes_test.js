import * as THREE from 'three';




function makeDefaultMesh(geometry, color, x) {
  const defaultMeshMaterial = new THREE.MeshPhongMaterial({color});

  const defaultMesh = new THREE.Mesh(geometry, defaultMeshMaterial);

  defaultMesh.position.x = x;
  defaultMesh.position.y = -2;
  return defaultMesh;
}


function renderCubes(){
    // Rendering cubes
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cube_1 = makeDefaultMesh(boxGeometry, 0x44aa88,  0);
    const cube_2 = makeDefaultMesh(boxGeometry, 0x8844aa, -2);
    const cube_3 = makeDefaultMesh(boxGeometry, 0xaa8844,  2);
    const cubes = [
        cube_1,
        cube_2,
        cube_3
    ];

    return cubes;
}

export { renderCubes }