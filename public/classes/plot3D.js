import * as THREE from "three";
import { Vector3 } from "three";
import { Color } from "three";
import { renderFunctionMesh } from "../modules/delaunator.js"
import { scene3D } from "../client.js"

class plot3D {
  constructor(func_string, x_range, y_range, z_range, precision) {
    this.func_string = func_string;
    this.x_range = x_range;
    this.y_range = y_range;
    this.z_range = z_range;
    this.precision = precision;
    this.mesh = renderFunctionMesh(func_string, x_range, y_range, z_range, precision)
    this.id = (Math.random() + 1).toString(36).substring(7);
    scene3D.add(this.mesh)
  }

  rerenderMesh(){
    scene3D.remove(this.mesh);
    this.mesh = renderFunctionMesh(this.func_string,this.x_range, this.y_range, this.z_range, this.precision, scene3D);
    scene3D.add(this.mesh);
  }

  set color(color) {
    this.mesh.material.color = new Color(color);
    scene3D.remove(this.mesh);
    scene3D.add(this.mesh);
  }

  set x(new_range){
    this.x_range = new_range;
    this.rerenderMesh();
  }

  set y(new_range){
    this.y_range = new_range;
    this.rerenderMesh();
  }

  set z(new_range){
    this.z_range = new_range;
    this.rerenderMesh();
  }

  set pointsDensity(new_precision){
    this.precision = new_precision;
    this.rerenderMesh();
  }
}

export { plot3D };
