import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import {Face3, Geometry} from "three/examples/jsm/deprecated/Geometry";

let group, camera, scene, renderer;

init();
animate();

function init() {

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // camera

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 15, 20, 30 );
    scene.add( camera );

    // controls

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    // ambient light

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    // point light

    const light = new THREE.PointLight( 0xffffff, 1 );
    camera.add( light );

    // helper

    scene.add( new THREE.AxesHelper( 20 ) );

    // textures

    group = new THREE.Group();
    scene.add( group );

    console.log(group.position.z)

    let geo = new Geometry();
    geo.vertices.push(
        new THREE.Vector3(0,1,0),
        new THREE.Vector3(0,1,1),
        new THREE.Vector3(1,2,0),
        new THREE.Vector3(1,2,1),
        new THREE.Vector3(2,2,0),
        new THREE.Vector3(2,2,1),
    )
    geo.faces.push(new Face3(0,1,2));

    scene.add(geo)



    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    group.rotation.y += 0.005;

    render();

}

function render() {

    renderer.render( scene, camera );

}
