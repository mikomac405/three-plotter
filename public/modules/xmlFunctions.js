import { saveAs } from "file-saver"
import { Color } from "three"
import { plot3D } from "../classes/plot3D.js"
import { plot2D } from "../classes/plot2D.js"
import { plots3D, generateList, scene, scene2D } from "../client.js"
import { plots2D, DrawAfterXmlUpload } from "../modules/logic2dPlot.js"

function uploadXmlConfiguration(file){
    let rd = new FileReader();
    rd.readAsText(file)
    rd.onloadend = function(){
        const parser = new DOMParser();
        const xml = parser.parseFromString(rd.result, "text/xml")
        const plots3Dxml = xml.getElementsByTagName("plot3D")
        const plots2Dxml = xml.getElementsByTagName("plot2D")
        let plots = []
        //let plots2D = []
        console.log(plots3Dxml)
        for(let el of plots3Dxml){
            let formula = el.getElementsByTagName("formula")[0].textContent
            let rgb = el.getElementsByTagName("color")[0].textContent.split(" ")
            let color = new Color(rgb[0],rgb[1],rgb[2]);
            let x_range = { min : parseFloat(el.getElementsByTagName("x_range")[0].childNodes[0].textContent), max : parseFloat(el.getElementsByTagName("x_range")[0].childNodes[1].textContent) }
            let y_range = { min : parseFloat(el.getElementsByTagName("y_range")[0].childNodes[0].textContent), max : parseFloat(el.getElementsByTagName("y_range")[0].childNodes[1].textContent) }
            let z_range = { min : parseFloat(el.getElementsByTagName("z_range")[0].childNodes[0].textContent), max : parseFloat(el.getElementsByTagName("z_range")[0].childNodes[1].textContent) }
            let precision = parseFloat(el.getElementsByTagName("precision")[0].textContent)
            // TODO: Finish uploading
            console.log(formula, color, x_range, y_range, z_range, precision)

            const plot = new plot3D(formula, x_range, y_range, z_range, precision)
            plot.color = color;
            plots3D.push(plot);
        }
        for(let el of plots2Dxml){
            let formula = el.getElementsByTagName("formula")[0].textContent
            let rgb = el.getElementsByTagName("color")[0].textContent.split(" ")
            let r = rgb[0].substring(4,rgb[0].length-1);
            let g = rgb[1].substring(0,rgb[1].length-1);
            let b = rgb[2].substring(0,rgb[2].length-1);
            let color = `rgb(${r}, ${g}, ${b})`;
            const plot = new plot2D(formula, color)
            plot.color = color;
            plots2D.push(plot);
        }
        generateList();
        if(scene == scene2D){
            DrawAfterXmlUpload()
        }
    }
}


function saveXmlConfiguration(listOfPlots3D,listOfPlots2D){
    let data ='<?xml version="1.0" encoding="UTF-8"?>'+
    '<data>';

    for(let plot of listOfPlots3D){
        data += '<plot3D>';
        data += `<formula>${plot.func_string}</formula>`;
        data += `<color>${plot.mesh.material.color.r} ${plot.mesh.material.color.g} ${plot.mesh.material.color.b}</color>`;
        data += `<x_range><min>${plot.x_range.min}</min><max>${plot.x_range.max}</max></x_range>`;
        data += `<y_range><min>${plot.y_range.min}</min><max>${plot.y_range.max}</max></y_range>`;
        data += `<z_range><min>${plot.z_range.min}</min><max>${plot.z_range.max}</max></z_range>`;
        data += `<precision>${plot.precision}</precision>`
        data += '</plot3D>';
    }

    for(let plot of listOfPlots2D){
        data += '<plot2D>';
        data += `<formula>${plot.func_string}</formula>`;
        data += `<color>${plot.color}</color>`;
        data += `<id>${plot.id}</id>`;
        data += '</plot2D>';
    }

    data += "</data>"

    const blob = new Blob([data], {type: 'text/xml;charset=utf-8;'});
    saveAs(blob, `config_${new Date().toJSON().slice(0,16).replace("T","_").replace(":","-")}.xml`);

    console.log(result);
}


export { saveXmlConfiguration, uploadXmlConfiguration }