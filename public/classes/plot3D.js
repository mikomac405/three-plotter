import * as THREE from 'three'
import { Vector3 } from 'three';
import { Color } from 'three';

class plot3D{
    constructor(func_string, mesh, id){
        this.func_string = func_string;
        this.mesh = mesh;
        this.id = id;
    }

    set color(color){
        this.mesh.material.color = new Color(color.r, color.g, color.b);
    }

    set scale(num){
        this.mesh.geometry.scale(num, num, num);
    }
}

export { plot3D }