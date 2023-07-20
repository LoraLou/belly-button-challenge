
console.log("Test")
// create variable to store samples.json 
const sample_data = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(sample_data).then(function(data) {
    //console.log("this is sample data")
    //console.log(data);
});
// build a function called "buildChart"
function buildChart(sample) {
    console.log("testing buildChart function");
    d3.json(sample_data).then(function(data) {
        console.log("this is sample data")
        console.log(data);
        //to build barchart, need the samples object
        let samples = data.samples
        console.log(samples);
        // filter samples for 940
        let sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        console.log(sampleArray);
        //unpack the object from within the array
        let sampleResults = sampleArray[0];
        console.log(sampleResults);
        // create variables
        let sample_values = sampleResults.sample_values;
        console.log(sample_values);
        let otu_ids = sampleResults.otu_ids;
        console.log(otu_ids);
        let otu_labels = sampleResults.otu_labels;
        console.log(otu_labels);
        // build a bubblechart
        let traceBubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorsacale: 'Y1GnBu'
            }
        }
        let dataBubble = [traceBubble];
        let layoutBubble = {
            title: "Bacteria in sample",
            showlegend: false,
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
            hovermode: "closest",
        }
        Plotly.newPlot('bubble', dataBubble, layoutBubble);
        let dataBar = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OUT ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: "h"
        }];
        let layoutBar = {
            title: "Top 10 Bacteria in the Sample",
        }
        // create plot
        Plotly.newPlot('bar', dataBar, layoutBar);
    });
};

function buildMetadata(sample) {
    d3.json(sample_data).then(function (data) {
        let metadata = data.metadata;
        console.log(metadata);
        let metadataArray = metadata.filter(metadataObject => metadataObject.id == sample);
        console.log(metadataArray);
        // unpack the object using indexing 
        let metadataResult = metadataArray[0]
        console.log(metadataResult);
        let metadataPanel = d3.select("#sample-metadata");
        // wipe clean the metadata panel using html
        metadataPanel.html("");
        //append to the panel
        for (key in metadataResult) {
            metadataPanel.append("h5").text(`${key.toUpperCase()}: ${metadataResult[key]}`);
        };
    });
}
function optionChanged(newSample) {
    buildChart(newSample);
    buildMetadata(newSample);
};
// create an initial function called initialize
function initialize() {
    d3.json(sample_data).then(function (data) {
        let sampleNames = data.names;
        console.log(sampleNames);
        //populate the pull-down menu
        let pulldownSelect = d3.select("#selDataset");
        for (let index = 0; index < sampleNames.length; index++) {
            pulldownSelect 
                .append("option")
                .text(sampleNames[index])
                .property("value", sampleNames[index])
        };
        let firstSample = sampleNames[0];
        buildChart(firstSample);
        buildMetadata(firstSample);
    });
};
initialize();
