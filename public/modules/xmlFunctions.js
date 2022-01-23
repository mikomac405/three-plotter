import { saveAs } from "file-saver"

function uploadXmlConfiguration(file){
    let rd = new FileReader();
    rd.readAsText(file)
    rd.onloadend = function(){
        const parser = new DOMParser();
        const xml = parser.parseFromString(rd.result, "text/xml")
        const plots3Dxml = xml.getElementsByTagName("plot3D")
        const plots2Dxml = xml.getElementsByTagName("plot2D")
        let plots3D = []
        let plots2D = []
        console.log(plots3Dxml)
        for(let el of plots3Dxml){
            let formula = el.getElementsByTagName("formula")[0].textContent
            let color = el.getElementsByTagName("color")[0].textContent
            let id = el.getElementsByTagName("id")[0].textContent
            // TODO: Finish uploading
            console.log(formula, color, id)
        }
    }
    
    alert('The file has been uploaded successfully.');
}


function saveXmlConfiguration(listOfPlots3D,listOfPlots2D){
    let data ='<?xml version="1.0" encoding="UTF-8"?>'+
    '<data>';

    for(let plot of listOfPlots3D){
        data += '<plot3D>';
        data += `<formula>${plot.func_string}</formula>`;
        data += `<color>${plot.mesh.material.color.r} ${plot.mesh.material.color.g} ${plot.mesh.material.color.b}</color>`;
        data += `<id>${plot.id}</id>`;
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