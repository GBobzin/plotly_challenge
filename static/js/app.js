

//Failed first attempt, starting by gathering all data in the beginning.
//Tried this approach, dind't work
//unpack inofrmation from DATA file
//**
//function unpack(rows, index) {
//    return rows.map(function(row) {
//     return row[index];
//    });
//  }

//Variable to reach data file 
//var dataPath =  d3.json("samples.json");






function dropdown(){
    var subjectSel = d3.select("#selDataset")
    d3.json("samples.json").then((data) => {
        
        var dataNames = data.names
        dataNames.forEach((sample) => {
        subjectSel.append("option").text(sample).property("value",sample)    
        })
        var initialData = dataNames[0]; 
        buildCharts(initialData);
        buildMetadata(initialData); 
    });
}




function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadataValues = data.metadata;
        // apply filter to metadata that will be shown in panel
        var metadataResults = metadataValues.filter(sample0bj => sample0bj.id == sample);
        var itemResult = metadataResults [0];
        var displayPanel = d3.select("#sample-metadata");

        // clear metadata
        displayPanel.html("");
        // assign values to each item 
        Object.entries(itemResult).forEach(([key,value]) => {
            displayPanel.append("h6").text(`${key.toUpperCase()}: ${value}`); 
        });
    });
}



function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sample0bj => sample0bj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels; 
        var sample_values = result.sample_values; 

        // create the bubble chart
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t:0 },
            hovermode: "closest", 
            xaxis: {title: "OTU ID#"},
            margin: { t:30}
        };
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values, 
                text: otu_labels, 
                mode: "markers", 
                marker: {
                    size: sample_values, 
                    color: otu_ids,
                    colorscale: "Electric"
                }
            }
        ];
        
        Plotly.newPlot("bubble",bubbleData,bubbleLayout);

        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(); 
        var barData = [ 
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t:45, l:190}
        };

        Plotly.newPlot("bar", barData, barLayout);       
    });
}



function init() {
      dropdown();
}
   //function to refresh the charts and panel when a new item is selected
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Run the dasboard
init();

