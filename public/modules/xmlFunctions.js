let jsonExportTemplate = {
    "data": {
      "plot3D": [],
      "plot2D": []
    },
  }

function AddPlotsToJsonTemplate(listOfPlots3D, listOfPlots2D){
    for(let plot of listOfPlots3D){
        jsonExportTemplate["data"]["plot3D"].push({
            "formula": plot.func_string,
            "mesh": `${plot.mesh.material.color.r}, ${plot.mesh.material.color.g}, ${plot.mesh.material.color.b}`,
            "id": plot.id
        })
    }
    for(let plot of listOfPlots2D){
        jsonExportTemplate["data"]["plot2D"].push({
            "formula": plot.func_string,
            "color": plot.color,
            "id": plot.id
        })
    }
    console.log(jsonExportTemplate)
    
}


export { AddPlotsToJsonTemplate }