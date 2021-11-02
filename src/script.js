import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import math from "dat.gui/src/dat/color/math";
import {Group} from "three";

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Group
scene.add( new THREE.AxesHelper( 20 ) );
const group = new THREE.Group();
scene.add(group)


// Parametric function

let xMin = -5, yMin = -5
let xMax = 5, yMax = 5
let xRange = xMax-xMin, yRange = yMax-yMin;
console.log(xRange + " " + yRange);
console.log(xMin + " " + yMin);

let paraFunction = function (x, y, target){
    x = xRange * x + xMin;
    y = yRange * y + yMin;
    let z = 2*x + (y*y);
    target.set(x,y,z);
}

let paraGeometry = new THREE.ParametricGeometry(paraFunction, 1000,1000);
let paraMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
let paraMesh = new THREE.Mesh(paraGeometry, paraMaterial);
paraMesh.position.set(0,0,0);
scene.add(paraMesh);


// Convex geometry


// Lights

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 10

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // paraMesh.rotation.x = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()