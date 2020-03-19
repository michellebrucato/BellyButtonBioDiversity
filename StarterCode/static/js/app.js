// create metadata panel 
function buildMetadata(sample) {
  d3.json("/metadata/" + sample).then(data => {

    var metadata = d3.select("#sample-metadata");

    metadata.html("");

    Object.entries(data).forEach(([key, value]) => {
      metadata.append("panel").html(key + " : " + value + "<br>");
    });
  });
}

// create Plotly visualizations 
function buildCharts(sample) {

  d3.json("/samples/" + sample).then(data => {

    // Plotly bubble chart
    var bubbleData = [
      {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: "markers",
        marker: {
          color: data.otu_ids,
          size: data.sample_values,
          colorscale: "viridis"
        }
      }
    ];

    var bubbleLayout = {
      title: "Samples per OTU ID",
      showlegend: false,
      height: 600,
      width: 1200,
      title: "Samples per OTU ID",
      xaxis: {
        tittle: {
          text: "OTU ID"
        }
      },
      yaxis: {
        title: {
          text: "Sample Count"
        }
      }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // Plotly Pie Chart

    var pieValues = data.sample_values.slice(0, 10);
    var pieLabels = data.otu_ids.slice(0, 10);
    var pieHvrTxt = data.otu_labels.slice(0, 10);

    var pieData = [
      {
        values: pieValues,
        labels: pieLabels,
        hovertext: pieHvrTxt,
        type: "pie"
      }
    ];

    var pieLayout = {
      height: 400,
      width: 500,
      title: "Top 10 Samples"
    };

    Plotly.newPlot("pie", pieData, pieLayout);
  });
}

function init() {

  let selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  buildCharts(newSample);
  buildMetadata(newSample);
}

// initialize dashboard 
init();