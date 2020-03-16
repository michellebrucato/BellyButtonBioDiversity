// create metadata panel 
function buildMetadata(sample) {
  
  d3.json(`/metadata/${sample}`).then((data) =>{

      let panel = d3.select("#sample-metadata");
      panel.html("")
      Object.entries(data).forEach(([key,value])=>{
        panel.append("p").text(`${key}:${value}`)
      })
  })
}

// create Plotly visualizations 
function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then((data)=>{

    const otu_ids = data.otu_ids
    const otu_labels = data.otu_labels
    const sample_values = data.sample_values
    
    // pie chart  
    let pieData = [
      {
        values: sample_values.sort((a,b)=> b-a).slice(0,10),
        labels: otu_ids,
        hovertext: otu_labels,
        type: "pie",
        hoverinfo: "hovertext"
      }
    ]
    let pieLayout = {
      margin: {t: 0, l: 0}
    };
    Plotly.plot("pie",pieData, pieLayout)
  })

  // bubble chart  
  let bubbleLayout = {
    margin: {t: 15},
    xaxis: {title: "OTU ID"}
  }
 
  let bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
    }
  }]
  Plotly.plot("bubble", bubbleData, bubbleLayout);
}

// initialize dashboard 
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

init();