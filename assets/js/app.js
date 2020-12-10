// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // Set up our chart
    var svgWidth = 800;
    var svgHeight = 700;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Create an SVG wrapper,
    // append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("../assets/data/data.csv").then(function(healthData) {
        // console log data
        console.log(healthData);

        // parse data
        healthData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });
    
        // Create scales
        var xScale = d3.scaleLinear()
            .domain([8, d3.max(healthData, d => +d.poverty)])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([4, d3.max(healthData, d => +d.healthcare)])
            .range([height, 0]);

        // Create bottom, left and right axis
        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // Append the axes to the chartGroup
        // Add bottomAxis
        chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
        // Add leftAxis to the left side of the display
        chartGroup.append("g").call(leftAxis);

        // Data points
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", (d,i) => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "15")
            .attr("fill", "blue")
            .classed("stateCircle", true)

        // State abbreviations
        chartGroup.selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", (d,i) => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .classed("stateText", true)
            .text(d => d.abbr)
            .on("mouseover", function(d) {
                toolTip.show(d);
            })
            .on("mouseout", function(d) {
                toolTip.hide(d);
            });

        // x labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .classed("aText", true)
            .attr("data-axis-name", "healthcare")
            .text("Lacks Healthcare(%)");

        // y labels
        chartGroup.append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
            .attr("data-axis-name", "poverty")
            .classed("aText", true)
            .text("In Poverty (%)");

        // Step 1: Append tooltip div
        var toolTip = d3.tip()
            .attr("class", "tooltip")   
            .html(function(d) {
                return (`${d.abbr}<br>Healthcare (%): ${d.healthcare}%<br>Poverty (%): ${d.poverty}`);
            })

        // Integrate ToolTip into chart
        chartGroup.call(toolTip);

        // Event listener for display and hide of ToolTip
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
            .on("mouseout", function(d){
                toolTip.hide(d, this);
            });
            
    }).catch(function(error) {
      console.log(error);
    });
}
  
// When the browser loads, makeResponsive() is called.
makeResponsive();
  
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
  