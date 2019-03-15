function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var metadata = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
  metadata.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url).then(function(response) {
    console.log(response);
  });
  //create individual lists out of response JSON
  otu_ids_l = response.otu_ids;
  otu_labels_l = response.otu_labels;
  sample_values_l = response.sample_values;
  //combine into json object with linked values
  var combined_sample = [];
  for (var j = 0; j < otu_ids_l.length; j++)
    combined_sample.push({"otu_ids": otu_ids_l[j], "otu_labels": otu_labels_l[j], "sample_values": sample_values_l[j]});
  //sort list by sample values

  combined_sample.sort(function(a,b) {
      return ((a.sample_values < b.sample_values) ? -1 : ((a.sample_values == b.sample_values) ? 0:1));
  });
  // seperate lists again
  for (var k = 0; k < combined_sample.length; k++) {
    otu_ids_l[k] = combined_sample[k].otu_ids;
    otu_labels_l[k] = combined_sample[k].otu_labels;
    sample_values_l[k] = combined_sample[k].otu_labels;
  };


    // @TODO: Build a Bubble Chart using the sample data
  var bubbletrace1 = {
    x: otu_ids_l,
    y: sample_values_l,
    mode: "markers",
    marker: {
      size: sample_values_l
    }
  };
  var data = [bubble_trace1];
  var layout = {
    title: 'Marker Size',
    showlegend: false,
    height: 600,
    width: 600
  };
  Plotly.newPlot('bubble', data, layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}
  var otu_ids_s = otu_ids_l.slice(10);
  var otu_labels_s = otu_labels_l.slice(10);
  var sample_values_s = sample_values_l.slice(10);
  var data2 = [{
    values: sample_values_s,
    labels: otu_labels_s,
    type: "pie"
  }]
  var layout2 = {
    height: 400,
    width: 500
  };
  Plotly.newPlot('pie', data2, layout2);

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
