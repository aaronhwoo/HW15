function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  var metadataURL = "/metadata/" + sample;

  
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  var metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    metadataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // d3.json(metadataURL).then(function (data) {
    //   Object.entries(data).forEach(([key, value]) => {
    //     panelMetadata.append("h6").text(`${key}: ${value}`
    //     );
    //   });
    // }  

    d3.json(metadataURL).then(function(response){
      Object.enteries(response).forEach(([key, value]) => {
        panelMetadata.append("h6").text(`${key}:${value}`);
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
 var buildChartsURL = "/samples/" + sample;

 d3.json(buildChartsURL).then(function(response) {
   console.log(response);

   // @TODO: Build a Bubble Chart using the sample data
   // Use otu_ids for x values
   // Use sample_values for y values
   // Use sample_values for the marker size
   // Use otu_ids for marker colors
   // Use otu_labels for the text values


   var bubbletrace = {
     x: response.otu_ids,
     y: response.sample_values,
     mode: "markers",
     marker:{
       color: response.otu_ids,
       size: response.sample_values,
     }
   }

   var bubbletrace1 = [bubbletrace];
   var layout = {
     title: 'Marker Size',
     showlegend: false,
     height: 600,
     width: 1500,
   };

  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  // Use sample_values as the values for the PIE Chart
  // Use out_ids as the lables for the pie chart
  // Use out_labels as the hovertext for the chart


   Plotly.newplot('bubble', bubbletrace1, layout);

   var data = [{
     values: response.sample_values.slice(0, 10),
     labels: response.otu_ids.slice(0, 10),
     hovertext: response.otu_labels.slice(0, 10),
     type: 'pie',
   }];

   var layout = {
     showlegend: true,
   };

   Plotly.newplot('pie', data, layout);
   });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
